var cacheName = 'v1';
var filesToCache = [
  '/',
  '/index.html',
  '/favicon.ico',
  '/scripts/app.js',
  '/styles/inline.css',
  '/images/clear.png',
  '/images/cloudy-scattered-showers.png',
  '/images/cloudy.png',
  '/images/fog.png',
  '/images/ic_add_white_24px.svg',
  '/images/ic_refresh_white_24px.svg',
  '/images/partly-cloudy.png',
  '/images/rain.png',
  '/images/scattered-showers.png',
  '/images/sleet.png',
  '/images/snow.png',
  '/images/thunderstorm.png',
  '/images/wind.png'
];

self.addEventListener('install', function(e) {
  console.log('[ServiceWorker] Install');
  e.waitUntil(
    // caches: window 전역 캐시 객체 (self.caches와 동일)
    // 캐시 이름을 통해 구분 가능 (버전)
    caches.open(cacheName).then(function(cache) {
      console.log('[ServiceWorker] Caching app shell');

      // addAll을 통해 응답을 캐시로 저장
      // 응답 리스트 중 하나라도 캐시 저장에 실패할 경우 모두 실패로 처리 됨
      return cache.addAll(filesToCache);
    }).then(function () {
      return self.skipWaiting();
    })
  );
});

self.addEventListener('activate', function(e) {
  console.log('[ServiceWorker] Activate');
  e.waitUntil(
    caches.keys().then(function(keyList) {
      return Promise.all(keyList.map(function(key) {
        // 이전에 캐시된 데이터 제거
        if (key !== cacheName) {
          console.log('[ServiceWorker] Removing old cache', key);
          return caches.delete(key);
        }
      }));
    }).then(function () {
      return self.clients.claim();
    })
  );
});

self.addEventListener('fetch', function(e) {
  /**
   * respondWith 참고
   * https://developer.mozilla.org/ko/docs/Web/API/FetchEvent/respondWith
   * 
   * 브라우저의 기본 fetch 핸들링을 막고 스스로 Response에 대한 프라미스를 제공하도록 허용
   */
  e.respondWith(
    caches.match(e.request).then(function(response) {
      // 캐시에 해당 응답이 있을 경우 반환, 없을 경우 새로 fetch
      return response || fetch(e.request);
    })
  );
});
