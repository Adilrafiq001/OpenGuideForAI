// OpenGuide AI Studio - Offline-First Service Worker
// Governed by the $0 Rule: 100% Client-Side Execution & Caching
const CACHE_NAME = 'openguide-shell-v2.6.0';
const PYODIDE_CACHE_NAME = 'openguide-pyodide-v0.26';
const STATIC_ASSETS = [
  '/',
  '/manifest.webmanifest',
  '/favicon.svg',
  '/icons.svg',
  '/pyodide.worker.js'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(STATIC_ASSETS);
    })
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.filter((key) => key !== CACHE_NAME && key !== PYODIDE_CACHE_NAME).map((key) => caches.delete(key))
      );
    })
  );
  self.clients.claim();
});

// Listener for explicit pre-caching of Pyodide WASM core for day-0 air-gap support
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'PRECACHE_PYODIDE_CORE') {
    const PYODIDE_CORE_URLS = [
      'https://cdn.jsdelivr.net/pyodide/v0.26.1/full/pyodide.js',
      'https://cdn.jsdelivr.net/pyodide/v0.26.1/full/pyodide.asm.js',
      'https://cdn.jsdelivr.net/pyodide/v0.26.1/full/pyodide.asm.wasm',
      'https://cdn.jsdelivr.net/pyodide/v0.26.1/full/repodata.json'
    ];
    caches.open(PYODIDE_CACHE_NAME).then((cache) => {
      Promise.all(
        PYODIDE_CORE_URLS.map((u) => 
          fetch(u, { mode: 'cors' }).then((res) => {
            if (res.ok) cache.put(u, res);
          }).catch((err) => console.warn('[SW] Air-gap pre-cache skip:', u, err))
        )
      ).then(() => {
        event.ports?.[0]?.postMessage({ success: true, message: 'Pyodide core pre-cached for 100% offline air-gapped execution.' });
      });
    });
  }
});

self.addEventListener('fetch', (event) => {
  const url = new URL(event.request.url);

  // Skip non-GET requests or browser extension protocols (chrome-extension://, moz-extension://)
  if (event.request.method !== 'GET' || !url.protocol.startsWith('http')) {
    return;
  }

  // Bypass service worker entirely for localhost development and Vite internal URLs
  if (url.hostname === 'localhost' || url.hostname === '127.0.0.1' || url.pathname.includes('/@') || url.pathname.includes('/node_modules/')) {
    return;
  }

  // 1a. Cache-first strategy for external Pyodide CDN assets (cdn.jsdelivr.net/pyodide/*) and wheels
  if (url.hostname.includes('jsdelivr.net') && (url.pathname.includes('/pyodide/') || url.pathname.endsWith('.whl') || url.pathname.endsWith('.wasm') || url.pathname.endsWith('.json'))) {
    event.respondWith(
      caches.open(PYODIDE_CACHE_NAME).then((cache) => {
        return cache.match(event.request).then((cached) => {
          if (cached) return cached;
          return fetch(event.request).then((response) => {
            if (response && response.status === 200) {
              cache.put(event.request, response.clone());
            }
            return response;
          }).catch(() => cached);
        });
      })
    );
    return;
  }

  // 1. Cache-first strategy for Vite hashed static bundle assets (/assets/*)
  if (url.pathname.startsWith('/assets/')) {
    event.respondWith(
      caches.match(event.request).then((cached) => {
        return (
          cached ||
          fetch(event.request).then((response) => {
            if (response && response.status === 200) {
              const clone = response.clone();
              caches.open(CACHE_NAME).then((cache) => cache.put(event.request, clone));
            }
            return response;
          })
        );
      })
    );
    return;
  }

  // 2. Stale-while-revalidate strategy for navigation requests (HTML pages)
  if (event.request.mode === 'navigate') {
    event.respondWith(
      caches.match('/').then((cached) => {
        const fetchPromise = fetch(event.request)
          .then((response) => {
            if (response && response.status === 200) {
              const clone = response.clone();
              caches.open(CACHE_NAME).then((cache) => cache.put('/', clone));
            }
            return response;
          })
          .catch(() => cached);

        return cached || fetchPromise;
      })
    );
    return;
  }

  // 3. Cache fallback for general static assets
  event.respondWith(
    caches.match(event.request).then((cached) => {
      return (
        cached ||
        fetch(event.request).then((response) => {
          if (response && response.status === 200) {
            const clone = response.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(event.request, clone));
          }
          return response;
        }).catch(() => cached)
      );
    })
  );
});
