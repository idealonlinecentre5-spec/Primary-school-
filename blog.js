import{initializeApp}from"https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import{getFirestore,collection,getDocs,getDoc,addDoc,doc}from"https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";
import{calc,sheet,printSheet}from"./marksheet.js";
const db=getFirestore(initializeApp({apiKey:"AIzaSyBlz3SJwscg0ebDXiZu3I6fpQC0qdxv0zI",authDomain:"mcs-habibpur.firebaseapp.com",projectId:"mcs-habibpur",storageBucket:"mcs-habibpur.firebasestorage.app",messagingSenderId:"95047938599",appId:"1:95047938599:web:754724808fed90ef2ed402"}));
const $=(...ids)=>{for(const i of ids){const x=document.getElementById(i);if(x)return x}return null},
e=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c])),
put=(ids,h)=>{const x=$(...ids);if(x)x.innerHTML=h},
txt=(id,t)=>{const x=$(id);if(x&&t)x.textContent=t},
M=!!$('mcsNoticeList'),
empty=t=>`<div class="${M?'mcs-empty':'empty'}">${t}</div>`,
all=async c=>(await getDocs(collection(db,c))).docs.map(d=>({id:d.id,...d.data()})),
fail=ids=>put(ids,empty('তথ্য লোড করা যাচ্ছে না। একটু পরে আবার চেষ্টা করুন।')),
https=u=>/^https:\/\//i.test(u||'');
const NL=['noticeList','mcsNoticeList'],TL=['teacherList','mcsTeachers'],SL=['subjectList','mcsSubjects'];

all('notices').then(a=>{
  a.sort((x,y)=>String(y.date).localeCompare(String(x.date)));
  const m=a.filter(x=>x.marquee!==false);
  if(M){
    put(['mcsMarquee'],m.length?m.map(x=>`<span class="mcs-marquee-item">📢 ${e(x.title)}<span class="mcs-marquee-date">${e(x.date)}</span></span>`).join(''):'<span class="mcs-marquee-item">📢 বর্তমানে কোনো নোটিশ নেই</span>');
    put(NL,a.length?a.map(x=>`<div class="mcs-notice-card"><h3>📢 ${e(x.title)}</h3><div class="mcs-date">📅 ${e(x.date)}</div><div class="mcs-details">${e(x.details)}</div></div>`).join(''):empty('বর্তমানে কোনো নোটিশ নেই।'));
  }else{
    txt('marqueeText',m.map(x=>x.title).filter(Boolean).join('  •  ')||'কোনো নোটিশ নেই।');
    put(NL,a.length?a.map(x=>`<article class="notice"><h3>${e(x.title)}</h3><time>${e(x.date)}</time><div>${e(x.details)}</div></article>`).join(''):empty('কোনো নোটিশ নেই।'));
  }
}).catch(()=>fail(NL));

all('teachers').then(a=>put(TL,a.length?a.map(x=>M
  ?`<div class="mcs-teacher-card"><div class="mcs-teacher-photo">${https(x.photo)?`<img src="${e(x.photo)}" alt="">`:'👨‍🏫'}</div><h3>${e(x.name)}</h3><p>${e(x.post)}</p><p>${e(x.subject)}</p><p>${e(x.mobile)}</p></div>`
  :`<div class="card"><h3>${e(x.name)}</h3><p>${e(x.post)}</p><p>${e(x.subject)}</p></div>`).join(''):empty('শিক্ষকের তথ্য নেই।'))).catch(()=>fail(TL));

all('subjects').then(a=>put(SL,a.length?a.map(x=>M
  ?`<div class="mcs-subject-card"><h3>📚 ${e(x.name)}</h3><p><strong>শ্রেণি:</strong> ${e(x.cls)}</p><p>${e(x.details)}</p></div>`
  :`<div class="card"><h3>${e(x.name)}</h3><p>শ্রেণি: ${e(x.cls)}</p></div>`).join(''):empty('কোনো বিষয় নেই।'))).catch(()=>fail(SL));

getDoc(doc(db,'settings','main')).then(r=>{
  if(!r.exists())return;const d=r.data();
  if(d.school_name)document.title=d.school_name;
  if(d.foundation)txt('foundation','পরিচালনায় '+d.foundation);
  [['school_name','schoolName'],['slogan','heroText'],['hero_badge','heroBadge'],['hero_title','heroTitle'],['hero_text','heroText'],['hero_button','heroButton'],
   ['about_title','aboutTitle'],['about_title','aboutTitle2'],['about_text','aboutText'],['about_text','aboutText2'],['admission_text','admissionText'],
   ['contact_address','address'],['contact_phone','phone'],['footer_text','footerText']].forEach(([k,id])=>txt(id,d[k]));
  const IM=u=>/^data:image\/(jpeg|png|webp);base64,[A-Za-z0-9+\/=]+$/.test(u||'')||https(u),lg=d.logo_data||d.logo_url;
  if(IM(lg)&&$('logoBox'))$('logoBox').innerHTML=`<img src="${e(lg)}" style="width:100%;height:100%;object-fit:cover" alt="Logo">`;
  const RS=document.documentElement.style;[['color_dark','--dk'],['color_menu','--mn'],['color_accent','--ac'],['color_blue','--bl'],['color_bg','--bg']].forEach(([k,v])=>{if(/^#[0-9a-f]{6}$/i.test(d[k]||''))RS.setProperty(v,d[k])});
  if(d.top_text)txt('topText',d.top_text);
  String(d.hide||'').split(',').map(x=>x.trim()).filter(x=>/^[a-z]+$/.test(x)).forEach(id=>{const x=$(id);if(x)x.style.display='none'});
  if(https(d.facebook_url)&&$('fbLink'))$('fbLink').href=d.facebook_url;
  if(d.contact_whatsapp&&$('wa'))$('wa').href='https://wa.me/'+String(d.contact_whatsapp).replace(/\D/g,'');
  const L=k=>String(d[k]||'').split('\n').map(x=>x.trim()).filter(Boolean),S=L('slides').filter(https);
  if(S.length&&$('slider')){$('slider').innerHTML=S.map((x,i)=>`<img src="${e(x)}" class="${i?'':'on'}" alt="">`).join('');let n=0;if(S.length>1)setInterval(()=>{const c=$('slider').children;c[n].classList.remove('on');n=(n+1)%c.length;c[n].classList.add('on')},4000)}
  if(d.head_message)txt('headMsg',d.head_message);if(d.head_name)txt('headName',d.head_name);
  const hp=d.head_photo_data||d.head_photo;if(IM(hp)&&$('headPhoto'))$('headPhoto').innerHTML=`<img src="${e(hp)}" alt="">`;
  const K=L('links').map(x=>x.split('|')).filter(q=>q[1]&&https(q[1].trim()));
  if(K.length&&$('linkList'))$('linkList').innerHTML=K.map(q=>`<a href="${e(q[1].trim())}" target="_blank">▶ ${e(q[0])}</a>`).join('');
  const Gl=L('gallery').filter(https);
  if(Gl.length&&$('galleryList'))$('galleryList').innerHTML=Gl.map(x=>`<a href="${e(x)}" target="_blank"><img src="${e(x)}" alt="" loading="lazy"></a>`).join('');
}).catch(()=>{});

const sid=$('studentId','mcsStudentId'),RB=['resultBox','mcsResultArea'];
if(sid)sid.insertAdjacentHTML('afterend','<input id="mcsPin" type="password" inputmode="numeric" placeholder="PIN" style="max-width:110px">');
window.loadResult=window.mcsSearchResult=async()=>{
  const id=sid.value.trim(),pin=($('mcsPin').value||'').trim();
  if(!id||!pin)return put(RB,empty('Student ID ও PIN লিখুন।'));
  if(id.includes('/')||pin.includes('/'))return put(RB,empty('ID বা PIN সঠিক নয়।'));
  put(RB,`<div class="${M?'mcs-loading':'loading'}">ফলাফল খোঁজা হচ্ছে...</div>`);
  try{
    const r=await getDoc(doc(db,'results',id+'-'+pin));
    if(!r.exists())return put(RB,empty('ID বা PIN মেলেনি। আবার দেখুন।'));
    const d=r.data(),c=calc(d);window.mcsPrintSheet=()=>printSheet(sheet(d));
    put(RB,`<div class="card"><p><b>${e(d.name)}</b> · ${e(d.cls)} · ${e(d.exam)}</p>`+(M
      ?`<table class="mcs-result-table"><tr><th>বিষয়</th><th>পূর্ণমান</th><th>প্রাপ্ত নম্বর</th><th>গ্রেড</th></tr>${c.rows.map(x=>`<tr><td>${e(x.subject)}</td><td>${x.full}</td><td>${x.t}</td><td><b>${x.g}</b></td></tr>`).join('')}</table>`
      :c.rows.map(x=>`<p><b>${e(x.subject)}</b> — ${x.t} / ${x.full} — ${x.g}</p>`).join(''))
      +`<p><b>GPA ${c.gpa.toFixed(2)} · গ্রেড ${c.lg}</b></p><button onclick="mcsPrintSheet()" style="padding:11px 18px;background:#073b78;color:#fff;border:0;border-radius:8px;font:inherit;font-weight:700;cursor:pointer">📄 মার্কশিট প্রিন্ট / ডাউনলোড</button></div>`);
  }catch(x){put(RB,empty('সংযোগ করা যাচ্ছে না।'))}
};

const f=document.querySelector('#admission form')||document.querySelector('form[action*="script.google.com"]');
if(f){
  ['onsubmit','action','target'].forEach(a=>f.removeAttribute(a));
  const msg=document.createElement('p');msg.style.cssText='text-align:center;font-weight:600';f.appendChild(msg);
  f.onsubmit=async ev=>{
    ev.preventDefault();
    const g=(...ns)=>{for(const n of ns){const x=f.elements[n];if(x&&x.value)return x.value.trim()}return''},b=f.querySelector('button'),t=b?b.textContent:'';
    if(b){b.disabled=true;b.textContent='⏳ পাঠানো হচ্ছে...'}msg.style.color='#664d03';msg.textContent='আপনার আবেদন পাঠানো হচ্ছে...';
    try{
      await addDoc(collection(db,'admissions'),{name:g('নাম','name'),gender:g('লিঙ্গ','gender'),dob:g('জন্ম তারিখ','dob'),class:g('শ্রেণি','class','cls'),guardian:g('অভিভাবকের নাম','guardian'),mobile:g('অভিভাবকের মোবাইল','mobile','phone'),address:g('ঠিকানা','address'),date:g('ভর্তির তারিখ','date'),createdAt:Date.now()});
      msg.style.color='#0f5132';msg.textContent='আপনার ভর্তি আবেদন জমা হয়েছে। ধন্যবাদ।';f.reset();
    }catch(x){msg.style.color='#842029';msg.textContent='আবেদন পাঠানো যায়নি। নাম ও মোবাইল ঠিকমতো দিয়ে আবার চেষ্টা করুন।'}
    if(b){b.disabled=false;b.textContent=t}
  };
}
