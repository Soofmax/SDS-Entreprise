'use client';

import { useCallback } from 'react';
import { trackEvents, trackEvent } from '@/lib/analytics/gtag';
import { useCookieConsent } from './useCookieConsent';

export function useAnalytics() {
  const { hasConsent } = useCookieConsent();

  // Wrapper pour tous les événements de tracking
  const track = useCallback((eventFunction: () => void) => {
    if (hasConsent) {
      eventFunction();
    }
  }, [hasConsent]);

  // Événements spécifiques pour SDS
  const analytics = {
    // Formulaires
    trackContactForm: useCallback((formType: string) => {
      track(() => trackEvents.contactFormSubmit(formType));
    }, [track]),

    trackCalculatorUsage: useCallback((result: number) => {
      track(() => trackEvents.calculatorUsed(result));
    }, [track]),

    // Packages et services
    trackPackageSelection: useCallback((packageName: string, price: number) => {
      track(() => trackEvents.packageSelected(packageName, price));
    }, [track]),

    trackServiceView: useCallback((serviceName: string) => {
      track(() => trackEvents.serviceView(serviceName));
    }, [track]),

    // Portfolio
    trackPortfolioView: useCallback((projectName: string) => {
      track(() => trackEvents.portfolioItemView(projectName));
    }, [track]),

    // Conversions
    trackQuoteRequest: useCallback((packageName: string, budget: number) => {
      track(() => trackEvents.quoteRequested(packageName, budget));
    }, [track]),

    // Navigation et engagement
    trackButtonClick: useCallback((buttonName: string, location: string) => {
      track(() => trackEvent({
        action: 'button_click',
        category: 'engagement',
        label: `${buttonName}_${location}`,
      }));
    }, [track]),

    trackModalOpen: useCallback((modalName: string) => {
      track(() => trackEvent({
        action: 'modal_open',
        category: 'engagement',
        label: modalName,
      }));
    }, [track]),

    trackModalClose: useCallback((modalName: string, timeSpent: number) => {
      track(() => trackEvent({
        action: 'modal_close',
        category: 'engagement',
        label: modalName,
        value: timeSpent,
      }));
    }, [track]),

    // Recherche
    trackSearch: useCallback((query: string, resultsCount: number) => {
      track(() => trackEvent({
        action: 'search',
        category: 'engagement',
        label: query,
        value: resultsCount,
      }));
    }, [track]),

    // Filtres
    trackFilterUsage: useCallback((filterType: string, filterValue: string) => {
      track(() => trackEvent({
        action: 'filter_used',
        category: 'engagement',
        label: `${filterType}_${filterValue}`,
      }));
    }, [track]),

    // Téléchargements
    trackDownload: useCallback((fileName: string, fileType: string) => {
      track(() => trackEvent({
        action: 'download',
        category: 'content',
        label: `${fileName}.${fileType}`,
      }));
    }, [track]),

    // Erreurs
    trackError: useCallback((errorType: string, errorMessage: string) => {
      track(() => trackEvent({
        action: 'error',
        category: 'error',
        label: errorType,
        custom_parameters: {
          error_message: errorMessage,
        },
      }));
    }, [track]),

    // Performance
    trackPerformance: useCallback((metric: string, value: number) => {
      track(() => trackEvent({
        action: 'performance_metric',
        category: 'performance',
        label: metric,
        value: Math.round(value),
      }));
    }, [track]),

    // Accessibilité
    trackAccessibilityUsage: useCallback((feature: string) => {
      track(() => trackEvent({
        action: 'accessibility_feature_used',
        category: 'accessibility',
        label: feature,
      }));
    }, [track]),

    // PWA
    trackPWAInstall: useCallback(() => {
      track(() => trackEvent({
        action: 'pwa_install',
        category: 'pwa',
        label: 'app_installed',
      }));
    }, [track]),

    trackPWAUsage: useCallback((feature: string) => {
      track(() => trackEvent({
        action: 'pwa_feature_used',
        category: 'pwa',
        label: feature,
      }));
    }, [track]),

    // Événements personnalisés
    trackCustomEvent: useCallback((action: string, category: string, label?: string, value?: number, customParams?: Record<string, any>) => {
      track(() => trackEvent({
        action,
        category,
        label,
        value,
        custom_parameters: customParams,
      }));
    }, [track]),
  };

  return {
    ...analytics,
    hasConsent,
    isTrackingEnabled: hasConsent,
  };
}

