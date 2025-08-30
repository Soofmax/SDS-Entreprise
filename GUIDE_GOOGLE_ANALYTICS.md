# 📊 Guide Google Analytics 4 - SDS

## 🚀 Configuration Initiale

### 1. Créer un compte Google Analytics 4

1. **Aller sur** [analytics.google.com](https://analytics.google.com)
2. **Cliquer** sur "Commencer"
3. **Créer un compte** pour "SDS - Salwa Dev Studio"
4. **Configurer une propriété** :
   - Nom : "SDS - Site Web"
   - Fuseau horaire : "France (GMT+1)"
   - Devise : "Euro (EUR)"
5. **Choisir** "Web" comme plateforme
6. **Entrer l'URL** de votre site : `https://votre-domaine.com`
7. **Copier l'ID de mesure** (format : G-XXXXXXXXXX)

### 2. Configurer l'ID dans votre site

1. **Ouvrir** le fichier `.env.local`
2. **Remplacer** `G-XXXXXXXXXX` par votre vrai ID :
   ```
   NEXT_PUBLIC_GA_ID=G-VOTRE-VRAI-ID
   ```
3. **Redémarrer** le serveur de développement :
   ```bash
   npm run dev
   ```

## 📈 Événements Trackés Automatiquement

### 🎯 Événements de Navigation
- **Page vue** : Chaque page visitée
- **Temps passé** : Durée sur chaque page
- **Profondeur de scroll** : 25%, 50%, 75%, 90%
- **Temps de chargement** : Performance du site

### 📝 Événements de Conversion
- **Formulaire de contact** soumis
- **Calculateur France Num** utilisé
- **Package sélectionné** (Essentiel, Professionnel, Boutique)
- **Devis demandé** avec budget
- **Téléphone cliqué** dans le header
- **Email cliqué** pour contact

### 🎨 Événements de Contenu
- **Projet portfolio** consulté
- **Service** visualisé
- **Modal** ouvert/fermé
- **Bouton** cliqué avec localisation

### 🔍 Événements Techniques
- **Erreur 404** avec page manquante
- **Erreur JavaScript** capturée
- **Feature d'accessibilité** utilisée
- **PWA** installée

## 📊 Dashboard Analytics Admin

### Accès au Dashboard
- **URL** : `/admin/analytics`
- **Authentification** : Connexion admin requise

### Métriques Disponibles
- **Visiteurs en temps réel**
- **Pages vues** par période
- **Taux de conversion** par package
- **Sources de trafic** détaillées
- **Appareils utilisés** (Desktop/Mobile/Tablet)
- **Pages les plus populaires**

### Fonctionnalités
- **Filtres temporels** : 1j, 7j, 30j, 90j
- **Export des données** en JSON
- **Actualisation** en temps réel
- **Graphiques interactifs** avec Recharts

## 🍪 Gestion RGPD des Cookies

### Bannière de Consentement
- **Affichage automatique** pour nouveaux visiteurs
- **3 niveaux de consentement** :
  - Nécessaires (toujours actifs)
  - Analytiques (Google Analytics)
  - Marketing (publicités)
  - Préférences (personnalisation)

### Conformité RGPD
- **Consentement explicite** requis
- **Révocation possible** à tout moment
- **Durée de validité** : 365 jours
- **Données anonymisées** par défaut

## 🔧 Utilisation Avancée

### Hook useAnalytics
```typescript
import { useAnalytics } from '@/lib/hooks/useAnalytics';

function MonComposant() {
  const { trackCustomEvent, trackButtonClick } = useAnalytics();
  
  const handleClick = () => {
    trackButtonClick('mon-bouton', 'page-accueil');
    trackCustomEvent('action_speciale', 'engagement', 'label', 100);
  };
}
```

### Événements Personnalisés
```typescript
// Tracker une action spécifique
trackCustomEvent('telechargement_guide', 'content', 'guide-seo', 1);

// Tracker une conversion
trackQuoteRequest('professionnel', 5200);

// Tracker une erreur
trackError('form_validation', 'Email invalide');
```

## 📋 Métriques Importantes à Suivre

### 🎯 Objectifs Business
- **Taux de conversion** formulaire contact
- **Utilisation calculateur** France Num
- **Sélection packages** par type
- **Temps passé** sur page services

### 📊 Métriques de Performance
- **Temps de chargement** moyen
- **Taux de rebond** par page
- **Pages par session**
- **Durée moyenne** des sessions

### 🔍 Sources de Trafic
- **Recherche organique** (SEO)
- **Accès direct** (notoriété)
- **Réseaux sociaux** (engagement)
- **Email marketing** (campagnes)

## 🚨 Alertes Recommandées

### Dans Google Analytics, configurer des alertes pour :
- **Chute de trafic** > 20%
- **Augmentation des erreurs** 404
- **Baisse du taux de conversion** > 15%
- **Temps de chargement** > 3 secondes

## 📱 Suivi Mobile

### Métriques Spécifiques Mobile
- **Répartition Desktop/Mobile/Tablet**
- **Vitesse mobile** (Core Web Vitals)
- **Interactions tactiles**
- **Installation PWA**

## 🎓 Formation Recommandée

### Ressources Google Analytics
1. **Google Analytics Academy** (gratuit)
2. **Certification GA4** (recommandée)
3. **Documentation officielle** GA4
4. **Communauté** Google Analytics

## 🔒 Sécurité et Confidentialité

### Bonnes Pratiques
- **Anonymisation IP** activée
- **Partage de données** désactivé
- **Rétention des données** : 14 mois
- **Accès restreint** aux données

### Conformité
- **RGPD** : Consentement explicite
- **CCPA** : Opt-out disponible
- **Mentions légales** mises à jour
- **Politique de confidentialité** complète

---

## 🆘 Support

Pour toute question sur l'implémentation Google Analytics :
- **Documentation** : Ce guide
- **Code source** : `/lib/analytics/`
- **Dashboard** : `/admin/analytics`
- **Support Google** : support.google.com/analytics

**Votre site SDS est maintenant équipé d'un système d'analytics professionnel ! 🚀**

