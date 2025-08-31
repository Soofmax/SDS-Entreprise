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

    const amountFloat = parseFloat(charge?.pricing?.local?.amount);
    const amountCents = isNaN(amountFloat) ? 0 : Math.round(amountFloat * 100);
    const currency = charge?.pricing?.local?.currency;

    // Enregistrer un évènement analytics compatible avec le schéma actuel
    await prisma.analytics.create({
      data: {
        event: 'crypto_charge_created',
        page: '/api/crypto/webhook',
        sessionId: charge.id,
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

    // Créer une facture minimale associée à ce paiement (alignée avec le schéma Prisma)
    await prisma.invoice.create({
      data: {
        number: `CB-${charge.id}`,
        status: 'SENT',
        subtotal: amountCents,
        taxRate: 0,
        taxAmount: 0,
        total: amountCents,
        dueDate: new Date(), // échéance immédiate par défaut
        stripeInvoiceId: charge.id
      }
    });

  } catch (error) {
    console.error('Error handling charge created:', error);
  }
}

async function handleChargeConfirmed(charge: any) {
  try {
    console.log(`Crypto payment confirmed: ${charge.id}`);
    
    // Update invoice status (si une facture correspondante existe)
    await prisma.invoice.updateMany({
      where: {
        stripeInvoiceId: charge.id
      },
      data: {
        status: 'PAID',
        paidDate: new Date()
      }
    });

    const payment = charge?.payments?.[0];

    // Journaliser l'évènement dans la table analytics conforme au schéma courant
    await prisma.analytics.create({
      data: {
        event: 'crypto_payment_confirmed',
        page: '/api/crypto/webhook',
        sessionId: charge.id,
        properties: {
          packageType: charge?.metadata?.package,
          amount: parseFloat(charge?.pricing?.local?.amount),
          currency: charge?.pricing?.local?.currency,
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
    
    // Update invoice status
    await prisma.invoice.updateMany({
      where: {
        stripeInvoiceId: charge.id
      },
      data: {
        status: 'CANCELLED'
      }
    });

    // Journaliser l'évènement d'échec
    await prisma.analytics.create({
      data: {
        event: 'crypto_payment_failed',
        page: '/api/crypto/webhook',
        sessionId: charge.id,
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
    
    // Update invoice status
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
    
    // Update invoice status
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

