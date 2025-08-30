'use client';

import { Fragment } from 'react';
import { X, ShoppingBag, CreditCard, Wallet, Minus, Plus, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { useCart } from '@/app/providers';
import { useAuth } from '@/app/providers';
import Link from 'next/link';

export function CartSidebar() {
  const { services, removeService, total, isCartOpen, setIsCartOpen } = useCart();
  const { user } = useAuth();

  if (!isCartOpen) return null;

  return (
    <>
      {/* Overlay */}
      <div 
        className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm"
        onClick={() => setIsCartOpen(false)}
      />
      
      {/* Sidebar */}
      <div className="fixed right-0 top-0 z-50 h-full w-full max-w-md bg-white shadow-2xl cart-slide-enter-active">
        <div className="flex h-full flex-col">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-rose-powder/30 px-6 py-4">
            <div className="flex items-center space-x-2">
              <ShoppingBag className="h-5 w-5 text-magenta" />
              <h2 className="font-playfair text-lg font-semibold text-charcoal">
                Mon Panier ({services.length})
              </h2>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsCartOpen(false)}
              className="hover:bg-rose-powder/20"
            >
              <X className="h-5 w-5" />
            </Button>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto px-6 py-6">
            {services.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-center">
                <ShoppingBag className="h-16 w-16 text-rose-powder mb-4" />
                <h3 className="font-playfair text-xl font-semibold text-charcoal mb-2">
                  Votre panier est vide
                </h3>
                <p className="text-charcoal/60 mb-6">
                  Découvrez nos services et créez votre projet sur-mesure
                </p>
                <Button 
                  onClick={() => setIsCartOpen(false)}
                  className="bg-gradient-rose hover:opacity-90 text-white shadow-rose"
                >
                  Voir les Services
                </Button>
              </div>
            ) : (
              <div className="space-y-6">
                {/* Services List */}
                <div className="space-y-4">
                  {services.map((service) => (
                    <div key={service.id} className="border border-rose-powder/20 rounded-lg p-4">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex-1">
                          <h4 className="font-semibold text-charcoal mb-1 flex items-center">
                            {service.category === 'addon' && (
                              <Plus className="w-3 h-3 mr-1 text-magenta" />
                            )}
                            {service.name}
                          </h4>
                          <p className="text-sm text-charcoal/70 mb-2">
                            {service.description}
                          </p>
                          <Badge 
                            variant="outline" 
                            className="text-xs border-magenta/30 text-magenta"
                          >
                            {service.category === 'base' ? 'Service de base' : 'Option'}
                          </Badge>
                        </div>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => removeService(service.id)}
                          className="text-red-500 hover:bg-red-50 hover:text-red-600 ml-2 flex-shrink-0"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-lg font-semibold text-magenta font-playfair">
                          {service.price.toLocaleString('fr-FR')}€
                        </span>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Pricing Summary */}
                <div className="space-y-3 border-t border-rose-powder/30 pt-6">
                  <div className="flex justify-between text-sm">
                    <span className="text-charcoal/70">Sous-total</span>
                    <span className="font-semibold text-charcoal">
                      {total.toLocaleString('fr-FR')}€
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-charcoal/70">TVA (20%)</span>
                    <span className="font-semibold text-charcoal">
                      {(total * 0.2).toLocaleString('fr-FR')}€
                    </span>
                  </div>
                  <Separator />
                  <div className="flex justify-between text-lg font-bold">
                    <span className="text-charcoal">Total TTC</span>
                    <span className="text-magenta font-playfair">
                      {(total * 1.2).toLocaleString('fr-FR')}€
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Footer */}
          {services.length > 0 && (
            <div className="border-t border-rose-powder/30 p-6 space-y-3">
              {!user && (
                <p className="text-xs text-charcoal/60 text-center mb-4">
                  Vous devez être connecté pour procéder au paiement
                </p>
              )}
              
              <div className="space-y-2">
                {/* Stripe Payment */}
                <Link href={user ? "/checkout" : "/auth/signin"}>
                  <Button 
                    className="w-full bg-gradient-rose hover:opacity-90 text-white shadow-rose"
                    disabled={!user}
                  >
                    <CreditCard className="w-4 h-4 mr-2" />
                    Payer par Carte ({(total * 1.2).toLocaleString('fr-FR')}€)
                  </Button>
                </Link>

                {/* Web3 Payment */}
                <Link href={user ? "/checkout/web3" : "/auth/signin"}>
                  <Button 
                    variant="outline" 
                    className="w-full border-magenta text-magenta hover:bg-magenta hover:text-white"
                    disabled={!user}
                  >
                    <Wallet className="w-4 h-4 mr-2" />
                    Payer en Crypto + NFT
                  </Button>
                </Link>
              </div>

              {!user && (
                <div className="text-center">
                  <Link href="/auth/signin">
                    <Button variant="ghost" className="text-magenta hover:text-magenta/80">
                      Se connecter
                    </Button>
                  </Link>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </>
  );
}