// Service Worker for SamayYudh PWA & Push Notifications
const CACHE_NAME = 'samayyudh-v2';
const STATIC_ASSETS = [
  '/',
  '/manifest.json',
  '/icon-192.png',
  '/icon-512.png',
  '/icon-512.jpg',
];

// Install event - cache static assets
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(STATIC_ASSETS);
    })
  );
  self.skipWaiting();
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames
          .filter((name) => name !== CACHE_NAME)
          .map((name) => caches.delete(name))
      );
    })
  );
  self.clients.claim();
});

// Fetch event - network first, fallback to cache
self.addEventListener('fetch', (event) => {
  // Skip non-GET requests and API calls
  if (event.request.method !== 'GET') return;
  if (event.request.url.includes('/api/')) return;
  if (event.request.url.includes('supabase.co')) return;

  event.respondWith(
    fetch(event.request)
      .then((response) => {
        // Cache successful responses for static assets
        if (response.status === 200) {
          const responseClone = response.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, responseClone);
          });
        }
        return response;
      })
      .catch(() => {
        // Fallback to cache when offline
        return caches.match(event.request).then((cachedResponse) => {
          if (cachedResponse) return cachedResponse;
          // For navigation requests, serve the cached homepage
          if (event.request.mode === 'navigate') {
            return caches.match('/');
          }
        });
      })
  );
});

// ── Notification Click Event ──────────────────────────────────
self.addEventListener('notificationclick', (event) => {
  event.notification.close();

  const action = event.action;
  if (action === 'dismiss' || action === 'close') {
    return;
  }

  const targetUrl = (event.notification.data && event.notification.data.url) || '/practice';

  event.waitUntil(
    self.clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clientList) => {
      // If a tab is already open, focus it and navigate
      for (const client of clientList) {
        if ('focus' in client) {
          if ('navigate' in client && targetUrl) {
            client.navigate(targetUrl);
          }
          return client.focus();
        }
      }
      // Otherwise open a new window
      if (self.clients.openWindow) {
        return self.clients.openWindow(targetUrl);
      }
    })
  );
});

// ── Push Event (Remote Web Push) ──────────────────────────────
self.addEventListener('push', (event) => {
  let data = {
    title: 'সময়যুদ্ধ 2.0 — Study Battle Time! ⚔️',
    body: 'Your scheduled study session is here! Practice real questions and protect your streak.',
    url: '/practice',
    tag: 'study-reminder',
  };

  try {
    if (event.data) {
      const parsed = event.data.json();
      data = { ...data, ...parsed };
    }
  } catch {
    if (event.data) {
      data.body = event.data.text();
    }
  }

  const options = {
    body: data.body,
    icon: '/icon-192.png',
    badge: '/icon-192.png',
    vibrate: [250, 100, 250, 100, 250],
    tag: data.tag || 'study-reminder',
    renotify: true,
    requireInteraction: true,
    data: {
      url: data.url || '/practice',
      timestamp: Date.now(),
    },
    actions: [
      { action: 'practice', title: '⚔️ Start Practice' },
      { action: 'dismiss', title: 'Dismiss' },
    ],
  };

  event.waitUntil(self.registration.showNotification(data.title, options));
});

// ── Message Event (From Client to SW) ─────────────────────────
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SHOW_STUDY_NOTIFICATION') {
    const payload = event.data.payload || {};
    const title = payload.title || 'সময়যুদ্ধ 2.0 — Study Reminder ⚔️';
    const options = {
      body: payload.body || 'Your daily practice session is waiting!',
      icon: '/icon-192.png',
      badge: '/icon-192.png',
      vibrate: [200, 100, 200],
      tag: payload.tag || 'study-reminder',
      renotify: true,
      data: {
        url: payload.url || '/practice',
      },
      actions: [
        { action: 'practice', title: '⚔️ Start Practice' },
        { action: 'dismiss', title: 'Later' },
      ],
    };

    event.waitUntil(self.registration.showNotification(title, options));
  }
});
