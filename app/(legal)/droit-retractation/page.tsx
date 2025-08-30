import { Metadata } from 'next';
import Link from 'next/link';
import { ArrowLeft, Clock, FileText, AlertCircle, CheckCircle, XCircle } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Droit de Rétractation | SDS',
  description: 'Informations sur le droit de rétractation pour les services de développement web SDS. Délais, conditions et procédure.',
  robots: 'index, follow',
};

export default function DroitRetractation() {
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
              <Clock className="w-4 h-4 text-magenta" aria-hidden="true" />
              <span className="text-sm font-medium text-charcoal">Droit de Rétractation</span>
            </div>
            
            <h1 className="font-playfair text-4xl md:text-5xl font-bold text-charcoal mb-4">
              Droit de <span className="text-gradient">Rétractation</span>
            </h1>
            
            <p className="text-lg text-charcoal/70 max-w-2xl mx-auto">
              Vos droits et les conditions d'exercice du droit de rétractation
            </p>
          </div>

          {/* Content */}
          <div className="bg-white/60 backdrop-blur-sm rounded-2xl border border-rose-powder/20 p-8 md:p-12">
            <div className="prose prose-lg max-w-none">
              
              {/* Délai de rétractation */}
              <section className="mb-8">
                <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-lg p-6 mb-6">
                  <h2 className="font-playfair text-2xl font-bold text-green-800 mb-4 flex items-center">
                    <Clock className="w-6 h-6 text-green-600 mr-3" aria-hidden="true" />
                    Délai de Rétractation : 14 Jours
                  </h2>
                  <p className="text-green-700 leading-relaxed text-lg">
                    Conformément à l'article L221-18 du Code de la consommation, vous disposez d'un délai de 
                    <strong> 14 jours calendaires</strong> pour exercer votre droit de rétractation sans avoir 
                    à justifier de motifs ni à payer de pénalités.
                  </p>
                </div>
              </section>

              <section className="mb-8">
                <h2 className="font-playfair text-2xl font-bold text-charcoal mb-4 flex items-center">
                  <FileText className="w-6 h-6 text-magenta mr-3" aria-hidden="true" />
                  1. Point de Départ du Délai
                </h2>
                
                <div className="space-y-4">
                  <div className="bg-white/40 rounded-lg p-6 border border-rose-powder/20">
                    <h3 className="font-semibold text-charcoal mb-3">📅 Pour les Services de Développement</h3>
                    <p className="text-charcoal/80 leading-relaxed">
                      Le délai de rétractation commence à courir à compter de la date de conclusion du contrat, 
                      soit la date de signature électronique ou de validation de votre commande.
                    </p>
                  </div>

                  <div className="bg-white/40 rounded-lg p-6 border border-rose-powder/20">
                    <h3 className="font-semibold text-charcoal mb-3">⏰ Calcul du Délai</h3>
                    <p className="text-charcoal/80 leading-relaxed">
                      Le délai expire 14 jours après le jour de la conclusion du contrat. Si le 14ème jour 
                      tombe un samedi, dimanche ou jour férié, le délai est prorogé jusqu'au premier jour 
                      ouvrable suivant.
                    </p>
                  </div>
                </div>
              </section>

              <section className="mb-8">
                <h2 className="font-playfair text-2xl font-bold text-charcoal mb-4">
                  2. Conditions d'Exercice
                </h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-green-50 border border-green-200 rounded-lg p-6">
                    <h3 className="font-semibold text-green-800 mb-3 flex items-center">
                      <CheckCircle className="w-5 h-5 text-green-600 mr-2" aria-hidden="true" />
                      Cas Où la Rétractation est Possible
                    </h3>
                    <ul className="list-disc list-inside text-green-700 space-y-2">
                      <li>Aucun travail n'a commencé</li>
                      <li>Aucun fichier n'a été livré</li>
                      <li>Délai de 14 jours respecté</li>
                      <li>Demande formulée par écrit</li>
                    </ul>
                  </div>

                  <div className="bg-red-50 border border-red-200 rounded-lg p-6">
                    <h3 className="font-semibold text-red-800 mb-3 flex items-center">
                      <XCircle className="w-5 h-5 text-red-600 mr-2" aria-hidden="true" />
                      Cas d'Exclusion du Droit
                    </h3>
                    <ul className="list-disc list-inside text-red-700 space-y-2">
                      <li>Prestation commencée avec accord</li>
                      <li>Livraison partielle effectuée</li>
                      <li>Service personnalisé en cours</li>
                      <li>Délai de 14 jours dépassé</li>
                    </ul>
                  </div>
                </div>
              </section>

              <section className="mb-8">
                <h2 className="font-playfair text-2xl font-bold text-charcoal mb-4">
                  3. Procédure de Rétractation
                </h2>
                
                <div className="space-y-6">
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                    <h3 className="font-semibold text-blue-800 mb-4">📝 Étape 1 : Notification</h3>
                    <p className="text-blue-700 leading-relaxed mb-4">
                      Vous devez nous notifier votre décision de rétractation par une déclaration dénuée 
                      d'ambiguïté. Vous pouvez utiliser le formulaire type ci-dessous ou nous contacter 
                      directement.
                    </p>
                    
                    <div className="bg-white/60 rounded-lg p-4 border border-blue-300">
                      <h4 className="font-semibold text-blue-800 mb-2">Moyens de Contact :</h4>
                      <ul className="list-disc list-inside text-blue-700 space-y-1">
                        <li><strong>Email :</strong> contact@sds.dev</li>
                        <li><strong>Formulaire :</strong> <Link href="/contact" className="text-magenta hover:underline">Page de contact</Link></li>
                        <li><strong>Courrier :</strong> SDS, [Adresse complète]</li>
                      </ul>
                    </div>
                  </div>

                  <div className="bg-purple-50 border border-purple-200 rounded-lg p-6">
                    <h3 className="font-semibold text-purple-800 mb-4">📋 Étape 2 : Formulaire Type</h3>
                    <div className="bg-white/80 rounded-lg p-6 border border-purple-300">
                      <p className="text-purple-700 leading-relaxed italic">
                        "Je/Nous (*) vous notifie/notifions (*) par la présente ma/notre (*) rétractation 
                        du contrat portant sur la prestation de services ci-dessous :<br/><br/>
                        
                        - Commandé le (*) / reçu le (*) :<br/>
                        - Nom du (des) consommateur(s) :<br/>
                        - Adresse du (des) consommateur(s) :<br/>
                        - Signature du (des) consommateur(s) (uniquement en cas de notification du présent 
                        formulaire sur papier) :<br/>
                        - Date :<br/><br/>
                        
                        (*) Rayez la mention inutile."
                      </p>
                    </div>
                  </div>
                </div>
              </section>

              <section className="mb-8">
                <h2 className="font-playfair text-2xl font-bold text-charcoal mb-4">
                  4. Effets de la Rétractation
                </h2>
                
                <div className="space-y-4">
                  <div className="bg-white/40 rounded-lg p-6 border border-rose-powder/20">
                    <h3 className="font-semibold text-charcoal mb-3">💰 Remboursement</h3>
                    <p className="text-charcoal/80 leading-relaxed">
                      En cas de rétractation dans les délais, nous vous rembourserons tous les paiements 
                      reçus de votre part, y compris les frais de livraison (à l'exception des frais 
                      supplémentaires découlant du fait que vous avez choisi un mode de livraison autre 
                      que le mode le moins coûteux de livraison standard proposé par nous).
                    </p>
                  </div>

                  <div className="bg-white/40 rounded-lg p-6 border border-rose-powder/20">
                    <h3 className="font-semibold text-charcoal mb-3">⏱️ Délai de Remboursement</h3>
                    <p className="text-charcoal/80 leading-relaxed">
                      Le remboursement sera effectué dans un délai de <strong>14 jours</strong> à compter 
                      du jour où nous sommes informés de votre décision de rétractation. Nous procéderons 
                      au remboursement en utilisant le même moyen de paiement que celui que vous avez 
                      utilisé pour la transaction initiale.
                    </p>
                  </div>

                  <div className="bg-white/40 rounded-lg p-6 border border-rose-powder/20">
                    <h3 className="font-semibold text-charcoal mb-3">🔄 Restitution</h3>
                    <p className="text-charcoal/80 leading-relaxed">
                      Si des éléments vous ont été transmis (maquettes, fichiers de travail, accès), 
                      vous vous engagez à les restituer ou à les détruire dans un délai de 14 jours 
                      suivant la communication de votre décision de rétractation.
                    </p>
                  </div>
                </div>
              </section>

              <section className="mb-8">
                <h2 className="font-playfair text-2xl font-bold text-charcoal mb-4 flex items-center">
                  <AlertCircle className="w-6 h-6 text-magenta mr-3" aria-hidden="true" />
                  5. Exceptions au Droit de Rétractation
                </h2>
                
                <div className="bg-amber-50 border border-amber-200 rounded-lg p-6">
                  <p className="text-amber-800 leading-relaxed mb-4">
                    Conformément à l'article L221-28 du Code de la consommation, le droit de rétractation 
                    ne peut être exercé pour :
                  </p>
                  <ul className="list-disc list-inside text-amber-700 space-y-2 ml-4">
                    <li>
                      <strong>Services entièrement exécutés :</strong> Si la prestation de services a été 
                      entièrement exécutée avant la fin du délai de rétractation et avec votre accord 
                      préalable exprès
                    </li>
                    <li>
                      <strong>Biens personnalisés :</strong> Fourniture de biens confectionnés selon les 
                      spécifications du consommateur ou nettement personnalisés
                    </li>
                    <li>
                      <strong>Biens périssables :</strong> Fourniture de biens susceptibles de se détériorer 
                      ou de se périmer rapidement
                    </li>
                    <li>
                      <strong>Contenu numérique :</strong> Fourniture d'un contenu numérique non fourni sur 
                      un support matériel dont l'exécution a commencé avec votre accord préalable exprès
                    </li>
                  </ul>
                </div>
              </section>

              <section className="mb-8">
                <h2 className="font-playfair text-2xl font-bold text-charcoal mb-4">
                  6. Cas Particuliers
                </h2>
                
                <div className="space-y-4">
                  <div className="bg-white/40 rounded-lg p-6 border border-rose-powder/20">
                    <h3 className="font-semibold text-charcoal mb-3">🚀 Demande d'Exécution Immédiate</h3>
                    <p className="text-charcoal/80 leading-relaxed">
                      Si vous demandez expressément que la prestation commence avant la fin du délai de 
                      rétractation, vous perdez votre droit de rétractation dès que la prestation est 
                      entièrement exécutée.
                    </p>
                  </div>

                  <div className="bg-white/40 rounded-lg p-6 border border-rose-powder/20">
                    <h3 className="font-semibold text-charcoal mb-3">⚡ Prestations d'Urgence</h3>
                    <p className="text-charcoal/80 leading-relaxed">
                      Pour les prestations d'urgence (maintenance corrective, résolution de bugs critiques), 
                      le droit de rétractation peut être limité si l'exécution immédiate est nécessaire 
                      et expressément demandée.
                    </p>
                  </div>
                </div>
              </section>

              <section className="mb-8">
                <h2 className="font-playfair text-2xl font-bold text-charcoal mb-4">
                  7. Médiation et Réclamations
                </h2>
                <p className="text-charcoal/80 leading-relaxed mb-4">
                  En cas de litige relatif à l'exercice du droit de rétractation, vous pouvez :
                </p>
                <ul className="list-disc list-inside text-charcoal/80 space-y-2 ml-4">
                  <li>Nous contacter directement pour rechercher une solution amiable</li>
                  <li>Saisir le médiateur de la consommation compétent</li>
                  <li>Contacter la DGCCRF (Direction Générale de la Concurrence, de la Consommation et de la Répression des Fraudes)</li>
                  <li>Saisir les tribunaux compétents en dernier recours</li>
                </ul>
              </section>

              <section className="mb-8">
                <h2 className="font-playfair text-2xl font-bold text-charcoal mb-4">
                  8. Contact
                </h2>
                <p className="text-charcoal/80 leading-relaxed mb-4">
                  Pour exercer votre droit de rétractation ou pour toute question :
                </p>
                <div className="bg-gradient-to-r from-rose-powder/20 to-magenta/10 rounded-lg p-6">
                  <ul className="list-disc list-inside text-charcoal/80 space-y-2">
                    <li><strong>Email :</strong> contact@sds.dev</li>
                    <li><strong>Formulaire :</strong> <Link href="/contact" className="text-magenta hover:underline">Page de contact</Link></li>
                    <li><strong>Téléphone :</strong> [Numéro de téléphone]</li>
                    <li><strong>Courrier :</strong> SDS, [Adresse complète]</li>
                  </ul>
                </div>
              </section>

            </div>
          </div>

          {/* Navigation */}
          <div className="mt-12 flex flex-col sm:flex-row gap-4 justify-between">
            <Link 
              href="/politique-cookies" 
              className="inline-flex items-center justify-center px-6 py-3 bg-white/80 backdrop-blur-sm border border-rose-powder/30 rounded-full text-charcoal hover:bg-rose-powder/10 transition-all"
            >
              <ArrowLeft className="w-4 h-4 mr-2" aria-hidden="true" />
              Politique de Cookies
            </Link>
            
            <Link 
              href="/conditions-generales-vente" 
              className="inline-flex items-center justify-center px-6 py-3 bg-gradient-rose text-white rounded-full hover:shadow-lg transition-all"
            >
              Conditions de Vente
              <ArrowLeft className="w-4 h-4 ml-2 rotate-180" aria-hidden="true" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

