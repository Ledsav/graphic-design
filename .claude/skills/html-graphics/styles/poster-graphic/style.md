---
id: poster-graphic
name: Poster graphic (Pinterest / Behance)
family: editorial
mood: [cinematic, dense, premium, graphic, deadpan]
fits: [art and event posters, fight nights, club residencies, exhibitions, zine and magazine covers, portfolio pieces]
avoid: [corporate, kids, anything without one strong photo, long copy]
formats: [poster 4:5, cover, social post]
palette: { red: "#a8231b", mustard: "#e2a94b", yellow: "#f4b41a", black: "#0d0b0a", cream: "#f0e6cb", spot-red: "#d52a1e" }
fonts: { display: "drawn per poster (Big Shoulders Display 900, League Spartan 800 + Mr Dafoe, UnifrakturMaguntia, Anton)", text: "Archivo (width axis) / IM Fell English SC" }
---

# Poster graphic

The contemporary "poster graphic" people save on Pinterest and Behance: one dramatic hero photo, two or three inks, a huge title that physically interacts with the subject (behind it, across it, cut by it), and a layer of dense micro-typography (micro-paragraphs, barcodes, counters, label boxes, data tables) that makes the sheet read as a printed object rather than a template. It works because the big gesture is a single, simple idea and the small print rewards a second look.

The family has four sub-looks, one per example. Each takes the visual language of a reference board (red/mustard cinema poster, red loupe-panel portrait, blackletter-on-black still life, black + red newsprint collage), never its layout or words.

| Example | Sub-look | Inks | Title move |
|---|---|---|---|
| `example.html` (boxer, LAST ROUND) | Cinema two-ink | red + mustard | ultra-tall condensed title behind the figure, his hood dropping into the word space |
| `example-statue.html` (HOLD STILL) | Loupe portrait | red + yellow | bold geometric sans + red-outlined script, the face re-shown in thin-framed loupe panels |
| `example-dj.html` (Nocturne) | Blackletter night | black + yellow (+ the photo's red) | ornate blackletter set on the booth like a sign, smoke above it |
| `example-skater.html` (GRAVITY) | Newsprint collage | black + spot red on cream | edge-to-edge condensed headline in the gap between his feet and his board; V replaced by a red arrow |

All four are 1080 x 1350 (4:5), rendered at `--scale 2`.

## Palette

| Role | Hex | Use |
|---|---|---|
| red | `#a8231b` / `#a91f1a` | ground of the cinema and loupe looks; `--red-deep #5c0f0b` for floor and vignette |
| mustard | `#e2a94b` | type on red (cinema) |
| yellow | `#f2ab25` / `#f4b41a` | type on red (loupe) or black (blackletter) |
| black | `#0d0b0a` / `#141210` | ground (blackletter) or ink (newsprint) |
| cream | `#f0e6cb` | newsprint paper |
| spot red | `#d52a1e` | the one extra ink on newsprint: arrow, deck, bullets, trajectory, misregistered halftone |

Rules: two inks plus the photo, and the photo is graded into those inks with `treat.py duotone` (never a raw colour photo). Every piece of type is one ink, at most two weights of one family.

## Typography

- Display is always drawn with `lettering.cjs` and always does something to the subject:
  - Cinema: `lettering.cjs "LAST" -o assets/title-last.svg --google "Big Shoulders Display" --weight 900 --fill '#e2a94b' --tracking 40 --width 358 --height 800` and the same for `"ROUND" --width 500` (widths from the natural widths 558:779 so both words share one stretch, about 1:8 per letter). Two SVGs leave a word space wide enough for the head.
  - Loupe: `lettering.cjs "HOLD|STILL" --google "League Spartan" --weight 800 --align right --leading .84 --tracking -30 --width 560 --fill '#f2ab25'` and `lettering.cjs "forever" --google "Mr Dafoe" --fill '#f2ab25' --stroke '#a91f1a' --stroke-width 16 --width 400` (the red stroke is what lets the script cut through the sans).
  - Blackletter: `lettering.cjs "Nocturne" --google "UnifrakturMaguntia" --fill '#f4b41a' --tracking -10 --width 990`. Grenze Gotisch fails in opentype.js; UnifrakturCook is the heavier fallback.
  - Newsprint: `lettering.cjs "GRAVITY" --google "Anton" --fill '#141210' --tracking 10 --width 1024 --height 340 --only 0,1,2,4,5,6`; the missing V is an inline SVG arrow drawn in its box (x 494-647, y 5-339 of the SVG; read the box from the full SVG's `l-3` path).
- Small type: Archivo with its width axis (loaded in `tokens.css`): `.pg-micro` 15 px semi-condensed, `.pg-caps` 16 px condensed caps, justified blocks with `.pg-just`. The cinema look swaps it for IM Fell English SC (eyebrow 25 px tracked .3em, blurb 19 px justified, facts 17 px).
- Japanese on the newsprint look only, and only words that are certainly right: 重力 (gravity), 滞空時間 (hang time), 着地 (landing), スケートボード (skateboard, set vertical with `writing-mode: vertical-rl`). Noto Sans JP 700/900.
- Never under 15 px on 1080 wide.

## Imagery

Photos (Unsplash License, free to use; credited anyway): marble statue by Nayani Teixeira, skater by Ilya Yarmosh, DJ in red smoke by A J., hooded boxer by Eser GOAT. The originals aren't in the repo (3000 px each): download them from Unsplash into a `src/` folder next to your project and make the cut-outs with `scripts/treat.py cutout` (`statue-cut.png`, `skater-cut2.png`, `boxer-clean.png` is the boxer cut-out with the sneaker and glove logos painted out). Keep brand marks out: the boxer uses `boxer-clean.png`, the hoodie print and glove emblem are knocked back in `prep/boxer.py`, the skater's shoe stripes, tongue and pocket logos in `prep/skater.py`, the deck graphic is replaced by a flat red deck, and the DJ crop stops short of the laptop.

| Poster | Commands (run from a folder holding `src/` and `_out/`; `$T` = `python .claude/skills/html-graphics/scripts/treat.py`) |
|---|---|
| Boxer | `python styles/poster-graphic/prep/boxer.py src/boxer-clean.png _out/boxer-prep.png 1.4` then `$T duotone _out/boxer-prep.png -o assets/boxer-duo.png --colors '#0b0505,#3a140e,#a04a2c,#f4d090' --levels 0,.6 --gamma .76`. Mirrored in CSS (`scaleX(-1)`) so the body falls across ROUND and LAST stays readable. |
| Statue | Crop `src/statue-cut.png` (800,0)-(2050,1400) to 2250x2520, `$T duotone ... -o assets/statue-red.png --colors '#330606,#9c1f16,#e5664a,#fdcaa8' --gamma .92`. Loupe sheet: crop `src/statue.jpg` (850,250)-(2000,1000) to 2588x1688, `$T duotone ... -o assets/statue-loupe.png --colors '#2a0605,#b03a26,#f5b48c,#fff0dc' --gamma .9`. |
| DJ | Crop `src/dj.jpg` (805,173)-(2245,1973) to 2160x2700, `$T duotone ... -o assets/dj-red.png --colors '#040202,#3d0605,#b81f17,#ff7a5c,#ffd9c4' --levels .02,.95`. |
| Skater | `python styles/poster-graphic/prep/skater.py split src/skater.jpg src/skater-cut2.png _out/sk`; `$T photocopy _out/sk/body.png -o assets/skater-pc.png --levels 0,.6 --gamma .8 --threshold .5 --grit .35 --specks .6 --paper none --ink '#141210'`; `$T halftone _out/sk/body.png -o assets/skater-ht-red.png --levels 0,.6 --gamma .75 --cell 8 --angle 15 --paper none --ink '#d52a1e'`; `$T photocopy _out/sk/board.png -o _out/sk/board-pc.png --levels .5,1 --gamma 1.1 --threshold .5 --grit .35 --specks .4 --paper none`; `python .../prep/skater.py deck _out/sk/board.png _out/sk/board-pc.png assets/board-red.png`. Bowl inset: blue channel of `src/skater.jpg` (150,2790)-(2850,3560) at 640x182, `$T halftone ... -o assets/park-lines.png --shape line --cell 3.4 --angle 0 --levels .05,.85 --gamma .9 --paper none`. |

Loupe panels (statue): one `background-image` (the loupe sheet) per panel, `background-size` = sheet size in canvas px at 1.25x the main image, `background-position` solved so each feature sits exactly where it is on the face (panel origin minus feature x zoom). The main image gets `blur(.8px)` so the panels read as the sharp, warmer "focus".

## Texture

- Cinema: `python prep/canvas.py assets/canvas.png 2160 2700 5.5` (canvas weave) at overlay .75, a radial light behind the figure, a floor gradient to near-black, vignette .42, grain .55.
- Loupe: radial glow, bottom multiply gradient to push the marble down under the small type, vignette, grain.
- Blackletter: black gradients top and bottom plus a radial vignette over the photo, grain; text blocks get a soft black text-shadow.
- Newsprint: `$T texture paper` (multiply .12), `$T texture folds --folds 2x2` (multiply .2), `$T texture dust --color '#141210'`, `prep/toner.py news-toner.png 2160 2700` (black speckle, heavier at the edges) and `prep/toner.py news-dropout.png 2160 2700 31 '#f0e6cb'` (paper-coloured dropouts that wear the black headline). `treat.py texture grunge` is too blotchy here.

## Composition

- Stack: ground, light/glow, photo, shade, title, cut-out subject (in front of the title), small type, textures, grain.
- The title is one idea: behind (cinema), crossed by a script and pointed at by the subject's gaze (loupe), sitting on the stage (blackletter), opened up inside the action (newsprint).
- Small type sits on a margin grid (36-44 px) in corners and edge columns, aligned to the photo's structure (shoulder line, desk edge, panel edges). Micro-paragraphs are deadpan and fictional.
- Density comes from many small, quiet items (label box, barcode from `pg.js`, counter, legend, spec sheet, timeline ruler), never from more big items.

## Signature moves

1. The subject physically in front of (or inside) its own title.
2. Two inks; the photo graded into them.
3. Deadpan micro-copy in justified blocks, counters ("06/52"), label boxes, legends and barcodes.
4. A print finish: canvas weave, grain, toner speckle and ink dropouts.

## Don't

- Copy the reference's words, layout or lockup (no centred chair-sitter with a centred paragraph, no eyes/nose/lips grid, no title-on-top still life, no star-for-O).
- Cover more than part of one or two title letters: the word has to read at phone size.
- Let the script and the sans share a colour without a separating outline.
- Put small type on the brightest part of the photo; move it or give it a halo.
- Use blotchy grunge on newsprint; it reads as smoke.
- Leave any logo, swoosh, stripes or board graphic in the photo.

## Check before delivering

- Thumbnail at ~400 px tall: the title reads, the subject reads, the inks are still two.
- The figure's cut edge has no halo against the ground (check the hood, curls, shoes at 100%).
- Every crop panel shows a feature that says something; drop a panel rather than show a blur.
- Japanese is one of the verified words above, or none.
