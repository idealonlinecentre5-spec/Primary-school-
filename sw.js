const N='sms-v6',F=['school.html','manifest.json'];
self.addEventListener('install',e=>e.waitUntil(caches.open(N).then(c=>c.addAll(F)).then(()=>self.skipWaiting())));
self.addEventListener('activate',e=>e.waitUntil(caches.keys().then(k=>Promise.all(k.filter(x=>x!=N).map(x=>caches.delete(x)))).then(()=>clients.claim())));
const keep=(r,q)=>{if(r.ok)caches.open(N).then(x=>x.put(q,r.clone()));return r};
self.addEventListener('fetch',e=>{if(e.request.method!='GET')return;const q=e.request,same=new URL(q.url).origin==location.origin;
e.respondWith(same?fetch(q).then(r=>keep(r,q)).catch(()=>caches.match(q,{ignoreSearch:true})):caches.match(q).then(c=>c||fetch(q).then(r=>keep(r,q))))});
