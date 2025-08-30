'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { CheckCircle, Download, Mail, Phone, Calendar, ArrowRight } from 'lucide-react';

interface SessionData {
  id: string;
  status: string;
  payment_status: string;
  customer_email: string;
  customer_name: string;
  amount_total: number;
  currency: string;
  metadata: {
    package_name?: string;
    package_id?: string;
  };
}

export default function SuccessPage() {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get('session_id');
  const [session, setSession] = useState<SessionData | null>(null);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    if (sessionId) {
      fetchSession();
    }
  }, [sessionId]);

  const fetchSession = async () => {
    try {
      const response = await fetch(`/api/stripe/checkout?session_id=${sessionId}`);
      if (response.ok) {
        const data = await response.json();
        setSession(data);
      }
    } catch (error) {
      console.error('Erreur récupération session:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-cream via-rose-50 to-magenta-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-rose-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Vérification de votre paiement...</p>
        </div>
      </div>
    );
  }

  if (!session || session.payment_status !== 'paid') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-cream via-rose-50 to-magenta-50 flex items-center justify-center p-4">
        <div className="text-center max-w-md">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-red-600 text-2xl">❌</span>
          </div>
          <h1 className="text-2xl font-playfair font-bold text-gray-900 mb-4">
            Paiement non confirmé
          </h1>
          <p className="text-gray-600 mb-6">
            Nous n'avons pas pu confirmer votre paiement. Veuillez réessayer ou nous contacter.
          </p>
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-rose-500 to-magenta-600 text-white rounded-xl font-semibold hover:from-rose-600 hover:to-magenta-700 transition-all duration-300"
          >
            Retour à l'accueil
          </Link>
        </div>
      </div>
    );
  }

  const packageName = session.metadata?.package_name || 'votre package';
  const amount = (session.amount_total / 100).toLocaleString('fr-FR', {
    style: 'currency',
    currency: 'EUR',
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-cream via-rose-50 to-magenta-50">
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          {/* En-tête de succès */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-green-400 to-green-600 rounded-full mb-6">
              <CheckCircle className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-4xl font-playfair font-bold text-gray-900 mb-4">
              Paiement confirmé ! 🎉
            </h1>
            <p className="text-xl text-gray-600 mb-2">
              Merci {session.customer_name} pour votre commande
            </p>
            <p className="text-lg text-gray-500">
              Package <strong>{packageName}</strong> - {amount}
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-8">
            {/* Informations de commande */}
            <div className="bg-white rounded-2xl shadow-xl border border-rose-100 p-8">
              <h2 className="text-2xl font-playfair font-bold text-gray-900 mb-6">
                Détails de votre commande
              </h2>
              
              <div className="space-y-4">
                <div className="flex justify-between items-center py-3 border-b border-gray-100">
                  <span className="text-gray-600">Package</span>
                  <span className="font-semibold">{packageName}</span>
                </div>
                <div className="flex justify-between items-center py-3 border-b border-gray-100">
                  <span className="text-gray-600">Montant</span>
                  <span className="font-semibold text-green-600">{amount}</span>
                </div>
                <div className="flex justify-between items-center py-3 border-b border-gray-100">
                  <span className="text-gray-600">Email</span>
                  <span className="font-semibold">{session.customer_email}</span>
                </div>
                <div className="flex justify-between items-center py-3">
                  <span className="text-gray-600">ID de transaction</span>
                  <span className="font-mono text-sm text-gray-500">{session.id}</span>
                </div>
              </div>

              <div className="mt-8 p-4 bg-green-50 border border-green-200 rounded-xl">
                <p className="text-green-800 text-sm">
                  ✅ Un email de confirmation a été envoyé à <strong>{session.customer_email}</strong>
                </p>
              </div>
            </div>

            {/* Prochaines étapes */}
            <div className="bg-white rounded-2xl shadow-xl border border-rose-100 p-8">
              <h2 className="text-2xl font-playfair font-bold text-gray-900 mb-6">
                Prochaines étapes
              </h2>

              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="w-8 h-8 bg-rose-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-rose-600 font-bold text-sm">1</span>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1">Formulaire de projet</h3>
                    <p className="text-gray-600 text-sm mb-3">
                      Remplissez le formulaire détaillé pour nous donner toutes les informations sur votre projet.
                    </p>
                    <button
                      onClick={() => setShowForm(true)}
                      className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-rose-500 to-magenta-600 text-white rounded-lg text-sm font-semibold hover:from-rose-600 hover:to-magenta-700 transition-all duration-300"
                    >
                      Remplir maintenant
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-8 h-8 bg-rose-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-rose-600 font-bold text-sm">2</span>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1">Prise de contact</h3>
                    <p className="text-gray-600 text-sm">
                      Nous vous contacterons sous 24h pour planifier notre premier appel de découverte.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-8 h-8 bg-rose-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-rose-600 font-bold text-sm">3</span>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1">Début du projet</h3>
                    <p className="text-gray-600 text-sm">
                      Lancement officiel de votre projet avec accès à votre espace client dédié.
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-8 p-4 bg-blue-50 border border-blue-200 rounded-xl">
                <h4 className="font-semibold text-blue-900 mb-2">Besoin d'aide ?</h4>
                <div className="flex flex-col sm:flex-row gap-3">
                  <a
                    href="mailto:contact@salwadevstudio.com"
                    className="inline-flex items-center gap-2 text-blue-700 hover:text-blue-800 text-sm"
                  >
                    <Mail className="w-4 h-4" />
                    contact@salwadevstudio.com
                  </a>
                  <a
                    href="tel:+33123456789"
                    className="inline-flex items-center gap-2 text-blue-700 hover:text-blue-800 text-sm"
                  >
                    <Phone className="w-4 h-4" />
                    +33 1 23 45 67 89
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="text-center mt-12">
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={() => setShowForm(true)}
                className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-rose-500 to-magenta-600 text-white rounded-xl font-semibold hover:from-rose-600 hover:to-magenta-700 transition-all duration-300 shadow-lg hover:shadow-xl"
              >
                <Calendar className="w-5 h-5" />
                Commencer mon projet
              </button>
              
              <Link
                href="/"
                className="inline-flex items-center gap-2 px-8 py-4 border-2 border-rose-300 text-rose-600 rounded-xl font-semibold hover:bg-rose-50 transition-all duration-300"
              >
                Retour à l'accueil
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Modal formulaire projet */}
      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-8">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-2xl font-playfair font-bold text-gray-900">
                  Détails de votre projet
                </h3>
                <button
                  onClick={() => setShowForm(false)}
                  className="text-gray-400 hover:text-gray-600 text-2xl"
                >
                  ×
                </button>
              </div>
              
              <p className="text-gray-600 mb-6">
                Pour créer le site parfait pour vous, nous avons besoin de quelques informations supplémentaires.
              </p>

              {/* Formulaire détaillé */}
              <form className="space-y-6">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Nom de votre entreprise
                    </label>
                    <input
                      type="text"
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-rose-500 focus:border-transparent"
                      placeholder="Mon Entreprise"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Secteur d'activité
                    </label>
                    <select className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-rose-500 focus:border-transparent">
                      <option>Sélectionner...</option>
                      <option>Commerce/Retail</option>
                      <option>Services</option>
                      <option>Restaurant/Hôtellerie</option>
                      <option>Santé/Bien-être</option>
                      <option>Éducation/Formation</option>
                      <option>Technologie</option>
                      <option>Autre</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Décrivez votre projet en détail
                  </label>
                  <textarea
                    rows={4}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-rose-500 focus:border-transparent"
                    placeholder="Objectifs, public cible, fonctionnalités souhaitées..."
                  ></textarea>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Avez-vous déjà un site web ?
                  </label>
                  <div className="flex gap-4">
                    <label className="flex items-center">
                      <input type="radio" name="existing_site" value="yes" className="mr-2" />
                      Oui
                    </label>
                    <label className="flex items-center">
                      <input type="radio" name="existing_site" value="no" className="mr-2" />
                      Non
                    </label>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Sites web que vous aimez (inspiration)
                  </label>
                  <input
                    type="text"
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-rose-500 focus:border-transparent"
                    placeholder="https://exemple1.com, https://exemple2.com"
                  />
                </div>

                <div className="flex gap-4">
                  <button
                    type="button"
                    onClick={() => setShowForm(false)}
                    className="flex-1 px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-xl font-semibold hover:bg-gray-50 transition-all duration-300"
                  >
                    Plus tard
                  </button>
                  <button
                    type="submit"
                    className="flex-1 px-6 py-3 bg-gradient-to-r from-rose-500 to-magenta-600 text-white rounded-xl font-semibold hover:from-rose-600 hover:to-magenta-700 transition-all duration-300"
                  >
                    Envoyer
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

