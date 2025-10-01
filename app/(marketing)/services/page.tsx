'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { ArrowDown, Sparkles, Star, Zap, Heart, Check, Calculator, Gift, Euro } from 'lucide-react';
import Link from 'next/link';

export default function ServicesPage() {
  const [currentWord, setCurrentWord] = useState(0);
  const words = ['Parlons projet', 'Étudions vos besoins', 'Planifions ensemble', 'Développons votre vision'];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentWord((prev) => (prev + 1) % words.length);
    }, 2000);
    return () => clearInterval(interval);
  }, [words.length]);

  const packages = [
    {
      id: 'essentiel',
      name: 'ESSENTIEL',
      originalPrice: 4200,
      finalPrice: 3360,
      savings: 840,
      description: 'Site vitrine professionnel avec design sur-mesure et optimisation SEO complète.',
      features: [
        'Design responsive sur-mesure',
        'Optimisation SEO avancée',
        'Formulaire de contact intelligent',
        'Intégration réseaux sociaux',
        'Certificat SSL inclus',
        'Formation à la gestion'
      ],
      popular: false,
      color: 'from-rose-powder/20 to-cream'
    },
    {
      id: 'professionnel',
      name: 'PROFESSIONNEL',
      originalPrice: 6500,
      finalPrice: 5200,
      savings: 1300,
      description: 'Solution complète avec fonctionnalités avancées et système de gestion client.',
      features: [
        'Tout du pack Essentiel',
        'Système de réservation en ligne',
        'Espace client personnalisé',
        'Blog intégré avec CMS',
        'Analytics et rapports détaillés',
        'Support prioritaire 6 mois'
      ],
      popular: true,
      color: 'from-magenta/10 to-rose-powder/20'
    },
    {
      id: 'boutique',
      name: 'BOUTIQUE',
      originalPrice: 10000,
      finalPrice: 8000,
      savings: 2000,
      description: 'E-commerce complet avec gestion des stocks et paiements sécurisés.',
      features: [
        'Tout du pack Professionnel',
        'Boutique e-commerce complète',
        'Gestion automatique des stocks',
        'Paiements sécurisés (Stripe, PayPal)',
        'Système de fidélité client',
        'Formation e-commerce complète'
      ],
      popular: false,
      color: 'from-rose-powder/30 to-magenta/10'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-cream via-rose-powder/10 to-cream">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 opacity-20 overflow-hidden">
        <div className="absolute top-20 left-10 animate-float">
          <Star className="w-8 h-8 text-magenta"  aria-hidden="true" />
        </div>
        <div className="absolute top-40 right-20 animate-float" style={{ animationDelay: '1s' }}>
          <Sparkles className="w-6 h-6 text-rose-powder"  aria-hidden="true" />
        </div>
        <div className="absolute bottom-40 left-20 animate-float" style={{ animationDelay: '2s' }}>
          <Heart className="w-7 h-7 text-magenta"  aria-hidden="true" />
        </div>
        <div className="absolute bottom-20 right-10 animate-float" style={{ animationDelay: '3s' }}>
          <Zap className="w-5 h-5 text-rose-powder"  aria-hidden="true" />
        </div>
        <div className="absolute top-1/2 left-1/4 animate-float" style={{ animationDelay: '4s' }}>
          <Calculator className="w-6 h-6 text-magenta" />
        </div>
        <div className="absolute top-1/3 right-1/3 animate-float" style={{ animationDelay: '5s' }}>
          <Euro className="w-5 h-5 text-rose-powder" />
        </div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-20">
        {/* Header Section */}
        <div className="max-w-4xl mx-auto text-center mb-20">
          {/* Badge */}
          <div className="inline-flex items-center space-x-2 bg-white/80 backdrop-blur-sm border border-rose-powder/30 rounded-full px-6 py-2 mb-8">
            <Gift className="w-4 h-4 text-magenta"  aria-hidden="true" />
            <span className="text-sm font-medium text-charcoal">Sites Web Financés par l'État jusqu'à 5 000€</span>
          </div>

          {/* Main Heading */}
          <h1 className="font-playfair text-5xl md:text-7xl font-bold text-charcoal mb-6 leading-tight">
            Sites Web
            <br />
            <span className="text-gradient relative">
              {words[currentWord]}
            </span>
            <br />
            par l'État
          </h1>

          <p className="text-xl md:text-2xl text-charcoal/80 mb-8 max-w-3xl mx-auto leading-relaxed">
            Créez votre présence en ligne avec notre expertise en développement web. 
            Bénéficiez des aides publiques France Num pour réduire vos coûts jusqu'à 20%.
          </p>

          {/* Calculator Badge */}
          <div className="inline-flex items-center space-x-2 bg-gradient-rose text-white rounded-full px-6 py-3 mb-12">
            <Calculator className="w-5 h-5" />
            <span className="font-medium">Calculez votre aide France Num</span>
          </div>
        </div>

        {/* Packages Section */}
        <div className="max-w-7xl mx-auto">
          <h2 className="font-playfair text-4xl md:text-5xl font-bold text-center text-charcoal mb-4">
            Nos Packages
          </h2>
          <p className="text-center text-charcoal/70 mb-16 text-lg">
            Choisissez la solution qui correspond à vos besoins et votre budget
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {packages.map((pkg, index) => (
              <div
                key={pkg.id}
                className={`relative rounded-3xl p-8 backdrop-blur-sm border transition-all duration-500 hover:scale-105 hover:shadow-rose-lg ${
                  pkg.popular 
                    ? 'bg-gradient-to-br from-white/90 to-rose-powder/20 border-magenta ring-2 ring-magenta' 
                    : 'bg-white/70 border-rose-powder/30 hover:border-magenta'
                }`}
              >
                {/* Popular Badge */}
                {pkg.popular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <div className="bg-gradient-rose text-white px-6 py-2 rounded-full text-sm font-semibold shadow-rose">
                      ✨ Plus Populaire
                    </div>
                  </div>
                )}

                {/* Package Header */}
                <div className="text-center mb-8">
                  <h3 className="font-playfair text-2xl font-bold text-charcoal mb-4">
                    {pkg.name}
                  </h3>
                  
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
                    
                    {/* Savings Badge */}
                    <div className="inline-flex items-center space-x-2 bg-green-100 text-green-800 px-4 py-2 rounded-full text-sm font-semibold">
                      <Gift className="w-4 h-4"  aria-hidden="true" />
                      <span>Économie de {pkg.savings.toLocaleString('fr-FR')}€</span>
                    </div>
                  </div>

                  <p className="text-charcoal/80 leading-relaxed">
                    {pkg.description}
                  </p>
                </div>

                {/* Features */}
                <div className="space-y-4 mb-8">
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

                {/* CTA Button */}
                <Link href={`/contact?package=${pkg.id}`}>
                  <Button
                    className={`w-full py-6 text-lg font-semibold rounded-2xl transition-all duration-300 ${
                      pkg.popular
                        ? 'bg-gradient-rose text-white hover:opacity-90 shadow-rose'
                        : 'bg-white text-magenta border-2 border-magenta hover:bg-magenta hover:text-white'
                    }`}
                  >
                    Demander un devis
                  </Button>
                </Link>
              </div>
            ))}
          </div>
        </div>

        {/* France Num Section */}
        <div className="max-w-4xl mx-auto mt-24 text-center">
          <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-12 border border-rose-powder/30 shadow-rose">
            <div className="inline-flex items-center space-x-2 bg-gradient-rose text-white rounded-full px-6 py-2 mb-6">
              <Gift className="w-5 h-5"  aria-hidden="true" />
              <span className="font-medium">Aide France Num</span>
            </div>
            
            <h3 className="font-playfair text-3xl font-bold text-charcoal mb-4">
              Jusqu'à 5 000€ d'Aide Publique
            </h3>
            
            <p className="text-charcoal/80 text-lg mb-8 leading-relaxed">
              Bénéficiez du dispositif France Num pour financer votre transformation digitale. 
              Une aide pouvant couvrir jusqu'à 20% de votre investissement.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-rose rounded-full flex items-center justify-center mx-auto mb-4">
                  <Calculator className="w-8 h-8 text-white" />
                </div>
                <h4 className="font-semibold text-charcoal mb-2">Calcul Automatique</h4>
                <p className="text-sm text-charcoal/70">Estimation instantanée de votre aide</p>
              </div>
              
              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-rose rounded-full flex items-center justify-center mx-auto mb-4">
                  <Star className="w-8 h-8 text-white"  aria-hidden="true" />
                </div>
                <h4 className="font-semibold text-charcoal mb-2">Accompagnement</h4>
                <p className="text-sm text-charcoal/70">Aide aux démarches administratives</p>
              </div>
              
              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-rose rounded-full flex items-center justify-center mx-auto mb-4">
                  <Heart className="w-8 h-8 text-white"  aria-hidden="true" />
                </div>
                <h4 className="font-semibold text-charcoal mb-2">Garantie</h4>
                <p className="text-sm text-charcoal/70">Satisfaction ou remboursement</p>
              </div>
            </div>

            <Button className="bg-gradient-rose text-white px-8 py-4 text-lg font-semibold rounded-2xl hover:opacity-90 shadow-rose">
              Calculer Mon Aide
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

