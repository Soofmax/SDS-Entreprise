'use client';

import { useState, useEffect } from 'react';

export interface CookieConsent {
  necessary: boolean;
  analytics: boolean;
  marketing: boolean;
  preferences: boolean;
}

const CONSENT_KEY = 'sds-cookie-consent';
const CONSENT_DATE_KEY = 'sds-cookie-consent-date';

export function useCookieConsent() {
  const [consent, setConsent] = useState<CookieConsent | null>(null);
  const [showBanner, setShowBanner] = useState(false);

  useEffect(() => {
    // Vérifier le consentement existant
    const savedConsent = localStorage.getItem(CONSENT_KEY);
    const consentDate = localStorage.getItem(CONSENT_DATE_KEY);
    
    if (savedConsent && consentDate) {
      const consent = JSON.parse(savedConsent);
      const date = new Date(consentDate);
      const now = new Date();
      const daysDiff = (now.getTime() - date.getTime()) / (1000 * 3600 * 24);
      
      // Le consentement expire après 365 jours (RGPD)
      if (daysDiff < 365) {
        setConsent(consent);
        setShowBanner(false);
      } else {
        // Consentement expiré
        setShowBanner(true);
      }
    } else {
      // Pas de consentement, afficher la bannière
      setShowBanner(true);
    }
  }, []);

  const saveConsent = (newConsent: CookieConsent) => {
    setConsent(newConsent);
    setShowBanner(false);
    localStorage.setItem(CONSENT_KEY, JSON.stringify(newConsent));
    localStorage.setItem(CONSENT_DATE_KEY, new Date().toISOString());
    
    // Déclencher un événement personnalisé pour informer les autres composants
    window.dispatchEvent(new CustomEvent('cookieConsentChanged', { 
      detail: newConsent 
    }));
  };

  const acceptAll = () => {
    saveConsent({
      necessary: true,
      analytics: true,
      marketing: true,
      preferences: true,
    });
  };

  const rejectAll = () => {
    saveConsent({
      necessary: true, // Les cookies nécessaires ne peuvent pas être refusés
      analytics: false,
      marketing: false,
      preferences: false,
    });
  };

  const acceptSelected = (selectedConsent: Partial<CookieConsent>) => {
    saveConsent({
      necessary: true, // Toujours nécessaire
      analytics: selectedConsent.analytics || false,
      marketing: selectedConsent.marketing || false,
      preferences: selectedConsent.preferences || false,
    });
  };

  const resetConsent = () => {
    localStorage.removeItem(CONSENT_KEY);
    localStorage.removeItem(CONSENT_DATE_KEY);
    setConsent(null);
    setShowBanner(true);
  };

  // Helpers pour vérifier les consentements spécifiques
  const hasConsent = consent?.analytics || false;
  const hasMarketingConsent = consent?.marketing || false;
  const hasPreferencesConsent = consent?.preferences || false;

  return {
    consent,
    showBanner,
    hasConsent,
    hasMarketingConsent,
    hasPreferencesConsent,
    acceptAll,
    rejectAll,
    acceptSelected,
    resetConsent,
    saveConsent,
  };
}

