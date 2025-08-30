import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth/nextauth';
import { prisma } from '@/lib/db/prisma';
import { ProjectType, ProjectStatus } from '@prisma/client';

// GET /api/projects - Récupérer tous les projets (publics ou admin)
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const isPublic = searchParams.get('public') === 'true';
    const status = searchParams.get('status') as ProjectStatus | null;
    const type = searchParams.get('type') as ProjectType | null;
    const limit = parseInt(searchParams.get('limit') || '10');
    const offset = parseInt(searchParams.get('offset') || '0');

    // Si public, récupérer seulement les projets avec témoignages publics
    if (isPublic) {
      const projects = await prisma.project.findMany({
        where: {
          status: ProjectStatus.DELIVERED,
          testimonial: {
            isPublic: true,
          },
          ...(type && { type }),
        },
        include: {
          contact: {
            select: {
              name: true,
              company: true,
            },
          },
          testimonial: {
            where: { isPublic: true },
          },
          _count: {
            select: { tasks: true },
          },
        },
        orderBy: {
          createdAt: 'desc',
        },
        take: limit,
        skip: offset,
      });

      return NextResponse.json({
        projects: projects.map(project => ({
          id: project.id,
          title: project.title,
          description: project.description,
          type: project.type,
          technologies: project.technologies,
          features: project.features,
          productionUrl: project.productionUrl,
          client: {
            name: project.contact.name,
            company: project.contact.company,
          },
          testimonial: project.testimonial,
          taskCount: project._count.tasks,
          completedAt: project.updatedAt,
        })),
        total: await prisma.project.count({
          where: {
            status: ProjectStatus.DELIVERED,
            testimonial: { isPublic: true },
            ...(type && { type }),
          },
        }),
      });
    }

    // Vérification admin pour les données complètes
    const session = await getServerSession(authOptions);
    if (!session || (session.user.role !== 'ADMIN' && session.user.role !== 'EDITOR')) {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
    }

    const projects = await prisma.project.findMany({
      where: {
        ...(status && { status }),
        ...(type && { type }),
      },
      include: {
        contact: true,
        testimonial: true,
        tasks: {
          orderBy: { createdAt: 'asc' },
        },
        invoices: true,
        _count: {
          select: {
            tasks: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
      take: limit,
      skip: offset,
    });

    const total = await prisma.project.count({
      where: {
        ...(status && { status }),
        ...(type && { type }),
      },
    });

    return NextResponse.json({ projects, total });
  } catch (error) {
    console.error('Erreur API projets:', error);
    return NextResponse.json(
      { error: 'Erreur serveur' },
      { status: 500 }
    );
  }
}

// POST /api/projects - Créer un nouveau projet (admin seulement)
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || (session.user.role !== 'ADMIN' && session.user.role !== 'EDITOR')) {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
    }

    const body = await request.json();
    const {
      title,
      description,
      type,
      contactId,
      budget,
      timeline,
      technologies = [],
      features = [],
      startDate,
    } = body;

    // Vérifier que le contact existe
    const contact = await prisma.contact.findUnique({
      where: { id: contactId },
    });

    if (!contact) {
      return NextResponse.json(
        { error: 'Contact non trouvé' },
        { status: 404 }
      );
    }

    // Créer le projet
    const project = await prisma.project.create({
      data: {
        title,
        description,
        type,
        contactId,
        budget,
        timeline,
        technologies,
        features,
        startDate: startDate ? new Date(startDate) : new Date(),
        userId: session.user.id,
      },
      include: {
        contact: true,
        tasks: true,
      },
    });

    // Créer des tâches par défaut
    const defaultTasks = [
      {
        title: 'Analyse des besoins',
        description: 'Définir les spécifications fonctionnelles et techniques',
        priority: 'HIGH' as const,
        estimatedHours: 4,
      },
      {
        title: 'Design et maquettes',
        description: 'Créer les maquettes et définir l\'identité visuelle',
        priority: 'HIGH' as const,
        estimatedHours: 8,
      },
      {
        title: 'Développement',
        description: 'Développement des fonctionnalités',
        priority: 'HIGH' as const,
        estimatedHours: type === ProjectType.ECOMMERCE ? 24 : 16,
      },
      {
        title: 'Tests et optimisations',
        description: 'Tests fonctionnels et optimisation des performances',
        priority: 'MEDIUM' as const,
        estimatedHours: 4,
      },
      {
        title: 'Déploiement',
        description: 'Mise en production et configuration',
        priority: 'MEDIUM' as const,
        estimatedHours: 2,
      },
    ];

    await Promise.all(
      defaultTasks.map(task =>
        prisma.projectTask.create({
          data: {
            ...task,
            projectId: project.id,
          },
        })
      )
    );

    return NextResponse.json(project, { status: 201 });
  } catch (error) {
    console.error('Erreur création projet:', error);
    return NextResponse.json(
      { error: 'Erreur serveur' },
      { status: 500 }
    );
  }
}

