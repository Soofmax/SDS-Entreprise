'use client';

import { useEffect } from 'react';
import { trackEvents, trackEvent } from '@/lib/analytics/gtag';
import { useCookieConsent } from '@/lib/hooks/useCookieConsent';

interface EventTrackerProps {
  children: React.ReactNode;
}

export default function EventTracker({ children }: EventTrackerProps) {
  const { hasConsent } = useCookieConsent();

  useEffect(() => {
    if (!hasConsent) return;

    // Tracker le temps de chargement de la page
    const startTime = performance.now();
    
    const handleLoad = () => {
      const loadTime = Math.round(performance.now() - startTime);
      trackEvents.pageLoadTime(loadTime);
    };

    if (document.readyState === 'complete') {
      handleLoad();
    } else {
      window.addEventListener('load', handleLoad);
    }

    // Tracker les clics sur les liens externes
    const handleExternalLinks = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const link = target.closest('a');
      
      if (link && link.href) {
        const url = new URL(link.href);
        const currentDomain = window.location.hostname;
        
        if (url.hostname !== currentDomain) {
          trackEvents.socialClick(url.hostname);
        }
      }
    };

    // Tracker les clics sur les téléphones et emails
    const handleContactLinks = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const link = target.closest('a');
      
      if (link && link.href) {
        if (link.href.startsWith('tel:')) {
          trackEvents.phoneClick();
        } else if (link.href.startsWith('mailto:')) {
          trackEvents.emailClick();
        }
      }
    };

    // Tracker le scroll depth
    let maxScroll = 0;
    const handleScroll = () => {
      const scrollPercent = Math.round(
        (window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100
      );
      
      if (scrollPercent > maxScroll) {
        maxScroll = scrollPercent;
        
        // Tracker les jalons de scroll
        if (scrollPercent >= 25 && maxScroll < 25) {
          trackEvent({
            action: 'scroll_depth',
            category: 'engagement',
            label: '25%',
            value: 25,
          });
        } else if (scrollPercent >= 50 && maxScroll < 50) {
          trackEvent({
            action: 'scroll_depth',
            category: 'engagement',
            label: '50%',
            value: 50,
          });
        } else if (scrollPercent >= 75 && maxScroll < 75) {
          trackEvent({
            action: 'scroll_depth',
            category: 'engagement',
            label: '75%',
            value: 75,
          });
        } else if (scrollPercent >= 90 && maxScroll < 90) {
          trackEvent({
            action: 'scroll_depth',
            category: 'engagement',
            label: '90%',
            value: 90,
          });
        }
      }
    };

    // Tracker le temps passé sur la page
    let timeOnPage = 0;
    const timeInterval = setInterval(() => {
      timeOnPage += 10; // Incrémenter toutes les 10 secondes
      
      // Tracker les jalons de temps
      if (timeOnPage === 30) {
        trackEvent({
          action: 'time_on_page',
          category: 'engagement',
          label: '30_seconds',
          value: 30,
        });
      } else if (timeOnPage === 60) {
        trackEvent({
          action: 'time_on_page',
          category: 'engagement',
          label: '1_minute',
          value: 60,
        });
      } else if (timeOnPage === 180) {
        trackEvent({
          action: 'time_on_page',
          category: 'engagement',
          label: '3_minutes',
          value: 180,
        });
      }
    }, 10000);

    // Ajouter les event listeners
    document.addEventListener('click', handleExternalLinks);
    document.addEventListener('click', handleContactLinks);
    window.addEventListener('scroll', handleScroll, { passive: true });

    // Cleanup
    return () => {
      window.removeEventListener('load', handleLoad);
      document.removeEventListener('click', handleExternalLinks);
      document.removeEventListener('click', handleContactLinks);
      window.removeEventListener('scroll', handleScroll);
      clearInterval(timeInterval);
    };
  }, [hasConsent]);

  return <>{children}</>;
}

