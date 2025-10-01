// Fichier: app/layout.tsx

import './globals.css';
import type { Metadata } from 'next';
import { Providers } from './providers';
import { Toaster } from 'sonner';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { CookieBanner } from '@/components/layout/CookieBanner'; // <-- 1. Importer la bannière
import { AccessibilityProvider } from '@/components/accessibility/AccessibilityProvider';
import { AccessibilityToolbar } from '@/components/accessibility/AccessibilityToolbar';
import GoogleAnalytics from '@/components/analytics/GoogleAnalytics';
import EventTracker from '@/components/analytics/EventTracker';
import CookieBannerNew from '@/components/cookies/CookieBanner';
import { cn } from '@/lib/utils'; // <-- 2. Importer l'utilitaire de classes

// 3. Métadonnées enrichies pour un meilleur SEO
export const metadata: Metadata = {
  metadataBase: new URL('https://votre-domaine.com'), // <-- Mettez votre URL de production ici
  title: {
    default: 'SLW - Services de Développement Sur-Mesure',
    template: '%s | SLW', // Permet aux pages enfants de définir leur propre titre (ex: "Services | SLW")
  },
  description: 'Créatrice de solutions web glamour et performantes. Sites vitrines, landing pages, intégrations Web3 et plus encore.',
  keywords: ['développement web', 'création site internet', 'site vitrine', 'landing page', 'e-commerce', 'web3', 'react', 'next.js', 'freelance'],
  authors: [{ name: 'Smarter Logic Web.com (SLW)', url: 'https://votre-domaine.com' }],
  creator: 'Smarter Logic Web.com (SLW)',
  
  openGraph: {
    title: 'SLW - Services de Développement Sur-Mesure',
    description: 'Créatrice de solutions web glamour et performantes.',
    url: 'https://votre-domaine.com',
    siteName: 'SLW',
    // images: [ // <-- Ajoutez une image pour le partage sur les réseaux sociaux
    //   {
    //     url: '/og-image.png', // Doit être dans votre dossier /public
    //     width: 1200,
    //     height: 630,
    //   },
    // ],
    locale: 'fr_FR',
    type: 'website',
  },
  
  twitter: {
    card: 'summary_large_image',
    title: 'SLW - Services de Développement Sur-Mesure',
    description: 'Créatrice de solutions web glamour et performantes.',
    // creator: '@votreHandleTwitter',
    // images: ['/og-image.png'], // La même image que pour OpenGraph
  },

  robots: { // Instructions pour les robots d'indexation
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr" suppressHydrationWarning> {/* suppressHydrationWarning est utile avec next-themes */}
      <head>
        <GoogleAnalytics />
        {/* Chargement des polices via Google Fonts au runtime (pas au build) */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;500;600;700&family=Montserrat:wght@300;400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body 
        className={cn(
          "bg-cream text-charcoal font-montserrat antialiased" // <-- 4. Classes plus propres
        )}
      >
        <AccessibilityProvider>
          <Providers>
            <EventTracker>
              <Header />
              <main className="pt-20"> {/* Ajusté à 5rem (80px) pour un header un peu plus haut */}
                {children}
              </main>
              <Footer />
            </EventTracker>
            <Toaster position="bottom-right" richColors />
            <CookieBannerNew /> {/* <-- 5. Nouvelle bannière RGPD */}
            <AccessibilityToolbar />
          </Providers>
        </AccessibilityProvider>
      </body>
    </html>
  );
}
