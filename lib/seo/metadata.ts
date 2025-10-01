import { Metadata } from 'next';

// Configuration SEO de base
export const siteConfig = {
  name: 'Smarter Logic Web.com',
  title: 'SLW - Solutions Web Glamour & Performantes',
  description: 'Agence web SLW (Smarter Logic Web.com) — sites vitrines, e-commerce, applications web avec design sur-mesure. Aides publiques France Num jusqu\'à 5000€.',
  url: process.env.NEXT_PUBLIC_SITE_URL || 'https://smarterlogicweb.com',
  ogImage: '/og-image.jpg',
  creator: 'SLW',
  keywords: [
    'développement web',
    'création site internet',
    'site vitrine',
    'e-commerce',
    'application web',
    'design web',
    'développeuse freelance',
    'France Num',
    'aides publiques',
    'subventions site web',
    'Next.js',
    'React',
    'TypeScript',
    'Tailwind CSS',
    'responsive design',
    'SEO',
    'performance web',
    'accessibilité web',
    'UX/UI design',
    'développement sur mesure',
  ],
  authors: [
    {
      name: 'Salwa',
      url: 'https://sds.com',
    },
  ],
  social: {
    twitter: '@salwadev',
    linkedin: 'salwa-dev-studio',
    github: 'Soofmaax',
    email: 'contact@sds.com',
  },
  location: {
    country: 'France',
    region: 'Île-de-France',
    city: 'Paris',
  },
  business: {
    type: 'WebDevelopmentService',
    priceRange: '€€',
    telephone: '+33123456789',
    email: 'contact@sds.com',
    address: {
      streetAddress: '123 Rue de la Tech',
      addressLocality: 'Paris',
      postalCode: '75001',
      addressCountry: 'FR',
    },
    openingHours: [
      'Mo-Fr 09:00-18:00',
    ],
    services: [
      'Création de sites web',
      'Développement e-commerce',
      'Applications web sur mesure',
      'Refonte de sites existants',
      'Optimisation SEO',
      'Maintenance et support',
    ],
  },
};

// Types pour les métadonnées de page
export interface PageMetadata {
  title?: string;
  description?: string;
  keywords?: string[];
  image?: string;
  noIndex?: boolean;
  canonical?: string;
  alternates?: {
    languages?: Record<string, string>;
  };
  openGraph?: {
    title?: string;
    description?: string;
    image?: string;
    type?: 'website' | 'article' | 'profile';
    publishedTime?: string;
    modifiedTime?: string;
    authors?: string[];
    tags?: string[];
  };
  twitter?: {
    card?: 'summary' | 'summary_large_image' | 'app' | 'player';
    title?: string;
    description?: string;
    image?: string;
    creator?: string;
  };
  structuredData?: any;
}

/**
 * Générer les métadonnées pour une page
 */
export function generateMetadata(pageData: PageMetadata = {}): Metadata {
  const {
    title,
    description = siteConfig.description,
    keywords = [],
    image = siteConfig.ogImage,
    noIndex = false,
    canonical,
    alternates,
    openGraph,
    twitter,
  } = pageData;

  const fullTitle = title 
    ? `${title} | ${siteConfig.name}`
    : siteConfig.title;

  const imageUrl = image.startsWith('http') 
    ? image 
    : `${siteConfig.url}${image}`;

  const metadata: Metadata = {
    title: fullTitle,
    description,
    keywords: [...siteConfig.keywords, ...keywords].join(', '),
    authors: siteConfig.authors,
    creator: siteConfig.creator,
    publisher: siteConfig.name,
    robots: noIndex ? 'noindex,nofollow' : 'index,follow',
    alternates: {
      canonical: canonical || siteConfig.url,
      languages: alternates?.languages,
    },
    
    // Open Graph
    openGraph: {
      type: 'website',
      locale: 'fr_FR',
      url: siteConfig.url,
      siteName: siteConfig.name,
      title: openGraph?.title || fullTitle,
      description: openGraph?.description || description,
      images: [
        {
          url: imageUrl,
          width: 1200,
          height: 630,
          alt: openGraph?.title || fullTitle,
        },
      ],
      ...openGraph,
    },

    // Twitter
    twitter: {
      card: 'summary_large_image',
      site: siteConfig.social.twitter,
      creator: siteConfig.social.twitter,
      title: twitter?.title || fullTitle,
      description: twitter?.description || description,
      images: [imageUrl],
      ...twitter,
    },

    // Métadonnées supplémentaires
    other: {
      'apple-mobile-web-app-capable': 'yes',
      'apple-mobile-web-app-status-bar-style': 'default',
      'apple-mobile-web-app-title': siteConfig.name,
      'application-name': siteConfig.name,
      'msapplication-TileColor': '#C73863',
      'theme-color': '#C73863',
    },
  };

  return metadata;
}

/**
 * Métadonnées pour la page d'accueil
 */
export const homeMetadata: PageMetadata = {
  title: 'Accueil',
  description: 'Créatrice de solutions web glamour et performantes. Sites vitrines, e-commerce, applications web avec design sur-mesure. Bénéficiez des aides France Num jusqu\'à 5000€.',
  keywords: [
    'accueil',
    'solutions web glamour',
    'développeuse web freelance',
    'création site internet professionnel',
  ],
  openGraph: {
    type: 'website',
    title: 'Solutions Web Glamour & Performantes',
    description: 'Transformez vos idées en expériences digitales exceptionnelles avec Salwa Dev Studio.',
  },
  structuredData: {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: siteConfig.name,
    url: siteConfig.url,
    description: siteConfig.description,
    potentialAction: {
      '@type': 'SearchAction',
      target: `${siteConfig.url}/search?q={search_term_string}`,
      'query-input': 'required name=search_term_string',
    },
  },
};

/**
 * Métadonnées pour la page services
 */
export const servicesMetadata: PageMetadata = {
  title: 'Services & Tarifs',
  description: 'Découvrez mes services de développement web : sites vitrines, e-commerce, applications sur mesure. Tarifs transparents avec aides France Num jusqu\'à 5000€.',
  keywords: [
    'services développement web',
    'tarifs création site',
    'packages web',
    'aides France Num',
    'subventions site internet',
  ],
  openGraph: {
    type: 'website',
    title: 'Services & Tarifs - Développement Web',
    description: '3 packages adaptés à vos besoins : Essentiel, Professionnel, Boutique. Avec aides publiques France Num.',
  },
  structuredData: {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name: 'Services de Développement Web',
    provider: {
      '@type': 'Person',
      name: 'Salwa',
      url: siteConfig.url,
    },
    serviceType: 'Développement Web',
    description: 'Services complets de création et développement de sites web professionnels.',
    offers: [
      {
        '@type': 'Offer',
        name: 'Package Essentiel',
        price: '3360',
        priceCurrency: 'EUR',
        description: 'Site vitrine professionnel avec design sur mesure.',
      },
      {
        '@type': 'Offer',
        name: 'Package Professionnel',
        price: '5200',
        priceCurrency: 'EUR',
        description: 'Site avancé avec fonctionnalités e-commerce et SEO.',
      },
      {
        '@type': 'Offer',
        name: 'Package Boutique',
        price: '8000',
        priceCurrency: 'EUR',
        description: 'E-commerce complet avec toutes les fonctionnalités avancées.',
      },
    ],
  },
};

/**
 * Métadonnées pour la page portfolio
 */
export const portfolioMetadata: PageMetadata = {
  title: 'Portfolio & Réalisations',
  description: 'Découvrez mes réalisations : sites vitrines, e-commerce, applications web. Plus de 50 projets livrés avec 100% de satisfaction client.',
  keywords: [
    'portfolio développement web',
    'réalisations sites internet',
    'projets web',
    'exemples sites',
    'références clients',
  ],
  openGraph: {
    type: 'website',
    title: 'Portfolio - Mes Réalisations Web',
    description: '50+ projets réalisés avec succès. Découvrez la qualité de mon travail.',
  },
  structuredData: {
    '@context': 'https://schema.org',
    '@type': 'CreativeWork',
    name: 'Portfolio Salwa Dev Studio',
    creator: {
      '@type': 'Person',
      name: 'Salwa',
      url: siteConfig.url,
    },
    description: 'Collection de projets web réalisés avec expertise et créativité.',
  },
};

/**
 * Métadonnées pour la page à propos
 */
export const aboutMetadata: PageMetadata = {
  title: 'À Propos de Salwa',
  description: 'Développeuse web passionnée, spécialisée dans la création de solutions digitales élégantes et performantes. 3+ années d\'expérience, 50+ projets réalisés.',
  keywords: [
    'à propos Salwa',
    'développeuse web freelance',
    'parcours professionnel',
    'expertise développement',
    'passion web',
  ],
  openGraph: {
    type: 'profile',
    title: 'À Propos de Salwa - Développeuse Web Passionnée',
    description: 'Découvrez mon parcours, mes valeurs et ma passion pour le développement web.',
  },
  structuredData: {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: 'Salwa',
    jobTitle: 'Développeuse Web & Blockchain',
    url: siteConfig.url,
    image: `${siteConfig.url}/images/salwa-profile.jpg`,
    description: 'Développeuse web passionnée, créatrice de solutions digitales élégantes et performantes.',
    knowsAbout: [
      'Développement Web',
      'React',
      'Next.js',
      'TypeScript',
      'Blockchain',
      'UX/UI Design',
      'SEO',
      'Performance Web',
    ],
    alumniOf: {
      '@type': 'EducationalOrganization',
      name: 'École de Développement Web',
    },
    worksFor: {
      '@type': 'Organization',
      name: 'Salwa Dev Studio',
      url: siteConfig.url,
    },
  },
};

/**
 * Métadonnées pour la page contact
 */
export const contactMetadata: PageMetadata = {
  title: 'Contact & Devis Gratuit',
  description: 'Contactez-moi pour votre projet web. Devis gratuit sous 24h. Échangeons sur vos besoins et créons ensemble votre solution digitale sur mesure.',
  keywords: [
    'contact développeuse web',
    'devis gratuit site internet',
    'projet web',
    'consultation gratuite',
    'demande de devis',
  ],
  openGraph: {
    type: 'website',
    title: 'Contact - Devis Gratuit sous 24h',
    description: 'Parlons de votre projet web. Consultation gratuite et devis personnalisé.',
  },
  structuredData: {
    '@context': 'https://schema.org',
    '@type': 'ContactPage',
    name: 'Contact Salwa Dev Studio',
    description: 'Page de contact pour demander un devis ou poser vos questions.',
    mainEntity: {
      '@type': 'Person',
      name: 'Salwa',
      email: siteConfig.social.email,
      telephone: siteConfig.business.telephone,
      url: siteConfig.url,
    },
  },
};

/**
 * Générer les données structurées pour l'organisation
 */
export function generateOrganizationSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: siteConfig.name,
    url: siteConfig.url,
    logo: `${siteConfig.url}/logo.png`,
    description: siteConfig.description,
    email: siteConfig.social.email,
    telephone: siteConfig.business.telephone,
    address: {
      '@type': 'PostalAddress',
      ...siteConfig.business.address,
    },
    openingHours: siteConfig.business.openingHours,
    priceRange: siteConfig.business.priceRange,
    serviceType: siteConfig.business.services,
    founder: {
      '@type': 'Person',
      name: 'Salwa',
      jobTitle: 'Développeuse Web & Blockchain',
    },
    sameAs: [
      `https://twitter.com/${siteConfig.social.twitter}`,
      `https://linkedin.com/in/${siteConfig.social.linkedin}`,
      `https://github.com/${siteConfig.social.github}`,
    ],
  };
}

/**
 * Générer les données structurées pour les avis clients
 */
export function generateReviewsSchema(reviews: any[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: siteConfig.name,
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: '5.0',
      reviewCount: reviews.length,
      bestRating: '5',
      worstRating: '1',
    },
    review: reviews.map(review => ({
      '@type': 'Review',
      author: {
        '@type': 'Person',
        name: review.author,
      },
      reviewRating: {
        '@type': 'Rating',
        ratingValue: review.rating,
        bestRating: '5',
        worstRating: '1',
      },
      reviewBody: review.content,
      datePublished: review.date,
    })),
  };
}

/**
 * Générer les données structurées pour les FAQ
 */
export function generateFAQSchema(faqs: Array<{ question: string; answer: string }>) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map(faq => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer,
      },
    })),
  };
}

/**
 * Générer les données structurées pour un article de blog
 */
export function generateArticleSchema(article: {
  title: string;
  description: string;
  content: string;
  publishedAt: string;
  updatedAt?: string;
  image?: string;
  tags?: string[];
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: article.title,
    description: article.description,
    image: article.image ? `${siteConfig.url}${article.image}` : siteConfig.ogImage,
    author: {
      '@type': 'Person',
      name: 'Salwa',
      url: siteConfig.url,
    },
    publisher: {
      '@type': 'Organization',
      name: siteConfig.name,
      logo: {
        '@type': 'ImageObject',
        url: `${siteConfig.url}/logo.png`,
      },
    },
    datePublished: article.publishedAt,
    dateModified: article.updatedAt || article.publishedAt,
    keywords: article.tags?.join(', '),
    articleBody: article.content,
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': siteConfig.url,
    },
  };
}

/**
 * Générer le breadcrumb schema
 */
export function generateBreadcrumbSchema(items: Array<{ name: string; url: string }>) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: `${siteConfig.url}${item.url}`,
    })),
  };
}

