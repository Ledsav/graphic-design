---
name: html-graphics
description: Design graphics in HTML and CSS and export them as pixel-exact PNG/JPEG or vector PDF - event and gig posters, flyers, social posts, carousels and stories, ads and banners, thumbnails, link previews, magazine and album covers, invitations, infographics. Covers expressive print-era looks (halftone, photocopy, riso, duotone, torn paper, cut-out stickers, text behind the subject, grain and grunge) as well as clean typographic layouts. Use when the user wants a graphic built with HTML/CSS, or when a static graphic is mostly type, layout, image treatment and texture. Ships a renderer that flags fallback fonts, faux bold/italic, clipped, overflowing, overlapping or tiny text and soft or broken images, plus an image-treatment script.
---

# HTML Graphics

Build each graphic as an HTML file with one fixed-size `.artboard` per output image, render it with headless Chromium, look at the result, and iterate. HTML gives real typography (kerning, variable fonts, `text-wrap: balance`), real layout, live filters, one source for many sizes, and vector PDF. Pre-processing in Python adds what browsers do badly: halftone, photocopy, riso, cut-outs, torn edges, textures.

The bar is a poster a working designer would be proud of: a strong image with a treatment, display type with character, texture, depth and confident small type. `references/poster-styles.md` has the recipes; `examples/` has one worked poster per recipe.

## Files

| Path | What |
|---|---|
| `scripts/render.cjs` | Renderer and checker (Node + Playwright) |
| `scripts/treat.py` | Image treatments and textures (Python, Pillow + numpy; rembg optional) |
| `templates/artboard.html` | Starting file: tokens, artboard, guides |
| `templates/filters.html` | SVG filter library: rough, wobble, distress, speckle, ink-bleed, sticker, threshold, duotone, posterize, misregister, neon, torn |
| `references/poster-styles.md` | Style recipes and display fonts by genre. **Read for any poster, flyer, cover or event graphic** |
| `references/imagery.md` | Where images come from (licensing), treatments, cut-outs |
| `references/css-techniques.md` | Composition, type, colour, texture, shape and image techniques with snippets |
| `references/formats.md` | Sizes and safe areas for social, ads, covers, print |
| `examples/` | Five worked posters with previews |

Run everything from the repo root, e.g. `node .claude/skills/html-graphics/scripts/render.cjs projects/x/poster.html`.

## Workflow

1. **Brief.** What it is, where it appears, exact size (`references/formats.md`), the real copy, brand assets, how many options. For print, run `print-production` first and build the artboard in mm with bleed.
2. **Image.** Decide where the image comes from before anything else (`references/imagery.md`): the user's assets, AI generation, or public-domain collections. Never invent a photo source or use one without a licence.
3. **Direction.** Pick a recipe from `references/poster-styles.md` (or a clean typographic direction), then write a short plan: palette (4–6 hex), display face and text face, the image treatment, the layering, and the one bold move. For new work, offer 2–3 directions. Check the plan against the generated-design defaults listed in `frontend-design` and change anything generic.
4. **Prepare assets** with `scripts/treat.py` into `projects/<project>/assets/`, at the final pixel size (artboard × export scale).
5. **Build.** Copy `templates/artboard.html` to `projects/<project>/<piece>.html`. Paste `templates/filters.html` after `<body>` when you need filters. Follow the build rules below.
6. **Render and look.** `node .claude/skills/html-graphics/scripts/render.cjs projects/<project>/<piece>.html --sheet`. Open the PNG with Read. Fix every WARN, or confirm it's intended and mark it (`data-allow-overlap`, `data-ignore`). Critique against the finishing pass in `poster-styles.md` and the checklist in `CLAUDE.md`. Do at least two passes; the first render is never the last.
7. **Export** (table below) and hand off: files, a short rationale, image credits.

## Build rules

- **Artboard:** explicit width and height: whole px for screen, mm for print (trim + 2 × bleed). Never `vw`, `vh` or percentages of the page.
- **Safe margin:** set `--safe` on the artboard (1–4 lengths like `margin`). The renderer warns about text inside it.
- **Layout:** absolute positioning for free composition, CSS grid on the artboard for structure. Layer with z-index, following the stack order in `poster-styles.md`.
- **Fonts:** bundled families from `assets/fonts.css` (registered automatically) or Google Fonts via `<link>` with every weight and the `ital` axis you use. Never rely on fonts installed on the machine.
- **Fit-to-width type:** put measuring code in `window.layout = async () => {...}` and call it on load; the renderer reruns it after fonts load. The snippet is in `css-techniques.md`.
- **Images:** local files in `assets/`, with enough pixels for the export scale (the renderer warns when one is upscaled). Logos and icons as inline SVG, never emoji.
- **Filters:** paste the `templates/filters.html` svg once per file and tune the commented numbers. Chrome won't load filters from another file.
- **Legibility:** text over images needs a scrim, a band or a halo (`paint-order: stroke` on SVG text). The renderer can't measure contrast over images, so look.

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

## Treatments

`python3 .claude/skills/html-graphics/scripts/treat.py <command> --help` for every option.

`halftone`, `photocopy`, `duotone`, `riso`, `cutout`, `outline`, `torn`, `texture grain|paper|dust|folds|grunge`. See `references/imagery.md` for the command table and blend modes. `riso` also prints a finished flat two-ink poster: design in two inks with multiply overlaps, render, then run it on the PNG.

## Setup

- Node and Playwright: `npm install` at the repo root (uses `package.json`), then `npx playwright install chromium`. A globally installed Playwright works too.
- Python: `pip install -r requirements.txt`. For cut-outs, also `pip install rembg onnxruntime` (the model downloads on first use).

## Troubleshooting

- **Font warning:** check the family name against `assets/fonts.css` or Google Fonts, and load every weight and italic you set.
- **Remote font or image fails:** download it into `assets/`. In cloud sessions, the network policy may block the host; tell the user which host to allow.
- **Export differs from the browser preview:** look for viewport units, `@media` rules, or JS that ran before fonts loaded (use `window.layout`).
- **Animations:** disabled at capture. Finite ones jump to their end state; infinite ones reset to the start.
- **Over 16384 px on a side:** lower `--scale` or `--dpi`.
