const CACHE_NAME = 'kemedar-v1';
const OFFLINE_CACHE = 'kemedar-offline';

const URLS_TO_CACHE = [
  '/',
  '/index.html',
  '/offline.html',
  '/mobile',
  '/search-properties',
  '/kemetro',
  '/dashboard',
  '/manifest.json'
];

// Helper: Check if URL matches pattern
function matchesPattern(url, patterns) {
  return patterns.some(pattern => {
    const regex = pattern.replace(/\*/g, '.*');
    return new RegExp(`^${regex}`).test(url);
  });
}

// Install Service Worker
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(URLS_TO_CACHE);
    })
  );
  self.skipWaiting();
});

// Activate Service Worker
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME && cacheName !== OFFLINE_CACHE) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  self.clients.claim();
});

// Fetch Event with multiple caching strategies
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Skip non-GET requests
  if (request.method !== 'GET') {
    return;
  }

  // Strategy 1: NETWORK ONLY (sensitive data)
  if (matchesPattern(url.pathname, ['/api/orders/*', '/api/payments/*', '/api/messages/*', '/checkout/*'])) {
    event.respondWith(fetch(request).catch(() => caches.match('/offline.html')));
    return;
  }

  // Strategy 2: CACHE FIRST (static assets)
  if (matchesPattern(url.pathname, ['/images/*', '/icons/*', '/css/*', '/js/*'])) {
    event.respondWith(
      caches.match(request).then((response) => {
        if (response) return response;
        return fetch(request).then((response) => {
          if (!response || response.status !== 200) return response;
          const cache = caches.open(CACHE_NAME);
          cache.then((c) => c.put(request, response.clone()));
          return response;
        }).catch(() => caches.match('/offline.html'));
      })
    );
    return;
  }

  // Strategy 3: NETWORK FIRST (dynamic content)
  if (matchesPattern(url.pathname, ['/api/properties/*', '/api/projects/*', '/search-properties*', '/api/users/*'])) {
    event.respondWith(
      fetch(request)
        .then((response) => {
          if (!response || response.status !== 200) return response;
          const cache = caches.open(CACHE_NAME);
          cache.then((c) => c.put(request, response.clone()));
          return response;
        })
        .catch(() => {
          return caches.match(request) || caches.match('/offline.html');
        })
    );
    return;
  }

  // Strategy 4: STALE WHILE REVALIDATE (pages)
  event.respondWith(
    caches.match(request).then((cachedResponse) => {
      const fetchPromise = fetch(request).then((response) => {
        if (!response || response.status !== 200) return response;
        const cache = caches.open(CACHE_NAME);
        cache.then((c) => c.put(request, response.clone()));
        return response;
      }).catch(() => caches.match('/offline.html'));

      return cachedResponse || fetchPromise;
    })
  );
});

// Background Sync for failed submissions
self.addEventListener('sync', (event) => {
  if (event.tag === 'sync-property-submission') {
    event.waitUntil(syncPropertySubmission());
  }
  if (event.tag === 'sync-form-data') {
    event.waitUntil(syncFormData());
  }
});

async function syncPropertySubmission() {
  try {
    const db = await openIndexDB();
    const submissions = await getFromDB(db, 'failedSubmissions');
    for (const submission of submissions) {
      const response = await fetch('/api/properties', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(submission.data)
      });
      if (response.ok) {
        await removeFromDB(db, 'failedSubmissions', submission.id);
        notifyClients({ type: 'sync-success', message: '✅ Your listing has been published!' });
      }
    }
  } catch (error) {
    console.log('Background sync will retry:', error);
  }
}

async function syncFormData() {
  // Similar implementation for other form data
}

function notifyClients(message) {
  self.clients.matchAll().then((clients) => {
    clients.forEach((client) => {
      client.postMessage(message);
    });
  });
}

// IndexDB helpers
function openIndexDB() {
  return new Promise((resolve) => {
    const request = indexedDB.open('kemedar-db', 1);
    request.onsuccess = () => resolve(request.result);
    request.onupgradeneeded = () => {
      request.result.createObjectStore('failedSubmissions', { keyPath: 'id' });
    };
  });
}
