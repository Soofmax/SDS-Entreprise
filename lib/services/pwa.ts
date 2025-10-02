// Service Worker et PWA utilities
import { useEffect, useState } from 'react';

export interface PWAInstallPrompt {
  prompt(): Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

export interface NotificationOptions {
  title: string;
  body: string;
  icon?: string;
  badge?: string;
  image?: string;
  tag?: string;
  data?: any;
  actions?: Array<{
    action: string;
    title: string;
    icon?: string;
  }>;
  requireInteraction?: boolean;
  silent?: boolean;
  vibrate?: number[];
}

/**
 * Classe principale pour la gestion PWA
 */
export class PWAService {
  private static instance: PWAService;
  private deferredPrompt: PWAInstallPrompt | null = null;
  private isInstalled = false;
  private registration: ServiceWorkerRegistration | null = null;

  private constructor() {
    this.init();
  }

  static getInstance(): PWAService {
    if (!PWAService.instance) {
      PWAService.instance = new PWAService();
    }
    return PWAService.instance;
  }

  /**
   * Initialiser le service PWA
   */
  private async init(): Promise<void> {
    if (typeof window === 'undefined') return;

    // Détecter si l'app est déjà installée
    this.detectInstallation();

    // Écouter l'événement d'installation
    this.listenForInstallPrompt();

    // Enregistrer le service worker
    await this.registerServiceWorker();

    // Configurer les notifications
    await this.setupNotifications();

    // Gérer les mises à jour
    this.handleUpdates();
  }

  /**
   * Détecter si l'app est installée
   */
  private detectInstallation(): void {
    // Vérifier si l'app est en mode standalone
    this.isInstalled = window.matchMedia('(display-mode: standalone)').matches ||
                      (window.navigator as any).standalone ||
                      document.referrer.includes('android-app://');

    // Écouter les changements de mode d'affichage
    window.matchMedia('(display-mode: standalone)').addEventListener('change', (e) => {
      this.isInstalled = e.matches;
      this.onInstallationChange(this.isInstalled);
    });
  }

  /**
   * Écouter l'événement d'installation
   */
  private listenForInstallPrompt(): void {
    window.addEventListener('beforeinstallprompt', (e) => {
      e.preventDefault();
      this.deferredPrompt = e as any;
      this.onInstallPromptAvailable();
    });

    window.addEventListener('appinstalled', () => {
      this.isInstalled = true;
      this.deferredPrompt = null;
      this.onInstallationChange(true);
    });
  }

  /**
   * Enregistrer le service worker
   */
  private async registerServiceWorker(): Promise<void> {
    if (!('serviceWorker' in navigator)) {
      console.log('Service Worker non supporté');
      return;
    }

    try {
      this.registration = await navigator.serviceWorker.register('/sw.js', {
        scope: '/',
      });

      console.log('Service Worker enregistré:', this.registration.scope);

      // Écouter les messages du service worker
      navigator.serviceWorker.addEventListener('message', this.handleServiceWorkerMessage.bind(this));

    } catch (error) {
      console.error('Erreur enregistrement Service Worker:', error);
    }
  }

  /**
   * Configurer les notifications push
   */
  private async setupNotifications(): Promise<void> {
    if (!('Notification' in window) || !this.registration) {
      console.log('Notifications non supportées');
      return;
    }

    // Demander la permission si nécessaire
    if (Notification.permission === 'default') {
      await this.requestNotificationPermission();
    }

    // S'abonner aux notifications push si autorisé
    if (Notification.permission === 'granted') {
      await this.subscribeToPushNotifications();
    }
  }

  /**
   * Demander la permission pour les notifications
   */
  async requestNotificationPermission(): Promise<NotificationPermission> {
    const permission = await Notification.requestPermission();
    
    if (permission === 'granted') {
      console.log('Permission notifications accordée');
      await this.subscribeToPushNotifications();
    } else {
      console.log('Permission notifications refusée');
    }

    return permission;
  }

  /**
   * S'abonner aux notifications push
   */
  private async subscribeToPushNotifications(): Promise<void> {
    if (!this.registration) return;

    try {
      const subscription = await this.registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: this.urlBase64ToUint8Array(
          process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY || ''
        ),
      });

      // Envoyer l'abonnement au serveur
      await this.sendSubscriptionToServer(subscription);

    } catch (error) {
      console.error('Erreur abonnement push:', error);
    }
  }

  /**
   * Envoyer l'abonnement au serveur
   */
  private async sendSubscriptionToServer(subscription: PushSubscription): Promise<void> {
    try {
      await fetch('/api/notifications/subscribe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          subscription,
          userAgent: navigator.userAgent,
        }),
      });
    } catch (error) {
      console.error('Erreur envoi abonnement:', error);
    }
  }

  /**
   * Afficher une notification locale
   */
  async showNotification(options: NotificationOptions): Promise<void> {
    if (!this.registration || Notification.permission !== 'granted') {
      console.log('Notifications non autorisées');
      return;
    }

    const notificationOptions: NotificationOptions = {
      icon: '/icons/icon-192x192.png',
      badge: '/icons/badge-72x72.png',
      ...options,
    };

    await this.registration.showNotification(options.title, notificationOptions);
  }

  /**
   * Proposer l'installation de l'app
   */
  async promptInstall(): Promise<boolean> {
    if (!this.deferredPrompt) {
      console.log('Prompt d\'installation non disponible');
      return false;
    }

    try {
      await this.deferredPrompt.prompt();
      const choiceResult = await this.deferredPrompt.userChoice;
      
      if (choiceResult.outcome === 'accepted') {
        console.log('Installation acceptée');
        this.deferredPrompt = null;
        return true;
      } else {
        console.log('Installation refusée');
        return false;
      }
    } catch (error) {
      console.error('Erreur prompt installation:', error);
      return false;
    }
  }

  /**
   * Vérifier si l'installation est possible
   */
  canInstall(): boolean {
    return !!this.deferredPrompt && !this.isInstalled;
  }

  /**
   * Vérifier si l'app est installée
   */
  isAppInstalled(): boolean {
    return this.isInstalled;
  }

  /**
   * Gérer les mises à jour du service worker
   */
  private handleUpdates(): void {
    if (!this.registration) return;

    this.registration.addEventListener('updatefound', () => {
      const newWorker = this.registration!.installing;
      
      if (newWorker) {
        newWorker.addEventListener('statechange', () => {
          if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
            // Nouvelle version disponible
            this.onUpdateAvailable();
          }
        });
      }
    });
  }

  /**
   * Appliquer la mise à jour
   */
  async applyUpdate(): Promise<void> {
    if (!this.registration) return;

    const newWorker = this.registration.waiting;
    if (newWorker) {
      newWorker.postMessage({ type: 'SKIP_WAITING' });
      window.location.reload();
    }
  }

  /**
   * Gérer les messages du service worker
   */
  private handleServiceWorkerMessage(event: MessageEvent): void {
    const { type, payload } = event.data;

    switch (type) {
      case 'CACHE_UPDATED':
        console.log('Cache mis à jour:', payload);
        break;
      
      case 'OFFLINE_READY':
        console.log('Mode hors ligne prêt');
        this.onOfflineReady();
        break;
      
      case 'NOTIFICATION_CLICK':
        this.handleNotificationClick(payload);
        break;
      
      default:
        console.log('Message SW non géré:', type, payload);
    }
  }

  /**
   * Gérer le clic sur une notification
   */
  private handleNotificationClick(data: any): void {
    // Naviguer vers la page appropriée
    if (data.url) {
      window.open(data.url, '_blank');
    }
  }

  /**
   * Convertir la clé VAPID
   */
  private urlBase64ToUint8Array(base64String: string): Uint8Array {
    const padding = '='.repeat((4 - base64String.length % 4) % 4);
    const base64 = (base64String + padding)
      .replace(/-/g, '+')
      .replace(/_/g, '/');

    const rawData = window.atob(base64);
    const outputArray = new Uint8Array(rawData.length);

    for (let i = 0; i < rawData.length; ++i) {
      outputArray[i] = rawData.charCodeAt(i);
    }
    return outputArray;
  }

  /**
   * Callbacks pour les événements PWA
   */
  private onInstallPromptAvailable(): void {
    // Afficher le bouton d'installation
    const installButton = document.querySelector('[data-pwa-install]');
    if (installButton) {
      installButton.classList.remove('hidden');
    }

    // Déclencher un événement personnalisé
    window.dispatchEvent(new CustomEvent('pwa:installprompt'));
  }

  private onInstallationChange(installed: boolean): void {
    // Masquer le bouton d'installation
    const installButton = document.querySelector('[data-pwa-install]');
    if (installButton) {
      installButton.classList.toggle('hidden', installed);
    }

    // Afficher une notification de bienvenue
    if (installed) {
      this.showNotification({
        title: 'SLW installé !',
        body: 'L\'application est maintenant disponible sur votre écran d\'accueil.',
        tag: 'welcome',
      });
    }

    // Déclencher un événement personnalisé
    window.dispatchEvent(new CustomEvent('pwa:installchange', { 
      detail: { installed } 
    }));
  }

  private onUpdateAvailable(): void {
    // Afficher une notification de mise à jour
    this.showNotification({
      title: 'Mise à jour disponible',
      body: 'Une nouvelle version de SLW est disponible.',
      tag: 'update',
      actions: [
        {
          action: 'update',
          title: 'Mettre à jour',
        },
        {
          action: 'dismiss',
          title: 'Plus tard',
        },
      ],
    });

    // Déclencher un événement personnalisé
    window.dispatchEvent(new CustomEvent('pwa:updateavailable'));
  }

  private onOfflineReady(): void {
    // Afficher une notification de mode hors ligne
    this.showNotification({
      title: 'Mode hors ligne activé',
      body: 'Vous pouvez maintenant utiliser SDS sans connexion internet.',
      tag: 'offline',
    });
  }
}

// Instance globale
export const pwa = PWAService.getInstance();

// Hook React pour PWA
export function usePWA() {
  const [canInstall, setCanInstall] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);
  const [updateAvailable, setUpdateAvailable] = useState(false);

  useEffect(() => {
    setCanInstall(pwa.canInstall());
    setIsInstalled(pwa.isAppInstalled());

    const handleInstallPrompt = () => setCanInstall(true);
    const handleInstallChange = (e: CustomEvent) => {
      setIsInstalled(e.detail.installed);
      setCanInstall(!e.detail.installed && pwa.canInstall());
    };
    const handleUpdateAvailable = () => setUpdateAvailable(true);

    window.addEventListener('pwa:installprompt', handleInstallPrompt);
    window.addEventListener('pwa:installchange', handleInstallChange as EventListener);
    window.addEventListener('pwa:updateavailable', handleUpdateAvailable);

    return () => {
      window.removeEventListener('pwa:installprompt', handleInstallPrompt);
      window.removeEventListener('pwa:installchange', handleInstallChange as EventListener);
      window.removeEventListener('pwa:updateavailable', handleUpdateAvailable);
    };
  }, []);

  const install = async () => {
    const success = await pwa.promptInstall();
    if (success) {
      setCanInstall(false);
      setIsInstalled(true);
    }
    return success;
  };

  const requestNotifications = async () => {
    return await pwa.requestNotificationPermission();
  };

  const showNotification = async (options: NotificationOptions) => {
    return await pwa.showNotification(options);
  };

  const applyUpdate = async () => {
    await pwa.applyUpdate();
    setUpdateAvailable(false);
  };

  return {
    canInstall,
    isInstalled,
    updateAvailable,
    install,
    requestNotifications,
    showNotification,
    applyUpdate,
  };
}

// Utilitaires pour le cache
export const cacheUtils = {
  /**
   * Précharger des ressources importantes
   */
  async preloadResources(urls: string[]): Promise<void> {
    if ('serviceWorker' in navigator && navigator.serviceWorker.controller) {
      navigator.serviceWorker.controller.postMessage({
        type: 'PRELOAD_RESOURCES',
        payload: { urls },
      });
    }
  },

  /**
   * Nettoyer le cache
   */
  async clearCache(): Promise<void> {
    if ('caches' in window) {
      const cacheNames = await caches.keys();
      await Promise.all(
        cacheNames.map(cacheName => caches.delete(cacheName))
      );
    }
  },

  /**
   * Vérifier la taille du cache
   */
  async getCacheSize(): Promise<number> {
    if (!('caches' in window)) return 0;

    let totalSize = 0;
    const cacheNames = await caches.keys();

    for (const cacheName of cacheNames) {
      const cache = await caches.open(cacheName);
      const requests = await cache.keys();
      
      for (const request of requests) {
        const response = await cache.match(request);
        if (response) {
          const blob = await response.blob();
          totalSize += blob.size;
        }
      }
    }

    return totalSize;
  },
};

