import { NextRequest } from 'next/server';

// Interface pour les résultats du rate limiting
export interface RateLimitResult {
  success: boolean;
  limit: number;
  remaining: number;
  reset: number;
}

// Configuration par défaut
const DEFAULT_CONFIG = {
  windowMs: 15 * 60 * 1000,
  maxRequests: 10,
  skipSuccessfulRequests: false,
  skipFailedRequests: false,
};

// Store en mémoire
class MemoryStore {
  private store = new Map<string, { count: number; resetTime: number }>();

  get(key: string): { count: number; resetTime: number } | undefined {
    const data = this.store.get(key);
    if (data && data.resetTime < Date.now()) {
      this.store.delete(key);
      return undefined;
    }
    return data;
  }

  set(key: string, value: { count: number; resetTime: number }): void {
    this.store.set(key, value);
  }

  increment(key: string, windowMs: number): { count: number; resetTime: number } {
    const now = Date.now();
    const existing = this.get(key);
    if (existing) {
      existing.count++;
      this.set(key, existing);
      return existing;
    } else {
      const newData = { count: 1, resetTime: now + windowMs };
      this.set(key, newData);
      return newData;
    }
  }

  cleanup(): void {
    const now = Date.now();
    for (const [key, data] of this.store.entries()) {
      if (data.resetTime < now) this.store.delete(key);
    }
  }
}

const memoryStore = new MemoryStore();
setInterval(() => memoryStore.cleanup(), 5 * 60 * 1000);

// Upstash REST Store (optionnel en prod)
class UpstashStore {
  private baseUrl: string;
  private token: string;

  constructor(url: string, token: string) {
    this.baseUrl = url.replace(/\/+$/, '');
    this.token = token;
  }

  async increment(key: string, windowMs: number): Promise<{ count: number; resetTime: number }> {
    const expireSeconds = Math.ceil(windowMs / 1000);
    // Pipeline: INCR key ; EXPIRE key seconds NX
    const res = await fetch(`${this.baseUrl}/pipeline`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${this.token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify([
        ['INCR', key],
        ['EXPIRE', key, `${expireSeconds}`, 'NX'],
        ['PTTL', key],
      ]),
    });

    if (!res.ok) {
      // Fallback mémoire si Upstash indisponible
      return memoryStore.increment(key, windowMs);
    }
    const data = (await res.json()) as Array<{ result: number }>;
    const count = Number(data?.[0]?.result ?? 1);
    const pttl = Number(data?.[2]?.result ?? windowMs);
    const resetTime = Date.now() + (pttl > 0 ? pttl : windowMs);
    return { count, resetTime };
  }
}

const upstash =
  process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN
    ? new UpstashStore(process.env.UPSTASH_REDIS_REST_URL, process.env.UPSTASH_REDIS_REST_TOKEN)
    : null;

/**
 * Extraire l'identifiant unique du client
 */
function getClientId(request: NextRequest): string {
  const forwarded = request.headers.get('x-forwarded-for');
  const realIp = request.headers.get('x-real-ip');
  const ip = forwarded?.split(',')[0] || realIp || 'unknown';
  const userAgent = request.headers.get('user-agent') || '';
  return `${ip}:${userAgent.slice(0, 50)}`;
}

/**
 * Rate limiting principal
 */
export async function rateLimit(
  request: NextRequest,
  config: Partial<typeof DEFAULT_CONFIG> = {}
): Promise<RateLimitResult> {
  const { windowMs, maxRequests } = { ...DEFAULT_CONFIG, ...config };
  const clientId = getClientId(request);
  const key = `rate_limit:${clientId}`;
  const data = upstash
    ? await upstash.increment(key, windowMs)
    : memoryStore.increment(key, windowMs);

  const success = data.count <= maxRequests;
  const remaining = Math.max(0, maxRequests - data.count);

  return {
    success,
    limit: maxRequests,
    remaining,
    reset: Math.ceil(data.resetTime / 1000),
  };
}

/**
 * Rate limiting spécialisé pour les formulaires
 */
export async function rateLimitForm(request: NextRequest): Promise<RateLimitResult> {
  return rateLimit(request, {
    windowMs: 10 * 60 * 1000,
    maxRequests: 3,
  });
}

/**
 * Rate limiting pour les API de lecture
 */
export async function rateLimitRead(request: NextRequest): Promise<RateLimitResult> {
  return rateLimit(request, {
    windowMs: 60 * 1000,
    maxRequests: 60,
  });
}

/**
 * Rate limiting pour les calculs (France Num, etc.)
 */
export async function rateLimitCalculation(request: NextRequest): Promise<RateLimitResult> {
  return rateLimit(request, {
    windowMs: 5 * 60 * 1000,
    maxRequests: 20,
  });
}

/**
 * Middleware pour appliquer le rate limiting automatiquement
 */
export function withRateLimit(
  handler: (request: NextRequest) => Promise<Response>,
  config?: Partial<typeof DEFAULT_CONFIG>
) {
  return async (request: NextRequest): Promise<Response> => {
    const { success, limit, remaining, reset } = await rateLimit(request, config);

    if (!success) {
      return new Response(
        JSON.stringify({
          success: false,
          error: { code: 'RATE_LIMIT_EXCEEDED', message: 'Trop de requêtes. Veuillez réessayer plus tard.' },
        }),
        {
          status: 429,
          headers: {
            'Content-Type': 'application/json',
            'X-RateLimit-Limit': limit.toString(),
            'X-RateLimit-Remaining': remaining.toString(),
            'X-RateLimit-Reset': reset.toString(),
            'Retry-After': Math.ceil((reset * 1000 - Date.now()) / 1000).toString(),
          },
        }
      );
    }

    const response = await handler(request);
    response.headers.set('X-RateLimit-Limit', limit.toString());
    response.headers.set('X-RateLimit-Remaining', remaining.toString());
    response.headers.set('X-RateLimit-Reset', reset.toString());
    return response;
  };
}

/**
 * Rate limiting basé sur l'endpoint
 */
export class EndpointRateLimiter {
  private configs = new Map<string, Partial<typeof DEFAULT_CONFIG>>();

  setConfig(endpoint: string, config: Partial<typeof DEFAULT_CONFIG>): void {
    this.configs.set(endpoint, config);
  }

  async check(request: NextRequest, endpoint: string): Promise<RateLimitResult> {
    const config = this.configs.get(endpoint) || {};
    return rateLimit(request, config);
  }
}

export const endpointLimiter = new EndpointRateLimiter();

endpointLimiter.setConfig('/api/contact', { windowMs: 10 * 60 * 1000, maxRequests: 3 });
endpointLimiter.setConfig('/api/france-num/calculate', { windowMs: 5 * 60 * 1000, maxRequests: 20 });
endpointLimiter.setConfig('/api/portfolio', { windowMs: 60 * 1000, maxRequests: 60 });

/**
 * Utilitaire pour créer des clés de rate limiting personnalisées
 */
export function createRateLimitKey(
  request: NextRequest,
  prefix: string,
  additionalData?: string[]
): string {
  const clientId = getClientId(request);
  const parts = [prefix, clientId, ...(additionalData || [])];
  return parts.join(':');
}

/**
 * Rate limiting avec whitelist d'IPs
 */
export async function rateLimitWithWhitelist(
  request: NextRequest,
  whitelist: string[] = [],
  config?: Partial<typeof DEFAULT_CONFIG>
): Promise<RateLimitResult> {
  const forwarded = request.headers.get('x-forwarded-for');
  const realIp = request.headers.get('x-real-ip');
  const ip = forwarded?.split(',')[0] || realIp || 'unknown';

  if (whitelist.includes(ip)) {
    return { success: true, limit: Infinity, remaining: Infinity, reset: 0 };
    }
  return rateLimit(request, config);
}

