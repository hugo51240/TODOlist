const STATIC_CACHE_NAME = "todosApp.v0";

this.addEventListener('install', function (event) {
  self.skipWaiting();
  event.waitUntil(
    caches.open(STATIC_CACHE_NAME).then(function (cache) {
      return cache.addAll([
        '/',
        '/index.html',
        '/css/style.css',
        '/css/background.css',
        '/js/controller.js',
        '/js/ihm.js',
        '/js/apiRequest.js',
        '/js/pwa.js',
        '/manifest.webmanifest'
      ]);
    })
  );
});


self.addEventListener("fetch", (event) => {
  // Nous voulons seulement répondre aux requêtes concernant notre application en testant l'URL de la requête
  event.respondWith(
    caches.open(STATIC_CACHE_NAME).then(function (cache) {
      return cache.match(event.request).then(function (response) {
        return response || fetch(event.request).then(function (networkResponse) {
          cache.put(event.request, networkResponse.clone());
          return networkResponse;
        });
      });
    }),
  );
});
// Si votre condition if() est fausse, alors cet écouteur d'événement ne proposera pas de réponse à la requête.
// Cela laisse l'opportunité à d'autres écouteurs d'événements d'intercepter cette requête pour produire une réponse adaptée.
// Si aucun écouteur d'événement ne propose de réponse à cette requête, alors la requête sera gérée par votre navigateur
// comme si aucun "Service Worker" n'était enregistré


self.addEventListener('activate', function (event) {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheName !== STATIC_CACHE_NAME)
            return caches.delete(cacheName);
        })
      );
    })
  );
});


//réaction au clique sur la notif
self.addEventListener('notificationclick', event => {
  const notification = event.notification;
  const action = event.action;
  if (action === 'close') {
    notification.close();
  } else {
    clients.openWindow('https://fir-test-b22e4.web.app/');
    notification.close();
  }
});


self.addEventListener('push', event => {
  const title = event.data.text();
  const options = {
    body: 'Ajout d\'une tache',
    icon: "icon/favicon-32x32-seochecker-manifest-608.png",
    requireInteraction: true,
    actions: [
      { action: "view", title: "View" },
      { action: "close", title: "Close" }]
  }
  event.waitUntil(
    self.registration.showNotification(title, options)
  );
});

