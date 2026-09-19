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

/* ============================================================
   KITTEN RUNNER (mini offline-dino homage)
   ============================================================ */
function initKittenGame() {
  const canvas = document.getElementById('kitten-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  ctx.imageSmoothingEnabled = false;

  const W = canvas.width;
  const H = canvas.height;
  const GROUND_Y = 155;
  const PX = 3; // pixel-art unit size (cacti / ground)
  const KPX = 2.3; // pixel-art unit size (kitten sprite, finer grid)

  const rootStyle = getComputedStyle(document.documentElement);
  const COLOR_FG  = rootStyle.getPropertyValue('--text').trim()    || '#F0EDE6';
  const COLOR_DIM = rootStyle.getPropertyValue('--text-dimmer').trim() || 'rgba(240,237,230,0.25)';

  // White cat sprite, hand-pixelled to match the reference pose.
  // Grid is top-down (y = 0 at the top of the bounding box); cat faces right.
  const CAT_COLORS = {
    D: '#f2efe8', // body base (fur white)
    M: '#e0dccf', // body secondary tone / shading
    H: '#ffffff', // back/rim highlight
    P: '#eab8bd', // ear inner / cheek pink
    R: '#c99a86', // far ear tip
    Y: '#a9d6e5', // eye
    K: '#232326', // pupil
  };
  const KITTEN_BODY = [
    // tail, curling up from the back with a fluffy hooked tip
    { x: 5, y: 9, w: 2, h: 2, c: 'M' },
    { x: 4, y: 7, w: 2, h: 2, c: 'M' },
    { x: 3, y: 5, w: 2, h: 2, c: 'D' },
    { x: 2, y: 3, w: 2, h: 2, c: 'D' },
    { x: 0.7, y: 0.7, w: 2.3, h: 2.3, c: 'D' },
    { x: 2.6, y: -0.4, w: 2.3, h: 2.3, c: 'D' },
    // back rim-light + torso
    { x: 6, y: 9,  w: 12, h: 1, c: 'H' },
    { x: 6, y: 10, w: 13, h: 5, c: 'D' },
    { x: 19, y: 11, w: 3, h: 3, c: 'D' },
    // head + snout (a touch bigger/rounder for a cuter, chibi proportion)
    { x: 19.5, y: 5.3, w: 6.7, h: 6.7, c: 'D' },
    { x: 24.3, y: 6.8, w: 2.2, h: 4.2, c: 'D' },
    // ears
    { x: 20.8, y: 2.3,  w: 2, h: 3,   c: 'D' },
    { x: 21.4, y: 2.9,  w: 1, h: 1.7, c: 'P' },
    { x: 24.2, y: 2.3,  w: 2, h: 3,   c: 'D' },
    { x: 24.7, y: 2.7,  w: 1, h: 1.5, c: 'R' },
    // big round eye with a sparkle highlight
    { x: 22.6, y: 7.4, w: 2.2, h: 2.2, c: 'Y' },
    { x: 23.0, y: 7.8, w: 1.1, h: 1.1, c: 'K' },
    { x: 23.7, y: 7.9, w: 0.5, h: 0.5, c: 'H' },
    // tiny pink nose + cheek blush
    { x: 25.6, y: 9.0, w: 0.8, h: 0.7, c: 'P' },
    { x: 25.2, y: 10.0, w: 1.3, h: 1.3, c: 'P' },
  ];
  const KITTEN_LEGS = {
    run1: [
      { x: 7,  y: 15, w: 2, h: 2, c: 'M' },
      { x: 10, y: 15, w: 2, h: 4, c: 'D' },
      { x: 15, y: 15, w: 2, h: 4, c: 'D' },
      { x: 18, y: 15, w: 2, h: 2, c: 'M' },
    ],
    run2: [
      { x: 7,  y: 15, w: 2, h: 4, c: 'D' },
      { x: 10, y: 15, w: 2, h: 2, c: 'M' },
      { x: 15, y: 15, w: 2, h: 2, c: 'M' },
      { x: 18, y: 15, w: 2, h: 4, c: 'D' },
    ],
    // legs stretched into a leap: trailing back paw, tucked middle pair, reaching front paw
    jump: [
      { x: 2,  y: 16, w: 2, h: 3, c: 'D' },
      { x: 4,  y: 14, w: 2, h: 2, c: 'M' },
      { x: 9,  y: 15, w: 2, h: 2, c: 'M' },
      { x: 15, y: 15, w: 2, h: 2, c: 'M' },
      { x: 19, y: 13, w: 2, h: 2, c: 'M' },
      { x: 22, y: 15, w: 2, h: 3, c: 'D' },
    ],
  };
  const SPRITE_W = 26 * KPX;
  const SPRITE_H = 19 * KPX;

  function drawSprite(blocks, originX, originYTop) {
    blocks.forEach(b => {
      ctx.fillStyle = CAT_COLORS[b.c];
      ctx.fillRect(originX + b.x * KPX, originYTop + b.y * KPX, b.w * KPX, b.h * KPX);
    });
  }

  // Cactus obstacles, pixel blocks on their own grid (y = 0 at base)
  const CACTI = [
    { w: 6,  h: 12, blocks: [{ x: 2, y: 0, w: 2, h: 12 }, { x: 0, y: 5, w: 2, h: 2 }, { x: 4, y: 8, w: 2, h: 2 }] },
    { w: 6,  h: 14, blocks: [{ x: 2, y: 0, w: 2, h: 14 }, { x: 0, y: 4, w: 2, h: 2 }, { x: 0, y: 9, w: 2, h: 2 }, { x: 4, y: 6, w: 2, h: 2 }] },
    { w: 10, h: 10, blocks: [{ x: 0, y: 0, w: 2, h: 8 }, { x: 4, y: 0, w: 2, h: 10 }, { x: 8, y: 0, w: 2, h: 8 }, { x: 6, y: 5, w: 2, h: 2 }] },
  ];

  function drawBlocks(blocks, originX, originY, scale, color) {
    ctx.fillStyle = color;
    blocks.forEach(b => {
      ctx.fillRect(originX + b.x * scale, originY - (b.y + b.h) * scale, b.w * scale, b.h * scale);
    });
  }

  function randRange(min, max) { return Math.random() * (max - min) + min; }

  const kitten = { x: 40, y: 0, vy: 0, onGround: true };
  const GRAVITY = 0.6;
  const JUMP_VELOCITY = -10.8;

  let speed = 3;
  let state = 'idle'; // idle | running | over
  let score = 0;
  let highScore = Number(localStorage.getItem('kittenGameHighScore') || 0);
  let runFrame = 0;
  let frameTimer = 0;
  let obstacles = [];
  let nextSpawnIn = 0;
  let groundDashOffset = 0;
  let pebbles = [];

  function resetGame() {
    kitten.y = 0;
    kitten.vy = 0;
    kitten.onGround = true;
    speed = 3;
    score = 0;
    obstacles = [];
    nextSpawnIn = randRange(80, 130);
    pebbles = Array.from({ length: 10 }, () => ({ x: Math.random() * W, size: Math.random() < 0.5 ? 1 : 2 }));
  }

  function spawnObstacle() {
    const def = CACTI[Math.floor(Math.random() * CACTI.length)];
    obstacles.push({ x: W + 10, def });
  }

  function jump() {
    if (kitten.onGround) {
      kitten.vy = JUMP_VELOCITY;
      kitten.onGround = false;
    }
  }

  function startOrJump() {
    if (state === 'running') {
      jump();
    } else {
      state = 'running';
      resetGame();
    }
  }

  function gameOver() {
    state = 'over';
    const finalScore = Math.floor(score);
    if (finalScore > highScore) {
      highScore = finalScore;
      localStorage.setItem('kittenGameHighScore', String(highScore));
    }
  }

  function update() {
    if (state !== 'running') return;

    kitten.vy += GRAVITY;
    kitten.y -= kitten.vy;
    if (kitten.y <= 0) {
      kitten.y = 0;
      kitten.vy = 0;
      kitten.onGround = true;
    }

    speed = Math.min(3 + score / 300, 6);

    groundDashOffset = (groundDashOffset + speed) % 24;
    pebbles.forEach(p => {
      p.x -= speed;
      if (p.x < -4) p.x = W + Math.random() * 40;
    });

    nextSpawnIn -= 1;
    if (nextSpawnIn <= 0) {
      spawnObstacle();
      nextSpawnIn = Math.max(65, randRange(110, 175) - speed * 4);
    }
    obstacles.forEach(o => { o.x -= speed; });
    obstacles = obstacles.filter(o => o.x + o.def.w * PX > 0);

    frameTimer += 1;
    if (frameTimer > 6) {
      frameTimer = 0;
      runFrame = runFrame === 0 ? 1 : 0;
    }

    score += speed * 0.05;

    const sideMargin = SPRITE_W * 0.30, topMargin = SPRITE_H * 0.32, bottomMargin = SPRITE_H * 0.07;
    const kx1 = kitten.x + sideMargin, kx2 = kitten.x + SPRITE_W - sideMargin;
    const ky1 = GROUND_Y - kitten.y - SPRITE_H + topMargin, ky2 = GROUND_Y - kitten.y - bottomMargin;
    for (const o of obstacles) {
      const ow = o.def.w * PX, oh = o.def.h * PX;
      const ox1 = o.x + 3, ox2 = o.x + ow - 3;
      const oy1 = GROUND_Y - oh + 2, oy2 = GROUND_Y;
      if (kx1 < ox2 && kx2 > ox1 && ky1 < oy2 && ky2 > oy1) {
        gameOver();
        break;
      }
    }
  }

  function draw() {
    ctx.clearRect(0, 0, W, H);

    ctx.strokeStyle = COLOR_FG;
    ctx.lineWidth = 2;
    ctx.setLineDash([10, 6]);
    ctx.lineDashOffset = -groundDashOffset;
    ctx.beginPath();
    ctx.moveTo(0, GROUND_Y + 1);
    ctx.lineTo(W, GROUND_Y + 1);
    ctx.stroke();
    ctx.setLineDash([]);

    ctx.fillStyle = COLOR_FG;
    pebbles.forEach(p => ctx.fillRect(p.x, GROUND_Y + 5, p.size, p.size));

    obstacles.forEach(o => drawBlocks(o.def.blocks, o.x, GROUND_Y, PX, COLOR_FG));

    const legFrame = !kitten.onGround ? 'jump' : (runFrame === 0 ? 'run1' : 'run2');
    const originX = kitten.x;
    const originYTop = GROUND_Y - kitten.y - SPRITE_H;

    if (!kitten.onGround) {
      const angle = Math.max(-0.28, Math.min(0.28, kitten.vy * 0.025));
      const cx = originX + SPRITE_W / 2, cy = originYTop + SPRITE_H / 2;
      ctx.save();
      ctx.translate(cx, cy);
      ctx.rotate(angle);
      ctx.translate(-cx, -cy);
      drawSprite(KITTEN_BODY, originX, originYTop);
      drawSprite(KITTEN_LEGS[legFrame], originX, originYTop);
      ctx.restore();
    } else {
      drawSprite(KITTEN_BODY, originX, originYTop);
      drawSprite(KITTEN_LEGS[legFrame], originX, originYTop);
    }

    ctx.font = "14px 'JetBrains Mono', monospace";
    ctx.textAlign = 'right';
    ctx.textBaseline = 'alphabetic';
    const scoreStr = String(Math.floor(score)).padStart(5, '0');
    ctx.fillStyle = COLOR_FG;
    ctx.fillText(scoreStr, W - 10, 22);
    if (highScore > 0) {
      ctx.fillStyle = COLOR_DIM;
      const hiStr = 'HI ' + String(highScore).padStart(5, '0');
      ctx.fillText(hiStr, W - 10 - ctx.measureText(scoreStr).width - 18, 22);
    }

    if (state === 'over') {
      ctx.textAlign = 'center';
      ctx.font = "16px 'JetBrains Mono', monospace";
      ctx.fillStyle = COLOR_FG;
      ctx.fillText('G A M E   O V E R', W / 2, GROUND_Y / 2 - 6);
      ctx.font = "11px 'JetBrains Mono', monospace";
      ctx.fillStyle = COLOR_DIM;
      ctx.fillText('press space or tap to restart', W / 2, GROUND_Y / 2 + 14);
    }
  }

  function loop() {
    update();
    draw();
    requestAnimationFrame(loop);
  }

  resetGame();
  draw();

  document.addEventListener('keydown', e => {
    if (e.code === 'Space' || e.code === 'ArrowUp') {
      e.preventDefault();
      startOrJump();
    }
  });
  canvas.addEventListener('pointerdown', e => {
    e.preventDefault();
    startOrJump();
  });

  requestAnimationFrame(loop);
}

initKittenGame();
