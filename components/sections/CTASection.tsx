'use client';

import { Button } from '@/components/ui/button';
import { Sparkles, ArrowRight, MessageCircle } from 'lucide-react';
import Link from 'next/link';

export function CTASection() {
  return (
    <section className="py-20 bg-charcoal dark:bg-gray-950 relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-10 left-10 animate-float">
          <Sparkles className="w-8 h-8 text-rose-powder"  aria-hidden="true" />
        </div>
        <div className="absolute top-20 right-20 animate-float" style={{ animationDelay: '1s' }}>
          <Sparkles className="w-6 h-6 text-magenta"  aria-hidden="true" />
        </div>
        <div className="absolute bottom-20 left-20 animate-float" style={{ animationDelay: '2s' }}>
          <Sparkles className="w-7 h-7 text-rose-powder"  aria-hidden="true" />
        </div>
        <div className="absolute bottom-10 right-10 animate-float" style={{ animationDelay: '3s' }}>
          <Sparkles className="w-5 h-5 text-magenta"  aria-hidden="true" />
        </div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="max-w-4xl mx-auto text-center">
          {/* Main Content */}
          <h2 className="font-playfair text-4xl md:text-6xl font-bold text-cream dark:text-cream mb-6">
            Prête à Donner Vie à
            <span className="text-gradient block">Votre Vision ?</span>
          </h2>
          <p className="text-xl text-cream/80 dark:text-cream/80 leading-relaxed mb-8 max-w-3xl mx-auto">
            Chaque projet est une nouvelle aventure créative. Parlons de vos ambitions et créons 
            ensemble quelque chose d'extraordinaire qui vous ressemble vraiment.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
            <Link href="/contact">
              <Button 
                size="lg" 
                className="bg-gradient-rose hover:opacity-90 text-white shadow-rose-lg px-8 py-6 text-lg font-semibold transform hover:scale-105 transition-all duration-300"
              >
                Démarrer Mon Projet
                <ArrowRight className="ml-2 w-5 h-5"  aria-hidden="true" />
              </Button>
            </Link>
            <Link href="/contact#rdv">
              <Button 
                variant="outline" 
                size="lg"
                className="border-2 border-rose-powder text-cream dark:text-cream hover:bg-rose-powder hover:text-charcoal px-8 py-6 text-lg font-semibold transform hover:scale-105 transition-all duration-300"
              >
                <MessageCircle className="mr-2 w-5 h-5" />
                Prendre Rendez-vous
              </Button>
            </Link>
          </div>

          {/* Value Propositions */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16">
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-4 bg-gradient-rose rounded-full flex items-center justify-center">
                <Sparkles className="w-8 h-8 text-white"  aria-hidden="true" />
              </div>
              <h3 className="font-playfair text-xl font-semibold text-cream mb-2">
                Design Sur-Mesure
              </h3>
              <p className="text-cream/70 text-sm leading-relaxed">
                Chaque élément est pensé spécialement pour votre marque et vos objectifs
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-4 bg-gradient-rose rounded-full flex items-center justify-center">
                <ArrowRight className="w-8 h-8 text-white"  aria-hidden="true" />
              </div>
              <h3 className="font-playfair text-xl font-semibold text-cream mb-2">
                Livraison Express
              </h3>
              <p className="text-cream/70 text-sm leading-relaxed">
                Projets livrés en 3 à 10 jours selon la complexité, sans compromis sur la qualité
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-4 bg-gradient-rose rounded-full flex items-center justify-center">
                <MessageCircle className="w-8 h-8 text-white" />
              </div>
              <h3 className="font-playfair text-xl font-semibold text-cream mb-2">
                Support Illimité
              </h3>
              <p className="text-cream/70 text-sm leading-relaxed">
                Accompagnement personnalisé jusqu'à ce que votre projet soit parfait
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}