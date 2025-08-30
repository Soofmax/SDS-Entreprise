// Service Worker pour SDS PWA
const CACHE_NAME = 'sds-v1.0.0';
const OFFLINE_URL = '/offline';

// Ressources à mettre en cache immédiatement
const STATIC_CACHE_URLS = [
  '/',
  '/services',
  '/portfolio',
  '/about',
  '/contact',
  '/offline',
  '/manifest.json',
  '/icons/icon-192x192.png',
  '/icons/icon-512x512.png',
];

// Ressources à mettre en cache lors de la première visite
const DYNAMIC_CACHE_URLS = [
  '/api/contact',
  '/api/france-num/calculate',
];

// Stratégies de cache
const CACHE_STRATEGIES = {
  // Cache First - pour les ressources statiques
  CACHE_FIRST: 'cache-first',
  // Network First - pour les données dynamiques
  NETWORK_FIRST: 'network-first',
  // Stale While Revalidate - pour les ressources qui peuvent être mises à jour
  STALE_WHILE_REVALIDATE: 'stale-while-revalidate',
  // Network Only - pour les requêtes critiques
  NETWORK_ONLY: 'network-only',
  // Cache Only - pour les ressources offline
  CACHE_ONLY: 'cache-only',
};

// Configuration des routes et stratégies
const ROUTE_STRATEGIES = [
  {
    pattern: /^https:\/\/fonts\.googleapis\.com/,
    strategy: CACHE_STRATEGIES.STALE_WHILE_REVALIDATE,
    cacheName: 'google-fonts-stylesheets',
  },
  {
    pattern: /^https:\/\/fonts\.gstatic\.com/,
    strategy: CACHE_STRATEGIES.CACHE_FIRST,
    cacheName: 'google-fonts-webfonts',
    expiration: {
      maxEntries: 30,
      maxAgeSeconds: 60 * 60 * 24 * 365, // 1 an
    },
  },
  {
    pattern: /\.(?:png|jpg|jpeg|svg|gif|webp)$/,
    strategy: CACHE_STRATEGIES.CACHE_FIRST,
    cacheName: 'images',
    expiration: {
      maxEntries: 100,
      maxAgeSeconds: 60 * 60 * 24 * 30, // 30 jours
    },
  },
  {
    pattern: /\.(?:js|css)$/,
    strategy: CACHE_STRATEGIES.STALE_WHILE_REVALIDATE,
    cacheName: 'static-resources',
  },
  {
    pattern: /^\/api\//,
    strategy: CACHE_STRATEGIES.NETWORK_FIRST,
    cacheName: 'api-cache',
    expiration: {
      maxEntries: 50,
      maxAgeSeconds: 60 * 5, // 5 minutes
    },
  },
];

/**
 * Installation du Service Worker
 */
self.addEventListener('install', (event) => {
  console.log('SW: Installation');
  
  event.waitUntil(
    (async () => {
      try {
        const cache = await caches.open(CACHE_NAME);
        
        // Mettre en cache les ressources statiques
        await cache.addAll(STATIC_CACHE_URLS);
        
        console.log('SW: Ressources statiques mises en cache');
        
        // Forcer l'activation immédiate
        await self.skipWaiting();
        
      } catch (error) {
        console.error('SW: Erreur installation:', error);
      }
    })()
  );
});

/**
 * Activation du Service Worker
 */
self.addEventListener('activate', (event) => {
  console.log('SW: Activation');
  
  event.waitUntil(
    (async () => {
      try {
        // Nettoyer les anciens caches
        const cacheNames = await caches.keys();
        await Promise.all(
          cacheNames
            .filter(cacheName => cacheName !== CACHE_NAME)
            .map(cacheName => caches.delete(cacheName))
        );
        
        // Prendre le contrôle de tous les clients
        await self.clients.claim();
        
        console.log('SW: Activation terminée');
        
        // Notifier les clients que le SW est prêt
        const clients = await self.clients.matchAll();
        clients.forEach(client => {
          client.postMessage({
            type: 'OFFLINE_READY',
            payload: { ready: true },
          });
        });
        
      } catch (error) {
        console.error('SW: Erreur activation:', error);
      }
    })()
  );
});

/**
 * Interception des requêtes
 */
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);
  
  // Ignorer les requêtes non-HTTP
  if (!request.url.startsWith('http')) {
    return;
  }
  
  // Ignorer les requêtes Chrome extension
  if (url.protocol === 'chrome-extension:') {
    return;
  }
  
  // Stratégie spéciale pour la page offline
  if (url.pathname === OFFLINE_URL) {
    event.respondWith(caches.match(OFFLINE_URL));
    return;
  }
  
  // Appliquer la stratégie appropriée
  const strategy = getStrategyForRequest(request);
  event.respondWith(handleRequest(request, strategy));
});

/**
 * Déterminer la stratégie de cache pour une requête
 */
function getStrategyForRequest(request) {
  const url = new URL(request.url);
  
  // Vérifier les patterns configurés
  for (const route of ROUTE_STRATEGIES) {
    if (route.pattern.test(request.url)) {
      return route;
    }
  }
  
  // Stratégie par défaut selon le type de requête
  if (request.method !== 'GET') {
    return { strategy: CACHE_STRATEGIES.NETWORK_ONLY };
  }
  
  if (url.pathname.startsWith('/api/')) {
    return { 
      strategy: CACHE_STRATEGIES.NETWORK_FIRST,
      cacheName: 'api-cache',
    };
  }
  
  if (request.destination === 'document') {
    return { 
      strategy: CACHE_STRATEGIES.NETWORK_FIRST,
      cacheName: 'pages',
    };
  }
  
  return { 
    strategy: CACHE_STRATEGIES.STALE_WHILE_REVALIDATE,
    cacheName: 'default',
  };
}

/**
 * Gérer une requête selon la stratégie
 */
async function handleRequest(request, routeConfig) {
  const { strategy, cacheName = CACHE_NAME, expiration } = routeConfig;
  
  switch (strategy) {
    case CACHE_STRATEGIES.CACHE_FIRST:
      return handleCacheFirst(request, cacheName, expiration);
      
    case CACHE_STRATEGIES.NETWORK_FIRST:
      return handleNetworkFirst(request, cacheName, expiration);
      
    case CACHE_STRATEGIES.STALE_WHILE_REVALIDATE:
      return handleStaleWhileRevalidate(request, cacheName, expiration);
      
    case CACHE_STRATEGIES.NETWORK_ONLY:
      return handleNetworkOnly(request);
      
    case CACHE_STRATEGIES.CACHE_ONLY:
      return handleCacheOnly(request, cacheName);
      
    default:
      return handleNetworkFirst(request, cacheName, expiration);
  }
}

/**
 * Stratégie Cache First
 */
async function handleCacheFirst(request, cacheName, expiration) {
  try {
    const cache = await caches.open(cacheName);
    const cachedResponse = await cache.match(request);
    
    if (cachedResponse && !isExpired(cachedResponse, expiration)) {
      return cachedResponse;
    }
    
    const networkResponse = await fetch(request);
    
    if (networkResponse.ok) {
      await cache.put(request, networkResponse.clone());
      await cleanupCache(cacheName, expiration);
    }
    
    return networkResponse;
    
  } catch (error) {
    console.error('SW: Erreur Cache First:', error);
    const cachedResponse = await caches.match(request);
    return cachedResponse || createOfflineResponse(request);
  }
}

/**
 * Stratégie Network First
 */
async function handleNetworkFirst(request, cacheName, expiration) {
  try {
    const networkResponse = await fetch(request);
    
    if (networkResponse.ok) {
      const cache = await caches.open(cacheName);
      await cache.put(request, networkResponse.clone());
      await cleanupCache(cacheName, expiration);
    }
    
    return networkResponse;
    
  } catch (error) {
    console.error('SW: Erreur Network First:', error);
    const cachedResponse = await caches.match(request);
    return cachedResponse || createOfflineResponse(request);
  }
}

/**
 * Stratégie Stale While Revalidate
 */
async function handleStaleWhileRevalidate(request, cacheName, expiration) {
  const cache = await caches.open(cacheName);
  const cachedResponse = await cache.match(request);
  
  // Révalidation en arrière-plan
  const networkResponsePromise = fetch(request).then(async (networkResponse) => {
    if (networkResponse.ok) {
      await cache.put(request, networkResponse.clone());
      await cleanupCache(cacheName, expiration);
    }
    return networkResponse;
  }).catch(error => {
    console.error('SW: Erreur révalidation:', error);
  });
  
  // Retourner immédiatement la réponse en cache ou attendre le réseau
  return cachedResponse || networkResponsePromise || createOfflineResponse(request);
}

/**
 * Stratégie Network Only
 */
async function handleNetworkOnly(request) {
  try {
    return await fetch(request);
  } catch (error) {
    console.error('SW: Erreur Network Only:', error);
    return createOfflineResponse(request);
  }
}

/**
 * Stratégie Cache Only
 */
async function handleCacheOnly(request, cacheName) {
  const cachedResponse = await caches.match(request);
  return cachedResponse || createOfflineResponse(request);
}

/**
 * Vérifier si une réponse en cache est expirée
 */
function isExpired(response, expiration) {
  if (!expiration || !expiration.maxAgeSeconds) {
    return false;
  }
  
  const dateHeader = response.headers.get('date');
  if (!dateHeader) {
    return false;
  }
  
  const responseDate = new Date(dateHeader);
  const now = new Date();
  const ageInSeconds = (now.getTime() - responseDate.getTime()) / 1000;
  
  return ageInSeconds > expiration.maxAgeSeconds;
}

/**
 * Nettoyer le cache selon les règles d'expiration
 */
async function cleanupCache(cacheName, expiration) {
  if (!expiration || !expiration.maxEntries) {
    return;
  }
  
  const cache = await caches.open(cacheName);
  const requests = await cache.keys();
  
  if (requests.length > expiration.maxEntries) {
    const requestsToDelete = requests.slice(0, requests.length - expiration.maxEntries);
    await Promise.all(requestsToDelete.map(request => cache.delete(request)));
  }
}

/**
 * Créer une réponse offline
 */
function createOfflineResponse(request) {
  const url = new URL(request.url);
  
  // Pour les pages HTML, rediriger vers la page offline
  if (request.destination === 'document') {
    return caches.match(OFFLINE_URL);
  }
  
  // Pour les API, retourner une réponse JSON d'erreur
  if (url.pathname.startsWith('/api/')) {
    return new Response(
      JSON.stringify({
        success: false,
        error: {
          code: 'OFFLINE',
          message: 'Vous êtes hors ligne. Veuillez réessayer plus tard.',
        },
      }),
      {
        status: 503,
        statusText: 'Service Unavailable',
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );
  }
  
  // Pour les autres ressources, retourner une erreur générique
  return new Response('Ressource non disponible hors ligne', {
    status: 503,
    statusText: 'Service Unavailable',
  });
}

/**
 * Gestion des messages
 */
self.addEventListener('message', (event) => {
  const { type, payload } = event.data;
  
  switch (type) {
    case 'SKIP_WAITING':
      self.skipWaiting();
      break;
      
    case 'PRELOAD_RESOURCES':
      preloadResources(payload.urls);
      break;
      
    case 'CLEAR_CACHE':
      clearAllCaches();
      break;
      
    case 'GET_CACHE_SIZE':
      getCacheSize().then(size => {
        event.ports[0].postMessage({ type: 'CACHE_SIZE', payload: { size } });
      });
      break;
      
    default:
      console.log('SW: Message non géré:', type);
  }
});

/**
 * Précharger des ressources
 */
async function preloadResources(urls) {
  try {
    const cache = await caches.open(CACHE_NAME);
    await cache.addAll(urls);
    
    console.log('SW: Ressources préchargées:', urls);
    
    // Notifier les clients
    const clients = await self.clients.matchAll();
    clients.forEach(client => {
      client.postMessage({
        type: 'CACHE_UPDATED',
        payload: { urls },
      });
    });
    
  } catch (error) {
    console.error('SW: Erreur préchargement:', error);
  }
}

/**
 * Nettoyer tous les caches
 */
async function clearAllCaches() {
  try {
    const cacheNames = await caches.keys();
    await Promise.all(cacheNames.map(cacheName => caches.delete(cacheName)));
    console.log('SW: Tous les caches supprimés');
  } catch (error) {
    console.error('SW: Erreur nettoyage cache:', error);
  }
}

/**
 * Calculer la taille du cache
 */
async function getCacheSize() {
  let totalSize = 0;
  
  try {
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
  } catch (error) {
    console.error('SW: Erreur calcul taille cache:', error);
  }
  
  return totalSize;
}

/**
 * Gestion des notifications push
 */
self.addEventListener('push', (event) => {
  if (!event.data) {
    return;
  }
  
  try {
    const data = event.data.json();
    
    const options = {
      body: data.body,
      icon: '/icons/icon-192x192.png',
      badge: '/icons/badge-72x72.png',
      image: data.image,
      data: data.data,
      actions: data.actions,
      tag: data.tag,
      requireInteraction: data.requireInteraction,
      silent: data.silent,
      vibrate: data.vibrate,
    };
    
    event.waitUntil(
      self.registration.showNotification(data.title, options)
    );
    
  } catch (error) {
    console.error('SW: Erreur notification push:', error);
  }
});

/**
 * Gestion des clics sur les notifications
 */
self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  
  const { action, data } = event;
  
  event.waitUntil(
    (async () => {
      const clients = await self.clients.matchAll({ type: 'window' });
      
      // Gérer les actions spécifiques
      if (action === 'update') {
        // Appliquer la mise à jour
        await self.skipWaiting();
        return;
      }
      
      if (action === 'dismiss') {
        return;
      }
      
      // URL de destination
      const urlToOpen = data?.url || '/';
      
      // Vérifier si une fenêtre est déjà ouverte
      for (const client of clients) {
        if (client.url === urlToOpen && 'focus' in client) {
          await client.focus();
          
          // Envoyer un message au client
          client.postMessage({
            type: 'NOTIFICATION_CLICK',
            payload: { action, data },
          });
          
          return;
        }
      }
      
      // Ouvrir une nouvelle fenêtre
      if (self.clients.openWindow) {
        await self.clients.openWindow(urlToOpen);
      }
    })()
  );
});

/**
 * Gestion de la synchronisation en arrière-plan
 */
self.addEventListener('sync', (event) => {
  if (event.tag === 'background-sync') {
    event.waitUntil(doBackgroundSync());
  }
});

/**
 * Synchronisation en arrière-plan
 */
async function doBackgroundSync() {
  try {
    // Synchroniser les données en attente
    console.log('SW: Synchronisation en arrière-plan');
    
    // Ici, on pourrait synchroniser les formulaires en attente,
    // les analytics, etc.
    
  } catch (error) {
    console.error('SW: Erreur synchronisation:', error);
  }
}

console.log('SW: Service Worker SDS chargé');

