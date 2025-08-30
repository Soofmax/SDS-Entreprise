'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { ArrowDown, Sparkles, Star, Zap, Heart, Code, Palette, Rocket, Coffee, Award, Users, Clock, Target } from 'lucide-react';
import Link from 'next/link';

export default function AboutPage() {
  const [currentWord, setCurrentWord] = useState(0);
  const words = ['Rencontrons-nous', 'Apprenons à nous connaître', 'Découvrez mon parcours', 'Partageons ma passion'];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentWord((prev) => (prev + 1) % words.length);
    }, 2000);
    return () => clearInterval(interval);
  }, [words.length]);

  const skills = [
    { name: 'Frontend Development', level: 95, icon: Code },
    { name: 'UI/UX Design', level: 90, icon: Palette },
    { name: 'Blockchain & Web3', level: 85, icon: Rocket },
    { name: 'Performance Optimization', level: 92, icon: Zap },
    { name: 'SEO & Marketing', level: 88, icon: Target },
    { name: 'Project Management', level: 93, icon: Users }
  ];

  const journey = [
    {
      year: '2024',
      title: 'Lancement de SDS',
      description: 'Création de mon studio de développement avec focus sur l\'excellence et l\'innovation.',
      icon: Rocket,
      color: 'from-magenta to-rose-powder'
    },
    {
      year: '2023',
      title: 'Spécialisation Web3',
      description: 'Expertise approfondie en blockchain et développement d\'applications décentralisées.',
      icon: Star,
      color: 'from-rose-powder to-cream'
    },
    {
      year: '2022',
      title: 'Freelance Full-Stack',
      description: 'Début de mon parcours indépendant avec des projets e-commerce et sites vitrines.',
      icon: Code,
      color: 'from-cream to-rose-powder'
    },
    {
      year: '2021',
      title: 'Formation Intensive',
      description: 'Perfectionnement en développement moderne et technologies émergentes.',
      icon: Award,
      color: 'from-rose-powder to-magenta'
    }
  ];

  const values = [
    {
      title: 'Excellence',
      description: 'Chaque ligne de code, chaque pixel compte. Je vise la perfection dans tous mes projets.',
      icon: Award,
      color: 'bg-gradient-to-br from-magenta/10 to-rose-powder/20'
    },
    {
      title: 'Innovation',
      description: 'Toujours à l\'affût des dernières technologies pour créer des solutions avant-gardistes.',
      icon: Rocket,
      color: 'bg-gradient-to-br from-rose-powder/20 to-cream'
    },
    {
      title: 'Proximité',
      description: 'Une relation de confiance et un accompagnement personnalisé pour chaque client.',
      icon: Heart,
      color: 'bg-gradient-to-br from-cream to-rose-powder/20'
    },
    {
      title: 'Rapidité',
      description: 'Des délais respectés et une réactivité exemplaire pour concrétiser vos projets.',
      icon: Clock,
      color: 'bg-gradient-to-br from-rose-powder/20 to-magenta/10'
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
          <Code className="w-6 h-6 text-magenta"  aria-hidden="true" />
        </div>
        <div className="absolute top-1/3 right-1/3 animate-float" style={{ animationDelay: '5s' }}>
          <Coffee className="w-5 h-5 text-rose-powder"  aria-hidden="true" />
        </div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-20">
        {/* Header Section */}
        <div className="max-w-4xl mx-auto text-center mb-20">
          {/* Badge */}
          <div className="inline-flex items-center space-x-2 bg-white/80 backdrop-blur-sm border border-rose-powder/30 rounded-full px-6 py-2 mb-8">
            <Heart className="w-4 h-4 text-magenta"  aria-hidden="true" />
            <span className="text-sm font-medium text-charcoal">Développeuse Web & Blockchain • Basée en France</span>
          </div>

          {/* Main Heading */}
          <h1 className="font-playfair text-5xl md:text-7xl font-bold text-charcoal mb-6 leading-tight">
            Salwa,
            <br />
            <span className="text-gradient relative">
              {words[currentWord]}
            </span>
            <br />
            par Nature
          </h1>

          <p className="text-xl md:text-2xl text-charcoal/80 mb-8 max-w-3xl mx-auto leading-relaxed">
            Passionnée par l'art du code et l'innovation digitale, je transforme vos idées 
            en expériences web exceptionnelles qui marquent les esprits.
          </p>

          {/* Personal Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-3xl mx-auto mb-12">
            <div className="text-center">
              <div className="text-3xl font-bold text-magenta mb-2">3+</div>
              <div className="text-sm text-charcoal/70">Années d'Expérience</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-magenta mb-2">50+</div>
              <div className="text-sm text-charcoal/70">Projets Réalisés</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-magenta mb-2">15+</div>
              <div className="text-sm text-charcoal/70">Technologies Maîtrisées</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-magenta mb-2">∞</div>
              <div className="text-sm text-charcoal/70">Tasses de Café</div>
            </div>
          </div>
        </div>

        {/* Story Section */}
        <div className="max-w-6xl mx-auto mb-24">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Image Placeholder */}
            <div className="relative">
              <div className="aspect-square bg-gradient-to-br from-rose-powder/30 to-magenta/20 rounded-3xl overflow-hidden border border-rose-powder/30">
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-32 h-32 bg-gradient-rose rounded-full flex items-center justify-center">
                    <Code className="w-16 h-16 text-white"  aria-hidden="true" />
                  </div>
                </div>
                
                {/* Floating Elements */}
                <div className="absolute top-8 right-8 animate-float">
                  <div className="w-12 h-12 bg-white/80 rounded-full flex items-center justify-center shadow-rose">
                    <Sparkles className="w-6 h-6 text-magenta"  aria-hidden="true" />
                  </div>
                </div>
                <div className="absolute bottom-8 left-8 animate-float" style={{ animationDelay: '1s' }}>
                  <div className="w-12 h-12 bg-white/80 rounded-full flex items-center justify-center shadow-rose">
                    <Heart className="w-6 h-6 text-magenta"  aria-hidden="true" />
                  </div>
                </div>
              </div>
            </div>

            {/* Story Content */}
            <div className="space-y-6">
              <h2 className="font-playfair text-4xl font-bold text-charcoal mb-6">
                Mon Histoire
              </h2>
              
              <div className="space-y-4 text-charcoal/80 leading-relaxed">
                <p>
                  Tout a commencé par une fascination pour la magie du code. Autodidacte passionnée, 
                  j'ai découvert que derrière chaque site web se cache une histoire, une vision, 
                  un rêve à concrétiser.
                </p>
                
                <p>
                  Spécialisée dans les technologies modernes comme React, Next.js et la blockchain, 
                  je crée des expériences digitales qui allient performance technique et esthétique raffinée. 
                  Chaque projet est une nouvelle aventure créative.
                </p>
                
                <p>
                  Mon approche ? Écouter, comprendre, puis transformer vos ambitions en réalité digitale. 
                  Parce que votre succès est ma plus belle récompense.
                </p>
              </div>

              <div className="flex flex-wrap gap-3 pt-4">
                {['React', 'Next.js', 'TypeScript', 'Blockchain', 'UI/UX', 'SEO'].map((tech, index) => (
                  <span
                    key={index}
                    className="bg-gradient-rose text-white px-4 py-2 rounded-full text-sm font-medium"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Skills Section */}
        <div className="max-w-6xl mx-auto mb-24">
          <h2 className="font-playfair text-4xl font-bold text-center text-charcoal mb-12">
            Mes Expertises
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {skills.map((skill, index) => {
              const IconComponent = skill.icon;
              return (
                <div
                  key={index}
                  className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-rose-powder/30 hover:border-magenta transition-all duration-300 hover:shadow-rose"
                >
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-gradient-rose rounded-full flex items-center justify-center">
                        <IconComponent className="w-5 h-5 text-white" />
                      </div>
                      <span className="font-semibold text-charcoal">{skill.name}</span>
                    </div>
                    <span className="text-magenta font-bold">{skill.level}%</span>
                  </div>
                  
                  <div className="w-full bg-cream rounded-full h-2">
                    <div
                      className="bg-gradient-rose h-2 rounded-full transition-all duration-1000 ease-out"
                      style={{ width: `${skill.level}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Journey Timeline */}
        <div className="max-w-4xl mx-auto mb-24">
          <h2 className="font-playfair text-4xl font-bold text-center text-charcoal mb-12">
            Mon Parcours
          </h2>
          
          <div className="space-y-8">
            {journey.map((step, index) => {
              const IconComponent = step.icon;
              return (
                <div
                  key={index}
                  className="flex items-start space-x-6 group"
                >
                  <div className="flex-shrink-0">
                    <div className={`w-16 h-16 bg-gradient-to-br ${step.color} rounded-full flex items-center justify-center shadow-rose group-hover:scale-110 transition-transform duration-300`}>
                      <IconComponent className="w-8 h-8 text-white" />
                    </div>
                  </div>
                  
                  <div className="flex-1 bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-rose-powder/30 group-hover:border-magenta transition-all duration-300 hover:shadow-rose">
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="font-playfair text-xl font-bold text-charcoal">
                        {step.title}
                      </h3>
                      <span className="bg-gradient-rose text-white px-3 py-1 rounded-full text-sm font-semibold">
                        {step.year}
                      </span>
                    </div>
                    <p className="text-charcoal/80 leading-relaxed">
                      {step.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Values Section */}
        <div className="max-w-6xl mx-auto mb-24">
          <h2 className="font-playfair text-4xl font-bold text-center text-charcoal mb-12">
            Mes Valeurs
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((value, index) => {
              const IconComponent = value.icon;
              return (
                <div
                  key={index}
                  className={`${value.color} rounded-2xl p-6 border border-rose-powder/30 hover:scale-105 transition-all duration-300 hover:shadow-rose`}
                >
                  <div className="w-12 h-12 bg-gradient-rose rounded-full flex items-center justify-center mb-4">
                    <IconComponent className="w-6 h-6 text-white" />
                  </div>
                  
                  <h3 className="font-playfair text-xl font-bold text-charcoal mb-3">
                    {value.title}
                  </h3>
                  
                  <p className="text-charcoal/80 text-sm leading-relaxed">
                    {value.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>

        {/* CTA Section */}
        <div className="max-w-4xl mx-auto text-center">
          <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-12 border border-rose-powder/30 shadow-rose">
            <div className="inline-flex items-center space-x-2 bg-gradient-rose text-white rounded-full px-6 py-2 mb-6">
              <Coffee className="w-5 h-5"  aria-hidden="true" />
              <span className="font-medium">Prenons un Café Virtuel</span>
            </div>
            
            <h3 className="font-playfair text-3xl font-bold text-charcoal mb-4">
              Discutons de Votre Projet
            </h3>
            
            <p className="text-charcoal/80 text-lg mb-8 leading-relaxed">
              Chaque grande réalisation commence par une conversation. 
              Partageons vos idées et créons ensemble quelque chose d'extraordinaire.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button className="bg-gradient-rose text-white px-8 py-4 text-lg font-semibold rounded-2xl hover:opacity-90 shadow-rose">
                Commencer la Discussion
              </Button>
              <Button 
                variant="outline" 
                className="border-2 border-magenta text-magenta hover:bg-magenta hover:text-white px-8 py-4 text-lg font-semibold rounded-2xl"
              >
                Voir Mon Portfolio
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
