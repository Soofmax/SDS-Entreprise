import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth/nextauth';
import { prisma } from '@/lib/db/prisma';
import { ContactStatus } from '@prisma/client';

// GET /api/admin/contacts - Récupérer tous les contacts (admin)
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || (session.user.role !== 'ADMIN' && session.user.role !== 'EDITOR')) {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status') as ContactStatus | null;
    const search = searchParams.get('search');
    const limit = parseInt(searchParams.get('limit') || '20');
    const offset = parseInt(searchParams.get('offset') || '0');
    const sortBy = searchParams.get('sortBy') || 'createdAt';
    const sortOrder = searchParams.get('sortOrder') || 'desc';

    // Construire les filtres
    const where = {
      ...(status && { status }),
      ...(search && {
        OR: [
          { name: { contains: search, mode: 'insensitive' as const } },
          { email: { contains: search, mode: 'insensitive' as const } },
          { company: { contains: search, mode: 'insensitive' as const } },
        ],
      }),
    };

    const contacts = await prisma.contact.findMany({
      where,
      include: {
        project: {
          select: {
            id: true,
            title: true,
            status: true,
            progress: true,
          },
        },
        user: {
          select: {
            name: true,
            email: true,
          },
        },
      },
      orderBy: {
        [sortBy]: sortOrder as 'asc' | 'desc',
      },
      take: limit,
      skip: offset,
    });

    const total = await prisma.contact.count({ where });

    // Statistiques par statut
    const statusStats = await prisma.contact.groupBy({
      by: ['status'],
      _count: {
        id: true,
      },
    });

    return NextResponse.json({
      contacts,
      total,
      statusStats: statusStats.reduce((acc, stat) => {
        acc[stat.status] = Number(stat._count.id);
        return acc;
      }, {} as Record<string, number>),
    });

  } catch (error) {
    console.error('Erreur API admin contacts:', error);
    return NextResponse.json(
      { error: 'Erreur serveur' },
      { status: 500 }
    );
  }
}

// PUT /api/admin/contacts - Mettre à jour le statut d'un contact
export async function PUT(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || (session.user.role !== 'ADMIN' && session.user.role !== 'EDITOR')) {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
    }

    const body = await request.json();
    const { contactId, status, notes } = body;

    if (!contactId || !status) {
      return NextResponse.json(
        { error: 'ID du contact et statut requis' },
        { status: 400 }
      );
    }

    const contact = await prisma.contact.update({
      where: { id: contactId },
      data: {
        status,
        userId: session.user.id,
        // TODO: Ajouter un champ notes si nécessaire
      },
      include: {
        project: true,
      },
    });

    // Si le contact passe en WON, créer automatiquement un projet
    if (status === ContactStatus.WON && !contact.project) {
      await prisma.project.create({
        data: {
          title: `Projet ${contact.company || contact.name}`,
          description: contact.message,
          type: contact.projectType,
          contactId: contact.id,
          budget: contact.budget || 5000,
          timeline: 14, // 2 semaines par défaut
          technologies: ['Next.js', 'TypeScript', 'Tailwind CSS'],
          features: ['Design responsive', 'SEO optimisé'],
          userId: session.user.id,
        },
      });
    }

    return NextResponse.json(contact);

  } catch (error) {
    console.error('Erreur mise à jour contact:', error);
    return NextResponse.json(
      { error: 'Erreur serveur' },
      { status: 500 }
    );
  }
}

