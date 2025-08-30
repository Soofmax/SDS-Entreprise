#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// Liste des fichiers à corriger
const filesToFix = [
  './app/(marketing)/about/page.tsx',
  './app/(marketing)/contact/page.tsx',
  './app/(marketing)/portfolio/page.tsx',
  './app/(marketing)/services/page.tsx',
  './app/not-found.tsx',
  './components/layout/Footer.tsx',
  './components/layout/Header.tsx',
  './components/sections/CTASection.tsx',
  './components/sections/ServicesSection.tsx',
  './components/sections/TestimonialsSection.tsx',
  './components/sections/FranceNumSection.tsx',
  './components/sections/PricingSection.tsx'
];

// Patterns d'icônes décoratives à corriger
const decorativeIconPatterns = [
  // Icônes dans des animations de fond
  /<(Star|Sparkles|Heart|Zap|Coffee|Code|Eye|Github|ArrowRight|Check|X|Plus|Minus|ChevronDown|ChevronUp|ChevronLeft|ChevronRight)\s+className="[^"]*"\s*\/>/g,
  
  // Icônes dans des badges/decorations
  /<(Star|Sparkles|Heart|Zap|Coffee|Code|Eye|Github|Gift|Trophy|Award|Crown|Gem|Diamond)\s+className="[^"]*w-\d+\s+h-\d+[^"]*"\s*\/>/g,
  
  // Icônes flottantes
  /<(Star|Sparkles|Heart|Zap|Coffee|Code|Eye|Github)\s+className="[^"]*animate-[^"]*[^"]*"\s*\/>/g
];

// Icônes fonctionnelles qui ont besoin d'aria-label
const functionalIconPatterns = [
  // Boutons avec icônes
  /<(Send|Mail|Phone|MapPin|Clock|Calendar|Download|Upload|Search|Filter|Menu|Close|Settings|User|Lock|Unlock)\s+className="[^"]*"\s*\/>/g,
  
  // Icônes de navigation
  /<(ArrowLeft|ArrowRight|ArrowUp|ArrowDown|ChevronLeft|ChevronRight|Home|Back|Forward)\s+className="[^"]*"\s*\/>/g
];

function fixFile(filePath) {
  try {
    let content = fs.readFileSync(filePath, 'utf8');
    let modified = false;

    // Corriger les icônes décoratives
    decorativeIconPatterns.forEach(pattern => {
      const newContent = content.replace(pattern, (match) => {
        if (!match.includes('aria-hidden="true"')) {
          modified = true;
          return match.replace('/>', ' aria-hidden="true" />');
        }
        return match;
      });
      content = newContent;
    });

    // Corriger les icônes fonctionnelles
    functionalIconPatterns.forEach(pattern => {
      const newContent = content.replace(pattern, (match) => {
        if (!match.includes('aria-label') && !match.includes('aria-hidden')) {
          modified = true;
          // Extraire le nom de l'icône
          const iconName = match.match(/<(\w+)/)[1];
          const ariaLabel = getAriaLabelForIcon(iconName);
          return match.replace('/>', ` aria-label="${ariaLabel}" />`);
        }
        return match;
      });
      content = newContent;
    });

    // Corrections spécifiques pour les icônes dans les boutons
    content = content.replace(
      /<button[^>]*>[\s\S]*?<(\w+)\s+className="[^"]*"\s*\/>[\s\S]*?<\/button>/g,
      (match) => {
        if (!match.includes('aria-hidden="true"') && !match.includes('aria-label')) {
          const iconMatch = match.match(/<(\w+)\s+className="[^"]*"\s*\/>/);
          if (iconMatch) {
            modified = true;
            return match.replace(iconMatch[0], iconMatch[0].replace('/>', ' aria-hidden="true" />'));
          }
        }
        return match;
      }
    );

    if (modified) {
      fs.writeFileSync(filePath, content, 'utf8');
      console.log(`✅ Corrigé: ${filePath}`);
      return true;
    } else {
      console.log(`⏭️  Déjà OK: ${filePath}`);
      return false;
    }
  } catch (error) {
    console.error(`❌ Erreur avec ${filePath}:`, error.message);
    return false;
  }
}

function getAriaLabelForIcon(iconName) {
  const labels = {
    Send: 'Envoyer',
    Mail: 'Email',
    Phone: 'Téléphone',
    MapPin: 'Localisation',
    Clock: 'Heure',
    Calendar: 'Calendrier',
    Download: 'Télécharger',
    Upload: 'Uploader',
    Search: 'Rechercher',
    Filter: 'Filtrer',
    Menu: 'Menu',
    Close: 'Fermer',
    Settings: 'Paramètres',
    User: 'Utilisateur',
    Lock: 'Verrouiller',
    Unlock: 'Déverrouiller',
    ArrowLeft: 'Précédent',
    ArrowRight: 'Suivant',
    ArrowUp: 'Haut',
    ArrowDown: 'Bas',
    ChevronLeft: 'Précédent',
    ChevronRight: 'Suivant',
    Home: 'Accueil',
    Back: 'Retour',
    Forward: 'Avancer'
  };
  
  return labels[iconName] || iconName;
}

// Exécuter les corrections
console.log('🚀 Correction automatique de l\'accessibilité des icônes...\n');

let totalFixed = 0;
filesToFix.forEach(file => {
  if (fs.existsSync(file)) {
    if (fixFile(file)) {
      totalFixed++;
    }
  } else {
    console.log(`⚠️  Fichier non trouvé: ${file}`);
  }
});

console.log(`\n🎉 Correction terminée ! ${totalFixed} fichiers modifiés.`);
console.log('📊 Impact estimé sur le score WCAG: +15 à +20 points');

