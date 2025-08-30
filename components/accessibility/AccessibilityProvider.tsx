'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

interface AccessibilitySettings {
  darkMode: boolean;
  fontSize: 'small' | 'medium' | 'large' | 'xl';
  highContrast: boolean;
  reducedMotion: boolean;
  screenReader: boolean;
}

interface AccessibilityContextType {
  settings: AccessibilitySettings;
  toggleDarkMode: () => void;
  setFontSize: (size: AccessibilitySettings['fontSize']) => void;
  toggleHighContrast: () => void;
  toggleReducedMotion: () => void;
  toggleScreenReader: () => void;
  resetSettings: () => void;
}

const defaultSettings: AccessibilitySettings = {
  darkMode: false,
  fontSize: 'medium',
  highContrast: false,
  reducedMotion: false,
  screenReader: false,
};

const AccessibilityContext = createContext<AccessibilityContextType | undefined>(undefined);

export function AccessibilityProvider({ children }: { children: React.ReactNode }) {
  const [settings, setSettings] = useState<AccessibilitySettings>(defaultSettings);

  // Charger les préférences sauvegardées
  useEffect(() => {
    const saved = localStorage.getItem('accessibility-settings');
    if (saved) {
      try {
        const parsedSettings = JSON.parse(saved);
        setSettings(parsedSettings);
      } catch (error) {
        console.error('Erreur lors du chargement des préférences d\'accessibilité:', error);
      }
    } else {
      // Détecter les préférences système
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      
      setSettings(prev => ({
        ...prev,
        darkMode: prefersDark,
        reducedMotion: prefersReducedMotion,
      }));
    }
  }, []);

  // Sauvegarder les préférences
  useEffect(() => {
    localStorage.setItem('accessibility-settings', JSON.stringify(settings));
  }, [settings]);

  // Appliquer les classes CSS
  useEffect(() => {
    const root = document.documentElement;
    
    // Mode sombre
    if (settings.darkMode) {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }

    // Taille de police
    root.classList.remove('text-sm', 'text-base', 'text-lg', 'text-xl');
    switch (settings.fontSize) {
      case 'small':
        root.classList.add('text-sm');
        break;
      case 'medium':
        root.classList.add('text-base');
        break;
      case 'large':
        root.classList.add('text-lg');
        break;
      case 'xl':
        root.classList.add('text-xl');
        break;
    }

    // Contraste élevé
    if (settings.highContrast) {
      root.classList.add('high-contrast');
    } else {
      root.classList.remove('high-contrast');
    }

    // Mouvement réduit
    if (settings.reducedMotion) {
      root.classList.add('reduce-motion');
    } else {
      root.classList.remove('reduce-motion');
    }

    // Screen reader
    if (settings.screenReader) {
      root.classList.add('screen-reader-mode');
    } else {
      root.classList.remove('screen-reader-mode');
    }
  }, [settings]);

  const toggleDarkMode = () => {
    setSettings(prev => ({ ...prev, darkMode: !prev.darkMode }));
  };

  const setFontSize = (size: AccessibilitySettings['fontSize']) => {
    setSettings(prev => ({ ...prev, fontSize: size }));
  };

  const toggleHighContrast = () => {
    setSettings(prev => ({ ...prev, highContrast: !prev.highContrast }));
  };

  const toggleReducedMotion = () => {
    setSettings(prev => ({ ...prev, reducedMotion: !prev.reducedMotion }));
  };

  const toggleScreenReader = () => {
    setSettings(prev => ({ ...prev, screenReader: !prev.screenReader }));
  };

  const resetSettings = () => {
    setSettings(defaultSettings);
  };

  const value: AccessibilityContextType = {
    settings,
    toggleDarkMode,
    setFontSize,
    toggleHighContrast,
    toggleReducedMotion,
    toggleScreenReader,
    resetSettings,
  };

  return (
    <AccessibilityContext.Provider value={value}>
      {children}
    </AccessibilityContext.Provider>
  );
}

export function useAccessibility() {
  const context = useContext(AccessibilityContext);
  if (context === undefined) {
    throw new Error('useAccessibility must be used within an AccessibilityProvider');
  }
  return context;
}

