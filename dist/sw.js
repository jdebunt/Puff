// Puff Service Worker - Offline support + Push notifications
const CACHE_NAME = 'puff-v1'
const STATIC_ASSETS = [
  '/',
  '/index.html',
  '/manifest.json',
  '/src/main.jsx',
  '/src/App.jsx',
  '/src/styles/global.css',
  '/src/styles/puffMascot.css'
]

// Install event - cache static assets
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('Caching static assets')
        return cache.addAll(STATIC_ASSETS)
      })
      .catch((error) => {
        console.log('Cache failed:', error)
      })
  )
  self.skipWaiting()
})

// Activate event - clean old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys()
      .then((cacheNames) => {
        return Promise.all(
          cacheNames
            .filter((name) => name !== CACHE_NAME)
            .map((name) => caches.delete(name))
        )
      })
  )
  self.clients.claim()
})

// Fetch event - serve from cache, fallback to network
self.addEventListener('fetch', (event) => {
  // Skip non-GET requests
  if (event.request.method !== 'GET') return

  event.respondWith(
    caches.match(event.request)
      .then((cachedResponse) => {
        if (cachedResponse) {
          return cachedResponse
        }
        return fetch(event.request)
          .then((response) => {
            // Don't cache non-successful responses
            if (!response || response.status !== 200 || response.type !== 'basic') {
              return response
            }

            // Clone the response
            const responseToCache = response.clone()

            caches.open(CACHE_NAME)
              .then((cache) => {
                cache.put(event.request, responseToCache)
              })

            return response
          })
      })
      .catch(() => {
        // Offline fallback - return index.html for navigation requests
        if (event.request.mode === 'navigate') {
          return caches.match('/index.html')
        }
      })
  )
})

// Push notification event
self.addEventListener('push', (event) => {
  const options = {
    body: event.data?.text() || 'Time to breathe with Puff!',
    icon: '/icons/puff-192.png',
    badge: '/icons/puff-192.png',
    vibrate: [100, 50, 100],
    data: {
      dateOfArrival: Date.now(),
      primaryKey: 1
    },
    actions: [
      {
        action: 'breathe',
        title: 'Breathe Now',
        icon: '/icons/puff-192.png'
      },
      {
        action: 'later',
        title: 'Later',
        icon: '/icons/puff-192.png'
      }
    ]
  }

  event.waitUntil(
    self.registration.showNotification('Puff', options)
  )
})

// Notification click event
self.addEventListener('notificationclick', (event) => {
  event.notification.close()

  if (event.action === 'breathe') {
    // Open app with quick breathe session
    event.waitUntil(
      clients.openWindow('/?quick=breathe')
    )
  } else {
    // Just open the app
    event.waitUntil(
      clients.openWindow('/')
    )
  }
})

// Background sync for session data (future feature)
self.addEventListener('sync', (event) => {
  if (event.tag === 'sync-sessions') {
    event.waitUntil(
      // Sync session data when back online
      Promise.resolve()
    )
  }
})
