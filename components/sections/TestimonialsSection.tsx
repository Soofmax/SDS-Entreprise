'use client';

import { Card, CardContent } from '@/components/ui/card';
import { Star, Quote } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

const testimonials = [
  {
    id: 1,
    name: "Marie Dubois",
    role: "CEO, Studio Créatif",
    avatar: "https://images.pexels.com/photos/1499327/pexels-photo-1499327.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=2",
    content: "SDS a transformé notre vision en réalité digitale. Son approche créative et sa maîtrise technique ont dépassé toutes nos attentes. Un travail d'exception !",
    rating: 5,
  },
  {
    id: 2,
    name: "Thomas Martin",
    role: "Fondateur, TechStart",
    avatar: "https://images.pexels.com/photos/1674752/pexels-photo-1674752.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=2",
    content: "L'intégration Web3 de notre plateforme était complexe, mais SDS a géré chaque détail avec professionnalisme. Résultat : une solution élégante et performante.",
    rating: 5,
  },
  {
    id: 3,
    name: "Sophie Laurent",
    role: "Directrice Marketing",
    avatar: "https://images.pexels.com/photos/1036627/pexels-photo-1036627.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=2",
    content: "Notre nouveau site vitrine génère 3x plus de leads qu'avant. Le design est magnifique et l'expérience utilisateur parfaite. Merci SDS !",
    rating: 5,
  },
];

export function TestimonialsSection() {
  return (
    <section className="py-20 bg-gradient-to-br from-rose-powder/10 to-cream">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="font-playfair text-4xl md:text-5xl font-bold text-charcoal mb-6">
            Ce que Disent
            <span className="text-gradient block">Mes Clients</span>
          </h2>
          <p className="text-xl text-charcoal/70 leading-relaxed">
            Leurs succès sont ma plus belle récompense. Découvrez pourquoi ils me font confiance 
            pour leurs projets digitaux.
          </p>
        </div>

        {/* Testimonials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial) => (
            <Card key={testimonial.id} className="relative border-rose-powder/30 hover:shadow-rose transition-shadow duration-300">
              <CardContent className="p-6">
                {/* Quote Icon */}
                <div className="mb-4">
                  <Quote className="w-8 h-8 text-magenta opacity-20" />
                </div>

                {/* Rating */}
                <div className="flex items-center space-x-1 mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-current text-yellow-400" />
                  ))}
                </div>

                {/* Content */}
                <p className="text-charcoal/80 leading-relaxed mb-6 italic">
                  "{testimonial.content}"
                </p>

                {/* Author */}
                <div className="flex items-center space-x-4">
                  <Avatar className="w-12 h-12">
                    <AvatarImage src={testimonial.avatar} alt={testimonial.name} />
                    <AvatarFallback className="bg-rose-powder text-magenta">
                      {testimonial.name.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h4 className="font-semibold text-charcoal">{testimonial.name}</h4>
                    <p className="text-sm text-charcoal/60">{testimonial.role}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Trust Indicators */}
        <div className="mt-16 text-center">
          <div className="inline-flex items-center space-x-8 bg-white/80 backdrop-blur-sm rounded-full px-8 py-4 shadow-rose">
            <div className="flex items-center space-x-2">
              <div className="text-2xl font-bold text-magenta font-playfair">4.9</div>
              <div className="flex items-center space-x-1">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-current text-yellow-400" />
                ))}
              </div>
            </div>
            <div className="hidden sm:block w-px h-6 bg-rose-powder"></div>
            <div className="text-sm text-charcoal/70 font-medium">
              Note moyenne sur 50+ projets
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}