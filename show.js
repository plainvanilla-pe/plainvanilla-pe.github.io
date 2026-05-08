/* ============================================================
   PLAIN VANILLA — show.js
   Specific logic for show.html (event page)
   ============================================================ */

// ── NAVBAR SCROLL ─────────────────────────────────────────────
const navbar = document.getElementById('navbar');

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

window.addEventListener('scroll', () => {
  navbar?.classList.toggle('scrolled', window.scrollY > 60);
}, { passive: true });

// ── FADE-IN ON SCROLL ─────────────────────────────────────────
const fadeObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      fadeObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });

document.querySelectorAll('.fade-in').forEach(el => fadeObserver.observe(el));

// ── PARALLAX HERO ─────────────────────────────────────────────
// Parallax desactivado: hero usa background-size: contain, el transform lo recortaría

// ── COUNTDOWN — SHOW DATE ────────────────────────────────────
const SHOW_DATE = new Date('2026-05-19T22:00:00-05:00'); // La Noche de Barranco — 19 mayo 2026, 10PM Lima

(function initShowCountdown() {
  const countdownEl = document.getElementById('countdown-show');
  if (!countdownEl) return;

  function tick() {
    const diff = SHOW_DATE - Date.now();

    if (diff <= 0) {
      countdownEl.innerHTML = `
        <p style="font-family:'Space Grotesk',sans-serif;letter-spacing:0.2em;
                  text-transform:uppercase;font-size:0.85rem;color:var(--accent)">
          ¡Esta noche es el show!
        </p>`;
      return;
    }

    const days    = Math.floor(diff / 86400000);
    const hours   = Math.floor((diff % 86400000) / 3600000);
    const minutes = Math.floor((diff % 3600000)  / 60000);
    const seconds = Math.floor((diff % 60000)    / 1000);

    const pad = n => String(n).padStart(2, '0');
    document.getElementById('s-days').textContent    = pad(days);
    document.getElementById('s-hours').textContent   = pad(hours);
    document.getElementById('s-minutes').textContent = pad(minutes);
    document.getElementById('s-seconds').textContent = pad(seconds);

    setTimeout(tick, 1000);
  }

  tick();
})();

