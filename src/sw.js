self.addEventListener('install', (e) => {
  console.log('sw installed', e);
});
self.addEventListener('activate', (e) => {
  console.log('sw activated', e);
  return self.clients.claim();
});
self.addEventListener('fetch', (e) => {
  console.log('fetching items', e);
});

