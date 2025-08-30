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

  // Pages d'outils et calculateurs
  const toolPages: SitemapEntry[] = [
    {
      url: `${baseUrl}/calculateur-aide`,
      lastModified: currentDate,
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: `${baseUrl}/devis-gratuit`,
      lastModified: currentDate,
      changeFrequency: 'monthly',
      priority: 0.6,
    },
  ];

  // Pages de services détaillées
  const servicePages: SitemapEntry[] = [
    {
      url: `${baseUrl}/services/site-vitrine`,
      lastModified: currentDate,
      changeFrequency: 'monthly',
      priority: 0.6,
    },
    {
      url: `${baseUrl}/services/e-commerce`,
      lastModified: currentDate,
      changeFrequency: 'monthly',
      priority: 0.6,
    },
    {
      url: `${baseUrl}/services/application-web`,
      lastModified: currentDate,
      changeFrequency: 'monthly',
      priority: 0.6,
    },
    {
      url: `${baseUrl}/services/refonte-site`,
      lastModified: currentDate,
      changeFrequency: 'monthly',
      priority: 0.5,
    },
    {
      url: `${baseUrl}/services/seo-optimisation`,
      lastModified: currentDate,
      changeFrequency: 'monthly',
      priority: 0.5,
    },
    {
      url: `${baseUrl}/services/maintenance`,
      lastModified: currentDate,
      changeFrequency: 'monthly',
      priority: 0.5,
    },
  ];

  // Pages d'informations sur les aides
  const aidePages: SitemapEntry[] = [
    {
      url: `${baseUrl}/aides/france-num`,
      lastModified: currentDate,
      changeFrequency: 'monthly',
      priority: 0.6,
    },
    {
      url: `${baseUrl}/aides/subventions-tpe-pme`,
      lastModified: currentDate,
      changeFrequency: 'monthly',
      priority: 0.5,
    },
    {
      url: `${baseUrl}/aides/credit-impot-recherche`,
      lastModified: currentDate,
      changeFrequency: 'yearly',
      priority: 0.4,
    },
  ];

  // Pages de catégories portfolio
  const portfolioCategories: SitemapEntry[] = [
    {
      url: `${baseUrl}/portfolio/sites-vitrines`,
      lastModified: currentDate,
      changeFrequency: 'weekly',
      priority: 0.6,
    },
    {
      url: `${baseUrl}/portfolio/e-commerce`,
      lastModified: currentDate,
      changeFrequency: 'weekly',
      priority: 0.6,
    },
    {
      url: `${baseUrl}/portfolio/applications-web`,
      lastModified: currentDate,
      changeFrequency: 'weekly',
      priority: 0.6,
    },
    {
      url: `${baseUrl}/portfolio/projets-blockchain`,
      lastModified: currentDate,
      changeFrequency: 'weekly',
      priority: 0.5,
    },
  ];

  // Pages légales
  const legalPages: SitemapEntry[] = [
    {
      url: `${baseUrl}/mentions-legales`,
      lastModified: currentDate,
      changeFrequency: 'yearly',
      priority: 0.3,
    },
    {
      url: `${baseUrl}/politique-confidentialite`,
      lastModified: currentDate,
      changeFrequency: 'yearly',
      priority: 0.3,
    },
    {
      url: `${baseUrl}/conditions-generales`,
      lastModified: currentDate,
      changeFrequency: 'yearly',
      priority: 0.3,
    },
    {
      url: `${baseUrl}/cookies`,
      lastModified: currentDate,
      changeFrequency: 'yearly',
      priority: 0.2,
    },
  ];

  // Pages de ressources et guides
  const resourcePages: SitemapEntry[] = [
    {
      url: `${baseUrl}/guides/creer-site-internet`,
      lastModified: currentDate,
      changeFrequency: 'monthly',
      priority: 0.5,
    },
    {
      url: `${baseUrl}/guides/choisir-developpeur-web`,
      lastModified: currentDate,
      changeFrequency: 'monthly',
      priority: 0.5,
    },
    {
      url: `${baseUrl}/guides/optimiser-seo`,
      lastModified: currentDate,
      changeFrequency: 'monthly',
      priority: 0.5,
    },
    {
      url: `${baseUrl}/guides/aides-numeriques-entreprises`,
      lastModified: currentDate,
      changeFrequency: 'monthly',
      priority: 0.4,
    },
  ];

  // Combiner toutes les pages
  const allPages = [
    ...staticPages,
    ...toolPages,
    ...servicePages,
    ...aidePages,
    ...portfolioCategories,
    ...legalPages,
    ...resourcePages,
  ];

  // Ajouter les projets du portfolio dynamiquement
  const portfolioProjects = getPortfolioProjects();
  const portfolioPages: SitemapEntry[] = portfolioProjects.map(project => ({
    url: `${baseUrl}/portfolio/${project.slug}`,
    lastModified: project.updatedAt || project.createdAt,
    changeFrequency: 'monthly',
    priority: 0.5,
  }));

  // Ajouter les articles de blog dynamiquement
  const blogPosts = getBlogPosts();
  const blogPages: SitemapEntry[] = blogPosts.map(post => ({
    url: `${baseUrl}/blog/${post.slug}`,
    lastModified: post.updatedAt || post.publishedAt,
    changeFrequency: 'monthly',
    priority: 0.6,
  }));

  // Page d'index du blog
  if (blogPosts.length > 0) {
    allPages.push({
      url: `${baseUrl}/blog`,
      lastModified: currentDate,
      changeFrequency: 'weekly',
      priority: 0.7,
    });
  }

  return [
    ...allPages,
    ...portfolioPages,
    ...blogPages,
  ];
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

