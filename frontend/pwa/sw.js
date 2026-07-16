self.addEventListener('install', event => {
    event.waitUntil(caches.open('my-cache').then(cache => {
        return cache.addAll([
            './',         
            '/src/styles.css',           
            '/images/logo192.png',
            '/images/logo512.png'
        ]);
    }));
});

self.addEventListener('fetch', event => {
    event.waitUntil(
        caches.match(event.request).then(response => {
            return response || fetch(event.request);
        })
    );
});