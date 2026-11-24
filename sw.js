/**
 * AnyConverter.io — Scoped Service Worker (PWA)
 * Version: ac-pwa-v1
 *
 * Implements a scoped, safe offline cache for the homepage and top 5 tools:
 * - /json-formatter/
 * - /percentage-calculator/
 * - /age-calculator/
 * - /loan-calculator/
 * - /ip-address-lookup/
 *
 * Policy:
 * 1. Network-First for HTML navigation (zero stale HTML risk).
 * 2. Stale-While-Revalidate for same-origin static assets (CSS, JS, icons).
 * 3. Strict Third-Party Exclusion: Never caches AdSense, Google Analytics, or external APIs.
 * 4. Graceful offline fallback for cached client-side tools.
 */

'use strict';

const CACHE_NAME = 'ac-pwa-v1';

// Pre-cached assets: Homepage, top 5 tools, and essential static assets
const PRECACHE_ASSETS = [
  '/',
  '/manifest.webmanifest',
  '/assets/css/style.css',
  '/assets/js/shared.js',
  '/assets/js/shared/analytics.js',
  '/assets/js/shared/pwa.js',
  '/assets/img/logo.svg',
  '/assets/img/favicon.svg',
  '/assets/img/icon-192.png',
  '/assets/img/icon-512.png',
  '/json-formatter/',
  '/assets/js/tools/json-formatter.js',
  '/percentage-calculator/',
  '/assets/js/tools/percentage-calculator.js',
  '/age-calculator/',
  '/assets/js/tools/age-calculator.js',
  '/loan-calculator/',
  '/assets/js/tools/loan-calculator.js',
  '/ip-address-lookup/',
  '/assets/js/tools/ip-address-lookup.js'
];

// Domains and endpoints strictly excluded from caching
const EXCLUDED_HOSTS = [
  'googletagmanager.com',
  'google-analytics.com',
  'googleads.g.doubleclick.net',
  'pagead2.googlesyndication.com',
  'adservice.google.com',
  'doubleclick.net',
  'api.ipify.org',
  'ipapi.co',
  'cloudflare.com'
];

// Install: pre-cache scoped assets and activate immediately
self.addEventListener('install', (event) => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return Promise.allSettled(
        PRECACHE_ASSETS.map((asset) => {
          return cache.add(asset).catch((err) => {
            // Non-critical pre-cache item failure does not block installation
            console.warn('[SW] Pre-cache item failed:', asset, err ? err.message : err);
          });
        })
      );
    })
  );
});

// Activate: clean up older caches and claim clients
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys
          .filter((key) => key !== CACHE_NAME)
          .map((key) => caches.delete(key))
      );
    }).then(() => self.clients.claim())
  );
});

// Fetch: Network-First for HTML, Stale-While-Revalidate for same-origin static assets
self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') {
    return;
  }

  const url = new URL(event.request.url);

  // Strict third-party and API exclusion: never cache third-party domains or external APIs
  if (url.origin !== self.location.origin) {
    return;
  }

  const isExcluded = EXCLUDED_HOSTS.some((host) => url.hostname.includes(host)) ||
    url.pathname.includes('adsbygoogle') ||
    url.pathname.startsWith('/api/');

  if (isExcluded) {
    return;
  }

  // Network-First for HTML navigations to eliminate stale HTML risks
  const isNavigation = event.request.mode === 'navigate' ||
    (event.request.headers.get('accept') && event.request.headers.get('accept').includes('text/html'));

  if (isNavigation) {
    event.respondWith(
      fetch(event.request)
        .then((networkResponse) => {
          if (networkResponse && networkResponse.status === 200) {
            const responseClone = networkResponse.clone();
            caches.open(CACHE_NAME).then((cache) => {
              cache.put(event.request, responseClone);
            });
          }
          return networkResponse;
        })
        .catch(async () => {
          // Offline fallback
          const cached = await caches.match(event.request, { ignoreSearch: true });
          if (cached) {
            return cached;
          }
          const rootFallback = await caches.match('/', { ignoreSearch: true });
          if (rootFallback) {
            return rootFallback;
          }
          return new Response(
            '<!DOCTYPE html><html lang="en"><head><meta charset="utf-8"><title>Offline — AnyConverter</title><style>body{font-family:system-ui,sans-serif;padding:40px;text-align:center;background:#F7F6F3;color:#151515;}h1{color:#B04A45;}</style></head><body><h1>Offline</h1><p>You appear to be offline. AnyConverter tools that have been visited are available offline.</p><p><a href="/">Return to Homepage</a></p></body></html>',
            {
              status: 503,
              statusText: 'Service Unavailable',
              headers: { 'Content-Type': 'text/html; charset=utf-8' }
            }
          );
        })
    );
    return;
  }

  // Stale-While-Revalidate for same-origin static assets (CSS, JS, images, SVG, webmanifest)
  event.respondWith(
    caches.match(event.request, { ignoreSearch: true }).then((cachedResponse) => {
      const fetchPromise = fetch(event.request)
        .then((networkResponse) => {
          if (networkResponse && networkResponse.status === 200) {
            const responseClone = networkResponse.clone();
            caches.open(CACHE_NAME).then((cache) => {
              cache.put(event.request, responseClone);
            });
          }
          return networkResponse;
        })
        .catch(() => cachedResponse);

      return cachedResponse || fetchPromise;
    })
  );
});
