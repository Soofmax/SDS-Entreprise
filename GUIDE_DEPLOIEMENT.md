# 🚀 Guide de Déploiement SDS - Site Full-Stack

## 📋 Prérequis

### 1. Comptes nécessaires
- **Vercel** (déploiement frontend) - gratuit
- **Neon** (base de données PostgreSQL) - gratuit
- **Stripe** (paiements) - gratuit jusqu'aux premiers revenus
- **Resend** (emails) - gratuit jusqu'à 3000 emails/mois
- **Google Analytics** - gratuit

### 2. Domaine (optionnel)
- Acheter un domaine (ex: salwadevstudio.com)
- Configurer les DNS vers Vercel

## 🗄️ Étape 1 : Base de Données (Neon)

### Créer la base de données
1. Aller sur [neon.tech](https://neon.tech)
2. Créer un compte et un nouveau projet
3. Choisir la région Europe (Frankfurt)
4. Copier l'URL de connexion

### Configuration
```bash
# Dans .env.local
DATABASE_URL="postgresql://username:password@ep-xxx.eu-central-1.aws.neon.tech/sds?sslmode=require"
```

### Déployer le schéma
```bash
# Générer le client Prisma
npx prisma generate

# Déployer les migrations
npx prisma db push

# Seed des données de production
npx tsx lib/db/seed-production.ts
```

## 💳 Étape 2 : Stripe (Paiements)

### Configuration Stripe
1. Créer un compte sur [stripe.com](https://stripe.com)
2. Récupérer les clés API (mode test puis production)
3. Configurer les webhooks

### Variables d'environnement
```bash
# Dans .env.local
STRIPE_SECRET_KEY=sk_test_...  # puis sk_live_...
STRIPE_PUBLISHABLE_KEY=pk_test_...  # puis pk_live_...
STRIPE_WEBHOOK_SECRET=whsec_...
```

### Configuration des webhooks
1. Dans le dashboard Stripe → Webhooks
2. Ajouter l'endpoint : `https://votre-domaine.com/api/stripe/webhook`
3. Sélectionner les événements :
   - `checkout.session.completed`
   - `payment_intent.succeeded`
   - `payment_intent.payment_failed`
   - `invoice.payment_succeeded`
   - `invoice.payment_failed`

## 📧 Étape 3 : Emails (Resend)

### Configuration Resend
1. Créer un compte sur [resend.com](https://resend.com)
2. Vérifier votre domaine (ou utiliser le domaine de test)
3. Récupérer la clé API

### Variables d'environnement
```bash
# Dans .env.local
RESEND_API_KEY=re_...
```

### Configuration DNS (si domaine personnalisé)
Ajouter les enregistrements DNS fournis par Resend pour vérifier le domaine.

## 📊 Étape 4 : Google Analytics

### Configuration GA4
1. Créer un compte sur [analytics.google.com](https://analytics.google.com)
2. Créer une propriété GA4
3. Récupérer l'ID de mesure

### Variables d'environnement
```bash
# Dans .env.local
NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX
```

## 🔐 Étape 5 : Authentification

### Configuration NextAuth
```bash
# Dans .env.local
NEXTAUTH_URL=https://votre-domaine.com
NEXTAUTH_SECRET=votre-secret-super-securise-32-caracteres-minimum
```

### OAuth Google (optionnel)
1. Console Google Cloud → APIs & Services → Credentials
2. Créer un OAuth 2.0 Client ID
3. Ajouter les URLs autorisées

```bash
# Dans .env.local
GOOGLE_CLIENT_ID=xxx.googleusercontent.com
GOOGLE_CLIENT_SECRET=xxx
```

## 🚀 Étape 6 : Déploiement Vercel

### Préparer le déploiement
```bash
# Installer Vercel CLI
npm i -g vercel

# Se connecter
vercel login

# Déployer
vercel --prod
```

### Configuration Vercel
1. Connecter le repository GitHub
2. Configurer les variables d'environnement dans le dashboard
3. Configurer le domaine personnalisé

### Variables d'environnement Vercel
Copier toutes les variables de `.env.local` dans le dashboard Vercel :

```
DATABASE_URL=postgresql://...
NEXTAUTH_URL=https://votre-domaine.com
NEXTAUTH_SECRET=...
STRIPE_SECRET_KEY=sk_live_...
STRIPE_PUBLISHABLE_KEY=pk_live_...
STRIPE_WEBHOOK_SECRET=whsec_...
RESEND_API_KEY=re_...
NEXT_PUBLIC_GA_ID=G-...
GOOGLE_CLIENT_ID=...
GOOGLE_CLIENT_SECRET=...
```

## ✅ Étape 7 : Tests Post-Déploiement

### Tests fonctionnels
- [ ] Page d'accueil se charge correctement
- [ ] Formulaire de contact fonctionne
- [ ] Calculateur France Num fonctionne
- [ ] Paiements Stripe fonctionnent (mode test)
- [ ] Emails sont envoyés
- [ ] Connexion admin fonctionne
- [ ] Dashboard admin accessible
- [ ] Google Analytics track les événements

### Tests de paiement
1. Tester avec les cartes de test Stripe :
   - `4242 4242 4242 4242` (succès)
   - `4000 0000 0000 0002` (échec)
2. Vérifier la création automatique des projets
3. Vérifier l'envoi des emails de confirmation

### Tests d'emails
1. Tester le formulaire de contact
2. Tester les emails post-paiement
3. Vérifier les notifications admin

## 🔧 Étape 8 : Configuration Production

### Passer Stripe en mode live
1. Activer le compte Stripe (vérifications KYC)
2. Remplacer les clés test par les clés live
3. Mettre à jour les webhooks pour la production

### Optimisations
1. Configurer les redirections 301 si nécessaire
2. Optimiser les images (WebP, lazy loading)
3. Configurer le cache Vercel
4. Activer la compression

### Monitoring
1. Configurer les alertes Vercel
2. Monitorer les erreurs avec Sentry (optionnel)
3. Surveiller les métriques Stripe
4. Analyser Google Analytics

## 🛡️ Sécurité

### Checklist sécurité
- [ ] HTTPS activé (automatique avec Vercel)
- [ ] Variables d'environnement sécurisées
- [ ] Rate limiting activé sur les APIs
- [ ] Validation des données côté serveur
- [ ] Protection CSRF avec NextAuth
- [ ] Headers de sécurité configurés

### Sauvegarde
- [ ] Sauvegardes automatiques Neon activées
- [ ] Export régulier des données importantes
- [ ] Documentation des accès et mots de passe

## 📈 Post-Lancement

### SEO
1. Soumettre le sitemap à Google Search Console
2. Configurer Google My Business
3. Optimiser les métadonnées
4. Créer du contenu régulier

### Marketing
1. Lancer les campagnes Google Ads
2. Optimiser les réseaux sociaux
3. Mettre en place l'email marketing
4. Analyser les conversions

### Maintenance
1. Surveiller les performances
2. Mettre à jour les dépendances
3. Analyser les métriques business
4. Optimiser en continu

## 🆘 Dépannage

### Erreurs courantes
- **Base de données** : Vérifier l'URL de connexion Neon
- **Paiements** : Vérifier les webhooks Stripe
- **Emails** : Vérifier la configuration DNS Resend
- **Analytics** : Vérifier l'ID Google Analytics

### Logs et debugging
- Logs Vercel : Dashboard → Functions → Logs
- Logs Stripe : Dashboard → Logs
- Logs Neon : Dashboard → Monitoring

## 📞 Support

- **Documentation** : Ce guide + README.md
- **Communauté** : Discord/Slack de l'équipe
- **Support technique** : Issues GitHub

---

**🎉 Votre site SDS est maintenant en production !**

Félicitations ! Vous avez maintenant un site web full-stack professionnel avec :
- ✅ Paiements automatisés
- ✅ Gestion de projets
- ✅ Analytics avancés
- ✅ Emails automatiques
- ✅ Dashboard admin complet

**Prochaine étape :** Commencer à acquérir vos premiers clients ! 🚀

