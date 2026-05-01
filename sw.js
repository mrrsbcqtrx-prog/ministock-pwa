const CACHE_NAME = 'ministock-v1';
const urlsToCache = [
  '/ministock-pwa/',
  '/ministock-pwa/index.html',
  '/ministock-pwa/dashboard.html',
  '/ministock-pwa/productos.html',
  '/ministock-pwa/agregar_producto.html',
  '/ministock-pwa/movimiento.html',
  '/ministock-pwa/alertas.html',
  '/ministock-pwa/app.js',
  '/ministock-pwa/manifest.json',
  'https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css',
  'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(urlsToCache))
  );
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request).then(response => response || fetch(event.request))
  );
});