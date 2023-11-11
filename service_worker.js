self.addEventListener("install", e => {
    // console.log("Install!");
    e.waitUntil(
        caches.open("static").then(cache => {
            // cache static resources
            return cache.addAll(["html.html","app.js","manifest.json", "style.css", "icons/icon-192x192.png"]);
        })
    )

});

self.addEventListener("fetch", e => {
    // console.log('Intercepting fetch request for:', e.request.url);
    e.respondWith(
        // if the response is found in cache, it is got from there
        caches.match(e.request).then(response => {
            return response || fetch(e.request);
        })
    )
});
