'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { 
  Accessibility, 
  Moon, 
  Sun, 
  Type, 
  Eye, 
  Volume2, 
  RotateCcw, 
  Settings,
  X,
  Minus,
  Plus,
  Contrast,
  Zap
} from 'lucide-react';
import { useAccessibility } from './AccessibilityProvider';

export function AccessibilityToolbar() {
  const [isOpen, setIsOpen] = useState(false);
  const {
    settings,
    toggleDarkMode,
    setFontSize,
    toggleHighContrast,
    toggleReducedMotion,
    toggleScreenReader,
    resetSettings,
  } = useAccessibility();

  const fontSizes = [
    { value: 'small' as const, label: 'Petit', icon: 'A-' },
    { value: 'medium' as const, label: 'Normal', icon: 'A' },
    { value: 'large' as const, label: 'Grand', icon: 'A+' },
    { value: 'xl' as const, label: 'Très Grand', icon: 'A++' },
  ];

  return (
    <>
      {/* Bouton d'ouverture */}
      <div className="fixed bottom-6 right-6 z-50">
        <Button
          onClick={() => setIsOpen(true)}
          className="w-14 h-14 rounded-full bg-gradient-rose text-white shadow-rose hover:opacity-90 transition-all duration-300"
          aria-label="Ouvrir les options d'accessibilité"
        >
          <Accessibility className="w-6 h-6" />
        </Button>
      </div>

      {/* Toolbar */}
      {isOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm">
          <div className="fixed bottom-6 right-6 w-80 bg-white dark:bg-gray-900 rounded-3xl shadow-2xl border border-rose-powder/30 dark:border-gray-700">
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-rose-powder/20 dark:border-gray-700">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-rose rounded-full flex items-center justify-center">
                  <Accessibility className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="font-playfair text-lg font-bold text-charcoal dark:text-white">
                    Accessibilité
                  </h3>
                  <p className="text-xs text-charcoal/70 dark:text-gray-400">
                    Personnalisez votre expérience
                  </p>
                </div>
              </div>
              <Button
                onClick={() => setIsOpen(false)}
                variant="ghost"
                size="sm"
                className="text-charcoal/70 dark:text-gray-400 hover:text-charcoal dark:hover:text-white"
                aria-label="Fermer les options d'accessibilité"
              >
                <X className="w-5 h-5" />
              </Button>
            </div>

            {/* Options */}
            <div className="p-6 space-y-6 max-h-96 overflow-y-auto">
              {/* Mode sombre */}
              <div className="space-y-3">
                <h4 className="font-semibold text-charcoal dark:text-white flex items-center space-x-2">
                  {settings.darkMode ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
                  <span>Thème</span>
                </h4>
                <Button
                  onClick={toggleDarkMode}
                  className={`w-full justify-start space-x-3 ${
                    settings.darkMode
                      ? 'bg-gradient-rose text-white'
                      : 'bg-gray-100 dark:bg-gray-800 text-charcoal dark:text-white hover:bg-gray-200 dark:hover:bg-gray-700'
                  }`}
                >
                  {settings.darkMode ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
                  <span>{settings.darkMode ? 'Mode Sombre' : 'Mode Clair'}</span>
                </Button>
              </div>

              {/* Taille de police */}
              <div className="space-y-3">
                <h4 className="font-semibold text-charcoal dark:text-white flex items-center space-x-2">
                  <Type className="w-4 h-4" />
                  <span>Taille du Texte</span>
                </h4>
                <div className="grid grid-cols-2 gap-2">
                  {fontSizes.map((size) => (
                    <Button
                      key={size.value}
                      onClick={() => setFontSize(size.value)}
                      className={`text-xs ${
                        settings.fontSize === size.value
                          ? 'bg-gradient-rose text-white'
                          : 'bg-gray-100 dark:bg-gray-800 text-charcoal dark:text-white hover:bg-gray-200 dark:hover:bg-gray-700'
                      }`}
                    >
                      {size.label}
                    </Button>
                  ))}
                </div>
              </div>

              {/* Contraste élevé */}
              <div className="space-y-3">
                <h4 className="font-semibold text-charcoal dark:text-white flex items-center space-x-2">
                  <Contrast className="w-4 h-4" />
                  <span>Contraste</span>
                </h4>
                <Button
                  onClick={toggleHighContrast}
                  className={`w-full justify-start space-x-3 ${
                    settings.highContrast
                      ? 'bg-gradient-rose text-white'
                      : 'bg-gray-100 dark:bg-gray-800 text-charcoal dark:text-white hover:bg-gray-200 dark:hover:bg-gray-700'
                  }`}
                >
                  <Contrast className="w-4 h-4" />
                  <span>Contraste Élevé</span>
                </Button>
              </div>

              {/* Mouvement réduit */}
              <div className="space-y-3">
                <h4 className="font-semibold text-charcoal dark:text-white flex items-center space-x-2">
                  <Zap className="w-4 h-4" />
                  <span>Animations</span>
                </h4>
                <Button
                  onClick={toggleReducedMotion}
                  className={`w-full justify-start space-x-3 ${
                    settings.reducedMotion
                      ? 'bg-gradient-rose text-white'
                      : 'bg-gray-100 dark:bg-gray-800 text-charcoal dark:text-white hover:bg-gray-200 dark:hover:bg-gray-700'
                  }`}
                >
                  <Zap className="w-4 h-4" />
                  <span>Réduire les Animations</span>
                </Button>
              </div>

              {/* Mode lecteur d'écran */}
              <div className="space-y-3">
                <h4 className="font-semibold text-charcoal dark:text-white flex items-center space-x-2">
                  <Volume2 className="w-4 h-4" />
                  <span>Lecteur d'Écran</span>
                </h4>
                <Button
                  onClick={toggleScreenReader}
                  className={`w-full justify-start space-x-3 ${
                    settings.screenReader
                      ? 'bg-gradient-rose text-white'
                      : 'bg-gray-100 dark:bg-gray-800 text-charcoal dark:text-white hover:bg-gray-200 dark:hover:bg-gray-700'
                  }`}
                >
                  <Volume2 className="w-4 h-4" />
                  <span>Mode Lecteur d'Écran</span>
                </Button>
              </div>
            </div>

            {/* Footer */}
            <div className="p-6 border-t border-rose-powder/20 dark:border-gray-700">
              <Button
                onClick={resetSettings}
                variant="outline"
                className="w-full text-charcoal dark:text-white border-rose-powder/30 dark:border-gray-600 hover:bg-rose-powder/10 dark:hover:bg-gray-800"
              >
                <RotateCcw className="w-4 h-4 mr-2" />
                Réinitialiser
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

