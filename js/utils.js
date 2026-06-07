/* ============================================================
   PLAIN VANILLA — utils.js
   Shared utilities loaded on every page before main.js / show.js
   ============================================================ */
(function() {

  function initNavbar() {
    const navbar    = document.getElementById('navbar');
    const hamburger = document.querySelector('.hamburger');
    const navLinks  = document.querySelector('.nav-links');
    if (!hamburger) return;

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

    navLinks.querySelectorAll('a').forEach(l => l.addEventListener('click', closeMenu));

    window.addEventListener('scroll', () => {
      navbar.classList.toggle('scrolled', window.scrollY > 60);
      if (hamburger.classList.contains('open')) closeMenu();
    }, { passive: true });
  }

  function initFadeIn() {
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        const siblings = entry.target.parentElement.querySelectorAll('.fade-in');
        const idx = Array.from(siblings).indexOf(entry.target);
        setTimeout(() => entry.target.classList.add('visible'), idx * 80);
        observer.unobserve(entry.target);
      });
    }, { threshold: 0.12 });

    document.querySelectorAll('.fade-in').forEach(el => observer.observe(el));
    return observer;
  }

  window.PVUtils = { initNavbar, initFadeIn };
})();
