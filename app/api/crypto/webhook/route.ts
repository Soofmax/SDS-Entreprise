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

async function handleChargeCreated(charge: any) {
  try {
    // Log charge creation
    console.log(`Crypto charge created: ${charge.id}`);
    
    // Store in database for tracking
    await prisma.invoice.create({
      data: {
        stripeInvoiceId: charge.id,
        amount: parseFloat(charge.pricing.local.amount) * 100, // Convert to cents
        currency: charge.pricing.local.currency,
        status: 'PENDING',
        paymentMethod: 'CRYPTO',
        metadata: {
          coinbaseChargeId: charge.id,
          packageType: charge.metadata.package,
          customerEmail: charge.metadata.customer_email,
          customerName: charge.metadata.customer_name,
          paymentType: 'coinbase_commerce'
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
    
    // Update invoice status
    await prisma.invoice.updateMany({
      where: {
        stripeInvoiceId: charge.id
      },
      data: {
        status: 'PAID',
        paidAt: new Date()
      }
    });

    // Extract payment details
    const payment = charge.payments?.[0];
    const packageType = charge.metadata.package;
    const customerEmail = charge.metadata.customer_email;
    const customerName = charge.metadata.customer_name;

    // Create or update contact
    let contact = null;
    if (customerEmail) {
      contact = await prisma.contact.upsert({
        where: { email: customerEmail },
        update: {
          status: 'WON',
          notes: `Crypto payment confirmed for ${packageType} package`
        },
        create: {
          name: customerName || 'Crypto Customer',
          email: customerEmail,
          status: 'WON',
          projectType: packageType,
          budget: parseFloat(charge.pricing.local.amount),
          source: 'CRYPTO_PAYMENT',
          notes: `Crypto payment confirmed for ${packageType} package`
        }
      });
    }

    // Create project automatically
    if (contact) {
      await prisma.project.create({
        data: {
          title: `${packageType} - ${customerName || 'Crypto Customer'}`,
          description: `Project created from crypto payment for ${packageType} package`,
          status: 'PLANNING',
          priority: 'MEDIUM',
          budget: parseFloat(charge.pricing.local.amount),
          contactId: contact.id,
          startDate: new Date(),
          metadata: {
            paymentMethod: 'crypto',
            coinbaseChargeId: charge.id,
            transactionHash: payment?.transaction_id,
            cryptoCurrency: payment?.value?.crypto?.currency,
            cryptoAmount: payment?.value?.crypto?.amount
          }
        }
      });
    }

    // Send confirmation email (if email service is configured)
    if (customerEmail) {
      await sendCryptoPaymentConfirmation({
        email: customerEmail,
        name: customerName,
        packageType,
        amount: charge.pricing.local.amount,
        currency: charge.pricing.local.currency,
        transactionHash: payment?.transaction_id,
        cryptoCurrency: payment?.value?.crypto?.currency,
        cryptoAmount: payment?.value?.crypto?.amount
      });
    }

    // Update analytics
    await prisma.analyticsEvent.create({
      data: {
        eventType: 'CRYPTO_PAYMENT_CONFIRMED',
        eventData: {
          packageType,
          amount: parseFloat(charge.pricing.local.amount),
          currency: charge.pricing.local.currency,
          cryptoCurrency: payment?.value?.crypto?.currency,
          cryptoAmount: payment?.value?.crypto?.amount,
          paymentMethod: 'coinbase_commerce'
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
    
    // Update invoice status
    await prisma.invoice.updateMany({
      where: {
        stripeInvoiceId: charge.id
      },
      data: {
        status: 'FAILED'
      }
    });

    // Update analytics
    await prisma.analyticsEvent.create({
      data: {
        eventType: 'CRYPTO_PAYMENT_FAILED',
        eventData: {
          packageType: charge.metadata.package,
          amount: parseFloat(charge.pricing.local.amount),
          currency: charge.pricing.local.currency,
          reason: 'payment_failed'
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
    
    // Update invoice status
    await prisma.invoice.updateMany({
      where: {
        stripeInvoiceId: charge.id
      },
      data: {
        status: 'PROCESSING'
      }
    });

  } catch (error) {
    console.error('Error handling charge delayed:', error);
  }
}

async function handleChargePending(charge: any) {
  try {
    console.log(`Crypto payment pending: ${charge.id}`);
    
    // Update invoice status
    await prisma.invoice.updateMany({
      where: {
        stripeInvoiceId: charge.id
      },
      data: {
        status: 'PENDING'
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
    // This would integrate with your email service (Resend, etc.)
    console.log('Sending crypto payment confirmation email to:', data.email);
    
    // Example email content
    const emailContent = `
      Bonjour ${data.name || 'Client'},
      
      Votre paiement crypto a été confirmé avec succès !
      
      Détails de la commande :
      - Package : ${data.packageType}
      - Montant : ${data.amount} ${data.currency}
      - Crypto payée : ${data.cryptoAmount} ${data.cryptoCurrency}
      - Transaction : ${data.transactionHash}
      
      Nous allons commencer votre projet dans les plus brefs délais.
      
      Cordialement,
      L'équipe SDS
    `;

    // Here you would call your email service
    // await emailService.send({
    //   to: data.email,
    //   subject: 'Confirmation de paiement crypto - SDS',
    //   text: emailContent
    // });

  } catch (error) {
    console.error('Error sending confirmation email:', error);
  }
}

