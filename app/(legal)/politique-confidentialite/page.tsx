'use client';

import { ArrowLeft, Shield, Eye, Database, Lock, UserCheck, AlertTriangle, Mail } from 'lucide-react';
import Link from 'next/link';

export default function PolitiqueConfidentialitePage() {
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
                <span className="font-medium">Protection des Données</span>
              </div>
              
              <h1 className="font-playfair text-4xl md:text-5xl font-bold text-charcoal mb-4">
                Politique de Confidentialité
              </h1>
              
              <p className="text-charcoal/80 text-lg">
                Conformément au RGPD - Vos données personnelles sont protégées
              </p>
            </div>

            {/* Content */}
            <div className="space-y-8 text-charcoal">
              {/* Introduction */}
              <section>
                <h2 className="font-playfair text-2xl font-bold text-charcoal mb-4 flex items-center">
                  <Eye className="w-6 h-6 text-magenta mr-3" />
                  Introduction
                </h2>
                <div className="space-y-4">
                  <p>
                    Salwa Dev Studio (SDS) s'engage à protéger votre vie privée et vos données personnelles. 
                    Cette politique de confidentialité explique comment nous collectons, utilisons, stockons et protégeons vos informations 
                    conformément au Règlement Général sur la Protection des Données (RGPD).
                  </p>
                  <div className="bg-blue-50 border-l-4 border-blue-400 p-4 rounded">
                    <p className="text-blue-800">
                      <strong>Vos droits :</strong> Vous disposez d'un droit d'accès, de rectification, d'effacement, 
                      de limitation du traitement, de portabilité et d'opposition concernant vos données personnelles.
                    </p>
                  </div>
                </div>
              </section>

              {/* Responsable du traitement */}
              <section>
                <h2 className="font-playfair text-2xl font-bold text-charcoal mb-4 flex items-center">
                  <UserCheck className="w-6 h-6 text-magenta mr-3" />
                  Responsable du Traitement
                </h2>
                <div className="bg-rose-powder/10 rounded-xl p-6 space-y-3">
                  <p><strong>Responsable :</strong> Salwa Dev Studio (SDS)</p>
                  <p><strong>Représentée par :</strong> Salwa [Nom de famille]</p>
                  <p><strong>Email :</strong> salwa@sds-studio.fr</p>
                  <p><strong>Adresse :</strong> [Votre adresse]</p>
                </div>
              </section>

              {/* Données collectées */}
              <section>
                <h2 className="font-playfair text-2xl font-bold text-charcoal mb-4 flex items-center">
                  <Database className="w-6 h-6 text-magenta mr-3" />
                  Données Collectées
                </h2>
                <div className="space-y-6">
                  <div>
                    <h3 className="font-semibold text-lg mb-3">Données d'identification</h3>
                    <ul className="list-disc list-inside space-y-2 ml-4">
                      <li>Nom et prénom</li>
                      <li>Adresse email</li>
                      <li>Numéro de téléphone (optionnel)</li>
                      <li>Nom de l'entreprise (si applicable)</li>
                    </ul>
                  </div>
                  
                  <div>
                    <h3 className="font-semibold text-lg mb-3">Données de navigation</h3>
                    <ul className="list-disc list-inside space-y-2 ml-4">
                      <li>Adresse IP</li>
                      <li>Type de navigateur</li>
                      <li>Pages visitées</li>
                      <li>Durée de visite</li>
                      <li>Cookies techniques</li>
                    </ul>
                  </div>
                  
                  <div>
                    <h3 className="font-semibold text-lg mb-3">Données de projet</h3>
                    <ul className="list-disc list-inside space-y-2 ml-4">
                      <li>Description du projet</li>
                      <li>Budget estimé</li>
                      <li>Délai souhaité</li>
                      <li>Besoins spécifiques</li>
                    </ul>
                  </div>
                </div>
              </section>

              {/* Finalités du traitement */}
              <section>
                <h2 className="font-playfair text-2xl font-bold text-charcoal mb-4">
                  Finalités du Traitement
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-rose-powder/10 rounded-xl p-6">
                    <h3 className="font-semibold text-lg mb-3">Gestion des demandes</h3>
                    <ul className="list-disc list-inside space-y-1 text-sm">
                      <li>Répondre à vos questions</li>
                      <li>Établir des devis</li>
                      <li>Suivre les projets</li>
                    </ul>
                  </div>
                  
                  <div className="bg-rose-powder/10 rounded-xl p-6">
                    <h3 className="font-semibold text-lg mb-3">Communication</h3>
                    <ul className="list-disc list-inside space-y-1 text-sm">
                      <li>Envoi de newsletters</li>
                      <li>Informations sur nos services</li>
                      <li>Support client</li>
                    </ul>
                  </div>
                  
                  <div className="bg-rose-powder/10 rounded-xl p-6">
                    <h3 className="font-semibold text-lg mb-3">Amélioration</h3>
                    <ul className="list-disc list-inside space-y-1 text-sm">
                      <li>Analyse du site web</li>
                      <li>Optimisation UX</li>
                      <li>Statistiques anonymes</li>
                    </ul>
                  </div>
                  
                  <div className="bg-rose-powder/10 rounded-xl p-6">
                    <h3 className="font-semibold text-lg mb-3">Obligations légales</h3>
                    <ul className="list-disc list-inside space-y-1 text-sm">
                      <li>Facturation</li>
                      <li>Comptabilité</li>
                      <li>Déclarations fiscales</li>
                    </ul>
                  </div>
                </div>
              </section>

              {/* Base légale */}
              <section>
                <h2 className="font-playfair text-2xl font-bold text-charcoal mb-4">
                  Base Légale du Traitement
                </h2>
                <div className="space-y-4">
                  <div className="border-l-4 border-green-400 bg-green-50 p-4 rounded">
                    <p><strong>Consentement :</strong> Pour l'envoi de newsletters et communications marketing</p>
                  </div>
                  <div className="border-l-4 border-blue-400 bg-blue-50 p-4 rounded">
                    <p><strong>Exécution du contrat :</strong> Pour la gestion des projets et la facturation</p>
                  </div>
                  <div className="border-l-4 border-orange-400 bg-orange-50 p-4 rounded">
                    <p><strong>Intérêt légitime :</strong> Pour l'amélioration de nos services et la sécurité</p>
                  </div>
                  <div className="border-l-4 border-red-400 bg-red-50 p-4 rounded">
                    <p><strong>Obligation légale :</strong> Pour la comptabilité et les déclarations fiscales</p>
                  </div>
                </div>
              </section>

              {/* Durée de conservation */}
              <section>
                <h2 className="font-playfair text-2xl font-bold text-charcoal mb-4">
                  Durée de Conservation
                </h2>
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse border border-rose-powder/30 rounded-lg">
                    <thead>
                      <tr className="bg-rose-powder/20">
                        <th className="border border-rose-powder/30 p-3 text-left">Type de données</th>
                        <th className="border border-rose-powder/30 p-3 text-left">Durée</th>
                        <th className="border border-rose-powder/30 p-3 text-left">Justification</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td className="border border-rose-powder/30 p-3">Données de contact</td>
                        <td className="border border-rose-powder/30 p-3">3 ans après dernier contact</td>
                        <td className="border border-rose-powder/30 p-3">Relation commerciale</td>
                      </tr>
                      <tr className="bg-rose-powder/5">
                        <td className="border border-rose-powder/30 p-3">Données de facturation</td>
                        <td className="border border-rose-powder/30 p-3">10 ans</td>
                        <td className="border border-rose-powder/30 p-3">Obligation légale</td>
                      </tr>
                      <tr>
                        <td className="border border-rose-powder/30 p-3">Cookies techniques</td>
                        <td className="border border-rose-powder/30 p-3">13 mois maximum</td>
                        <td className="border border-rose-powder/30 p-3">Fonctionnement du site</td>
                      </tr>
                      <tr className="bg-rose-powder/5">
                        <td className="border border-rose-powder/30 p-3">Logs de connexion</td>
                        <td className="border border-rose-powder/30 p-3">1 an</td>
                        <td className="border border-rose-powder/30 p-3">Sécurité</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </section>

              {/* Vos droits */}
              <section>
                <h2 className="font-playfair text-2xl font-bold text-charcoal mb-4 flex items-center">
                  <Lock className="w-6 h-6 text-magenta mr-3" />
                  Vos Droits RGPD
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-gradient-to-r from-magenta/10 to-rose-powder/10 rounded-xl p-4">
                    <h3 className="font-semibold mb-2">Droit d'accès</h3>
                    <p className="text-sm">Connaître les données que nous détenons sur vous</p>
                  </div>
                  <div className="bg-gradient-to-r from-rose-powder/10 to-cream/10 rounded-xl p-4">
                    <h3 className="font-semibold mb-2">Droit de rectification</h3>
                    <p className="text-sm">Corriger ou mettre à jour vos informations</p>
                  </div>
                  <div className="bg-gradient-to-r from-cream/10 to-rose-powder/10 rounded-xl p-4">
                    <h3 className="font-semibold mb-2">Droit d'effacement</h3>
                    <p className="text-sm">Demander la suppression de vos données</p>
                  </div>
                  <div className="bg-gradient-to-r from-rose-powder/10 to-magenta/10 rounded-xl p-4">
                    <h3 className="font-semibold mb-2">Droit de portabilité</h3>
                    <p className="text-sm">Récupérer vos données dans un format lisible</p>
                  </div>
                  <div className="bg-gradient-to-r from-magenta/10 to-rose-powder/10 rounded-xl p-4">
                    <h3 className="font-semibold mb-2">Droit d'opposition</h3>
                    <p className="text-sm">Vous opposer au traitement de vos données</p>
                  </div>
                  <div className="bg-gradient-to-r from-rose-powder/10 to-cream/10 rounded-xl p-4">
                    <h3 className="font-semibold mb-2">Droit de limitation</h3>
                    <p className="text-sm">Limiter l'utilisation de vos données</p>
                  </div>
                </div>
                
                <div className="mt-6 bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded">
                  <p className="text-yellow-800">
                    <strong>Comment exercer vos droits :</strong> Envoyez un email à salwa@sds-studio.fr 
                    avec une pièce d'identité. Nous répondons sous 30 jours maximum.
                  </p>
                </div>
              </section>

              {/* Sécurité */}
              <section>
                <h2 className="font-playfair text-2xl font-bold text-charcoal mb-4">
                  Sécurité des Données
                </h2>
                <div className="space-y-4">
                  <p>
                    Nous mettons en œuvre des mesures techniques et organisationnelles appropriées pour protéger vos données personnelles :
                  </p>
                  <ul className="list-disc list-inside space-y-2 ml-4">
                    <li>Chiffrement SSL/TLS pour toutes les communications</li>
                    <li>Hébergement sécurisé chez Netlify (certifié SOC 2)</li>
                    <li>Accès limité aux données sur la base du besoin d'en connaître</li>
                    <li>Sauvegardes régulières et sécurisées</li>
                    <li>Surveillance continue des accès</li>
                    <li>Formation à la sécurité des données</li>
                  </ul>
                </div>
              </section>

              {/* Transferts internationaux */}
              <section>
                <h2 className="font-playfair text-2xl font-bold text-charcoal mb-4">
                  Transferts Internationaux
                </h2>
                <div className="space-y-4">
                  <p>
                    Certains de nos prestataires peuvent être situés en dehors de l'Union Européenne. 
                    Dans ce cas, nous nous assurons que des garanties appropriées sont en place :
                  </p>
                  <ul className="list-disc list-inside space-y-2 ml-4">
                    <li>Clauses contractuelles types approuvées par la Commission européenne</li>
                    <li>Certification sous le Privacy Shield (si applicable)</li>
                    <li>Décision d'adéquation de la Commission européenne</li>
                  </ul>
                </div>
              </section>

              {/* Contact DPO */}
              <section>
                <h2 className="font-playfair text-2xl font-bold text-charcoal mb-4 flex items-center">
                  <Mail className="w-6 h-6 text-magenta mr-3" />
                  Contact et Réclamations
                </h2>
                <div className="bg-rose-powder/10 rounded-xl p-6 space-y-4">
                  <p>
                    <strong>Pour toute question concernant cette politique de confidentialité :</strong>
                  </p>
                  <p>Email : salwa@sds-studio.fr</p>
                  <p>
                    <strong>Droit de réclamation :</strong> Vous avez le droit de déposer une réclamation auprès de la CNIL 
                    (Commission Nationale de l'Informatique et des Libertés) si vous estimez que vos droits ne sont pas respectés.
                  </p>
                  <p>
                    <strong>CNIL :</strong> 3 Place de Fontenoy - TSA 80715 - 75334 PARIS CEDEX 07 - 
                    <a href="https://www.cnil.fr" className="text-magenta hover:underline">www.cnil.fr</a>
                  </p>
                </div>
              </section>

              {/* Modifications */}
              <section>
                <h2 className="font-playfair text-2xl font-bold text-charcoal mb-4">
                  Modifications de cette Politique
                </h2>
                <div className="space-y-4">
                  <p>
                    Cette politique de confidentialité peut être modifiée à tout moment. 
                    Toute modification sera publiée sur cette page avec une nouvelle date de mise à jour.
                  </p>
                  <p>
                    En cas de modification substantielle, nous vous en informerons par email 
                    ou par un avis visible sur notre site web.
                  </p>
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

