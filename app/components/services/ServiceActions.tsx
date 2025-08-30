'use client';
import { Button } from '@/components/ui/button';
import { ShoppingCart, Mail } from 'lucide-react';
import { useConsentTracking } from '@/hooks/useConsentTracking';
import { type Service } from '@/lib/services-data';
import { toast } from 'sonner';

interface ServiceActionsProps {
  service: Service;
}

export function ServiceActions({ service }: ServiceActionsProps) {
  const { trackEvent } = useConsentTracking();

  const handleAddToCart = () => {
    trackEvent('add_to_cart', { serviceId: service.id, price: service.price });
    toast.success(`${service.name} ajouté au panier !`);
  };

  const handleRequestQuote = () => {
    trackEvent('generate_lead', { serviceId: service.id });
    toast.info('Demande de devis envoyée !');
  };

  return (
    <div className="space-y-4">
      <Button 
        size="lg" 
        className="w-full bg-gradient-rose text-white shadow-rose text-lg h-14"
        onClick={handleAddToCart}
      >
        <ShoppingCart className="w-5 h-5 mr-2" />
        Ajouter au Panier - {service.price.toLocaleString('fr-FR')}€
      </Button>
      <Button 
        size="lg" 
        variant="outline" 
        className="w-full border-magenta text-magenta hover:bg-magenta hover:text-white h-14"
        onClick={handleRequestQuote}
      >
        <Mail className="w-5 h-5 mr-2" />
        Demander un devis gratuit
      </Button>
    </div>
  );
}
