importScripts("/lib/localForage/localforage.min.js");

var dataCacheName = 'weatherData-v2';
var cacheName = 'weatherPWA-final-2';
var filesToCache = [
  '/',
  '/index.html',
  '/static/css/main.82807508.css',
  '/static/js/main.8806800a.js',
  '/lib/bootstrap-4.0.0-dist/css/bootstrap.min.css',
  '/lib/bootstrap-4.0.0-dist/js/bootstrap.min.js',
  '/lib/fontawesome-free-5.0.8/css/fontawesome-all.min.css',
  '/lib/jquery-3.2.1/jquery.min.js',
  '/lib/popper-1.12.9/popper.min.js',
  '/lib/localForage/localforage.min.js',
  '/images/default-avatar.png',
  '/images/logo.png',
  '/images/quotes-left.png',
  '/images/quotes-right.png',
  '/images/romance.jpg',
];
const KEY_LIST_BOOK = 'list_books';
const DATA_FOLDER = "iBookData";

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
      if(!self.token){
        //chưa đăng nhập
        resolve();
      }

      console.log("Start sync...");

      var list_promise=[];
      //local file
      list_promise.push(getLocalFile());
      //remote file
      list_promise.push(getRemoteFile());

      var localFiles, remoteFiles;

      Promise.all(list_promise)
      .then(results=>{
        localFiles = results[0] || [];
        remoteFiles = results[1] || [];

        console.log("local", localFiles);
        console.log("remote", remoteFiles);

        //đấy file lên google drive
        var list_promise_push = [];

        localFiles.forEach(file=>{
          if (file.status_id === 1) {
            // file mới tạo
            var p=getAppDataFolder().then(folder=>{
              return newRemoteFile(file.name + ".ibook", "application/vnd.google-apps.document", folder.id);
            })
            .then(createdFile=>{
              setBookSynced(file.id, createdFile.id);

              // update nội dung
              return updateRemoteFileContent(createdFile.id, file.content);
            });

            list_promise_push.push(p);
          } else if (file.status_id === 2) {
            // file đã bị thay đổi => cần đồng bộ
            var p=updateRemoteFileContent(file.id, file.content);
            list_promise_push.push(p);
          } else if (file.status_id === 3) {
            //xoá
          }
        });

        return Promise.all(list_promise_push);
      })
      .then(async ()=>{
        //lấy file từ google drive về
        for (var i = 0; i < remoteFiles.length; i++) {
          console.log(i);
          await downloadFile(remoteFiles[i].id, remoteFiles[i].name, "", 4);
        }
      })
      .catch(error=>reject(error));

      resolve();
    }));
  }
});

self.addEventListener('message', function(event){
  var data=event.data;
  if(data.type === 'token'){
    self.token=data.data;

    //tạo DATA_FOLDER để lưu sách
    getAppDataFolder();
  }
  console.log("SW Received Message: ", event.data);
});

/**
 * Cấu trúc 1 sách
 * @property id {string} - id sách (nếu đã được đồng bộ ? current_timestamp : google drive id)
 * @property name {string} - tên sách
 * @property date_created {timestamp} - ngày tạo sách
 * @property date_modified {timestamp} - ngày chỉnh sách
 * @property status_id {int} - 1: mới tạo, 2: bị thay đổi nội dung, 3: xoá, 4: đã đồng bộ trên drive
 * @property chapters {array} - chứa các chapter {id, name, content}
 */

/**
 * Lấy sách từ local
 */
function getLocalFile() {
  return new Promise(function(resolve, reject) {
    localforage.getItem(KEY_LIST_BOOK)
    .then(list_books=>{
      resolve(JSON.parse(list_books) || []);
    })
    .catch(err=>reject(err));
  });
}

/**
 * Lưu sách vào local
 */
function setLocalFile(list_books) {
  return localforage.setItem(KEY_LIST_BOOK, JSON.stringify(list_books));
}

/**
 * Thêm 1 sách vào local storage
 */
function downloadFile(id, name, content="", status_id=1) {
  return new Promise(function(resolve, reject) {
    var list_books, fileIndex;

    getLocalFile()
    .then(l=>{
      list_books = l;

      var index=list_books.findIndex(book=>book.id===id);
      if(index !== -1){
        fileIndex = index;
        return Promise.resolve();
      }
      var indexExt = name.indexOf('.ibook');
      if(indexExt !== -1){
        name = name.substring(0, indexExt);
      }

      list_books.push({
        id: id,
        name: name,
        content: content,
        status_id: status_id,
      });

      fileIndex = list_books.length-1;

      return Promise.resolve();
    })
    .then(()=>{
      return getRemoteFileContent(list_books[fileIndex].id);
    })
    .then(content=>{
      console.log(content);
      list_books[fileIndex].content = content;
      return setLocalFile(list_books);
    })
    .then(()=>resolve())
    .catch(err=>reject(err));
  });
}

/**
 * Thay đổi status_id của file
 */
function setBookSynced(id, driveId) {
  return getLocalFile()
  .then(list_books=>{
    var index=list_books.findIndex(book=>book.id===id);
    list_books[index].id=driveId;
    list_books[index].status_id = 4;

    return setLocalFile(list_books);
  });
}

/**
 * Lấy sách từ Google Drive
 */
function getRemoteFile() {
  var url="https://www.googleapis.com/drive/v3/files?"
        +"q="+encodeURI("(name contains '.ibook' or name contains '.iBook') and trashed = false and mimeType != 'application/vnd.google-apps.folder'")
        +"&fields="+encodeURI("files(id, name, mimeType, iconLink, description, properties, modifiedTime, size, webContentLink, webViewLink)");

  return new Promise(function(resolve, reject) {
    fetch(url, {
      cache: 'no-cache',
      method: 'GET',
      headers: {
        'Authorization': self.token.token_type + " " + self.token.access_token,
        'content-type': 'application/json',
      },
    })
    .then(response => response.json())
    .then(response => {
      resolve(response.files || []);
    })
    .catch(err=>reject(err));
  });
}

/**
 * Lấy nội dung sách từ Google Drive
 */
function getRemoteFileContent(fileId) {
  var url="https://www.googleapis.com/drive/v3/files/" + fileId + "/export?"
        +"mimeType="+encodeURI("text/plain");

  return new Promise(function(resolve, reject) {
    fetch(url, {
      cache: 'no-cache',
      method: 'GET',
      headers: {
        'Authorization': self.token.token_type + " " + self.token.access_token,
        'content-type': 'application/json',
      },
    })
    .then(response => {
      if(response.ok)
        return response.text();
      else
        return Promise.reject("Fail");
    })
    .then(response => {
      console.log(response);
      resolve(response);
    })
    .catch(err=>reject(err));
  });
}

/**
 * Tạo 1 file/folder mới trên Google Drive
 */
function newRemoteFile(name, mimeType="application/vnd.google-apps.document", parent_id=null) {
  return new Promise(function(resolve, reject) {
    console.log("Tạo file", name);
    var url="https://www.googleapis.com/drive/v3/files?"
          +"fields="+encodeURI("id, name, mimeType, iconLink, description, properties, modifiedTime, size, webContentLink, webViewLink");
    fetch(url, {
      cache: 'no-cache',
      method: 'POST',
      headers: {
        'Authorization': self.token.token_type + " " + self.token.access_token,
        'content-type': 'application/json',
      },
      body: JSON.stringify({
        'name' : name,
        'mimeType' : mimeType,
        'parents': parent_id ? [parent_id] : null,
      }),
    })
    .then(response => response.json())
    .then(response=>{
      console.log(response);
      return resolve(response);
    })
    .catch(err=>reject(err.message || err));
  });
}

/**
 * Lấy folder để lưu sách trên Google Drive
 */
function getAppDataFolder() {
  return new Promise(function(resolve, reject) {
    console.log("Lấy DATA_FOLDER");
    var url="https://www.googleapis.com/drive/v3/files?"
          +"q="+encodeURI("name = '" + DATA_FOLDER + "' and trashed = false and mimeType = 'application/vnd.google-apps.folder'")
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
    .then(response => {
      console.log(response);
      if(Array.isArray(response.files) && response.files.length > 0){
        return resolve(response.files[0]);
      }

      //don not find data folder
      console.log("Không tìm thấy DATA_FOLDER");
      return newRemoteFile(DATA_FOLDER, 'application/vnd.google-apps.folder');
    })
    .then(folder=>resolve(folder))
    .catch(err=>reject(err));
  });
}

/**
 * Update file content
 */
function updateRemoteFileContent(fileId, content) {
  console.log("Cập nhật nội dung file", fileId, content);
  return fetch("https://www.googleapis.com/upload/drive/v3/files/" + fileId + "?uploadType=media", {
    cache: 'no-cache',
    method: 'PATCH',
    headers: {
      'Authorization': self.token.token_type + " " + self.token.access_token,
      'content-type': 'application/json',
    },
    body: content,
  })
  .then(response => response.json());
}
