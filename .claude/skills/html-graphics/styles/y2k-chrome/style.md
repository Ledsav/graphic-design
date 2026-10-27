---
id: y2k-chrome
name: Y2K chrome
family: digital
mood: [glossy, futurist, playful, weightless, synthetic]
fits: [club nights and New Year's parties, pop and trance releases, fashion and beauty drops, tech and gaming launches, Y2K revival merch]
avoid: [heritage and craft brands, finance and legal, anything solemn, eco and organic products, uncoated print]
formats: [social post, story, poster, album cover, banner]
palette: { space: "#0a0f2c", indigo: "#25307a", ice: "#f5f8ff", silver: "#c9d3e0", baby-blue: "#9fd4ff", lilac: "#b9a5ff", hot-pink: "#ff4fc8", lime: "#c8ff3c" }
fonts: { display: "Zen Dots 400 (chrome lettering)", text: "Silkscreen 400/700" }
---

# Y2K chrome

Turn-of-the-millennium futurism: the look of 1998–2004 CD inlays, club flyers, mobile phone ads and media-player skins. Liquid chrome type with a hard horizon reflection, holographic film, inflated bubbles, four-point sparkles, orbit rings, wireframe grids and pixel-font UI fragments, floating on deep space navy. It works because it is sincere about the future: everything is shiny, weightless and slightly toy-like, and the chrome title is an object in the scene, not a label on it.

## Palette

| Role | Hex | Use |
|---|---|---|
| space | `#0a0f2c` | Background; also the outline copy behind chrome and type on light panels |
| indigo | `#25307a` | Radial glow in the background only (1.6:1 on space; never for type) |
| ice | `#f5f8ff` | Main small type and dates on space (17.7:1) |
| silver | `#c9d3e0` | Chrome mid-tones, secondary type (12.4:1) |
| baby-blue | `#9fd4ff` | Chrome sky, rules, wireframes, tertiary type (11.9:1) |
| lilac | `#b9a5ff` | Glows behind chrome and sparkles, ring gradients (8.8:1) |
| hot-pink | `#ff4fc8` | One call to action (the pill button), one rim of the holo film |
| lime | `#c8ff3c` | One or two tiny marks: a progress bar, an arrow |

Rules: the poster is silver and blue; lilac is the light; hot pink and lime are accents used once or twice each. Background: `radial-gradient(70% 55% at 60% 42%, #25307a, #0a0f2c 72%)` with a second lilac glow behind the hero (`rgb(185 165 255 / .38)`). Alternative ground: pale `#eef3fa` (iMac-white variant): drop the lilac glows, the navy outline copy then carries the chrome. No black, no warm colours, no flat mid-grey.

## Typography

- Display: Zen Dots 400 drawn with `lettering.cjs` and filled with chrome. Its barred O reads as a digital zero. Alternatives with fat enough strokes for chrome: Unbounded 900, Russo One, Audiowide. Orbitron only at 900 and above 200 px. Michroma and Rubik Glitch crash `lettering.cjs` (opentype.js can't read their substitution tables): use them only as HTML text.
- Chrome needs mass: cap height at least 120 px on a 1080 artboard. Giant letters (450 px and up) use the `.xl` variant with two horizons. Below 120 px, set Zen Dots as HTML text in ice with `text-shadow: 0 0 18px rgb(185 165 255 / .9)` (dates at 40–64 px).
- Text: Silkscreen 400/700 at 16, 24 or 32 px only (multiples of 8 keep the pixels square), `letter-spacing: .02em`. VT323 at 28–40 px for terminal readouts. Two families per piece: Zen Dots plus one pixel face.
- Chrome lettering is two SVGs with identical flags, so their viewBoxes match: a mask copy (white face, transparent stroke) and an outline copy (navy face and stroke) placed in the same box behind it.

```bash
L=.claude/skills/html-graphics/scripts/lettering.cjs
node $L "ZERO" -o assets/zero-mask.svg --google "Zen Dots" --width 620 --jitter .35 --seed 5 --stroke transparent --stroke-width 14 --fill '#fff'
node $L "ZERO" -o assets/zero-line.svg --google "Zen Dots" --width 620 --jitter .35 --seed 5 --stroke '#0a0f2c' --stroke-width 14 --fill '#0a0f2c'
# one giant letter (stroke 22 for 1000 px and up)
node $L "G" -o assets/g-mask.svg --google "Zen Dots" --width 1300 --stroke transparent --stroke-width 22 --fill '#fff'
node $L "G" -o assets/g-line.svg --google "Zen Dots" --width 1300 --stroke '#0a0f2c' --stroke-width 22 --fill '#0a0f2c'
```

- Shapes that suit it: `--jitter .3–.5` (floating letters), `--warp bulge --amount .2–.3` (inflated), `--warp rise --amount .25–.35` (take-off). Never drips, roughness or distress: chrome is factory-new.

## Imagery

- One hero object that belongs to the future-past: a CD, a flip phone, a helmet, a robot toy, a butterfly, a chrome blob. The example's CD is drawn entirely in CSS (`.y2k-disc`): tilted with `perspective(1600px) rotateZ(-24deg) rotateX(48deg)`, it reads as an object floating in space.
- A cut-out photo works too (the user's own, or a licensed object; not a recognisable real person). Treat it cool, then put holographic film on it:
  `treat.py duotone subject-cut.png -o assets/subject-holo.png --colors '#0a0f2c,#4a3cc4,#9fd4ff,#f5f8ff' --levels .04,.96` (alpha is kept), then a `.y2k-holo-sheen` div in the same box, masked by the same PNG (conic pastel rainbow, `mix-blend-mode: color`, opacity .38).
- Space backdrop or window fill: `treat.py duotone hubble_deep_field.jpg -o assets/space-holo.png --colors '#0b1033,#5a3fc0,#ff8ad8,#bff6ff' --levels .02,.7`, inside a pill or blob shape with a baby-blue and navy double keyline (`box-shadow: 0 0 0 10px #cfe3ff, 0 0 0 18px #0a0f2c`).
- Drawn objects (CSS/SVG, no photos needed): inflated bubbles, four-point sparkles, orbit rings, a perspective wireframe floor, chrome blobs (any SVG blob path works as the chrome mask).
- Hide the cut-out's cropped edges: behind a stroke of the chrome letter, under a UI window, or off the canvas. Never let a straight crop edge float in space.

## Texture

Glossy and digital: almost none. `--grain: .14` with `overlay`, only to stop the gradients banding. Star dust: two offset dot screens (`radial-gradient(circle, #fff 0 1.2px, transparent 1.6px) 0 0 / 97px 89px` and a baby-blue one at 151 × 137 px) at opacity .55. Optional CRT variant: scanlines `repeating-linear-gradient(0deg, rgb(0 0 0 / .18) 0 1px, transparent 1px 4px)` at .5. No paper, dust, folds, halftone or grunge.

## Composition

- Archetypes: **orbit** (rings round the hero, back half behind it, front half in front; the example), **giant crop** (one chrome letter or numeral bleeding off two edges, the subject in its counter), **depth sandwich**, **diagonal float** (subject and letters tilted −5° to −30°, weightless). Not the centred logo on a gradient: the chrome must interact with something.
- A front copy of a giant letter must be clipped along the letter's own edges. A straight clip across a stroke or across the subject shows as a flat panel with a hard edge.
- 1080 artboard, `--safe: 56px`. The info lives in UI objects: a retro OS window (title bar, progress bar, list), a glossy pill button, a corner date block. Rotate them −3° at most; they float over the scene, not on a grid.
- Interlocking with one glyph: duplicate the chrome block and clip the front copy to a region whose edges are the letter's own edges (the bar of a G, the bowl of a B), in whole pixels: `clip-path: polygon(608px 510px, 100% 510px, 100% 100%, 608px 100%)`.
- Layer order (z low to high): navy + radial glows, star dust, wireframe floor, giant chrome if any (back copy), orbit back half, hero object or subject + holo sheen, chrome front copy, orbit front half, chrome title, bubbles and sparkles, info windows and pill, grain.

## Signature moves

1. Liquid chrome lettering: sky-to-horizon-to-ground gradient through the letter mask, specular bevel, hard highlight streaks, holo film in `soft-light`, navy outline copy with a lilac glow behind.
2. Holographic film (a pastel conic rainbow) over silver and over the cut-out, never as a flat background.
3. Weightlessness: a rotated subject, jittered letters, 2–4 inflated bubbles, 3–5 four-point sparkles placed on highlights (a glint on a helmet, an edge of the chrome).
4. Retro UI as the information layer: a `lineup.txt` window, a progress bar in lime, a hot-pink Aqua pill for the call to action, pixel type.
5. An orbit ring that passes behind and in front of the subject.

## Don't

- Fake chrome with a two-stop gradient on HTML text: without the horizon band, bevel and outline it reads as a 2010 web button.
- Put chrome on thin strokes or under 120 px cap height; the bands turn to mud.
- Rainbow everything. Holo is a film over silver; pink and lime are accents.
- Clip a front copy straight across a solid stroke (a visible cut line) or at a fractional pixel (a dark hairline from the outline copy).
- Use emoji sparkles, stock lens flares, black drop shadows, grunge or paper textures, or an acid smiley (that's rave).

## Check before delivering

- At thumbnail size the chrome still reads as metal: every big letter shows a dark horizon band.
- Mask and outline copies line up exactly (same flags, same box, same `aspect-ratio`); no double edges, no hairline at clip lines.
- Counts: sparkles ≤ 5, bubbles ≤ 4, pink and lime ≤ 2 uses each.
- Pixel text only at 16/24/32 px; type on navy is ice, silver, baby blue or lilac (all ≥ 8.8:1).
- The cut-out's cropped edges are hidden or natural.

## Build

Link `../_base.css` and `tokens.css`, then paste the `#y2k-bevel` and `#y2k-bevel-xl` filters from `example.html` after `<body>` (Chrome won't load filters from another file; blur ~ stroke thickness / 3 for normal titles, / 10 for giant letters). Chrome markup: `<div class="y2k-chrome-type [xl]" style="--m: url(assets/t-mask.svg); aspect-ratio: W / H"><img src="assets/t-line.svg" alt="…"><div class="y2k-bevel"><div class="y2k-chrome"></div></div></div>`; set `--m` in the page's own CSS (it resolves relative to the page). Helpers: `.y2k-chrome-type`, `.y2k-chrome`, `.y2k-bevel`, `.y2k-holo-sheen`, `.y2k-disc` (a holographic CD: `<div class="y2k-disc"><i></i></div>`), `.y2k-pill`, `.y2k-bubble`, `.y2k-sparkle` (path in the comment), `.y2k-pixel`, `.y2k-window`, `.y2k-wireframe`; gradients `--y2k-chrome`, `--y2k-chrome-xl` (move its two horizons into the letter's horizontal strokes), `--y2k-holo`, `--y2k-streaks`.
