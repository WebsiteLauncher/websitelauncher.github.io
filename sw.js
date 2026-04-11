// HAPPENHAUS — Service Worker v4
// Updated cache version forces all clients to get fresh files
const CACHE_NAME = 'happenhaus-v4';
const OFFLINE_URL = './index.html';

self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      return Promise.allSettled([
        cache.add('./index.html'),
        cache.add('./manifest.json')
      ]);
    }).then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', e => {
  e.waitUntil(
    // Delete ALL old caches (happenhaus-v1, v2, v3, etc.)
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => {
        console.log('[SW] Deleting old cache:', k);
        return caches.delete(k);
      }))
    ).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', e => {
  const url = e.request.url;

  // Skip non-GET requests
  if (e.request.method !== 'GET') return;

  // Skip third-party APIs — always fetch live
  if (url.includes('firestore') || url.includes('firebase') ||
      url.includes('cloudinary') || url.includes('googleapis') ||
      url.includes('gstatic') || url.includes('chrome-extension') ||
      url.includes('emailjs') || url.includes('jsdelivr')) return;

  // Network-first strategy: try network, fall back to cache
  e.respondWith(
    fetch(e.request)
      .then(res => {
        // Cache successful responses for own static assets only
        if (res.ok && res.type === 'basic') {
          const clone = res.clone();
          caches.open(CACHE_NAME).then(cache => cache.put(e.request, clone));
        }
        return res;
      })
      .catch(() => {
        // Offline fallback: serve from cache
        return caches.match(e.request).then(cached => {
          return cached || caches.match(OFFLINE_URL);
        });
      })
  );
});
