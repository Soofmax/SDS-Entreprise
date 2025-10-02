// Fichier: components/sections/ServicesSection.tsx
// Version Corrigée qui utilise la source de données centrale et unique

'use client';

import { Button } from '@/components/ui/button';
import { ServiceCard } from '@/components/services/ServiceCard';
import { allServices } from '@/lib/services-data'; // <-- On importe la liste complète
import Link from 'next/link';
import { ArrowRight, Sparkles, Plus } from 'lucide-react';

// On sélectionne intelligemment quelques services à mettre en avant sur la page d'accueil.
// Ici, on prend les services marqués comme "populaires", ou les 3 premiers services de base si aucun n'est populaire.
let featuredServices = allServices.filter(s => s.popular);
if (featuredServices.length === 0) {
  featuredServices = allServices.filter(s => s.category === 'base').slice(0, 3);
}

export function ServicesSection() {
  return (
    <section className="py-20 bg-white dark:bg-gray-950">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center space-x-2 bg-rose-powder/20 dark:bg-rose-950/30 rounded-full px-4 py-2 mb-6">
            <Sparkles className="w-4 h-4 text-magenta"  aria-hidden="true" />
            <span className="text-sm font-medium text-magenta">Services Sur-Mesure</span>
          </div>
          <h2 className="font-playfair text-4xl md:text-5xl font-bold text-charcoal dark:text-cream mb-6">
            Configurez Votre
            <span className="text-gradient block">Projet Parfait</span>
          </h2>
          <p className="text-xl text-charcoal/70 dark:text-cream/80 leading-relaxed">
            Commencez par une base solide et ajoutez les options qui correspondent à vos besoins. 
            Chaque projet est unique, comme vous.
          </p>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {/* On affiche les services sélectionnés */}
          {featuredServices.map((service) => (
            <ServiceCard key={service.id} service={service} />
          ))}
        </div>

        {/* Bouton pour voir le catalogue complet */}
        <div className="mt-16 text-center">
            <Button asChild size="lg" className="bg-gradient-rose text-white shadow-rose text-lg">
                <Link href="/services">
                    Voir tous nos services ({allServices.length})
                    <ArrowRight className="w-5 h-5 ml-2"  aria-hidden="true" />
                </Link>
            </Button>
        </div>

        {/* Custom Service CTA (votre section personnalisée) */}
        <div className="mt-16 text-center">
          <div className="bg-gradient-to-r from-rose-powder/20 to-magenta/10 dark:from-rose-950/20 dark:to-rose-900/10 rounded-2xl p-8 max-w-4xl mx-auto">
            <div className="flex items-center justify-center mb-4">
              <Plus className="w-8 h-8 text-magenta"  aria-hidden="true" />
            </div>
            <h3 className="font-playfair text-2xl font-bold text-charcoal dark:text-cream mb-4">
              Besoin d'un Service Personnalisé ?
            </h3>
            <p className="text-charcoal/70 dark:text-cream/80 mb-6 max-w-2xl mx-auto">
              Votre projet nécessite une approche unique ? Discutons ensemble de vos besoins spécifiques 
              pour créer la solution parfaite.
            </p>
            <Link href="/contact">
              <Button size="lg" className="bg-gradient-rose hover:opacity-90 text-white shadow-rose">
                Demander un Devis Personnalisé
                <Sparkles className="ml-2 w-4 h-4"  aria-hidden="true" />
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
