self.addEventListener("install", e => {
    console.log("Service Worker: Install");
    e.waitUntil(
        caches.open("static").then(cache => {
            console.log("Service Worker: Caching static assets");
            return cache.addAll(["./index.html", "./app.js", "./manifest.json", "./style.css", "./icons/icon-192x192.png"]);
        }).catch(error => {
            console.error("Service Worker: Caching failed", error);
        })
    );
});

self.addEventListener("fetch", e => {
    console.log('Service Worker: Fetch event for:', e.request.url);
    e.respondWith(
        caches.match(e.request).then(response => {
            if (response) {
                console.log('Service Worker: Found in cache:', e.request.url);
                return response;
            }
            console.log('Service Worker: Network request for:', e.request.url);
            return fetch(e.request).then(networkResponse => {
                if (networkResponse.status === 404) {
                    console.error('Service Worker: Resource not found:', e.request.url);
                }
                return networkResponse;
            }).catch(error => {
                console.error('Service Worker: Fetch failed:', e.request.url, error);
                throw error;
            });
        }).catch(error => {
            console.error('Service Worker: Error in fetch handler', error);
            throw error;
        })
    );
});
