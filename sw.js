const N='sms-v4',F=['school.html','manifest.json'];
self.addEventListener('install',e=>e.waitUntil(caches.open(N).then(c=>c.addAll(F)).then(()=>self.skipWaiting())));
self.addEventListener('activate',e=>e.waitUntil(caches.keys().then(k=>Promise.all(k.filter(x=>x!=N).map(x=>caches.delete(x)))).then(()=>clients.claim())));
self.addEventListener('fetch',e=>{if(e.request.method!='GET')return;e.respondWith(caches.match(e.request,{ignoreSearch:true}).then(c=>{const n=fetch(e.request).then(r=>{if(r.ok)caches.open(N).then(x=>x.put(e.request,r.clone()));return r}).catch(()=>c);return c||n}))});
