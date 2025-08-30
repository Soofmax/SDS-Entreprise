import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth/nextauth';
import { prisma } from '@/lib/db/prisma';
import { ContactStatus, ProjectStatus } from '@prisma/client';

// GET /api/admin/dashboard - Données du dashboard admin
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || (session.user.role !== 'ADMIN' && session.user.role !== 'EDITOR')) {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const period = searchParams.get('period') || '30d';

    // Calculer les dates
    const now = new Date();
    const periodDays = {
      '7d': 7,
      '30d': 30,
      '90d': 90,
      '1y': 365,
    };
    const days = periodDays[period as keyof typeof periodDays] || 30;
    const startDate = new Date(now.getTime() - days * 24 * 60 * 60 * 1000);

    // Statistiques des contacts
    const contactStats = await prisma.contact.groupBy({
      by: ['status'],
      _count: { id: true },
      where: {
        createdAt: { gte: startDate },
      },
    });

    const totalContacts = await prisma.contact.count({
      where: { createdAt: { gte: startDate } },
    });

    // Statistiques des projets
    const projectStats = await prisma.project.groupBy({
      by: ['status'],
      _count: { id: true },
      _sum: { budget: true },
      where: {
        createdAt: { gte: startDate },
      },
    });

    const totalProjects = await prisma.project.count({
      where: { createdAt: { gte: startDate } },
    });

    // Revenus
    const completedProjects = await prisma.project.findMany({
      where: {
        status: ProjectStatus.DELIVERED,
        deliveryDate: { gte: startDate },
      },
      select: { budget: true },
    });

    const totalRevenue = completedProjects.reduce((sum, project) => sum + project.budget, 0);

    // Projets en cours avec progression
    const activeProjects = await prisma.project.findMany({
      where: {
        status: {
          in: [ProjectStatus.PLANNING, ProjectStatus.IN_PROGRESS, ProjectStatus.REVIEW],
        },
      },
      include: {
        contact: {
          select: {
            name: true,
            company: true,
          },
        },
        tasks: {
          select: {
            status: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
      take: 10,
    });

    // Contacts récents
    const recentContacts = await prisma.contact.findMany({
      where: {
        createdAt: { gte: startDate },
      },
      orderBy: { createdAt: 'desc' },
      take: 10,
    });

    // Analytics - événements récents
    const analyticsEvents = await prisma.analytics.count({
      where: {
        createdAt: { gte: startDate },
      },
    });

    const uniqueVisitors = await prisma.analytics.findMany({
      where: {
        createdAt: { gte: startDate },
        event: 'page_view',
      },
      select: { sessionId: true },
      distinct: ['sessionId'],
    });

    // Conversion rate (contacts -> projets)
    const contactsWon = contactStats.find(s => s.status === ContactStatus.WON)?._count.id || 0;
    const conversionRate = totalContacts > 0 ? (contactsWon / totalContacts) * 100 : 0;

    // Évolution temporelle (par semaine)
    const weeklyData = [];
    for (let i = Math.floor(days / 7); i >= 0; i--) {
      const weekStart = new Date(now.getTime() - i * 7 * 24 * 60 * 60 * 1000);
      const weekEnd = new Date(weekStart.getTime() + 7 * 24 * 60 * 60 * 1000);

      const weekContacts = await prisma.contact.count({
        where: {
          createdAt: { gte: weekStart, lt: weekEnd },
        },
      });

      const weekProjects = await prisma.project.count({
        where: {
          createdAt: { gte: weekStart, lt: weekEnd },
        },
      });

      weeklyData.push({
        week: weekStart.toISOString().split('T')[0],
        contacts: weekContacts,
        projects: weekProjects,
      });
    }

    // Tâches en retard
    const overdueTasks = await prisma.projectTask.count({
      where: {
        status: { not: 'DONE' },
        project: {
          endDate: { lt: now },
          status: { not: ProjectStatus.DELIVERED },
        },
      },
    });

    const response = {
      period,
      summary: {
        totalContacts,
        totalProjects,
        totalRevenue,
        conversionRate: Math.round(conversionRate * 100) / 100,
        analyticsEvents,
        uniqueVisitors: uniqueVisitors.length,
        overdueTasks,
      },
      contactStats: contactStats.reduce((acc, stat) => {
        acc[stat.status] = Number(stat._count.id);
        return acc;
      }, {} as Record<string, number>),
      projectStats: {
        byStatus: projectStats.reduce((acc, stat) => {
          acc[stat.status] = {
            count: Number(stat._count.id),
            revenue: Number(stat._sum.budget || 0),
          };
          return acc;
        }, {} as Record<string, { count: number; revenue: number }>),
      },
      activeProjects: activeProjects.map(project => ({
        id: project.id,
        title: project.title,
        status: project.status,
        progress: project.progress,
        client: project.contact.name,
        company: project.contact.company,
        budget: project.budget,
        tasksCompleted: project.tasks.filter(t => t.status === 'DONE').length,
        totalTasks: project.tasks.length,
        createdAt: project.createdAt,
      })),
      recentContacts: recentContacts.map(contact => ({
        id: contact.id,
        name: contact.name,
        email: contact.email,
        company: contact.company,
        projectType: contact.projectType,
        budget: contact.budget,
        status: contact.status,
        createdAt: contact.createdAt,
      })),
      timeline: weeklyData,
    };

    return NextResponse.json(response);

  } catch (error) {
    console.error('Erreur API dashboard admin:', error);
    return NextResponse.json(
      { error: 'Erreur serveur' },
      { status: 500 }
    );
  }
}

