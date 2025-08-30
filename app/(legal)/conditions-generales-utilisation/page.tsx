import { Metadata } from 'next';
import Link from 'next/link';
import { ArrowLeft, Scale, Shield, Users, AlertTriangle } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Conditions Générales d\'Utilisation | SDS',
  description: 'Conditions générales d\'utilisation du site web SDS - Services de Développement Sur-Mesure. Droits et obligations des utilisateurs.',
  robots: 'index, follow',
};

export default function ConditionsGeneralesUtilisation() {
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
              <Scale className="w-4 h-4 text-magenta" aria-hidden="true" />
              <span className="text-sm font-medium text-charcoal">Conditions d'Utilisation</span>
            </div>
            
            <h1 className="font-playfair text-4xl md:text-5xl font-bold text-charcoal mb-4">
              Conditions Générales d'<span className="text-gradient">Utilisation</span>
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
                  <Users className="w-6 h-6 text-magenta mr-3" aria-hidden="true" />
                  1. Objet et Champ d'Application
                </h2>
                <p className="text-charcoal/80 leading-relaxed">
                  Les présentes Conditions Générales d'Utilisation (CGU) régissent l'utilisation du site web 
                  <strong> SDS - Services de Développement Sur-Mesure</strong>, accessible à l'adresse 
                  <strong> sds.dev</strong> (ci-après "le Site").
                </p>
                <p className="text-charcoal/80 leading-relaxed">
                  L'utilisation du Site implique l'acceptation pleine et entière des présentes CGU. 
                  Si vous n'acceptez pas ces conditions, veuillez ne pas utiliser le Site.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="font-playfair text-2xl font-bold text-charcoal mb-4 flex items-center">
                  <Shield className="w-6 h-6 text-magenta mr-3" aria-hidden="true" />
                  2. Accès au Site
                </h2>
                <p className="text-charcoal/80 leading-relaxed">
                  Le Site est accessible gratuitement à tout utilisateur disposant d'un accès à Internet. 
                  Tous les frais supportés par l'utilisateur pour accéder au service (matériel informatique, 
                  logiciels, connexion Internet, etc.) sont à sa charge.
                </p>
                <p className="text-charcoal/80 leading-relaxed">
                  SDS se réserve le droit de modifier, suspendre ou interrompre l'accès au Site à tout moment 
                  et sans préavis, notamment pour des raisons de maintenance ou de mise à jour.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="font-playfair text-2xl font-bold text-charcoal mb-4">
                  3. Utilisation du Site
                </h2>
                
                <h3 className="font-semibold text-charcoal mb-3">3.1 Utilisation Autorisée</h3>
                <p className="text-charcoal/80 leading-relaxed mb-4">
                  Le Site est destiné à présenter les services de développement web proposés par SDS. 
                  L'utilisateur s'engage à utiliser le Site conformément à sa destination et aux présentes CGU.
                </p>

                <h3 className="font-semibold text-charcoal mb-3">3.2 Utilisation Interdite</h3>
                <p className="text-charcoal/80 leading-relaxed">Il est strictement interdit :</p>
                <ul className="list-disc list-inside text-charcoal/80 space-y-2 ml-4">
                  <li>D'utiliser le Site à des fins illégales ou non autorisées</li>
                  <li>De porter atteinte aux droits de propriété intellectuelle de SDS</li>
                  <li>De diffuser des contenus illicites, diffamatoires ou contraires aux bonnes mœurs</li>
                  <li>De perturber le fonctionnement du Site ou d'y introduire des virus</li>
                  <li>De collecter des données personnelles sans autorisation</li>
                  <li>D'utiliser le Site pour du spam ou des activités commerciales non autorisées</li>
                </ul>
              </section>

              <section className="mb-8">
                <h2 className="font-playfair text-2xl font-bold text-charcoal mb-4">
                  4. Propriété Intellectuelle
                </h2>
                <p className="text-charcoal/80 leading-relaxed">
                  L'ensemble des éléments du Site (textes, images, vidéos, logos, graphismes, etc.) 
                  sont protégés par les droits de propriété intellectuelle et appartiennent à SDS ou 
                  à ses partenaires.
                </p>
                <p className="text-charcoal/80 leading-relaxed">
                  Toute reproduction, représentation, modification, publication, adaptation de tout ou 
                  partie des éléments du Site, quel que soit le moyen ou le procédé utilisé, est interdite, 
                  sauf autorisation écrite préalable de SDS.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="font-playfair text-2xl font-bold text-charcoal mb-4">
                  5. Données Personnelles
                </h2>
                <p className="text-charcoal/80 leading-relaxed">
                  Le traitement des données personnelles collectées sur le Site est régi par notre 
                  <Link href="/politique-confidentialite" className="text-magenta hover:underline">
                    Politique de Confidentialité
                  </Link>, 
                  conforme au Règlement Général sur la Protection des Données (RGPD).
                </p>
              </section>

              <section className="mb-8">
                <h2 className="font-playfair text-2xl font-bold text-charcoal mb-4">
                  6. Cookies
                </h2>
                <p className="text-charcoal/80 leading-relaxed">
                  Le Site utilise des cookies pour améliorer l'expérience utilisateur et analyser le trafic. 
                  Pour plus d'informations, consultez notre 
                  <Link href="/politique-cookies" className="text-magenta hover:underline">
                    Politique de Cookies
                  </Link>.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="font-playfair text-2xl font-bold text-charcoal mb-4 flex items-center">
                  <AlertTriangle className="w-6 h-6 text-magenta mr-3" aria-hidden="true" />
                  7. Responsabilité
                </h2>
                
                <h3 className="font-semibold text-charcoal mb-3">7.1 Responsabilité de SDS</h3>
                <p className="text-charcoal/80 leading-relaxed mb-4">
                  SDS s'efforce d'assurer l'exactitude et la mise à jour des informations diffusées sur le Site, 
                  mais ne peut garantir l'exactitude, la précision ou l'exhaustivité des informations mises à 
                  disposition.
                </p>
                <p className="text-charcoal/80 leading-relaxed mb-4">
                  SDS ne saurait être tenue responsable des dommages directs ou indirects résultant de 
                  l'utilisation du Site ou de l'impossibilité d'y accéder.
                </p>

                <h3 className="font-semibold text-charcoal mb-3">7.2 Responsabilité de l'Utilisateur</h3>
                <p className="text-charcoal/80 leading-relaxed">
                  L'utilisateur est seul responsable de l'utilisation qu'il fait du Site et des données qu'il 
                  transmet. Il s'engage à respecter les présentes CGU et la législation en vigueur.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="font-playfair text-2xl font-bold text-charcoal mb-4">
                  8. Liens Hypertextes
                </h2>
                <p className="text-charcoal/80 leading-relaxed">
                  Le Site peut contenir des liens vers d'autres sites web. SDS n'exerce aucun contrôle sur 
                  ces sites et décline toute responsabilité quant à leur contenu ou leur politique de 
                  confidentialité.
                </p>
                <p className="text-charcoal/80 leading-relaxed">
                  La création de liens vers le Site est autorisée, sous réserve qu'ils ne portent pas atteinte 
                  à l'image de SDS et qu'ils respectent la législation en vigueur.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="font-playfair text-2xl font-bold text-charcoal mb-4">
                  9. Modification des CGU
                </h2>
                <p className="text-charcoal/80 leading-relaxed">
                  SDS se réserve le droit de modifier les présentes CGU à tout moment. Les modifications 
                  entrent en vigueur dès leur publication sur le Site. Il appartient à l'utilisateur de 
                  consulter régulièrement les CGU pour prendre connaissance des éventuelles modifications.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="font-playfair text-2xl font-bold text-charcoal mb-4">
                  10. Droit Applicable et Juridiction
                </h2>
                <p className="text-charcoal/80 leading-relaxed">
                  Les présentes CGU sont régies par le droit français. En cas de litige, et après recherche 
                  d'une solution amiable, les tribunaux français seront seuls compétents.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="font-playfair text-2xl font-bold text-charcoal mb-4">
                  11. Contact
                </h2>
                <p className="text-charcoal/80 leading-relaxed">
                  Pour toute question relative aux présentes CGU, vous pouvez nous contacter :
                </p>
                <ul className="list-disc list-inside text-charcoal/80 space-y-2 ml-4">
                  <li>Par email : contact@sds.dev</li>
                  <li>Via le formulaire de contact du Site</li>
                  <li>Par courrier : SDS, [Adresse complète]</li>
                </ul>
              </section>

            </div>
          </div>

          {/* Navigation */}
          <div className="mt-12 flex flex-col sm:flex-row gap-4 justify-between">
            <Link 
              href="/mentions-legales" 
              className="inline-flex items-center justify-center px-6 py-3 bg-white/80 backdrop-blur-sm border border-rose-powder/30 rounded-full text-charcoal hover:bg-rose-powder/10 transition-all"
            >
              <ArrowLeft className="w-4 h-4 mr-2" aria-hidden="true" />
              Mentions Légales
            </Link>
            
            <Link 
              href="/politique-cookies" 
              className="inline-flex items-center justify-center px-6 py-3 bg-gradient-rose text-white rounded-full hover:shadow-lg transition-all"
            >
              Politique de Cookies
              <ArrowLeft className="w-4 h-4 ml-2 rotate-180" aria-hidden="true" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

