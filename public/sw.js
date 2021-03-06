self.addEventListener('install', (e) => {
  console.log('sw installed', e);
  e.waitUntil(
    caches.open('static')
      .then((cache) => console.log('This is the sw cache', cache))
  );
});
self.addEventListener('activate', (e) => {
  console.log('sw activated', e);
  return self.clients.claim();
});
self.addEventListener('fetch', (e) => {
  console.log('fetching items', e);
});

