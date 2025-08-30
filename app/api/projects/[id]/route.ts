import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth/nextauth';
import { prisma } from '@/lib/db/prisma';
import { ProjectStatus } from '@prisma/client';

// GET /api/projects/[id] - Récupérer un projet spécifique
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { searchParams } = new URL(request.url);
    const isPublic = searchParams.get('public') === 'true';

    if (isPublic) {
      // Version publique - seulement les projets avec témoignages publics
      const project = await prisma.project.findFirst({
        where: {
          id: params.id,
          status: ProjectStatus.DELIVERED,
          testimonial: {
            isPublic: true,
          },
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
        },
      });

      if (!project) {
        return NextResponse.json(
          { error: 'Projet non trouvé' },
          { status: 404 }
        );
      }

      return NextResponse.json({
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
        completedAt: project.updatedAt,
      });
    }

    // Version admin - données complètes
    const session = await getServerSession(authOptions);
    if (!session || (session.user.role !== 'ADMIN' && session.user.role !== 'EDITOR')) {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
    }

    const project = await prisma.project.findUnique({
      where: { id: params.id },
      include: {
        contact: true,
        testimonial: true,
        tasks: {
          orderBy: { createdAt: 'asc' },
        },
        invoices: {
          orderBy: { createdAt: 'desc' },
        },
      },
    });

    if (!project) {
      return NextResponse.json(
        { error: 'Projet non trouvé' },
        { status: 404 }
      );
    }

    return NextResponse.json(project);
  } catch (error) {
    console.error('Erreur API projet:', error);
    return NextResponse.json(
      { error: 'Erreur serveur' },
      { status: 500 }
    );
  }
}

// PUT /api/projects/[id] - Mettre à jour un projet
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || (session.user.role !== 'ADMIN' && session.user.role !== 'EDITOR')) {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
    }

    const body = await request.json();
    const {
      title,
      description,
      status,
      progress,
      technologies,
      features,
      repositoryUrl,
      stagingUrl,
      productionUrl,
      endDate,
      deliveryDate,
    } = body;

    const project = await prisma.project.update({
      where: { id: params.id },
      data: {
        ...(title && { title }),
        ...(description && { description }),
        ...(status && { status }),
        ...(progress !== undefined && { progress }),
        ...(technologies && { technologies }),
        ...(features && { features }),
        ...(repositoryUrl !== undefined && { repositoryUrl }),
        ...(stagingUrl !== undefined && { stagingUrl }),
        ...(productionUrl !== undefined && { productionUrl }),
        ...(endDate && { endDate: new Date(endDate) }),
        ...(deliveryDate && { deliveryDate: new Date(deliveryDate) }),
      },
      include: {
        contact: true,
        tasks: true,
        testimonial: true,
      },
    });

    return NextResponse.json(project);
  } catch (error) {
    console.error('Erreur mise à jour projet:', error);
    return NextResponse.json(
      { error: 'Erreur serveur' },
      { status: 500 }
    );
  }
}

// DELETE /api/projects/[id] - Supprimer un projet
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
    }

    await prisma.project.delete({
      where: { id: params.id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Erreur suppression projet:', error);
    return NextResponse.json(
      { error: 'Erreur serveur' },
      { status: 500 }
    );
  }
}

