(()=>{
const WA='77075947244';
const $=s=>document.querySelector(s);
const fmt=n=>Math.round(n).toLocaleString('ru-RU').replace(/ /g,' ')+' ₸';
const waLink=t=>`https://wa.me/${WA}?text=${encodeURIComponent(t)}`;
document.querySelectorAll('[data-wa]').forEach(a=>{a.href=waLink(a.dataset.wa);a.target='_blank';a.rel='noopener'});
const pad=n=>String(n).padStart(2,'0');
const clockStr=()=>{const d=new Date();return `${pad(d.getDate())}.${pad(d.getMonth()+1)}.${d.getFullYear()} ${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`};
const tick=()=>{$('#osdClock').textContent=clockStr();$('#feedClock').textContent=clockStr()};
tick();setInterval(tick,1000);

/* ---- герой: поворот камеры ---- */
const shot=$('#heroShot'),himg=$('#spinImg'),hint=$('#spinHint');
const FR=25;let cur=0,loaded=false,target=0,timer=null;
function loadFrames(){if(loaded)return;loaded=true;for(let i=0;i<FR;i++){const im=new Image();im.src=`img/spin/s${pad(i)}.jpg`}}
if('requestIdleCallback' in window)requestIdleCallback(loadFrames,{timeout:2500});else setTimeout(loadFrames,1500);
function show(i){i=Math.max(0,Math.min(FR-1,i));if(i===cur)return;cur=i;himg.src=`img/spin/s${pad(i)}.jpg`;hint.style.opacity=0}
function ease(){const d=target-cur;if(Math.abs(d)<.5){show(target);timer=null;return}show(cur+Math.sign(d)*Math.max(1,Math.round(Math.abs(d)/4)));timer=setTimeout(ease,16)}
let lastUser=0,hov=false;
function aim(e){lastUser=Date.now();hov=true;loadFrames();const r=shot.getBoundingClientRect(),p=Math.max(0,Math.min(1,(e.clientX-r.left)/r.width));target=Math.round((1-p)*(FR-1));if(!timer)timer=setTimeout(ease,16)}
shot.addEventListener('pointermove',aim);shot.addEventListener('pointerdown',aim);
shot.addEventListener('pointerleave',()=>{hov=false;lastUser=Date.now()});
/* автоповорот: камера сама качается, пока пользователь не трогает */
if(!matchMedia('(prefers-reduced-motion:reduce)').matches){
  const T=8000,t0=Date.now();
  setInterval(()=>{if(hov||Date.now()-lastUser<2500)return;loadFrames();const ph=((Date.now()-t0)%T)/T;target=Math.round((FR-1)*(0.5-0.5*Math.cos(ph*2*Math.PI)));if(!timer)timer=setTimeout(ease,16)},50);
}

/* ---- данные ---- */
const TYPES={
  dome:{name:'Купольная',tag:'Помещения',price:18000,img:'img/cam1.jpg',list:['Потолок или стена в помещении','Разрешение 2 Мп','Ночной режим, запись на регистратор'],use:'Купольная камера'},
  bullet:{name:'Цилиндрическая',tag:'Улица',price:24000,img:'img/cam2.jpg',list:['Двор, вход, парковка','Разрешение 4 Мп','Защита от дождя и пыли'],use:'Цилиндрическая камера'},
  turret:{name:'Шаровая',tag:'Универсальная',price:26000,img:'img/cam3.jpg',list:['Для помещений и улицы','Разрешение 4 Мп','Без бликов от подсветки ночью'],use:'Шаровая камера'},
  ptz:{name:'Поворотная Wi-Fi',tag:'Дом и дача',price:34000,img:'img/cam4.jpg',list:['Поворот и наклон из приложения','Разрешение 4 Мп, звук','Работает по Wi-Fi'],use:'Поворотная Wi-Fi камера'}
};
const BRANDS={Hikvision:1,HiWatch:.85,Imou:.8,Berkut:.9};
const NVR=c=>c<=4?22000:c<=8?34000:58000;
const HDD=c=>c<=4?18000:c<=8?26000:42000;
const WORK=13000;
const SCENES={
  flat:{name:'Квартира',img:'img/scenes/flat.jpg',pts:[
    {n:'Входная дверь',t:'dome',x:15,y:20,vx:18,vy:52,z:2.3,txt:'Видно, кто вошёл и кто вышел, лицо и время.'},
    {n:'Гостиная',t:'turret',x:60,y:11,vx:55,vy:68,z:1.7,txt:'Общий обзор комнаты: диван, окно, проход на кухню.'},
    {n:'Кухня и балкон',t:'dome',x:88,y:20,vx:82,vy:55,z:2.2,txt:'Рабочая зона кухни и выход к окну или балкону.'}]},
  house:{name:'Дом',img:'img/scenes/house.jpg',pts:[
    {n:'Крыльцо',t:'bullet',x:27,y:30,vx:29,vy:58,z:2.3,txt:'Входная группа: кто подошёл к двери и что оставили у порога.'},
    {n:'Парковка',t:'bullet',x:58,y:24,vx:48,vy:72,z:1.7,txt:'Автомобиль на въезде и подъездная дорожка.'},
    {n:'Ворота и забор',t:'ptz',x:8,y:42,vx:12,vy:76,z:2.1,txt:'Калитка, ворота и периметр с левой стороны.'},
    {n:'Двор',t:'ptz',x:82,y:36,vx:78,vy:65,z:1.8,txt:'Газон, живая изгородь и тыльная часть участка.'}]},
  office:{name:'Офис',img:'img/scenes/office.jpg',pts:[
    {n:'Вход',t:'dome',x:80,y:13,vx:86,vy:46,z:2.3,txt:'Стеклянная входная дверь, кто приходит и уходит.'},
    {n:'Ресепшн',t:'dome',x:66,y:24,vx:66,vy:62,z:2.5,txt:'Стойка приёма, посетители и документы.'},
    {n:'Open space',t:'turret',x:28,y:14,vx:25,vy:66,z:1.8,txt:'Рабочие места и проход между столами.'},
    {n:'Переговорная',t:'dome',x:50,y:28,vx:55,vy:46,z:2.4,txt:'Вход в переговорную и коридор к ней.'}]},
  shop:{name:'Магазин',img:'img/scenes/shop.jpg',pts:[
    {n:'Вход',t:'dome',x:22,y:15,vx:12,vy:52,z:2.0,txt:'Входная дверь и покупатели на входе.'},
    {n:'Касса',t:'dome',x:32,y:22,vx:30,vy:60,z:2.4,txt:'Кассовая зона, расчёты и товары на стойке.'},
    {n:'Торговый зал',t:'turret',x:56,y:18,vx:60,vy:70,z:1.7,txt:'Центр зала, столы с товаром и покупатели.'},
    {n:'Стеллажи',t:'dome',x:86,y:20,vx:82,vy:55,z:2.0,txt:'Полки у правой стены, товар на витринах.'}]}
};
const PACKS=[
  {sc:'flat',name:'Квартира',tag:'3 камеры',img:'img/scenes/flat.jpg',list:['3 камеры: вход, гостиная, кухня','Регистратор и диск','Монтаж и настройка просмотра с телефона']},
  {sc:'house',name:'Дом и двор',tag:'4 камеры',img:'img/scenes/house.jpg',list:['4 камеры: крыльцо, парковка, ворота, двор','Регистратор и диск','Монтаж и настройка просмотра с телефона']},
  {sc:'shop',name:'Магазин и офис',tag:'4 камеры',img:'img/scenes/shop.jpg',list:['4 камеры: вход, касса, зал, склад','Регистратор и диск большого объёма','Монтаж и настройка просмотра с телефона']}
];

/* ---- состояние ---- */
const st={sc:'flat',brand:'HiWatch',sel:null,set:{flat:new Set(),house:new Set(),office:new Set(),shop:new Set()}};
const price=t=>TYPES[t].price*BRANDS[st.brand];
function total(){
  const items=[];Object.entries(st.set).forEach(([k,s])=>s.forEach(i=>items.push(SCENES[k].pts[i])));
  const n=items.length;if(!n)return{n:0,items,sum:0,cam:0,nvr:0,hdd:0,work:0};
  const cam=items.reduce((s,p)=>s+price(p.t),0),nvr=NVR(n)*BRANDS[st.brand],hdd=HDD(n),work=n*WORK;
  return{n,items,cam,nvr,hdd,work,sum:cam+nvr+hdd+work};
}

/* ---- сцена ---- */
function buildTabs(){
  const t=$('#sceneTabs');t.innerHTML='';
  Object.entries(SCENES).forEach(([k,s])=>{const b=document.createElement('button');b.type='button';b.textContent=s.name;b.setAttribute('role','tab');b.setAttribute('aria-selected',k===st.sc);b.onclick=()=>setScene(k);t.append(b)});
  const bt=$('#brandTabs');bt.innerHTML='';
  Object.keys(BRANDS).forEach(k=>{const b=document.createElement('button');b.type='button';b.textContent=k;b.setAttribute('aria-pressed',k===st.brand);b.onclick=()=>{st.brand=k;buildTabs();render()};bt.append(b)});
}
function drawDots(){
  const box=$('#dots');box.innerHTML='';
  SCENES[st.sc].pts.forEach((p,i)=>{
    const b=document.createElement('button');b.type='button';b.className='dot'+(st.set[st.sc].has(i)?' on':'')+(st.sel===i?' sel':'');
    b.style.left=p.x+'%';b.style.top=p.y+'%';b.setAttribute('aria-label',p.n);
    b.innerHTML=`<i></i><span>${p.n}</span>`;b.onclick=()=>select(i);box.append(b);
  });
}
function setScene(k){
  st.sc=k;st.sel=null;buildTabs();
  const img=$('#scImg');img.classList.add('fade');setTimeout(()=>{img.src=SCENES[k].img;img.classList.remove('fade')},200);
  drawDots();feedEmpty();render();
}
function feedEmpty(){$('#feedImg').style.opacity=0;$('#feedName').textContent='CAM';$('#feedType').textContent='';$('#pickTitle').textContent='Выберите точку';$('#pickText').textContent='Здесь появится вид с камеры, тип модели и цена.';const b=$('#pickBtn');b.disabled=true;b.textContent='Добавить в набор'}
function select(i){
  st.sel=i;const p=SCENES[st.sc].pts[i],fi=$('#feedImg'),feed=$('#feed');
  fi.style.opacity=0;fi.onload=null;fi.src=SCENES[st.sc].img;
  const place=()=>{const W=feed.clientWidth,s=p.z,w=W*s,h=w*9/16,H=feed.clientHeight;fi.style.width=w+'px';fi.style.left=(W/2-p.vx/100*w)+'px';fi.style.top=(H/2-p.vy/100*h)+'px';fi.style.opacity=1};
  if(fi.complete)place();else fi.onload=place;
  $('#feedName').textContent='CAM '+pad(i+1)+' · '+p.n;$('#feedType').textContent=TYPES[p.t].use;
  $('#pickTitle').textContent=p.n+' · '+TYPES[p.t].use.toLowerCase();
  $('#pickText').textContent=p.txt+' От '+fmt(price(p.t))+' за камеру.';
  const on=st.set[st.sc].has(i),b=$('#pickBtn');b.disabled=false;b.textContent=on?'Убрать из набора':'Добавить в набор';
  drawDots();
}
$('#pickBtn').onclick=()=>{if(st.sel==null)return;const s=st.set[st.sc];s.has(st.sel)?s.delete(st.sel):s.add(st.sel);select(st.sel);render()};

function render(){
  const r=total(),L=$('#lines');L.innerHTML='';
  if(!r.n)L.innerHTML='<li><span>Добавьте первую камеру</span></li>';
  else{
    r.items.forEach(p=>L.insertAdjacentHTML('beforeend',`<li><span>${p.n}</span><b>${fmt(price(p.t))}</b></li>`));
    L.insertAdjacentHTML('beforeend',`<li><span>Регистратор и диск</span><b>${fmt(r.nvr+r.hdd)}</b></li>`);
    L.insertAdjacentHTML('beforeend',`<li><span>Монтаж и настройка</span><b>${fmt(r.work)}</b></li>`);
  }
  $('#total').textContent=fmt(r.sum);
  const a=$('#sendBtn');a.target='_blank';a.rel='noopener';
  if(r.n){const names=r.items.map(p=>`${p.n} (${TYPES[p.t].name.toLowerCase()})`).join(', ');
    a.href=waLink(`Здравствуйте! Собрал набор на сайте. Бренд: ${st.brand}. Камер: ${r.n}: ${names}. Ориентир ${fmt(r.sum)}. Хочу замер и точную смету.`)}
  else a.href=waLink('Здравствуйте! Хочу видеонаблюдение в Алматы, помогите подобрать.');
  drawDots();
}

/* ---- каталог и пакеты ---- */
(function(){
  const c=$('#cards');
  Object.values(TYPES).forEach(t=>{
    c.insertAdjacentHTML('beforeend',`<article class="card"><div class="card-img"><img src="${t.img}" alt="${t.name} камера" loading="lazy"><span class="tag">${t.tag}</span></div><div class="card-body"><h3>${t.name}</h3><ul class="dash">${t.list.map(x=>`<li>${x}</li>`).join('')}</ul><div class="price">от <b>${fmt(t.price*BRANDS.Imou)}</b></div></div></article>`);
  });
  const p=$('#pkList');
  PACKS.forEach(k=>{
    const sc=SCENES[k.sc],idx=sc.pts.map((_,i)=>i).slice(0,k.sc==='flat'?3:4),n=idx.length;
    const cam=idx.reduce((s,i)=>s+TYPES[sc.pts[i].t].price*BRANDS.HiWatch,0),sum=cam+NVR(n)*BRANDS.HiWatch+HDD(n)+n*WORK;
    p.insertAdjacentHTML('beforeend',`<article class="card"><div class="card-img"><img src="${k.img}" alt="${k.name}" loading="lazy"><span class="tag">${k.tag}</span></div><div class="card-body"><h3>${k.name}</h3><ul class="dash">${k.list.map(x=>`<li>${x}</li>`).join('')}</ul><div class="price">от <b>${fmt(Math.round(sum/5000)*5000)}</b></div><button class="btn btn-ink" type="button" data-pk="${k.sc}">Открыть в конфигураторе</button></article>`);
  });
  p.querySelectorAll('[data-pk]').forEach(b=>b.onclick=()=>{const k=b.dataset.pk,n=SCENES[k].pts.length;st.set[k]=new Set(SCENES[k].pts.map((_,i)=>i).slice(0,k==='flat'?3:n));setScene(k);select(0);document.getElementById('scenes').scrollIntoView({behavior:'smooth'})});
})();

/* ---- ночь ---- */
(function(){
  const r=$('#cmpRange'),top=$('#cmpTop'),line=$('#cmpLine');
  const set=v=>{top.style.clipPath=`inset(0 ${100-v}% 0 0)`;line.style.left=v+'%'};
  r.addEventListener('input',()=>set(+r.value));set(50);
  let shown=false;
  new IntersectionObserver((en,ob)=>{if(en[0].isIntersecting&&!shown){shown=true;let v=50,d=1,n=0;const t=setInterval(()=>{v+=d*1.2;if(v>=72)d=-1;if(v<=28&&d===-1)d=1;n++;if(n>70||(v>=49&&v<=51&&n>20)){clearInterval(t);r.value=50;set(50)}else{r.value=v;set(v)}},16);ob.disconnect()}},{threshold:.6}).observe($('#cmp'));
})();

/* ---- старт ---- */
buildTabs();drawDots();render();
st.set.flat=new Set([0,1,2]);setScene('flat');select(0);
})();
