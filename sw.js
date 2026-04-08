// AB Events & Decors — Service Worker v2
const CACHE_NAME = 'ab-events-v2';
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
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k)))
    ).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', e => {
  const url = e.request.url;
  // Skip non-GET, Firebase, Cloudinary, Google APIs, Chrome extensions
  if(e.request.method !== 'GET') return;
  if(url.includes('firestore') || url.includes('firebase') || 
     url.includes('cloudinary') || url.includes('googleapis') ||
     url.includes('chrome-extension')) return;

  e.respondWith(
    fetch(e.request)
      .then(res => {
        // Cache successful responses for static assets
        if(res.ok && (url.includes('.html') || url.includes('.css') || 
           url.includes('.js') || url.includes('.json') || url.includes('.png'))) {
          const clone = res.clone();
          caches.open(CACHE_NAME).then(cache => cache.put(e.request, clone));
        }
        return res;
      })
      .catch(() => {
        // Offline fallback
        return caches.match(e.request).then(cached => {
          return cached || caches.match(OFFLINE_URL);
        });
      })
  );
});
