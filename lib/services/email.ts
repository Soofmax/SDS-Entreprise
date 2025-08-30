import { Resend } from 'resend';

// Configuration Resend
const resend = new Resend(process.env.RESEND_API_KEY);

// Types pour les emails
interface EmailOptions {
  to: string | string[];
  subject: string;
  template?: string;
  contact?: any;
  contactId?: string;
  data?: Record<string, any>;
}

interface ContactEmailData {
  name: string;
  email: string;
  phone?: string;
  company?: string;
  projectType: string;
  budget: string;
  timeline: string;
  message: string;
}

/**
 * Template HTML pour l'email de notification admin
 */
function createAdminNotificationTemplate(contact: ContactEmailData, contactId: string): string {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Nouveau contact - SDS</title>
      <style>
        body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; background-color: #FFFBF5; }
        .container { max-width: 600px; margin: 0 auto; background: white; border-radius: 20px; overflow: hidden; box-shadow: 0 10px 30px rgba(199, 56, 99, 0.1); }
        .header { background: linear-gradient(135deg, #C73863 0%, #EAD2D8 100%); color: white; padding: 30px; text-align: center; }
        .header h1 { margin: 0; font-size: 24px; font-weight: 600; }
        .content { padding: 30px; }
        .field { margin-bottom: 20px; }
        .field-label { font-weight: 600; color: #C73863; margin-bottom: 5px; }
        .field-value { background: #FFFBF5; padding: 10px 15px; border-radius: 10px; border-left: 4px solid #C73863; }
        .priority { display: inline-block; padding: 5px 15px; border-radius: 20px; font-size: 12px; font-weight: 600; text-transform: uppercase; }
        .priority-high { background: #fee2e2; color: #dc2626; }
        .priority-medium { background: #fef3c7; color: #d97706; }
        .footer { background: #f8f9fa; padding: 20px; text-align: center; font-size: 14px; color: #666; }
        .button { display: inline-block; padding: 12px 24px; background: #C73863; color: white; text-decoration: none; border-radius: 10px; font-weight: 600; margin: 10px 5px; }
        .meta { font-size: 12px; color: #888; margin-top: 20px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>🌟 Nouveau Contact SDS</h1>
          <p>Une nouvelle demande de projet vient d'arriver !</p>
        </div>
        
        <div class="content">
          <div style="text-align: center; margin-bottom: 30px;">
            <span class="priority priority-medium">Priorité Moyenne</span>
          </div>
          
          <div class="field">
            <div class="field-label">👤 Nom complet</div>
            <div class="field-value">${contact.name}</div>
          </div>
          
          <div class="field">
            <div class="field-label">📧 Email</div>
            <div class="field-value">
              <a href="mailto:${contact.email}" style="color: #C73863; text-decoration: none;">
                ${contact.email}
              </a>
            </div>
          </div>
          
          ${contact.phone ? `
          <div class="field">
            <div class="field-label">📱 Téléphone</div>
            <div class="field-value">
              <a href="tel:${contact.phone}" style="color: #C73863; text-decoration: none;">
                ${contact.phone}
              </a>
            </div>
          </div>
          ` : ''}
          
          ${contact.company ? `
          <div class="field">
            <div class="field-label">🏢 Entreprise</div>
            <div class="field-value">${contact.company}</div>
          </div>
          ` : ''}
          
          <div class="field">
            <div class="field-label">🎯 Type de projet</div>
            <div class="field-value">
              <strong>${getProjectTypeLabel(contact.projectType)}</strong>
            </div>
          </div>
          
          <div class="field">
            <div class="field-label">💰 Budget</div>
            <div class="field-value">${contact.budget}</div>
          </div>
          
          <div class="field">
            <div class="field-label">⏰ Délai souhaité</div>
            <div class="field-value">${contact.timeline}</div>
          </div>
          
          <div class="field">
            <div class="field-label">💬 Message</div>
            <div class="field-value">${contact.message.replace(/\n/g, '<br>')}</div>
          </div>
          
          <div style="text-align: center; margin: 30px 0;">
            <a href="mailto:${contact.email}?subject=Re: Votre demande de projet ${contact.projectType}" class="button">
              Répondre par Email
            </a>
            ${contact.phone ? `
            <a href="tel:${contact.phone}" class="button" style="background: #10b981;">
              Appeler
            </a>
            ` : ''}
          </div>
          
          <div class="meta">
            <strong>ID Contact:</strong> ${contactId}<br>
            <strong>Reçu le:</strong> ${new Date().toLocaleString('fr-FR')}<br>
            <strong>Statut:</strong> Nouveau
          </div>
        </div>
        
        <div class="footer">
          <p>SDS - Services de Développement Sur-Mesure</p>
          <p>Cet email a été généré automatiquement par votre système de contact.</p>
        </div>
      </div>
    </body>
    </html>
  `;
}

/**
 * Template HTML pour l'email de confirmation client
 */
function createClientConfirmationTemplate(contact: ContactEmailData): string {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Confirmation de votre demande - SDS</title>
      <style>
        body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; background-color: #FFFBF5; }
        .container { max-width: 600px; margin: 0 auto; background: white; border-radius: 20px; overflow: hidden; box-shadow: 0 10px 30px rgba(199, 56, 99, 0.1); }
        .header { background: linear-gradient(135deg, #C73863 0%, #EAD2D8 100%); color: white; padding: 30px; text-align: center; }
        .header h1 { margin: 0; font-size: 24px; font-weight: 600; }
        .content { padding: 30px; }
        .highlight { background: #FFFBF5; padding: 20px; border-radius: 15px; border-left: 4px solid #C73863; margin: 20px 0; }
        .footer { background: #f8f9fa; padding: 20px; text-align: center; font-size: 14px; color: #666; }
        .button { display: inline-block; padding: 12px 24px; background: #C73863; color: white; text-decoration: none; border-radius: 10px; font-weight: 600; margin: 10px 0; }
        .steps { margin: 30px 0; }
        .step { display: flex; align-items: center; margin: 15px 0; }
        .step-number { background: #C73863; color: white; width: 30px; height: 30px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: 600; margin-right: 15px; }
        .social { text-align: center; margin: 20px 0; }
        .social a { display: inline-block; margin: 0 10px; color: #C73863; text-decoration: none; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>✨ Merci ${contact.name} !</h1>
          <p>Votre demande a été reçue avec succès</p>
        </div>
        
        <div class="content">
          <div class="highlight">
            <h3 style="margin-top: 0; color: #C73863;">🎯 Récapitulatif de votre demande</h3>
            <p><strong>Projet :</strong> ${getProjectTypeLabel(contact.projectType)}</p>
            <p><strong>Budget :</strong> ${contact.budget}</p>
            <p><strong>Délai :</strong> ${contact.timeline}</p>
          </div>
          
          <h3 style="color: #C73863;">📋 Prochaines étapes</h3>
          <div class="steps">
            <div class="step">
              <div class="step-number">1</div>
              <div>
                <strong>Analyse de votre demande</strong><br>
                <small>Nous étudions votre projet en détail (sous 2h)</small>
              </div>
            </div>
            <div class="step">
              <div class="step-number">2</div>
              <div>
                <strong>Premier contact</strong><br>
                <small>Nous vous contactons pour échanger (sous 24h)</small>
              </div>
            </div>
            <div class="step">
              <div class="step-number">3</div>
              <div>
                <strong>Devis personnalisé</strong><br>
                <small>Proposition détaillée avec aides publiques (48h)</small>
              </div>
            </div>
          </div>
          
          <div class="highlight">
            <h4 style="margin-top: 0;">💡 Le saviez-vous ?</h4>
            <p>Votre projet peut bénéficier d'aides publiques France Num jusqu'à <strong>5 000€</strong> ! Nous nous occupons de toutes les démarches pour vous.</p>
          </div>
          
          <div style="text-align: center; margin: 30px 0;">
            <p>Une question urgente ?</p>
            <a href="mailto:contact@sds.com" class="button">Nous contacter</a>
          </div>
          
          <div class="social">
            <p>Suivez-nous :</p>
            <a href="#">LinkedIn</a> • 
            <a href="#">GitHub</a> • 
            <a href="#">Portfolio</a>
          </div>
        </div>
        
        <div class="footer">
          <p><strong>SDS - Services de Développement Sur-Mesure</strong></p>
          <p>Créatrice de solutions web glamour et performantes</p>
          <p style="font-size: 12px; margin-top: 15px;">
            Vous recevez cet email car vous avez soumis une demande sur notre site.<br>
            Si vous n'êtes pas à l'origine de cette demande, vous pouvez ignorer cet email.
          </p>
        </div>
      </div>
    </body>
    </html>
  `;
}

/**
 * Obtenir le label du type de projet
 */
function getProjectTypeLabel(type: string): string {
  const labels: Record<string, string> = {
    vitrine: '🌐 Site Vitrine',
    ecommerce: '🛒 E-commerce',
    application: '⚡ Application Web',
    refonte: '🔄 Refonte de Site',
    seo: '📈 Référencement SEO',
    maintenance: '🔧 Maintenance',
  };
  return labels[type] || type;
}

/**
 * Envoyer un email de contact
 */
export async function sendContactEmail(options: EmailOptions): Promise<void> {
  const { to, subject, template, contact, contactId, data } = options;
  
  let html: string;
  
  if (template === 'contact_confirmation' && contact) {
    html = createClientConfirmationTemplate(contact);
  } else if (contact && contactId) {
    html = createAdminNotificationTemplate(contact, contactId);
  } else {
    throw new Error('Template ou données manquantes');
  }
  
  try {
    const result = await resend.emails.send({
      from: 'SDS <noreply@sds.com>', // Remplacer par votre domaine vérifié
      to: Array.isArray(to) ? to : [to],
      subject,
      html,
      // Ajouter des tags pour le tracking
      tags: [
        { name: 'category', value: 'contact' },
        { name: 'template', value: template || 'admin_notification' },
      ],
    });
    
    console.log('✅ Email envoyé:', result.data?.id);
    
  } catch (error) {
    console.error('❌ Erreur envoi email:', error);
    throw error;
  }
}

/**
 * Envoyer un email de bienvenue
 */
export async function sendWelcomeEmail(email: string, name: string): Promise<void> {
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h1 style="color: #C73863;">Bienvenue ${name} !</h1>
      <p>Merci de votre intérêt pour SDS. Nous sommes ravis de vous compter parmi nos contacts.</p>
      <p>Vous recevrez bientôt des nouvelles de nos derniers projets et conseils en développement web.</p>
    </div>
  `;
  
  await resend.emails.send({
    from: 'SDS <noreply@sds.com>',
    to: [email],
    subject: 'Bienvenue chez SDS !',
    html,
    tags: [{ name: 'category', value: 'welcome' }],
  });
}

/**
 * Envoyer un email de newsletter
 */
export async function sendNewsletter(
  recipients: string[],
  subject: string,
  content: string
): Promise<void> {
  // Envoyer par batch pour éviter les limites
  const batchSize = 50;
  
  for (let i = 0; i < recipients.length; i += batchSize) {
    const batch = recipients.slice(i, i + batchSize);
    
    await resend.emails.send({
      from: 'SDS <newsletter@sds.com>',
      to: batch,
      subject,
      html: content,
      tags: [{ name: 'category', value: 'newsletter' }],
    });
    
    // Pause entre les batches
    if (i + batchSize < recipients.length) {
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
  }
}

/**
 * Valider une adresse email
 */
export function validateEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Créer un template d'email réutilisable
 */
export function createEmailTemplate(
  title: string,
  content: string,
  ctaText?: string,
  ctaUrl?: string
): string {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>${title}</title>
      <style>
        body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; background-color: #FFFBF5; }
        .container { max-width: 600px; margin: 0 auto; background: white; border-radius: 20px; overflow: hidden; box-shadow: 0 10px 30px rgba(199, 56, 99, 0.1); }
        .header { background: linear-gradient(135deg, #C73863 0%, #EAD2D8 100%); color: white; padding: 30px; text-align: center; }
        .content { padding: 30px; }
        .footer { background: #f8f9fa; padding: 20px; text-align: center; font-size: 14px; color: #666; }
        .button { display: inline-block; padding: 12px 24px; background: #C73863; color: white; text-decoration: none; border-radius: 10px; font-weight: 600; margin: 20px 0; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>${title}</h1>
        </div>
        <div class="content">
          ${content}
          ${ctaText && ctaUrl ? `
            <div style="text-align: center;">
              <a href="${ctaUrl}" class="button">${ctaText}</a>
            </div>
          ` : ''}
        </div>
        <div class="footer">
          <p>SDS - Services de Développement Sur-Mesure</p>
        </div>
      </div>
    </body>
    </html>
  `;
}

