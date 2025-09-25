// Coinbase Commerce Integration for SDS
// Handles crypto payments through Coinbase Commerce API

import { CRYPTO_CONFIG } from './config';

export interface CoinbaseChargeData {
  name: string;
  description: string;
  local_price: {
    amount: string;
    currency: string;
  };
  pricing_type: 'fixed_price';
  metadata: {
    package: string;
    customer_email?: string;
    customer_name?: string;
    source?: string;
  };
  redirect_url?: string;
  cancel_url?: string;
}

export interface CoinbaseCharge {
  id: string;
  code: string;
  name: string;
  description: string;
  hosted_url: string;
  created_at: string;
  expires_at: string;
  timeline: Array<{
    time: string;
    status: string;
  }>;
  metadata: Record<string, any>;
  pricing: {
    local: { amount: string; currency: string };
    bitcoin?: { amount: string; currency: string };
    ethereum?: { amount: string; currency: string };
    usdc?: { amount: string; currency: string };
    usdt?: { amount: string; currency: string };
  };
  payments: Array<{
    network: string;
    transaction_id: string;
    status: string;
    value: {
      local: { amount: string; currency: string };
      crypto: { amount: string; currency: string };
    };
  }>;
}

class CoinbaseCommerceService {
  private apiKey: string;
  private baseUrl: string;

  constructor() {
    this.apiKey = process.env.COINBASE_COMMERCE_API_KEY || '';
    this.baseUrl = CRYPTO_CONFIG.API_ENDPOINTS.COINBASE_COMMERCE;
  }

  private async makeRequest(endpoint: string, options: RequestInit = {}) {
    if (!this.apiKey) {
      throw new Error('Coinbase Commerce API key not configured');
    }

    const url = `${this.baseUrl}${endpoint}`;
    
    const response = await fetch(url, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        'X-CC-Api-Key': this.apiKey,
        'X-CC-Version': '2018-03-22',
        ...options.headers,
      },
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      throw new Error(`Coinbase Commerce API error: ${response.status} - ${error.error?.message || 'Unknown error'}`);
    }

    return response.json();
  }

  async createCharge(data: CoinbaseChargeData): Promise<CoinbaseCharge> {
    try {
      const response = await this.makeRequest('/charges', {
        method: 'POST',
        body: JSON.stringify(data),
      });

      return response.data;
    } catch (error) {
      console.error('Error creating Coinbase charge:', error);
      throw error;
    }
  }

  async getCharge(chargeId: string): Promise<CoinbaseCharge> {
    try {
      const response = await this.makeRequest(`/charges/${chargeId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching Coinbase charge:', error);
      throw error;
    }
  }

  async listCharges(limit: number = 25): Promise<CoinbaseCharge[]> {
    try {
      const response = await this.makeRequest(`/charges?limit=${limit}`);
      return response.data;
    } catch (error) {
      console.error('Error listing Coinbase charges:', error);
      throw error;
    }
  }

  // Create charge for SDS package
  async createPackageCharge(
    packageType: 'ESSENTIEL' | 'PROFESSIONNEL' | 'BOUTIQUE',
    customerData?: {
      email?: string;
      name?: string;
    }
  ): Promise<CoinbaseCharge> {
    const price = CRYPTO_CONFIG.PACKAGE_PRICES[packageType];
    const priceInEur = (price / 100).toFixed(2);

    const packageNames = {
      ESSENTIEL: 'Package Essentiel - Site Vitrine',
      PROFESSIONNEL: 'Package Professionnel - Solution Complète',
      BOUTIQUE: 'Package Boutique - E-commerce Complet'
    };

    const packageDescriptions = {
      ESSENTIEL: 'Site vitrine professionnel avec design sur-mesure et optimisation SEO complète.',
      PROFESSIONNEL: 'Solution complète avec fonctionnalités avancées et système de gestion client.',
      BOUTIQUE: 'E-commerce complet avec gestion des stocks et paiements sécurisés.'
    };

    const chargeData: CoinbaseChargeData = {
      name: packageNames[packageType],
      description: packageDescriptions[packageType],
      local_price: {
        amount: priceInEur,
        currency: 'EUR'
      },
      pricing_type: 'fixed_price',
      metadata: {
        package: packageType,
        customer_email: customerData?.email,
        customer_name: customerData?.name,
        source: 'sds-website'
      },
      redirect_url: `${process.env.NEXT_PUBLIC_APP_URL}/success?payment=crypto`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/services?payment=cancelled`
    };

    return this.createCharge(chargeData);
  }

  // Verify webhook signature
  verifyWebhookSignature(payload: string, signature: string): boolean {
    const crypto = require('crypto');
    const webhookSecret = process.env.COINBASE_COMMERCE_WEBHOOK_SECRET || '';
    
    if (!webhookSecret) {
      console.warn('Coinbase Commerce webhook secret not configured');
      return false;
    }

    const computedSignature = crypto
      .createHmac('sha256', webhookSecret)
      .update(payload, 'utf8')
      .digest('hex');

    return crypto.timingSafeEqual(
      Buffer.from(signature, 'hex'),
      Buffer.from(computedSignature, 'hex')
    );
  }

  // Handle webhook events
  async handleWebhook(event: any) {
    const { type, data } = event;

    switch (type) {
      case 'charge:created':
        console.log('Crypto charge created:', data.id);
        break;
        
      case 'charge:confirmed':
        console.log('Crypto payment confirmed:', data.id);
        // Update order status, send confirmation email, etc.
        await this.handlePaymentConfirmed(data);
        break;
        
      case 'charge:failed':
        console.log('Crypto payment failed:', data.id);
        await this.handlePaymentFailed(data);
        break;
        
      case 'charge:delayed':
        console.log('Crypto payment delayed:', data.id);
        break;
        
      case 'charge:pending':
        console.log('Crypto payment pending:', data.id);
        break;
        
      default:
        console.log('Unknown webhook event:', type);
    }
  }

  private async handlePaymentConfirmed(charge: CoinbaseCharge) {
    try {
      // Extract metadata
      const { package: packageType, customer_email, customer_name } = charge.metadata;
      
      // Create project in database
      // Send confirmation email
      // Update analytics
      
      console.log(`Payment confirmed for package ${packageType}`);
    } catch (error) {
      console.error('Error handling payment confirmation:', error);
    }
  }

  private async handlePaymentFailed(charge: CoinbaseCharge) {
    try {
      // Log failed payment
      // Send notification to admin
      // Update analytics
      
      console.log(`Payment failed for charge ${charge.id}`);
    } catch (error) {
      console.error('Error handling payment failure:', error);
    }
  }
}

export const coinbaseCommerce = new CoinbaseCommerceService();

