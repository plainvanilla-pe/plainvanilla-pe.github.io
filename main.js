/* ============================================================
   PLAIN VANILLA — main.js
   ============================================================ */

// ── NAVBAR SCROLL ─────────────────────────────────────────────
const navbar = document.getElementById('navbar');

window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 60);
}, { passive: true });

// ── HAMBURGER MENU ────────────────────────────────────────────
const hamburger = document.querySelector('.hamburger');
const navLinks  = document.querySelector('.nav-links');

function closeMenu() {
  hamburger.classList.remove('open');
  navLinks.classList.remove('open');
  hamburger.setAttribute('aria-expanded', 'false');
}

hamburger.addEventListener('click', () => {
  const isOpen = hamburger.classList.toggle('open');
  navLinks.classList.toggle('open', isOpen);
  hamburger.setAttribute('aria-expanded', String(isOpen));
});

navLinks.querySelectorAll('a').forEach(link =>
  link.addEventListener('click', closeMenu)
);

// ── SMOOTH SCROLL WITH NAV OFFSET ─────────────────────────────
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', e => {
    const id = anchor.getAttribute('href');
    if (id === '#') return;
    const target = document.querySelector(id);
    if (!target) return;
    e.preventDefault();
    const offset = navbar.offsetHeight + 8;
    const top    = target.getBoundingClientRect().top + window.scrollY - offset;
    window.scrollTo({ top, behavior: 'smooth' });
  });
});

// ── PARALLAX HERO ─────────────────────────────────────────────
const heroBg = document.querySelector('.hero-bg');
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

if (heroBg && !reduceMotion) {
  window.addEventListener('scroll', () => {
    const y = window.scrollY;
    if (y < window.innerHeight * 1.1) {
      heroBg.style.transform = `translateY(${y * 0.3}px)`;
    }
  }, { passive: true });
}

// ── FADE-IN ON SCROLL ─────────────────────────────────────────
const fadeObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      // stagger siblings
      const siblings = entry.target.parentElement.querySelectorAll('.fade-in');
      let delay = 0;
      siblings.forEach(el => {
        if (el === entry.target) {
          el.style.transitionDelay = `${delay}ms`;
          el.classList.add('visible');
          delay += 80;
        }
      });
      entry.target.classList.add('visible');
      fadeObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });

document.querySelectorAll('.fade-in').forEach(el => fadeObserver.observe(el));

// ── COUNTDOWN (Release: 9 de mayo 2026) ──────────────────────
(function initReleaseCountdown() {
  const section = document.getElementById('proximo-sencillo');
  if (!section) return;

  const RELEASE = new Date('2026-05-09T00:00:00-05:00'); // Lima UTC-5

  function tick() {
    const diff = RELEASE - Date.now();

    if (diff <= 0) {
      // Canción ya salió: ocultar sección
      section.style.display = 'none';
      return;
    }

    const days    = Math.floor(diff / 86400000);
    const hours   = Math.floor((diff % 86400000) / 3600000);
    const minutes = Math.floor((diff % 3600000)  / 60000);
    const seconds = Math.floor((diff % 60000)    / 1000);

    const pad = n => String(n).padStart(2, '0');
    document.getElementById('r-days').textContent    = pad(days);
    document.getElementById('r-hours').textContent   = pad(hours);
    document.getElementById('r-minutes').textContent = pad(minutes);
    document.getElementById('r-seconds').textContent = pad(seconds);

    setTimeout(tick, 1000);
  }

  tick();
})();

// ── GALLERY BUILD & LIGHTBOX ──────────────────────────────────
const GALLERY_PHOTOS = [
  'assets/Live/live-mejia-01.webp',
  'assets/Live/live-mejia-02.webp',
  'assets/Live/live-mejia-03.webp',
  'assets/Live/live-mejia-04.webp',
  'assets/Live/live-mejia-05.webp',
  'assets/Live/live-mejia-06.webp',
  'assets/Live/live-show-01.webp',
  'assets/Live/live-aperol-01.webp',
  'assets/Live/live-aperol-02.webp',
  'assets/Live/live-aperol-03.webp',
  'assets/Live/live-aperol-04.webp',
  'assets/Live/live-aperol-05.jpg',
  'assets/Live/live-aperol-06.webp',
  'assets/Live/live-aperol-07.webp',
];

const galleryContainer = document.getElementById('gallery');

if (galleryContainer) {
  GALLERY_PHOTOS.forEach((src, i) => {
    const item = document.createElement('div');
    item.className       = 'gallery-item fade-in';
    item.dataset.index   = i;
    item.setAttribute('role', 'button');
    item.setAttribute('tabindex', '0');
    item.setAttribute('aria-label', `Ver foto ${i + 1} de ${GALLERY_PHOTOS.length}`);

    const img   = document.createElement('img');
    img.src     = src;
    img.alt     = `Plain Vanilla en vivo — foto ${i + 1}`;
    img.loading = 'lazy';
    img.decoding = 'async';

    item.appendChild(img);
    galleryContainer.appendChild(item);
    fadeObserver.observe(item);
  });
}

// Lightbox
const lightbox      = document.getElementById('lightbox');
const lbImg         = lightbox?.querySelector('.lightbox-img');
const lbCounter     = lightbox?.querySelector('.lightbox-counter');
let currentIdx = 0;

function updateCounter() {
  if (lbCounter) lbCounter.textContent = `${currentIdx + 1} / ${GALLERY_PHOTOS.length}`;
}

function openLightbox(idx) {
  currentIdx  = idx;
  lbImg.src   = GALLERY_PHOTOS[idx];
  lbImg.alt   = `Plain Vanilla en vivo — foto ${idx + 1}`;
  lightbox.classList.add('open');
  document.body.style.overflow = 'hidden';
  lightbox.setAttribute('aria-hidden', 'false');
  updateCounter();
  lightbox.focus();
}

function closeLightbox() {
  lightbox.classList.remove('open');
  document.body.style.overflow = '';
  lightbox.setAttribute('aria-hidden', 'true');
}

function prevPhoto() {
  currentIdx = (currentIdx - 1 + GALLERY_PHOTOS.length) % GALLERY_PHOTOS.length;
  lbImg.src  = GALLERY_PHOTOS[currentIdx];
  updateCounter();
}

function nextPhoto() {
  currentIdx = (currentIdx + 1) % GALLERY_PHOTOS.length;
  lbImg.src  = GALLERY_PHOTOS[currentIdx];
  updateCounter();
}

galleryContainer?.addEventListener('click', e => {
  const item = e.target.closest('.gallery-item');
  if (item) openLightbox(parseInt(item.dataset.index));
});

galleryContainer?.addEventListener('keydown', e => {
  const item = e.target.closest('.gallery-item');
  if (item && (e.key === 'Enter' || e.key === ' ')) {
    e.preventDefault();
    openLightbox(parseInt(item.dataset.index));
  }
});

if (lightbox) {
  lightbox.querySelector('.lightbox-close').addEventListener('click', closeLightbox);
  lightbox.querySelector('.lightbox-prev').addEventListener('click', prevPhoto);
  lightbox.querySelector('.lightbox-next').addEventListener('click', nextPhoto);

  lightbox.addEventListener('click', e => {
    if (e.target === lightbox) closeLightbox();
  });

  document.addEventListener('keydown', e => {
    if (!lightbox.classList.contains('open')) return;
    if (e.key === 'Escape')     closeLightbox();
    if (e.key === 'ArrowLeft')  prevPhoto();
    if (e.key === 'ArrowRight') nextPhoto();
  });
}
