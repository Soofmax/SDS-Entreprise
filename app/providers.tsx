'use client';

import React, { createContext, useContext, useState, ReactNode } from 'react';

interface Service {
  id: string;
  name: string;
  description: string;
  price: number;
  category: 'base' | 'addon';
  isSelected: boolean;
  dependencies?: string[];
}

interface CartContextType {
  services: Service[];
  addService: (service: Service) => void;
  removeService: (serviceId: string) => void;
  clearCart: () => void;
  total: number;
  isCartOpen: boolean;
  setIsCartOpen: (isOpen: boolean) => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}

interface User {
  id: string;
  email: string;
  walletAddress?: string;
  name?: string;
  avatar?: string;
}

interface AuthContextType {
  user: User | null;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, name: string) => Promise<void>;
  signOut: () => void;
  connectWallet: () => Promise<void>;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

export function Providers({ children }: { children: ReactNode }) {
  // Cart State
  const [services, setServices] = useState<Service[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);

  // Auth State
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Cart Functions
  const addService = (service: Service) => {
    setServices(prev => {
      const exists = prev.find(s => s.id === service.id);
      if (exists) return prev;
      return [...prev, { ...service, isSelected: true }];
    });
  };

  const removeService = (serviceId: string) => {
    setServices(prev => prev.filter(s => s.id !== serviceId));
  };

  const clearCart = () => {
    setServices([]);
  };

  const total = services.reduce((sum, service) => sum + service.price, 0);

  // Auth Functions
  const signIn = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      setUser({
        id: '1',
        email,
        name: 'Utilisateur Demo',
      });
    } catch (error) {
      throw new Error('Erreur de connexion');
    } finally {
      setIsLoading(false);
    }
  };

  const signUp = async (email: string, password: string, name: string) => {
    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      setUser({
        id: '1',
        email,
        name,
      });
    } catch (error) {
      throw new Error('Erreur de création de compte');
    } finally {
      setIsLoading(false);
    }
  };

  const signOut = () => {
    setUser(null);
    clearCart();
  };

  const connectWallet = async () => {
    try {
      // Simulate wallet connection
      if (typeof window !== 'undefined' && (window as any).ethereum) {
        const accounts = await (window as any).ethereum.request({
          method: 'eth_requestAccounts',
        });
        if (user) {
          setUser({
            ...user,
            walletAddress: accounts[0],
          });
        }
      }
    } catch (error) {
      throw new Error('Erreur de connexion wallet');
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        signIn,
        signUp,
        signOut,
        connectWallet,
        isLoading,
      }}
    >
      <CartContext.Provider
        value={{
          services,
          addService,
          removeService,
          clearCart,
          total,
          isCartOpen,
          setIsCartOpen,
        }}
      >
        {children}
      </CartContext.Provider>
    </AuthContext.Provider>
  );
}