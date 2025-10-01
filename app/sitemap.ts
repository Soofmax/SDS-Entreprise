import { MetadataRoute } from 'next';
import { siteConfig } from '@/lib/seo/metadata';

// Types pour les entrées du sitemap
interface SitemapEntry {
  url: string;
  lastModified?: string | Date;
  changeFrequency?: 'always' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'never';
  priority?: number;
}

/**
 * Générer le sitemap automatique
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = siteConfig.url;
  const currentDate = new Date().toISOString();

  // Pages statiques principales
  const staticPages: SitemapEntry[] = [
    {
      url: baseUrl,
      lastModified: currentDate,
      changeFrequency: 'weekly',
      priority: 1.0,
    },
    {
      url: `${baseUrl}/services`,
      lastModified: currentDate,
      changeFrequency: 'monthly',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/portfolio`,
      lastModified: currentDate,
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/about`,
      lastModified: currentDate,
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: `${baseUrl}/contact`,
      lastModified: currentDate,
      changeFrequency: 'monthly',
      priority: 0.8,
    },
  ];

  // Combiner uniquement les pages existantes (simplification pour éviter 404)
  const allPages = [
    ...staticPages,
  ];

  return allPages;
}

/**
 * Récupérer les projets du portfolio
 * (À remplacer par une vraie requête base de données)
 */
function getPortfolioProjects() {
  // Simulation de projets - à remplacer par une vraie requête
  return [
    {
      slug: 'restaurant-le-gourmet',
      createdAt: '2024-01-15',
      updatedAt: '2024-01-20',
    },
    {
      slug: 'boutique-mode-elegance',
      createdAt: '2024-02-10',
      updatedAt: '2024-02-15',
    },
    {
      slug: 'cabinet-avocat-justice',
      createdAt: '2024-03-05',
      updatedAt: '2024-03-10',
    },
    {
      slug: 'startup-fintech-crypto',
      createdAt: '2024-04-01',
      updatedAt: '2024-04-05',
    },
    {
      slug: 'association-environnement',
      createdAt: '2024-05-12',
      updatedAt: '2024-05-18',
    },
    {
      slug: 'marketplace-artisans',
      createdAt: '2024-06-20',
      updatedAt: '2024-06-25',
    },
  ];
}

/**
 * Récupérer les articles de blog
 * (À remplacer par une vraie requête base de données)
 */
function getBlogPosts() {
  // Simulation d'articles - à remplacer par une vraie requête
  return [
    {
      slug: 'tendances-web-design-2024',
      publishedAt: '2024-01-10',
      updatedAt: '2024-01-15',
    },
    {
      slug: 'optimiser-performance-site-web',
      publishedAt: '2024-02-05',
      updatedAt: '2024-02-08',
    },
    {
      slug: 'aides-france-num-guide-complet',
      publishedAt: '2024-03-01',
      updatedAt: '2024-03-05',
    },
    {
      slug: 'choisir-cms-site-internet',
      publishedAt: '2024-04-12',
      updatedAt: '2024-04-15',
    },
    {
      slug: 'seo-local-entreprises-tpe-pme',
      publishedAt: '2024-05-20',
      updatedAt: '2024-05-25',
    },
    {
      slug: 'accessibilite-web-bonnes-pratiques',
      publishedAt: '2024-06-10',
      updatedAt: '2024-06-12',
    },
  ];
}

/**
 * Générer un sitemap pour les images
 */
export function generateImageSitemap(): MetadataRoute.Sitemap {
  const baseUrl = siteConfig.url;
  
  const imagePages: SitemapEntry[] = [
    {
      url: `${baseUrl}/images-sitemap.xml`,
      lastModified: new Date().toISOString(),
      changeFrequency: 'weekly',
      priority: 0.5,
    },
  ];

  return imagePages;
}

/**
 * Générer un sitemap pour les vidéos
 */
export function generateVideoSitemap(): MetadataRoute.Sitemap {
  const baseUrl = siteConfig.url;
  
  const videoPages: SitemapEntry[] = [
    {
      url: `${baseUrl}/videos-sitemap.xml`,
      lastModified: new Date().toISOString(),
      changeFrequency: 'monthly',
      priority: 0.4,
    },
  ];

  return videoPages;
}

/**
 * Générer un sitemap pour les actualités
 */
export function generateNewsSitemap(): MetadataRoute.Sitemap {
  const baseUrl = siteConfig.url;
  const recentPosts = getBlogPosts()
    .filter(post => {
      const publishDate = new Date(post.publishedAt);
      const twoDaysAgo = new Date();
      twoDaysAgo.setDate(twoDaysAgo.getDate() - 2);
      return publishDate >= twoDaysAgo;
    });

  const newsPages: SitemapEntry[] = recentPosts.map(post => ({
    url: `${baseUrl}/blog/${post.slug}`,
    lastModified: post.updatedAt || post.publishedAt,
    changeFrequency: 'daily',
    priority: 0.8,
  }));

  return newsPages;
}

