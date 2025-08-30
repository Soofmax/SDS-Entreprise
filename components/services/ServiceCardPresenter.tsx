// Fichier: components/services/ServiceCardPresenter.tsx
// VERSION CORRIGÉE - Gère les deux modes d'affichage

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Check, Star, Clock, Info, ExternalLink } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { cn } from '@/lib/utils';

export interface Service {
  id: string; name: string; description: string; price: number; category: 'base' | 'addon';
  subCategory: string; features: string[]; duration?: string; popular?: boolean; dependencies?: string[];
  imageUrl?: string;
}

interface ServiceCardPresenterProps {
  service: Service;
  isSelected: boolean;
  children: React.ReactNode;
  className?: string;
  priority?: boolean;
  viewMode?: 'grid' | 'list'; // <-- La prop est maintenant officiellement acceptée
}

const getServiceImage = (service: Service): string => {
  const imageMap: Record<string, string> = { 'visibilite': '/images/services/seo-visibility.jpg', /* ... */ };
  return service.imageUrl || imageMap[service.subCategory] || '/images/services/default-service.jpg';
};

export function ServiceCardPresenter({ 
  service, 
  isSelected, 
  children, 
  className, 
  priority,
  viewMode = 'grid' // Valeur par défaut
}: ServiceCardPresenterProps) {

  // --- VUE EN LISTE ---
  if (viewMode === 'list') {
    return (
      <div className={cn("flex flex-col lg:flex-row gap-6 items-start w-full p-6 bg-white rounded-xl border transition-all duration-300", isSelected ? 'ring-2 ring-magenta' : 'border-rose-powder/30 hover:border-magenta/30', className)}>
        <div className="w-full lg:w-48 flex-shrink-0">
          <div className="relative aspect-video lg:aspect-square rounded-lg overflow-hidden bg-rose-powder/10">
            <Image src={getServiceImage(service)} alt={`...`} fill className="object-cover" priority={priority} />
          </div>
        </div>
        <div className="flex-1 min-w-0">
          <header className="mb-4">
            <div className="flex flex-wrap items-start justify-between gap-4 mb-3">
              <Link href={`/service/${service.id}`} className="group flex items-center gap-2">
                <h3 className="font-playfair text-xl lg:text-2xl text-charcoal group-hover:text-magenta">{service.name}</h3>
                <ExternalLink className="w-4 h-4 text-charcoal/40 group-hover:text-magenta" />
              </Link>
              <div className="flex items-center gap-3">
                <span className="font-bold text-magenta text-xl lg:text-2xl">{service.price.toLocaleString('fr-FR')}€</span>
              </div>
            </div>
            <p className="text-charcoal/70 leading-relaxed line-clamp-2">{service.description}</p>
          </header>
          <div className="mb-6">
            <h4 className="font-semibold text-charcoal mb-3 flex items-center gap-2"><Info className="w-4 h-4" />Fonctionnalités :</h4>
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {service.features.slice(0, 4).map((feature, index) => (
                <li key={index} className="flex items-start space-x-2">
                  <Check className="w-4 h-4 text-green-600 mt-0.5" />
                  <span className="text-sm text-charcoal/80">{feature}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
        <div className="w-full lg:w-64 flex-shrink-0 flex flex-col gap-3">
          {children}
        </div>
      </div>
    );
  }

  // --- VUE EN GRILLE (par défaut) ---
  return (
    <Card className={cn("flex flex-col h-full transition-all duration-300 relative", isSelected ? 'ring-2 ring-magenta' : 'hover:shadow-rose border-rose-powder/30', className)}>
      <CardHeader className="pb-4">
        {service.popular && <Badge className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-gradient-rose text-white shadow-rose z-10"><Star className="w-3 h-3 mr-1" /> Populaire</Badge>}
        <div className="relative aspect-video rounded-lg overflow-hidden mb-4 bg-rose-powder/10">
          <Image src={getServiceImage(service)} alt={`...`} fill className="object-cover" priority={priority} />
        </div>
        <Link href={`/service/${service.id}`} className="group">
          <CardTitle className="font-playfair text-lg text-charcoal group-hover:text-magenta">{service.name}</CardTitle>
        </Link>
        <span className="font-bold text-magenta text-lg pt-1">{service.price.toLocaleString('fr-FR')}€</span>
      </CardHeader>
      <CardContent className="flex-grow py-0">
        <CardDescription className="text-charcoal/70 line-clamp-3">{service.description}</CardDescription>
        <ul className="space-y-2 mt-4">
          {service.features.slice(0, 3).map((feature, index) => (
            <li key={index} className="flex items-start space-x-2">
              <Check className="w-3 h-3 text-green-600 mt-1" />
              <span className="text-sm text-charcoal/80">{feature}</span>
            </li>
          ))}
        </ul>
      </CardContent>
      <CardFooter className="pt-4 mt-auto flex flex-col gap-2">
        {children}
      </CardFooter>
    </Card>
  );
}
