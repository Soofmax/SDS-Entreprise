// Web3 Wallet Integration for SDS
// Direct crypto payments through MetaMask, WalletConnect, etc.

import { CRYPTO_CONFIG } from './config';

export interface WalletConnection {
  address: string;
  chainId: number;
  balance?: string;
  provider?: any;
}

export interface CryptoPayment {
  packageType: 'ESSENTIEL' | 'PROFESSIONNEL' | 'BOUTIQUE';
  currency: 'BTC' | 'ETH' | 'USDC' | 'USDT';
  amount: string;
  recipient: string;
  customerData?: {
    email?: string;
    name?: string;
  };
}

export interface PaymentTransaction {
  hash: string;
  from: string;
  to: string;
  value: string;
  currency: string;
  status: 'pending' | 'confirmed' | 'failed';
  confirmations: number;
  timestamp: number;
}

class Web3WalletService {
  private provider: any = null;
  private signer: any = null;
  private connected: boolean = false;

  // Check if Web3 is available
  isWeb3Available(): boolean {
    return typeof window !== 'undefined' && 
           (window as any).ethereum !== undefined;
  }

  // Check if MetaMask is installed
  isMetaMaskInstalled(): boolean {
    return typeof window !== 'undefined' && 
           (window as any).ethereum?.isMetaMask === true;
  }

  // Connect to MetaMask
  async connectMetaMask(): Promise<WalletConnection> {
    if (!this.isMetaMaskInstalled()) {
      throw new Error('MetaMask is not installed');
    }

    try {
      const ethereum = (window as any).ethereum;
      
      // Request account access
      const accounts = await ethereum.request({
        method: 'eth_requestAccounts'
      });

      if (accounts.length === 0) {
        throw new Error('No accounts found');
      }

      // Get chain ID
      const chainId = await ethereum.request({
        method: 'eth_chainId'
      });

      // Get balance
      const balance = await ethereum.request({
        method: 'eth_getBalance',
        params: [accounts[0], 'latest']
      });

      const connection: WalletConnection = {
        address: accounts[0],
        chainId: parseInt(chainId, 16),
        balance: this.weiToEth(balance),
        provider: ethereum
      };

      this.provider = ethereum;
      this.connected = true;

      return connection;
    } catch (error) {
      console.error('Error connecting to MetaMask:', error);
      throw error;
    }
  }

  // Switch to specific network
  async switchNetwork(chainId: number): Promise<void> {
    if (!this.provider) {
      throw new Error('Wallet not connected');
    }

    try {
      await this.provider.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: `0x${chainId.toString(16)}` }],
      });
    } catch (error: any) {
      // Network not added to MetaMask
      if (error.code === 4902) {
        await this.addNetwork(chainId);
      } else {
        throw error;
      }
    }
  }

  // Add network to MetaMask
  private async addNetwork(chainId: number): Promise<void> {
    const networkConfig = Object.values(CRYPTO_CONFIG.NETWORKS)
      .find(network => network.chainId === chainId);

    if (!networkConfig) {
      throw new Error(`Network ${chainId} not supported`);
    }

    await this.provider.request({
      method: 'wallet_addEthereumChain',
      params: [{
        chainId: `0x${chainId.toString(16)}`,
        chainName: networkConfig.name,
        rpcUrls: [networkConfig.rpcUrl],
        blockExplorerUrls: [networkConfig.explorerUrl],
        nativeCurrency: {
          name: networkConfig.nativeCurrency,
          symbol: networkConfig.nativeCurrency,
          decimals: 18
        }
      }]
    });
  }

  // Send ETH payment
  async sendETHPayment(payment: CryptoPayment): Promise<PaymentTransaction> {
    if (!this.provider) {
      throw new Error('Wallet not connected');
    }

    try {
      const accounts = await this.provider.request({
        method: 'eth_accounts'
      });

      if (accounts.length === 0) {
        throw new Error('No accounts connected');
      }

      // Get current crypto price
      const ethPrice = await this.getCryptoPrice('ETH');
      const packagePrice = CRYPTO_CONFIG.PACKAGE_PRICES[payment.packageType] / 100; // Convert to EUR
      const ethAmount = (packagePrice / ethPrice).toFixed(6);

      // Convert to Wei
      const weiAmount = this.ethToWei(ethAmount);

      // Send transaction
      const txHash = await this.provider.request({
        method: 'eth_sendTransaction',
        params: [{
          from: accounts[0],
          to: payment.recipient,
          value: `0x${parseInt(weiAmount).toString(16)}`,
          gas: '0x5208', // 21000 gas for simple transfer
        }]
      });

      const transaction: PaymentTransaction = {
        hash: txHash,
        from: accounts[0],
        to: payment.recipient,
        value: ethAmount,
        currency: 'ETH',
        status: 'pending',
        confirmations: 0,
        timestamp: Date.now()
      };

      // Monitor transaction
      this.monitorTransaction(transaction);

      return transaction;
    } catch (error) {
      console.error('Error sending ETH payment:', error);
      throw error;
    }
  }

  // Send USDC/USDT payment (ERC-20)
  async sendTokenPayment(payment: CryptoPayment): Promise<PaymentTransaction> {
    if (!this.provider) {
      throw new Error('Wallet not connected');
    }

    // Only ERC-20 stablecoins are supported here
    if (payment.currency !== 'USDC' && payment.currency !== 'USDT') {
      throw new Error(`${payment.currency} is not supported for token payments`);
    }

    const currency = CRYPTO_CONFIG.SUPPORTED_CURRENCIES[payment.currency] as {
      decimals: number;
      contract: string;
    };

    if (!currency.contract) {
      throw new Error(`${payment.currency} contract not configured`);
    }

    try {
      const accounts = await this.provider.request({
        method: 'eth_accounts'
      });

      // Get token price (USDC/USDT should be ~1 USD)
      const tokenPrice = await this.getCryptoPrice(payment.currency);
      const packagePrice = CRYPTO_CONFIG.PACKAGE_PRICES[payment.packageType] / 100;
      const tokenAmount = (packagePrice / tokenPrice).toFixed(currency.decimals);

      // ERC-20 transfer function signature
      const transferData = this.encodeERC20Transfer(
        payment.recipient,
        tokenAmount,
        currency.decimals
      );

      // Send transaction
      const txHash = await this.provider.request({
        method: 'eth_sendTransaction',
        params: [{
          from: accounts[0],
          to: currency.contract,
          data: transferData,
          gas: '0x186A0', // 100000 gas for token transfer
        }]
      });

      const transaction: PaymentTransaction = {
        hash: txHash,
        from: accounts[0],
        to: payment.recipient,
        value: tokenAmount,
        currency: payment.currency,
        status: 'pending',
        confirmations: 0,
        timestamp: Date.now()
      };

      this.monitorTransaction(transaction);

      return transaction;
    } catch (error) {
      console.error(`Error sending ${payment.currency} payment:`, error);
      throw error;
    }
  }

  // Get crypto price from API
  async getCryptoPrice(currency: string): Promise<number> {
    try {
      const response = await fetch(
        `${CRYPTO_CONFIG.API_ENDPOINTS.COINGECKO_PRICES}?ids=${currency.toLowerCase()}&vs_currencies=eur`
      );
      
      const data = await response.json();
      return data[currency.toLowerCase()]?.eur || 0;
    } catch (error) {
      console.error('Error fetching crypto price:', error);
      // Fallback prices
      const fallbackPrices: Record<string, number> = {
        BTC: 45000,
        ETH: 3000,
        USDC: 0.85,
        USDT: 0.85
      };
      return fallbackPrices[currency] || 0;
    }
  }

  // Monitor transaction status
  private async monitorTransaction(transaction: PaymentTransaction) {
    const checkStatus = async () => {
      try {
        const receipt = await this.provider.request({
          method: 'eth_getTransactionReceipt',
          params: [transaction.hash]
        });

        if (receipt) {
          transaction.status = receipt.status === '0x1' ? 'confirmed' : 'failed';
          transaction.confirmations = 1; // Simplified
          
          // Notify backend
          await this.notifyPaymentStatus(transaction);
        } else {
          // Still pending, check again in 30 seconds
          setTimeout(checkStatus, 30000);
        }
      } catch (error) {
        console.error('Error checking transaction status:', error);
        setTimeout(checkStatus, 30000);
      }
    };

    // Start monitoring
    setTimeout(checkStatus, 10000); // Check after 10 seconds
  }

  // Notify backend about payment status
  private async notifyPaymentStatus(transaction: PaymentTransaction) {
    try {
      await fetch('/api/crypto/webhook', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          type: 'web3_payment',
          transaction
        })
      });
    } catch (error) {
      console.error('Error notifying payment status:', error);
    }
  }

  // Utility functions
  private weiToEth(wei: string): string {
    return (parseInt(wei, 16) / Math.pow(10, 18)).toString();
  }

  private ethToWei(eth: string): string {
    return (parseFloat(eth) * Math.pow(10, 18)).toString();
  }

  private encodeERC20Transfer(to: string, amount: string, decimals: number): string {
    // Simplified ERC-20 transfer encoding
    // In production, use ethers.js or web3.js for proper encoding
    const methodId = '0xa9059cbb'; // transfer(address,uint256)
    const addressParam = to.slice(2).padStart(64, '0');
    const amountParam = (parseFloat(amount) * Math.pow(10, decimals))
      .toString(16).padStart(64, '0');
    
    return methodId + addressParam + amountParam;
  }

  // Disconnect wallet
  disconnect(): void {
    this.provider = null;
    this.signer = null;
    this.connected = false;
  }

  // Get connection status
  isConnected(): boolean {
    return this.connected;
  }
}

export const web3Wallet = new Web3WalletService();

