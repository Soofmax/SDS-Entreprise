'use client';

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { CreditCard, Wallet, Bitcoin } from 'lucide-react';
import { CRYPTO_CONFIG } from '@/lib/crypto/config';
import { coinbaseCommerce } from '@/lib/crypto/coinbase-commerce';
import { web3Wallet } from '@/lib/crypto/web3-wallet';

interface PaymentSelectorProps {
  packageType: 'ESSENTIEL' | 'PROFESSIONNEL' | 'BOUTIQUE';
  onPaymentInitiated?: (method: string, data: any) => void;
  customerData?: {
    email?: string;
    name?: string;
  };
}

interface CryptoPrices {
  BTC: number;
  ETH: number;
  USDC: number;
  USDT: number;
}

export default function PaymentSelector({ 
  packageType, 
  onPaymentInitiated,
  customerData 
}: PaymentSelectorProps) {
  const [selectedMethod, setSelectedMethod] = useState<'stripe' | 'coinbase' | 'web3'>('stripe');
  const [selectedCrypto, setSelectedCrypto] = useState<'BTC' | 'ETH' | 'USDC' | 'USDT'>('BTC');
  const [cryptoPrices, setCryptoPrices] = useState<CryptoPrices | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [walletConnected, setWalletConnected] = useState(false);
  const [walletAddress, setWalletAddress] = useState<string>('');

  const packagePrice = CRYPTO_CONFIG.PACKAGE_PRICES[packageType] / 100; // Convert to EUR

  // Fetch crypto prices
  useEffect(() => {
    const fetchPrices = async () => {
      try {
        const response = await fetch(
          `${CRYPTO_CONFIG.API_ENDPOINTS.COINGECKO_PRICES}?ids=bitcoin,ethereum,usd-coin,tether&vs_currencies=eur`
        );
        const data = await response.json();
        
        setCryptoPrices({
          BTC: data.bitcoin?.eur || 45000,
          ETH: data.ethereum?.eur || 3000,
          USDC: data['usd-coin']?.eur || 0.85,
          USDT: data.tether?.eur || 0.85
        });
      } catch (error) {
        console.error('Error fetching crypto prices:', error);
        // Fallback prices
        setCryptoPrices({
          BTC: 45000,
          ETH: 3000,
          USDC: 0.85,
          USDT: 0.85
        });
      }
    };

    fetchPrices();
    const interval = setInterval(fetchPrices, 30000); // Update every 30 seconds

    return () => clearInterval(interval);
  }, []);

  // Calculate crypto amount
  const getCryptoAmount = (currency: keyof CryptoPrices): string => {
    if (!cryptoPrices) return '0';
    const amount = packagePrice / cryptoPrices[currency];
    const decimals = CRYPTO_CONFIG.SUPPORTED_CURRENCIES[currency].decimals;
    return amount.toFixed(decimals > 6 ? 6 : decimals);
  };

  // Handle Stripe payment
  const handleStripePayment = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/stripe/checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          packageType,
          customerData,
          paymentMethod: 'stripe'
        }),
      });

      const { url } = await response.json();
      
      if (url) {
        window.location.href = url;
        onPaymentInitiated?.('stripe', { url });
      }
    } catch (error) {
      console.error('Error initiating Stripe payment:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle Coinbase Commerce payment
  const handleCoinbasePayment = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/crypto/coinbase', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          packageType,
          customerData,
          paymentMethod: 'coinbase'
        }),
      });

      const { charge } = await response.json();
      
      if (charge?.hosted_url) {
        window.location.href = charge.hosted_url;
        onPaymentInitiated?.('coinbase', charge);
      }
    } catch (error) {
      console.error('Error initiating Coinbase payment:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Connect Web3 wallet
  const handleConnectWallet = async () => {
    try {
      const connection = await web3Wallet.connectMetaMask();
      setWalletConnected(true);
      setWalletAddress(connection.address);
    } catch (error) {
      console.error('Error connecting wallet:', error);
    }
  };

  // Handle Web3 payment
  const handleWeb3Payment = async () => {
    if (!walletConnected) {
      await handleConnectWallet();
      return;
    }

    setIsLoading(true);
    try {
      const payment = {
        packageType,
        currency: selectedCrypto,
        amount: getCryptoAmount(selectedCrypto),
        recipient: process.env.NEXT_PUBLIC_CRYPTO_WALLET_ADDRESS || '',
        customerData
      };

      let transaction;
      if (selectedCrypto === 'ETH') {
        transaction = await web3Wallet.sendETHPayment(payment);
      } else {
        transaction = await web3Wallet.sendTokenPayment(payment);
      }

      onPaymentInitiated?.('web3', transaction);
    } catch (error) {
      console.error('Error initiating Web3 payment:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const packageNames = {
    ESSENTIEL: 'Package Essentiel',
    PROFESSIONNEL: 'Package Professionnel',
    BOUTIQUE: 'Package Boutique'
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <CreditCard className="h-5 w-5" />
          Choisissez votre mode de paiement
        </CardTitle>
        <div className="flex items-center justify-between">
          <span className="text-lg font-semibold">{packageNames[packageType]}</span>
          <Badge variant="secondary" className="text-lg px-3 py-1">
            {packagePrice.toFixed(2)} €
          </Badge>
        </div>
      </CardHeader>

      <CardContent>
        <Tabs value={selectedMethod} onValueChange={(value) => setSelectedMethod(value as any)}>
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="stripe" className="flex items-center gap-2">
              <CreditCard className="h-4 w-4" />
              Carte Bancaire
            </TabsTrigger>
            <TabsTrigger value="coinbase" className="flex items-center gap-2">
              <Bitcoin className="h-4 w-4" />
              Coinbase
            </TabsTrigger>
            <TabsTrigger value="web3" className="flex items-center gap-2">
              <Wallet className="h-4 w-4" />
              Wallet Crypto
            </TabsTrigger>
          </TabsList>

          {/* Stripe Payment */}
          <TabsContent value="stripe" className="space-y-4">
            <div className="p-4 border rounded-lg">
              <div className="flex items-center gap-3 mb-3">
                <CreditCard className="h-6 w-6 text-blue-600" />
                <div>
                  <h3 className="font-semibold">Paiement par Carte Bancaire</h3>
                  <p className="text-sm text-gray-600">Visa, Mastercard, American Express</p>
                </div>
              </div>
              <div className="flex items-center justify-between mb-4">
                <span>Frais de traitement</span>
                <Badge variant="outline">0%</Badge>
              </div>
              <Button 
                onClick={handleStripePayment}
                disabled={isLoading}
                className="w-full"
                size="lg"
              >
                {isLoading ? 'Redirection...' : `Payer ${packagePrice.toFixed(2)} €`}
              </Button>
            </div>
          </TabsContent>

          {/* Coinbase Commerce */}
          <TabsContent value="coinbase" className="space-y-4">
            <div className="p-4 border rounded-lg">
              <div className="flex items-center gap-3 mb-3">
                <Bitcoin className="h-6 w-6 text-orange-600" />
                <div>
                  <h3 className="font-semibold">Coinbase Commerce</h3>
                  <p className="text-sm text-gray-600">Bitcoin, Ethereum, USDC, USDT</p>
                </div>
              </div>
              
              {cryptoPrices && (
                <div className="space-y-2 mb-4">
                  {Object.entries(CRYPTO_CONFIG.SUPPORTED_CURRENCIES).map(([symbol, config]) => (
                    <div key={symbol} className="flex items-center justify-between text-sm">
                      <span className="flex items-center gap-2">
                        {config.icon} {config.name}
                      </span>
                      <span className="font-mono">
                        {getCryptoAmount(symbol as keyof CryptoPrices)} {symbol}
                      </span>
                    </div>
                  ))}
                </div>
              )}
              
              <div className="flex items-center justify-between mb-4">
                <span>Frais de traitement</span>
                <Badge variant="outline">1%</Badge>
              </div>
              
              <Button 
                onClick={handleCoinbasePayment}
                disabled={isLoading}
                className="w-full"
                size="lg"
              >
                {isLoading ? 'Redirection...' : 'Payer en Crypto'}
              </Button>
            </div>
          </TabsContent>

          {/* Web3 Wallet */}
          <TabsContent value="web3" className="space-y-4">
            <div className="p-4 border rounded-lg">
              <div className="flex items-center gap-3 mb-3">
                <Wallet className="h-6 w-6 text-purple-600" />
                <div>
                  <h3 className="font-semibold">Wallet Crypto Direct</h3>
                  <p className="text-sm text-gray-600">MetaMask, WalletConnect</p>
                </div>
              </div>

              {walletConnected && (
                <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded">
                  <p className="text-sm text-green-800">
                    Wallet connecté: {walletAddress.slice(0, 6)}...{walletAddress.slice(-4)}
                  </p>
                </div>
              )}

              {/* Crypto selector */}
              <div className="space-y-2 mb-4">
                <label className="text-sm font-medium">Choisissez votre crypto:</label>
                <div className="grid grid-cols-2 gap-2">
                  {Object.entries(CRYPTO_CONFIG.SUPPORTED_CURRENCIES).map(([symbol, config]) => (
                    <button
                      key={symbol}
                      onClick={() => setSelectedCrypto(symbol as any)}
                      className={`p-3 border rounded-lg text-left transition-colors ${
                        selectedCrypto === symbol 
                          ? 'border-purple-500 bg-purple-50' 
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-lg">{config.icon}</span>
                        <span className="font-semibold">{symbol}</span>
                      </div>
                      {cryptoPrices && (
                        <div className="text-sm text-gray-600 font-mono">
                          {getCryptoAmount(symbol as keyof CryptoPrices)} {symbol}
                        </div>
                      )}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex items-center justify-between mb-4">
                <span>Frais de traitement</span>
                <Badge variant="outline">Frais réseau uniquement</Badge>
              </div>

              <Button 
                onClick={handleWeb3Payment}
                disabled={isLoading}
                className="w-full"
                size="lg"
              >
                {!walletConnected 
                  ? 'Connecter Wallet' 
                  : isLoading 
                    ? 'Transaction en cours...' 
                    : `Payer ${getCryptoAmount(selectedCrypto)} ${selectedCrypto}`
                }
              </Button>

              {!web3Wallet.isMetaMaskInstalled() && (
                <p className="text-sm text-gray-600 text-center mt-2">
                  <a 
                    href="https://metamask.io/download/" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-purple-600 hover:underline"
                  >
                    Installer MetaMask
                  </a> pour utiliser cette option
                </p>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}

