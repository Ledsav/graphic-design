# Poster styles

Recipes for the expressive, print-flavoured posters that make up most event, music and editorial graphics. Each one names what the look is made of, then how to build it with this skill. Mix them: most strong posters are one style with a single move borrowed from another.

These describe genres, not anyone's poster. Use them to reach a quality bar, never to copy a specific piece, and when the user shares reference images, take the genre and the level of finish from them, not the layout, the imagery or the type lockup.

`examples/` holds one worked poster per recipe (sources plus previews). Read them for technique: layering, filters, treatments, layout. Don't reuse their compositions or palettes.

## What every one of these has in common

1. **A strong image.** Half the poster. A subject with a clear silhouette and decisive light. See `imagery.md` for where it comes from.
2. **A treatment on the image.** Almost never a raw photo: halftone, photocopy, duotone, riso, posterize, or a cut-out. `scripts/treat.py` and `templates/filters.html`.
3. **Display type with character**, very large. One family carries the poster; a plain text face handles the small print.
4. **Texture.** Grain over everything at minimum; paper, dust, folds or grunge for print-era looks.
5. **Depth from layering.** The title behind the subject, a sticker border, an orbit line that passes behind and in front.
6. **Small type doing structure.** Corner meta (date, issue, venue), boxed notes, a rule or two, lineups in columns. Tiny, but it frames the big gesture.

Stack order that works for nearly all of them (z-index low to high): background colour, background shapes or texture, photo, shade or scrim, title, cut-out subject, small type, rings and lines, paper/dust/folds overlays, grain.

## Display fonts by genre

All on Google Fonts (OFL), loaded with a `<link>`. Bundled families (from `assets/fonts.css`) are marked with a star. The renderer warns if a name is wrong and the text falls back. A longer list by mood is in `type-and-composition.md`; whichever face you choose, draw the title with `scripts/lettering.cjs` rather than setting it straight.

| Genre | Fonts |
|---|---|
| Didone, fashion, editorial | Bodoni Moda, Playfair Display, DM Serif Display, Abril Fatface, Gloock★, Libre Baskerville★ |
| Ornate, Art Nouveau, decorative serif | Fraunces (axes SOFT 100, WONK 1), Cinzel Decorative, Limelight, Italiana★, Poiret One★ |
| Blackletter, gothic, metal | Pirata One, UnifrakturMaguntia, Grenze Gotisch, New Rocker |
| Extended grotesk (techno, rave, fashion) | Unbounded, Syncopate, Michroma, Krona One, Dela Gothic One, Archivo (`wdth` 125) |
| Condensed poster sans | Anton, Bebas Neue, League Gothic, Antonio, Oswald, Big Shoulders★ |
| Chunky retro, groovy | Bowlby One, Rubik Mono One, Shrikhand, Titan One, Chango, Bungee, Boldonse★ |
| Horror, dripping | Creepster, Nosifer, Butcherman, Eater, Rubik Wet Paint |
| Hand-made, marker | Permanent Marker, Rock Salt, Caveat Brush, Nothing You Could Do★ |
| Typewriter, zine | Special Elite, Courier Prime, IBM Plex Mono★, DM Mono★ |
| Plain text face for the small print | Instrument Sans★, Work Sans★, Crimson Pro★, IBM Plex Serif★ |

Load every weight and the italic you use (`ital` axis in the URL), or the renderer reports faux bold/italic.

---

## 1. Editorial cover with depth

Magazine or album cover: a moody photo, a huge decorative title that the subject stands in front of, small columns of text either side, corner meta and a barcode. Light rays and heavy grain.

- **Image:** a portrait or object with a clear head/top silhouette. Duotone or darkened (`treat.py duotone`, or CSS `filter: brightness() contrast()`), plus `treat.py cutout` of the same image.
- **Depth:** the photo and its cut-out sit in **the same box** (same left/top/width/height), title between them in z-order. Treat both identically (duotone the cut-out with the same colours).
- **Type:** an ornate or Didone display, 300px+ on 1080 wide, tight tracking; small sans columns (18–20px) with a bold 30px heading; meta in 16–18px bold.
- **Atmosphere:** a top gradient into the background colour for the title; light rays from `repeating-conic-gradient` with `filter: blur()` and `mix-blend-mode: screen`; grain at 0.6–0.8.
- Example: `examples/frame.html`.

## 2. Photocopy / xerox zine

High-contrast black and white with toner grit, big Didone or typewriter title between rules, boxed notes with thin borders, text set on a circle, thin orbit lines around the subject, fold creases and dust.

- **Image:** `treat.py photocopy` at the final pixel size. Choose polarity for the background: dark ink on paper (default) or `--invert` for light ink on a dark poster. A dark subject on a dark poster disappears.
- **Type:** Didone headline fitted to the width between double rules (`border-top: 7px double`); notes in a serif at 18–20px caps inside `border: 2px solid`.
- **Text on a circle** around the head, with a paper-coloured halo so it reads where it crosses the image: `stroke="<paper>" stroke-width="7" paint-order="stroke"` on the SVG `<text>`.
- **Orbit lines that wrap the subject:** the same SVG twice, one behind the subject and one in front clipped to its lower half (`clip-path: inset(50% -10% -10% -10%)`). Give the front copy a thick paper-coloured stroke under the thin ink one.
- **Texture:** `treat.py texture folds` (overlay with `soft-light`), `texture dust`, grain. Don't put `ink-bleed` or `distress` on Didone hairlines; they break.
- Example: `examples/exposure.html`.

## 3. Riso two-ink

Two flat inks on off-white paper, overlaps darken, everything grainy and slightly misregistered. Organic blobs, wide grotesk type, vertical side text, a lineup in columns.

- **Build flat:** design in exactly two colours on the paper colour, with `mix-blend-mode: multiply` wherever the inks overlap, so overlaps show as they will print.
- **Shapes:** blobs from `border-radius` (8-value) or SVG paths with `filter: url(#wobble)`; concentric rings with `repeating-radial-gradient` and `url(#rough)`.
- **Type:** extended grotesk at 900 for the title (fit to width), vertical side text with `writing-mode: vertical-rl` (rotate 180° on the left side), lineup at 28–32px.
- **Print it:** render, then `treat.py riso export/x.png -o x-riso.png --inks '<ink1>,<ink2>' --paper '<paper>'`. Real riso inks: fluorescent pink `#ff48b0`, blue `#0078bf`, red `#ff665e`, yellow `#ffe800`, teal `#00838a`, purple `#765ba7`, black `#000000`.
- Example: `examples/lowend.html`.

## 4. Halftone and torn paper (punk, gig, zine)

A loud flat paper colour, a black block of halftoned photo with torn edges and tape, a blackletter or western display title, a serif date and venue, scratches and grunge.

- **Image:** `treat.py halftone --invert --ink <paper colour> --paper '#121212'` so the dots carry the light, then `treat.py torn --edges top,bottom --rim-color <paper colour>`. For a subject that floats in black, cut it out first and `--flatten '#000'`.
- **Placement:** rotate the block 1–2° and let it run nearly edge to edge. Tape is a 200×60 rectangle of `rgb(236 236 226 / .55)` rotated ±6–10° with `filter: url(#torn)`.
- **Type:** blackletter at 250px+ with `url(#rough) url(#distress)`; date in a bold serif at 120px.
- **Texture:** `treat.py texture paper` (multiply), `texture grunge` (dark, 0.3–0.4 opacity), `texture dust`.
- Example: `examples/senal.html`.

## 5. Cut-out sticker over giant type

A saturated background with contour lines or halftone, two words of chunky display type stacked edge to edge, a cut-out person with a white die-cut border overlapping the lower word, info in the same display face at the bottom.

- **Image:** `treat.py cutout` (rembg), then `filter: url(#sticker) drop-shadow(...)` in CSS (or `treat.py outline`).
- **Type stack:** each word fitted to the full width separately, in one flex column, `line-height: .8`, `filter: url(#speckle)` for a printed fill.
- **Background:** `repeating-radial-gradient` contour rings in a darker shade with `url(#wobble)`, plus a dot pattern faded by a mask; grain.
- **Bottom info:** on a gradient band in the background colour so it never sits on the busy photo; one line, `white-space: nowrap`.
- Example: `examples/liftoff.html`.

## 6. Neon horror / Halloween

Black ground, neon green and red, a dripping or distressed display title with glow, a ribbon banner for the key line, illustrated characters around the edges, heavy grain.

- **Type:** a horror display (Creepster, Nosifer, Butcherman) in neon red with `url(#neon)`; secondary lines in a condensed distressed sans; a ribbon is a `clip-path: polygon()` band with notched ends behind the line.
- **Images:** illustrated monsters need an illustration source (AI generation or the user's art) treated with `treat.py duotone --colors '#000,#39ff6a'` or `posterize`. Never use film characters, masks or logos the user doesn't own the rights to.
- **Glow:** `filter: url(#neon)` on type and on a few accents only; everything glowing reads as nothing glowing.
- **Format:** usually a story (1080 × 1920) with `--safe: 250px 72px 340px`.

## 7. Illustrated screen-print

A hand-drawn illustration dominates, with hand-lettered titles, a flat 3–5 colour palette, screen-print speckle and slight misregistration, and info set into shapes around the figure.

- **What HTML can't do:** the illustration itself. It has to come from the user, an illustrator, or an image model (see `imagery.md`). Ask for flat colours, no gradients, no text, plain background.
- **What HTML does:** posterize the art to the palette (`url(#posterize)` or `treat.py duotone` with 3–4 stops), place it, set hand-made type (Shrikhand, Bowlby One, Permanent Marker, or lettering from the illustration), shapes for the info panels (`border-radius`, `clip-path`), `url(#speckle)` and `url(#misregister)` on the type, grain over everything.

---

## Finishing pass (all styles)

- Look at the export at full size and at feed size (the `--sheet` thumbnail). The title must read at thumbnail size; the small print must read at full size.
- One gesture dominates. If the title, the image and a texture all shout, quiet two of them.
- Check every crossing of text and image; add a halo, scrim or band where legibility drops.
- Texture belongs on everything or nothing: the grain sits above the whole poster, not on one element.
- Don't put real people's faces, brands or characters on a poster without rights. For anything that will be printed, run `print-production`.
