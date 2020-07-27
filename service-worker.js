// add your service worker code here
console.log("Hello, from your kind service worker (v1 the second).");


let assets = [
  "/index.html",
  "/main.css",
  "/main.js",
  "/images/cat-1.webp",
  "/images/cat-2.webp",
  "/images/cat-3.webp",
  "/images/cat-4.webp",
  "/images/cat-5.webp",
  "/images/cat-6.webp",
  "/images/cat-7.webp",
  "/images/cat-8.webp",
  "/images/cat-9.webp",
  "/images/cat-10.webp",
  "/images/cat-11.webp",
  "/images/cat-12.webp",
  'https://cat-fact.herokuapp.com/facts'
]


self.addEventListener('install', function (event) {
  event.waitUntil(
    caches.open('v1').then(function (cache) {
      console.log("Endpoints to be cached: ", apiUrl);
      return cache.addAll([...assets]);
    })
  );
});

self.addEventListener('fetch', function (event) {
  event.respondWith(caches.match(event.request).then(function (response) {
    // caches.match() always resolves
    // but in case of success response will have value
    if (response !== undefined) {
      return response;
    } else {
      return fetch(event.request).then(function (response) {
        // response may be used only once
        // we need to save clone to put one copy in cache
        // and serve second one
        let responseClone = response.clone();

        caches.open('v1').then(function (cache) {
          cache.put(event.request, responseClone);
        });
        return response;
      }).catch(function () {
        return caches.match('v1');
      });
    }
  }));
});

// Try to get data from the cache, but fall back to fetching it live.
async function getData() {
  const cacheVersion = 1;
  const cacheName = `myapp-${cacheVersion}`;
  const url = 'https://jsonplaceholder.typicode.com/todos/1';
  let cachedData = await getCachedData(cacheName, url);

  if (cachedData) {
    console.log('Retrieved cached data');
    return cachedData;
  }

  console.log('Fetching fresh data');

  const cacheStorage = await caches.open(cacheName);
  await cacheStorage.add(url);
  cachedData = await getCachedData(cacheName, url);
  await deleteOldCaches(cacheName);

  return cachedData;
}
