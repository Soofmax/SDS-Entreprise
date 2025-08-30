import { PrismaClient } from '@prisma/client';

// Configuration optimisée pour Neon Database
const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma = globalForPrisma.prisma ?? 
  new PrismaClient({
    // Configuration optimisée pour Neon
    datasources: {
      db: {
        url: process.env.DATABASE_URL,
      },
    },
    
    // Logging en développement seulement
    log: process.env.NODE_ENV === 'development' 
      ? ['query', 'error', 'warn'] 
      : ['error'],
    
    // Configuration pour les connexions serverless
    transactionOptions: {
      maxWait: 5000, // 5 secondes max d'attente
      timeout: 10000, // 10 secondes timeout
    },
  });

// Éviter les multiples instances en développement
if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma;
}

// Gestion propre de la déconnexion
process.on('beforeExit', async () => {
  await prisma.$disconnect();
});

// Helper pour les connexions Neon avec retry
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
      
      // Si c'est la dernière tentative, on lance l'erreur
      if (attempt === maxRetries) {
        throw lastError;
      }
      
      // Attendre avant de réessayer
      await new Promise(resolve => setTimeout(resolve, delay * attempt));
    }
  }
  
  throw lastError!;
}

// Helper pour les transactions avec gestion d'erreur
export async function withTransaction<T>(
  operation: (tx: PrismaClient) => Promise<T>
): Promise<T> {
  return connectWithRetry(async () => {
    return prisma.$transaction(async (tx) => {
      return operation(tx);
    });
  });
}

// Helper pour les requêtes avec cache
export async function withCache<T>(
  key: string,
  operation: () => Promise<T>,
  ttl = 300000 // 5 minutes par défaut
): Promise<T> {
  // En production, on pourrait utiliser Redis ou un cache en mémoire
  // Pour l'instant, cache simple en mémoire
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
      console.log(`🔍 Query "${name}" took ${duration}ms`);
    }
    
    // En production, on pourrait envoyer ces métriques à un service de monitoring
    if (duration > 1000) {
      console.warn(`⚠️ Slow query detected: "${name}" took ${duration}ms`);
    }
    
    return result;
  } catch (error) {
    const duration = Date.now() - start;
    console.error(`❌ Query "${name}" failed after ${duration}ms:`, error);
    throw error;
  }
}

// Export du client par défaut
export default prisma;

