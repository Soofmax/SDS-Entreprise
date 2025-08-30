import { Metadata } from 'next';
import Link from 'next/link';
import { ArrowLeft, Cookie, Settings, Shield, BarChart3, Target } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Politique de Cookies | SDS',
  description: 'Politique de gestion des cookies du site SDS. Informations sur les cookies utilisés et vos droits selon le RGPD.',
  robots: 'index, follow',
};

export default function PolitiqueCookies() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-cream via-rose-powder/5 to-cream">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-sm border-b border-rose-powder/20">
        <div className="container mx-auto px-4 py-6">
          <Link 
            href="/" 
            className="inline-flex items-center space-x-2 text-charcoal hover:text-magenta transition-colors"
            aria-label="Retour à l'accueil"
          >
            <ArrowLeft className="w-5 h-5" aria-hidden="true" />
            <span>Retour à l'accueil</span>
          </Link>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          {/* Hero Section */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center space-x-2 bg-white/80 backdrop-blur-sm border border-rose-powder/30 rounded-full px-6 py-2 mb-6">
              <Cookie className="w-4 h-4 text-magenta" aria-hidden="true" />
              <span className="text-sm font-medium text-charcoal">Gestion des Cookies</span>
            </div>
            
            <h1 className="font-playfair text-4xl md:text-5xl font-bold text-charcoal mb-4">
              Politique de <span className="text-gradient">Cookies</span>
            </h1>
            
            <p className="text-lg text-charcoal/70 max-w-2xl mx-auto">
              Dernière mise à jour : {new Date().toLocaleDateString('fr-FR')}
            </p>
          </div>

          {/* Content */}
          <div className="bg-white/60 backdrop-blur-sm rounded-2xl border border-rose-powder/20 p-8 md:p-12">
            <div className="prose prose-lg max-w-none">
              
              <section className="mb-8">
                <h2 className="font-playfair text-2xl font-bold text-charcoal mb-4 flex items-center">
                  <Cookie className="w-6 h-6 text-magenta mr-3" aria-hidden="true" />
                  1. Qu'est-ce qu'un Cookie ?
                </h2>
                <p className="text-charcoal/80 leading-relaxed">
                  Un cookie est un petit fichier texte déposé sur votre terminal (ordinateur, tablette, smartphone) 
                  lors de la visite d'un site web. Il permet au site de reconnaître votre navigateur et de 
                  mémoriser certaines informations vous concernant.
                </p>
                <p className="text-charcoal/80 leading-relaxed">
                  Les cookies facilitent votre navigation et permettent d'améliorer votre expérience utilisateur 
                  en personnalisant le contenu et les fonctionnalités du site.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="font-playfair text-2xl font-bold text-charcoal mb-4 flex items-center">
                  <Target className="w-6 h-6 text-magenta mr-3" aria-hidden="true" />
                  2. Cookies Utilisés sur Notre Site
                </h2>
                
                <div className="space-y-6">
                  <div className="bg-white/40 rounded-lg p-6 border border-rose-powder/20">
                    <h3 className="font-semibold text-charcoal mb-3 flex items-center">
                      <Shield className="w-5 h-5 text-green-600 mr-2" aria-hidden="true" />
                      Cookies Strictement Nécessaires
                    </h3>
                    <p className="text-charcoal/80 leading-relaxed mb-3">
                      Ces cookies sont indispensables au fonctionnement du site et ne peuvent pas être désactivés.
                    </p>
                    <ul className="list-disc list-inside text-charcoal/80 space-y-1 ml-4">
                      <li><strong>session_id</strong> : Gestion de votre session de navigation</li>
                      <li><strong>csrf_token</strong> : Protection contre les attaques CSRF</li>
                      <li><strong>cookie_consent</strong> : Mémorisation de vos préférences cookies</li>
                      <li><strong>accessibility_settings</strong> : Sauvegarde de vos préférences d'accessibilité</li>
                    </ul>
                    <p className="text-sm text-charcoal/60 mt-3">
                      <strong>Durée :</strong> Session ou 1 an maximum
                    </p>
                  </div>

                  <div className="bg-white/40 rounded-lg p-6 border border-rose-powder/20">
                    <h3 className="font-semibold text-charcoal mb-3 flex items-center">
                      <BarChart3 className="w-5 h-5 text-blue-600 mr-2" aria-hidden="true" />
                      Cookies Analytiques
                    </h3>
                    <p className="text-charcoal/80 leading-relaxed mb-3">
                      Ces cookies nous aident à comprendre comment vous utilisez notre site pour l'améliorer.
                    </p>
                    <ul className="list-disc list-inside text-charcoal/80 space-y-1 ml-4">
                      <li><strong>_ga</strong> : Google Analytics - Identification des visiteurs uniques</li>
                      <li><strong>_ga_*</strong> : Google Analytics - Collecte de données de session</li>
                      <li><strong>_gid</strong> : Google Analytics - Identification des visiteurs (24h)</li>
                      <li><strong>analytics_session</strong> : Suivi des pages visitées</li>
                    </ul>
                    <p className="text-sm text-charcoal/60 mt-3">
                      <strong>Durée :</strong> 1 jour à 2 ans • <strong>Finalité :</strong> Amélioration du site
                    </p>
                  </div>

                  <div className="bg-white/40 rounded-lg p-6 border border-rose-powder/20">
                    <h3 className="font-semibold text-charcoal mb-3 flex items-center">
                      <Settings className="w-5 h-5 text-purple-600 mr-2" aria-hidden="true" />
                      Cookies de Préférences
                    </h3>
                    <p className="text-charcoal/80 leading-relaxed mb-3">
                      Ces cookies mémorisent vos préférences pour personnaliser votre expérience.
                    </p>
                    <ul className="list-disc list-inside text-charcoal/80 space-y-1 ml-4">
                      <li><strong>theme_preference</strong> : Mode sombre/clair choisi</li>
                      <li><strong>language_preference</strong> : Langue préférée</li>
                      <li><strong>font_size</strong> : Taille de police sélectionnée</li>
                      <li><strong>reduced_motion</strong> : Préférence pour les animations</li>
                    </ul>
                    <p className="text-sm text-charcoal/60 mt-3">
                      <strong>Durée :</strong> 1 an • <strong>Finalité :</strong> Personnalisation
                    </p>
                  </div>
                </div>
              </section>

              <section className="mb-8">
                <h2 className="font-playfair text-2xl font-bold text-charcoal mb-4">
                  3. Gestion de Vos Préférences
                </h2>
                
                <div className="bg-gradient-to-r from-rose-powder/20 to-magenta/10 rounded-lg p-6 mb-6">
                  <h3 className="font-semibold text-charcoal mb-3">🍪 Bannière de Consentement</h3>
                  <p className="text-charcoal/80 leading-relaxed">
                    Lors de votre première visite, une bannière vous permet de choisir quels cookies accepter. 
                    Vous pouvez modifier vos préférences à tout moment en cliquant sur l'icône d'accessibilité 
                    en bas à droite de l'écran.
                  </p>
                </div>

                <h3 className="font-semibold text-charcoal mb-3">Paramètres de Votre Navigateur</h3>
                <p className="text-charcoal/80 leading-relaxed mb-4">
                  Vous pouvez également configurer votre navigateur pour :
                </p>
                <ul className="list-disc list-inside text-charcoal/80 space-y-2 ml-4">
                  <li>Accepter ou refuser tous les cookies</li>
                  <li>Être averti avant l'enregistrement d'un cookie</li>
                  <li>Supprimer les cookies déjà enregistrés</li>
                  <li>Naviguer en mode privé/incognito</li>
                </ul>

                <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-white/40 rounded-lg p-4 border border-rose-powder/20">
                    <h4 className="font-semibold text-charcoal mb-2">Chrome</h4>
                    <p className="text-sm text-charcoal/70">
                      Paramètres → Confidentialité et sécurité → Cookies et autres données de sites
                    </p>
                  </div>
                  <div className="bg-white/40 rounded-lg p-4 border border-rose-powder/20">
                    <h4 className="font-semibold text-charcoal mb-2">Firefox</h4>
                    <p className="text-sm text-charcoal/70">
                      Paramètres → Vie privée et sécurité → Cookies et données de sites
                    </p>
                  </div>
                  <div className="bg-white/40 rounded-lg p-4 border border-rose-powder/20">
                    <h4 className="font-semibold text-charcoal mb-2">Safari</h4>
                    <p className="text-sm text-charcoal/70">
                      Préférences → Confidentialité → Gérer les données de sites web
                    </p>
                  </div>
                  <div className="bg-white/40 rounded-lg p-4 border border-rose-powder/20">
                    <h4 className="font-semibold text-charcoal mb-2">Edge</h4>
                    <p className="text-sm text-charcoal/70">
                      Paramètres → Cookies et autorisations de site → Gérer et supprimer
                    </p>
                  </div>
                </div>
              </section>

              <section className="mb-8">
                <h2 className="font-playfair text-2xl font-bold text-charcoal mb-4">
                  4. Cookies Tiers
                </h2>
                <p className="text-charcoal/80 leading-relaxed">
                  Notre site peut intégrer des services tiers qui déposent leurs propres cookies :
                </p>
                <ul className="list-disc list-inside text-charcoal/80 space-y-2 ml-4 mt-4">
                  <li><strong>Google Analytics :</strong> Analyse d'audience (anonymisée)</li>
                  <li><strong>Google Fonts :</strong> Chargement des polices de caractères</li>
                  <li><strong>Netlify :</strong> Hébergement et performance du site</li>
                </ul>
                <p className="text-charcoal/80 leading-relaxed mt-4">
                  Ces services ont leurs propres politiques de cookies que nous vous invitons à consulter.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="font-playfair text-2xl font-bold text-charcoal mb-4">
                  5. Vos Droits (RGPD)
                </h2>
                <p className="text-charcoal/80 leading-relaxed mb-4">
                  Conformément au RGPD, vous disposez des droits suivants concernant vos données :
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-white/40 rounded-lg p-4 border border-rose-powder/20">
                    <h4 className="font-semibold text-charcoal mb-2">✅ Droit d'accès</h4>
                    <p className="text-sm text-charcoal/70">
                      Connaître les données collectées vous concernant
                    </p>
                  </div>
                  <div className="bg-white/40 rounded-lg p-4 border border-rose-powder/20">
                    <h4 className="font-semibold text-charcoal mb-2">✏️ Droit de rectification</h4>
                    <p className="text-sm text-charcoal/70">
                      Corriger des données inexactes ou incomplètes
                    </p>
                  </div>
                  <div className="bg-white/40 rounded-lg p-4 border border-rose-powder/20">
                    <h4 className="font-semibold text-charcoal mb-2">🗑️ Droit à l'effacement</h4>
                    <p className="text-sm text-charcoal/70">
                      Demander la suppression de vos données
                    </p>
                  </div>
                  <div className="bg-white/40 rounded-lg p-4 border border-rose-powder/20">
                    <h4 className="font-semibold text-charcoal mb-2">⛔ Droit d'opposition</h4>
                    <p className="text-sm text-charcoal/70">
                      Vous opposer au traitement de vos données
                    </p>
                  </div>
                </div>
              </section>

              <section className="mb-8">
                <h2 className="font-playfair text-2xl font-bold text-charcoal mb-4">
                  6. Impact du Refus des Cookies
                </h2>
                <div className="bg-amber-50 border border-amber-200 rounded-lg p-6">
                  <h3 className="font-semibold text-amber-800 mb-3">⚠️ Cookies Strictement Nécessaires</h3>
                  <p className="text-amber-700 leading-relaxed mb-3">
                    Le refus de ces cookies peut empêcher le bon fonctionnement du site (formulaires, 
                    navigation, sécurité).
                  </p>
                  
                  <h3 className="font-semibold text-amber-800 mb-3">📊 Cookies Analytiques</h3>
                  <p className="text-amber-700 leading-relaxed mb-3">
                    Le refus n'affecte pas votre navigation mais nous empêche d'améliorer le site 
                    selon vos usages.
                  </p>
                  
                  <h3 className="font-semibold text-amber-800 mb-3">⚙️ Cookies de Préférences</h3>
                  <p className="text-amber-700 leading-relaxed">
                    Le refus vous obligera à reconfigurer vos préférences à chaque visite 
                    (thème, langue, accessibilité).
                  </p>
                </div>
              </section>

              <section className="mb-8">
                <h2 className="font-playfair text-2xl font-bold text-charcoal mb-4">
                  7. Contact et Réclamations
                </h2>
                <p className="text-charcoal/80 leading-relaxed mb-4">
                  Pour toute question concernant notre politique de cookies ou pour exercer vos droits :
                </p>
                <ul className="list-disc list-inside text-charcoal/80 space-y-2 ml-4">
                  <li><strong>Email :</strong> contact@sds.dev</li>
                  <li><strong>Formulaire :</strong> <Link href="/contact" className="text-magenta hover:underline">Page de contact</Link></li>
                  <li><strong>CNIL :</strong> En cas de réclamation → <a href="https://www.cnil.fr" target="_blank" rel="noopener noreferrer" className="text-magenta hover:underline">www.cnil.fr</a></li>
                </ul>
              </section>

              <section className="mb-8">
                <h2 className="font-playfair text-2xl font-bold text-charcoal mb-4">
                  8. Mise à Jour de cette Politique
                </h2>
                <p className="text-charcoal/80 leading-relaxed">
                  Cette politique peut être mise à jour pour refléter les changements dans nos pratiques 
                  ou la réglementation. La date de dernière mise à jour est indiquée en haut de cette page. 
                  Nous vous encourageons à consulter régulièrement cette politique.
                </p>
              </section>

            </div>
          </div>

          {/* Navigation */}
          <div className="mt-12 flex flex-col sm:flex-row gap-4 justify-between">
            <Link 
              href="/conditions-generales-utilisation" 
              className="inline-flex items-center justify-center px-6 py-3 bg-white/80 backdrop-blur-sm border border-rose-powder/30 rounded-full text-charcoal hover:bg-rose-powder/10 transition-all"
            >
              <ArrowLeft className="w-4 h-4 mr-2" aria-hidden="true" />
              Conditions d'Utilisation
            </Link>
            
            <Link 
              href="/droit-retractation" 
              className="inline-flex items-center justify-center px-6 py-3 bg-gradient-rose text-white rounded-full hover:shadow-lg transition-all"
            >
              Droit de Rétractation
              <ArrowLeft className="w-4 h-4 ml-2 rotate-180" aria-hidden="true" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

