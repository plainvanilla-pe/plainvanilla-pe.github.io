/* ============================================================
   PLAIN VANILLA — main.js
   ============================================================ */

// ── HERO CAROUSEL ─────────────────────────────────────────────
(function initCarousel() {
  const hero = document.getElementById('hero');
  if (!hero?.classList.contains('hero-carousel')) return;

  const slides   = hero.querySelectorAll('.carousel-slide');
  const dots     = hero.querySelectorAll('.carousel-dot');
  const muteBtn  = document.getElementById('hero-mute-btn');
  let current    = 0;
  let timer      = null;

  function goTo(idx) {
    slides[current].classList.remove('is-active');
    dots[current].classList.remove('is-active');
    dots[current].setAttribute('aria-selected', 'false');

    current = (idx + slides.length) % slides.length;

    slides[current].classList.add('is-active');
    dots[current].classList.add('is-active');
    dots[current].setAttribute('aria-selected', 'true');

    if (muteBtn) {
      muteBtn.style.opacity = current === 0 ? '' : '0';
      muteBtn.style.pointerEvents = current === 0 ? '' : 'none';
    }
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

// ── HERO VIDEO MUTE ──────────────────────────────────────────
(function initHeroMute() {
  const video = document.getElementById('hero-video');
  const btn   = document.getElementById('hero-mute-btn');
  if (!video || !btn) return;

  const ICON_MUTED = `<svg xmlns="http://www.w3.org/2000/svg" width="80" height="80" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/><line x1="22" y1="9" x2="16" y2="15"/><line x1="16" y1="9" x2="22" y2="15"/></svg>`;
  const ICON_SOUND = `<svg xmlns="http://www.w3.org/2000/svg" width="80" height="80" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/><path d="M15.54 8.46a5 5 0 0 1 0 7.07"/><path d="M19.07 4.93a10 10 0 0 1 0 14.14"/></svg>`;

  function update() {
    btn.innerHTML = video.muted ? ICON_MUTED : ICON_SOUND;
    btn.setAttribute('aria-label', video.muted ? 'Activar sonido' : 'Silenciar');
  }

  btn.addEventListener('click', () => { video.muted = !video.muted; update(); });
  update();
})();

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

const galeriaSection = document.getElementById('galeria');
if (galeriaSection) {
  galeriaSection.addEventListener('click',   handleGalleryClick);
  galeriaSection.addEventListener('keydown', handleGalleryKeydown);
}

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

// ── EN VIVO — REDISEÑO ───────────────────────────────────────
function escapeHtml(str) {
  return String(str).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
}

(function initEnVivo() {
  const section = document.getElementById('en-vivo');
  if (!section) return;

  const showCardsEl   = document.getElementById('ev-show-cards');
  const overlayEl     = document.getElementById('ev-video-overlay');
  const featuredEl    = document.getElementById('ev-featured');
  const localVideoEl  = document.getElementById('ev-local-video');
  const muteBtnEl     = document.getElementById('ev-mute-btn');
  const videoLabelEl  = document.getElementById('ev-video-label');
  const metaNameEl    = document.getElementById('ev-meta-name');
  const metaLocEl     = document.getElementById('ev-meta-location');
  const trackBadgeEl  = document.getElementById('ev-track-badge');
  const setlistEl     = document.getElementById('ev-setlist');
  const photoStripEl  = document.getElementById('ev-photo-strip');

  const ICON_MUTED = `<svg width="80" height="80" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/><line x1="22" y1="9" x2="16" y2="15"/><line x1="16" y1="9" x2="22" y2="15"/></svg>`;
  const ICON_SOUND = `<svg width="80" height="80" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/><path d="M15.54 8.46a5 5 0 0 1 0 7.07"/><path d="M19.07 4.93a10 10 0 0 1 0 14.14"/></svg>`;

  function updateMuteIcon() {
    if (!muteBtnEl || !localVideoEl) return;
    const muted = localVideoEl.muted;
    muteBtnEl.innerHTML = muted ? ICON_MUTED : ICON_SOUND;
    muteBtnEl.setAttribute('aria-label', muted ? 'Activar sonido' : 'Silenciar');
  }

  if (muteBtnEl) {
    muteBtnEl.addEventListener('click', e => {
      e.stopPropagation();
      localVideoEl.muted = !localVideoEl.muted;
      updateMuteIcon();
    });
  }

  let activeEventId = null;

  // ── Build show selector cards ─────────────────────────────
  function buildShowCards() {
    showCardsEl.innerHTML = '';
    EVENTS_DATA.forEach((event, i) => {
      const card = document.createElement('div');
      card.className = 'ev-show-card' + (i === 0 ? ' is-active' : '');
      card.setAttribute('role', 'tab');
      card.setAttribute('aria-selected', i === 0 ? 'true' : 'false');
      card.setAttribute('aria-label', event.label);
      card.dataset.eventId = event.id;

      const dateText = event.caption
        ? event.caption.split('·')[1]?.trim() ?? 'Próximamente'
        : 'Próximamente';

      card.innerHTML = `
        <p class="ev-show-card-name">${escapeHtml(event.label)}</p>
        <p class="ev-show-card-date">${escapeHtml(dateText)}</p>
      `;

      card.addEventListener('click', () => switchEvent(event));
      showCardsEl.appendChild(card);
    });
  }

  // ── Build setlist ─────────────────────────────────────────
  function buildSetlist(event) {
    setlistEl.innerHTML = '';
    if (!event.videos.length) return;

    const header = document.createElement('div');
    header.className = 'ev-setlist-header';
    header.innerHTML = `<span class="ev-section-label">Setlist</span><div style="flex:1;height:1px;background:rgba(255,255,255,.07)"></div><span class="ev-section-label">${event.videos.length} canciones</span>`;
    setlistEl.appendChild(header);

    event.videos.forEach((video, i) => {
      const row = document.createElement('div');
      row.className = 'ev-setlist-row';
      row.setAttribute('role', 'button');
      row.setAttribute('tabindex', '0');
      row.setAttribute('aria-label', `Reproducir: ${video.song}`);
      row.dataset.youtubeId = video.youtubeId;
      row.dataset.index = i;

      row.innerHTML = `
        <span class="ev-setlist-num">${String(i + 1).padStart(2, '0')}</span>
        <span class="ev-setlist-title">${escapeHtml(video.song)}</span>
        <div class="ev-setlist-right">
          ${video.recommended ? '<span class="ev-setlist-tag">On Fayah</span>' : ''}
          <div class="ev-setlist-dot">
            <svg width="8" height="8" viewBox="0 0 8 8" aria-hidden="true">
              <polygon points="2,1 7,4 2,7"/>
            </svg>
          </div>
        </div>
      `;

      row.addEventListener('click', () => {
        const wasActive = row.classList.contains('is-active');
        setlistEl.querySelectorAll('.ev-setlist-row.is-active')
          .forEach(r => r.classList.remove('is-active'));
        if (!wasActive) {
          row.classList.add('is-active');
          if (video.youtubeId || video.localSrc) {
            stopAutoAdvance();
            loadVideo(video.youtubeId, video.song, video.localSrc);
          }
        }
      });

      row.addEventListener('keydown', e => {
        if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); row.click(); }
      });

      setlistEl.appendChild(row);
    });
  }

  // ── Build photo strip ─────────────────────────────────────
  function buildPhotoStrip(event) {
    photoStripEl.innerHTML = '';
    GALLERY_MAP[event.id] = event.photos;

    event.photos.slice(0, 6).forEach((src, i) => {
      const item = document.createElement('div');
      item.className = 'ev-photo-item';
      item.setAttribute('role', 'button');
      item.setAttribute('tabindex', '0');
      item.setAttribute('aria-label', `Ver foto ${i + 1}`);
      item.dataset.index = i;
      item.dataset.group = event.id;

      const img    = document.createElement('img');
      img.src      = src;
      img.alt      = `Plain Vanilla en vivo — foto ${i + 1}`;
      img.loading  = 'lazy';
      img.decoding = 'async';

      item.appendChild(img);
      photoStripEl.appendChild(item);
    });
  }

  // ── Load video ────────────────────────────────────────────
  function loadVideo(youtubeId, songTitle, localSrc) {
    overlayEl.classList.add('is-hidden');
    if (videoLabelEl) videoLabelEl.textContent = songTitle ?? '';

    if (localSrc) {
      featuredEl.src = '';
      featuredEl.style.display = 'none';
      localVideoEl.src = localSrc;
      localVideoEl.style.display = 'block';
      localVideoEl.muted = true;
      localVideoEl.play();
      if (muteBtnEl) muteBtnEl.style.display = 'flex';
      updateMuteIcon();
    } else {
      localVideoEl.pause();
      localVideoEl.src = '';
      localVideoEl.style.display = 'none';
      if (muteBtnEl) muteBtnEl.style.display = 'none';
      featuredEl.style.display = 'block';
      featuredEl.src = `https://www.youtube.com/embed/${youtubeId}?autoplay=1&rel=0&modestbranding=1`;
    }
  }

  // ── Reset video to overlay state ──────────────────────────
  function resetVideo(event) {
    featuredEl.src = '';
    featuredEl.style.display = 'none';
    localVideoEl.pause();
    localVideoEl.src = '';
    localVideoEl.style.display = 'none';
    if (muteBtnEl) muteBtnEl.style.display = 'none';
    overlayEl.classList.remove('is-hidden');
    if (videoLabelEl) {
      const featured = getFeaturedEntry(event);
      videoLabelEl.textContent = featured ? featured.song : event.label;
    }
  }

  function getFeaturedEntry(event) {
    return event.videos.find(v => v.youtubeId === event.featuredVideo);
  }

  // ── Switch event ──────────────────────────────────────────
  function switchEvent(event) {
    if (event.id === activeEventId) return;
    activeEventId = event.id;

    showCardsEl.querySelectorAll('.ev-show-card').forEach(card => {
      const active = card.dataset.eventId === event.id;
      card.classList.toggle('is-active', active);
      card.setAttribute('aria-selected', active ? 'true' : 'false');
    });

    if (metaNameEl)    metaNameEl.textContent   = event.label;
    if (metaLocEl)     metaLocEl.textContent     = event.caption ?? '';
    if (trackBadgeEl)  trackBadgeEl.textContent  = event.videos.length ? `${event.videos.length} tracks` : '';

    if (event.featuredVideo) {
      resetVideo(event);
    } else {
      featuredEl.src = '';
      featuredEl.style.display = 'none';
      overlayEl.classList.add('is-hidden');
    }

    buildSetlist(event);
    buildPhotoStrip(event);
  }

  // ── Play overlay click ────────────────────────────────────
  if (overlayEl) {
    overlayEl.addEventListener('click', () => {
      const event = EVENTS_DATA.find(e => e.id === activeEventId);
      if (event?.featuredVideo) {
        const featured = getFeaturedEntry(event);
        loadVideo(event.featuredVideo, featured?.song ?? event.label, featured?.localSrc);
      }
    });
  }

  // ── Lightbox para el photo strip ─────────────────────────
  if (photoStripEl) {
    photoStripEl.addEventListener('click',   handleGalleryClick);
    photoStripEl.addEventListener('keydown', handleGalleryKeydown);
  }

  // ── Auto-advance show cards ───────────────────────────────
  let autoAdvanceTimer = null;

  function scheduleAutoAdvance() {
    clearInterval(autoAdvanceTimer);
    autoAdvanceTimer = setInterval(() => {
      const currentIndex = EVENTS_DATA.findIndex(e => e.id === activeEventId);
      const nextIndex = (currentIndex + 1) % EVENTS_DATA.length;
      switchEvent(EVENTS_DATA[nextIndex]);
    }, 13000);
  }

  function stopAutoAdvance() { clearInterval(autoAdvanceTimer); }

  if (showCardsEl) {
    showCardsEl.addEventListener('click', stopAutoAdvance, { capture: true });
  }
  if (overlayEl) {
    overlayEl.addEventListener('click', stopAutoAdvance, { capture: true });
  }

  // ── Init ──────────────────────────────────────────────────
  buildShowCards();
  switchEvent(EVENTS_DATA[0]);
  scheduleAutoAdvance();
})();
