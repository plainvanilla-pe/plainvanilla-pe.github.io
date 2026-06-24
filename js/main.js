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

  function startAuto() { clearInterval(timer); timer = setInterval(() => goTo(current + 1), 6000); }
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

  // Scroll rueda (vertical) y trackpad horizontal en desktop
  let wheelLocked = false;
  hero.addEventListener('wheel', e => {
    if (wheelLocked) return;
    const delta = Math.abs(e.deltaX) > Math.abs(e.deltaY) ? e.deltaX : e.deltaY;
    if (Math.abs(delta) < 10) return;
    e.preventDefault();
    wheelLocked = true;
    stopAuto();
    goTo(current + (delta > 0 ? 1 : -1));
    startAuto();
    setTimeout(() => { wheelLocked = false; }, 800);
  }, { passive: false });

  // Drag con mouse en desktop
  let dragStartX = null;
  let wasDragged = false;

  hero.addEventListener('mousedown', e => {
    if (e.button !== 0) return;
    dragStartX = e.clientX;
    wasDragged = false;
    hero.style.cursor = 'grabbing';
    hero.style.userSelect = 'none';
  });

  window.addEventListener('mousemove', e => {
    if (dragStartX === null) return;
    if (Math.abs(e.clientX - dragStartX) > 8) wasDragged = true;
  });

  window.addEventListener('mouseup', e => {
    if (dragStartX === null) return;
    const diff = e.clientX - dragStartX;
    if (wasDragged && Math.abs(diff) > 40) {
      stopAuto();
      goTo(current + (diff < 0 ? 1 : -1));
      startAuto();
    }
    dragStartX = null;
    hero.style.cursor = '';
    hero.style.userSelect = '';
  });

  // Evitar que un drag dispare links internos del hero
  hero.addEventListener('click', e => {
    if (wasDragged) { e.preventDefault(); wasDragged = false; }
  }, true);

  startAuto();
})();

// ── SHOW COUNTDOWN (slide 2 del carrusel) ────────────────────
(function initShowCountdown() {
  const countdownEl = document.getElementById('countdown-show');
  if (!countdownEl) return;

  const SHOW_DATE = PVUtils.SHOW_DATE;

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

// ── NAVBAR & HAMBURGER ────────────────────────────────────────
PVUtils.initNavbar();

const navbar = document.getElementById('navbar');

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
const fadeObserver = PVUtils.initFadeIn();

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
// Los datos de galerías y eventos viven en js/events-data.js

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

buildGallery('gallery-la-noche', GALLERY_LA_NOCHE);
buildGallery('gallery-aperol',   GALLERY_APEROL);
buildGallery('gallery-mejia',    GALLERY_MEJIA);

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
let currentGroup = GALLERY_LA_NOCHE;

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

const GALLERY_MAP = {
  'gallery-la-noche': GALLERY_LA_NOCHE,
  'gallery-aperol':   GALLERY_APEROL,
  'gallery-mejia':    GALLERY_MEJIA,
};

function handleGalleryClick(e) {
  const item = e.target.closest('.gallery-item');
  if (!item) return;
  const group = GALLERY_MAP[item.dataset.group] ?? GALLERY_LA_NOCHE;
  openLightbox(parseInt(item.dataset.index), group);
}

function handleGalleryKeydown(e) {
  const item = e.target.closest('.gallery-item');
  if (item && (e.key === 'Enter' || e.key === ' ')) {
    e.preventDefault();
    const group = GALLERY_MAP[item.dataset.group] ?? GALLERY_LA_NOCHE;
    openLightbox(parseInt(item.dataset.index), group);
  }
}


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

// ── EN VIVO HUB ───────────────────────────────────────────────
(function initEnVivo() {
  const section = document.getElementById('en-vivo');
  if (!section) return;

  const events = [
    {
      id: 'la-noche', label: 'La Noche de Barranco',
      caption: 'La Noche de Barranco · 19 de mayo · Barranco, Lima',
      featuredVideo: 'cYXllpHXKWI',
      videos: [
        { youtubeId: '_6mXFVPkBbE', song: 'Funky Rap' },
        { youtubeId: 'cYXllpHXKWI', song: 'Darte Amor & Bossabebé' },
        { youtubeId: 'DGf1VXfo1ag', song: 'Gata Siamés' },
        { youtubeId: 'nuBomyCoUS8', song: 'Romina' },
      ],
      photos: GALLERY_LA_NOCHE,
    },
    {
      id: 'mejia', label: 'Apertura a Laguna Pai',
      caption: 'Apertura a Laguna Pai · Mejía, Arequipa',
      featuredVideo: 'Dt7FpINKjpA',
      videos: [
        { youtubeId: 'Dt7FpINKjpA', song: 'Verde y Azul' },
        { youtubeId: 'wMpTbeu92oo', song: 'Cliché' },
      ],
      photos: GALLERY_MEJIA,
    },
    {
      id: 'aperol', label: "Aperol O'clock",
      caption: '', featuredVideo: null, videos: [], photos: GALLERY_APEROL,
    },
  ];

  const tabs       = section.querySelectorAll('.ev-tab');
  const featuredEl = document.getElementById('ev-featured');
  const captionEl  = document.getElementById('ev-caption');
  const stageEl    = document.getElementById('ev-stage');
  const stageWrap  = section.querySelector('.ev-stage-video');
  const songsEl    = document.getElementById('ev-songs');
  const grid       = document.getElementById('ev-grid');

  let switchTimer = null;
  let isSwitching = false;

  // ── Song title buttons ────────────────────────────────────
  function buildSongs(event) {
    songsEl.innerHTML = '';
    event.videos.forEach(video => {
      const btn = document.createElement('button');
      btn.className = 'ev-song-btn';
      btn.textContent = video.song;
      btn.addEventListener('click', () => {
        songsEl.querySelectorAll('.ev-song-btn').forEach(b => b.classList.remove('is-active'));
        btn.classList.add('is-active');
        loadVideo(video.youtubeId);
      });
      songsEl.appendChild(btn);
    });
  }

  // ── Load video into featured stage ────────────────────────
  function loadVideo(youtubeId) {
    stageWrap.classList.add('is-fading');
    setTimeout(() => {
      featuredEl.src = `https://www.youtube.com/embed/${youtubeId}?autoplay=1`;
      stageWrap.classList.remove('is-fading');
    }, 300);
    const offset = navbar.offsetHeight + 16;
    const top = stageEl.getBoundingClientRect().top + window.scrollY - offset;
    window.scrollTo({ top, behavior: 'smooth' });
  }

  // ── Photo grid — max 5, Pinterest 2-col ──────────────────
  function buildGrid(event) {
    grid.innerHTML = '';
    GALLERY_MAP[event.id] = event.photos;

    event.photos.slice(0, 5).forEach((src, i) => {
      const card = document.createElement('div');
      card.className = 'gallery-item ev-card--photo fade-in';
      card.dataset.index = i;
      card.dataset.group = event.id;
      card.setAttribute('role', 'button');
      card.setAttribute('tabindex', '0');
      card.setAttribute('aria-label', `Ver foto ${i + 1} de ${event.photos.length}`);

      const img = document.createElement('img');
      img.src = src;
      img.alt = `Plain Vanilla en vivo — foto ${i + 1}`;
      img.loading = 'lazy';
      img.decoding = 'async';

      card.appendChild(img);
      grid.appendChild(card);
      fadeObserver.observe(card);
    });
  }

  // ── Switch event tab ──────────────────────────────────────
  function switchEvent(event) {
    clearTimeout(switchTimer);
    isSwitching = true;

    tabs.forEach(tab => {
      const active = tab.dataset.event === event.id;
      tab.classList.toggle('is-active', active);
      tab.setAttribute('aria-selected', active ? 'true' : 'false');
    });

    if (event.featuredVideo) stageWrap.classList.add('is-fading');
    grid.classList.add('is-fading');
    captionEl.style.opacity = '0';

    switchTimer = setTimeout(() => {
      if (event.featuredVideo) {
        stageEl.classList.remove('ev-stage--hidden');
        captionEl.classList.remove('ev-caption--hidden');
        featuredEl.src = `https://www.youtube.com/embed/${event.featuredVideo}`;
        captionEl.textContent = event.caption;
        stageWrap.classList.remove('is-fading');
        captionEl.style.opacity = '';
      } else {
        stageEl.classList.add('ev-stage--hidden');
        captionEl.classList.add('ev-caption--hidden');
      }

      buildSongs(event);
      buildGrid(event);
      grid.classList.remove('is-fading');
      isSwitching = false;
    }, 350);
  }

  // ── Tab clicks + keyboard ─────────────────────────────────
  tabs.forEach((tab, i) => {
    tab.addEventListener('click', () => {
      if (isSwitching) return;
      const event = events.find(e => e.id === tab.dataset.event);
      if (event) switchEvent(event);
    });
    tab.addEventListener('keydown', e => {
      if (e.key === 'ArrowRight') { const next = tabs[(i + 1) % tabs.length]; next.focus(); next.click(); }
      if (e.key === 'ArrowLeft')  { const prev = tabs[(i - 1 + tabs.length) % tabs.length]; prev.focus(); prev.click(); }
    });
  });

  // ── Lightbox para fotos ───────────────────────────────────
  grid.addEventListener('click',   handleGalleryClick);
  grid.addEventListener('keydown', handleGalleryKeydown);

  // ── Init ──────────────────────────────────────────────────
  buildSongs(events[0]);
  buildGrid(events[0]);
})();
