# Hero Splash Reveal Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Layer `assets/lilyOverlay.mp4` beneath the existing hero background video (`assets/lily.mp4`) and reveal it through an organic, feathered, cursor-following splash mask on hover.

**Architecture:** A second `<video>` sits directly above the base hero video in the DOM, masked via a CSS `mask: url(#hero-splash-mask)` referencing an SVG `<mask>` containing a `<circle>`. An SVG filter chain (`feTurbulence` → `feDisplacementMap` → `feGaussianBlur`) warps that circle into a feathered, irregular blob. Plain JS drives the circle's `cx`/`cy`/`r` each frame via `requestAnimationFrame`, eased toward the cursor position (reusing the lerp pattern already used for the custom cursor in `script.js`), and eases `r` between `0` and the full splash radius on hover enter/leave.

**Tech Stack:** Vanilla HTML/CSS/JS, no build step, no test framework — this repo is a static site (`index.html`, `style.css`, `script.js`).

## Global Constraints

- Desktop / hover-capable devices only — gate all new JS behind `window.matchMedia('(hover: none)').matches` returning `false`, matching the existing guard at `script.js:12`.
- No automated test framework exists in this repo — verification is manual, in-browser, per task.
- The splash must not be a plain circle — it must read as an organic, feathered blob (SVG turbulence/displacement, not just a soft radial gradient).
- `prefers-reduced-motion: reduce` disables only the continuous idle "breathing" turbulence animation. The hover-follow and enter/leave easing stay enabled (consistent with every other hover effect in this codebase — none are currently gated on reduced motion).
- The dark `.hero-video-overlay` gradient must remain the topmost layer of the three (base video, reveal video, gradient) so headline text legibility is unaffected.
- Reuse the existing eased-follow (lerp) approach already implemented for the custom cursor in `script.js` (`ringX/ringY` easing toward `mouseX/mouseY`) rather than introducing a new pattern.

---

### Task 1: Static splash markup, mask, and filter

**Files:**
- Modify: `index.html:50-54` (hero section)
- Modify: `style.css` (add new rules after the `.hero-video-overlay` block, currently `style.css:329-339`)

**Interfaces:**
- Produces: `#hero-splash-circle` (SVG `<circle>` element, attributes `cx`, `cy`, `r` — consumed by Task 2's JS), `#hero-splash-turbulence` (SVG `<feTurbulence>` element, attribute `baseFrequency` — consumed by Task 3's JS), CSS class `.hero-video--reveal` (consumed by no later task, just applied here).

- [ ] **Step 1: Add the reveal video and hidden SVG mask/filter defs to `index.html`**

Replace this block (`index.html:50-54`):

```html
  <section class="hero">
    <video class="hero-video" autoplay muted loop playsinline>
      <source src="assets/lily.mp4" type="video/mp4">
    </video>
    <div class="hero-video-overlay" aria-hidden="true"></div>
```

with:

```html
  <section class="hero">
    <video class="hero-video" autoplay muted loop playsinline>
      <source src="assets/lily.mp4" type="video/mp4">
    </video>
    <video class="hero-video hero-video--reveal" id="hero-video-reveal" autoplay muted loop playsinline aria-hidden="true">
      <source src="assets/lilyOverlay.mp4" type="video/mp4">
    </video>
    <svg class="hero-splash-defs" aria-hidden="true" focusable="false">
      <defs>
        <filter id="hero-splash-filter" x="-60%" y="-60%" width="220%" height="220%">
          <feTurbulence id="hero-splash-turbulence" type="fractalNoise" baseFrequency="0.015 0.02" numOctaves="2" seed="7" result="noise" />
          <feDisplacementMap in="SourceGraphic" in2="noise" scale="60" xChannelSelector="R" yChannelSelector="G" result="displaced" />
          <feGaussianBlur in="displaced" stdDeviation="16" />
        </filter>
        <mask id="hero-splash-mask">
          <circle id="hero-splash-circle" cx="0" cy="0" r="180" fill="#ffffff" filter="url(#hero-splash-filter)" />
        </mask>
      </defs>
    </svg>
    <div class="hero-video-overlay" aria-hidden="true"></div>
```

Note: `r="180"` is a temporary hardcoded value (splash radius, ~360px diameter) so the effect is visible for this task's manual check. Task 2 will drive `r` from JS starting at `0`.

- [ ] **Step 2: Add masking CSS to `style.css`**

After the `.hero-video-overlay` rule (ends around `style.css:339`), add:

```css
.hero-splash-defs {
  position: absolute;
  width: 0;
  height: 0;
  overflow: hidden;
}

.hero-video--reveal {
  mask: url(#hero-splash-mask);
  -webkit-mask: url(#hero-splash-mask);
  mask-repeat: no-repeat;
  -webkit-mask-repeat: no-repeat;
}
```

- [ ] **Step 3: Manually verify in-browser**

Run: `python -m http.server 8000` from the project root (`c:\Users\korisnik\Gita\portfolio`), then open `http://localhost:8000/` in a browser.

Expected: A feathered, irregularly-shaped (not a perfect circle) blob is visible in the center-left of the hero section, roughly 360px across, showing `lilyOverlay.mp4` through it while the rest of the hero still shows `lily.mp4`. The blob's edge should look soft and organic, not a hard-edged or perfectly round circle. If the shape still looks like a plain circle, increase the `feDisplacementMap` `scale` value (e.g. to `90`) and re-check.

- [ ] **Step 4: Commit**

```bash
git add index.html style.css
git commit -m "Add hero splash mask markup and styling (static)"
```

---

### Task 2: Cursor-following interactivity

**Files:**
- Modify: `script.js` (add a new section, following the existing banner-comment convention used for `CUSTOM CURSOR`, `NAV SCROLL BEHAVIOR`, etc.)
- Modify: `index.html:64` (change hardcoded `r="180"` back to `r="0"`, since JS now owns the value)

**Interfaces:**
- Consumes: `#hero-splash-circle` (from Task 1), the eased-follow pattern already in `script.js:19-34` (`animateCursor`'s lerp approach — same technique, new independent loop, not a shared function).
- Produces: `initHeroSplash()` function (called at module load, consumed by no later task — Task 3 extends this same function's body).

- [ ] **Step 1: Change the hardcoded radius back to 0**

In `index.html`, change:

```html
<circle id="hero-splash-circle" cx="0" cy="0" r="180" fill="#ffffff" filter="url(#hero-splash-filter)" />
```

to:

```html
<circle id="hero-splash-circle" cx="0" cy="0" r="0" fill="#ffffff" filter="url(#hero-splash-filter)" />
```

- [ ] **Step 2: Add the cursor-follow loop to `script.js`**

Add this new section at the end of `script.js` (after the existing `REDUCE MOTION` section):

```js
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
```

- [ ] **Step 3: Manually verify in-browser**

Run: `python -m http.server 8000` from the project root, open `http://localhost:8000/`.

Expected:
- On page load (mouse not yet over hero), no splash is visible (radius eased to 0).
- Moving the mouse into the hero section grows the splash smoothly from nothing to full size, trailing the cursor with a slight lag (not snapping instantly).
- Moving the mouse around the hero, the splash follows smoothly.
- Moving the mouse out of the hero section shrinks the splash smoothly back to nothing.
- Resizing the browser window keeps the splash correctly aligned with the cursor (no offset drift).

- [ ] **Step 4: Commit**

```bash
git add index.html script.js
git commit -m "Add cursor-following interactivity to hero splash reveal"
```

---

### Task 3: Idle breathing animation, reduced-motion gating, and final polish

**Files:**
- Modify: `script.js` (extend `initHeroSplash()` from Task 2)

**Interfaces:**
- Consumes: `#hero-splash-turbulence` (from Task 1), `initHeroSplash()` (from Task 2, extended in place).
- Produces: nothing consumed by later tasks — this is the final task.

- [ ] **Step 1: Add the idle turbulence "breathing" loop, gated on reduced motion**

In `script.js`, inside `initHeroSplash()`, after the `const SPLASH_RADIUS = 180;` line, add:

```js
  const turbulence = document.getElementById('hero-splash-turbulence');
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
```

Then, after the `animateSplash();` call at the end of `initHeroSplash()`, add:

```js

  if (turbulence && !prefersReducedMotion) {
    let t = 0;
    function animateTurbulence() {
      t += 0.0015;
      const fx = (0.015 + Math.sin(t) * 0.004).toFixed(4);
      const fy = (0.02 + Math.cos(t * 0.8) * 0.004).toFixed(4);
      turbulence.setAttribute('baseFrequency', `${fx} ${fy}`);
      requestAnimationFrame(animateTurbulence);
    }
    animateTurbulence();
  }
```

- [ ] **Step 2: Manually verify the idle breathing and reduced-motion gating**

Run: `python -m http.server 8000` from the project root, open `http://localhost:8000/`.

Expected:
- With the cursor resting still inside the hero (splash fully grown), the blob's edge should subtly shift and undulate over a few seconds — not perfectly static, but a slow, low-amplitude drift (not distracting or fast).
- In Chrome DevTools, open the Rendering tab (Cmd/Ctrl+Shift+P → "Show Rendering") and set "Emulate CSS media feature prefers-reduced-motion" to "reduce". Reload the page: the blob shape should now stay static while the cursor is still, but hover-follow and enter/leave grow/shrink should still work normally.

- [ ] **Step 3: Verify touch/no-hover fallback**

In Chrome DevTools, open the Rendering tab and set "Emulate CSS media feature forced-colors" aside — instead use device toolbar touch emulation, or directly test via DevTools Console: run `matchMedia('(hover: none)').matches` after toggling device emulation (e.g. select "iPhone 14" in the device toolbar) and reload.

Expected: With touch/no-hover emulation active, no splash is ever visible (radius stays 0, no mousemove tracking attached), and the hero shows only the plain `lily.mp4` background — no console errors.

- [ ] **Step 4: Full manual test pass against the spec's testing checklist**

Verify all of the following in a normal desktop browser window (no emulation):
- Mask follows the cursor smoothly across the full hero area.
- Enter/leave reads as a smooth dissolve, not a hard pop.
- Splash shape looks like an organic, feathered blob — not a plain hard-edged circle.
- Headline/body text (`.hero-content`) stays legible over both video layers, at both splash states.

If the splash radius, blur, or displacement scale don't feel right, adjust `SPLASH_RADIUS` in `script.js`, `stdDeviation` on the `feGaussianBlur` in `index.html`, or `scale` on the `feDisplacementMap` in `index.html`, and re-check.

- [ ] **Step 5: Commit**

```bash
git add index.html script.js
git commit -m "Add idle breathing animation and reduced-motion gating to hero splash reveal"
```
