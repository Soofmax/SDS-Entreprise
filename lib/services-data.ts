// Fichier: lib/services-data.ts

export interface Service {
  id: string;
  name: string;
  description: string;
  price: number;
  category: 'base' | 'addon';
  subCategory: string;
  features: string[];
  duration?: string;
  popular?: boolean;
  dependencies?: string[];
}

export const allServices: Service[] = [
  // --- SERVICES DE BASE ---
  {
    id: 'site-vitrine', name: 'Site Vitrine 5 Pages',
    description: 'Site web professionnel avec design sur-mesure, responsive et optimisé SEO.',
    price: 1200, category: 'base', subCategory: 'visibilite', popular: true, duration: '7-10 jours',
    features: ['Design responsive', 'Optimisation SEO', '5 pages incluses', 'Formulaire de contact', 'Analytics intégré'],
    dependencies: [],
  },
  {
    id: 'landing-page', name: 'Landing Page',
    description: 'Page de conversion haute performance avec design accrocheur et call-to-actions optimisés.',
    price: 600, category: 'base', subCategory: 'conversion', duration: '3-5 jours',
    features: ['Design conversion-focused', 'A/B testing ready', 'Intégration analytics', 'Optimisation mobile', 'Temps de chargement < 2s'],
    dependencies: [],
  },
  {
    id: 'site-ecommerce', name: 'Boutique en Ligne Performante',
    description: 'Vendez vos produits avec une boutique en ligne complète, sécurisée et facile à gérer.',
    price: 2500, category: 'base', subCategory: 'vente', duration: '4-6 semaines',
    features: ['Catalogue produits illimité', 'Paiement sécurisé (Stripe, PayPal)', 'Gestion des commandes', 'Comptes clients'],
    dependencies: [],
  },
  {
    id: 'pwa', name: 'Application Web Progressive (PWA)',
    description: 'Offrez une expérience mobile native qui fonctionne hors-ligne et s\'installe comme une vraie app.',
    price: 3500, category: 'base', subCategory: 'innovation', duration: '4-5 semaines',
    features: ['Installation native', 'Fonctionnement hors-ligne', 'Notifications push', 'Performance optimisée', 'Mise à jour auto'],
    dependencies: [],
  },
  {
    id: 'marketplace', name: 'Marketplace Multi-Vendeurs',
    description: 'Créez votre propre plateforme où plusieurs marchands peuvent vendre leurs produits.',
    price: 8500, category: 'base', subCategory: 'plateforme', duration: '8-10 semaines',
    features: ['Inscription vendeurs', 'Gestion des commissions', 'Interface vendeur dédiée', 'Système de reviews', 'Outils marketing'],
    dependencies: [],
  },
  {
    id: 'systeme-reservation', name: 'Système de Réservation Intelligent',
    description: 'Simplifiez la prise de rendez-vous avec un système qui gère votre planning et envoie des rappels.',
    price: 2500, category: 'base', subCategory: 'optimisation', duration: '3-4 semaines',
    features: ['Calendrier synchronisé', 'Rappels SMS/email auto', 'Gestion des annulations', 'Paiement en ligne intégré', 'Analytics'],
    dependencies: [],
  },
  {
    id: 'plateforme-elearning', name: 'Plateforme E-learning Interactive',
    description: 'Monétisez votre expertise avec une plateforme de formation complète incluant vidéos, quiz et certification.',
    price: 5500, category: 'base', subCategory: 'plateforme', duration: '6-7 semaines',
    features: ['Lecteur vidéo sécurisé', 'Quiz interactifs', 'Génération de certificats', 'Suivi progression élèves', 'Paiements par module'],
    dependencies: [],
  },
  {
    id: 'crm-personnalise', name: 'Système CRM Personnalisé',
    description: 'Gérez vos relations clients avec un CRM sur-mesure qui s\'adapte à votre façon de travailler.',
    price: 4200, category: 'base', subCategory: 'optimisation', duration: '5-6 semaines',
    features: ['Gestion contacts et historique', 'Pipeline de ventes visuel', 'Automatisation du suivi', 'Intégration email', 'Rapports'],
    dependencies: [],
  },
  {
    id: 'systeme-support', name: 'Système de Tickets & Support',
    description: 'Professionnalisez votre support client avec un système de tickets qui centralise et automatise les demandes.',
    price: 3800, category: 'base', subCategory: 'optimisation', duration: '4-5 semaines',
    features: ['Interface tickets multi-canal', 'Assignation automatique', 'Système de priorités', 'Base de connaissances', 'SLA et reporting'],
    dependencies: [],
  },
  {
    id: 'plateforme-webinaires', name: 'Plateforme de Webinaires Interactifs',
    description: 'Organisez des événements en ligne professionnels avec streaming HD et interactions en temps réel.',
    price: 4800, category: 'base', subCategory: 'plateforme', duration: '5-6 semaines',
    features: ['Streaming multi-qualité', 'Chat et sondages en temps réel', 'Enregistrement et replay auto', 'Intégration paiements'],
    dependencies: [],
  },
  {
    id: 'systeme-encheres', name: 'Système d\'Enchères en Ligne',
    description: 'Créez votre propre plateforme d\'enchères avec gestion automatique des mises et paiements sécurisés.',
    price: 6500, category: 'base', subCategory: 'plateforme', duration: '7-8 semaines',
    features: ['Système d\'enchères automatiques', 'Gestion des mises en temps réel', 'Paiements escrow sécurisés', 'Système de réputation'],
    dependencies: [],
  },
  {
    id: 'plateforme-crowdfunding', name: 'Plateforme de Crowdfunding',
    description: 'Lancez votre propre plateforme de financement participatif avec gestion des campagnes et récompenses.',
    price: 7800, category: 'base', subCategory: 'plateforme', duration: '8-9 semaines',
    features: ['Création de campagnes visuelles', 'Système de paliers et récompenses', 'Paiements conditionnels', 'Outils de promotion'],
    dependencies: [],
  },
  {
    id: 'plateforme-mise-en-relation', name: 'Plateforme de Mise en Relation',
    description: 'Créez un réseau qui connecte prestataires et clients selon des critères de matching intelligents.',
    price: 5900, category: 'base', subCategory: 'plateforme', duration: '6-7 semaines',
    features: ['Algorithme de matching intelligent', 'Profils détaillés', 'Messagerie intégrée', 'Évaluations croisées', 'Paiements sécurisés'],
    dependencies: [],
  },

  // --- ADD-ONS ---
  {
    id: 'blog', name: 'Blog Markdown',
    description: 'Système de blog intégré avec support Markdown, catégories, tags et RSS.',
    price: 400, category: 'addon', subCategory: 'visibilite',
    features: ['Éditeur Markdown', 'Système de catégories', 'Flux RSS', 'Commentaires', 'Partage social'],
    dependencies: ['site-vitrine', 'site-ecommerce'],
  },
  {
    id: 'seo-avance', name: 'SEO Avancé',
    description: 'Optimisation SEO complète avec schema markup, sitemap, et meta tags dynamiques.',
    price: 300, category: 'addon', subCategory: 'visibilite',
    features: ['Schema markup', 'Sitemap XML', 'Meta tags dynamiques', 'Open Graph', 'Audit SEO'],
    dependencies: ['site-vitrine', 'landing-page', 'site-ecommerce'],
  },
  {
    id: 'connexion-web3', name: 'Connexion Wallet Web3',
    description: 'Intégration Web3 avec connexion wallet, gestion des NFTs et interactions blockchain.',
    price: 800, category: 'addon', subCategory: 'innovation',
    features: ['Multi-wallet support', 'Gestion NFT', 'Smart contracts', 'Transaction history', 'Web3 auth'],
    dependencies: ['site-vitrine', 'landing-page', 'site-ecommerce'],
  },
  {
    id: 'internationalisation', name: 'Internationalisation',
    description: 'Support multi-langues avec détection automatique et traductions dynamiques.',
    price: 500, category: 'addon', subCategory: 'growth',
    features: ['Support multi-langues', 'Détection automatique', 'URLs localisées', 'Contenus traduits', 'Fallback intelligent'],
    dependencies: ['site-vitrine', 'site-ecommerce'],
  },
  {
    id: 'maintenance-annuelle', name: 'Maintenance & Sérénité',
    description: 'Gardez votre site à jour, sécurisé et performant sans avoir à vous en soucier.',
    price: 450, category: 'addon', subCategory: 'optimisation',
    features: ['Mises à jour techniques', 'Sauvegardes mensuelles', 'Rapport de performance', 'Support prioritaire'],
    dependencies: ['site-vitrine', 'landing-page', 'site-ecommerce'],
  },
  {
    id: 'chatbot-ia', name: 'Chatbot IA Personnalisé',
    description: 'Un assistant virtuel intelligent qui répond 24/7 aux questions de vos visiteurs.',
    price: 2200, category: 'addon', subCategory: 'conversion', duration: '2-3 semaines',
    features: ['Formation sur vos données', 'Interface conversationnelle', 'Escalade vers un humain', 'Analytics', 'Design personnalisé'],
    dependencies: ['site-vitrine', 'site-ecommerce', 'landing-page'],
  },
  {
    id: 'workflows-ia', name: 'Automatisation & Workflows IA',
    description: 'Automatisez vos tâches répétitives et connectez vos outils métier avec des workflows intelligents.',
    price: 2800, category: 'addon', subCategory: 'optimisation', duration: '3-4 semaines',
    features: ['Connexions API avec CRM', 'Traitement automatisé des formulaires', 'Rapports auto', 'Workflows conditionnels', 'Interface admin'],
    dependencies: ['site-vitrine', 'site-ecommerce'],
  },
  {
    id: 'dashboard-ia', name: 'Dashboard Analytics + IA',
    description: 'Prenez des décisions éclairées avec un tableau de bord qui analyse vos données et propose des recommandations.',
    price: 3200, category: 'addon', subCategory: 'growth', duration: '4-5 semaines',
    features: ['Métriques business personnalisées', 'Analyse prédictive', 'Recommandations automatiques', 'Alertes intelligentes', 'Export de rapports'],
    dependencies: ['site-vitrine', 'site-ecommerce'],
  },
  {
    id: 'generateur-contenu-ia', name: 'Générateur de Contenu IA',
    description: 'Alimentez automatiquement votre site avec du contenu frais et optimisé SEO.',
    price: 1800, category: 'addon', subCategory: 'visibilite', duration: '2-3 semaines',
    features: ['Génération d\'articles auto', 'Optimisation SEO native', 'Respect de votre ligne éditoriale', 'Planification de publication'],
    dependencies: ['blog', 'site-vitrine'],
  },
  {
    id: 'api-integrations', name: 'API & Intégrations Tierces',
    description: 'Connectez votre site à l\'écosystème digital de votre entreprise en synchronisant vos données.',
    price: 2000, category: 'addon', subCategory: 'optimisation', duration: '2-3 semaines',
    features: ['Connexions API multiples', 'Sync temps réel', 'Gestion des erreurs', 'Documentation API', 'Monitoring des flux'],
    dependencies: ['site-vitrine', 'site-ecommerce', 'pwa', 'marketplace', 'systeme-reservation', 'plateforme-elearning', 'crm-personnalise'],
  },
  {
    id: 'membership-premium', name: 'Système de Membership Premium',
    description: 'Créez une communauté exclusive avec des niveaux d\'accès personnalisés et du contenu premium.',
    price: 3000, category: 'addon', subCategory: 'vente', duration: '4-5 semaines',
    features: ['Gestion multi-niveaux', 'Contenu exclusif par niveau', 'Paiements récurrents', 'Forum privé', 'Gamification'],
    dependencies: ['site-vitrine', 'site-ecommerce'],
  },
  {
    id: 'audit-performance', name: 'Audit & Optimisation Performance',
    description: 'Boostez radicalement la vitesse de votre site avec un audit complet et des optimisations techniques.',
    price: 1500, category: 'addon', subCategory: 'optimisation', duration: '1-2 semaines',
    features: ['Audit technique complet', 'Optimisation images', 'Mise en cache avancée', 'Optimisation BDD', 'Rapport avant/après'],
    dependencies: ['site-vitrine', 'site-ecommerce', 'pwa', 'marketplace', 'systeme-reservation', 'plateforme-elearning', 'crm-personnalise'],
  },
  {
    id: 'assistant-vocal', name: 'Assistant Vocal Personnalisé',
    description: 'Innovez avec un assistant qui permet à vos visiteurs de naviguer sur votre site par la voix.',
    price: 2700, category: 'addon', subCategory: 'innovation', duration: '3-4 semaines',
    features: ['Reconnaissance vocale multilingue', 'Navigation vocale', 'Commandes métier personnalisées', 'Synthèse vocale naturelle'],
    dependencies: ['site-vitrine', 'site-ecommerce'],
  },
  {
    id: 'generateur-apps-mobiles', name: 'Générateur d\'Apps Mobiles',
    description: 'Transformez automatiquement votre site web en application mobile native iOS et Android.',
    price: 4500, category: 'addon', subCategory: 'innovation', duration: '5-6 semaines',
    features: ['Génération auto iOS/Android', 'Push notifications natives', 'Mode hors-ligne intelligent', 'Publication sur les stores'],
    dependencies: ['site-vitrine', 'site-ecommerce', 'pwa'],
  },
  {
    id: 'geolocalisation-livraison', name: 'Module de Géolocalisation & Livraison',
    description: 'Optimisez vos livraisons avec un système qui calcule les coûts et permet le tracking en temps réel.',
    price: 2400, category: 'addon', subCategory: 'vente', duration: '3-4 semaines',
    features: ['Calcul auto des zones de livraison', 'Tarification dynamique', 'Tracking GPS en temps réel', 'Notifications client auto'],
    dependencies: ['site-ecommerce'],
  },
  {
    id: 'generateur-devis-factures', name: 'Générateur de Devis & Factures IA',
    description: 'Automatisez votre facturation avec un système intelligent qui génère devis et factures personnalisés.',
    price: 1900, category: 'addon', subCategory: 'optimisation', duration: '2-3 semaines',
    features: ['Templates personnalisables', 'Calculs automatiques', 'Génération PDF auto', 'Suivi des paiements', 'Relances automatiques'],
    dependencies: ['site-vitrine'],
  },
  {
    id: 'systeme-parrainage', name: 'Système de Parrainage & Fidélité',
    description: 'Développez votre clientèle grâce à un programme de parrainage gamifié avec points et récompenses.',
    price: 2100, category: 'addon', subCategory: 'growth', duration: '2-3 semaines',
    features: ['Génération de codes parrain uniques', 'Système de points et niveaux', 'Récompenses automatiques', 'Tableau de bord parrain'],
    dependencies: ['site-vitrine', 'site-ecommerce'],
  },
  {
    id: 'realite-augmentee', name: 'Module de Réalité Augmentée',
    description: 'Révolutionnez l\'expérience client avec la RA qui permet de visualiser vos produits dans leur environnement.',
    price: 3800, category: 'addon', subCategory: 'innovation', duration: '4-5 semaines',
    features: ['Visualisation AR via caméra', 'Compatible iOS/Android', 'Partage d\'expériences AR', 'Mesures automatiques en AR'],
    dependencies: ['site-ecommerce'],
  },
  {
    id: 'gestion-inventaire-ia', name: 'Gestion d\'Inventaire Intelligente',
    description: 'Optimisez votre stock avec un système IA qui prédit les besoins et automatise les commandes.',
    price: 3100, category: 'addon', subCategory: 'optimisation', duration: '4-5 semaines',
    features: ['Prédiction des besoins par IA', 'Alertes de rupture de stock', 'Commandes fournisseurs auto', 'Gestion multi-entrepôts'],
    dependencies: ['site-ecommerce'],
  },
  {
    id: 'tests-ab-automatises', name: 'Plateforme de Tests A/B Automatisés',
    description: 'Optimisez en continu vos conversions avec des tests A/B qui trouvent les meilleures versions de vos pages.',
    price: 2600, category: 'addon', subCategory: 'conversion', duration: '3-4 semaines',
    features: ['Tests multivariés automatiques', 'Segmentation audience intelligente', 'Calculs de significativité', 'Mise en prod auto'],
    dependencies: ['site-vitrine', 'site-ecommerce', 'landing-page'],
  },
];
