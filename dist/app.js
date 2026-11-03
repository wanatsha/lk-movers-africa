const menu = document.querySelector('#menu');
const nav = document.querySelector('#nav');
function toggle(open) {
  nav.classList.toggle('open', open);
  menu.setAttribute('aria-expanded', open);
}
menu.onclick = () => toggle(!nav.classList.contains('open'));
nav.onclick = () => toggle(false);
document.addEventListener('keydown', e => { if (e.key === 'Escape') toggle(false); });
const form = document.querySelector('form');
document.querySelectorAll('[data-service]').forEach(link => {
  link.onclick = () => { form.elements.Service.value = link.dataset.service; };
});
form.onsubmit = e => {
  e.preventDefault();
  const fields = [...new FormData(form)].filter(([,v]) => v.trim());
  const message = ['Hello LK Movers Africa, I’d like a quote.', ...fields.map(([k,v]) => k + ': ' + v)].join('\n');
  window.location.href = 'https://wa.me/26775892103?text=' + encodeURIComponent(message);
};
const links = [...nav.querySelectorAll('a')];
function active() {
  const current = [...links].reverse().find(a => document.querySelector(a.hash).getBoundingClientRect().top <= 140) || links[0];
  links.forEach(a => a.classList.toggle('active', a === current));
}
addEventListener('scroll', active, {passive:true}); active();

const journey = document.querySelector('.journey');
const video = journey.querySelector('video');
const toggleMotion = journey.querySelector('.drive-toggle');
const reduced = matchMedia('(prefers-reduced-motion: reduce)');
let visible = true;
let pausedByVisitor = false;

function updatePlayback() {
  if (reduced.matches || pausedByVisitor || !visible || document.hidden) {
    video.pause();
    return;
  }
  if (!video.hasAttribute('src')) video.src = 'assets/drive.mp4';
  video.play().catch(() => {});
}
video.addEventListener('playing', () => {
  video.classList.add('playing');
  toggleMotion.hidden = false;
});
function updateProgress() {
  if (video.duration) journey.style.setProperty('--travel',video.currentTime / video.duration);
}
video.addEventListener('timeupdate', updateProgress);
toggleMotion.onclick = () => {
  pausedByVisitor = !pausedByVisitor;
  toggleMotion.textContent = pausedByVisitor ? 'Play motion' : 'Pause motion';
  updatePlayback();
};
reduced.addEventListener('change', updatePlayback);
document.addEventListener('visibilitychange', updatePlayback);
new IntersectionObserver(([entry]) => {
  visible = entry.isIntersecting;
  updatePlayback();
}).observe(journey);
