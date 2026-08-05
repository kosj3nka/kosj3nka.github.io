# Work categorization + Certificates + Work Experience — Design

## Goal

Make the portfolio feel more personal by:
1. Splitting the single "Work" bento grid into three labeled groups: **Web**, **Mobile**, **Other**.
2. Adding two new, visually subtle sections after Work: **Certificates** and **Work Experience**, each a click-to-expand accordion row (collapsed by default).

## 1. Work section restructure

Keep the existing `.bento` card markup/CSS (`card--large`, `card--medium`, `card--small`, `card--wide`, accent variant) untouched — no visual redesign of individual cards. Split the current single `.bento` grid into three stacked groups, each with its own sub-heading, under the existing `#work` section heading.

Grouping of existing 6 project cards (by current tags):

| Group | Projects |
|---|---|
| Web | Design Portal, Business Finder, CSS Lab |
| Mobile | Screen Time App |
| Other | Custom VPN, Workshop Café Email System |

Markup shape per group:

```html
<div class="work-group">
  <p class="work-group-label">Web</p>
  <div class="bento">
    <!-- cards for this group -->
  </div>
</div>
```

Each group's `.bento` only contains its own cards, so the existing size classes (`card--large`, `card--wide`, etc.) may need minor reassignment per group so each group's grid still looks balanced (e.g. Mobile has only one card, so it becomes a single large/wide card rather than leaving empty grid space). No new JS filtering logic — this is a static markup regrouping.

`work-group-label` is a small eyebrow-style label (reuses existing `eyebrow-label` styling or a variant of it) sitting above each group's grid.

## 2. Certificates & Work Experience sections

Two new `<section>`s added after `#work` (before `#stack`), each styled deliberately quieter than the Work bento cards — smaller type, flat list rows, no card shadows/borders — so they read as secondary/supporting content, not competing with the main portfolio grid.

Both are **accordions**: collapsed by default, showing only the section title + a small toggle indicator (`+` / `–`, similar to `.hamburger` styling already in place). Clicking the header expands to reveal the list, animated via a CSS `max-height` transition (matching the deliberate, physical feel of the existing reveal/hero interactions in `script.js`), and collapses again on a second click. Both accordions are independent (opening one doesn't close the other).

### Certificates content
- Claude
- C#

### Work Experience content
- Zara — Employee
- McDonald's — Employee

Rendered as simple rows (e.g. `<ul class="accordion-list">` with `<li>` per entry). No dates/descriptions since none were provided — plain name/role only, easy to extend later.

### Markup shape (repeated for both sections)

```html
<section class="section section--subtle" id="certificates">
  <div class="container">
    <button class="accordion-header" aria-expanded="false" aria-controls="certificates-panel">
      <span class="eyebrow-label">Certificates</span>
      <span class="accordion-toggle">+</span>
    </button>
    <div class="accordion-panel" id="certificates-panel">
      <ul class="accordion-list">
        <li>Claude</li>
        <li>C#</li>
      </ul>
    </div>
  </div>
</section>
```

Same shape for `#experience` / "Work Experience" with the Zara / McDonald's rows.

### Behavior (script.js)

A small generic accordion handler: query all `.accordion-header` elements, toggle an `is-open` class on click, toggle `aria-expanded`, and set the panel's `max-height` to `scrollHeight` (open) or `0` (closed) for the animated reveal. No external library.

## 3. Nav updates

Add to both the desktop nav pill (`.nav-links`) and mobile menu (`.menu-overlay .menu-inner`):
- `<a href="#certificates">Certificates</a>`
- `<a href="#experience">Work Experience</a>`

Placed after the existing `Work` link, before `About` (nav order becomes: Work, Certificates, Work Experience, About). Note: the current uncommitted diff removed the `#process` section but left a dangling `Process` nav link — out of scope for this change, not touched here.

## Out of scope
- No new project content beyond the existing 6 cards (just regrouped).
- No dates/descriptions added to Certificates or Work Experience beyond what was provided.
- No filter/tab interaction for Web/Mobile/Other — purely a static stacked layout per user's choice.
- Not fixing the pre-existing dangling `#process` nav link (unrelated in-progress work already in the working tree).

## Testing
- Manual browser check: each work group renders with a sensible grid (no awkward empty space, especially the single-card Mobile group).
- Manual check: both accordions expand/collapse independently, animate smoothly, and are keyboard-operable (button element, `aria-expanded`).
- Manual check: nav links (desktop pill + mobile menu) scroll to the correct sections.
- Reduced-motion: accordion open/close should respect `prefers-reduced-motion` similar to existing hero-splash gating in script.js (snap instead of animate).
