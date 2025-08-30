// Fichier: components/services/ServiceCard.tsx
// VERSION CORRIGÉE - Transmet le viewMode au Presenter

'use client';

import { useCart } from '@/app/providers';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Check, Plus } from 'lucide-react';
import Link from 'next/link';
import { ServiceCardPresenter, type Service } from './ServiceCardPresenter';

export type { Service };

interface ServiceCardProps {
  service: Service;
  className?: string;
  priority?: boolean;
  viewMode?: 'grid' | 'list'; // <-- La prop est maintenant acceptée ici aussi
}

export function ServiceCard({ service, className, priority, viewMode }: ServiceCardProps) {
  const { services, addService, removeService } = useCart();
  const isSelected = services.some(s => s.id === service.id);
  const canAdd = service.category === 'base' || (service.dependencies && service.dependencies.some(dep => services.some(s => s.id === dep)));

  const handleToggleService = () => {
    // ... (logique de clic identique)
  };

  return (
    <ServiceCardPresenter 
      service={service} 
      isSelected={isSelected}
      className={className}
      priority={priority}
      viewMode={viewMode} // <-- On passe l'instruction au composant visuel
    >
      {/* Les boutons interactifs restent les mêmes */}
      <Button onClick={handleToggleService} /* ... */ >
        {isSelected ? 'Ajouté' : 'Ajouter'}
      </Button>
      <Link href={`/service/${service.id}`} /* ... */ >
        Détails
      </Link>
    </ServiceCardPresenter>
  );
}
