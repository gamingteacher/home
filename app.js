/**
 * app.js — Gaming Teacher SPA logic
 * - Press Start transition
 * - Sidebar active link tracking (IntersectionObserver)
 * - Mobile hamburger menu
 * - Section reveal animations
 */
(function () {
  'use strict';

  /* ── Press Start ─────────────────────────────── */
  const startScreen = document.getElementById('screen-start');
  const mainScreen  = document.getElementById('screen-main');
  const btnStart    = document.getElementById('btn-start');

  function enterSite() {
    startScreen.classList.add('hiding');
    mainScreen.setAttribute('aria-hidden', 'false');
    mainScreen.classList.add('visible');
    setTimeout(() => {
      startScreen.classList.add('hidden');
    }, 650);
    // Trigger section observer now that main is visible
    observeSections();
  }

  if (btnStart) {
    btnStart.addEventListener('click', enterSite);
    // also allow Enter/Space on keyboard
    btnStart.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); enterSite(); }
    });
  }

  /* ── Sidebar active nav via IntersectionObserver ─ */
  const navLinks = document.querySelectorAll('.sidebar-nav a');
  const sections = document.querySelectorAll('.section');
  let sectionObserver;

  function setActiveNav(id) {
    navLinks.forEach(a => {
      const href = a.getAttribute('href');
      if (href === '#' + id) {
        a.classList.add('active');
      } else {
        a.classList.remove('active');
      }
    });
  }

  function observeSections() {
    if (sectionObserver) return; // already running

    // Section reveal + active nav
    sectionObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          setActiveNav(entry.target.id);
        }
      });
    }, {
      root: document.getElementById('content-area'),
      threshold: 0.15,
    });

    sections.forEach(s => sectionObserver.observe(s));
  }

  /* ── Mobile hamburger ────────────────────────── */
  const hamburger = document.getElementById('btn-hamburger');
  const sidebar   = document.getElementById('sidebar');

  if (hamburger && sidebar) {
    hamburger.addEventListener('click', () => {
      const isOpen = hamburger.classList.toggle('open');
      sidebar.classList.toggle('mobile-open', isOpen);
      hamburger.setAttribute('aria-expanded', String(isOpen));
    });

    // Close sidebar when a nav link is tapped on mobile
    sidebar.querySelectorAll('.sidebar-nav a').forEach(a => {
      a.addEventListener('click', () => {
        if (window.innerWidth <= 860) {
          hamburger.classList.remove('open');
          sidebar.classList.remove('mobile-open');
          hamburger.setAttribute('aria-expanded', 'false');
        }
      });
    });
  }

  /* ── Smooth scroll for sidebar links ────────────
     (content-area is the scroll container, not window) */
  const contentArea = document.getElementById('content-area');

  navLinks.forEach(a => {
    a.addEventListener('click', (e) => {
      const targetId = a.getAttribute('href').slice(1);
      const target = document.getElementById(targetId);
      if (target && contentArea) {
        e.preventDefault();
        contentArea.scrollTo({
          top: target.offsetTop - 32,
          behavior: 'smooth',
        });
      }
    });
  });

})();
