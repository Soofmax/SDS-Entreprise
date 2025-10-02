'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Check, Star, Gift, Zap, Heart, Shield, Clock, Award } from 'lucide-react';

export function PricingSection() {
  const [selectedPackage, setSelectedPackage] = useState('professionnel');

  const packages = [
    {
      id: 'essentiel',
      name: 'ESSENTIEL',
      subtitle: 'Parfait pour débuter',
      originalPrice: 4200,
      finalPrice: 3360,
      savings: 840,
      monthlyEquivalent: 280,
      description: 'Site vitrine professionnel avec design sur-mesure et optimisation SEO complète.',
      features: [
        'Design responsive sur-mesure',
        'Optimisation SEO avancée',
        'Formulaire de contact intelligent',
        'Intégration réseaux sociaux',
        'Certificat SSL inclus',
        'Formation à la gestion',
        'Maintenance 6 mois incluse',
        'Support email prioritaire'
      ],
      popular: false,
      color: 'from-rose-powder/20 to-cream',
      icon: Heart,
      deliveryTime: '7-10 jours',
      revisions: '3 révisions incluses',
      guarantee: '30 jours satisfait ou remboursé'
    },
    {
      id: 'professionnel',
      name: 'PROFESSIONNEL',
      subtitle: 'Le plus choisi',
      originalPrice: 6500,
      finalPrice: 5200,
      savings: 1300,
      monthlyEquivalent: 433,
      description: 'Solution complète avec fonctionnalités avancées et système de gestion client.',
      features: [
        'Tout du pack Essentiel',
        'Système de réservation en ligne',
        'Espace client personnalisé',
        'Blog intégré avec CMS',
        'Analytics et rapports détaillés',
        'Support prioritaire 6 mois',
        'Formation complète incluse',
        'Optimisation mobile avancée',
        'Intégration outils marketing',
        'Sauvegarde automatique'
      ],
      popular: true,
      color: 'from-magenta/10 to-rose-powder/20',
      icon: Star,
      deliveryTime: '10-14 jours',
      revisions: '5 révisions incluses',
      guarantee: '60 jours satisfait ou remboursé'
    },
    {
      id: 'boutique',
      name: 'BOUTIQUE',
      subtitle: 'Pour vendre en ligne',
      originalPrice: 10000,
      finalPrice: 8000,
      savings: 2000,
      monthlyEquivalent: 667,
      description: 'E-commerce complet avec gestion des stocks et paiements sécurisés.',
      features: [
        'Tout du pack Professionnel',
        'Boutique e-commerce complète',
        'Gestion automatique des stocks',
        'Paiements sécurisés (Stripe, PayPal)',
        'Système de fidélité client',
        'Formation e-commerce complète',
        'Tableau de bord vendeur',
        'Gestion des commandes',
        'Système de livraison',
        'Support e-commerce dédié',
        'Optimisation conversions',
        'Intégration comptabilité'
      ],
      popular: false,
      color: 'from-rose-powder/30 to-magenta/10',
      icon: Award,
      deliveryTime: '14-21 jours',
      revisions: 'Révisions illimitées',
      guarantee: '90 jours satisfait ou remboursé'
    }
  ];

  const addons = [
    {
      name: 'Référencement Premium',
      price: 500,
      description: 'Optimisation SEO avancée + suivi 3 mois',
      icon: Zap
    },
    {
      name: 'Formation Personnalisée',
      price: 300,
      description: 'Session 1h en visio pour maîtriser votre site',
      icon: Award
    },
    {
      name: 'Maintenance Premium',
      price: 100,
      description: 'Maintenance mensuelle + mises à jour',
      icon: Shield
    },
    {
      name: 'Livraison Express',
      price: 800,
      description: 'Livraison en 5 jours ouvrés maximum',
      icon: Clock
    }
  ];

  const selectedPkg = packages.find(pkg => pkg.id === selectedPackage);

  return (
    <section className="py-24 bg-gradient-to-br from-cream via-rose-powder/5 to-cream dark:from-gray-950 dark:via-gray-900 dark:to-gray-950">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="max-w-4xl mx-auto text-center mb-16">
          <div className="inline-flex items-center space-x-2 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm border border-rose-powder/30 dark:border-rose-800/30 rounded-full px-6 py-2 mb-8">
            <Gift className="w-4 h-4 text-magenta"  aria-hidden="true" />
            <span className="text-sm font-medium text-charcoal dark:text-cream">Pricing Transparent • Aides Incluses</span>
          </div>

          <h2 className="font-playfair text-4xl md:text-6xl font-bold text-charcoal dark:text-cream mb-6">
            Packages <span className="text-gradient">Sur-Mesure</span>
          </h2>

          <p className="text-xl text-charcoal/80 dark:text-cream/80 mb-8 leading-relaxed">
            Choisissez la solution qui correspond à vos besoins et votre budget. 
            Aides publiques déjà déduites, aucune surprise.
          </p>

          {/* Package Selector */}
          <div className="flex flex-wrap justify-center gap-4 mb-12">
            {packages.map((pkg) => (
              <button
                key={pkg.id}
                onClick={() => setSelectedPackage(pkg.id)}
                className={`px-6 py-3 rounded-full text-sm font-medium transition-all duration-300 ${
                  selectedPackage === pkg.id
                    ? 'bg-gradient-rose text-white shadow-rose'
                    : 'bg-white/70 dark:bg-gray-900/60 text-charcoal dark:text-cream border border-rose-powder/30 dark:border-rose-800/30 hover:border-magenta hover:shadow-rose'
                }`}
              >
                {pkg.name}
                {pkg.popular && <span className="ml-2 text-xs">⭐</span>}
              </button>
            ))}
          </div>
        </div>

        {/* Packages Grid */}
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-16">
            {packages.map((pkg, index) => {
              const IconComponent = pkg.icon;
              return (
                <div
                  key={pkg.id}
                  className={`relative rounded-3xl p-8 backdrop-blur-sm border transition-all duration-500 hover:scale-105 hover:shadow-rose-lg ${
                    pkg.popular 
                      ? 'bg-gradient-to-br from-white/90 to-rose-powder/20 dark:from-gray-900 dark:to-rose-950/20 border-magenta ring-2 ring-magenta' 
                      : 'bg-white/70 dark:bg-gray-900/70 border-rose-powder/30 dark:border-rose-800/30 hover:border-magenta'
                  } ${selectedPackage === pkg.id ? 'ring-2 ring-magenta border-magenta' : ''}`}
                >
                  {/* Popular Badge */}
                  {pkg.popular && (
                    <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                      <div className="bg-gradient-rose text-white px-6 py-2 rounded-full text-sm font-semibold shadow-rose flex items-center space-x-2">
                        <Star className="w-4 h-4"  aria-hidden="true" />
                        <span>Plus Populaire</span>
                      </div>
                    </div>
                  )}

                  {/* Package Header */}
                  <div className="text-center mb-8">
                    <div className="w-16 h-16 bg-gradient-rose rounded-full flex items-center justify-center mx-auto mb-4">
                      <IconComponent className="w-8 h-8 text-white" />
                    </div>
                    
                    <h3 className="font-playfair text-2xl font-bold text-charcoal mb-2">
                      {pkg.name}
                    </h3>
                    <p className="text-charcoal/70 text-sm mb-4">{pkg.subtitle}</p>
                    
                    {/* Pricing */}
                    <div className="mb-4">
                      <div className="flex items-center justify-center space-x-2 mb-2">
                        <span className="text-4xl font-bold text-magenta">
                          {pkg.finalPrice.toLocaleString('fr-FR')}€
                        </span>
                        <span className="text-lg text-charcoal/50 line-through">
                          {pkg.originalPrice.toLocaleString('fr-FR')}€
                        </span>
                      </div>
                      
                      <div className="text-sm text-charcoal/70 mb-3">
                        Soit {pkg.monthlyEquivalent}€/mois sur 12 mois
                      </div>
                      
                      {/* Savings Badge */}
                      <div className="inline-flex items-center space-x-2 bg-green-100 text-green-800 px-4 py-2 rounded-full text-sm font-semibold">
                        <Gift className="w-4 h-4"  aria-hidden="true" />
                        <span>Économie de {pkg.savings.toLocaleString('fr-FR')}€</span>
                      </div>
                    </div>

                    <p className="text-charcoal/80 leading-relaxed text-sm">
                      {pkg.description}
                    </p>
                  </div>

                  {/* Features */}
                  <div className="space-y-3 mb-8">
                    {pkg.features.map((feature, featureIndex) => (
                      <div key={featureIndex} className="flex items-start space-x-3">
                        <div className="flex-shrink-0 w-5 h-5 rounded-full bg-gradient-rose flex items-center justify-center mt-0.5">
                          <Check className="w-3 h-3 text-white"  aria-hidden="true" />
                        </div>
                        <span className="text-charcoal/90 text-sm leading-relaxed">
                          {feature}
                        </span>
                      </div>
                    ))}
                  </div>

                  {/* Package Details */}
                  <div className="bg-cream/50 rounded-xl p-4 mb-6 space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-charcoal/70">Délai de livraison :</span>
                      <span className="font-semibold text-charcoal">{pkg.deliveryTime}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-charcoal/70">Révisions :</span>
                      <span className="font-semibold text-charcoal">{pkg.revisions}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-charcoal/70">Garantie :</span>
                      <span className="font-semibold text-charcoal">{pkg.guarantee}</span>
                    </div>
                  </div>

                  {/* CTA Button */}
                  <a href={`/contact?package=${pkg.id}`} className="block">
                    <Button
                      className={`w-full py-6 text-lg font-semibold rounded-2xl transition-all duration-300 ${
                        pkg.popular
                          ? 'bg-gradient-rose text-white hover:opacity-90 shadow-rose'
                          : 'bg-white text-magenta border-2 border-magenta hover:bg-magenta hover:text-white'
                      }`}
                    >
                      Demander un devis pour {pkg.name}
                    </Button>
                  </a>
                </div>
              );
            })}
          </div>

          {/* Add-ons Section */}
          <div className="max-w-4xl mx-auto">
            <h3 className="font-playfair text-3xl font-bold text-center text-charcoal mb-8">
              Options Complémentaires
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {addons.map((addon, index) => {
                const IconComponent = addon.icon;
                return (
                  <div
                    key={index}
                    className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-rose-powder/30 hover:border-magenta transition-all duration-300 hover:shadow-rose"
                  >
                    <div className="flex items-start space-x-4">
                      <div className="w-12 h-12 bg-gradient-rose rounded-full flex items-center justify-center flex-shrink-0">
                        <IconComponent className="w-6 h-6 text-white" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-semibold text-charcoal">{addon.name}</h4>
                          <span className="text-magenta font-bold">+{addon.price}€</span>
                        </div>
                        <p className="text-charcoal/70 text-sm">{addon.description}</p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Guarantee Section */}
          <div className="max-w-4xl mx-auto mt-16 text-center">
            <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-8 border border-rose-powder/30 shadow-rose">
              <div className="w-16 h-16 bg-gradient-rose rounded-full flex items-center justify-center mx-auto mb-6">
                <Shield className="w-8 h-8 text-white" />
              </div>
              
              <h3 className="font-playfair text-2xl font-bold text-charcoal mb-4">
                Garantie Satisfaction Totale
              </h3>
              
              <p className="text-charcoal/80 text-lg mb-6 leading-relaxed">
                Si vous n'êtes pas 100% satisfait de votre site, nous le reprenons entièrement 
                ou vous remboursons intégralement. Votre succès est notre priorité.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="text-2xl font-bold text-magenta mb-2">30-90j</div>
                  <div className="text-sm text-charcoal/70">Période de garantie</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-magenta mb-2">100%</div>
                  <div className="text-sm text-charcoal/70">Remboursement possible</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-magenta mb-2">0€</div>
                  <div className="text-sm text-charcoal/70">Frais cachés</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

