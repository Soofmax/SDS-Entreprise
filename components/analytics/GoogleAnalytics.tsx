'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { initGA, trackPageView, GA_TRACKING_ID } from '@/lib/analytics/gtag';
import { useCookieConsent } from '@/lib/hooks/useCookieConsent';

export default function GoogleAnalytics() {
  const pathname = usePathname();
  const { hasConsent } = useCookieConsent();

  useEffect(() => {
    // Initialiser GA seulement si l'utilisateur a donné son consentement
    if (hasConsent && GA_TRACKING_ID && GA_TRACKING_ID !== 'G-XXXXXXXXXX') {
      initGA();
    }
  }, [hasConsent]);

  useEffect(() => {
    // Tracker les changements de page seulement si consentement donné
    if (hasConsent && GA_TRACKING_ID && GA_TRACKING_ID !== 'G-XXXXXXXXXX') {
      trackPageView(pathname);
    }
  }, [pathname, hasConsent]);

  // Ne pas rendre de script si pas de consentement ou pas d'ID GA
  if (!hasConsent || !GA_TRACKING_ID || GA_TRACKING_ID === 'G-XXXXXXXXXX') {
    return null;
  }

  return (
    <>
      {/* Script Google Analytics */}
      <script
        async
        src={`https://www.googletagmanager.com/gtag/js?id=${GA_TRACKING_ID}`}
      />
      <script
        dangerouslySetInnerHTML={{
          __html: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${GA_TRACKING_ID}', {
              page_path: window.location.pathname,
              anonymize_ip: true,
              allow_google_signals: false,
              allow_ad_personalization_signals: false,
            });
          `,
        }}
      />
    </>
  );
}

