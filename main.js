/* ============================================================
   PLAIN VANILLA — main.js
   ============================================================ */

// ── HERO CAROUSEL ─────────────────────────────────────────────
(function initCarousel() {
  const hero = document.getElementById('hero');
  if (!hero?.classList.contains('hero-carousel')) return;

  const slides = hero.querySelectorAll('.carousel-slide');
  const dots   = hero.querySelectorAll('.carousel-dot');
  let current  = 0;
  let timer    = null;

  function goTo(idx) {
    slides[current].classList.remove('is-active');
    dots[current].classList.remove('is-active');
    dots[current].setAttribute('aria-selected', 'false');

    current = (idx + slides.length) % slides.length;

    slides[current].classList.add('is-active');
    dots[current].classList.add('is-active');
    dots[current].setAttribute('aria-selected', 'true');
  }

  function startAuto() { timer = setInterval(() => goTo(current + 1), 6000); }
  function stopAuto()  { clearInterval(timer); }

  hero.querySelector('.carousel-arrow--next')?.addEventListener('click', () => { stopAuto(); goTo(current + 1); startAuto(); });
  hero.querySelector('.carousel-arrow--prev')?.addEventListener('click', () => { stopAuto(); goTo(current - 1); startAuto(); });

  dots.forEach((dot, i) => dot.addEventListener('click', () => { stopAuto(); goTo(i); startAuto(); }));

  // Swipe en mobile
  let touchX = null;
  hero.addEventListener('touchstart', e => { touchX = e.touches[0].clientX; }, { passive: true });
  hero.addEventListener('touchend',   e => {
    if (touchX === null) return;
    const diff = e.changedTouches[0].clientX - touchX;
    if (Math.abs(diff) > 40) { stopAuto(); goTo(current + (diff < 0 ? 1 : -1)); startAuto(); }
    touchX = null;
  }, { passive: true });

  hero.addEventListener('mouseenter', stopAuto);
  hero.addEventListener('mouseleave', startAuto);

  startAuto();
})();

// ── SHOW COUNTDOWN (slide 2 del carrusel) ────────────────────
(function initShowCountdown() {
  const countdownEl = document.getElementById('countdown-show');
  if (!countdownEl) return;

  const SHOW_DATE = new Date('2026-05-19T22:00:00-05:00');

  function tick() {
    const diff = SHOW_DATE - Date.now();
    if (diff <= 0) {
      countdownEl.innerHTML = `<p style="font-family:'Space Grotesk',sans-serif;letter-spacing:0.2em;text-transform:uppercase;font-size:0.85rem;color:var(--accent)">¡Esta noche es el show!</p>`;
      return;
    }
    const pad = n => String(n).padStart(2, '0');
    document.getElementById('s-days').textContent    = pad(Math.floor(diff / 86400000));
    document.getElementById('s-hours').textContent   = pad(Math.floor((diff % 86400000) / 3600000));
    document.getElementById('s-minutes').textContent = pad(Math.floor((diff % 3600000) / 60000));
    document.getElementById('s-seconds').textContent = pad(Math.floor((diff % 60000) / 1000));
    setTimeout(tick, 1000);
  }
  tick();
})();

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
      const coverImg   = section.querySelector('.release-cover img');
      const countdown  = document.getElementById('countdown-release');
      const btn        = document.getElementById('presave-btn');
      const overlay    = section.querySelector('.release-date-overlay');

      if (coverImg)  coverImg.style.filter  = 'none';
      if (countdown) countdown.style.display = 'none';
      if (overlay)   overlay.style.display   = 'none';
      if (btn)       btn.textContent          = 'OUT NOW';
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
const GALLERY_APEROL = [
  'assets/Live/live-aperol-01.webp',
  'assets/Live/live-aperol-02.webp',
  'assets/Live/live-aperol-03.webp',
  'assets/Live/live-aperol-08.webp',
  'assets/Live/live-aperol-05.jpg',
  'assets/Live/live-aperol-06.webp',
  'assets/Live/live-aperol-07.webp',
  'assets/Live/live-aperol-08.webp',
];

const GALLERY_MEJIA = [
  'assets/Live/live-mejia-01.webp',
  'assets/Live/live-mejia-02.webp',
  'assets/Live/live-mejia-03.webp',
  'assets/Live/live-mejia-04.webp',
  'assets/Live/live-mejia-07.webp',
  'assets/Live/live-mejia-06.webp',
  'assets/Live/live-mejia-08.webp',
  'assets/Live/live-mejia-09.webp',
  'assets/Live/live-mejia-05.webp',
];

const PREVIEW_COUNT = 4;

function buildGallery(containerId, photos) {
  const container = document.getElementById(containerId);
  if (!container) return;

  photos.forEach((src, i) => {
    const item = document.createElement('div');
    item.className = 'gallery-item fade-in';
    if (i >= PREVIEW_COUNT) item.classList.add('gallery-item--hidden');
    item.dataset.index = i;
    item.dataset.group = containerId;
    item.setAttribute('role', 'button');
    item.setAttribute('tabindex', '0');
    item.setAttribute('aria-label', `Ver foto ${i + 1} de ${photos.length}`);

    const img    = document.createElement('img');
    img.src      = src;
    img.alt      = `Plain Vanilla en vivo — foto ${i + 1}`;
    img.loading  = 'lazy';
    img.decoding = 'async';

    item.appendChild(img);
    container.appendChild(item);
    fadeObserver.observe(item);
  });
}

buildGallery('gallery-aperol', GALLERY_APEROL);
buildGallery('gallery-mejia',  GALLERY_MEJIA);

document.querySelectorAll('.gallery-item img[src*="live-mejia-05"]').forEach(img => {
  img.closest('.gallery-item').classList.add('gallery-item--reduced');
});

// Expand / collapse buttons
document.querySelectorAll('.gallery-expand-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    const grid = document.getElementById(btn.dataset.target);
    grid?.querySelectorAll('.gallery-item--hidden').forEach(item => {
      item.classList.remove('gallery-item--hidden');
      fadeObserver.observe(item);
    });
    btn.hidden = true;
    const collapseBtn = btn.nextElementSibling;
    if (collapseBtn?.classList.contains('gallery-collapse-btn')) {
      collapseBtn.hidden = false;
    }
  });
});

document.querySelectorAll('.gallery-collapse-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    const grid = document.getElementById(btn.dataset.target);
    const items = grid?.querySelectorAll('.gallery-item');
    items?.forEach((item, i) => {
      if (i >= PREVIEW_COUNT) item.classList.add('gallery-item--hidden');
    });
    btn.hidden = true;
    const expandBtn = btn.previousElementSibling;
    if (expandBtn?.classList.contains('gallery-expand-btn')) {
      expandBtn.hidden = false;
    }
    grid?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  });
});

// Lightbox
const lightbox  = document.getElementById('lightbox');
const lbImg     = lightbox?.querySelector('.lightbox-img');
const lbCounter = lightbox?.querySelector('.lightbox-counter');
let currentIdx   = 0;
let currentGroup = GALLERY_APEROL;

function updateCounter() {
  if (lbCounter) lbCounter.textContent = `${currentIdx + 1} / ${currentGroup.length}`;
}

function openLightbox(idx, group) {
  currentGroup = group;
  currentIdx   = idx;
  lbImg.src    = currentGroup[idx];
  lbImg.alt    = `Plain Vanilla en vivo — foto ${idx + 1}`;
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
  currentIdx = (currentIdx - 1 + currentGroup.length) % currentGroup.length;
  lbImg.src  = currentGroup[currentIdx];
  updateCounter();
}

function nextPhoto() {
  currentIdx = (currentIdx + 1) % currentGroup.length;
  lbImg.src  = currentGroup[currentIdx];
  updateCounter();
}

function handleGalleryClick(e) {
  const item = e.target.closest('.gallery-item');
  if (!item) return;
  const group = item.dataset.group === 'gallery-mejia' ? GALLERY_MEJIA : GALLERY_APEROL;
  openLightbox(parseInt(item.dataset.index), group);
}

function handleGalleryKeydown(e) {
  const item = e.target.closest('.gallery-item');
  if (item && (e.key === 'Enter' || e.key === ' ')) {
    e.preventDefault();
    const group = item.dataset.group === 'gallery-mejia' ? GALLERY_MEJIA : GALLERY_APEROL;
    openLightbox(parseInt(item.dataset.index), group);
  }
}

document.getElementById('gallery-aperol')?.addEventListener('click',   handleGalleryClick);
document.getElementById('gallery-aperol')?.addEventListener('keydown', handleGalleryKeydown);
document.getElementById('gallery-mejia')?.addEventListener('click',    handleGalleryClick);
document.getElementById('gallery-mejia')?.addEventListener('keydown',  handleGalleryKeydown);

if (lightbox) {
  lightbox.querySelector('.lightbox-close').addEventListener('click', closeLightbox);
  lightbox.querySelector('.lightbox-prev').addEventListener('click',  prevPhoto);
  lightbox.querySelector('.lightbox-next').addEventListener('click',  nextPhoto);

  lightbox.addEventListener('click', e => {
    if (e.target === lightbox) closeLightbox();
  });

  document.addEventListener('keydown', e => {
    if (!lightbox.classList.contains('open')) return;
    if (e.key === 'Escape')     closeLightbox();
    if (e.key === 'ArrowLeft')  prevPhoto();
    if (e.key === 'ArrowRight') nextPhoto();
  });

  // Swipe en lightbox (mobile)
  let lbTouchX = null;
  lightbox.addEventListener('touchstart', e => {
    lbTouchX = e.touches[0].clientX;
  }, { passive: true });
  lightbox.addEventListener('touchend', e => {
    if (lbTouchX === null) return;
    const diff = e.changedTouches[0].clientX - lbTouchX;
    if (Math.abs(diff) > 40) diff < 0 ? nextPhoto() : prevPhoto();
    lbTouchX = null;
  }, { passive: true });
}
