document.documentElement.classList.add('js');
const reduced = matchMedia('(prefers-reduced-motion: reduce)');
document.querySelector('#yr').textContent = new Date().getFullYear();

// Header: solid once the page scrolls, mobile menu
const header = document.querySelector('.top');
const menu = document.querySelector('#menu');
const nav = document.querySelector('#nav');
function toggleMenu(open) {
  nav.classList.toggle('open', open);
  menu.setAttribute('aria-expanded', open);
  menu.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
  header.classList.toggle('solid', open || scrollY > 40);
}
menu.onclick = () => toggleMenu(!nav.classList.contains('open'));
nav.onclick = () => toggleMenu(false);
document.addEventListener('keydown', e => { if (e.key === 'Escape') toggleMenu(false); });

// Active nav link
const links = [...nav.querySelectorAll('a')];
function activeLink() {
  const current = [...links].reverse().find(a => document.querySelector(a.hash).getBoundingClientRect().top <= 160);
  links.forEach(a => a.classList.toggle('active', a === current));
}

// Scroll reveals
const io = new IntersectionObserver(entries => entries.forEach(e => {
  if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); }
}), { rootMargin: '0px 0px -12% 0px' });
document.querySelectorAll('.reveal').forEach(el => io.observe(el));

// Route: the truck drives Gaborone → Maun as the section scrolls
const route = document.querySelector('.route');
const road = route.querySelector('.road');
const stops = [...road.querySelectorAll('.stop')];
const km = document.querySelector('#km');
const TOTAL_KM = 925;
function drive() {
  let p = 1;
  if (!reduced.matches) {
    const r = route.getBoundingClientRect();
    const run = r.height - innerHeight;
    p = Math.min(1, Math.max(0, -r.top / (run * .85)));
  }
  road.style.setProperty('--p', p.toFixed(4));
  km.textContent = Math.round(p * TOTAL_KM);
  stops.forEach(s => s.classList.toggle('hit', parseFloat(s.style.getPropertyValue('--at')) <= p + .001));
}

let ticking = false;
function onScroll() {
  if (ticking) return;
  ticking = true;
  requestAnimationFrame(() => {
    header.classList.toggle('solid', nav.classList.contains('open') || scrollY > 40);
    activeLink();
    drive();
    ticking = false;
  });
}
addEventListener('scroll', onScroll, { passive: true });
addEventListener('resize', onScroll);
onScroll();

// Quote form → WhatsApp
const form = document.querySelector('.waybill');
document.querySelectorAll('[data-service]').forEach(link => {
  link.addEventListener('click', () => { form.elements.Service.value = link.dataset.service; });
});
form.onsubmit = e => {
  e.preventDefault();
  const fields = [...new FormData(form)].filter(([, v]) => v.trim());
  const message = ['Hello LK Movers Africa, I’d like a quote.', ...fields.map(([k, v]) => k + ': ' + v)].join('\n');
  window.location.href = 'https://wa.me/26775892103?text=' + encodeURIComponent(message);
};

// Hero video: load only when allowed and visible
const hero = document.querySelector('.hero');
const video = hero.querySelector('video');
const motionToggle = hero.querySelector('.motion-toggle');
let heroVisible = true;
let pausedByVisitor = false;
function updatePlayback() {
  if (reduced.matches || pausedByVisitor || !heroVisible || document.hidden) { video.pause(); return; }
  if (!video.hasAttribute('src')) video.src = 'assets/drive.mp4';
  video.play().catch(() => {});
}
video.addEventListener('playing', () => { video.classList.add('playing'); motionToggle.hidden = false; });
motionToggle.onclick = () => {
  pausedByVisitor = !pausedByVisitor;
  motionToggle.textContent = pausedByVisitor ? 'Play video' : 'Pause video';
  updatePlayback();
};
reduced.addEventListener('change', () => { updatePlayback(); drive(); });
document.addEventListener('visibilitychange', updatePlayback);
new IntersectionObserver(([e]) => { heroVisible = e.isIntersecting; updatePlayback(); }).observe(hero);
