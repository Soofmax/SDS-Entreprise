import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth/config';
import { withRateLimit } from '@/lib/utils/rateLimit';

export const GET = withRateLimit(async (request: NextRequest) => {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
    }

    if (!process.env.AWS_S3_BUCKET) {
      return NextResponse.json({ error: 'S3 non configuré' }, { status: 400 });
    }

    const { searchParams } = new URL(request.url);
    const keyParam = searchParams.get('key') || '';

    // Validation de la clé (éviter traversal)
    if (!/^[a-zA-Z0-9/_\.\-]+$/.test(keyParam) || keyParam.includes('..')) {
      return NextResponse.json({ error: 'Clé invalide' }, { status: 400 });
    }

    const { S3Client, GetObjectCommand } = await import('@aws-sdk/client-s3');
    const { getSignedUrl } = await import('@aws-sdk/s3-request-presigner');

    const s3 = new S3Client({ region: process.env.AWS_REGION || 'eu-west-3' });

    const command = new GetObjectCommand({
      Bucket: process.env.AWS_S3_BUCKET!,
      Key: keyParam,
    });

    const url = await getSignedUrl(s3, command, { expiresIn: 300 });

    return NextResponse.json({ url });
  } catch (error) {
    console.error('Erreur génération URL signée:', error);
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}, { windowMs: 60 * 1000, maxRequests: 60 });