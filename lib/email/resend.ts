import { Resend } from 'resend';

if (!process.env.RESEND_API_KEY) {
  throw new Error('RESEND_API_KEY is required');
}

export const resend = new Resend(process.env.RESEND_API_KEY);

// Configuration des emails
export const EMAIL_CONFIG = {
  from: 'SDS - Salwa Dev Studio <noreply@salwadevstudio.com>',
  replyTo: 'contact@salwadevstudio.com',
  adminEmail: 'admin@salwadevstudio.com',
};

// Types d'emails
export interface EmailData {
  to: string;
  subject: string;
  html: string;
  text?: string;
}

// Envoyer un email générique
export async function sendEmail(data: EmailData) {
  try {
    const result = await resend.emails.send({
      from: EMAIL_CONFIG.from,
      to: data.to,
      subject: data.subject,
      html: data.html,
      text: data.text,
      replyTo: EMAIL_CONFIG.replyTo,
    });

    console.log('Email envoyé:', result.data?.id);
    return result;
  } catch (error) {
    console.error('Erreur envoi email:', error);
    throw error;
  }
}

// Email de bienvenue après paiement
export async function sendWelcomeEmail(
  customerEmail: string,
  customerName: string,
  packageName: string,
  projectId: string
) {
  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Bienvenue chez SDS !</title>
      <style>
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #f43f5e, #d946ef); color: white; padding: 30px; text-align: center; border-radius: 12px 12px 0 0; }
        .content { background: white; padding: 30px; border: 1px solid #e5e7eb; }
        .footer { background: #f9fafb; padding: 20px; text-align: center; border-radius: 0 0 12px 12px; border: 1px solid #e5e7eb; border-top: none; }
        .button { display: inline-block; background: linear-gradient(135deg, #f43f5e, #d946ef); color: white; padding: 12px 24px; text-decoration: none; border-radius: 8px; font-weight: 600; }
        .steps { background: #fef7ff; padding: 20px; border-radius: 8px; margin: 20px 0; }
        .step { display: flex; align-items: flex-start; margin-bottom: 15px; }
        .step-number { background: #f43f5e; color: white; width: 24px; height: 24px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 12px; font-weight: bold; margin-right: 12px; flex-shrink: 0; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1 style="margin: 0; font-size: 28px;">🎉 Bienvenue chez SDS !</h1>
          <p style="margin: 10px 0 0 0; opacity: 0.9;">Votre projet ${packageName} va commencer</p>
        </div>
        
        <div class="content">
          <h2>Bonjour ${customerName},</h2>
          
          <p>Merci pour votre confiance ! Votre commande <strong>${packageName}</strong> a été confirmée et votre projet est maintenant dans notre pipeline de développement.</p>
          
          <div class="steps">
            <h3 style="margin-top: 0; color: #7c3aed;">Prochaines étapes :</h3>
            
            <div class="step">
              <div class="step-number">1</div>
              <div>
                <strong>Formulaire de projet</strong><br>
                Remplissez le formulaire détaillé pour nous donner toutes les informations nécessaires.
                <br><br>
                <a href="https://votre-domaine.com/project-form?id=${projectId}" class="button">Remplir le formulaire</a>
              </div>
            </div>
            
            <div class="step">
              <div class="step-number">2</div>
              <div>
                <strong>Appel de découverte</strong><br>
                Nous vous contacterons sous 24h pour planifier notre premier appel et affiner les détails de votre projet.
              </div>
            </div>
            
            <div class="step">
              <div class="step-number">3</div>
              <div>
                <strong>Début du développement</strong><br>
                Lancement officiel avec accès à votre espace client pour suivre l'avancement en temps réel.
              </div>
            </div>
          </div>
          
          <h3>Informations importantes :</h3>
          <ul>
            <li><strong>Délai de livraison :</strong> ${packageName === 'ESSENTIEL' ? '7-10 jours' : packageName === 'PROFESSIONNEL' ? '10-14 jours' : '14-21 jours'}</li>
            <li><strong>Votre chef de projet :</strong> Salwa (fondatrice)</li>
            <li><strong>Support :</strong> Réponse sous 4h en moyenne</li>
          </ul>
          
          <p>Si vous avez des questions, n'hésitez pas à nous contacter directement :</p>
          <ul>
            <li>📧 <a href="mailto:contact@salwadevstudio.com">contact@salwadevstudio.com</a></li>
            <li>📱 +33 1 23 45 67 89</li>
          </ul>
        </div>
        
        <div class="footer">
          <p style="margin: 0; color: #6b7280; font-size: 14px;">
            SDS - Salwa Dev Studio<br>
            Créatrice de solutions web glamour et performantes
          </p>
        </div>
      </div>
    </body>
    </html>
  `;

  const text = `
    Bienvenue chez SDS !
    
    Bonjour ${customerName},
    
    Merci pour votre confiance ! Votre commande ${packageName} a été confirmée.
    
    Prochaines étapes :
    1. Remplissez le formulaire de projet : https://votre-domaine.com/project-form?id=${projectId}
    2. Nous vous contacterons sous 24h pour l'appel de découverte
    3. Début du développement avec accès à votre espace client
    
    Contact : contact@salwadevstudio.com | +33 1 23 45 67 89
    
    À bientôt !
    L'équipe SDS
  `;

  return sendEmail({
    to: customerEmail,
    subject: `🎉 Bienvenue chez SDS ! Votre projet ${packageName} va commencer`,
    html,
    text,
  });
}

// Email de notification admin pour nouvelle commande
export async function sendAdminNotification(
  customerName: string,
  customerEmail: string,
  packageName: string,
  amount: number,
  projectId: string
) {
  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>Nouvelle commande SDS</title>
      <style>
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: #059669; color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0; }
        .content { background: white; padding: 20px; border: 1px solid #e5e7eb; }
        .info-box { background: #f0fdf4; border: 1px solid #bbf7d0; padding: 15px; border-radius: 6px; margin: 15px 0; }
        .button { display: inline-block; background: #059669; color: white; padding: 10px 20px; text-decoration: none; border-radius: 6px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1 style="margin: 0;">💰 Nouvelle commande !</h1>
        </div>
        
        <div class="content">
          <h2>Détails de la commande :</h2>
          
          <div class="info-box">
            <strong>Client :</strong> ${customerName}<br>
            <strong>Email :</strong> ${customerEmail}<br>
            <strong>Package :</strong> ${packageName}<br>
            <strong>Montant :</strong> ${(amount / 100).toLocaleString('fr-FR', { style: 'currency', currency: 'EUR' })}<br>
            <strong>ID Projet :</strong> ${projectId}
          </div>
          
          <h3>Actions à faire :</h3>
          <ul>
            <li>✅ Email de bienvenue envoyé automatiquement</li>
            <li>📞 Contacter le client sous 24h</li>
            <li>📋 Vérifier le formulaire de projet</li>
            <li>📅 Planifier l'appel de découverte</li>
          </ul>
          
          <p>
            <a href="https://votre-domaine.com/admin/projects/${projectId}" class="button">
              Voir le projet
            </a>
          </p>
        </div>
      </div>
    </body>
    </html>
  `;

  return sendEmail({
    to: EMAIL_CONFIG.adminEmail,
    subject: `💰 Nouvelle commande ${packageName} - ${customerName}`,
    html,
  });
}

// Email de confirmation de contact
export async function sendContactConfirmation(
  customerEmail: string,
  customerName: string,
  message: string
) {
  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>Message reçu - SDS</title>
      <style>
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #f43f5e, #d946ef); color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0; }
        .content { background: white; padding: 20px; border: 1px solid #e5e7eb; }
        .footer { background: #f9fafb; padding: 15px; text-align: center; border-radius: 0 0 8px 8px; border: 1px solid #e5e7eb; border-top: none; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1 style="margin: 0;">Message bien reçu !</h1>
        </div>
        
        <div class="content">
          <p>Bonjour ${customerName},</p>
          
          <p>Merci pour votre message ! Nous l'avons bien reçu et nous vous répondrons dans les plus brefs délais (généralement sous 4h).</p>
          
          <p><strong>Votre message :</strong></p>
          <p style="background: #f9fafb; padding: 15px; border-radius: 6px; font-style: italic;">
            "${message}"
          </p>
          
          <p>En attendant, n'hésitez pas à :</p>
          <ul>
            <li>📱 Nous appeler au +33 1 23 45 67 89</li>
            <li>🌐 Découvrir nos réalisations sur notre site</li>
            <li>📧 Nous envoyer des informations complémentaires</li>
          </ul>
          
          <p>À très bientôt !</p>
          <p><strong>L'équipe SDS</strong></p>
        </div>
        
        <div class="footer">
          <p style="margin: 0; color: #6b7280; font-size: 14px;">
            SDS - Salwa Dev Studio | contact@salwadevstudio.com
          </p>
        </div>
      </div>
    </body>
    </html>
  `;

  return sendEmail({
    to: customerEmail,
    subject: '✅ Message reçu - Nous vous répondons rapidement !',
    html,
  });
}

