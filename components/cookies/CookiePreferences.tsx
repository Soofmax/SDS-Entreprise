'use client';

import { useState } from 'react';
import { Settings, Shield, Eye, Target, Palette, RefreshCw } from 'lucide-react';
import { useCookieConsent, CookieConsent } from '@/lib/hooks/useCookieConsent';

interface CookiePreferencesProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function CookiePreferences({ isOpen, onClose }: CookiePreferencesProps) {
  const { 
    consent, 
    acceptAll, 
    rejectAll, 
    acceptSelected,
    resetConsent 
  } = useCookieConsent();
  
  const [selectedConsent, setSelectedConsent] = useState<Partial<CookieConsent>>({
    analytics: consent?.analytics || false,
    marketing: consent?.marketing || false,
    preferences: consent?.preferences || false,
  });

  if (!isOpen) return null;

  const handleToggleConsent = (type: keyof CookieConsent) => {
    if (type === 'necessary') return; // Ne peut pas être désactivé
    
    setSelectedConsent(prev => ({
      ...prev,
      [type]: !prev[type],
    }));
  };

  const handleAcceptSelected = () => {
    acceptSelected(selectedConsent);
    onClose();
  };

  const handleAcceptAll = () => {
    acceptAll();
    onClose();
  };

  const handleRejectAll = () => {
    rejectAll();
    onClose();
  };

  const handleReset = () => {
    resetConsent();
    setSelectedConsent({
      analytics: false,
      marketing: false,
      preferences: false,
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="w-full max-w-2xl bg-white dark:bg-gray-900 rounded-2xl shadow-2xl border border-rose-200 dark:border-rose-800 max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-rose-400 to-magenta-600 rounded-xl flex items-center justify-center">
                <Settings className="w-5 h-5 text-white" />
              </div>
              <h2 className="text-2xl font-playfair font-bold text-gray-900 dark:text-white">
                Préférences des cookies
              </h2>
            </div>
            <button
              onClick={onClose}
              className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800"
            >
              ✕
            </button>
          </div>

          <div className="space-y-4 mb-8">
            {/* Cookies nécessaires */}
            <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-xl border border-green-200 dark:border-green-800">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  <Shield className="w-5 h-5 text-green-600" />
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-white">
                      Cookies nécessaires
                    </h3>
                    <p className="text-sm text-green-700 dark:text-green-300">
                      Toujours actifs
                    </p>
                  </div>
                </div>
                <div className="w-12 h-6 bg-green-500 rounded-full flex items-center justify-end px-1">
                  <div className="w-4 h-4 bg-white rounded-full shadow-sm"></div>
                </div>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                Ces cookies sont indispensables au bon fonctionnement du site. 
                Ils incluent les cookies de session, de sécurité et d'accessibilité.
              </p>
              <div className="mt-2 text-xs text-gray-500 dark:text-gray-400">
                Exemples : authentification, panier, préférences de langue
              </div>
            </div>

            {/* Cookies analytiques */}
            <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  <Eye className="w-5 h-5 text-blue-600" />
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-white">
                      Cookies analytiques
                    </h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Google Analytics 4
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => handleToggleConsent('analytics')}
                  className={`w-12 h-6 rounded-full flex items-center px-1 transition-all duration-300 ${
                    selectedConsent.analytics 
                      ? 'bg-rose-500 justify-end' 
                      : 'bg-gray-300 dark:bg-gray-600 justify-start'
                  }`}
                >
                  <div className="w-4 h-4 bg-white rounded-full shadow-sm"></div>
                </button>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">
                Nous aident à comprendre comment vous naviguez sur notre site pour l'améliorer.
              </p>
              <div className="text-xs text-gray-500 dark:text-gray-400">
                <strong>Données collectées :</strong> Pages visitées, temps passé, interactions<br/>
                <strong>Finalité :</strong> Amélioration de l'expérience utilisateur<br/>
                <strong>Durée :</strong> 26 mois
              </div>
            </div>

            {/* Cookies marketing */}
            <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  <Target className="w-5 h-5 text-orange-600" />
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-white">
                      Cookies marketing
                    </h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Publicité personnalisée
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => handleToggleConsent('marketing')}
                  className={`w-12 h-6 rounded-full flex items-center px-1 transition-all duration-300 ${
                    selectedConsent.marketing 
                      ? 'bg-rose-500 justify-end' 
                      : 'bg-gray-300 dark:bg-gray-600 justify-start'
                  }`}
                >
                  <div className="w-4 h-4 bg-white rounded-full shadow-sm"></div>
                </button>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">
                Permettent de vous proposer des publicités pertinentes sur d'autres sites.
              </p>
              <div className="text-xs text-gray-500 dark:text-gray-400">
                <strong>Données collectées :</strong> Centres d'intérêt, comportement de navigation<br/>
                <strong>Finalité :</strong> Publicité ciblée et mesure de performance<br/>
                <strong>Durée :</strong> 13 mois
              </div>
            </div>

            {/* Cookies de préférences */}
            <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  <Palette className="w-5 h-5 text-purple-600" />
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-white">
                      Cookies de préférences
                    </h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Personnalisation
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => handleToggleConsent('preferences')}
                  className={`w-12 h-6 rounded-full flex items-center px-1 transition-all duration-300 ${
                    selectedConsent.preferences 
                      ? 'bg-rose-500 justify-end' 
                      : 'bg-gray-300 dark:bg-gray-600 justify-start'
                  }`}
                >
                  <div className="w-4 h-4 bg-white rounded-full shadow-sm"></div>
                </button>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">
                Mémorisent vos préférences pour une expérience personnalisée.
              </p>
              <div className="text-xs text-gray-500 dark:text-gray-400">
                <strong>Données collectées :</strong> Thème, langue, taille de police<br/>
                <strong>Finalité :</strong> Amélioration de l'expérience utilisateur<br/>
                <strong>Durée :</strong> 12 mois
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-wrap gap-3 pt-4 border-t border-gray-200 dark:border-gray-700">
            <button
              onClick={handleAcceptSelected}
              className="px-6 py-3 bg-gradient-to-r from-rose-500 to-magenta-600 text-white rounded-xl font-semibold hover:from-rose-600 hover:to-magenta-700 transition-all duration-300 shadow-lg hover:shadow-xl"
            >
              Enregistrer
            </button>
            
            <button
              onClick={handleAcceptAll}
              className="px-6 py-3 border-2 border-rose-300 dark:border-rose-700 text-rose-600 dark:text-rose-400 rounded-xl font-semibold hover:bg-rose-50 dark:hover:bg-rose-900/20 transition-all duration-300"
            >
              Tout accepter
            </button>
            
            <button
              onClick={handleRejectAll}
              className="px-6 py-3 text-gray-600 dark:text-gray-300 hover:text-rose-600 dark:hover:text-rose-400 font-semibold transition-colors duration-300"
            >
              Tout refuser
            </button>

            <button
              onClick={handleReset}
              className="px-4 py-3 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors duration-300 flex items-center gap-2"
            >
              <RefreshCw className="w-4 h-4" />
              Réinitialiser
            </button>
          </div>

          <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
            <p className="text-sm text-blue-800 dark:text-blue-200">
              <strong>Vos droits RGPD :</strong> Vous pouvez à tout moment accéder, rectifier, 
              supprimer vos données ou vous opposer à leur traitement. 
              <a href="/politique-confidentialite" className="underline hover:no-underline">
                En savoir plus
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

