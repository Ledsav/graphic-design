---
name: html-graphics
description: Design graphics in HTML and CSS and export them as pixel-exact PNG/JPEG or vector PDF - event and gig posters, flyers, social posts, carousels and stories, ads and banners, thumbnails, link previews, magazine and album covers, invitations, infographics. Covers drawn lettering (warped, dripping, extruded, hand-bounced titles), expressive composition, and print-era looks (halftone, photocopy, riso, duotone, torn paper, cut-out stickers, text behind or around the subject, grain and grunge) as well as clean typographic layouts. Use when the user wants a graphic built with HTML/CSS, or when a static graphic is mostly type, layout, image treatment and texture. Ships a renderer that flags fallback fonts, faux bold/italic, clipped, overflowing, overlapping or tiny text and soft or broken images, plus an image-treatment script.
---

# HTML Graphics

Build each graphic as an HTML file with one fixed-size `.artboard` per output image, render it with headless Chromium, look at the result, and iterate. HTML gives real typography (kerning, variable fonts, `text-wrap: balance`), real layout, live filters, one source for many sizes, and vector PDF. Pre-processing in Python adds what browsers do badly: halftone, photocopy, riso, cut-outs, torn edges, textures.

The bar is a poster a working designer would be proud of: a strong image with a treatment, drawn display type woven into the image, a composition with tension, texture, and confident small type. Fonts set in straight centred lines over a centred image read as a template: `references/type-and-composition.md` is how to get past that, and the style library in `styles/` gives each visual style a spec, CSS tokens and a reference poster.

## Files

| Path | What |
|---|---|
| `scripts/render.cjs` | Renderer and checker (Node + Playwright) |
| `scripts/lettering.cjs` | Drawn titles: glyph outlines warped (arch, bulge, wave, rise, perspective), jittered, dripped, outlined, extruded; per-letter copies for interlocking (Node + opentype.js) |
| `scripts/treat.py` | Image treatments, silhouette contours and textures (Python, Pillow + numpy; rembg optional) |
| `templates/artboard.html` | Starting file: tokens, artboard, guides |
| `templates/filters.html` | SVG filter library: rough, wobble, distress, speckle, ink-bleed, sticker, threshold, duotone, posterize, misregister, neon, torn |
| `references/type-and-composition.md` | Composition archetypes, thumbnail process, expressive type moves, display fonts by mood. **Read for every piece** |
| `styles/` | Style library: one folder per style with `style.md` (spec), `tokens.css`, `example.html` and `preview.jpg`. Catalog in `styles/README.md`, all previews in `styles/catalog.jpg` |
| `references/poster-styles.md` | What every expressive poster shares, and which style suits which brief. **Read for any poster, flyer, cover or event graphic** |
| `references/imagery.md` | Where images come from (licensing), treatments, cut-outs |
| `references/css-techniques.md` | Composition, type, colour, texture, shape and image techniques with snippets |
| `references/formats.md` | Sizes and safe areas for social, ads, covers, print |

Run everything from the repo root, e.g. `node .claude/skills/html-graphics/scripts/render.cjs projects/x/poster.html`.

## Workflow

1. **Brief.** What it is, where it appears, exact size (`references/formats.md`), the real copy, brand assets, how many options. For print, run `print-production` first and build the artboard in mm with bleed.
2. **Image.** Decide where the image comes from before anything else (`references/imagery.md`): the user's assets, AI generation, or public-domain collections. Never invent a photo source or use one without a licence.
3. **Direction.** Pick a style from `styles/README.md` (the brief table in `references/poster-styles.md` helps), read its `style.md` in full and link its `tokens.css`. If the user names or shows a look that isn't in the library, take the closest style and say what you change. Then write a short plan: palette (4–6 hex), display face and how the title will be drawn, the image treatment, and the one bold move. For new work, offer 2–3 directions. Check the plan against the generated-design defaults listed in `frontend-design` and change anything generic.
4. **Prepare assets** with `scripts/treat.py` (image, cut-out, contour, textures) and `scripts/lettering.cjs` (title) into `projects/<project>/assets/`, at the final pixel size (artboard × export scale).
5. **Composition thumbnails.** Before any detail, build 4–6 rough layouts as artboards in one file, each a different archetype from `references/type-and-composition.md`, with only the image and the title. Render with `--sheet`, pick the strongest, and say why. Never go straight to the centred title / image / info stack.
6. **Build.** Copy `templates/artboard.html` to `projects/<project>/<piece>.html`. Paste `templates/filters.html` after `<body>` when you need filters. Follow the build rules below.
7. **Render and look.** `node .claude/skills/html-graphics/scripts/render.cjs projects/<project>/<piece>.html --sheet`. Open the PNG with Read. Fix every WARN, or confirm it's intended and mark it (`data-allow-overlap`, `data-ignore`). Critique against the composition critique in `type-and-composition.md`, the finishing pass in `poster-styles.md` and the checklist in `CLAUDE.md`. Do at least two passes; the first render is never the last.
8. **Export** (table below) and hand off: files, a short rationale, image credits.

## Build rules

- **Artboard:** explicit width and height: whole px for screen, mm for print (trim + 2 × bleed). Never `vw`, `vh` or percentages of the page.
- **Safe margin:** set `--safe` on the artboard (1–4 lengths like `margin`). The renderer warns about text inside it.
- **Layout:** absolute positioning for free composition, CSS grid on the artboard for structure. Layer with z-index, following the stack order in `poster-styles.md`.
- **Fonts:** bundled families from `assets/fonts.css` (registered automatically) or Google Fonts via `<link>` with every weight and the `ital` axis you use. Never rely on fonts installed on the machine.
- **Fit-to-width type:** put measuring code in `window.layout = async () => {...}` and call it on load; the renderer reruns it after fonts load. The snippet is in `css-techniques.md`.
- **Images:** local files in `assets/`, with enough pixels for the export scale (the renderer warns when one is upscaled). Logos and icons as inline SVG, never emoji.
- **Filters:** paste the `templates/filters.html` svg once per file and tune the commented numbers. Chrome won't load filters from another file.
- **Legibility:** text over images needs a scrim, a band or a halo (`paint-order: stroke` on SVG text). The renderer can't measure contrast over images, so look.

## Style references

When the user asks to see a style ("show me Art Deco", "what does riso look like", "send me a reference"), send `styles/<id>/preview.jpg` with SendUserFile; for "what styles do we have", send `styles/catalog.jpg` and list the names from `styles/README.md`. Each example is a working HTML file, so a reference can be re-rendered or adapted.

To add a style (or a client's house style), copy the format of an existing folder, fill every section of `style.md`, build an original `example.html`, and run `python3 .claude/skills/html-graphics/scripts/previews.py <id>` to render its preview and refresh the catalog.

## Renderer

```bash
node .claude/skills/html-graphics/scripts/render.cjs <file.html> [more.html] [options]
```

| Goal | Flags |
|---|---|
| Social post or ad at exact size | (none): `--scale 1` |
| Retina web image or email header | `--scale 2` |
| Compressed photo ad | `--format jpeg --quality 85` |
| Sticker or overlay with transparency | `--transparent` |
| Print raster (then `print-production`) | `--dpi 300` (150 for posters over A2) |
| Vector PDF per artboard (live text, embedded fonts) | `--pdf` |
| One PDF of all artboards (carousel, deck) | `--pdf-pages` |
| Review several artboards at once | `--sheet` |
| Only some artboards | `--only cover,slide-2` |
| Keep guides visible | `--guides` |

Outputs go to `export/` next to the HTML, named `<file>-<data-name>.png`. Checks: fonts not loaded (fallback), faux bold or italic, text outside the artboard, text clipped by a container, text inside the safe margin, overlapping text, text under the minimum size (artboard width / 72), broken or upscaled images, failed requests, script errors. `--strict` exits 1 on warnings.

Text boxes are measured from the glyphs' ink, so tight display leading is fine. SVG text gets font checks only.

Chrome rounds PDF page sizes up to whole points (≤ 0.35 mm). That lands in the bleed for print, but for exact print raster use `--dpi` and `print-production`.

## Lettering

`node .claude/skills/html-graphics/scripts/lettering.cjs --help`. Examples and the effect table are in `references/type-and-composition.md`. Use it for the title of nearly every expressive poster; plain HTML text for the small print.

## Treatments

`python3 .claude/skills/html-graphics/scripts/treat.py <command> --help` for every option.

`halftone`, `photocopy`, `duotone`, `riso`, `cutout`, `outline`, `torn`, `contour`, `texture grain|paper|dust|folds|grunge`. See `references/imagery.md` for the command table and blend modes. `riso` also prints a finished flat two-ink poster: design in two inks with multiply overlaps, render, then run it on the PNG.

## Setup

- Node: `npm install` at the repo root (Playwright and opentype.js from `package.json`), then `npx playwright install chromium`. A globally installed Playwright works too.
- Python: `pip install -r requirements.txt`. For cut-outs, also `pip install rembg onnxruntime` (the model downloads on first use).

## Troubleshooting

- **Font warning:** check the family name against `assets/fonts.css` or Google Fonts, and load every weight and italic you set.
- **Remote font or image fails:** download it into `assets/`. In cloud sessions, the network policy may block the host; tell the user which host to allow.
- **Export differs from the browser preview:** look for viewport units, `@media` rules, or JS that ran before fonts loaded (use `window.layout`).
- **Animations:** disabled at capture. Finite ones jump to their end state; infinite ones reset to the start.
- **Over 16384 px on a side:** lower `--scale` or `--dpi`.
