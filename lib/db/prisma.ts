import { PrismaClient, type Prisma } from '@prisma/client';

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma = globalForPrisma.prisma ?? new PrismaClient({
  log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
  errorFormat: 'pretty',
});

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;

// Helper pour fermer la connexion proprement
export async function disconnectPrisma() {
  await prisma.$disconnect();
}

// Helper pour les transactions (utilise TransactionClient)
export async function withTransaction<T>(
  fn: (tx: Prisma.TransactionClient) => Promise<T>
): Promise<T> {
  return prisma.$transaction(async (tx) => {
    return fn(tx);
  });
}

// Helper pour les requêtes avec retry
export async function withRetry<T>(
  fn: () => Promise<T>,
  maxRetries = 3,
  delay = 1000
): Promise<T> {
  let lastError: Error;
  
  for (let i = 0; i < maxRetries; i++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error as Error;
      
      if (i < maxRetries - 1) {
        await new Promise(resolve => setTimeout(resolve, delay * Math.pow(2, i)));
      }
    }
  }
  
  throw lastError!;
}

// Types utiles
export type PrismaTransactionClient = Prisma.TransactionClient;

export default prisma;

