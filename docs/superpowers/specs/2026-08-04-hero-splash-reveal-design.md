# Hero splash-reveal design

## Goal

The hero section currently shows one full-bleed background video, `assets/lily.mp4`, behind the headline. Add a second video, `assets/lilyOverlay.mp4`, underneath it that becomes visible through an organic, feathered "splash" shape that follows the cursor when hovering the hero — inspired by the mouse-mask-reveal pattern at https://framer.university/resources/crazy-hover-mask-reveal-in-framer.

## Scope

Applies to the whole hero section (the existing full-bleed `lily.mp4` background), not a smaller sub-panel. Desktop/hover-capable devices only.

## Architecture

**HTML** (`index.html`, inside `.hero`)
- A second `<video>` element, `lilyOverlay.mp4`, positioned identically to the existing `.hero-video` (`position: absolute; inset: 0; object-fit: cover`), stacked directly above it in DOM order (`z-index` between the base video and `.hero-video-overlay`, so the dark gradient scrim still applies on top of both and text legibility is unaffected).
- An inline `<svg>` (`width: 0; height: 0`, visually hidden, `aria-hidden="true"`) containing:
  - `<defs>` with a `<filter>` chain: `feTurbulence` (generates noise) → `feDisplacementMap` (uses the noise to warp a circle's edge into an irregular splash) → `feGaussianBlur` (feathers the warped edge).
  - A `<mask>` containing a `<circle>` with that filter applied. The circle's `r` starts at `0`.

**CSS** (`style.css`)
- New class for the overlay video (e.g. `.hero-video--reveal`): same positioning as `.hero-video`, plus `mask: url(#hero-splash-mask)` / `-webkit-mask: url(#hero-splash-mask)` referencing the SVG mask.
- `r` (and the turbulence attributes driving the idle animation) transition with CSS/SMIL easing so the splash grows/shrinks smoothly rather than snapping.

**JS** (`script.js`)
- Reuse the existing eased-follow (lerp) pattern already driving the custom cursor ring (`ringX/ringY` lag toward `mouseX/mouseY`).
- A new `requestAnimationFrame` loop updates the SVG mask circle's `cx`/`cy` to the eased cursor position, expressed relative to the hero section's bounding rect (so it lines up correctly regardless of scroll position or hero height).
- On `mouseenter` of `.hero`, ease the circle's `r` from `0` up to the full splash radius; on `mouseleave`, ease it back to `0`.
- A slow, continuous, low-amplitude animation of the turbulence filter's `baseFrequency`/`seed` runs independently of cursor position, so the splash edge subtly "breathes" even when the cursor is still.

## Fallbacks

- **Touch / no-hover devices**: gate on the same `matchMedia('(hover: none)')` check already used to skip the custom cursor (`script.js:12`). When it matches, skip attaching the new mousemove/rAF tracking and `mouseenter`/`mouseleave` handlers entirely — the mask circle stays at `r: 0`, so touch users see only the plain `lily.mp4` background with no partial/broken effect.
- **`prefers-reduced-motion: reduce`**: keep the hover-follow and enter/leave transitions (user-initiated, consistent with how every other hover effect on this site is treated — none are currently gated on reduced motion). Skip only the continuous idle turbulence "breathing" animation, since that's ambient motion with no interaction behind it.

## Tuning defaults (adjustable after a visual pass)

- Splash diameter: ~360px.
- Feather (blur radius) large enough that the edge reads as a soft gradient, not a visible ring.
- Turbulence displacement scale tuned so the splash reads as an irregular blob, not a slightly-wobbly circle.

## Performance

`lilyOverlay.mp4` autoplays continuously in the background regardless of mask state, same cost profile as any other hidden autoplaying video already in the page (no play/pause management needed).

## Testing

No test framework in this static site — verification is manual, in-browser:
- Mask follows the cursor smoothly across the full hero area.
- Enter/leave reads as a smooth dissolve, not a hard pop.
- Splash shape looks like an organic, feathered blob — not a plain hard-edged circle.
- Headline/body text stays legible over both video layers.
- Touch/mobile viewport (or `hover: none` emulation) shows only the plain `lily.mp4`, no stray mask artifacts.
- `prefers-reduced-motion` emulation: idle breathing stops, hover-follow still works.
