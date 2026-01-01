/* eslint-disable no-restricted-globals */

const CACHE_VERSION = 'v2';
const APP_CACHE = `jt-app-${CACHE_VERSION}`;
const RUNTIME_CACHE = `jt-runtime-${CACHE_VERSION}`;
const OFFLINE_URL = '/offline';

const PRECACHE_URLS = [
  '/',
  '/app',
  '/prompts',
  '/guides',
  '/privacy',
  OFFLINE_URL,
  '/manifest.webmanifest',
  '/icons/icon-192.png',
  '/icons/icon-192-maskable.png',
  '/icons/icon-512.png',
  '/icons/icon-512-maskable.png',
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    (async () => {
      const cache = await caches.open(APP_CACHE);
      await cache.addAll(PRECACHE_URLS);
      self.skipWaiting();
    })()
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    (async () => {
      const keys = await caches.keys();
      await Promise.all(
        keys
          .filter((key) => !key.endsWith(CACHE_VERSION))
          .map((key) => caches.delete(key))
      );

      if (self.registration.navigationPreload) {
        await self.registration.navigationPreload.enable();
      }

      self.clients.claim();
    })()
  );
});

function isCacheableResponse(response) {
  if (!response) return false;
  if (response.status !== 200) return false;
  return response.type === 'basic' || response.type === 'cors';
}

self.addEventListener('fetch', (event) => {
  const request = event.request;
  if (request.method !== 'GET') return;

  const url = new URL(request.url);

  // Only handle same-origin requests.
  if (url.origin !== self.location.origin) return;

  // Navigation: network-first, fallback to cache/offline page.
  if (request.mode === 'navigate') {
    event.respondWith(
      (async () => {
        try {
          const preload = await event.preloadResponse;
          if (preload) {
            const cache = await caches.open(RUNTIME_CACHE);
            cache.put(request, preload.clone());
            return preload;
          }

          const response = await fetch(request);
          const cache = await caches.open(RUNTIME_CACHE);
          cache.put(request, response.clone());
          return response;
        } catch (error) {
          const cache = await caches.open(APP_CACHE);
          return (
            (await cache.match(request, { ignoreSearch: true })) ||
            (await cache.match(OFFLINE_URL))
          );
        }
      })()
    );
    return;
  }

  // Static assets: cache-first.
  event.respondWith(
    (async () => {
      const cache = await caches.open(RUNTIME_CACHE);
      const cached = await cache.match(request);
      if (cached) return cached;

      try {
        const response = await fetch(request);
        if (isCacheableResponse(response)) {
          cache.put(request, response.clone());
        }
        return response;
      } catch (error) {
        return cached;
      }
    })()
  );
});
