// Fichier: app/privacy/privacy-content.ts

export const PRIVACY_POLICY_CONTENT = {
  title: "Politique de Confidentialité",
  subtitle: "Votre confiance et la protection de vos données sont nos priorités.",
  lead: "Bienvenue sur la page de politique de confidentialité de SDS. Cette page a pour but de vous informer de manière claire et transparente sur la manière dont nous collectons, utilisons et protégeons vos données personnelles lorsque vous visitez notre site web, conformément au Règlement Général sur la Protection des Données (RGPD).",
  lastUpdated: "14 août 2025",
  sections: [
    {
      id: "who-we-are",
      title: "1. Qui sommes-nous ?",
      content: [
        "Le responsable du traitement de vos données est **[Votre Nom ou Nom de l'entreprise]**, situé à **[Votre Ville, Pays]**. Vous pouvez nous contacter à tout moment via notre page de contact.",
      ],
    },
    {
      id: "data-collection",
      title: "2. Quelles données collectons-nous ?",
      content: [
        "Nous collectons deux types de données :",
        {
          type: "list",
          items: [
            "**Données fournies directement :** Lorsque vous remplissez notre formulaire de contact, nous collectons les informations que vous nous transmettez (nom, email, message) afin de pouvoir répondre à votre demande.",
            "**Données de navigation (Cookies) :** Si vous y consentez, nous utilisons des cookies pour collecter des données anonymes sur votre navigation (pages visitées, durée de la visite, type d'appareil) via des outils comme Google Analytics.",
          ],
        },
      ],
    },
    {
      id: "cookie-management",
      title: "3. Gestion des Cookies",
      content: [
        "Un \"cookie\" est un petit fichier texte stocké sur votre appareil. Il nous aide à analyser le trafic pour améliorer nos services. Lors de votre première visite, une bannière vous demande votre consentement pour l'activation de ces cookies.",
        "Vous avez le contrôle total : vous pouvez **accepter** ou **refuser**. Votre choix est enregistré pour une durée de 12 mois et vous pouvez le modifier à tout moment. Refuser n'affectera en rien votre accès aux fonctionnalités de notre site.",
      ],
    },
    {
      id: "your-rights",
      title: "4. Vos Droits",
      content: [
        "Conformément au RGPD, vous disposez des droits suivants concernant vos données personnelles :",
        {
          type: "list",
          items: [
            "**Droit d'accès :** Le droit de savoir quelles données nous détenons sur vous.",
            "**Droit de rectification :** Le droit de corriger toute information inexacte.",
            "**Droit à l'effacement (\"droit à l'oubli\") :** Le droit de demander la suppression de vos données.",
            "**Droit à la portabilité :** Le droit de recevoir vos données dans un format structuré.",
          ],
        },
        "Pour exercer l'un de ces droits, veuillez nous adresser votre demande via notre page de contact.",
      ],
    },
  ],
};
