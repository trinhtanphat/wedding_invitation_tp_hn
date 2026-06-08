const $ = (selector, root = document) => root.querySelector(selector);
const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];
const state = { lang: localStorage.getItem('wedding-lang') || 'vi', gateOpen: false, wantsMusic: true };
if (state.lang === 'zh') state.lang = 'zh-CN';
const audio = $('#bgMusic'), toastBox = $('#toast'), body = document.body, musicToggle = $('#musicToggle');
function t(key){ const dict = window.WEDDING_I18N[state.lang] || (state.lang === 'zh' ? window.WEDDING_I18N['zh-CN'] : null) || window.WEDDING_I18N.vi; return dict[key] || window.WEDDING_I18N.vi[key] || key; }
function applyLanguage(lang){ state.lang=lang; localStorage.setItem('wedding-lang',lang); document.documentElement.lang = lang.startsWith('zh') ? lang : lang; body.dataset.lang=lang; $$('[data-i18n]').forEach(el=>{ const v=t(el.dataset.i18n); if(v.includes('<')) el.innerHTML=v; else el.textContent=v; }); $$('[data-i18n-placeholder]').forEach(el=>el.placeholder=t(el.dataset.i18nPlaceholder)); $$('.lang-switch button').forEach(btn=>btn.classList.toggle('active',btn.dataset.lang===lang)); }
function toast(message){ if(!toastBox) return; toastBox.textContent=message; toastBox.classList.add('show'); clearTimeout(window.__toastTimer); window.__toastTimer=setTimeout(()=>toastBox.classList.remove('show'),3200); }
function setMusicUI(){ if(!musicToggle) return; const playing=!!audio && !audio.paused; musicToggle.classList.toggle('playing',playing); musicToggle.textContent = playing ? '♪' : '♫'; }
async function playMusic(showError=true){ if(!audio || !state.wantsMusic) return; try{ await audio.play(); }catch(e){ if(showError) toast(t('toastMusicMissing')); } setMusicUI(); }
function pauseMusic(showToast=false){ audio?.pause(); setMusicUI(); if(showToast) toast(t('toastMusicOff')); }

function launchFireworks(){
  const field = $('#fireworkField');
  const stamp = $('#stampFlash');
  if(stamp){
    stamp.classList.remove('show');
    void stamp.offsetWidth;
    stamp.classList.add('show');
  }
  if(!field) return;
  const spots = [
    [22,26],[78,24],[50,18],[32,40],[68,42]
  ];
  spots.forEach((pos,i)=>{
    setTimeout(()=>{
      const f=document.createElement('span');
      f.className='firework';
      f.style.left=pos[0]+'vw';
      f.style.top=pos[1]+'vh';
      field.appendChild(f);
      setTimeout(()=>f.remove(),1100);
    }, i*160);
  });
}

function openGate(){ state.gateOpen=true; body.classList.add('gate-open'); body.classList.remove('site-locked'); launchFireworks(); playMusic(true); }
function closeGate(){ state.gateOpen=false; body.classList.remove('gate-open'); body.classList.add('site-locked'); window.scrollTo({top:0,behavior:'smooth'}); }
window.addEventListener('load',()=>{ applyLanguage(state.lang); setTimeout(()=>$('#preloader')?.classList.add('hidden'),450); setMusicUI(); });
$('#openInvitation')?.addEventListener('click',openGate); $('#openGateFloating')?.addEventListener('click',openGate); $('#gateClickLayer')?.addEventListener('click',openGate); $('#replayGate')?.addEventListener('click',closeGate); audio?.addEventListener('error',()=>{ setMusicUI(); if(state.gateOpen) toast(t('toastMusicMissing')); });
musicToggle?.addEventListener('click',async()=>{ if(!audio) return; state.wantsMusic = audio.paused; if(state.wantsMusic){ await playMusic(true); if(!audio.paused) toast(t('toastMusicOn')); } else pauseMusic(true); });
$$('.lang-switch button').forEach(btn=>btn.addEventListener('click',()=>applyLanguage(btn.dataset.lang)));
const nav=$('#nav'), navToggle=$('#navToggle'), topbar=$('#topbar'); window.addEventListener('scroll',()=>topbar?.classList.toggle('scrolled',window.scrollY>32)); navToggle?.addEventListener('click',()=>{ const open=nav.classList.toggle('open'); navToggle.setAttribute('aria-expanded',String(open)); }); $$('.nav a').forEach(a=>a.addEventListener('click',()=>nav.classList.remove('open')));
const observer = new IntersectionObserver(entries=>entries.forEach(entry=>{ if(entry.isIntersecting) entry.target.classList.add('visible'); }),{threshold:.14}); $$('.reveal').forEach(el=>observer.observe(el));
const petalField=$('#petalField'); for(let i=0;i<32;i++){ const p=document.createElement('span'); p.className='petal'; p.style.left=`${Math.random()*100}vw`; p.style.animationDuration=`${9+Math.random()*12}s`; p.style.animationDelay=`${-Math.random()*12}s`; p.style.setProperty('--drift',`${Math.random()*220-110}px`); p.style.transform=`scale(${0.55+Math.random()*0.9})`; petalField?.appendChild(p); }
const sparkField=$('#sparkField'); for(let i=0;i<42;i++){ const s=document.createElement('span'); s.className='spark'; s.style.left=`${Math.random()*100}vw`; s.style.top=`${Math.random()*100}vh`; s.style.animationDuration=`${2.8+Math.random()*3.8}s`; s.style.animationDelay=`${Math.random()*4}s`; sparkField?.appendChild(s); }
const starField=$('#starField');
for(let i=0;i<56;i++){ const s=document.createElement('span'); s.className='star-dot'; s.style.left=`${Math.random()*100}vw`; s.style.top=`${Math.random()*46}vh`; s.style.animationDuration=`${1.8+Math.random()*4.2}s`; s.style.animationDelay=`${Math.random()*4}s`; starField?.appendChild(s); }
const jadeOrbField=$('#jadeOrbField');
for(let i=0;i<18;i++){ const o=document.createElement('span'); o.className='jade-orb'; const size=12+Math.random()*26; o.style.width=`${size}px`; o.style.height=`${size}px`; o.style.left=`${Math.random()*100}vw`; o.style.top=`${20+Math.random()*70}vh`; o.style.animationDuration=`${6+Math.random()*8}s`; o.style.animationDelay=`${Math.random()*4}s`; o.style.setProperty('--dx',`${Math.random()*50-25}px`); jadeOrbField?.appendChild(o); }

function updateCountdown(){ const box=$('#countdown'); if(!box) return; const target=new Date(box.dataset.date).getTime(), diff=Math.max(0,target-Date.now()); $('#days').textContent=String(Math.floor(diff/86400000)).padStart(2,'0'); $('#hours').textContent=String(Math.floor(diff/3600000)%24).padStart(2,'0'); $('#minutes').textContent=String(Math.floor(diff/60000)%60).padStart(2,'0'); $('#seconds').textContent=String(Math.floor(diff/1000)%60).padStart(2,'0'); }
updateCountdown(); setInterval(updateCountdown,1000);

const goldenRain = $('#goldenRain');
for(let i=0;i<34;i++){
  const d=document.createElement('span');
  d.className='gold-drop';
  d.style.left=`${Math.random()*100}vw`;
  d.style.animationDuration=`${6+Math.random()*7}s`;
  d.style.animationDelay=`${-Math.random()*8}s`;
  d.style.setProperty('--gold-drift',`${Math.random()*120-60}px`);
  goldenRain?.appendChild(d);
}
window.addEventListener('pointermove', e => {
  document.documentElement.style.setProperty('--mx', e.clientX + 'px');
  document.documentElement.style.setProperty('--my', e.clientY + 'px');
});

const heroCard=$('#heroCard'); window.addEventListener('mousemove',e=>{ if(!heroCard || window.innerWidth<981) return; const rect=heroCard.getBoundingClientRect(), cx=rect.left+rect.width/2, cy=rect.top+rect.height/2, rx=((e.clientY-cy)/rect.height)*-6, ry=((e.clientX-cx)/rect.width)*6; heroCard.style.transform=`rotateX(${rx}deg) rotateY(${ry}deg) translateY(-2px)`; }); window.addEventListener('mouseleave',()=>{ if(heroCard) heroCard.style.transform=''; });
const modal=$('#photoModal'), modalImage=$('#modalImage'); $$('.gallery-item').forEach(item=>item.addEventListener('click',()=>{ modalImage.src=item.dataset.img; if(modal.showModal) modal.showModal(); })); $('#modalClose')?.addEventListener('click',()=>modal.close()); modal?.addEventListener('click',e=>{ const rect=modal.getBoundingClientRect(); const outside=e.clientX<rect.left||e.clientX>rect.right||e.clientY<rect.top||e.clientY>rect.bottom; if(outside) modal.close(); });
function escapeHtml(str){ return str.replace(/[&<>'"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[c])); }
$('#wishForm')?.addEventListener('submit',e=>{ e.preventDefault(); const data=new FormData(e.currentTarget), name=String(data.get('name')||'').trim(), message=String(data.get('message')||'').trim(); if(!name||!message) return; const wish=document.createElement('div'); wish.className='wish'; wish.innerHTML=`<strong>${escapeHtml(name)}</strong><p>${escapeHtml(message)}</p>`; $('#wishList').prepend(wish); e.currentTarget.reset(); toast(t('toastWish')); });
$('#rsvpForm')?.addEventListener('submit',e=>{ e.preventDefault(); const data=Object.fromEntries(new FormData(e.currentTarget).entries()); localStorage.setItem('wedding-rsvp-demo',JSON.stringify({...data,createdAt:new Date().toISOString()})); e.currentTarget.reset(); toast(t('toastRsvp')); });

const spiritLanternField=$('#spiritLanternField');
for(let i=0;i<16;i++){ const l=document.createElement('span'); l.className='spirit-lantern'; l.style.left=`${Math.random()*100}vw`; l.style.top=`${10+Math.random()*75}vh`; l.style.animationDuration=`${5+Math.random()*7}s`; l.style.animationDelay=`${Math.random()*4}s`; spiritLanternField?.appendChild(l); }

const lotusGlowField=$('#lotusGlowField');
for(let i=0;i<14;i++){ const g=document.createElement('span'); g.className='lotus-glow'; const size=28+Math.random()*34; g.style.width=`${size}px`; g.style.height=`${size}px`; g.style.left=`${Math.random()*100}vw`; g.style.top=`${55+Math.random()*40}vh`; g.style.animationDuration=`${4+Math.random()*5}s`; g.style.animationDelay=`${Math.random()*4}s`; lotusGlowField?.appendChild(g); }

$('#dockMusic')?.addEventListener('click', async()=>{ if(!audio) return; state.wantsMusic = audio.paused; if(state.wantsMusic){ await playMusic(true); if(!audio.paused) toast(t('toastMusicOn')); } else pauseMusic(true); });
