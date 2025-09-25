import type { PrismaClient, Prisma } from '@prisma/client';
import { prisma } from './prisma';

// Helper pour les connexions avec retry (Neon/Serverless-friendly)
export async function connectWithRetry<T>(
  operation: () => Promise<T>,
  maxRetries = 3,
  delay = 1000
): Promise<T> {
  let lastError: Error;
  
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      return await operation();
    } catch (error) {
      lastError = error as Error;
      if (attempt === maxRetries) {
        throw lastError;
      }
      await new Promise(resolve => setTimeout(resolve, delay * attempt));
    }
  }
  
  throw lastError!;
}

// Helper pour les transactions avec gestion d'erreur
export async function withTransaction<T>(
  operation: (tx: Prisma.TransactionClient) => Promise<T>
): Promise<T> {
  return connectWithRetry(async () => {
    return prisma.$transaction(async (tx) => {
      return operation(tx);
    });
  });
}

// Helper pour les requêtes avec cache (mémoire locale simple)
export async function withCache<T>(
  key: string,
  operation: () => Promise<T>,
  ttl = 300000 // 5 minutes par défaut
): Promise<T> {
  const cache = new Map<string, { data: T; expires: number }>();
  
  const cached = cache.get(key);
  if (cached && cached.expires > Date.now()) {
    return cached.data;
  }
  
  const data = await operation();
  cache.set(key, {
    data,
    expires: Date.now() + ttl
  });
  
  return data;
}

// Types pour les requêtes paginées
export interface PaginationOptions {
  page?: number;
  limit?: number;
  orderBy?: Record<string, 'asc' | 'desc'>;
}

export interface PaginatedResult<T> {
  data: T[];
  meta: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

// Helper pour la pagination
export async function paginate<T>(
  model: any,
  options: PaginationOptions = {},
  where?: any,
  include?: any
): Promise<PaginatedResult<T>> {
  const { page = 1, limit = 10, orderBy } = options;
  const skip = (page - 1) * limit;
  
  const [data, total] = await Promise.all([
    model.findMany({
      where,
      include,
      skip,
      take: limit,
      orderBy,
    }),
    model.count({ where }),
  ]);
  
  const totalPages = Math.ceil(total / limit);
  
  return {
    data,
    meta: {
      page,
      limit,
      total,
      totalPages,
      hasNext: page < totalPages,
      hasPrev: page > 1,
    },
  };
}

// Helper pour les recherches full-text
export function createSearchQuery(
  searchTerm: string,
  fields: string[]
): any {
  if (!searchTerm.trim()) return {};
  
  const terms = searchTerm.trim().split(/\s+/);
  
  return {
    OR: fields.flatMap(field => 
      terms.map(term => ({
        [field]: {
          contains: term,
          mode: 'insensitive' as const,
        },
      }))
    ),
  };
}

// Helper pour les soft deletes (si nécessaire)
export function withSoftDelete(where: any = {}) {
  return {
    ...where,
    deletedAt: null,
  };
}

// Helper pour les métriques de performance
export async function measureQuery<T>(
  name: string,
  operation: () => Promise<T>
): Promise<T> {
  const start = Date.now();
  
  try {
    const result = await operation();
    const duration = Date.now() - start;
    
    if (process.env.NODE_ENV === 'development') {
      console.log(`🔍 Query \"${name}\" took ${duration}ms`);
    }
    
    if (duration > 1000) {
      console.warn(`⚠️ Slow query detected: \"${name}\" took ${duration}ms`);
    }
    
    return result;
  } catch (error) {
    const duration = Date.now() - start;
    console.error(`❌ Query \"${name}\" failed after ${duration}ms:`, error);
    throw error;
  }
}

// Ré-export propre du client unique
export { prisma };
export default prisma;

