// Fichier: hooks/useConsentTracking.ts
// Lit le consentement stocké par la CookieBanner et fournit une fonction de tracking sécurisée.

'use client';

import { useState, useEffect, useCallback } from 'react';

// Interface pour la structure du consentement stocké
interface Consent {
  analytics: boolean;
  marketing: boolean;
}

// Valeur par défaut pour éviter les états nuls
const defaultConsent: Consent = { analytics: false, marketing: false };

// Constante pour la clé de stockage, partagée avec la bannière
const CONSENT_STORAGE_KEY = 'cookie_consent';

/**
 * Hook pour gérer le consentement utilisateur et fournir une fonction de suivi sécurisée.
 * @returns {object} Un objet contenant le statut du consentement et la fonction de suivi.
 * @property {boolean} hasAnalyticsConsent - Vrai si l'utilisateur a consenti au suivi analytique.
 * @property {(eventName: string, data?: Record<string, any>) => void} trackEvent - Fonction pour envoyer un événement de suivi.
 */
export function useConsentTracking() {
  const [consent, setConsent] = useState<Consent>(defaultConsent);

  // useEffect pour lire le consentement depuis le localStorage au montage du composant.
  useEffect(() => {
    const savedConsentRaw = localStorage.getItem(CONSENT_STORAGE_KEY);
    if (savedConsentRaw) {
      try {
        const savedConsent = JSON.parse(savedConsentRaw) as Consent;
        setConsent(savedConsent);
      } catch (error) {
        console.error("Failed to parse consent from localStorage", error);
        setConsent(defaultConsent);
      }
    }
  }, []);

  /**
   * Envoie un événement de suivi (ex: Google Analytics) si le consentement a été donné.
   * Utilise useCallback pour la mémoïsation, optimisant les performances.
   */
  const trackEvent = useCallback(
    (eventName: string, data?: Record<string, any>) => {
      // Vérification robuste : consentement + existence de la fonction de suivi globale
      if (consent.analytics && typeof window.gtag === 'function') {
        window.gtag('event', eventName, data);
        // En production, on pourrait vouloir supprimer les logs console.
        console.log(`[Analytics] Event tracked: ${eventName}`, data || {});
      } else {
        console.log(`[Analytics] Event NOT tracked (no consent or gtag not found): ${eventName}`, data || {});
      }
    },
    [consent.analytics] // La fonction ne sera recréée que si `consent.analytics` change.
  );

  return { 
    hasAnalyticsConsent: consent.analytics, 
    trackEvent 
  };
}

// Déclaration globale pour informer TypeScript de l'existence de `window.gtag`
declare global {
  interface Window {
    gtag?: (type: 'event', eventName: string, data?: Record<string, any>) => void;
  }
}
