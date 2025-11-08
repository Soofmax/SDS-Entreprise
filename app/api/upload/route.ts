import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth/config';
import { writeFile, mkdir } from 'fs/promises';
import { existsSync } from 'fs';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';
import { withRateLimit } from '@/lib/utils/rateLimit';

// Configuration
const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
const ALLOWED_TYPES = {
  image: ['image/jpeg', 'image/png', 'image/webp', 'image/gif'],
  document: ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'],
  archive: ['application/zip', 'application/x-rar-compressed'],
};

const UPLOAD_DIR = path.join(process.cwd(), 'public/uploads');

// POST /api/upload - Upload de fichiers
export const POST = withRateLimit(async (request: NextRequest) => {
  try {
    // Vérification de l'authentification
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
    }

    // CSRF protection (origin check)
    const origin = request.headers.get('origin') || '';
    const allowedOrigins = [
      process.env.NEXTAUTH_URL || '',
      process.env.NEXT_PUBLIC_APP_URL || '',
    ].filter(Boolean);
    if (allowedOrigins.length && !allowedOrigins.some((o) => origin.startsWith(o))) {
      return NextResponse.json(
        { error: 'CSRF protection: invalid origin' },
        { status: 403 }
      );
    }

    const formData = await request.formData();
    const file = formData.get('file') as File;
    const category = (formData.get('category') as string) || 'general';

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

    // Sauvegarder en buffer et vérifier magic bytes (type réel)
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const { fileTypeFromBuffer } = await import('file-type');
    const detected = await fileTypeFromBuffer(buffer);

    // Vérification stricte extension/MIME par magic bytes
    const allowedMimes = new Set(Object.values(ALLOWED_TYPES).flat());
    const mimeToCheck = detected?.mime || file.type;
    if (!allowedMimes.has(mimeToCheck)) {
      return NextResponse.json(
        { error: 'Type de fichier non autorisé (magic bytes mismatch)' },
        { status: 400 }
      );
    }

    // Générer un nom de fichier unique
    const extension = detected?.ext ? `.${detected.ext}` : path.extname(file.name) || '';
    const fileName = `${uuidv4()}${extension}`;

    // Option S3 si configuré
    const useS3 = !!process.env.AWS_S3_BUCKET;
    let publicUrl: string;

    if (useS3) {
      const { S3Client, PutObjectCommand } = await import('@aws-sdk/client-s3');

      const s3 = new S3Client({
        region: process.env.AWS_REGION || 'eu-west-3',
      });

      const key = `${category}/${fileName}`;
      await s3.send(new PutObjectCommand({
        Bucket: process.env.AWS_S3_BUCKET!,
        Key: key,
        Body: buffer,
        ContentType: mimeToCheck,
        ACL: 'private',
      }));

      // Pour la réponse, retourner un chemin logique; pour lecture côté client, utiliser un endpoint proxy ou générer une URL signée GetObject côté serveur
      publicUrl = `s3://${process.env.AWS_S3_BUCKET}/${key}`;
    } else {
      // Local fallback (public folder)
      const categoryDir = path.join(UPLOAD_DIR, category);
      if (!existsSync(categoryDir)) {
        await mkdir(categoryDir, { recursive: true });
      }
      const filePath = path.join(categoryDir, fileName);
      await writeFile(filePath, buffer);
      publicUrl = `/uploads/${category}/${fileName}`;
    }

    // Métadonnées du fichier
    const fileInfo = {
      id: uuidv4(),
      originalName: file.name,
      fileName,
      filePath: publicUrl,
      size: file.size,
      type: mimeToCheck,
      category,
      uploadedBy: session.user.id,
      uploadedAt: new Date().toISOString(),
      storage: useS3 ? 's3' : 'local',
    };

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
}, { windowMs: 60 * 1000, maxRequests: 20 });

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

