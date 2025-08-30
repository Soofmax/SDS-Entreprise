'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Home, Search, Sparkles, Star, Zap, Heart, Mail, Palette, Code, Coffee } from 'lucide-react';
import Link from 'next/link';

export default function NotFound() {
  const [currentWord, setCurrentWord] = useState(0);
  const words = ['Oups !', 'Perdu ?', 'Égaré ?', 'Introuvable !'];
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentWord((prev) => (prev + 1) % words.length);
    }, 2000);
    return () => clearInterval(interval);
  }, [words.length]);

  const quickLinks = [
    {
      title: 'Accueil',
      description: 'Retour à la page principale',
      href: '/',
      icon: Home,
      color: 'from-magenta to-rose-powder'
    },
    {
      title: 'Services',
      description: 'Découvrez nos packages',
      href: '/services',
      icon: Palette,
      color: 'from-rose-powder to-cream'
    },
    {
      title: 'Portfolio',
      description: 'Mes réalisations',
      href: '/portfolio',
      icon: Code,
      color: 'from-cream to-rose-powder'
    },
    {
      title: 'Contact',
      description: 'Parlons de votre projet',
      href: '/contact',
      icon: Mail,
      color: 'from-rose-powder to-magenta'
    }
  ];

  const suggestions = [
    'Créer un site vitrine',
    'Développer une boutique en ligne',
    'Optimiser le référencement SEO',
    'Refonte de site existant',
    'Formation personnalisée',
    'Maintenance et support'
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
          <Coffee className="w-6 h-6 text-magenta"  aria-hidden="true" />
        </div>
        <div className="absolute top-1/3 right-1/3 animate-float" style={{ animationDelay: '5s' }}>
          <Code className="w-5 h-5 text-rose-powder"  aria-hidden="true" />
        </div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-20">
        <div className="max-w-4xl mx-auto text-center">
          {/* Error Badge */}
          <div className="inline-flex items-center space-x-2 bg-white/80 backdrop-blur-sm border border-rose-powder/30 rounded-full px-6 py-2 mb-8">
            <Sparkles className="w-4 h-4 text-magenta"  aria-hidden="true" />
            <span className="text-sm font-medium text-charcoal">Erreur 404 • Page Introuvable</span>
          </div>

          {/* Main Heading */}
          <h1 className="font-playfair text-6xl md:text-8xl font-bold text-charcoal mb-6 leading-tight">
            <span className="text-gradient relative">
              {words[currentWord]}
              <div className="absolute -inset-1 bg-gradient-rose opacity-20 blur-2xl rounded-lg"></div>
            </span>
          </h1>

          {/* 404 Number */}
          <div className="text-9xl md:text-[12rem] font-bold text-rose-powder/30 mb-8 leading-none">
            404
          </div>

          {/* Subtitle */}
          <p className="text-xl md:text-2xl text-charcoal/80 mb-12 max-w-3xl mx-auto leading-relaxed">
            Cette page semble avoir disparu dans les méandres du web ! 
            Mais ne vous inquiétez pas, je vais vous aider à retrouver votre chemin.
          </p>

          {/* Search Bar */}
          <div className="max-w-md mx-auto mb-16">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-charcoal/50"  aria-label="Rechercher" />
              <input
                type="text"
                placeholder="Que cherchez-vous ?"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-4 rounded-2xl border border-rose-powder/30 focus:border-magenta focus:outline-none transition-colors bg-white/80 backdrop-blur-sm text-charcoal placeholder-charcoal/50"
              />
            </div>
            
            {/* Search Suggestions */}
            {searchQuery.length > 0 && (
              <div className="mt-4 bg-white/90 backdrop-blur-sm rounded-2xl border border-rose-powder/30 shadow-rose overflow-hidden">
                {suggestions
                  .filter(suggestion => 
                    suggestion.toLowerCase().includes(searchQuery.toLowerCase())
                  )
                  .slice(0, 3)
                  .map((suggestion, index) => (
                    <Link
                      key={index}
                      href="/contact"
                      className="block px-4 py-3 hover:bg-rose-powder/10 transition-colors border-b border-rose-powder/20 last:border-b-0"
                    >
                      <span className="text-charcoal">{suggestion}</span>
                    </Link>
                  ))
                }
              </div>
            )}
          </div>

          {/* Quick Navigation */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
            {quickLinks.map((link, index) => {
              const IconComponent = link.icon;
              return (
                <Link
                  key={index}
                  href={link.href}
                  className="group bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-rose-powder/30 hover:border-magenta transition-all duration-300 hover:scale-105 hover:shadow-rose"
                >
                  <div className={`w-16 h-16 bg-gradient-to-br ${link.color} rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform`}>
                    <IconComponent className="w-8 h-8 text-white" />
                  </div>
                  
                  <h3 className="font-playfair text-xl font-bold text-charcoal mb-2">
                    {link.title}
                  </h3>
                  
                  <p className="text-charcoal/70 text-sm">
                    {link.description}
                  </p>
                </Link>
              );
            })}
          </div>

          {/* Popular Suggestions */}
          <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-8 border border-rose-powder/30 shadow-rose mb-16">
            <h2 className="font-playfair text-2xl font-bold text-charcoal mb-6">
              Peut-être cherchiez-vous...
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {suggestions.map((suggestion, index) => (
                <Link
                  key={index}
                  href="/contact"
                  className="bg-gradient-to-r from-rose-powder/10 to-cream/10 rounded-xl p-4 hover:from-rose-powder/20 hover:to-cream/20 transition-all duration-300 border border-rose-powder/20 hover:border-magenta/30"
                >
                  <span className="text-charcoal font-medium">{suggestion}</span>
                </Link>
              ))}
            </div>
          </div>

          {/* CTA Section */}
          <div className="text-center">
            <h3 className="font-playfair text-3xl font-bold text-charcoal mb-6">
              Besoin d'Aide ?
            </h3>
            
            <p className="text-charcoal/80 mb-8 max-w-2xl mx-auto">
              Si vous ne trouvez pas ce que vous cherchez, n'hésitez pas à me contacter. 
              Je serai ravie de vous aider à concrétiser votre projet web !
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/">
                <Button className="bg-gradient-to-r from-rose-powder to-cream text-charcoal px-8 py-4 text-lg font-semibold rounded-2xl hover:opacity-90 shadow-rose inline-flex items-center space-x-2">
                  <ArrowLeft className="w-5 h-5"  aria-label="Précédent" />
                  <span>Retour à l'Accueil</span>
                </Button>
              </Link>
              
              <Link href="/contact">
                <Button className="bg-gradient-rose text-white px-8 py-4 text-lg font-semibold rounded-2xl hover:opacity-90 shadow-rose inline-flex items-center space-x-2">
                  <Mail className="w-5 h-5"  aria-label="Email" />
                  <span>Me Contacter</span>
                </Button>
              </Link>
            </div>
          </div>

          {/* Fun Message */}
          <div className="mt-16 text-center">
            <p className="text-charcoal/60 text-sm italic">
              "Même les meilleures développeuses perdent parfois leurs pages... 
              Mais elles savent toujours comment les retrouver !" ✨
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

