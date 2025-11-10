import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db/prisma';
import '@/lib/services/sentry';
import { logger } from '@/lib/utils/logger';

export async function GET() {
  try {
    await prisma.$queryRaw`SELECT 1`;
    logger.info({ service: 'health', status: 'healthy' });
    return NextResponse.json({
      status: 'healthy',
      timestamp: new Date().toISOString(),
      services: {
        database: 'connected',
        application: 'running'
      }
    });
  } catch (error) {
    logger.error({ service: 'health', error: (error as Error)?.message });
    return NextResponse.json({
      status: 'unhealthy',
      timestamp: new Date().toISOString(),
      services: {
        database: 'disconnected',
        application: 'running'
      },
      error: 'Database connection failed'
    }, { status: 503 });
  }
}