// Service Worker — El Huerto v13.1
const CACHE_NAME = 'el-huerto-v13.1';
const ASSETS = [
  '/',
  '/index.html',
  '/manifest.json'
];

// Install — cachea assets básicos
self.addEventListener('install', e => {
  self.skipWaiting();
  e.waitUntil(
    caches.open(CACHE_NAME).then(c => c.addAll(ASSETS).catch(()=>{}))
  );
});

// Activate — limpia caches viejos
self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k)))
    ).then(() => self.clients.claim())
  );
});

// Fetch — Network first para HTML/JS, Cache first para resto
self.addEventListener('fetch', e => {
  const req = e.request;
  const url = new URL(req.url);

  // No interceptar requests externos (Firebase, Google Fonts, CDN)
  if (url.origin !== location.origin) return;

  // No interceptar Firestore
  if (url.hostname.includes('firestore') || url.hostname.includes('firebase')) return;

  // Network first para el HTML principal
  if (req.mode === 'navigate' || req.destination === 'document') {
    e.respondWith(
      fetch(req).then(res => {
        const copy = res.clone();
        caches.open(CACHE_NAME).then(c => c.put(req, copy));
        return res;
      }).catch(() => caches.match(req).then(r => r || caches.match('/index.html')))
    );
    return;
  }

  // Cache first para todo lo demás
  e.respondWith(
    caches.match(req).then(cached => {
      if (cached) return cached;
      return fetch(req).then(res => {
        if (res.ok && req.method === 'GET') {
          const copy = res.clone();
          caches.open(CACHE_NAME).then(c => c.put(req, copy));
        }
        return res;
      });
    })
  );
});

// Mensaje del cliente (para forzar update)
self.addEventListener('message', e => {
  if (e.data === 'skipWaiting') self.skipWaiting();
});
