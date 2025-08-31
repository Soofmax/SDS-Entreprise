import { NextRequest, NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe/config';
import { prisma } from '@/lib/db/prisma';
import { headers } from 'next/headers';
import Stripe from 'stripe';
import type { Contact as PrismaContact } from '@prisma/client';

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!;

async function getAdminUserId(): Promise<string | null> {
  if (process.env.ADMIN_USER_ID) return process.env.ADMIN_USER_ID;
  const admin = await prisma.user.findFirst({ where: { role: 'ADMIN' } });
  return admin?.id || null;
}

// POST /api/stripe/webhook - Gérer les webhooks Stripe
export async function POST(request: NextRequest) {
  try {
    const body = await request.text();
    const headersList = headers();
    const signature = headersList.get('stripe-signature');

    if (!signature) {
      console.error('Signature Stripe manquante');
      return NextResponse.json(
        { error: 'Signature manquante' },
        { status: 400 }
      );
    }

    let event: Stripe.Event;

    try {
      event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
    } catch (err) {
      console.error('Erreur validation webhook Stripe:', err);
      return NextResponse.json(
        { error: 'Signature invalide' },
        { status: 400 }
      );
    }

    console.log(`Webhook reçu: ${event.type}`);

    // Traiter les différents types d'événements
    switch (event.type) {
      case 'checkout.session.completed':
        await handleCheckoutCompleted(event.data.object as Stripe.Checkout.Session);
        break;

      case 'payment_intent.succeeded':
        await handlePaymentSucceeded(event.data.object as Stripe.PaymentIntent);
        break;

      case 'payment_intent.payment_failed':
        await handlePaymentFailed(event.data.object as Stripe.PaymentIntent);
        break;

      case 'invoice.payment_succeeded':
        await handleInvoicePaymentSucceeded(event.data.object as Stripe.Invoice);
        break;

      case 'invoice.payment_failed':
        await handleInvoicePaymentFailed(event.data.object as Stripe.Invoice);
        break;

      default:
        console.log(`Événement non géré: ${event.type}`);
    }

    return NextResponse.json({ received: true });

  } catch (error) {
    console.error('Erreur webhook Stripe:', error);
    return NextResponse.json(
      { error: 'Erreur serveur' },
      { status: 500 }
    );
  }
}

// Gérer la completion d'un checkout
async function handleCheckoutCompleted(session: Stripe.Checkout.Session) {
  try {
    console.log('Checkout complété:', session.id);

    const customerEmail = session.customer_details?.email;
    const customerName = session.customer_details?.name;
    const packageId = session.metadata?.package_id;
    const packageName = session.metadata?.package_name;

    if (!customerEmail) {
      console.error('Email client manquant dans la session');
      return;
    }

    // Mettre à jour le contact existant ou en créer un nouveau (email non unique => upsert manuel)
    let contact: PrismaContact;
    const existing = await prisma.contact.findFirst({ where: { email: customerEmail } });
    if (existing) {
      contact = await prisma.contact.update({
        where: { id: existing.id },
        data: {
          status: 'WON',
          ...(customerName ? { name: customerName } : {}),
        },
      });
    } else {
      contact = await prisma.contact.create({
        data: {
          name: customerName || 'Client Stripe',
          email: customerEmail,
          phone: session.customer_details?.phone || '',
          company: session.metadata?.company || '',
          message: `Commande ${packageName} payée via Stripe`,
          projectType: (session.metadata?.project_type as any) || 'SITE_VITRINE',
          budget: session.amount_total ? session.amount_total / 100 : 0,
          status: 'WON',
          source: 'stripe_payment',
        },
      });
    }

    const adminUserId = await getAdminUserId();
    if (!adminUserId) {
      console.warn('No admin user found; skipping project/invoice creation for Stripe checkout.');
      return;
    }

    // Créer automatiquement un projet
    const project = await prisma.project.create({
      data: {
        title: `Projet ${packageName} - ${contact.company || contact.name}`,
        description: `Projet ${packageName} commandé et payé via Stripe. Session: ${session.id}`,
        type: (session.metadata?.project_type as any) || 'SITE_VITRINE',
        contactId: contact.id,
        budget: session.amount_total ? session.amount_total / 100 : 0,
        timeline: packageId === 'essentiel' ? 10 : packageId === 'professionnel' ? 14 : 21,
        technologies: ['Next.js', 'TypeScript', 'Tailwind CSS', 'Prisma'],
        features: packageId === 'boutique' 
          ? ['E-commerce', 'Gestion stocks', 'Paiements', 'Analytics']
          : packageId === 'professionnel'
          ? ['CMS', 'Réservation', 'Analytics', 'SEO']
          : ['Design responsive', 'SEO', 'Contact'],
        userId: adminUserId,
      },
    });

    // Créer une facture
    await prisma.invoice.create({
      data: {
        number: `INV-${new Date().getFullYear()}-${String(Date.now()).slice(-6)}`,
        projectId: project.id,
        subtotal: session.amount_subtotal || 0,
        taxAmount: (session.amount_total || 0) - (session.amount_subtotal || 0),
        total: session.amount_total || 0,
        status: 'PAID',
        paidDate: new Date(),
        stripePaymentIntentId: session.payment_intent as string,
        dueDate: new Date(), // Déjà payé
      },
    });

    console.log(`Projet créé: ${project.id} pour le contact: ${contact.id}`);

    // TODO: Envoyer email de confirmation
    // await sendWelcomeEmail(contact, project, packageName);

  } catch (error) {
    console.error('Erreur traitement checkout complété:', error);
  }
}

// Gérer le succès d'un paiement
async function handlePaymentSucceeded(paymentIntent: Stripe.PaymentIntent) {
  try {
    console.log('Paiement réussi:', paymentIntent.id);

    // Mettre à jour le statut de la facture
    await prisma.invoice.updateMany({
      where: { stripePaymentIntentId: paymentIntent.id },
      data: {
        status: 'PAID',
        paidDate: new Date(),
      },
    });

    // TODO: Envoyer email de confirmation de paiement
    // await sendPaymentConfirmationEmail(paymentIntent);

  } catch (error) {
    console.error('Erreur traitement paiement réussi:', error);
  }
}

// Gérer l'échec d'un paiement
async function handlePaymentFailed(paymentIntent: Stripe.PaymentIntent) {
  try {
    console.log('Paiement échoué:', paymentIntent.id);

    // Mettre à jour le statut de la facture
    await prisma.invoice.updateMany({
      where: { stripePaymentIntentId: paymentIntent.id },
      data: {
        status: 'OVERDUE',
      },
    });

    // TODO: Envoyer email d'échec de paiement
    // await sendPaymentFailedEmail(paymentIntent);

  } catch (error) {
    console.error('Erreur traitement paiement échoué:', error);
  }
}

// Gérer le succès d'un paiement de facture
async function handleInvoicePaymentSucceeded(invoice: Stripe.Invoice) {
  try {
    console.log('Paiement facture réussi:', invoice.id);

    await prisma.invoice.updateMany({
      where: { stripeInvoiceId: invoice.id },
      data: {
        status: 'PAID',
        paidDate: new Date(),
      },
    });

  } catch (error) {
    console.error('Erreur traitement paiement facture réussi:', error);
  }
}

// Gérer l'échec d'un paiement de facture
async function handleInvoicePaymentFailed(invoice: Stripe.Invoice) {
  try {
    console.log('Paiement facture échoué:', invoice.id);

    await prisma.invoice.updateMany({
      where: { stripeInvoiceId: invoice.id },
      data: {
        status: 'OVERDUE',
      },
    });

  } catch (error) {
    console.error('Erreur traitement paiement facture échoué:', error);
  }
}

