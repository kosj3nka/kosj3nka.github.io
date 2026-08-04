/* ============================================================
   CUSTOM CURSOR
   ============================================================ */
const cursor    = document.getElementById('cursor');
const cursorDot = document.getElementById('cursor-dot');

let mouseX = 0, mouseY = 0;
let dotX   = 0, dotY   = 0;
let ringX  = 0, ringY  = 0;

function initCursor() {
  if (window.matchMedia('(hover: none)').matches) return; // skip on touch

  document.addEventListener('mousemove', e => {
    mouseX = e.clientX;
    mouseY = e.clientY;
  });

  function animateCursor() {
    // Dot follows instantly
    dotX  += (mouseX - dotX)  * 0.9;
    dotY  += (mouseY - dotY)  * 0.9;

    // Ring lags behind
    ringX += (mouseX - ringX) * 0.12;
    ringY += (mouseY - ringY) * 0.12;

    if (cursor)    cursor.style.transform    = `translate(${ringX}px, ${ringY}px) translate(-50%, -50%)`;
    if (cursorDot) cursorDot.style.transform = `translate(${dotX}px, ${dotY}px) translate(-50%, -50%)`;

    requestAnimationFrame(animateCursor);
  }

  animateCursor();
}

initCursor();

/* ============================================================
   NAV SCROLL BEHAVIOR
   ============================================================ */
const nav = document.getElementById('nav');

window.addEventListener('scroll', () => {
  if (window.scrollY > 40) {
    nav.classList.add('scrolled');
  } else {
    nav.classList.remove('scrolled');
  }
}, { passive: true });

/* ============================================================
   MOBILE MENU
   ============================================================ */
const hamburger   = document.getElementById('hamburger');
const menuOverlay = document.getElementById('menu-overlay');
let menuOpen = false;

function openMenu() {
  menuOpen = true;
  hamburger.classList.add('active');
  hamburger.setAttribute('aria-label', 'Close menu');
  menuOverlay.classList.add('active');
  document.body.style.overflow = 'hidden';
}

function closeMenu() {
  menuOpen = false;
  hamburger.classList.remove('active');
  hamburger.setAttribute('aria-label', 'Open menu');
  menuOverlay.classList.remove('active');
  document.body.style.overflow = '';
}

hamburger.addEventListener('click', () => {
  menuOpen ? closeMenu() : openMenu();
});

// Close on escape
document.addEventListener('keydown', e => {
  if (e.key === 'Escape' && menuOpen) closeMenu();
});

// Close when clicking outside the menu inner
menuOverlay.addEventListener('click', e => {
  if (e.target === menuOverlay) closeMenu();
});

/* ============================================================
   SCROLL REVEAL (IntersectionObserver)
   ============================================================ */
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;

    const delay = parseInt(entry.target.dataset.delay || '0', 10);

    setTimeout(() => {
      entry.target.classList.add('visible');
    }, delay);

    revealObserver.unobserve(entry.target);
  });
}, {
  threshold: 0.08,
  rootMargin: '0px 0px -40px 0px'
});

document.querySelectorAll('.reveal').forEach(el => {
  revealObserver.observe(el);
});

/* ============================================================
   SMOOTH SCROLL for anchor links
   ============================================================ */
document.querySelectorAll('a[href^="#"]').forEach(link => {
  link.addEventListener('click', e => {
    const targetId = link.getAttribute('href');
    if (targetId === '#') return;

    const target = document.querySelector(targetId);
    if (!target) return;

    e.preventDefault();
    target.scrollIntoView({ behavior: 'smooth', block: 'start' });
  });
});

/* ============================================================
   REDUCE MOTION — respect user preference
   ============================================================ */
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

if (prefersReducedMotion.matches) {
  // Instantly reveal all elements
  document.querySelectorAll('.reveal').forEach(el => {
    el.classList.add('visible');
  });

  // Stop ticker
  const ticker = document.querySelector('.ticker-track');
  if (ticker) ticker.style.animationPlayState = 'paused';
}

/* ============================================================
   HERO SPLASH REVEAL
   ============================================================ */
function initHeroSplash() {
  const hero   = document.querySelector('.hero');
  const circle = document.getElementById('hero-splash-circle');

  if (!hero || !circle) return;
  if (window.matchMedia('(hover: none)').matches) return; // skip on touch

  const SPLASH_RADIUS = 180; // px

  let heroRect = hero.getBoundingClientRect();
  window.addEventListener('resize', () => {
    heroRect = hero.getBoundingClientRect();
  }, { passive: true });

  let targetX = heroRect.width / 2;
  let targetY = heroRect.height / 2;
  let splashX = targetX;
  let splashY = targetY;
  let targetR = 0;
  let splashR = 0;

  hero.addEventListener('mousemove', e => {
    heroRect = hero.getBoundingClientRect();
    targetX = e.clientX - heroRect.left;
    targetY = e.clientY - heroRect.top;
  });

  hero.addEventListener('mouseenter', () => { targetR = SPLASH_RADIUS; });
  hero.addEventListener('mouseleave', () => { targetR = 0; });

  function animateSplash() {
    splashX += (targetX - splashX) * 0.12;
    splashY += (targetY - splashY) * 0.12;
    splashR += (targetR - splashR) * 0.15;

    circle.setAttribute('cx', splashX.toFixed(1));
    circle.setAttribute('cy', splashY.toFixed(1));
    circle.setAttribute('r', splashR.toFixed(1));

    requestAnimationFrame(animateSplash);
  }

  animateSplash();
}

initHeroSplash();
