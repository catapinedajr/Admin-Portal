// HODLearn Service Worker with Enhanced Error Recovery
const CACHE_NAME = 'hodlearn-v2'; // Incremented to force cache refresh
const urlsToCache = [
  '/',
  '/manifest.json',
  '/icon.svg',
  '/icon-192x192.png',
  '/icon-512x512.png'
];

// Install event - cache essential files with error handling
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('HODLearn: Caching essential files');
        return cache.addAll(urlsToCache);
      })
      .catch((error) => {
        console.error('HODLearn: Cache installation failed:', error);
        // Force immediate activation to prevent white screen
        return self.skipWaiting();
      })
  );
});

// Fetch event - enhanced with fallback handling
self.addEventListener('fetch', (event) => {
  // Only handle same-origin requests to avoid CORS issues
  if (!event.request.url.startsWith(self.location.origin)) {
    return;
  }

  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        if (response) {
          return response;
        }
        
        // Try network request with timeout
        return Promise.race([
          fetch(event.request),
          new Promise((_, reject) => 
            setTimeout(() => reject(new Error('Network timeout')), 5000)
          )
        ]);
      })
      .catch((error) => {
        console.warn('HODLearn: Fetch failed, attempting fallback:', error);
        
        // For navigation requests, return the cached root page to prevent white screen
        if (event.request.mode === 'navigate') {
          return caches.match('/').then((response) => {
            return response || new Response(
              '<!DOCTYPE html><html><body><h1>HODLearn</h1><p>Loading...</p><script>window.location.reload();</script></body></html>',
              { headers: { 'Content-Type': 'text/html' } }
            );
          });
        }
        
        throw error;
      })
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            console.log('HODLearn: Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});

// Prepare for future push notifications
self.addEventListener('push', (event) => {
  if (event.data) {
    const data = event.data.json();
    const options = {
      body: data.body || 'Your daily Bitcoin lesson is ready!',
      icon: '/icon-192x192.png',
      badge: '/icon-192x192.png',
      tag: 'hodlearn-notification',
      requireInteraction: false,
      actions: [
        {
          action: 'open',
          title: 'Open HODLearn'
        }
      ]
    };

    event.waitUntil(
      self.registration.showNotification(data.title || 'HODLearn', options)
    );
  }
});

// Handle notification clicks
self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  
  event.waitUntil(
    clients.openWindow('/')
  );
});