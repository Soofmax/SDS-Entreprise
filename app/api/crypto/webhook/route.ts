import { NextRequest, NextResponse } from 'next/server';
import { coinbaseCommerce } from '@/lib/crypto/coinbase-commerce';
import { prisma } from '@/lib/db/prisma';

export async function POST(request: NextRequest) {
  try {
    const body = await request.text();
    const signature = request.headers.get('x-cc-webhook-signature') || '';

    // Verify Coinbase Commerce webhook signature
    if (!coinbaseCommerce.verifyWebhookSignature(body, signature)) {
      console.error('Invalid webhook signature');
      return NextResponse.json(
        { error: 'Invalid signature' },
        { status: 401 }
      );
    }

    const event = JSON.parse(body);
    
    // Handle different event types
    switch (event.type) {
      case 'charge:created':
        await handleChargeCreated(event.data);
        break;
        
      case 'charge:confirmed':
        await handleChargeConfirmed(event.data);
        break;
        
      case 'charge:failed':
        await handleChargeFailed(event.data);
        break;
        
      case 'charge:delayed':
        await handleChargeDelayed(event.data);
        break;
        
      case 'charge:pending':
        await handleChargePending(event.data);
        break;
        
      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    return NextResponse.json({ success: true });

  } catch (error) {
    console.error('Webhook processing error:', error);
    return NextResponse.json(
      { error: 'Webhook processing failed' },
      { status: 500 }
    );
  }
}

function mapPackageToProjectType(pkg?: string) {
  switch (pkg) {
    case 'BOUTIQUE':
      return 'ECOMMERCE';
    case 'ESSENTIEL':
    case 'PROFESSIONNEL':
      return 'SITE_VITRINE';
    default:
      return 'OTHER';
  }
}

async function getAdminUserId(): Promise<string | null> {
  if (process.env.ADMIN_USER_ID) return process.env.ADMIN_USER_ID;
  const admin = await prisma.user.findFirst({ where: { role: 'ADMIN' } });
  return admin?.id || null;
}

async function handleChargeCreated(charge: any) {
  try {
    // Log charge creation
    console.log(`Crypto charge created: ${charge.id}`);

    const amountFloat = parseFloat(charge?.pricing?.local?.amount);
    const currency = charge?.pricing?.local?.currency;

    // Log event in AnalyticsEvent (standardized)
    await prisma.analyticsEvent.create({
      data: {
        name: 'crypto_charge_created',
        category: 'payment',
        sessionId: charge.id,
        page: '/api/crypto/webhook',
        properties: {
          coinbaseChargeId: charge.id,
          packageType: charge?.metadata?.package,
          customerEmail: charge?.metadata?.customer_email,
          customerName: charge?.metadata?.customer_name,
          amount: amountFloat,
          currency,
          provider: 'coinbase_commerce'
        }
      }
    });

  } catch (error) {
    console.error('Error handling charge created:', error);
  }
}

async function handleChargeConfirmed(charge: any) {
  try {
    console.log(`Crypto payment confirmed: ${charge.id}`);
    
    const amountFloat = parseFloat(charge?.pricing?.local?.amount);
    const amountCents = isNaN(amountFloat) ? 0 : Math.round(amountFloat * 100);
    const currency = charge?.pricing?.local?.currency;
    const packageType = charge?.metadata?.package as string | undefined;
    const customerEmail = charge?.metadata?.customer_email as string | undefined;
    const customerName = charge?.metadata?.customer_name as string | undefined;

    // Update any existing invoice to PAID
    await prisma.invoice.updateMany({
      where: { stripeInvoiceId: charge.id },
      data: { status: 'PAID', paidDate: new Date() }
    });

    // Create or update contact
    let contactId: string | null = null;
    if (customerEmail) {
      const contact = await prisma.contact.upsert({
        where: { email: customerEmail },
        update: {
          status: 'WON',
          ...(customerName ? { name: customerName } : {}),
          source: 'CRYPTO_PAYMENT'
        },
        create: {
          name: customerName || 'Client Crypto',
          email: customerEmail,
          message: `Commande ${packageType || ''} payée via crypto`,
          projectType: mapPackageToProjectType(packageType) as any,
          budget: amountFloat ? Math.round(amountFloat) : 0,
          status: 'WON',
          source: 'CRYPTO_PAYMENT'
        }
      });
      contactId = contact.id;
    }

    // Create project and invoice if we have an admin user and contact
    const adminUserId = await getAdminUserId();
    if (adminUserId && contactId) {
      // Project upsert based on unique contactId
      const project = await prisma.project.upsert({
        where: { contactId: contactId },
        update: {
          status: 'IN_PROGRESS',
          budget: amountFloat ? Math.round(amountFloat) : 0
        },
        create: {
          title: `${packageType || 'Package'} - ${customerName || 'Client Crypto'}`,
          description: `Projet créé depuis un paiement crypto confirmé (Coinbase).`,
          type: mapPackageToProjectType(packageType) as any,
          contactId: contactId,
          budget: amountFloat ? Math.round(amountFloat) : 0,
          timeline: packageType === 'ESSENTIEL' ? 10 : packageType === 'PROFESSIONNEL' ? 14 : 21,
          technologies: ['Next.js', 'TypeScript', 'Tailwind CSS', 'Prisma'],
          features: packageType === 'BOUTIQUE' 
            ? ['E-commerce', 'Gestion stocks', 'Paiements', 'Analytics']
            : packageType === 'PROFESSIONNEL'
            ? ['CMS', 'Réservation', 'Analytics', 'SEO']
            : ['Design responsive', 'SEO', 'Contact'],
          userId: adminUserId
        }
      });

      // Upsert invoice by unique number
      const invoiceNumber = `CB-${charge.id}`;
      await prisma.invoice.upsert({
        where: { number: invoiceNumber },
        update: {
          status: 'PAID',
          paidDate: new Date(),
          total: amountCents,
          taxAmount: 0,
          subtotal: amountCents
        },
        create: {
          number: invoiceNumber,
          projectId: project.id,
          subtotal: amountCents,
          taxRate: 0,
          taxAmount: 0,
          total: amountCents,
          status: 'PAID',
          paidDate: new Date(),
          stripeInvoiceId: charge.id,
          dueDate: new Date()
        }
      });
    } else {
      if (!adminUserId) {
        console.warn('No admin user found; skipping project/invoice creation for crypto payment.');
      }
      if (!contactId) {
        console.warn('No contact email provided; skipping project/invoice creation for crypto payment.');
      }
    }

    const payment = charge?.payments?.[0];

    // Log confirmed payment
    await prisma.analyticsEvent.create({
      data: {
        name: 'crypto_payment_confirmed',
        category: 'payment',
        sessionId: charge.id,
        page: '/api/crypto/webhook',
        properties: {
          packageType,
          amount: amountFloat,
          currency,
          cryptoCurrency: payment?.value?.crypto?.currency,
          cryptoAmount: payment?.value?.crypto?.amount,
          transactionHash: payment?.transaction_id,
          provider: 'coinbase_commerce'
        }
      }
    });

  } catch (error) {
    console.error('Error handling charge confirmed:', error);
  }
}

async function handleChargeFailed(charge: any) {
  try {
    console.log(`Crypto payment failed: ${charge.id}`);
    
    // Update invoice status if exists
    await prisma.invoice.updateMany({
      where: {
        stripeInvoiceId: charge.id
      },
      data: {
        status: 'CANCELLED'
      }
    });

    // Log failure
    await prisma.analyticsEvent.create({
      data: {
        name: 'crypto_payment_failed',
        category: 'payment',
        sessionId: charge.id,
        page: '/api/crypto/webhook',
        properties: {
          packageType: charge?.metadata?.package,
          amount: parseFloat(charge?.pricing?.local?.amount),
          currency: charge?.pricing?.local?.currency,
          reason: 'payment_failed',
          provider: 'coinbase_commerce'
        }
      }
    });

  } catch (error) {
    console.error('Error handling charge failed:', error);
  }
}

async function handleChargeDelayed(charge: any) {
  try {
    console.log(`Crypto payment delayed: ${charge.id}`);
    
    // Reflect delayed as SENT (in-progress) if invoice exists
    await prisma.invoice.updateMany({
      where: {
        stripeInvoiceId: charge.id
      },
      data: {
        status: 'SENT'
      }
    });

  } catch (error) {
    console.error('Error handling charge delayed:', error);
  }
}

async function handleChargePending(charge: any) {
  try {
    console.log(`Crypto payment pending: ${charge.id}`);
    
    await prisma.invoice.updateMany({
      where: {
        stripeInvoiceId: charge.id
      },
      data: {
        status: 'SENT'
      }
    });

  } catch (error) {
    console.error('Error handling charge pending:', error);
  }
}

async function sendCryptoPaymentConfirmation(data: {
  email: string;
  name?: string;
  packageType: string;
  amount: string;
  currency: string;
  transactionHash?: string;
  cryptoCurrency?: string;
  cryptoAmount?: string;
}) {
  try {
    // Send email confirmation
    // Integrate with email service as needed
    console.log('Sending crypto payment confirmation email to:', data.email);
  } catch (error) {
    console.error('Error sending confirmation email:', error);
  }
}

