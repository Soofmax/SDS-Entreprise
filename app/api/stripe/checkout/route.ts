import { NextRequest, NextResponse } from 'next/server';
import { stripe, PACKAGES, getStripeMetadata, PackageId } from '@/lib/stripe/config';
import { prisma } from '@/lib/db/prisma';
import { headers } from 'next/headers';

// POST /api/stripe/checkout - Créer une session de paiement
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      packageId,
      customerInfo,
      successUrl,
      cancelUrl,
    } = body;

    // Validation
    if (!packageId || !PACKAGES[packageId as PackageId]) {
      return NextResponse.json(
        { error: 'Package invalide' },
        { status: 400 }
      );
    }

    if (!customerInfo?.email) {
      return NextResponse.json(
        { error: 'Email client requis' },
        { status: 400 }
      );
    }

    const selectedPackage = PACKAGES[packageId as PackageId];
    const headersList = headers();
    const origin = headersList.get('origin') || 'http://localhost:3000';

    // Créer ou récupérer le client Stripe
    let customer;
    const existingCustomers = await stripe.customers.list({
      email: customerInfo.email,
      limit: 1,
    });

    if (existingCustomers.data.length > 0) {
      customer = existingCustomers.data[0];
    } else {
      customer = await stripe.customers.create({
        email: customerInfo.email,
        name: customerInfo.name,
        phone: customerInfo.phone,
        metadata: {
          company: customerInfo.company || '',
          source: 'sds_website',
        },
      });
    }

    // Créer la session de checkout
    const session = await stripe.checkout.sessions.create({
      customer: customer.id,
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'eur',
            product_data: {
              name: selectedPackage.name,
              description: selectedPackage.description,
              images: [`${origin}/images/packages/${packageId}.jpg`], // Image du package
              metadata: {
                package_id: packageId,
                delivery_time: selectedPackage.deliveryTime,
                revisions: selectedPackage.revisions.toString(),
                guarantee: selectedPackage.guarantee.toString(),
              },
            },
            unit_amount: selectedPackage.price,
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: successUrl || `${origin}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: cancelUrl || `${origin}/`,
      metadata: getStripeMetadata(packageId as PackageId, customerInfo),
      payment_intent_data: {
        metadata: getStripeMetadata(packageId as PackageId, customerInfo),
      },
      custom_fields: [
        {
          key: 'project_details',
          label: {
            type: 'custom',
            custom: 'Détails du projet (optionnel)',
          },
          type: 'text',
          optional: true,
        },
      ],
      phone_number_collection: {
        enabled: true,
      },
      billing_address_collection: 'required',
      shipping_address_collection: {
        allowed_countries: ['FR', 'BE', 'CH', 'CA'],
      },
      automatic_tax: {
        enabled: true,
      },
      tax_id_collection: {
        enabled: true,
      },
      expires_at: Math.floor(Date.now() / 1000) + (24 * 60 * 60), // 24h
    });

    // Enregistrer la session en base pour le suivi
    await prisma.contact.create({
      data: {
        name: customerInfo.name,
        email: customerInfo.email,
        phone: customerInfo.phone || '',
        company: customerInfo.company || '',
        message: `Commande ${selectedPackage.name} - Session Stripe: ${session.id}`,
        projectType: customerInfo.projectType || 'SITE_VITRINE',
        budget: selectedPackage.price / 100, // Convertir en euros
        status: 'NEW',
        source: 'stripe_checkout',
        // Métadonnées Stripe
        ipAddress: request.headers.get('x-forwarded-for') || 'unknown',
        userAgent: request.headers.get('user-agent') || 'unknown',
      },
    });

    return NextResponse.json({
      sessionId: session.id,
      url: session.url,
      customer: {
        id: customer.id,
        email: customer.email,
      },
    });

  } catch (error) {
    console.error('Erreur création checkout Stripe:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la création du paiement' },
      { status: 500 }
    );
  }
}

// GET /api/stripe/checkout - Récupérer une session
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const sessionId = searchParams.get('session_id');

    if (!sessionId) {
      return NextResponse.json(
        { error: 'Session ID requis' },
        { status: 400 }
      );
    }

    const session = await stripe.checkout.sessions.retrieve(sessionId, {
      expand: ['customer', 'payment_intent'],
    });

    // Informations sécurisées pour le client
    const safeSession = {
      id: session.id,
      status: session.status,
      payment_status: session.payment_status,
      customer_email: session.customer_details?.email,
      customer_name: session.customer_details?.name,
      amount_total: session.amount_total,
      currency: session.currency,
      metadata: session.metadata,
      created: session.created,
    };

    return NextResponse.json(safeSession);

  } catch (error) {
    console.error('Erreur récupération session Stripe:', error);
    return NextResponse.json(
      { error: 'Session non trouvée' },
      { status: 404 }
    );
  }
}

