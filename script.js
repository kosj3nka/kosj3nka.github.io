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
const heroSection = document.querySelector('.hero');

function updateNavState() {
  const outsideHero = heroSection
    ? heroSection.getBoundingClientRect().bottom <= 0
    : window.scrollY > 40;

  nav.classList.toggle('scrolled', outsideHero);
}

window.addEventListener('scroll', updateNavState, { passive: true });
updateNavState();

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

  const revealVideo = document.getElementById('hero-video-reveal');
  if (revealVideo) {
    const source = document.createElement('source');
    source.src = 'assets/lilyOverlay.mp4';
    source.type = 'video/mp4';
    revealVideo.appendChild(source);
    revealVideo.load();
    revealVideo.classList.add('is-ready');
  }

  const SPLASH_RADIUS = 180; // px

  const turbulence = document.getElementById('hero-splash-turbulence');
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

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

  const TRAIL_LERP = 0.3;
  const TRAIL_STEP_SCALE = 0.72;
  const trail = [1, 2, 3, 4]
    .map(i => document.getElementById(`hero-splash-trail-${i}`))
    .filter(Boolean)
    .map(el => ({ el, x: targetX, y: targetY, r: 0 }));

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

    let prevX = splashX, prevY = splashY, prevR = splashR;
    trail.forEach(node => {
      node.x += (prevX - node.x) * TRAIL_LERP;
      node.y += (prevY - node.y) * TRAIL_LERP;
      node.r += (prevR * TRAIL_STEP_SCALE - node.r) * TRAIL_LERP;

      node.el.setAttribute('cx', node.x.toFixed(1));
      node.el.setAttribute('cy', node.y.toFixed(1));
      node.el.setAttribute('r', Math.max(0, node.r).toFixed(1));

      prevX = node.x; prevY = node.y; prevR = node.r;
    });

    requestAnimationFrame(animateSplash);
  }

  animateSplash();

  if (turbulence && !prefersReducedMotion) {
    let t = 0;
    function animateTurbulence() {
      t += 0.0015;
      const fx = (0.008 + Math.sin(t) * 0.002).toFixed(4);
      const fy = (0.011 + Math.cos(t * 0.8) * 0.002).toFixed(4);
      turbulence.setAttribute('baseFrequency', `${fx} ${fy}`);
      requestAnimationFrame(animateTurbulence);
    }
    animateTurbulence();
  }
}

initHeroSplash();

/* ============================================================
   ACCORDION SECTIONS (Certificates / Work Experience)
   ============================================================ */
function initAccordions() {
  const headers = document.querySelectorAll('.accordion-header');

  headers.forEach(header => {
    const panel = document.getElementById(header.getAttribute('aria-controls'));
    if (!panel) return;

    if (prefersReducedMotion.matches) panel.style.transition = 'none';

    header.addEventListener('click', () => {
      const isOpen = header.classList.toggle('is-open');
      header.setAttribute('aria-expanded', String(isOpen));
      panel.style.maxHeight = isOpen ? `${panel.scrollHeight}px` : '0';
    });
  });
}

initAccordions();

/* ============================================================
   CLICKABLE GALLERY CARDS (Work section)
   ============================================================ */
function initGalleryCards() {
  document.querySelectorAll('.gallery-card[data-href]').forEach(card => {
    const dest = card.dataset.href;

    const go = () => { window.location.href = dest; };

    card.addEventListener('click', e => {
      if (e.target.closest('a')) return; // let the VIEW link handle itself
      go();
    });

    card.addEventListener('keydown', e => {
      if (e.target !== card) return; // ignore keydown bubbling from the VIEW link
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        go();
      }
    });
  });
}

initGalleryCards();
