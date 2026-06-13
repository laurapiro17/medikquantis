/* MedikQuantis service worker — conservative, offline-capable.
 *
 * Design goal: NEVER degrade the online experience. Navigations are
 * network-first (online users always get fresh HTML); only when the network
 * fails do we serve a cached page. Content-hashed Next static assets are
 * cache-first (safe because a new deploy emits new filenames). The /api/*
 * routes are never cached — clinical computations must always be live.
 *
 * Net effect: previously visited calculator pages keep working offline (a real
 * point-of-care win in dead-zone wards), with zero staleness risk while online.
 */
const VERSION = "v1";
const STATIC_CACHE = `mq-static-${VERSION}`;
const PAGE_CACHE = `mq-pages-${VERSION}`;
const OFFLINE_FALLBACK = "/ca";

self.addEventListener("install", () => {
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    (async () => {
      const keys = await caches.keys();
      await Promise.all(
        keys
          .filter((k) => !k.endsWith(VERSION))
          .map((k) => caches.delete(k)),
      );
      await self.clients.claim();
    })(),
  );
});

self.addEventListener("fetch", (event) => {
  const req = event.request;
  if (req.method !== "GET") return;

  const url = new URL(req.url);
  if (url.origin !== self.location.origin) return; // only same-origin
  if (url.pathname.startsWith("/api/")) return; // live medical compute — never cache

  // Content-hashed, immutable assets → cache-first.
  if (
    url.pathname.startsWith("/_next/static/") ||
    url.pathname.startsWith("/icons/")
  ) {
    event.respondWith(cacheFirst(req, STATIC_CACHE));
    return;
  }

  // HTML navigations → network-first, cache fallback when offline.
  if (req.mode === "navigate") {
    event.respondWith(networkFirst(req, PAGE_CACHE));
  }
});

async function cacheFirst(req, cacheName) {
  const cache = await caches.open(cacheName);
  const hit = await cache.match(req);
  if (hit) return hit;
  const res = await fetch(req);
  if (res && res.ok) cache.put(req, res.clone());
  return res;
}

async function networkFirst(req, cacheName) {
  const cache = await caches.open(cacheName);
  try {
    const res = await fetch(req);
    if (res && res.ok) cache.put(req, res.clone());
    return res;
  } catch (err) {
    const hit = await cache.match(req);
    if (hit) return hit;
    const fallback = await cache.match(OFFLINE_FALLBACK);
    if (fallback) return fallback;
    throw err;
  }
}
