var dataCacheName = 'weatherData-v2';
var cacheName = 'weatherPWA-final-2';
var filesToCache = [
  '/',
  '/index.html',
  '/static/css/main.ad94b747.css',
  '/static/js/main.e059cf00.js',
  '/lib/bootstrap-4.0.0-dist/css/bootstrap.min.css',
  '/lib/bootstrap-4.0.0-dist/js/bootstrap.min.js',
  '/lib/fontawesome-free-5.0.8/css/fontawesome-all.min.css',
  '/lib/jquery-3.2.1/jquery.min.js',
  '/lib/popper-1.12.9/popper.min.js',
  '/images/default-avatar.png',
  '/images/logo.png',
  '/images/quotes-left.png',
  '/images/quotes-right.png',
  '/images/romance.jpg',
];

self.addEventListener('install', function(e) {
  console.log('[ServiceWorker] Install');
  e.waitUntil(
    caches.open(cacheName).then(function(cache) {
      console.log('[ServiceWorker] Caching app shell');
      return cache.addAll(filesToCache);
    })
  );
});

self.addEventListener('activate', function(e) {
  console.log('[ServiceWorker] Activate');
  e.waitUntil(
    // Removing old cache
    caches.keys().then(function(keyList) {
      return Promise.all(keyList.map(function(key) {
        if (key !== cacheName && key !== dataCacheName) {
          console.log('[ServiceWorker] Removing old cache', key);
          return caches.delete(key);
        }
      }));
    })
  );
  /*
   * Fixes a corner case in which the app wasn't returning the latest data.
   * You can reproduce the corner case by commenting out the line below and
   * then doing the following steps: 1) load app for first time so that the
   * initial New York City data is shown 2) press the refresh button on the
   * app 3) go offline 4) reload the app. You expect to see the newer NYC
   * data, but you actually see the initial data. This happens because the
   * service worker is not yet activated. The code below essentially lets
   * you activate the service worker faster.
   */
  return self.clients.claim();
});

self.addEventListener('fetch', function(e) {
  console.log('[Service Worker] Fetch', e.request.url);
  var dataUrl = 'https://query.yahooapis.com/v1/public/yql';
  if (e.request.url.indexOf(dataUrl) > -1) {
    /*
     * When the request URL contains dataUrl, the app is asking for fresh
     * weather data. In this case, the service worker always goes to the
     * network and then caches the response. This is called the "Cache then
     * network" strategy:
     * https://jakearchibald.com/2014/offline-cookbook/#cache-then-network
     */
    e.respondWith(
      caches.open(dataCacheName).then(function(cache) {
        return fetch(e.request).then(function(response){
          cache.put(e.request.url, response.clone());
          return response;
        });
      })
    );
  } else {
    /*
     * The app is asking for app shell files. In this scenario the app uses the
     * "Cache, falling back to the network" offline strategy:
     * https://jakearchibald.com/2014/offline-cookbook/#cache-falling-back-to-network
     */
    e.respondWith(
      caches.match(e.request).then(function(response) {
        return response || fetch(e.request);
      })
    );
  }
});

self.addEventListener('push', function(event) {
  console.log('[Service Worker] Push Received.');
  console.log('[Service Worker] Push had this data: ' + event.data.text());

  const title = 'Test Push Notification';
  const options = {
    body: event.data.text(),
    icon: 'images/icons/icon-32x32.png',
    badge: 'images/badge.png'
  };

  event.waitUntil(self.registration.showNotification(title, options));
});

self.addEventListener('sync', function(event) {
  console.log('Sync event fired!', event);
  if (event.tag == "myFirstSync") {
    event.waitUntil(new Promise(function(resolve, reject) {
      console.log("Start sync...");

      if(!self.token){
        resolve();
      }

      var url="https://www.googleapis.com/drive/v3/files?"
            +"q="+encodeURI("(name contains '.ibook' or name contains '.iBook') and trashed = false and mimeType != 'application/vnd.google-apps.folder'")
            +"&fields="+encodeURI("files(id, name, mimeType, iconLink, description, properties, modifiedTime, size, webContentLink, webViewLink)");

      fetch(url, {
        cache: 'no-cache',
        method: 'GET',
        headers: {
          'Authorization': self.token.token_type + " " + self.token.access_token,
          'content-type': 'application/json',
        },
      })
      .then(response => response.json())
      .then(resJSON=>{
        console.log(resJSON);
        resolve(true);
      })
    }));
  }
});

self.addEventListener('message', function(event){
  var data=event.data;
  if(data.type === 'token'){
    self.token=data.data;
  }
  console.log("SW Received Message: " + event.data);
});
