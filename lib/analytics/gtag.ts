// Google Analytics 4 Configuration
export const GA_TRACKING_ID = process.env.NEXT_PUBLIC_GA_ID || 'G-XXXXXXXXXX';

// Types pour les événements GA4
export interface GAEvent {
  action: string;
  category?: string;
  label?: string;
  value?: number;
  custom_parameters?: Record<string, any>;
}

// Initialiser Google Analytics
export const initGA = (): void => {
  if (typeof window !== 'undefined' && GA_TRACKING_ID) {
    // Charger le script Google Analytics
    const script = document.createElement('script');
    script.async = true;
    script.src = `https://www.googletagmanager.com/gtag/js?id=${GA_TRACKING_ID}`;
    document.head.appendChild(script);

    // Initialiser gtag (cast pour éviter les erreurs TS sur propriétés q/l du shim)
    const w = window as unknown as { gtag: ((...args: any[]) => void) & { q?: any[]; l?: number } };
    w.gtag = w.gtag || function () {
      (w.gtag.q = w.gtag.q || []).push(arguments);
    };
    w.gtag.l = +new Date();

    // Configuration GA4
    w.gtag('js', new Date());
    w.gtag('config', GA_TRACKING_ID, {
      page_title: document.title,
      page_location: window.location.href,
      anonymize_ip: true, // Conformité RGPD
      allow_google_signals: false, // Désactiver par défaut
      allow_ad_personalization_signals: false, // Désactiver par défaut
    });
  }
};

// Tracker une page vue
export const trackPageView = (url: string, title?: string): void => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('config', GA_TRACKING_ID, {
      page_path: url,
      page_title: title || document.title,
    });
  }
};

// Tracker un événement personnalisé
export const trackEvent = ({ action, category, label, value, custom_parameters }: GAEvent): void => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', action, {
      event_category: category,
      event_label: label,
      value: value,
      ...custom_parameters,
    });
  }
};

// Événements prédéfinis pour SDS
export const trackEvents = {
  // Navigation
  pageView: (page: string) => trackPageView(page),
  
  // Engagement
  contactFormSubmit: (formType: string) => trackEvent({
    action: 'form_submit',
    category: 'engagement',
    label: formType,
  }),
  
  calculatorUsed: (result: number) => trackEvent({
    action: 'calculator_used',
    category: 'engagement',
    label: 'france_num_calculator',
    value: result,
  }),
  
  packageSelected: (packageName: string, price: number) => trackEvent({
    action: 'package_selected',
    category: 'conversion',
    label: packageName,
    value: price,
  }),
  
  // Conversions
  quoteRequested: (packageName: string, budget: number) => trackEvent({
    action: 'quote_requested',
    category: 'conversion',
    label: packageName,
    value: budget,
  }),
  
  phoneClick: () => trackEvent({
    action: 'phone_click',
    category: 'conversion',
    label: 'header_phone',
  }),
  
  emailClick: () => trackEvent({
    action: 'email_click',
    category: 'conversion',
    label: 'contact_email',
  }),
  
  // Contenu
  portfolioItemView: (projectName: string) => trackEvent({
    action: 'portfolio_view',
    category: 'content',
    label: projectName,
  }),
  
  serviceView: (serviceName: string) => trackEvent({
    action: 'service_view',
    category: 'content',
    label: serviceName,
  }),
  
  // Social
  socialClick: (platform: string) => trackEvent({
    action: 'social_click',
    category: 'social',
    label: platform,
  }),
  
  // Téléchargements
  downloadGuide: (guideName: string) => trackEvent({
    action: 'download',
    category: 'content',
    label: guideName,
  }),
  
  // Erreurs
  error404: (page: string) => trackEvent({
    action: '404_error',
    category: 'error',
    label: page,
  }),
  
  // Performance
  pageLoadTime: (loadTime: number) => trackEvent({
    action: 'page_load_time',
    category: 'performance',
    value: loadTime,
  }),
};

// Déclaration des types pour TypeScript
declare global {
  interface Window {
    gtag: (...args: any[]) => void;
  }
}

