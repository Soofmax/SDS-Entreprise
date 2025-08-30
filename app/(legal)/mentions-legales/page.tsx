'use client';

import { ArrowLeft, Building, Mail, Phone, MapPin, Calendar, User, Shield } from 'lucide-react';
import Link from 'next/link';

export default function MentionsLegalesPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-cream via-rose-powder/10 to-cream">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-20">
        {/* Header */}
        <div className="max-w-4xl mx-auto">
          <Link 
            href="/" 
            className="inline-flex items-center space-x-2 text-magenta hover:text-rose-powder transition-colors mb-8"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Retour à l'accueil</span>
          </Link>

          <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-8 md:p-12 border border-rose-powder/30 shadow-rose">
            {/* Title */}
            <div className="text-center mb-12">
              <div className="inline-flex items-center space-x-2 bg-gradient-rose text-white rounded-full px-6 py-2 mb-6">
                <Shield className="w-5 h-5" />
                <span className="font-medium">Informations Légales</span>
              </div>
              
              <h1 className="font-playfair text-4xl md:text-5xl font-bold text-charcoal mb-4">
                Mentions Légales
              </h1>
              
              <p className="text-charcoal/80 text-lg">
                Informations légales obligatoires conformément à la loi française
              </p>
            </div>

            {/* Content */}
            <div className="space-y-8 text-charcoal">
              {/* Éditeur du site */}
              <section>
                <h2 className="font-playfair text-2xl font-bold text-charcoal mb-4 flex items-center">
                  <Building className="w-6 h-6 text-magenta mr-3" />
                  Éditeur du Site
                </h2>
                <div className="bg-rose-powder/10 rounded-xl p-6 space-y-3">
                  <p><strong>Raison sociale :</strong> Salwa Dev Studio (SDS)</p>
                  <p><strong>Statut juridique :</strong> Entreprise individuelle / Auto-entrepreneur</p>
                  <p><strong>Numéro SIRET :</strong> [À compléter lors de la création]</p>
                  <p><strong>Code APE :</strong> 6201Z - Programmation informatique</p>
                  <p><strong>Numéro TVA intracommunautaire :</strong> [Si applicable]</p>
                  <p><strong>Adresse du siège social :</strong> [Votre adresse]</p>
                  <p><strong>Directrice de publication :</strong> Salwa [Nom de famille]</p>
                </div>
              </section>

              {/* Contact */}
              <section>
                <h2 className="font-playfair text-2xl font-bold text-charcoal mb-4 flex items-center">
                  <Mail className="w-6 h-6 text-magenta mr-3" />
                  Coordonnées
                </h2>
                <div className="bg-rose-powder/10 rounded-xl p-6 space-y-3">
                  <p className="flex items-center">
                    <Mail className="w-4 h-4 text-magenta mr-2" />
                    <strong>Email :</strong> salwa@sds-studio.fr
                  </p>
                  <p className="flex items-center">
                    <Phone className="w-4 h-4 text-magenta mr-2" />
                    <strong>Téléphone :</strong> +33 6 XX XX XX XX
                  </p>
                  <p className="flex items-center">
                    <MapPin className="w-4 h-4 text-magenta mr-2" />
                    <strong>Adresse :</strong> France (interventions à distance)
                  </p>
                </div>
              </section>

              {/* Hébergement */}
              <section>
                <h2 className="font-playfair text-2xl font-bold text-charcoal mb-4">
                  Hébergement du Site
                </h2>
                <div className="bg-rose-powder/10 rounded-xl p-6 space-y-3">
                  <p><strong>Hébergeur :</strong> Netlify, Inc.</p>
                  <p><strong>Adresse :</strong> 2325 3rd Street, Suite 296, San Francisco, CA 94107, USA</p>
                  <p><strong>Site web :</strong> <a href="https://netlify.com" className="text-magenta hover:underline">netlify.com</a></p>
                </div>
              </section>

              {/* Propriété intellectuelle */}
              <section>
                <h2 className="font-playfair text-2xl font-bold text-charcoal mb-4">
                  Propriété Intellectuelle
                </h2>
                <div className="space-y-4">
                  <p>
                    L'ensemble de ce site relève de la législation française et internationale sur le droit d'auteur et la propriété intellectuelle. 
                    Tous les droits de reproduction sont réservés, y compris pour les documents téléchargeables et les représentations iconographiques et photographiques.
                  </p>
                  <p>
                    La reproduction de tout ou partie de ce site sur un support électronique quel qu'il soit est formellement interdite 
                    sauf autorisation expresse du directeur de la publication.
                  </p>
                  <p>
                    Les marques et logos reproduits sur ce site sont déposés par les sociétés qui en sont propriétaires.
                  </p>
                </div>
              </section>

              {/* Responsabilité */}
              <section>
                <h2 className="font-playfair text-2xl font-bold text-charcoal mb-4">
                  Limitation de Responsabilité
                </h2>
                <div className="space-y-4">
                  <p>
                    Les informations contenues sur ce site sont aussi précises que possible et le site est périodiquement remis à jour, 
                    mais peut toutefois contenir des inexactitudes, des omissions ou des lacunes.
                  </p>
                  <p>
                    Si vous constatez une lacune, erreur ou ce qui parait être un dysfonctionnement, 
                    merci de bien vouloir le signaler par email à l'adresse salwa@sds-studio.fr, 
                    en décrivant le problème de la manière la plus précise possible.
                  </p>
                  <p>
                    Tout contenu téléchargé se fait aux risques et périls de l'utilisateur et sous sa seule responsabilité. 
                    En conséquence, SDS ne saurait être tenu responsable d'un quelconque dommage subi par l'ordinateur de l'utilisateur 
                    ou d'une quelconque perte de données consécutives au téléchargement.
                  </p>
                </div>
              </section>

              {/* Liens hypertextes */}
              <section>
                <h2 className="font-playfair text-2xl font-bold text-charcoal mb-4">
                  Liens Hypertextes
                </h2>
                <div className="space-y-4">
                  <p>
                    Les sites internet peuvent proposer des liens vers d'autres sites internet ou d'autres ressources disponibles sur Internet. 
                    SDS ne dispose d'aucun moyen pour contrôler les sites en connexion avec ses sites internet.
                  </p>
                  <p>
                    SDS ne répond pas de la disponibilité de tels sites et sources externes, ni ne la garantit. 
                    Elle ne peut être tenue pour responsable de tout dommage, de quelque nature que ce soit, 
                    résultant du contenu de ces sites ou sources externes, et notamment des informations, produits ou services qu'ils proposent, 
                    ou de tout usage qui peut être fait de ces éléments.
                  </p>
                </div>
              </section>

              {/* Droit applicable */}
              <section>
                <h2 className="font-playfair text-2xl font-bold text-charcoal mb-4">
                  Droit Applicable et Juridiction
                </h2>
                <div className="space-y-4">
                  <p>
                    Tout litige en relation avec l'utilisation du site sds-studio.fr est soumis au droit français. 
                    Il est fait attribution exclusive de juridiction aux tribunaux compétents de [Votre ville].
                  </p>
                </div>
              </section>

              {/* Date de mise à jour */}
              <section className="border-t border-rose-powder/30 pt-8">
                <div className="flex items-center text-sm text-charcoal/70">
                  <Calendar className="w-4 h-4 mr-2" />
                  <span>Dernière mise à jour : {new Date().toLocaleDateString('fr-FR')}</span>
                </div>
              </section>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

