import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth/nextauth';
import { prisma } from '@/lib/db/prisma';

// GET /api/analytics - Récupérer les données analytics
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const timeRange = searchParams.get('range') || '7d';
    const event = searchParams.get('event');
    const page = searchParams.get('page');
    const isAdmin = searchParams.get('admin') === 'true';

    // Vérification admin pour les données détaillées
    if (isAdmin) {
      const session = await getServerSession(authOptions);
      if (!session || (session.user.role !== 'ADMIN' && session.user.role !== 'EDITOR')) {
        return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
      }
    }

    // Calculer la date de début selon la plage
    const now = new Date();
    const timeRanges = {
      '1h': 60 * 60 * 1000,
      '24h': 24 * 60 * 60 * 1000,
      '7d': 7 * 24 * 60 * 60 * 1000,
      '30d': 30 * 24 * 60 * 60 * 1000,
      '90d': 90 * 24 * 60 * 60 * 1000,
    };

    const startDate = new Date(now.getTime() - (timeRanges[timeRange as keyof typeof timeRanges] || timeRanges['7d']));

    // Construire les filtres
    const where = {
      createdAt: {
        gte: startDate,
      },
      ...(event && { event }),
      ...(page && { page }),
    };

    // Statistiques générales
    const totalEvents = await prisma.analytics.count({ where });
    const uniqueSessions = await prisma.analytics.findMany({
      where,
      select: { sessionId: true },
      distinct: ['sessionId'],
    });

    // Événements par type
    const eventsByType = await prisma.analytics.groupBy({
      by: ['event'],
      where,
      _count: {
        id: true,
      },
      orderBy: {
        _count: {
          id: 'desc',
        },
      },
    });

    // Pages les plus visitées
    const topPages = await prisma.analytics.groupBy({
      by: ['page'],
      where: {
        ...where,
        event: 'page_view',
      },
      _count: {
        id: true,
      },
      orderBy: {
        _count: {
          id: 'desc',
        },
      },
      take: 10,
    });

    // Timeline des événements (par heure ou par jour selon la plage)
    const bucketSize = timeRange === '1h' || timeRange === '24h' ? 'hour' : 'day';
    
    // Requête SQL brute pour grouper par période
    const timelineQuery = `
      SELECT 
        DATE_TRUNC('${bucketSize}', "createdAt") as period,
        COUNT(*) as count
      FROM "analytics" 
      WHERE "createdAt" >= $1
      ${event ? 'AND "event" = $2' : ''}
      GROUP BY period 
      ORDER BY period ASC
    `;

    const timelineParams = event ? [startDate, event] : [startDate];
    const timeline = await prisma.$queryRawUnsafe(timelineQuery, ...timelineParams) as Array<{
      period: Date;
      count: bigint;
    }>;

    // Données spécifiques admin
    let adminData = {};
    if (isAdmin) {
      // Utilisateurs actifs récents (récupération sans relation Prisma directe)
      const recentEvents = await prisma.analytics.findMany({
        where: {
          createdAt: {
            gte: new Date(now.getTime() - 60 * 60 * 1000), // Dernière heure
          },
          userId: { not: null },
        },
        select: {
          userId: true,
          page: true,
          createdAt: true,
        },
        orderBy: {
          createdAt: 'desc',
        },
        take: 10,
      });

      // Récupérer les informations des utilisateurs correspondants
      const userIds = Array.from(
        new Set(recentEvents.map(e => e.userId).filter((id): id is string => !!id))
      );

      const users = userIds.length
        ? await prisma.user.findMany({
            where: { id: { in: userIds } },
            select: { id: true, name: true, email: true },
          })
        : [];

      const userMap = new Map(users.map(u => [u.id, { name: u.name, email: u.email }]));

      // Sources de trafic (basé sur referrer)
      const trafficSources = await prisma.analytics.groupBy({
        by: ['properties'],
        where: {
          ...where,
          event: 'page_view',
        },
        _count: {
          id: true,
        },
        orderBy: {
          _count: {
            id: 'desc',
          },
        },
        take: 10,
      });

      adminData = {
        recentUsers: recentEvents.map(ev => ({
          user: ev.userId ? userMap.get(ev.userId) ?? null : null,
          page: ev.page,
          timestamp: ev.createdAt,
        })),
        trafficSources: trafficSources.map(source => {
          const properties = source.properties as any;
          const referrer = properties?.referrer || 'direct';
          return {
            source: referrer.includes('google') ? 'Google' : 
                   referrer.includes('facebook') ? 'Facebook' :
                   referrer.includes('linkedin') ? 'LinkedIn' :
                   referrer === 'direct' ? 'Accès direct' : 'Autre',
            count: Number(source._count.id),
          };
        }),
      };
    }

    const response = {
      summary: {
        totalEvents,
        uniqueSessions: uniqueSessions.length,
        timeRange,
        period: {
          start: startDate,
          end: now,
        },
      },
      eventsByType: eventsByType.map(item => ({
        event: item.event,
        count: Number(item._count.id),
      })),
      topPages: topPages.map(item => ({
        page: item.page,
        views: Number(item._count.id),
      })),
      timeline: timeline.map(item => ({
        period: item.period,
        count: Number(item.count),
      })),
      ...adminData,
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error('Erreur API analytics:', error);
    return NextResponse.json(
      { error: 'Erreur serveur' },
      { status: 500 }
    );
  }
}

// POST /api/analytics - Enregistrer un événement analytics
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      event,
      page,
      sessionId,
      userId,
      properties = {},
    } = body;

    // Validation des données requises
    if (!event || !page || !sessionId) {
      return NextResponse.json(
        { error: 'Données manquantes (event, page, sessionId requis)' },
        { status: 400 }
      );
    }

    // Récupérer les métadonnées de la requête
    const userAgent = request.headers.get('user-agent');
    const forwarded = request.headers.get('x-forwarded-for');
    const realIp = request.headers.get('x-real-ip');
    const ipAddress = forwarded?.split(',')[0] || realIp || 'unknown';

    // Créer l'événement analytics
    const analyticsEvent = await prisma.analytics.create({
      data: {
        event,
        page,
        sessionId,
        userId: userId || null,
        properties: {
          ...properties,
          userAgent,
          timestamp: new Date().toISOString(),
        },
        userAgent,
        ipAddress,
      },
    });

    return NextResponse.json({ success: true, id: analyticsEvent.id });
  } catch (error) {
    console.error('Erreur enregistrement analytics:', error);
    return NextResponse.json(
      { error: 'Erreur serveur' },
      { status: 500 }
    );
  }
}

// DELETE /api/analytics - Nettoyer les anciennes données (admin seulement)
export async function DELETE(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const days = parseInt(searchParams.get('days') || '90');

    const cutoffDate = new Date(Date.now() - days * 24 * 60 * 60 * 1000);

    const deleted = await prisma.analytics.deleteMany({
      where: {
        createdAt: {
          lt: cutoffDate,
        },
      },
    });

    return NextResponse.json({
      success: true,
      deletedCount: deleted.count,
      cutoffDate,
    });
  } catch (error) {
    console.error('Erreur nettoyage analytics:', error);
    return NextResponse.json(
      { error: 'Erreur serveur' },
      { status: 500 }
    );
  }
}

