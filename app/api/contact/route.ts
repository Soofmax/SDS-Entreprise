import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { prisma, connectWithRetry } from '@/lib/db/client';
import { rateLimit } from '@/lib/utils/rateLimit';
import { sendContactEmail } from '@/lib/services/email-simple';
import { trackEvent } from '@/lib/services/email-simple';

// Schéma de validation Zod
const contactSchema = z.object({
  name: z.string()
    .min(2, 'Le nom doit contenir au moins 2 caractères')
    .max(50, 'Le nom ne peut pas dépasser 50 caractères')
    .regex(/^[a-zA-ZÀ-ÿ\s'-]+$/, 'Le nom contient des caractères invalides'),
  
  email: z.string()
    .email('Format d\'email invalide')
    .max(100, 'L\'email ne peut pas dépasser 100 caractères'),
  
  phone: z.string()
    .optional()
    .refine(
      (val) => !val || /^(?:\+33|0)[1-9](?:[0-9]{8})$/.test(val.replace(/\s/g, '')),
      'Format de téléphone invalide'
    ),
  
  company: z.string()
    .max(100, 'Le nom de l\'entreprise ne peut pas dépasser 100 caractères')
    .optional(),
  
  projectType: z.enum(['vitrine', 'ecommerce', 'application', 'refonte', 'seo', 'maintenance'], {
    errorMap: () => ({ message: 'Type de projet invalide' })
  }),
  
  budget: z.string()
    .min(1, 'Le budget est requis'),
  
  timeline: z.string()
    .min(1, 'Le délai est requis'),
  
  message: z.string()
    .min(10, 'Le message doit contenir au moins 10 caractères')
    .max(1000, 'Le message ne peut pas dépasser 1000 caractères'),
  
  source: z.string().optional(),
  
  // Champ honeypot pour détecter les bots
  website: z.string().max(0, 'Champ invalide').optional(),
});

// Helper pour extraire les métadonnées de la requête
function extractMetadata(request: NextRequest) {
  const userAgent = request.headers.get('user-agent') || '';
  const referrer = request.headers.get('referer') || '';
  const ipAddress = request.headers.get('x-forwarded-for') || 
                   request.headers.get('x-real-ip') || 
                   'unknown';
  
  return { userAgent, referrer, ipAddress };
}

// Helper pour sanitiser les données
function sanitizeData(data: any) {
  const sanitized = { ...data };
  
  // Nettoyer les chaînes de caractères
  Object.keys(sanitized).forEach(key => {
    if (typeof sanitized[key] === 'string') {
      sanitized[key] = sanitized[key]
        .trim()
        .replace(/\s+/g, ' ') // Remplacer les espaces multiples
        .replace(/[<>]/g, ''); // Supprimer les caractères dangereux
    }
  });
  
  return sanitized;
}

export async function POST(request: NextRequest) {
  try {
    // 1. Rate limiting
    const { success, limit, remaining, reset } = await rateLimit(request);
    
    if (!success) {
      return NextResponse.json(
        { 
          success: false, 
          error: {
            code: 'RATE_LIMIT_EXCEEDED',
            message: 'Trop de tentatives. Veuillez réessayer plus tard.',
          }
        },
        { 
          status: 429,
          headers: {
            'X-RateLimit-Limit': limit.toString(),
            'X-RateLimit-Remaining': remaining.toString(),
            'X-RateLimit-Reset': reset.toString(),
          }
        }
      );
    }

    // 2. Parsing et validation des données
    const body = await request.json();
    
    // Vérification du honeypot (anti-bot)
    if (body.website && body.website.length > 0) {
      // C'est probablement un bot, on fait semblant que ça marche
      return NextResponse.json({ success: true });
    }
    
    const validationResult = contactSchema.safeParse(body);
    
    if (!validationResult.success) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: 'VALIDATION_ERROR',
            message: 'Données invalides',
            details: validationResult.error.flatten().fieldErrors,
          }
        },
        { status: 400 }
      );
    }

    // 3. Sanitisation des données
    const sanitizedData = sanitizeData(validationResult.data);
    const metadata = extractMetadata(request);

    // 4. Sauvegarde en base de données
    const contact = await connectWithRetry(async () => {
      return prisma.contact.create({
        data: {
          ...sanitizedData,
          ...metadata,
          source: sanitizedData.source || 'contact_form',
          status: 'NEW',
          priority: 'MEDIUM',
        },
      });
    });

    // 5. Envoi de l'email de notification
    try {
      await sendContactEmail({
        to: process.env.CONTACT_EMAIL || 'contact@sds.com',
        subject: `Nouveau contact: ${sanitizedData.name} - ${sanitizedData.projectType}`,
        contact: sanitizedData,
        contactId: contact.id,
      });
      
      // Email de confirmation au client
      await sendContactEmail({
        to: sanitizedData.email,
        subject: 'Votre demande a été reçue - SDS',
        template: 'contact_confirmation',
        contact: sanitizedData,
        contactId: contact.id,
      });
    } catch (emailError) {
      console.error('Erreur envoi email:', emailError);
      // On ne fait pas échouer la requête si l'email échoue
    }

    // 6. Tracking analytics
    try {
      await trackEvent({
        name: 'contact_form_submitted',
        category: 'form_submission',
        properties: {
          projectType: sanitizedData.projectType,
          budget: sanitizedData.budget,
          source: sanitizedData.source,
        },
        metadata,
      });
    } catch (analyticsError) {
      console.error('Erreur analytics:', analyticsError);
    }

    // 7. Réponse de succès
    return NextResponse.json(
      {
        success: true,
        data: {
          id: contact.id,
          message: 'Votre demande a été envoyée avec succès. Nous vous recontacterons sous 24h.',
        }
      },
      { 
        status: 201,
        headers: {
          'X-RateLimit-Limit': limit.toString(),
          'X-RateLimit-Remaining': (remaining - 1).toString(),
          'X-RateLimit-Reset': reset.toString(),
        }
      }
    );

  } catch (error) {
    console.error('Erreur API contact:', error);
    
    // Log de l'erreur en base
    try {
      await prisma.errorLog.create({
        data: {
          code: 'CONTACT_API_ERROR',
          message: error instanceof Error ? error.message : 'Erreur inconnue',
          severity: 'high',
          details: {
            error: error instanceof Error ? error.stack : error,
            endpoint: '/api/contact',
            method: 'POST',
          },
          ...extractMetadata(request),
        },
      });
    } catch (logError) {
      console.error('Impossible de logger l\'erreur:', logError);
    }

    return NextResponse.json(
      {
        success: false,
        error: {
          code: 'INTERNAL_ERROR',
          message: 'Une erreur interne est survenue. Veuillez réessayer.',
        }
      },
      { status: 500 }
    );
  }
}

// Méthode GET pour récupérer les statistiques (admin seulement)
export async function GET(request: NextRequest) {
  try {
    // TODO: Ajouter l'authentification admin ici
    
    const stats = await connectWithRetry(async () => {
      const [total, today, thisWeek, thisMonth] = await Promise.all([
        prisma.contact.count(),
        prisma.contact.count({
          where: {
            createdAt: {
              gte: new Date(new Date().setHours(0, 0, 0, 0)),
            },
          },
        }),
        prisma.contact.count({
          where: {
            createdAt: {
              gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
            },
          },
        }),
        prisma.contact.count({
          where: {
            createdAt: {
              gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
            },
          },
        }),
      ]);

      return { total, today, thisWeek, thisMonth };
    });

    return NextResponse.json({
      success: true,
      data: stats,
    });

  } catch (error) {
    console.error('Erreur récupération stats:', error);
    
    return NextResponse.json(
      {
        success: false,
        error: {
          code: 'STATS_ERROR',
          message: 'Impossible de récupérer les statistiques',
        }
      },
      { status: 500 }
    );
  }
}

