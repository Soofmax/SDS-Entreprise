// Fichier: app/layout.tsx

import './globals.css';
import type { Metadata } from 'next';
import { Providers } from './providers';
import { Toaster } from 'sonner';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { AccessibilityProvider } from '@/components/accessibility/AccessibilityProvider';
import { AccessibilityToolbar } from '@/components/accessibility/AccessibilityToolbar';
import GoogleAnalytics from '@/components/analytics/GoogleAnalytics';
import EventTracker from '@/components/analytics/EventTracker';
import CookieBannerNew from '@/components/cookies/CookieBanner';
import { cn } from '@/lib/utils';

// next/font – auto-hébergé, réduit le CLS
import { Playfair_Display, Montserrat } from 'next/font/google';

const playfair = Playfair_Display({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-playfair',
});
const montserrat = Montserrat({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-montserrat',
});

// Métadonnées enrichies pour un meilleur SEO
export const metadata: Metadata = {
  metadataBase: new URL('https://smarterlogicweb.com'),
  title: {
    default: 'SLW - Services de Développement Sur-Mesure',
    template: '%s | SLW',
  },
  description: 'Créatrice de solutions web glamour et performantes. Sites vitrines, landing pages, intégrations Web3 et plus encore.',
  keywords: ['développement web', 'création site internet', 'site vitrine', 'landing page', 'e-commerce', 'web3', 'react', 'next.js', 'freelance'],
  authors: [{ name: 'Smarter Logic Web.com (SLW)', url: 'https://smarterlogicweb.com' }],
  creator: 'Smarter Logic Web.com (SLW)',
  icons: {
    icon: '/icon',
    apple: '/apple-icon',
    shortcut: '/icon',
  },
  openGraph: {
    title: 'SLW - Services de Développement Sur-Mesure',
    description: 'Créatrice de solutions web glamour et performantes.',
    url: 'https://smarterlogicweb.com',
    siteName: 'SLW',
    images: [
      {
        url: '/og',
        width: 1200,
        height: 630,
      },
    ],
    locale: 'fr_FR',
    type: 'website',
  },
  
  twitter: {
    card: 'summary_large_image',
    title: 'SLW - Services de Développement Sur-Mesure',
    description: 'Créatrice de solutions web glamour et performantes.',
    images: ['/og'],
  },

  robots: {
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
    <html lang="fr" suppressHydrationWarning>
      <head>
        <GoogleAnalytics />
        {/* next/font gère les polices, suppression des liens Google Fonts */}
        <link rel="manifest" href="/manifest.json" />
      </head>
      <body 
        className={cn(
          `${playfair.variable} ${montserrat.variable}`,
          "bg-cream text-charcoal dark:bg-gray-950 dark:text-cream font-montserrat antialiased"
        )}
      >
        {/* Skip link pour WCAG */}
        <a href="#main" className="skip-link">Aller au contenu principal</a>
        <AccessibilityProvider>
          <Providers>
            <EventTracker>
              <Header />
              <main id="main" className="pt-20" tabIndex={-1}>
                {children}
              </main>
              <Footer />
            </EventTracker>
            <Toaster position="bottom-right" richColors />
            <CookieBannerNew />
            <AccessibilityToolbar />
          </Providers>
        </AccessibilityProvider>
      </body>
    </html>
  );
}
