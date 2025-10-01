import Stripe from 'stripe';

/**
 * Stripe client initialization
 * - Do not throw at module load if the key is missing (helps CI/type-check without env)
 * - Throw only when someone actually tries to use the client without a key
 */
export const stripe = (() => {
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) {
    // Return a proxy that throws on any property access to avoid runtime misuse
    return new Proxy({} as Stripe, {
      get() {
        throw new Error('STRIPE_SECRET_KEY is required to use Stripe. Set it in your environment.');
      },
    }) as unknown as Stripe;
  }
  return new Stripe(key, {
    // Keep API version consistent with lib/services/stripe.ts and repository-wide expectation
    apiVersion: '2025-08-27.basil',
    typescript: true,
  });
})();

// Configuration des packages SDS
export const PACKAGES = {
  ESSENTIEL: {
    id: 'essentiel',
    name: 'ESSENTIEL',
    description: 'Site vitrine professionnel avec design sur-mesure et optimisation SEO complète',
    price: 336000, // 3360€ en centimes
    originalPrice: 420000, // 4200€ en centimes
    features: [
      'Design responsive sur-mesure',
      'Optimisation SEO avancée',
      'Formulaire de contact intelligent',
      'Intégration réseaux sociaux',
      'Certificat SSL inclus',
      'Formation à la gestion',
      'Maintenance 6 mois incluse',
      'Support email prioritaire',
    ],
    deliveryTime: '7-10 jours',
    revisions: 3,
    guarantee: 30,
  },
  PROFESSIONNEL: {
    id: 'professionnel',
    name: 'PROFESSIONNEL',
    description: 'Solution complète avec fonctionnalités avancées et système de gestion client',
    price: 520000, // 5200€ en centimes
    originalPrice: 650000, // 6500€ en centimes
    features: [
      'Tout du pack Essentiel',
      'Système de réservation en ligne',
      'Espace client personnalisé',
      'Blog intégré avec CMS',
      'Analytics et rapports détaillés',
      'Support prioritaire 6 mois',
      'Formation complète incluse',
      'Optimisation mobile avancée',
      'Intégration outils marketing',
      'Sauvegarde automatique',
    ],
    deliveryTime: '10-14 jours',
    revisions: 5,
    guarantee: 60,
    popular: true,
  },
  BOUTIQUE: {
    id: 'boutique',
    name: 'BOUTIQUE',
    description: 'E-commerce complet avec gestion des stocks et paiements sécurisés',
    price: 800000, // 8000€ en centimes
    originalPrice: 1000000, // 10000€ en centimes
    features: [
      'Tout du pack Professionnel',
      'Boutique e-commerce complète',
      'Gestion automatique des stocks',
      'Paiements sécurisés (Stripe, PayPal)',
      'Système de fidélité client',
      'Formation e-commerce complète',
      'Tableau de bord vendeur',
      'Gestion des commandes',
      'Système de livraison',
      'Support e-commerce dédié',
      'Optimisation conversions',
      'Intégration comptabilité',
    ],
    deliveryTime: '14-21 jours',
    revisions: 'illimitées',
    guarantee: 90,
  },
} as const;

export type PackageId = keyof typeof PACKAGES;

// Métadonnées pour Stripe
export function getStripeMetadata(packageId: PackageId, customerInfo: any) {
  return {
    package_id: packageId,
    package_name: PACKAGES[packageId].name,
    customer_name: customerInfo.name || '',
    customer_email: customerInfo.email || '',
    customer_phone: customerInfo.phone || '',
    company: customerInfo.company || '',
    project_type: customerInfo.projectType || '',
    source: 'sds_website',
    created_at: new Date().toISOString(),
  };
}

// Configuration des webhooks
export const WEBHOOK_EVENTS = [
  'checkout.session.completed',
  'payment_intent.succeeded',
  'payment_intent.payment_failed',
  'invoice.payment_succeeded',
  'invoice.payment_failed',
  'customer.subscription.created',
  'customer.subscription.updated',
  'customer.subscription.deleted',
] as const;

