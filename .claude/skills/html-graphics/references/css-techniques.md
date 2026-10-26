# CSS techniques for graphics

Snippets for static compositions. They assume a fixed-size `.artboard` with `position: relative; overflow: hidden; isolation: isolate`. Pick what the concept needs; a piece that uses six of these at once usually has no idea.

## Contents
- Composition: absolute placement, grid, overlap, rotation
- Typography: display type, fitting a line to a width, balance, outlined/filled/knockout text, vertical text, text on a path, numerals
- Colour: oklch palettes, color-mix, gradients, mesh gradients
- Texture: grain, halftone, patterns, paper
- Shape: clip-path, masks, blobs, shape-outside
- Imagery: cropping, duotone, scrims, blend modes, frames
- Depth: layered shadows, glass
- Data: bars, donuts, simple charts
- Gotchas

---

## Composition

**Free placement.** Absolute positioning against the artboard, with offsets that come from the grid, not eyeballed numbers.

```css
.artboard { --m: 80px; --col: calc((1080px - 2 * var(--m) - 11 * 24px) / 12); }
.headline { position: absolute; left: var(--m); bottom: 220px; width: calc(8 * var(--col) + 7 * 24px); }
```

**Grid on the artboard.** Structured layouts (editorial, posters with modules). Overlap by placing items in the same cell; `z-index` decides the stack.

```css
.artboard {
  display: grid;
  grid-template: 80px repeat(10, 1fr) 80px / 80px repeat(12, 1fr) 80px;
  column-gap: 24px;
}
.photo    { grid-area: 2 / 6 / 9 / 15; }       /* row-start / col-start / row-end / col-end */
.headline { grid-area: 7 / 2 / 11 / 12; z-index: 1; align-self: end; }
```

**Deliberate tension.** A rotated element reads as intentional only when the angle is decisive (≥ 4° or exactly 90°) and the rest of the layout is calm. Rotate around a named origin: `transform: rotate(-90deg); transform-origin: left bottom;`.

**Text behind the subject.** Put the photo and its cut-out (`treat.py cutout`) in the same box and the title between them in z-order. Any treatment applied to the photo must be applied to the cut-out too.

```css
.photo, .cut { position: absolute; left: -330px; top: 150px; width: 1500px; height: 1500px; }
.photo { background: url(assets/photo.png) center / cover; z-index: 0; }
.title { z-index: 1; }
.cut   { z-index: 2; }   /* <img class="cut" src="assets/photo-cut.png"> */
```

**Halo for text that crosses an image.** SVG text: `stroke="<background colour>" stroke-width="6" stroke-linejoin="round" paint-order="stroke"`. HTML text: `-webkit-text-stroke` paints over the glyph, so use stacked `text-shadow` in the background colour instead.

**Bleeding elements.** Shapes and type that run off the edge add scale; let them run off by a lot (a third of the shape), not by a few pixels, which reads as a mistake. Add `data-ignore` to text that is cropped on purpose so the renderer does not flag it.

## Typography

**Display type.** Tight leading and tracking at large sizes, open tracking for small labels.

```css
.display { font: 700 220px/.86 var(--display); letter-spacing: -0.02em; text-wrap: balance; }
.label   { font: 500 22px/1.2 var(--text); letter-spacing: 0.04em; }
.body    { font: 400 30px/1.4 var(--text); max-width: 26ch; text-wrap: pretty; hyphens: auto; }
```

`text-wrap: balance` evens out headline lines; `pretty` avoids one-word last lines in body text. `hyphens: auto` needs `lang` on `<html>`. Set line breaks by hand with `<br>` when the phrasing matters more than the measure.

**Fit a line to a width.** Use the `window.layout` hook so the renderer reruns it after fonts load.

```html
<h1 class="fit" data-fit>Three sets a night</h1>
<style>.fit { position: absolute; left: 80px; right: 80px; white-space: nowrap; }</style>
<script>
window.layout = async () => {
  for (const el of document.querySelectorAll('[data-fit]')) {
    const cs = getComputedStyle(el);
    await document.fonts.load(`${cs.fontStyle} ${cs.fontWeight} 100px ${cs.fontFamily}`);
    let lo = 4, hi = 1000;
    while (hi - lo > 0.25) {
      const mid = (lo + hi) / 2;
      el.style.fontSize = `${mid}px`;
      if (el.scrollWidth <= el.clientWidth) lo = mid; else hi = mid;
    }
    el.style.fontSize = `${lo}px`;
  }
};
window.addEventListener('load', () => window.layout());
</script>
```

**Outlined, filled and knockout text.**

```css
.outline  { color: transparent; -webkit-text-stroke: 3px var(--ink); }
.filled   { background: url(assets/texture.jpg) center / cover; -webkit-background-clip: text; background-clip: text; color: transparent; }
.gradient { background: linear-gradient(90deg, var(--a), var(--b)); -webkit-background-clip: text; background-clip: text; color: transparent; }
/* Knockout: a white panel with black text, screened over a photo. The panel stays white
   and the letters become windows onto the photo. */
.knockout { background: #fff; color: #000; mix-blend-mode: screen; }
```

`-webkit-text-stroke` is centred on the outline and eats into thin strokes; use it on heavy weights.

**Vertical text.** `writing-mode: vertical-rl;` (reads top to bottom) or rotate a horizontal line with `transform: rotate(-90deg)` for bottom-to-top spines.

**Text on a path.** Inline SVG; size the text so it does not collide at the seam (adjust `font-size`/`letter-spacing`, or set `textLength` on the `<textPath>` to the path length).

```html
<svg viewBox="0 0 500 500" width="500" height="500">
  <path id="ring" d="M250,250 m-200,0 a200,200 0 1,1 400,0 a200,200 0 1,1 -400,0" fill="none"/>
  <text font-family="Instrument Sans" font-size="30" letter-spacing="6" fill="currentColor">
    <textPath href="#ring" textLength="1240">LIVE QUARTET · OPEN JAM · LATE BAR ·</textPath>
  </text>
</svg>
```

**Numerals.** `font-variant-numeric: tabular-nums;` for aligned columns (prices, schedules), `oldstyle-nums` inside serif body text, `lining-nums` for display.

**Hanging punctuation.** Pull opening quotes into the margin so the letters align: `.quote::before { content: "“"; position: absolute; transform: translateX(-100%); }`.

## Colour

Define palettes in `oklch()`: equal lightness steps look equal, and hue shifts keep their saturation.

```css
:root {
  --ink:    oklch(0.22 0.04 260);
  --paper:  oklch(0.96 0.015 85);
  --accent: oklch(0.72 0.17 45);
  --accent-soft: color-mix(in oklch, var(--accent) 35%, var(--paper));
  --accent-deep: color-mix(in oklch, var(--accent) 70%, black);
}
```

**Mesh-like gradients.** Stack radial gradients over a base colour; keep stops soft and the hues close.

```css
background:
  radial-gradient(55% 45% at 20% 15%, oklch(0.62 0.16 255 / .9), transparent 70%),
  radial-gradient(45% 40% at 85% 80%, oklch(0.72 0.16 40 / .8), transparent 70%),
  oklch(0.25 0.06 255);
```

Smooth gradients band in exported PNGs and JPEGs; a grain layer (below) hides it.

**Conic and angular.** `conic-gradient(from 210deg at 70% 40%, …)` for light-sweep effects and colour wheels.

## Texture

**Grain** (fractal noise from an SVG filter, blended over everything):

```css
.artboard::after {
  content: ""; position: absolute; inset: 0; pointer-events: none; z-index: 10;
  background: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='300' height='300'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.85' numOctaves='3' stitchTiles='stitch'/%3E%3CfeColorMatrix values='0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 .55 0'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");
  mix-blend-mode: overlay; opacity: .5;
}
```

Lower `baseFrequency` for coarser grain; raise the last matrix value for stronger grain. For print at 300 dpi, make the tile larger (`width='600' height='600'`) or the grain becomes too fine to see.

**Halftone dots** fading out with a mask:

```css
.halftone {
  background: radial-gradient(circle, var(--accent) 28%, transparent 30%) 0 0 / 22px 22px;
  -webkit-mask: radial-gradient(closest-side, #000, transparent);
          mask: radial-gradient(closest-side, #000, transparent);
}
```

**Patterns.**

```css
.stripes { background: repeating-linear-gradient(45deg, var(--a) 0 14px, var(--b) 14px 28px); }
.dots    { background: radial-gradient(var(--a) 2px, transparent 2.5px) 0 0 / 24px 24px; }
.checks  { background: repeating-conic-gradient(var(--a) 0 25%, var(--b) 0 50%) 0 0 / 40px 40px; }
.lines   { background: repeating-linear-gradient(0deg, var(--a) 0 1px, transparent 1px 12px); }
```

**Paper.** Grain at low opacity with `mix-blend-mode: multiply` over a warm off-white, plus a very soft vignette: `box-shadow: inset 0 0 200px rgb(0 0 0 / .08)`.

## Shape

```css
.slant  { clip-path: polygon(18% 0, 100% 0, 100% 100%, 0 100%); }
.circle { clip-path: circle(42% at 50% 50%); }
.arch   { border-radius: 999px 999px 0 0; }
.blob   { border-radius: 58% 42% 63% 37% / 45% 55% 45% 55%; }
.fade   { -webkit-mask-image: linear-gradient(#000 60%, transparent); mask-image: linear-gradient(#000 60%, transparent); }
```

For logos, icons and complex silhouettes use inline SVG. Text can wrap around a floated shape with `shape-outside: circle(50%)` (the element must be `float`ed).

## Imagery

**Crop with intent.** `object-fit: cover; object-position: 30% 20%;` puts the subject where the composition needs it.

**Duotone.** Greyscale the photo and multiply it over a colour (or screen it over a dark one):

```css
.duo     { background: var(--accent); }
.duo img { width: 100%; height: 100%; object-fit: cover; filter: grayscale(1) contrast(1.25); mix-blend-mode: multiply; }
```

**Scrim for text over photos.** A gradient from the text side, not a flat dark overlay on the whole image:

```css
.photo::after { content: ""; position: absolute; inset: 0; background: linear-gradient(to top, rgb(10 12 20 / .75), transparent 55%); }
```

The renderer cannot measure contrast over images; check it in the export.

**Blend modes.** `multiply` darkens (ink on paper), `screen` lightens (light on dark), `overlay`/`soft-light` add texture, `difference` for graphic inversions. `isolation: isolate` on the artboard keeps blends from leaking into the page.

## Depth

**Layered shadow** (soft, realistic; one flat shadow looks cheap):

```css
box-shadow:
  0 1px 2px rgb(0 0 0 / .08),
  0 4px 8px rgb(0 0 0 / .08),
  0 16px 32px rgb(0 0 0 / .10),
  0 40px 80px rgb(0 0 0 / .12);
```

Use `filter: drop-shadow(…)` for clipped or transparent shapes. **Glass:** `backdrop-filter: blur(24px) saturate(140%); background: rgb(255 255 255 / .12);` needs something visible behind it.

## Data

Simple infographics stay in CSS; anything with axes belongs in inline SVG (and load the `dataviz` skill when available).

```css
.bar   { height: 28px; width: calc(var(--v) * 1%); background: var(--accent); }        /* style="--v: 62" */
.donut { width: 320px; aspect-ratio: 1; border-radius: 50%;
         background: conic-gradient(var(--accent) calc(var(--v) * 1%), var(--track) 0);
         -webkit-mask: radial-gradient(farthest-side, transparent 62%, #000 63%);
                 mask: radial-gradient(farthest-side, transparent 62%, #000 63%); }
```

## Gotchas

- **Units.** Never `vw`, `vh` or percentages of the page. The renderer resizes the viewport.
- **Fonts.** A weight or italic you set but did not load is synthesised (faux bold/italic). The renderer warns; load the face or change the weight.
- **Emoji** render with whatever emoji font the machine has. Use SVG.
- **Filters and blend modes in PDF** are rasterised by Chrome. Fine for screen and digital print; keep live text above them.
- **Animations** are disabled at capture: finite ones jump to their end state, infinite ones reset to the start.
- **Big artboards.** Over 16384 px on a side Chromium may fail. For large posters use `--dpi 150`.
- **Image resolution.** Source images need the artboard size × export scale in pixels; the renderer warns when one is upscaled.
