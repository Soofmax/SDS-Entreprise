import Stripe from 'stripe';
import { prisma } from '@/lib/db/client';

// Configuration Stripe
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  // Align with repository's configured Stripe API version (types expect this literal)
  apiVersion: '2025-08-27.basil',
  typescript: true,
});

// Types pour les paiements
export interface PaymentIntent {
  id: string;
  amount: number;
  currency: string;
  status: string;
  clientSecret: string;
}

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  currency: string;
  features: string[];
  popular?: boolean;
}

export interface Customer {
  id: string;
  email: string;
  name: string;
  phone?: string;
  address?: Stripe.Address;
}

export interface Invoice {
  id: string;
  number: string;
  amount: number;
  status: string;
  dueDate: Date;
  paidAt?: Date;
  downloadUrl: string;
}

// Produits/Services prédéfinis
export const PRODUCTS: Product[] = [
  {
    id: 'essentiel',
    name: 'Package Essentiel',
    description: 'Site vitrine professionnel avec design sur-mesure',
    price: 336000, // 3360€ en centimes
    currency: 'eur',
    features: [
      'Design responsive sur-mesure',
      'Optimisation SEO avancée',
      'Formulaire de contact intelligent',
      'Intégration réseaux sociaux',
      'Certificat SSL inclus',
      'Formation à la gestion',
      'Maintenance 6 mois incluse',
      'Support email prioritaire'
    ]
  },
  {
    id: 'professionnel',
    name: 'Package Professionnel',
    description: 'Solution complète avec fonctionnalités avancées',
    price: 520000, // 5200€ en centimes
    currency: 'eur',
    popular: true,
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
      'Sauvegarde automatique'
    ]
  },
  {
    id: 'boutique',
    name: 'Package Boutique',
    description: 'E-commerce complet avec gestion des stocks',
    price: 800000, // 8000€ en centimes
    currency: 'eur',
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
      'Intégration comptabilité'
    ]
  }
];

/**
 * Créer un client Stripe
 */
export async function createStripeCustomer(
  email: string,
  name: string,
  phone?: string,
  address?: Stripe.AddressParam
): Promise<Stripe.Customer> {
  return stripe.customers.create({
    email,
    name,
    phone,
    address,
    metadata: {
      source: 'sds_website'
    }
  });
}

/**
 * Créer un Payment Intent
 */
export async function createPaymentIntent(
  amount: number,
  currency: string = 'eur',
  customerId?: string,
  metadata?: Record<string, string>
): Promise<PaymentIntent> {
  const paymentIntent = await stripe.paymentIntents.create({
    amount,
    currency,
    customer: customerId,
    metadata: {
      ...metadata,
      source: 'sds_website'
    },
    automatic_payment_methods: {
      enabled: true,
    },
  });

  return {
    id: paymentIntent.id,
    amount: paymentIntent.amount,
    currency: paymentIntent.currency,
    status: paymentIntent.status,
    clientSecret: paymentIntent.client_secret!,
  };
}

/**
 * Créer une session de checkout
 */
export async function createCheckoutSession(
  productId: string,
  customerId?: string,
  successUrl?: string,
  cancelUrl?: string,
  metadata?: Record<string, string>
): Promise<Stripe.Checkout.Session> {
  const product = PRODUCTS.find(p => p.id === productId);
  if (!product) {
    throw new Error('Produit non trouvé');
  }

  return stripe.checkout.sessions.create({
    customer: customerId,
    payment_method_types: ['card', 'sepa_debit'],
    line_items: [
      {
        price_data: {
          currency: product.currency,
          product_data: {
            name: product.name,
            description: product.description,
            metadata: {
              productId: product.id,
            }
          },
          unit_amount: product.price,
        },
        quantity: 1,
      },
    ],
    mode: 'payment',
    success_url: successUrl || `${process.env.NEXT_PUBLIC_URL}/payment/success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: cancelUrl || `${process.env.NEXT_PUBLIC_URL}/payment/cancel`,
    metadata: {
      productId: product.id,
      ...metadata,
    },
    invoice_creation: {
      enabled: true,
    },
    payment_intent_data: {
      metadata: {
        productId: product.id,
        ...metadata,
      }
    }
  });
}

/**
 * Créer un abonnement
 */
export async function createSubscription(
  customerId: string,
  priceId: string,
  metadata?: Record<string, string>
): Promise<Stripe.Subscription> {
  return stripe.subscriptions.create({
    customer: customerId,
    items: [{ price: priceId }],
    metadata: {
      ...metadata,
      source: 'sds_website'
    },
    expand: ['latest_invoice.payment_intent'],
  });
}

/**
 * Récupérer les détails d'un paiement
 */
export async function getPaymentDetails(paymentIntentId: string): Promise<Stripe.PaymentIntent> {
  return stripe.paymentIntents.retrieve(paymentIntentId);
}

/**
 * Récupérer une session de checkout
 */
export async function getCheckoutSession(sessionId: string): Promise<Stripe.Checkout.Session> {
  return stripe.checkout.sessions.retrieve(sessionId, {
    expand: ['payment_intent', 'customer']
  });
}

/**
 * Créer une facture
 */
export async function createInvoice(
  customerId: string,
  items: Array<{
    description: string;
    amount: number;
    quantity?: number;
  }>,
  metadata?: Record<string, string>
): Promise<Stripe.Invoice> {
  // Créer les items de facture
  for (const item of items) {
    await stripe.invoiceItems.create({
      customer: customerId,
      amount: item.amount,
      currency: 'eur',
      description: item.description,
      quantity: item.quantity || 1,
    });
  }

  // Créer la facture
  const created = await stripe.invoices.create({
    customer: customerId,
    metadata: {
      ...metadata,
      source: 'sds_website'
    },
    auto_advance: false, // Ne pas envoyer automatiquement
  });

  // Compatibility with Stripe newer TS types returning Response<T>
  const invoiceId =
    (created as any)?.id ??
    (created as any)?.data?.id;

  if (!invoiceId) {
    throw new Error('Impossible de récupérer l’ID de la facture Stripe.');
  }

  // Finaliser la facture
  return stripe.invoices.finalizeInvoice(invoiceId);
}

/**
 * Envoyer une facture par email
 */
export async function sendInvoice(invoiceId: string): Promise<Stripe.Invoice> {
  return stripe.invoices.sendInvoice(invoiceId);
}

/**
 * Créer un remboursement
 */
export async function createRefund(
  paymentIntentId: string,
  amount?: number,
  reason?: string
): Promise<Stripe.Refund> {
  return stripe.refunds.create({
    payment_intent: paymentIntentId,
    amount,
    reason: reason as Stripe.RefundCreateParams.Reason,
    metadata: {
      source: 'sds_website'
    }
  });
}

/**
 * Webhook handler pour les événements Stripe
 */
export async function handleStripeWebhook(
  body: string,
  signature: string
): Promise<void> {
  const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET!;
  
  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(body, signature, endpointSecret);
  } catch (err) {
    console.error('Erreur signature webhook:', err);
    throw new Error('Signature webhook invalide');
  }

  // Traiter les différents types d'événements
  switch (event.type) {
    case 'payment_intent.succeeded':
      await handlePaymentSuccess(event.data.object as Stripe.PaymentIntent);
      break;
      
    case 'payment_intent.payment_failed':
      await handlePaymentFailed(event.data.object as Stripe.PaymentIntent);
      break;
      
    case 'checkout.session.completed':
      await handleCheckoutCompleted(event.data.object as Stripe.Checkout.Session);
      break;
      
    case 'invoice.payment_succeeded':
      await handleInvoicePaymentSucceeded(event.data.object as Stripe.Invoice);
      break;
      
    case 'customer.subscription.created':
      await handleSubscriptionCreated(event.data.object as Stripe.Subscription);
      break;
      
    case 'customer.subscription.deleted':
      await handleSubscriptionDeleted(event.data.object as Stripe.Subscription);
      break;
      
    default:
      console.log(`Événement non géré: ${event.type}`);
  }
}

/**
 * Gérer le succès d'un paiement
 */
async function handlePaymentSuccess(paymentIntent: Stripe.PaymentIntent): Promise<void> {
  console.log('✅ Paiement réussi:', paymentIntent.id);
  
  try {
    // Enregistrer le paiement en base
    await prisma.analyticsEvent.create({
      data: {
        name: 'payment_succeeded',
        category: 'form_submission',
        properties: {
          paymentIntentId: paymentIntent.id,
          amount: paymentIntent.amount,
          currency: paymentIntent.currency,
          productId: paymentIntent.metadata.productId,
        }
      }
    });

    // Envoyer un email de confirmation
    // TODO: Implémenter l'envoi d'email de confirmation
    
  } catch (error) {
    console.error('Erreur traitement paiement réussi:', error);
  }
}

/**
 * Gérer l'échec d'un paiement
 */
async function handlePaymentFailed(paymentIntent: Stripe.PaymentIntent): Promise<void> {
  console.log('❌ Paiement échoué:', paymentIntent.id);
  
  try {
    await prisma.analyticsEvent.create({
      data: {
        name: 'payment_failed',
        category: 'error',
        properties: {
          paymentIntentId: paymentIntent.id,
          amount: paymentIntent.amount,
          currency: paymentIntent.currency,
          lastPaymentError: paymentIntent.last_payment_error?.message,
        }
      }
    });
  } catch (error) {
    console.error('Erreur traitement paiement échoué:', error);
  }
}

/**
 * Gérer la completion d'une session checkout
 */
async function handleCheckoutCompleted(session: Stripe.Checkout.Session): Promise<void> {
  console.log('✅ Checkout complété:', session.id);
  
  try {
    // Récupérer les détails complets
    const fullSession = await stripe.checkout.sessions.retrieve(session.id, {
      expand: ['payment_intent', 'customer']
    });

    // Utilitaires pour extraire l'ID des unions string | object
    const extractId = (val: string | { id: string } | null | undefined): string | undefined => {
      if (!val) return undefined;
      if (typeof val === 'string') return val;
      return val.id;
    };

    const paymentIntentId = extractId(fullSession.payment_intent as any);
    const customerId = extractId(fullSession.customer as any);

    // Enregistrer la commande
    await prisma.analyticsEvent.create({
      data: {
        name: 'checkout_completed',
        category: 'form_submission',
        properties: {
          sessionId: session.id,
          paymentIntentId,
          customerId,
          amount: session.amount_total,
          currency: session.currency,
          productId: session.metadata?.productId,
        }
      }
    });

    // TODO: Créer le projet dans la base de données
    // TODO: Envoyer l'email de bienvenue avec les prochaines étapes
    
  } catch (error) {
    console.error('Erreur traitement checkout complété:', error);
  }
}

/**
 * Gérer le paiement d'une facture
 */
async function handleInvoicePaymentSucceeded(invoice: Stripe.Invoice): Promise<void> {
  console.log('✅ Facture payée:', invoice.id);
  
  // TODO: Mettre à jour le statut du projet
  // TODO: Envoyer la facture par email
}

/**
 * Gérer la création d'un abonnement
 */
async function handleSubscriptionCreated(subscription: Stripe.Subscription): Promise<void> {
  console.log('✅ Abonnement créé:', subscription.id);
  
  // TODO: Activer les fonctionnalités premium
}

/**
 * Gérer la suppression d'un abonnement
 */
async function handleSubscriptionDeleted(subscription: Stripe.Subscription): Promise<void> {
  console.log('❌ Abonnement supprimé:', subscription.id);
  
  // TODO: Désactiver les fonctionnalités premium
}

/**
 * Calculer le prix avec les aides France Num
 */
export function calculatePriceWithAid(
  originalPrice: number,
  aidAmount: number
): {
  originalPrice: number;
  aidAmount: number;
  finalPrice: number;
  savings: number;
} {
  const finalPrice = Math.max(0, originalPrice - aidAmount);
  const savings = originalPrice - finalPrice;
  
  return {
    originalPrice,
    aidAmount,
    finalPrice,
    savings,
  };
}

/**
 * Formater un montant en euros
 */
export function formatPrice(amount: number, currency: string = 'EUR'): string {
  return new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency,
  }).format(amount / 100);
}

export default stripe;

