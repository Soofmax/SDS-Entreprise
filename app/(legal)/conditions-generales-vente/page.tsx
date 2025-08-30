'use client';

import { ArrowLeft, FileText, Euro, Calendar, Shield, AlertTriangle, CheckCircle } from 'lucide-react';
import Link from 'next/link';

export default function ConditionsGeneralesVentePage() {
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
                <FileText className="w-5 h-5" />
                <span className="font-medium">Conditions Commerciales</span>
              </div>
              
              <h1 className="font-playfair text-4xl md:text-5xl font-bold text-charcoal mb-4">
                Conditions Générales de Vente
              </h1>
              
              <p className="text-charcoal/80 text-lg">
                Conditions applicables à tous nos services de développement web
              </p>
            </div>

            {/* Content */}
            <div className="space-y-8 text-charcoal">
              {/* Article 1 */}
              <section>
                <h2 className="font-playfair text-2xl font-bold text-charcoal mb-4">
                  Article 1 - Objet et Champ d'Application
                </h2>
                <div className="space-y-4">
                  <p>
                    Les présentes Conditions Générales de Vente (CGV) régissent les relations contractuelles 
                    entre Salwa Dev Studio (SDS), auto-entrepreneur, et ses clients pour la fourniture de services 
                    de développement web, création de sites internet, applications web et services connexes.
                  </p>
                  <p>
                    Toute commande implique l'acceptation sans réserve des présentes CGV qui prévalent 
                    sur toutes autres conditions générales ou particulières du client.
                  </p>
                </div>
              </section>

              {/* Article 2 */}
              <section>
                <h2 className="font-playfair text-2xl font-bold text-charcoal mb-4">
                  Article 2 - Services Proposés
                </h2>
                <div className="space-y-4">
                  <p>SDS propose les services suivants :</p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-rose-powder/10 rounded-xl p-4">
                      <h3 className="font-semibold mb-2">Développement Web</h3>
                      <ul className="list-disc list-inside text-sm space-y-1">
                        <li>Sites vitrines</li>
                        <li>Sites e-commerce</li>
                        <li>Applications web</li>
                        <li>Landing pages</li>
                      </ul>
                    </div>
                    <div className="bg-rose-powder/10 rounded-xl p-4">
                      <h3 className="font-semibold mb-2">Services Connexes</h3>
                      <ul className="list-disc list-inside text-sm space-y-1">
                        <li>Optimisation SEO</li>
                        <li>Maintenance</li>
                        <li>Formation</li>
                        <li>Hébergement</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </section>

              {/* Article 3 */}
              <section>
                <h2 className="font-playfair text-2xl font-bold text-charcoal mb-4 flex items-center">
                  <Euro className="w-6 h-6 text-magenta mr-3" />
                  Article 3 - Tarifs et Devis
                </h2>
                <div className="space-y-4">
                  <p>
                    Les tarifs sont exprimés en euros toutes taxes comprises (TTC). 
                    En tant qu'auto-entrepreneur, SDS bénéficie de la franchise de TVA.
                  </p>
                  <div className="bg-blue-50 border-l-4 border-blue-400 p-4 rounded">
                    <h3 className="font-semibold mb-2">Packages Standards :</h3>
                    <ul className="space-y-1">
                      <li>• <strong>Essentiel :</strong> 3 360€ (site vitrine professionnel)</li>
                      <li>• <strong>Professionnel :</strong> 5 200€ (site avec fonctionnalités avancées)</li>
                      <li>• <strong>Boutique :</strong> 8 000€ (e-commerce complet)</li>
                    </ul>
                  </div>
                  <p>
                    Tout devis est valable 30 jours à compter de sa date d'émission. 
                    Les tarifs peuvent être révisés à tout moment pour les nouvelles commandes.
                  </p>
                </div>
              </section>

              {/* Article 4 */}
              <section>
                <h2 className="font-playfair text-2xl font-bold text-charcoal mb-4">
                  Article 4 - Commande et Acceptation
                </h2>
                <div className="space-y-4">
                  <p>
                    La commande est ferme et définitive dès acceptation du devis par le client, 
                    matérialisée par sa signature (physique ou électronique) et le versement de l'acompte.
                  </p>
                  <div className="bg-green-50 border-l-4 border-green-400 p-4 rounded">
                    <h3 className="font-semibold mb-2">Processus de commande :</h3>
                    <ol className="list-decimal list-inside space-y-1">
                      <li>Demande de devis via le formulaire de contact</li>
                      <li>Échange et définition du cahier des charges</li>
                      <li>Envoi du devis détaillé</li>
                      <li>Signature du devis et versement de l'acompte</li>
                      <li>Démarrage du projet</li>
                    </ol>
                  </div>
                </div>
              </section>

              {/* Article 5 */}
              <section>
                <h2 className="font-playfair text-2xl font-bold text-charcoal mb-4">
                  Article 5 - Modalités de Paiement
                </h2>
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h3 className="font-semibold mb-3">Échéancier de Paiement</h3>
                      <ul className="space-y-2">
                        <li>• <strong>Acompte :</strong> 50% à la commande</li>
                        <li>• <strong>Solde :</strong> 50% à la livraison</li>
                      </ul>
                    </div>
                    <div>
                      <h3 className="font-semibold mb-3">Moyens de Paiement</h3>
                      <ul className="space-y-2">
                        <li>• Virement bancaire</li>
                        <li>• Carte bancaire (Stripe)</li>
                        <li>• PayPal</li>
                      </ul>
                    </div>
                  </div>
                  <div className="bg-red-50 border-l-4 border-red-400 p-4 rounded">
                    <p className="text-red-800">
                      <strong>Retard de paiement :</strong> En cas de retard de paiement, 
                      des pénalités de 3 fois le taux d'intérêt légal seront appliquées, 
                      ainsi qu'une indemnité forfaitaire de 40€ pour frais de recouvrement.
                    </p>
                  </div>
                </div>
              </section>

              {/* Article 6 */}
              <section>
                <h2 className="font-playfair text-2xl font-bold text-charcoal mb-4 flex items-center">
                  <Calendar className="w-6 h-6 text-magenta mr-3" />
                  Article 6 - Délais de Livraison
                </h2>
                <div className="space-y-4">
                  <p>
                    Les délais de livraison sont indicatifs et courent à compter de la réception 
                    de l'acompte et de tous les éléments nécessaires à la réalisation du projet.
                  </p>
                  <div className="overflow-x-auto">
                    <table className="w-full border-collapse border border-rose-powder/30 rounded-lg">
                      <thead>
                        <tr className="bg-rose-powder/20">
                          <th className="border border-rose-powder/30 p-3 text-left">Type de projet</th>
                          <th className="border border-rose-powder/30 p-3 text-left">Délai standard</th>
                          <th className="border border-rose-powder/30 p-3 text-left">Délai express (+800€)</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <td className="border border-rose-powder/30 p-3">Site vitrine (Essentiel)</td>
                          <td className="border border-rose-powder/30 p-3">7-10 jours</td>
                          <td className="border border-rose-powder/30 p-3">5 jours</td>
                        </tr>
                        <tr className="bg-rose-powder/5">
                          <td className="border border-rose-powder/30 p-3">Site avancé (Professionnel)</td>
                          <td className="border border-rose-powder/30 p-3">10-14 jours</td>
                          <td className="border border-rose-powder/30 p-3">7 jours</td>
                        </tr>
                        <tr>
                          <td className="border border-rose-powder/30 p-3">E-commerce (Boutique)</td>
                          <td className="border border-rose-powder/30 p-3">14-21 jours</td>
                          <td className="border border-rose-powder/30 p-3">10 jours</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                  <p>
                    Un retard de livraison ne peut donner lieu à des dommages et intérêts 
                    ou à l'annulation de la commande, sauf en cas de retard supérieur à 30 jours.
                  </p>
                </div>
              </section>

              {/* Article 7 */}
              <section>
                <h2 className="font-playfair text-2xl font-bold text-charcoal mb-4">
                  Article 7 - Obligations du Client
                </h2>
                <div className="space-y-4">
                  <p>Le client s'engage à :</p>
                  <ul className="list-disc list-inside space-y-2 ml-4">
                    <li>Fournir tous les éléments nécessaires à la réalisation du projet (textes, images, logos, etc.)</li>
                    <li>Respecter les délais de validation et de retour des maquettes</li>
                    <li>Vérifier et valider les contenus avant mise en ligne</li>
                    <li>Respecter les droits de propriété intellectuelle des tiers</li>
                    <li>Effectuer les paiements aux échéances convenues</li>
                    <li>Informer SDS de tout changement dans ses besoins</li>
                  </ul>
                  <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded">
                    <p className="text-yellow-800">
                      <strong>Important :</strong> Tout retard dans la fourniture des éléments par le client 
                      entraîne un report proportionnel des délais de livraison.
                    </p>
                  </div>
                </div>
              </section>

              {/* Article 8 */}
              <section>
                <h2 className="font-playfair text-2xl font-bold text-charcoal mb-4">
                  Article 8 - Révisions et Modifications
                </h2>
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="bg-green-50 border border-green-200 rounded-xl p-4">
                      <h3 className="font-semibold text-green-800 mb-2">Essentiel</h3>
                      <p className="text-green-700">3 révisions incluses</p>
                    </div>
                    <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                      <h3 className="font-semibold text-blue-800 mb-2">Professionnel</h3>
                      <p className="text-blue-700">5 révisions incluses</p>
                    </div>
                    <div className="bg-purple-50 border border-purple-200 rounded-xl p-4">
                      <h3 className="font-semibold text-purple-800 mb-2">Boutique</h3>
                      <p className="text-purple-700">Révisions illimitées</p>
                    </div>
                  </div>
                  <p>
                    Les révisions supplémentaires sont facturées 150€ HT par jour de travail. 
                    Toute modification majeure du cahier des charges initial fera l'objet d'un avenant au contrat.
                  </p>
                </div>
              </section>

              {/* Article 9 */}
              <section>
                <h2 className="font-playfair text-2xl font-bold text-charcoal mb-4 flex items-center">
                  <Shield className="w-6 h-6 text-magenta mr-3" />
                  Article 9 - Garanties
                </h2>
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="bg-rose-powder/10 rounded-xl p-4 text-center">
                      <CheckCircle className="w-8 h-8 text-green-600 mx-auto mb-2" />
                      <h3 className="font-semibold mb-2">Essentiel</h3>
                      <p>30 jours de garantie</p>
                    </div>
                    <div className="bg-rose-powder/10 rounded-xl p-4 text-center">
                      <CheckCircle className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                      <h3 className="font-semibold mb-2">Professionnel</h3>
                      <p>60 jours de garantie</p>
                    </div>
                    <div className="bg-rose-powder/10 rounded-xl p-4 text-center">
                      <CheckCircle className="w-8 h-8 text-purple-600 mx-auto mb-2" />
                      <h3 className="font-semibold mb-2">Boutique</h3>
                      <p>90 jours de garantie</p>
                    </div>
                  </div>
                  <p>
                    La garantie couvre les dysfonctionnements techniques liés au développement initial. 
                    Elle ne couvre pas les modifications de contenu, les mises à jour de sécurité, 
                    ou les problèmes liés à l'hébergement tiers.
                  </p>
                </div>
              </section>

              {/* Article 10 */}
              <section>
                <h2 className="font-playfair text-2xl font-bold text-charcoal mb-4">
                  Article 10 - Propriété Intellectuelle
                </h2>
                <div className="space-y-4">
                  <p>
                    À compter du paiement intégral du projet, le client devient propriétaire 
                    du code source et des éléments graphiques créés spécifiquement pour son projet.
                  </p>
                  <div className="bg-blue-50 border-l-4 border-blue-400 p-4 rounded">
                    <h3 className="font-semibold mb-2">Droits transférés au client :</h3>
                    <ul className="list-disc list-inside space-y-1">
                      <li>Code source du site web</li>
                      <li>Éléments graphiques personnalisés</li>
                      <li>Droit d'utilisation et de modification</li>
                    </ul>
                  </div>
                  <div className="bg-orange-50 border-l-4 border-orange-400 p-4 rounded">
                    <h3 className="font-semibold mb-2">Droits conservés par SDS :</h3>
                    <ul className="list-disc list-inside space-y-1">
                      <li>Frameworks et bibliothèques open source</li>
                      <li>Méthodologies et savoir-faire</li>
                      <li>Droit de référence et de portfolio</li>
                    </ul>
                  </div>
                </div>
              </section>

              {/* Article 11 */}
              <section>
                <h2 className="font-playfair text-2xl font-bold text-charcoal mb-4">
                  Article 11 - Résiliation et Annulation
                </h2>
                <div className="space-y-4">
                  <p>
                    En cas d'annulation par le client après signature du devis :
                  </p>
                  <ul className="list-disc list-inside space-y-2 ml-4">
                    <li>Avant le début des travaux : remboursement de 50% de l'acompte</li>
                    <li>Après le début des travaux : facturation au prorata du travail effectué</li>
                    <li>Après livraison : aucun remboursement (voir droit de rétractation)</li>
                  </ul>
                  <p>
                    SDS se réserve le droit de résilier le contrat en cas de non-paiement 
                    ou de non-respect des obligations du client.
                  </p>
                </div>
              </section>

              {/* Article 12 */}
              <section>
                <h2 className="font-playfair text-2xl font-bold text-charcoal mb-4">
                  Article 12 - Limitation de Responsabilité
                </h2>
                <div className="space-y-4">
                  <p>
                    La responsabilité de SDS est limitée au montant du contrat. 
                    SDS ne peut être tenue responsable des dommages indirects tels que :
                  </p>
                  <ul className="list-disc list-inside space-y-2 ml-4">
                    <li>Perte de chiffre d'affaires</li>
                    <li>Perte de clientèle</li>
                    <li>Perte de données (sauvegardes recommandées)</li>
                    <li>Interruption d'activité</li>
                  </ul>
                </div>
              </section>

              {/* Article 13 */}
              <section>
                <h2 className="font-playfair text-2xl font-bold text-charcoal mb-4">
                  Article 13 - Droit Applicable et Litiges
                </h2>
                <div className="space-y-4">
                  <p>
                    Les présentes CGV sont soumises au droit français. 
                    En cas de litige, les parties s'efforceront de trouver une solution amiable.
                  </p>
                  <p>
                    À défaut, les tribunaux compétents de [Votre ville] seront seuls compétents.
                  </p>
                  <div className="bg-green-50 border-l-4 border-green-400 p-4 rounded">
                    <p className="text-green-800">
                      <strong>Médiation :</strong> En cas de litige, le client peut recourir gratuitement 
                      à un médiateur de la consommation. Coordonnées disponibles sur demande.
                    </p>
                  </div>
                </div>
              </section>

              {/* Date de mise à jour */}
              <section className="border-t border-rose-powder/30 pt-8">
                <div className="flex items-center justify-between text-sm text-charcoal/70">
                  <span>Dernière mise à jour : {new Date().toLocaleDateString('fr-FR')}</span>
                  <span>Version 1.0</span>
                </div>
              </section>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

