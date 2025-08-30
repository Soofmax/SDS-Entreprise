import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth/nextauth';
import { writeFile, mkdir } from 'fs/promises';
import { existsSync } from 'fs';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';

// Configuration
const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
const ALLOWED_TYPES = {
  image: ['image/jpeg', 'image/png', 'image/webp', 'image/gif'],
  document: ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'],
  archive: ['application/zip', 'application/x-rar-compressed'],
};

const UPLOAD_DIR = path.join(process.cwd(), 'public/uploads');

// POST /api/upload - Upload de fichiers
export async function POST(request: NextRequest) {
  try {
    // Vérification de l'authentification
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
    }

    const formData = await request.formData();
    const file = formData.get('file') as File;
    const category = formData.get('category') as string || 'general';

    if (!file) {
      return NextResponse.json(
        { error: 'Aucun fichier fourni' },
        { status: 400 }
      );
    }

    // Vérification de la taille
    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        { error: `Fichier trop volumineux (max ${MAX_FILE_SIZE / 1024 / 1024}MB)` },
        { status: 400 }
      );
    }

    // Vérification du type de fichier
    const fileType = file.type;
    const isAllowed = Object.values(ALLOWED_TYPES).some(types => 
      types.includes(fileType)
    );

    if (!isAllowed) {
      return NextResponse.json(
        { error: 'Type de fichier non autorisé' },
        { status: 400 }
      );
    }

    // Créer le dossier d'upload s'il n'existe pas
    const categoryDir = path.join(UPLOAD_DIR, category);
    if (!existsSync(categoryDir)) {
      await mkdir(categoryDir, { recursive: true });
    }

    // Générer un nom de fichier unique
    const fileExtension = path.extname(file.name);
    const fileName = `${uuidv4()}${fileExtension}`;
    const filePath = path.join(categoryDir, fileName);

    // Sauvegarder le fichier
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    await writeFile(filePath, buffer);

    // URL publique du fichier
    const publicUrl = `/uploads/${category}/${fileName}`;

    // Métadonnées du fichier
    const fileInfo = {
      id: uuidv4(),
      originalName: file.name,
      fileName,
      filePath: publicUrl,
      size: file.size,
      type: file.type,
      category,
      uploadedBy: session.user.id,
      uploadedAt: new Date().toISOString(),
    };

    // TODO: Sauvegarder les métadonnées en base de données si nécessaire
    // await prisma.file.create({ data: fileInfo });

    return NextResponse.json({
      success: true,
      file: fileInfo,
    });

  } catch (error) {
    console.error('Erreur upload:', error);
    return NextResponse.json(
      { error: 'Erreur lors de l\'upload' },
      { status: 500 }
    );
  }
}

// GET /api/upload - Lister les fichiers uploadés (admin)
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || (session.user.role !== 'ADMIN' && session.user.role !== 'EDITOR')) {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    const limit = parseInt(searchParams.get('limit') || '20');
    const offset = parseInt(searchParams.get('offset') || '0');

    // TODO: Récupérer depuis la base de données
    // const files = await prisma.file.findMany({
    //   where: category ? { category } : {},
    //   orderBy: { uploadedAt: 'desc' },
    //   take: limit,
    //   skip: offset,
    // });

    // Pour l'instant, retourner une liste vide
    return NextResponse.json({
      files: [],
      total: 0,
      categories: ['general', 'projects', 'testimonials', 'documents'],
    });

  } catch (error) {
    console.error('Erreur liste fichiers:', error);
    return NextResponse.json(
      { error: 'Erreur serveur' },
      { status: 500 }
    );
  }
}

// DELETE /api/upload/[filename] - Supprimer un fichier (admin)
export async function DELETE(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const filePath = searchParams.get('path');

    if (!filePath) {
      return NextResponse.json(
        { error: 'Chemin de fichier requis' },
        { status: 400 }
      );
    }

    // Vérifier que le fichier est dans le dossier uploads
    if (!filePath.startsWith('/uploads/')) {
      return NextResponse.json(
        { error: 'Chemin de fichier invalide' },
        { status: 400 }
      );
    }

    const fullPath = path.join(process.cwd(), 'public', filePath);
    
    // Vérifier que le fichier existe
    if (!existsSync(fullPath)) {
      return NextResponse.json(
        { error: 'Fichier non trouvé' },
        { status: 404 }
      );
    }

    // Supprimer le fichier
    const fs = await import('fs/promises');
    await fs.unlink(fullPath);

    // TODO: Supprimer de la base de données
    // await prisma.file.delete({ where: { filePath } });

    return NextResponse.json({ success: true });

  } catch (error) {
    console.error('Erreur suppression fichier:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la suppression' },
      { status: 500 }
    );
  }
}

