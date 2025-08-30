// Fichier: components/layout/CookieBanner.tsx
// Affiche une bannière de consentement et sauvegarde le choix de l'utilisateur.

'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Cookie } from 'lucide-react';
import Link from 'next/link';

// Constante pour la clé de stockage, évite les "chaînes magiques"
const CONSENT_STORAGE_KEY = 'cookie_consent';

export function CookieBanner() {
  // On utilise un état qui peut être 'pending', 'given' ou 'required'
  // pour mieux gérer l'affichage et éviter les flashs de contenu.
  const [consentStatus, setConsentStatus] = useState<'pending' | 'given' | 'required'>('pending');

  useEffect(() => {
    // La vérification se fait uniquement côté client
    const consent = localStorage.getItem(CONSENT_STORAGE_KEY);
    setConsentStatus(consent ? 'given' : 'required');
  }, []);

  // Fonction centralisée pour gérer le consentement
  const handleConsent = (accepted: boolean) => {
    const consentValue = { 
      analytics: accepted, 
      marketing: accepted, // Simplifié pour cet exemple
      timestamp: Date.now() 
    };
    localStorage.setItem(CONSENT_STORAGE_KEY, JSON.stringify(consentValue));
    setConsentStatus('given');

    // On recharge la page uniquement si l'utilisateur accepte,
    // pour activer les scripts de suivi qui auraient pu être bloqués.
    if (accepted) {
      window.location.reload();
    }
  };

  // On n'affiche rien tant qu'on ne sait pas si le consentement est requis
  // ou si la bannière ne doit pas être montrée.
  if (consentStatus !== 'required') {
    return null;
  }

  return (
    <div 
      role="dialog"
      aria-labelledby="cookie-banner-title"
      aria-describedby="cookie-banner-description"
      className="fixed bottom-0 left-0 right-0 bg-charcoal/95 backdrop-blur-md text-cream p-4 z-[100] shadow-2xl animate-in slide-in-from-bottom-10 duration-500"
    >
      <div className="container mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-start gap-3">
          <Cookie className="w-8 h-8 text-rose-powder flex-shrink-0 mt-1" aria-hidden="true" />
          <div>
            <h3 id="cookie-banner-title" className="font-semibold font-playfair">Votre vie privée est notre priorité</h3>
            <p id="cookie-banner-description" className="text-sm text-cream/80 mt-1">
              Nous utilisons des cookies pour analyser le trafic et améliorer votre expérience. 
              Votre confiance est essentielle. <Link href="/privacy" className="underline hover:text-rose-powder">En savoir plus</Link>.
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3 flex-shrink-0">
          <Button 
            variant="outline" 
            onClick={() => handleConsent(false)} 
            className="border-cream/50 text-cream hover:bg-cream hover:text-charcoal"
          >
            Refuser
          </Button>
          <Button 
            onClick={() => handleConsent(true)} 
            className="bg-gradient-rose text-white shadow-rose"
          >
            Accepter
          </Button>
        </div>
      </div>
    </div>
  );
}
