// Crypto Payment Configuration for SDS
// Supports multiple payment methods: Coinbase Commerce, Web3, and direct wallet

export const CRYPTO_CONFIG = {
  // Supported cryptocurrencies
  SUPPORTED_CURRENCIES: {
    BTC: {
      name: 'Bitcoin',
      symbol: 'BTC',
      decimals: 8,
      icon: '₿',
      color: '#F7931A',
      network: 'bitcoin'
    },
    ETH: {
      name: 'Ethereum',
      symbol: 'ETH',
      decimals: 18,
      icon: 'Ξ',
      color: '#627EEA',
      network: 'ethereum'
    },
    USDC: {
      name: 'USD Coin',
      symbol: 'USDC',
      decimals: 6,
      icon: '$',
      color: '#2775CA',
      network: 'ethereum',
      contract: '0xA0b86a33E6441c8C7c7b0b8b0b8b0b8b0b8b0b8b'
    },
    USDT: {
      name: 'Tether',
      symbol: 'USDT',
      decimals: 6,
      icon: '₮',
      color: '#26A17B',
      network: 'ethereum',
      contract: '0xdAC17F958D2ee523a2206206994597C13D831ec7'
    }
  },

  // Supported networks
  NETWORKS: {
    ethereum: {
      name: 'Ethereum',
      chainId: 1,
      rpcUrl: 'https://mainnet.infura.io/v3/',
      explorerUrl: 'https://etherscan.io',
      nativeCurrency: 'ETH'
    },
    polygon: {
      name: 'Polygon',
      chainId: 137,
      rpcUrl: 'https://polygon-rpc.com',
      explorerUrl: 'https://polygonscan.com',
      nativeCurrency: 'MATIC'
    },
    bsc: {
      name: 'Binance Smart Chain',
      chainId: 56,
      rpcUrl: 'https://bsc-dataseed.binance.org',
      explorerUrl: 'https://bscscan.com',
      nativeCurrency: 'BNB'
    }
  },

  // Package prices in EUR (will be converted to crypto)
  PACKAGE_PRICES: {
    ESSENTIEL: 3360, // €33.60 in cents
    PROFESSIONNEL: 5200, // €52.00 in cents
    BOUTIQUE: 8000 // €80.00 in cents
  },

  // Payment methods
  PAYMENT_METHODS: {
    STRIPE: {
      name: 'Carte Bancaire',
      icon: '💳',
      description: 'Paiement sécurisé par carte',
      fees: 0, // No additional fees
      processingTime: 'Instantané'
    },
    COINBASE_COMMERCE: {
      name: 'Coinbase Commerce',
      icon: '🏪',
      description: 'Bitcoin, Ethereum, USDC, USDT',
      fees: 1, // 1% fee
      processingTime: '10-60 minutes'
    },
    WEB3_WALLET: {
      name: 'Wallet Crypto',
      icon: '🦊',
      description: 'MetaMask, WalletConnect',
      fees: 0, // Only network fees
      processingTime: '1-10 minutes'
    }
  },

  // API endpoints
  API_ENDPOINTS: {
    COINBASE_COMMERCE: 'https://api.commerce.coinbase.com',
    COINGECKO_PRICES: 'https://api.coingecko.com/api/v3/simple/price',
    CRYPTO_COMPARE: 'https://min-api.cryptocompare.com/data/price'
  },

  // Wallet configurations
  WALLET_CONFIG: {
    METAMASK: {
      name: 'MetaMask',
      icon: '🦊',
      downloadUrl: 'https://metamask.io/download/'
    },
    WALLETCONNECT: {
      name: 'WalletConnect',
      icon: '🔗',
      projectId: process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID
    },
    COINBASE_WALLET: {
      name: 'Coinbase Wallet',
      icon: '🔵',
      downloadUrl: 'https://wallet.coinbase.com/'
    }
  }
};

// Environment variables validation
export const validateCryptoEnv = () => {
  const requiredVars = [
    'COINBASE_COMMERCE_API_KEY',
    'NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID',
    'CRYPTO_WEBHOOK_SECRET'
  ];

  const missing = requiredVars.filter(varName => !process.env[varName]);
  
  if (missing.length > 0) {
    console.warn(`Missing crypto environment variables: ${missing.join(', ')}`);
    return false;
  }
  
  return true;
};

// Default crypto settings
export const DEFAULT_CRYPTO_SETTINGS = {
  defaultCurrency: 'EUR',
  defaultCrypto: 'BTC',
  priceUpdateInterval: 30000, // 30 seconds
  transactionTimeout: 3600000, // 1 hour
  confirmationsRequired: {
    BTC: 1,
    ETH: 12,
    USDC: 12,
    USDT: 12
  }
};

