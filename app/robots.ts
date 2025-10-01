import { MetadataRoute } from 'next';
import { siteConfig } from '@/lib/seo/metadata';

/**
 * Générer le fichier robots.txt
 */
export default function robots(): MetadataRoute.Robots {
  const baseUrl = siteConfig.url;

  return {
    rules: [
      // Règles pour tous les robots
      {
        userAgent: '*',
        allow: [
          '/',
          '/services',
          '/portfolio',
          '/about',
          '/contact',
          '/calculateur-aide',
          '/devis-gratuit',
          '/blog',
          '/guides',
          '/aides',
        ],
        disallow: [
          '/admin',
          '/api',
          '/private',
          '/_next',
          '/static',
          '/temp',
          '/draft',
          '*.json',
          '*.xml',
          '/search',
          '/404',
          '/500',
          '/offline',
        ],
        crawlDelay: 1,
      },
      
      // Règles spécifiques pour Googlebot
      {
        userAgent: 'Googlebot',
        allow: [
          '/',
          '/services',
          '/portfolio',
          '/about',
          '/contact',
          '/calculateur-aide',
          '/blog',
          '/guides',
          '/aides',
          '/images',
          '/icons',
        ],
        disallow: [
          '/admin',
          '/api',
          '/private',
          '/_next/static/chunks',
          '/temp',
          '/draft',
        ],
        crawlDelay: 0.5,
      },
      
      // Règles pour Bingbot
      {
        userAgent: 'Bingbot',
        allow: [
          '/',
          '/services',
          '/portfolio',
          '/about',
          '/contact',
          '/blog',
        ],
        disallow: [
          '/admin',
          '/api',
          '/private',
          '/_next',
        ],
        crawlDelay: 1,
      },
      
      // Règles pour les bots de réseaux sociaux
      {
        userAgent: [
          'facebookexternalhit',
          'Twitterbot',
          'LinkedInBot',
          'WhatsApp',
          'TelegramBot',
        ],
        allow: [
          '/',
          '/services',
          '/portfolio',
          '/about',
          '/contact',
          '/blog',
          '/images',
          '/og-image.jpg',
        ],
        disallow: [
          '/admin',
          '/api',
          '/private',
        ],
      },
      
      // Bloquer les bots malveillants
      {
        userAgent: [
          'AhrefsBot',
          'SemrushBot',
          'MJ12bot',
          'DotBot',
          'BLEXBot',
          'DataForSeoBot',
          'PetalBot',
          'YandexBot',
          'CCBot',
          'ChatGPT-User',
          'GPTBot',
          'Google-Extended',
          'anthropic-ai',
          'Claude-Web',
        ],
        disallow: '/',
      },
      
      // Règles pour les bots d'archivage
      {
        userAgent: [
          'ia_archiver',
          'Wayback',
          'archive.org_bot',
        ],
        allow: [
          '/',
          '/services',
          '/portfolio',
          '/about',
          '/contact',
          '/blog',
        ],
        disallow: [
          '/admin',
          '/api',
          '/private',
          '/temp',
        ],
        crawlDelay: 5,
      },
    ],
    
    // Sitemaps (simplifié pour éviter les 404 tant que non générés)
    sitemap: [
      `${baseUrl}/sitemap.xml`,
    ],
    
    // Host (optionnel, pour spécifier le domaine principal)
    host: baseUrl,
  };
}

/**
 * Générer des règles robots.txt personnalisées pour l'environnement
 */
export function generateEnvironmentRobots(): MetadataRoute.Robots {
  const isProduction = process.env.NODE_ENV === 'production';
  const baseUrl = siteConfig.url;

  if (!isProduction) {
    // En développement/staging, bloquer tous les robots
    return {
      rules: {
        userAgent: '*',
        disallow: '/',
      },
      sitemap: `${baseUrl}/sitemap.xml`,
    };
  }

  // En production, utiliser les règles normales
  return robots();
}

/**
 * Règles robots.txt pour un site en maintenance
 */
export function generateMaintenanceRobots(): MetadataRoute.Robots {
  const baseUrl = siteConfig.url;

  return {
    rules: {
      userAgent: '*',
      disallow: '/',
      allow: '/maintenance',
    },
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}

/**
 * Règles robots.txt pour un site avec authentification
 */
export function generateAuthRobots(): MetadataRoute.Robots {
  const baseUrl = siteConfig.url;

  return {
    rules: [
      {
        userAgent: '*',
        allow: [
          '/',
          '/services',
          '/portfolio',
          '/about',
          '/contact',
          '/blog',
          '/public',
        ],
        disallow: [
          '/admin',
          '/dashboard',
          '/profile',
          '/settings',
          '/api',
          '/auth',
          '/login',
          '/register',
          '/reset-password',
          '/verify-email',
          '/private',
          '/user',
          '/account',
        ],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}

/**
 * Règles robots.txt pour un e-commerce
 */
export function generateEcommerceRobots(): MetadataRoute.Robots {
  const baseUrl = siteConfig.url;

  return {
    rules: [
      {
        userAgent: '*',
        allow: [
          '/',
          '/products',
          '/categories',
          '/blog',
          '/about',
          '/contact',
          '/services',
        ],
        disallow: [
          '/admin',
          '/cart',
          '/checkout',
          '/account',
          '/orders',
          '/wishlist',
          '/compare',
          '/search',
          '/filter',
          '/api',
          '/private',
          '/*?*', // Paramètres de requête
          '/*&*', // Paramètres multiples
        ],
        crawlDelay: 1,
      },
      {
        userAgent: 'Googlebot',
        allow: [
          '/',
          '/products',
          '/categories',
          '/blog',
          '/images',
        ],
        disallow: [
          '/admin',
          '/cart',
          '/checkout',
          '/account',
          '/api',
        ],
        crawlDelay: 0.5,
      },
    ],
    sitemap: [
      `${baseUrl}/sitemap.xml`,
      `${baseUrl}/sitemap-products.xml`,
      `${baseUrl}/sitemap-categories.xml`,
    ],
  };
}

/**
 * Règles robots.txt pour un blog
 */
export function generateBlogRobots(): MetadataRoute.Robots {
  const baseUrl = siteConfig.url;

  return {
    rules: [
      {
        userAgent: '*',
        allow: [
          '/',
          '/blog',
          '/categories',
          '/tags',
          '/about',
          '/contact',
          '/archive',
        ],
        disallow: [
          '/admin',
          '/wp-admin',
          '/wp-content',
          '/wp-includes',
          '/draft',
          '/preview',
          '/private',
          '/api',
          '/search',
          '/*?preview=true',
          '/*?draft=true',
        ],
        crawlDelay: 1,
      },
      {
        userAgent: 'Googlebot',
        allow: [
          '/',
          '/blog',
          '/categories',
          '/tags',
          '/images',
          '/uploads',
        ],
        disallow: [
          '/admin',
          '/draft',
          '/preview',
          '/api',
        ],
        crawlDelay: 0.5,
      },
    ],
    sitemap: [
      `${baseUrl}/sitemap.xml`,
      `${baseUrl}/sitemap-posts.xml`,
      `${baseUrl}/sitemap-categories.xml`,
      `${baseUrl}/sitemap-tags.xml`,
    ],
  };
}

