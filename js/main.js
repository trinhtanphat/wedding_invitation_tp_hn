const $ = (s, root = document) => root.querySelector(s);
const $$ = (s, root = document) => [...root.querySelectorAll(s)];

window.addEventListener('load', () => {
  setTimeout(() => $('#pageLoader')?.classList.add('hidden'), 450);
});

const body = document.body;
const curtainAction = $('#curtainAction');
const curtainReplay = $('#curtainReplay');
let curtainOpen = false;

function setCurtain(open) {
  curtainOpen = open;
  body.classList.toggle('curtain-open', open);
  body.classList.toggle('curtain-closed', !open);
  if (curtainReplay) curtainReplay.textContent = open ? 'Đóng rèm' : 'Mở rèm';
  if (curtainAction) curtainAction.textContent = open ? 'Đóng thiệp' : 'Mở thiệp';
}

setTimeout(() => setCurtain(false), 600);
curtainAction?.addEventListener('click', () => setCurtain(!curtainOpen));
curtainReplay?.addEventListener('click', () => setCurtain(!curtainOpen));

const topbar = $('#topbar');
const nav = $('#nav');
const navToggle = $('#navToggle');
window.addEventListener('scroll', () => topbar.classList.toggle('scrolled', window.scrollY > 32));
navToggle?.addEventListener('click', () => {
  const open = nav.classList.toggle('open');
  navToggle.setAttribute('aria-expanded', String(open));
});
$$('.nav a').forEach(a => a.addEventListener('click', () => nav.classList.remove('open')));

const observer = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) entry.target.classList.add('visible');
  });
}, { threshold: 0.14 });
$$('.reveal').forEach(el => observer.observe(el));

const field = $('#petalField');
for (let i = 0; i < 30; i++) {
  const p = document.createElement('span');
  p.className = 'petal';
  p.style.left = Math.random() * 100 + 'vw';
  p.style.animationDuration = (8 + Math.random() * 10) + 's';
  p.style.animationDelay = (-Math.random() * 12) + 's';
  p.style.opacity = 0.25 + Math.random() * 0.45;
  p.style.setProperty('--drift', (Math.random() * 180 - 90) + 'px');
  p.style.transform = `scale(${0.55 + Math.random() * 0.9})`;
  field.appendChild(p);
}

function updateCountdown() {
  const box = $('#countdown');
  if (!box) return;
  const target = new Date(box.dataset.date).getTime();
  const diff = Math.max(0, target - Date.now());
  const d = Math.floor(diff / 86400000);
  const h = Math.floor(diff / 3600000) % 24;
  const m = Math.floor(diff / 60000) % 60;
  const s = Math.floor(diff / 1000) % 60;
  $('#days').textContent = String(d).padStart(2, '0');
  $('#hours').textContent = String(h).padStart(2, '0');
  $('#minutes').textContent = String(m).padStart(2, '0');
  $('#seconds').textContent = String(s).padStart(2, '0');
}
updateCountdown();
setInterval(updateCountdown, 1000);

const modal = $('#photoModal');
const modalImage = $('#modalImage');
$$('.gallery-item').forEach(item => item.addEventListener('click', () => {
  modalImage.src = item.dataset.img;
  if (modal.showModal) modal.showModal();
}));
$('#modalClose')?.addEventListener('click', () => modal.close());
modal?.addEventListener('click', e => {
  const rect = modal.getBoundingClientRect();
  const outside = e.clientX < rect.left || e.clientX > rect.right || e.clientY < rect.top || e.clientY > rect.bottom;
  if (outside) modal.close();
});

function toast(message) {
  const t = $('#toast');
  t.textContent = message;
  t.classList.add('show');
  clearTimeout(window.__toastTimer);
  window.__toastTimer = setTimeout(() => t.classList.remove('show'), 3200);
}

$('#wishForm')?.addEventListener('submit', e => {
  e.preventDefault();
  const data = new FormData(e.currentTarget);
  const name = data.get('name').toString().trim();
  const message = data.get('message').toString().trim();
  if (!name || !message) return;
  const wish = document.createElement('div');
  wish.className = 'wish';
  wish.innerHTML = `<strong>${escapeHtml(name)}</strong><p>${escapeHtml(message)}</p>`;
  $('#wishList').prepend(wish);
  e.currentTarget.reset();
  toast('Cảm ơn lời chúc thật đẹp của bạn!');
});

$('#rsvpForm')?.addEventListener('submit', e => {
  e.preventDefault();
  const data = Object.fromEntries(new FormData(e.currentTarget).entries());
  localStorage.setItem('wedding-rsvp-demo', JSON.stringify({ ...data, createdAt: new Date().toISOString() }));
  e.currentTarget.reset();
  toast('Đã ghi nhận xác nhận tham dự trên trình duyệt này.');
});

function escapeHtml(str) {
  return str.replace(/[&<>\'"]/g, c => ({ '&':'&amp;', '<':'&lt;', '>':'&gt;', "'":'&#39;', '"':'&quot;' }[c]));
}

const heroPhotoWrap = $('#heroPhotoWrap');
window.addEventListener('mousemove', e => {
  document.documentElement.style.setProperty('--mx', e.clientX + 'px');
  document.documentElement.style.setProperty('--my', e.clientY + 'px');
  if (!heroPhotoWrap || window.innerWidth < 901) return;
  const rect = heroPhotoWrap.getBoundingClientRect();
  const cx = rect.left + rect.width / 2;
  const cy = rect.top + rect.height / 2;
  const rx = ((e.clientY - cy) / rect.height) * -8;
  const ry = ((e.clientX - cx) / rect.width) * 8;
  heroPhotoWrap.style.transform = `rotateX(${rx}deg) rotateY(${ry}deg) translateY(-4px)`;
});
window.addEventListener('mouseleave', () => {
  if (heroPhotoWrap) heroPhotoWrap.style.transform = '';
});
