// Fichier: components/services/ServiceDetailActions.tsx
// Rôle: Gère TOUTE l'interactivité de la barre latérale d'une page de service.

'use client';

import { useCart } from '@/app/providers';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { ShoppingCart, Mail, Check } from 'lucide-react';
import Link from 'next/link';
import { type Service } from '@/lib/services-data'; // On importe le type

interface ServiceDetailActionsProps {
  service: Service; // Il ne reçoit que des DONNÉES, pas de fonctions.
}

export function ServiceDetailActions({ service }: ServiceDetailActionsProps) {
  const { services, addService, removeService } = useCart();
  const isSelected = services.some(s => s.id === service.id);

  const handleToggleService = () => {
    if (isSelected) {
      removeService(service.id);
      toast.error(`${service.name} retiré du panier.`);
    } else {
      addService({ ...service, isSelected: true });

      toast.success(`${service.name} ajouté au panier !`);
    }
  };

  return (
    <div className="space-y-4">
      <Button 
        size="lg" 
        className={`w-full text-lg h-14 transition-all duration-300 ${
          isSelected 
            ? 'bg-green-600 hover:bg-green-700 text-white' 
            : 'bg-gradient-rose text-white shadow-rose'
        }`}
        onClick={handleToggleService}
      >
        {isSelected ? (
          <Check className="w-5 h-5 mr-2" />
        ) : (
          <ShoppingCart className="w-5 h-5 mr-2" />
        )}
        {isSelected ? 'Ajouté au panier' : `Ajouter - ${service.price.toLocaleString('fr-FR')}€`}
      </Button>
      
      <Link href="/contact" passHref>
        <Button 
          size="lg" 
          variant="outline" 
          className="w-full border-magenta text-magenta hover:bg-magenta hover:text-white h-14"
        >
          <Mail className="w-5 h-5 mr-2" />
          Demander un devis gratuit
        </Button>
      </Link>
    </div>
  );
}
