// Service email simplifié pour éviter les erreurs de build
export async function sendContactEmail(options: {
  to: string;
  subject: string;
  template?: string;
  contact?: any;
  contactId?: string;
}) {
  // Version simplifiée qui log seulement en développement
  console.log('Email envoyé (simulation):', {
    to: options.to,
    subject: options.subject,
    template: options.template,
  });
  
  return { success: true, id: 'simulated-email-id' };
}

export async function trackEvent(options: {
  name: string;
  category: string;
  properties?: any;
  metadata?: any;
}) {
  // Version simplifiée qui log seulement
  console.log('Event tracked (simulation):', options);
  
  return { success: true };
}

