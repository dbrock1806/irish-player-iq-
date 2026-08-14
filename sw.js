const CACHE='irish-player-iq-v1-20260814';
const ASSETS=['./','./index.html','./app.js?v=20260814','./styles.css?v=20260814','./manifest.webmanifest?v=20260814','./icons/icon-192.png','./icons/icon-512.png'];
self.addEventListener('install',event=>{event.waitUntil(caches.open(CACHE).then(c=>c.addAll(ASSETS)).then(()=>self.skipWaiting()))});
self.addEventListener('activate',event=>{event.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(k=>k!==CACHE).map(k=>caches.delete(k)))).then(()=>self.clients.claim()))});
self.addEventListener('fetch',event=>{
 const req=event.request;
 if(req.method!=='GET') return;
 event.respondWith(caches.match(req).then(cached=>cached||fetch(req).then(res=>{
   const copy=res.clone(); caches.open(CACHE).then(c=>c.put(req,copy)); return res;
 }).catch(()=>caches.match('./index.html'))));
});
