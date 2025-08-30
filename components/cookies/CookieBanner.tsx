'use client';

import { useState } from 'react';
import { X, Settings, Shield, Eye, Target, Palette } from 'lucide-react';
import { useCookieConsent, CookieConsent } from '@/lib/hooks/useCookieConsent';

export default function CookieBanner() {
  const { 
    showBanner, 
    acceptAll, 
    rejectAll, 
    acceptSelected 
  } = useCookieConsent();
  
  const [showDetails, setShowDetails] = useState(false);
  const [selectedConsent, setSelectedConsent] = useState<Partial<CookieConsent>>({
    analytics: false,
    marketing: false,
    preferences: false,
  });

  if (!showBanner) return null;

  const handleToggleConsent = (type: keyof CookieConsent) => {
    if (type === 'necessary') return; // Ne peut pas être désactivé
    
    setSelectedConsent(prev => ({
      ...prev,
      [type]: !prev[type],
    }));
  };

  const handleAcceptSelected = () => {
    acceptSelected(selectedConsent);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center p-4 bg-black/20 backdrop-blur-sm">
      <div className="w-full max-w-4xl bg-white dark:bg-gray-900 rounded-2xl shadow-2xl border border-rose-200 dark:border-rose-800">
        {!showDetails ? (
          // Vue simple
          <div className="p-6">
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-rose-400 to-magenta-600 rounded-xl flex items-center justify-center">
                <Shield className="w-6 h-6 text-white" />
              </div>
              
              <div className="flex-1">
                <h3 className="text-xl font-playfair font-bold text-gray-900 dark:text-white mb-3">
                  Nous respectons votre vie privée
                </h3>
                
                <p className="text-gray-600 dark:text-gray-300 mb-6 leading-relaxed">
                  Nous utilisons des cookies pour améliorer votre expérience sur notre site, 
                  analyser le trafic et personnaliser le contenu. Vous pouvez choisir quels 
                  cookies accepter ou tout refuser.
                </p>
                
                <div className="flex flex-wrap gap-3">
                  <button
                    onClick={acceptAll}
                    className="px-6 py-3 bg-gradient-to-r from-rose-500 to-magenta-600 text-white rounded-xl font-semibold hover:from-rose-600 hover:to-magenta-700 transition-all duration-300 shadow-lg hover:shadow-xl"
                  >
                    Tout accepter
                  </button>
                  
                  <button
                    onClick={rejectAll}
                    className="px-6 py-3 border-2 border-rose-300 dark:border-rose-700 text-rose-600 dark:text-rose-400 rounded-xl font-semibold hover:bg-rose-50 dark:hover:bg-rose-900/20 transition-all duration-300"
                  >
                    Tout refuser
                  </button>
                  
                  <button
                    onClick={() => setShowDetails(true)}
                    className="px-6 py-3 text-gray-600 dark:text-gray-300 hover:text-rose-600 dark:hover:text-rose-400 font-semibold transition-colors duration-300 flex items-center gap-2"
                  >
                    <Settings className="w-4 h-4" />
                    Personnaliser
                  </button>
                </div>
              </div>
            </div>
          </div>
        ) : (
          // Vue détaillée
          <div className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-playfair font-bold text-gray-900 dark:text-white">
                Paramètres des cookies
              </h3>
              <button
                onClick={() => setShowDetails(false)}
                className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-6 mb-8">
              {/* Cookies nécessaires */}
              <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-xl">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <Shield className="w-5 h-5 text-green-600" />
                    <h4 className="font-semibold text-gray-900 dark:text-white">
                      Cookies nécessaires
                    </h4>
                  </div>
                  <div className="w-12 h-6 bg-green-500 rounded-full flex items-center justify-end px-1">
                    <div className="w-4 h-4 bg-white rounded-full"></div>
                  </div>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  Ces cookies sont essentiels au fonctionnement du site et ne peuvent pas être désactivés. 
                  Ils incluent les cookies de session, de sécurité et d'accessibilité.
                </p>
              </div>

              {/* Cookies analytiques */}
              <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-xl">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <Eye className="w-5 h-5 text-blue-600" />
                    <h4 className="font-semibold text-gray-900 dark:text-white">
                      Cookies analytiques
                    </h4>
                  </div>
                  <button
                    onClick={() => handleToggleConsent('analytics')}
                    className={`w-12 h-6 rounded-full flex items-center px-1 transition-colors ${
                      selectedConsent.analytics 
                        ? 'bg-rose-500 justify-end' 
                        : 'bg-gray-300 dark:bg-gray-600 justify-start'
                    }`}
                  >
                    <div className="w-4 h-4 bg-white rounded-full"></div>
                  </button>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  Ces cookies nous aident à comprendre comment vous utilisez notre site 
                  via Google Analytics. Aucune donnée personnelle n'est collectée.
                </p>
              </div>

              {/* Cookies marketing */}
              <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-xl">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <Target className="w-5 h-5 text-orange-600" />
                    <h4 className="font-semibold text-gray-900 dark:text-white">
                      Cookies marketing
                    </h4>
                  </div>
                  <button
                    onClick={() => handleToggleConsent('marketing')}
                    className={`w-12 h-6 rounded-full flex items-center px-1 transition-colors ${
                      selectedConsent.marketing 
                        ? 'bg-rose-500 justify-end' 
                        : 'bg-gray-300 dark:bg-gray-600 justify-start'
                    }`}
                  >
                    <div className="w-4 h-4 bg-white rounded-full"></div>
                  </button>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  Ces cookies permettent de vous proposer des publicités personnalisées 
                  et de mesurer l'efficacité de nos campagnes marketing.
                </p>
              </div>

              {/* Cookies de préférences */}
              <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-xl">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <Palette className="w-5 h-5 text-purple-600" />
                    <h4 className="font-semibold text-gray-900 dark:text-white">
                      Cookies de préférences
                    </h4>
                  </div>
                  <button
                    onClick={() => handleToggleConsent('preferences')}
                    className={`w-12 h-6 rounded-full flex items-center px-1 transition-colors ${
                      selectedConsent.preferences 
                        ? 'bg-rose-500 justify-end' 
                        : 'bg-gray-300 dark:bg-gray-600 justify-start'
                    }`}
                  >
                    <div className="w-4 h-4 bg-white rounded-full"></div>
                  </button>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  Ces cookies mémorisent vos préférences (thème, langue, taille de police) 
                  pour améliorer votre expérience lors de vos prochaines visites.
                </p>
              </div>
            </div>

            <div className="flex flex-wrap gap-3 pt-4 border-t border-gray-200 dark:border-gray-700">
              <button
                onClick={handleAcceptSelected}
                className="px-6 py-3 bg-gradient-to-r from-rose-500 to-magenta-600 text-white rounded-xl font-semibold hover:from-rose-600 hover:to-magenta-700 transition-all duration-300 shadow-lg hover:shadow-xl"
              >
                Enregistrer mes préférences
              </button>
              
              <button
                onClick={acceptAll}
                className="px-6 py-3 border-2 border-rose-300 dark:border-rose-700 text-rose-600 dark:text-rose-400 rounded-xl font-semibold hover:bg-rose-50 dark:hover:bg-rose-900/20 transition-all duration-300"
              >
                Tout accepter
              </button>
              
              <button
                onClick={rejectAll}
                className="px-6 py-3 text-gray-600 dark:text-gray-300 hover:text-rose-600 dark:hover:text-rose-400 font-semibold transition-colors duration-300"
              >
                Tout refuser
              </button>
            </div>

            <p className="text-xs text-gray-500 dark:text-gray-400 mt-4">
              Vous pouvez modifier ces paramètres à tout moment en consultant notre{' '}
              <a href="/politique-cookies" className="text-rose-600 hover:text-rose-700 underline">
                politique de cookies
              </a>
              .
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

