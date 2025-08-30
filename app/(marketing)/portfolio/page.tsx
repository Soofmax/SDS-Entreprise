'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { ArrowDown, Sparkles, Star, Zap, Heart, ExternalLink, Github, Eye, Calendar, Tag } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

export default function PortfolioPage() {
  const [currentWord, setCurrentWord] = useState(0);
  const words = ['Découvrez mes créations', 'Explorez mon univers', 'Admirez le résultat', 'Inspirez-vous'];
  const [selectedCategory, setSelectedCategory] = useState('all');

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentWord((prev) => (prev + 1) % words.length);
    }, 2000);
    return () => clearInterval(interval);
  }, [words.length]);

  const categories = [
    { id: 'all', name: 'Tous les Projets', count: 12 },
    { id: 'vitrine', name: 'Sites Vitrines', count: 5 },
    { id: 'ecommerce', name: 'E-commerce', count: 3 },
    { id: 'web3', name: 'Web3 & Blockchain', count: 2 },
    { id: 'mobile', name: 'Applications', count: 2 }
  ];

  const projects = [
    {
      id: 1,
      title: 'Boutique Artisanale Élégante',
      category: 'ecommerce',
      description: 'E-commerce sur-mesure pour une créatrice de bijoux avec système de personnalisation et paiements sécurisés.',
      image: '/api/placeholder/600/400',
      technologies: ['Next.js', 'Stripe', 'Tailwind CSS', 'Prisma'],
      date: '2024',
      status: 'Livré',
      metrics: {
        performance: '98/100',
        conversion: '+250%',
        satisfaction: '5/5'
      },
      links: {
        live: 'https://example.com',
        github: 'https://github.com/example'
      }
    },
    {
      id: 2,
      title: 'Cabinet Médical Moderne',
      category: 'vitrine',
      description: 'Site vitrine professionnel avec système de prise de rendez-vous en ligne et espace patient sécurisé.',
      image: '/api/placeholder/600/400',
      technologies: ['React', 'Node.js', 'MongoDB', 'Calendly API'],
      date: '2024',
      status: 'Livré',
      metrics: {
        performance: '96/100',
        rdv: '+180%',
        satisfaction: '5/5'
      },
      links: {
        live: 'https://example.com'
      }
    },
    {
      id: 3,
      title: 'Plateforme NFT Artistique',
      category: 'web3',
      description: 'Marketplace décentralisée pour artistes avec minting automatique et royalties intelligentes.',
      image: '/api/placeholder/600/400',
      technologies: ['Next.js', 'Ethereum', 'Solidity', 'IPFS'],
      date: '2024',
      status: 'En cours',
      metrics: {
        performance: '94/100',
        transactions: '1000+',
        satisfaction: '4.8/5'
      },
      links: {
        live: 'https://example.com',
        github: 'https://github.com/example'
      }
    },
    {
      id: 4,
      title: 'Restaurant Gastronomique',
      category: 'vitrine',
      description: 'Site vitrine élégant avec menu interactif, réservations en ligne et galerie photo immersive.',
      image: '/api/placeholder/600/400',
      technologies: ['Vue.js', 'Nuxt', 'Strapi', 'Cloudinary'],
      date: '2023',
      status: 'Livré',
      metrics: {
        performance: '97/100',
        reservations: '+300%',
        satisfaction: '5/5'
      },
      links: {
        live: 'https://example.com'
      }
    },
    {
      id: 5,
      title: 'App Mobile Fitness',
      category: 'mobile',
      description: 'Application mobile de coaching sportif avec suivi personnalisé et communauté intégrée.',
      image: '/api/placeholder/600/400',
      technologies: ['React Native', 'Firebase', 'Stripe', 'Push Notifications'],
      date: '2023',
      status: 'Livré',
      metrics: {
        performance: '95/100',
        users: '5000+',
        satisfaction: '4.9/5'
      },
      links: {
        live: 'https://example.com'
      }
    },
    {
      id: 6,
      title: 'Startup Fintech',
      category: 'vitrine',
      description: 'Landing page haute conversion pour une startup fintech avec animations sur-mesure.',
      image: '/api/placeholder/600/400',
      technologies: ['Next.js', 'Framer Motion', 'TypeScript', 'Vercel'],
      date: '2023',
      status: 'Livré',
      metrics: {
        performance: '99/100',
        conversion: '+400%',
        satisfaction: '5/5'
      },
      links: {
        live: 'https://example.com',
        github: 'https://github.com/example'
      }
    }
  ];

  const filteredProjects = selectedCategory === 'all' 
    ? projects 
    : projects.filter(project => project.category === selectedCategory);

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
          <Eye className="w-6 h-6 text-magenta"  aria-hidden="true" />
        </div>
        <div className="absolute top-1/3 right-1/3 animate-float" style={{ animationDelay: '5s' }}>
          <Github className="w-5 h-5 text-rose-powder"  aria-hidden="true" />
        </div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-20">
        {/* Header Section */}
        <div className="max-w-4xl mx-auto text-center mb-20">
          {/* Badge */}
          <div className="inline-flex items-center space-x-2 bg-white/80 backdrop-blur-sm border border-rose-powder/30 rounded-full px-6 py-2 mb-8">
            <Eye className="w-4 h-4 text-magenta"  aria-hidden="true" />
            <span className="text-sm font-medium text-charcoal">50+ Projets Réalisés • 100% Clients Satisfaits</span>
          </div>

          {/* Main Heading */}
          <h1 className="font-playfair text-5xl md:text-7xl font-bold text-charcoal mb-6 leading-tight">
            Mes
            <br />
            <span className="text-gradient relative">
              {words[currentWord]}
            </span>
            <br />
            Digitales
          </h1>

          <p className="text-xl md:text-2xl text-charcoal/80 mb-8 max-w-3xl mx-auto leading-relaxed">
            Découvrez une sélection de mes projets les plus récents. 
            Chaque création reflète ma passion pour l'excellence et l'innovation digitale.
          </p>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-8 max-w-2xl mx-auto mb-12">
            <div className="text-center">
              <div className="text-3xl font-bold text-magenta mb-2">50+</div>
              <div className="text-sm text-charcoal/70">Projets Livrés</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-magenta mb-2">100%</div>
              <div className="text-sm text-charcoal/70">Satisfaction Client</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-magenta mb-2">48h</div>
              <div className="text-sm text-charcoal/70">Temps Moyen</div>
            </div>
          </div>
        </div>

        {/* Categories Filter */}
        <div className="max-w-4xl mx-auto mb-16">
          <div className="flex flex-wrap justify-center gap-4">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`px-6 py-3 rounded-full text-sm font-medium transition-all duration-300 ${
                  selectedCategory === category.id
                    ? 'bg-gradient-rose text-white shadow-rose'
                    : 'bg-white/70 text-charcoal border border-rose-powder/30 hover:border-magenta hover:shadow-rose'
                }`}
              >
                {category.name}
                <span className="ml-2 text-xs opacity-70">({category.count})</span>
              </button>
            ))}
          </div>
        </div>

        {/* Projects Grid */}
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredProjects.map((project, index) => (
              <div
                key={project.id}
                className="group bg-white/80 backdrop-blur-sm rounded-3xl overflow-hidden border border-rose-powder/30 hover:border-magenta transition-all duration-500 hover:scale-105 hover:shadow-rose-lg"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                {/* Project Image */}
                <div className="relative h-48 bg-gradient-to-br from-rose-powder/20 to-magenta/10 overflow-hidden">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-16 h-16 bg-gradient-rose rounded-full flex items-center justify-center">
                      <Eye className="w-8 h-8 text-white"  aria-hidden="true" />
                    </div>
                  </div>
                  
                  {/* Status Badge */}
                  <div className="absolute top-4 right-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      project.status === 'Livré' 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-blue-100 text-blue-800'
                    }`}>
                      {project.status}
                    </span>
                  </div>
                </div>

                {/* Project Content */}
                <div className="p-6">
                  {/* Category & Date */}
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-medium text-magenta bg-rose-powder/20 px-3 py-1 rounded-full">
                      {categories.find(c => c.id === project.category)?.name}
                    </span>
                    <span className="text-xs text-charcoal/60 flex items-center">
                      <Calendar className="w-3 h-3 mr-1"  aria-label="Calendrier" />
                      {project.date}
                    </span>
                  </div>

                  {/* Title & Description */}
                  <h3 className="font-playfair text-xl font-bold text-charcoal mb-3 group-hover:text-magenta transition-colors">
                    {project.title}
                  </h3>
                  
                  <p className="text-charcoal/80 text-sm leading-relaxed mb-4">
                    {project.description}
                  </p>

                  {/* Technologies */}
                  <div className="flex flex-wrap gap-2 mb-4">
                    {project.technologies.slice(0, 3).map((tech, techIndex) => (
                      <span
                        key={techIndex}
                        className="text-xs bg-cream text-charcoal px-2 py-1 rounded-full border border-rose-powder/30"
                      >
                        {tech}
                      </span>
                    ))}
                    {project.technologies.length > 3 && (
                      <span className="text-xs text-charcoal/60">
                        +{project.technologies.length - 3}
                      </span>
                    )}
                  </div>

                  {/* Metrics */}
                  <div className="grid grid-cols-3 gap-2 mb-6 text-center">
                    {Object.entries(project.metrics).map(([key, value], metricIndex) => (
                      <div key={metricIndex} className="bg-cream/50 rounded-lg p-2">
                        <div className="text-xs font-semibold text-magenta">{value}</div>
                        <div className="text-xs text-charcoal/60 capitalize">{key}</div>
                      </div>
                    ))}
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-2">
                    {project.links.live && (
                      <Button
                        size="sm"
                        className="flex-1 bg-gradient-rose text-white hover:opacity-90 text-xs"
                      >
                        <ExternalLink className="w-3 h-3 mr-1" />
                        Voir le Site
                      </Button>
                    )}
                    {project.links.github && (
                      <Button
                        size="sm"
                        variant="outline"
                        className="border-magenta text-magenta hover:bg-magenta hover:text-white text-xs"
                      >
                        <Github className="w-3 h-3 mr-1"  aria-hidden="true" />
                        Code
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* CTA Section */}
        <div className="max-w-4xl mx-auto mt-24 text-center">
          <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-12 border border-rose-powder/30 shadow-rose">
            <div className="inline-flex items-center space-x-2 bg-gradient-rose text-white rounded-full px-6 py-2 mb-6">
              <Sparkles className="w-5 h-5"  aria-hidden="true" />
              <span className="font-medium">Projet en Tête ?</span>
            </div>
            
            <h3 className="font-playfair text-3xl font-bold text-charcoal mb-4">
              Créons Ensemble Votre Prochaine Réussite
            </h3>
            
            <p className="text-charcoal/80 text-lg mb-8 leading-relaxed">
              Chaque projet est unique et mérite une approche sur-mesure. 
              Discutons de vos ambitions et donnons vie à vos idées.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button className="bg-gradient-rose text-white px-8 py-4 text-lg font-semibold rounded-2xl hover:opacity-90 shadow-rose">
                Démarrer Mon Projet
              </Button>
              <Button 
                variant="outline" 
                className="border-2 border-magenta text-magenta hover:bg-magenta hover:text-white px-8 py-4 text-lg font-semibold rounded-2xl"
              >
                Voir Plus de Projets
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

