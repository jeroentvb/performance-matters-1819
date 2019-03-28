/* global self, caches, fetch */

const cacheName = 'core-cache'

const coreCache = [
  '/offline',
  '/',
  '/images/oba.ico',
  '/images/oba-logo.svg',
  '/manifest.json'
]

self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(cacheName)
      .then(cache => cache.addAll(coreCache))
      .then(() => self.skipWaiting())
  )
})

self.addEventListener('activate', e => {
  console.log(e)
  // e.waitUntil(self.clients.claim())
})

// self.addEventListener('fetch', e => {
//   e.respondWith(
//     caches.match(e.request)
//       .then(match => {
//         if (match) return match
//         fetch(e.request)
//           .then(res => {
//             const responseClone = res.clone()
//
//             caches.open(cacheName)
//               .then(cache => cache.put(e.request, responseClone))
//             return res
//           })
//       })
//
//     // fetch(e.request)
//     //   .then(res => {
//     //     const responseClone = res.clone()
//     //     caches.open(cacheName)
//     //       .then(cache => {
//     //         cache.put(e.request, responseClone)
//     //       })
//     //     return res
//     //   })
//     //   .catch(err => {
//     //     console.log(err)
//     //     caches.match(e.request)
//     //       .then(res => res)
//     //   })
//   )
// })

self.addEventListener('fetch', e => {
  e.respondWith(
    // caches.match(e.request)
    //   .then(response => {
    //     if (response) return response
    //     return fetch(e.request)
    //   })
    caches.open(cacheName)
      .then(cache => cache.match(e.request)
        .then(match => match || fetch(e.request)
          .then(response => {
            let responseClone = response.clone()

            caches.open(cacheName)
              .then(cache => cache.put(e.request, responseClone))

            return response
          }))
      )
  )
})

// self.addEventListener('install', function (e) {
//   e.waitUntil(
//     caches.open('v1').then(function (cache) {
//       return cache.addAll([
//         'css/styles.min.css',
//         'js/serviceWorker.js',
//         'error.html'
//       ])
//     })
//   )
// })
//
// self.addEventListener('activate', function (e) {
//   console.log('Service Worker activated')
// })
//
// self.addEventListener('fetch', function (e) {
//   e.respondWith(
//     caches.match(e.request)
//       .then(function (resp) {
//         return resp || fetch(e.request)
//           .then(response => {
//             let responseClone = response.clone()
//             caches.open('v1')
//               .then(cache => {
//                 cache.put(e.request, responseClone)
//               })
//
//             return response
//           })
//       }).catch(() => caches.match('error.html'))
//   )
// })
