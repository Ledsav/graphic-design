# Pretty Things Bite: poster series

## Brief

- **Ask:** "nice posters with alternative vibes" from 12 reference images the user supplied.
- **Use:** wall art / screen. No event, so no real date or venue copy; each poster gets its own title and a few lines of copy.
- **Format:** 1200 × 1600 px artboard (3:4, the 18 × 24 in poster ratio), exported at 1.5× = 1800 × 2400 px.
- **Images:** the user's 12 uploads (`assets/src/01–12.jpg`). They look like third-party Pinterest finds, so the series is for personal use only (see `assets/CREDITS.md`).

## The idea

Every image is something beautiful that could hurt you: nails, claws, fangs, knives, spikes, all shiny. The series is called **Pretty Things Bite**. One poster per image, numbered N°01–12, each in a different alternative style. The only shared elements are the series lockup (a fang bar mark, DM Mono caps) and grain.

| N° | Image | Title | Style | Archetype |
|---|---|---|---|---|
| 01 | Blurred scream, long nails | AAAAAH (the scream drawn as type) | Halftone punk, cream on black, red type | Diagonal crescendo out of the mouth |
| 02 | Knife as eyeliner | SHARP (zine cover) | Editorial fashion cover | Cover, masthead sliced along the knife line |
| 03 | Candles, mirror, knife | BLOODY MARY ×3 | Gothic blackletter | Echo, the third line mirrored |
| 04 | Red latex hands, summoning circle | COME HITHER | Lacquer and chrome | Orbit: text on the circle |
| 05 | Glitter blue cat, chrome fangs | HISS | Y2K chrome | Depth sandwich, chrome behind the ears |
| 06 | White face, red devil mask | TWO-FACED | Gothic Didone | Asymmetric split |
| 07 | Spiked, studded leopard | DO NOT PET | Brutalist (electric blue instead of acid) | Stretched word stack eaten by the slab |
| 08 | Crystal claws on blue | Claws out. | Quiet luxury | The photo whole; a white italic set in the dark sky and fur, stepping down the paw's edge |
| 09 | Tiger with diamond grill | ICED OUT | Blackletter streetwear | Giant crop, type in the dark |
| 10 | Spiked disco ball | HARD DISCO | Industrial techno, stencil | Depth sandwich: the ball hangs between the words |
| 11 | Crystal basketball net | NOTHING BUT NET | Street-court signage | NET painted on the wall under the net and its shadow |
| 12 | Mantis with a head | GIRLS WILL BE GIRLS | Natural-history plate | Specimen plate, type as frame |

## Files

- `NN-<title>.html`: one poster per file, sharing `series.css` (artboard, grain, lockup, chrome helper).
- `export/NN-<title>-poster.png`: final 1800 × 2400 PNGs. `export/pretty-things-bite-series.jpg`: contact sheet. `export/pretty-things-bite-overview.jpg` (from `overview.html`): titled overview of all 12.
- `assets/src/`: the user's originals. `assets/cut/`, `assets/cut-bf/`: cut-outs (rembg `isnet-general-use` and `birefnet-general-lite`). `assets/pNN/`: lettering, treatments and textures per poster.
- `tools/pave.py`: generates the pavé stone texture for N°09 (`python3 tools/pave.py assets/p09/pave.png 2220 540 15`).

## Rebuild

```bash
node .claude/skills/html-graphics/scripts/render.cjs projects/pretty-things-bite/[01]*.html --scale 1.5
```

Key treatments:

- N°01: `treat.py halftone assets/cut/01.png --flatten '#000000' --width 1920 --cell 13 --angle 22 --invert --ink '#ff3324' --paper '#0d0909' --levels .07,.78 --gamma 1.15`; scream drawn with `lettering.cjs --google Anton --warp perspective --amount -.85 --jitter .45`.
- N°07: crop `src/07.jpg` to (80, 212, 700, 1920), then `treat.py photocopy --width 870 --levels .12,.62 --grit .7 --specks .8 --ink '#0b0b0b' --paper '#3a3aff'`.
- N°08: title drawn with `lettering.cjs "Claws|out." --google "DM Serif Display" --italic --leading .78 --tracking -10 --width 780`.
- N°11: the front layer is the net cut-out with the wall-shadow polygon removed.
- N°12: the page texture is a mirrored tile of a clean patch of the illustration's own paper, so the plate has no visible edge.

## Known limits

The source images are 615 to 1200 px wide, so every poster upscales its photo 1.5 to 2.9 times. They look right on screen and at A3 and below; for larger prints, get higher-resolution originals.
