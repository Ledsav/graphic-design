---
id: collage-scrapbook
name: Collage scrapbook
family: print-era
mood: [playful, handmade, curious, chaotic, warm, diy]
fits: [zine and small-press fairs, indie gigs, craft and maker events, bookshops and libraries, kids' workshops, community fundraisers, editorial openers, school and club events]
avoid: [luxury, finance and legal, healthcare, anything that must look official or calm, dense information like timetables]
formats: [poster, social post, flyer, story, zine cover]
palette: { board: "#c8a272", newsprint: "#ebe5d5", white-card: "#f8f5ee", grey-card: "#d9d6cf", ink: "#161514", accent: "#ff3f8e" }
fonts: { display: "ransom letters drawn with lettering.cjs, one face per letter (Abril Fatface, Rubik Mono One, Bodoni Moda 900 italic, Bowlby One, Anton, Bagel Fat One, Ultra, DM Serif Display, Playfair Display 900 italic)", hand: "Caveat Brush 400", text: "Special Elite 400" }
---

# Collage scrapbook

Cut-and-paste collage: torn and scissor-cut paper in several tones, photos clipped from different sources at different scales, tape, handwritten notes and arrows, a rubber stamp, a label-maker strip, and a ransom-note title where every letter is cut from somewhere else. It comes from punk and DIY zines, school scrapbooks and Dada photomontage. It works because every piece visibly has a source and a thickness, so the poster feels made by a person with scissors. The chaos is controlled: one big anchor piece and one tilted baseline for the title keep it readable.

## Palette

| Role | Hex | Use |
|---|---|---|
| board | `#c8a272` | Kraft card ground everything is pasted on |
| newsprint | `#ebe5d5` | Paper tone 1: letter scraps, photocopies |
| white-card | `#f8f5ee` | Paper tone 2: notebook page, letter scraps, scissor rims |
| grey-card | `#d9d6cf` | Paper tone 3: cut-card shapes (frames, helmets, badges) |
| ink | `#161514` | Black card, marker, typed text, label tape |
| accent | `#ff3f8e` | Fluoro pink: 2–3 letter scraps, one letter, the stamp, the washi tape, one doodle dot |

Rules: paper tones plus black plus exactly one bright accent. Photos bring their own colour; don't add a second accent to match them. The accent goes on paper (scraps, stamp, tape), never as a flat background. Pink letters sit on light paper only (white on pink is under 3:1 at text size). Alternatives that keep the logic: accent orange `#ff5a1f`, acid yellow `#f4e23a` (letters in ink on it), electric blue `#2747ff`; or a black-card board (`#1b1a18`) with the same paper tones.

## Typography

- **Title: ransom note.** One letter per scrap, each in a different face, colour and size, each scrap rotated -8° to +8°. Draw each letter with `lettering.cjs` (one SVG per letter, so glyph shapes are exact and can mask photos):
  ```bash
  L=.claude/skills/html-graphics/scripts/lettering.cjs
  node $L "P" -o assets/r0-p.svg --google "Abril Fatface" --height 300 --fill '#161514'
  node $L "P" -o assets/r2-p.svg --google "Bodoni Moda" --weight 900 --italic --height 300 --fill '#161514'
  node $L "R" -o assets/r4-r.svg --google "Anton" --height 300 --fill '#ff3f8e'
  node $L "E" -o assets/r3-e.svg --google "Bowlby One" --height 300 --fill '#000'   # used as a mask: photo inside the letter
  ```
  Mix the sources: serif display (Abril Fatface, DM Serif Display, Bodoni Moda, Playfair Display italic), poster sans (Anton, Bowlby One, Rubik Mono One), slab and fat (Ultra, Bagel Fat One). Never two neighbours in the same face or the same paper.
- **Letter sizes:** 130–230 px on a 1080 artboard, at least 40% difference between the smallest and the biggest. Scrap padding 15–16 px. Neighbouring scraps touch or overlap by 5–20 px; gaps read as a typed word, not a cut one.
- **Photo letters:** one or two letters cut out of the photos in the piece (`mask` with the lettering SVG, the photo as background: `.cs-photo`). Choose letters with wide strokes (C, O, U, E in Bowlby One or Bagel Fat One).
- **Handwriting:** Caveat Brush 400 for notes, 36–48 px (the date can go to 70–80 px), in black marker on light paper or white marker on dark. Alternatives: Reenie Beanie, Kalam 700, Homemade Apple (sparingly), Permanent Marker for one shouted word.
- **Typed text:** Special Elite 400 at 22–26 px, line height 1.35, flush left on a paper scrap. Labels: Special Elite uppercase, 21 px, letter-spacing .14em. Alternative: Courier Prime 400/700.
- Outside the title, use only these two families (one hand, one typed). The variety belongs to the ransom letters.

## Imagery

- **Two or three photos at clearly different scales**, each from a different "source": one big colour photo (the anchor or the star), one photocopied black-and-white clipping, one small object cut out with a white scissor rim. Plus one large texture photo as a background sheet (space, sea, grass, brick).
- Commands (shared photos from `styles/_shared/photos/`; your own in `assets/`):
  ```bash
  T=.claude/skills/html-graphics/scripts/treat.py
  python3 $T torn hubble_deep_field.jpg -o assets/hubble-torn.png --edges top,bottom,left,right --depth 40 --rim 10 --rim-color '#f4efe4'
  python3 $T photocopy rocket-strip.jpg -o rk.png --width 400 --levels .24,.52 --specks .5 --grit .4 --paper '#ece6d6' --ink '#151515'
  python3 $T torn rk.png -o assets/rocket-copy-torn.png --edges top,bottom --depth 30 --rim 8 --rim-color '#f6f2e8'
  python3 $T outline coffee-cut.png -o assets/coffee-cut-rim.png --size 16 --color '#f7f3ea' --trim
  python3 $T cutout object.jpg -o object-cut.png                     # then outline, as above
  ```
- **Photocopy levels:** measure the subject first. Set the black point just above the background's luminance and the white point just above the subject's, or the subject drops into the black (`--levels .24,.52` kept the rocket's fairing at 0.45 and dropped the dusk sky at 0.25).
- **Cropped shapes:** a circle (`border-radius: 50%`) for a portrait in a frame, a narrow vertical strip for a tall subject, a torn rectangle for scenery. Frames, helmets and badges are cut from grey card in CSS (`.ring` with `filter: url(#rough)`), not drawn.
- Combine photos into one absurd image (a cat in a helmet, a coffee cup orbiting): the collage joke is what makes it specific to the brief.
- Credit every photo in the project's `assets/CREDITS.md`. Don't use photos of real people as the joke.

## Texture

Stack, bottom to top:

1. Board colour (`--bg`).
2. `treat.py texture paper` at the artboard size, `multiply`, opacity .55.
3. Vignette: `box-shadow: inset 0 0 160px rgb(80 50 20 / .28)` (the board curls a little).
4. The pieces, each with a paper shadow from one light, top left: `drop-shadow(2px 5px 5px rgb(40 26 10 / .34))`, bigger for pieces that sit higher (`--lift-high`).
5. Tape (translucent, normal blend, jagged ends), the stamp (`multiply` + `url(#distress)`, worn).
6. `treat.py texture dust --color '#2a241c'`, normal blend, opacity .5.
7. Grain `--grain: .22`, `multiply`.

Edges: torn pieces get `filter: url(#torn)` on their paper only (the `::before`), so letters and text stay sharp. Scissor-cut pieces get an irregular 4-point `clip-path` (`.cs-cut`, `.k2`, `.k3`). Use both in one piece, roughly half and half.

## Composition

- **Archetype: collage**, combined with one other: depth sandwich (title pasted across the edge of the big sheet, a letter in front of the star image), diagonal, or giant crop. Thumbnail at least four arrangements: the anchor sheet's position decides everything else.
- **The anchor:** one big piece, 60–80% of the width, bleeding off two or three edges and rotated 2–4°: a torn photo sheet, a big notebook page, a black card. Everything else is subordinate to it.
- **The title** rides one tilted baseline (-2° to -6°) in one or two lines, across the anchor's edge so it belongs to both the anchor and the board. Letters bounce ±20 px off the baseline, never more.
- **Angles:** every piece rotated 2–8° (tape 20–60°). No piece at exactly 0°, and no two neighbours at the same angle.
- **Information** on one or two paper pieces (a torn notebook page holds date, time, place and URL), plus a stamp and a label for the two facts that need shouting. Align the info piece's left edge with the title's first letter.
- **Notes and arrows** connect pieces: one note per idea, the arrow pointing at the thing it describes. At most three notes.
- Leave one quieter area (the open part of the anchor sheet). Margins: `--safe: 48px` for text; pieces may bleed freely.
- Layer order (z-index): board, texture, anchor sheet, secondary photos, star image, title letters, info scraps and small photos, tape and labels, stamp, notes and doodles, dust, grain.

## Signature moves

1. A ransom-note title: one letter per scrap, every scrap a different face, paper and angle, with one or two letters cut out of the poster's own photos.
2. A big torn anchor sheet bleeding off the frame, with the title pasted across its edge.
3. Different sources side by side: a colour photo, a photocopied clipping, a die-cut object with a white scissor rim.
4. Tape, a label-maker strip and a worn rubber stamp straddling the edges of pieces.
5. Handwritten notes with marker arrows that tell a small story about the images.

## Don't

- Rotate everything by the same amount, or scatter pieces evenly: clusters and one anchor, or it reads as noise.
- Set the title in one font with CSS rotation per letter: every letter needs its own source.
- Put more than one bright colour in, or put pink letters on dark paper.
- Use drop shadows from different directions, or big soft shadows (the pieces are paper, 1 mm thick).
- Let notes, stamps or tape cover the date, place or title letters.
- Use clip-art stickers, emoji or vector icons: everything should look cut from something.
- Put the torn-edge filter on a piece that holds text (filter the `::before` only) or on striped tape.

## Check before delivering

- Squint: the title and the star image are the first two reads, the date third.
- Every title letter is legible on its scrap (contrast ≥ 3:1) and the word reads at thumbnail size.
- No two neighbouring scraps share a face, paper colour or angle.
- One light direction for every shadow.
- Text crossings: nothing (note, stamp, tape, doodle) sits on top of the typed info.
- Each photo is credited and none is upscaled (the renderer warns).

## Build

Link `../_base.css` and `tokens.css`, and paste the `#torn`, `#rough` and `#distress` filters from `templates/filters.html` after `<body>`. Helpers: `.cs-scrap` (a pasted piece: set `--paper`; `.cs-torn` or `.cs-cut` plus `.k2`/`.k3` for the edge; `.cs-lined`, `.cs-graph`, `.cs-dots` for printed paper), `.cs-letter` (a ransom letter; `--h` for its height, `.cs-photo` inside for a photo-filled letter), `.cs-tape` and `.cs-tape.washi`, `.cs-hand`, `.cs-typed`, `.cs-label`, `.cs-dymo`, `.cs-stamp` (an inline SVG with text on a circle), `.cs-doodle` (an inline SVG with marker paths). Place pieces with absolute `left`/`top` and the `rotate` property, so the transform stays free for other use. The example's assets were made with the commands above; the cat crop is a plain square crop of `chelsea-cut.png`.
