# Work Categorization + Certificates + Work Experience Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Split the Work section's bento grid into Web / Mobile / Other groups, and add two new subtle accordion sections (Certificates, Work Experience) after Work.

**Architecture:** Static HTML/CSS regrouping of existing card markup (no new components), plus one small generic accordion handler added to the existing single `script.js` file. No build step, no framework, no test runner — this is a plain HTML/CSS/JS site.

**Tech Stack:** Vanilla HTML, CSS, JavaScript (ES2017+, no bundler). Existing files: `index.html`, `style.css`, `script.js`.

## Global Constraints

- No automated test framework exists in this repo (no `package.json`, no test runner). "Testing" for every task below means: open `index.html` in a browser and manually verify the described behavior. Use `start index.html` (Windows) to open it in the default browser.
- Follow the existing CSS custom-property system in `style.css` (`--text-dim`, `--border-subtle`, `--ease-out`, `--font-mono`, etc.) — do not hardcode new colors/fonts.
- Respect `prefers-reduced-motion` for any new animation, matching the existing pattern in `script.js` (the file already declares `const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');` near the top — reuse that constant, don't redeclare it).
- Do not touch the `#process` section or its dangling nav link — that's pre-existing, uncommitted, unrelated work already in the working tree. Leave it exactly as-is.
- Do not modify any of the 6 existing project cards' text content, tags, or tech chips — only their grid-size class and grouping.

---

### Task 1: Restructure Work section into Web / Mobile / Other groups

**Files:**
- Modify: `index.html:103-251` (the `.bento` grid inside `#work`)
- Modify: `style.css` (add new rules near the end of the `BENTO GRID` block, after line 696)

**Interfaces:**
- Produces: CSS classes `.work-group`, `.work-group-label` (labeled group wrapper), `.card--solo` (modifier added alongside `.card--wide` for cards that are the only item in their row).
- Consumes: nothing from other tasks.

- [ ] **Step 1: Replace the single `.bento` grid with three grouped grids**

In `index.html`, replace the block from `<div class="bento">` (line 103) through `</div><!-- /bento -->` (line 251) with:

```html
      <div class="work-group">
        <p class="eyebrow-label work-group-label">Web</p>
        <div class="bento">

          <!-- Design Portal — large -->
          <article class="card card--large reveal" data-delay="0">
            <div class="card-shell">
              <div class="card-core">
                <div class="card-top">
                  <div class="card-tags">
                    <span class="tag">Product</span>
                    <span class="tag">Web</span>
                    <span class="tag">Brand</span>
                  </div>
                  <a href="#" class="card-link">Case study ↗</a>
                </div>
                <div class="card-body">
                  <h3>Design Portal</h3>
                  <p>Content-to-commerce platform for interior design and physical art. Market research, revenue model, full-stack build — solo.</p>
                </div>
                <div class="card-tech">
                  <span>React</span>
                  <span>Supabase</span>
                  <span>PostgreSQL</span>
                  <span>Revenue Strategy</span>
                  <span>Product Design</span>
                </div>
              </div>
            </div>
          </article>

          <!-- Business Finder -->
          <article class="card card--medium reveal" data-delay="80">
            <div class="card-shell">
              <div class="card-core">
                <div class="card-top">
                  <div class="card-tags">
                    <span class="tag">Web</span>
                    <span class="tag">Marketing</span>
                  </div>
                  <a href="#" class="card-link">↗</a>
                </div>
                <div class="card-body">
                  <h3>Business Finder</h3>
                  <p>Surfaces local businesses with no web presence, for lead generation. Built on the Maps API.</p>
                </div>
                <div class="card-tech">
                  <span>React</span>
                  <span>Maps API</span>
                  <span>Lead Gen</span>
                </div>
              </div>
            </div>
          </article>

          <!-- CSS Lab — accent card -->
          <article class="card card--wide card--solo reveal" data-delay="0">
            <div class="card-shell card-shell--accent">
              <div class="card-core card-core--accent">
                <div class="card-top">
                  <div class="card-tags">
                    <span class="tag tag--accent">Design</span>
                    <span class="tag tag--accent">Craft</span>
                  </div>
                  <a href="#" class="card-link card-link--accent">↗</a>
                </div>
                <div class="card-body">
                  <h3>CSS Lab</h3>
                  <p>Animation and interaction experiments — what the browser can feel like.</p>
                </div>
                <div class="card-tech card-tech--accent">
                  <span>CSS</span>
                  <span>Animation</span>
                  <span>Motion</span>
                </div>
              </div>
            </div>
          </article>

        </div>
      </div>

      <div class="work-group">
        <p class="eyebrow-label work-group-label">Mobile</p>
        <div class="bento">

          <!-- Screen Time App -->
          <article class="card card--wide card--solo reveal" data-delay="0">
            <div class="card-shell">
              <div class="card-core">
                <div class="card-top">
                  <div class="card-tags">
                    <span class="tag">Mobile</span>
                    <span class="tag">UX Design</span>
                  </div>
                  <a href="#" class="card-link">View ↗</a>
                </div>
                <div class="card-body">
                  <h3>Screen Time App</h3>
                  <p>Makes screen limits feel like a game. Original pixel art character system, built from scratch.</p>
                </div>
                <div class="card-tech">
                  <span>Mobile</span>
                  <span>Pixel Art</span>
                  <span>UX</span>
                </div>
              </div>
            </div>
          </article>

        </div>
      </div>

      <div class="work-group">
        <p class="eyebrow-label work-group-label">Other</p>
        <div class="bento">

          <!-- VPN -->
          <article class="card card--wide card--solo reveal" data-delay="0">
            <div class="card-shell">
              <div class="card-core">
                <div class="card-top">
                  <div class="card-tags">
                    <span class="tag">Systems</span>
                  </div>
                  <a href="#" class="card-link">↗</a>
                </div>
                <div class="card-body">
                  <h3>Custom VPN</h3>
                  <p>Built from scratch in Go — Windows client, Linux server, TUN interfaces.</p>
                </div>
                <div class="card-tech">
                  <span>Go</span>
                  <span>Linux</span>
                  <span>Networking</span>
                </div>
              </div>
            </div>
          </article>

          <!-- Workshop Café — wide -->
          <article class="card card--wide reveal" data-delay="80">
            <div class="card-shell">
              <div class="card-core card-core--horizontal">
                <div class="card-wide-left">
                  <div class="card-tags">
                    <span class="tag">Marketing</span>
                    <span class="tag">Automation</span>
                  </div>
                  <h3>Workshop Café<br>Email System</h3>
                  <p>Email automation for a real client — announcement flows, signup triggers, segmented lists.</p>
                </div>
                <div class="card-wide-right">
                  <div class="card-tech">
                    <span>Email Automation</span>
                    <span>Segmentation</span>
                    <span>Marketing Systems</span>
                  </div>
                  <a href="#" class="card-link">Case study ↗</a>
                </div>
              </div>
            </div>
          </article>

        </div>
      </div><!-- /work groups -->
```

Note: `data-delay` values were reset per group (0/80) rather than kept globally sequential, since each group's cards now reveal as their own row.

- [ ] **Step 2: Add CSS for `.work-group`, `.work-group-label`, and `.card--solo`**

In `style.css`, immediately after the existing bento min-height rules (after line 696, right before the `PROCESS` section comment block), add:

```css
/* Work groups (Web / Mobile / Other) */
.work-group + .work-group { margin-top: 64px; }

.work-group-label { margin-bottom: 20px; }

/* A wide card that is the sole item in its row (no horizontal split layout) */
.card--wide.card--solo { min-height: 240px; }
```

- [ ] **Step 3: Manually verify in browser**

Run: `start index.html`

Expected:
- Work section shows three labeled groups in order: "Web", "Mobile", "Other".
- Web group: Design Portal + Business Finder share the first row edge-to-edge (no gap), CSS Lab fills the row below alone.
- Mobile group: Screen Time App fills its row alone, no leftover empty space beside it.
- Other group: Custom VPN (full width) then Workshop Café (full width) stack with no gaps.
- Resize the browser to ~700px wide and ~1000px wide (or use devtools responsive mode) — cards still stack/reflow cleanly, no overlapping or overflow.

- [ ] **Step 4: Commit**

```bash
git add index.html style.css
git commit -m "Group work projects into Web / Mobile / Other sections"
```

---

### Task 2: Add Certificates and Work Experience sections (markup + styling)

**Files:**
- Modify: `index.html` (insert two new `<section>` elements after the Work section closes, before the `Stack` section)
- Modify: `style.css` (add new `ACCORDION SECTIONS` block after the `PROCESS` block, i.e. after line 761, before the `STACK` comment block)

**Interfaces:**
- Produces: markup with `.accordion-header[aria-controls]` / `.accordion-panel#<id>` pairs, and CSS classes `.section--subtle`, `.accordion-header`, `.accordion-toggle`, `.accordion-panel`, `.accordion-list`, plus the `.is-open` state class. Task 3's JS consumes these exact class/id names.
- Consumes: nothing from Task 1.

- [ ] **Step 1: Insert the two new sections in `index.html`**

Find the closing `</section>` that ends the Work section (immediately after the `<!-- /work groups -->` closing `</div>` added in Task 1), and insert this markup directly after it (before the `<!-- Stack -->` comment):

```html
  <!-- Certificates -->
  <section class="section section--subtle" id="certificates">
    <div class="container">
      <button class="accordion-header" aria-expanded="false" aria-controls="certificates-panel">
        <span class="eyebrow-label">Certificates</span>
        <span class="accordion-toggle" aria-hidden="true">+</span>
      </button>
      <div class="accordion-panel" id="certificates-panel">
        <ul class="accordion-list">
          <li>Claude</li>
          <li>C#</li>
        </ul>
      </div>
    </div>
  </section>

  <!-- Work Experience -->
  <section class="section section--subtle" id="experience">
    <div class="container">
      <button class="accordion-header" aria-expanded="false" aria-controls="experience-panel">
        <span class="eyebrow-label">Work Experience</span>
        <span class="accordion-toggle" aria-hidden="true">+</span>
      </button>
      <div class="accordion-panel" id="experience-panel">
        <ul class="accordion-list">
          <li>Zara — Employee</li>
          <li>McDonald's — Employee</li>
        </ul>
      </div>
    </div>
  </section>
```

- [ ] **Step 2: Add accordion CSS**

In `style.css`, after the `PROCESS` block (after line 761, before the `/* STACK */` comment), add:

```css
/* ============================================================
   ACCORDION SECTIONS (Certificates / Work Experience)
   ============================================================ */
.section--subtle { padding: 32px 0; }

.accordion-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  background: none;
  border: none;
  border-top: 1px solid var(--border-subtle);
  padding: 20px 0;
  cursor: pointer;
  text-align: left;
  font-family: inherit;
}

.accordion-header:hover .eyebrow-label { color: var(--text); }

.accordion-toggle {
  font-family: var(--font-mono);
  font-size: 14px;
  color: var(--text-dim);
  transition: transform 0.3s var(--ease-out);
}

.accordion-header.is-open .accordion-toggle { transform: rotate(45deg); }

.accordion-panel {
  max-height: 0;
  overflow: hidden;
  transition: max-height 0.35s var(--ease-out);
}

.accordion-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
  padding: 4px 0 20px;
}

.accordion-list li {
  font-size: 14px;
  font-weight: 300;
  color: var(--text-dim);
}
```

- [ ] **Step 3: Manually verify in browser**

Run: `start index.html`

Expected:
- Two new rows appear after the Work section, before Stack: "Certificates" and "Work Experience", each just a thin bordered header row with a "+" on the right — no big card visuals, clearly quieter than the Work bento cards.
- Clicking a header does nothing yet (JS not added until Task 3) — that's expected at this point.

- [ ] **Step 4: Commit**

```bash
git add index.html style.css
git commit -m "Add Certificates and Work Experience accordion sections"
```

---

### Task 3: Add accordion open/close behavior

**Files:**
- Modify: `script.js` (append a new section at the end of the file, after the existing `HERO SPLASH REVEAL` block / `initHeroSplash();` call at line 242)

**Interfaces:**
- Consumes: `.accordion-header`, `.accordion-panel`, `aria-controls` attribute, `.is-open` class (all produced by Task 2). Also consumes the existing top-level `prefersReducedMotion` `MediaQueryList` constant already declared earlier in `script.js` (around line 136) — do not redeclare it.
- Produces: nothing consumed by later tasks.

- [ ] **Step 1: Append the accordion handler to `script.js`**

At the end of `script.js` (after `initHeroSplash();`), add:

```js

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
```

- [ ] **Step 2: Manually verify in browser**

Run: `start index.html`

Expected:
- Clicking "Certificates" expands it smoothly to reveal "Claude" and "C#", and rotates the "+" into an "×". Clicking again collapses it smoothly.
- Clicking "Work Experience" independently expands/collapses without affecting the Certificates panel's open state.
- Open devtools → toggle "Emulate CSS prefers-reduced-motion: reduce" → reload → click a header → panel should snap open/closed instantly with no animation.
- Tab to a header with the keyboard and press Enter/Space — it should toggle open (native `<button>` behavior), and `aria-expanded` should reflect the state (check via devtools Elements panel).

- [ ] **Step 3: Commit**

```bash
git add script.js
git commit -m "Add accordion toggle behavior for Certificates and Work Experience"
```

---

### Task 4: Add nav links for the new sections

**Files:**
- Modify: `index.html:24-26` (desktop `.nav-links`)
- Modify: `index.html:42-45` (mobile `.menu-inner`)

**Interfaces:**
- Consumes: `#certificates` and `#experience` section IDs produced by Task 2. Relies on the existing smooth-scroll anchor handler already in `script.js` (`a[href^="#"]` click handler) — no JS changes needed here.
- Produces: nothing consumed by later tasks.

- [ ] **Step 1: Update the desktop nav pill**

In `index.html`, find:

```html
      <div class="nav-links">
        <a href="#work">Work</a>
        <a href="#process">Process</a>
        <a href="#about">About</a>
      </div>
```

Replace with:

```html
      <div class="nav-links">
        <a href="#work">Work</a>
        <a href="#certificates">Certificates</a>
        <a href="#experience">Work Experience</a>
        <a href="#process">Process</a>
        <a href="#about">About</a>
      </div>
```

- [ ] **Step 2: Update the mobile menu overlay**

In `index.html`, find:

```html
      <a href="#work" class="menu-link" onclick="closeMenu()">Work</a>
      <a href="#process" class="menu-link" onclick="closeMenu()">Process</a>
      <a href="#about" class="menu-link" onclick="closeMenu()">About</a>
      <a href="#contact" class="menu-link menu-link--accent" onclick="closeMenu()">Let's build →</a>
```

Replace with:

```html
      <a href="#work" class="menu-link" onclick="closeMenu()">Work</a>
      <a href="#certificates" class="menu-link" onclick="closeMenu()">Certificates</a>
      <a href="#experience" class="menu-link" onclick="closeMenu()">Work Experience</a>
      <a href="#process" class="menu-link" onclick="closeMenu()">Process</a>
      <a href="#about" class="menu-link" onclick="closeMenu()">About</a>
      <a href="#contact" class="menu-link menu-link--accent" onclick="closeMenu()">Let's build →</a>
```

- [ ] **Step 3: Manually verify in browser**

Run: `start index.html`

Expected:
- Desktop: nav pill shows Work, Certificates, Work Experience, Process, About in order; clicking "Certificates" or "Work Experience" smooth-scrolls to the correct section.
- Shrink the window below 768px (or devtools responsive mode) to trigger the hamburger menu; open it and confirm "Certificates" and "Work Experience" appear in the mobile menu list in the same order, and tapping each scrolls to the right section and closes the menu.

- [ ] **Step 4: Commit**

```bash
git add index.html
git commit -m "Add Certificates and Work Experience links to nav"
```
