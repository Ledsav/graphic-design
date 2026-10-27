---
id: bauhaus-constructivist
name: Bauhaus constructivist
family: modernist
mood: [bold, dynamic, urgent, rational, utopian]
fits: [film festivals and cinemas, design and architecture events, lectures and conferences, theatre, museum shows, activist and civic campaigns, avant-garde music]
avoid: [romantic or soft brands, luxury and beauty, children's events, cosy nostalgia, wellness and organic products]
formats: [poster, social post, flyer, book cover, banner]
palette: { paper: "#efe6d2", ink: "#141414", red: "#d42a1f", yellow: "#f2b31b", blue: "#1f4fa0" }
fonts: { display: "League Spartan 900", text: "Jost 400/500/600" }
---

# Bauhaus constructivist

The 1920s avant-garde poster, from the Bauhaus workshops and the Soviet constructivists: elementary shapes (circle, wedge, bar), a few flat inks on cream stock, heavy geometric sans caps, black-and-white photomontage, and one decisive diagonal that turns the page into a machine. Type is built, not set: it runs along the axis, grows in steps, or becomes the shape itself. It works because every element has a job in one force line, from a point of origin out to the edge, so the eye travels the way the poster wants and the empty paper reads as speed.

## Palette

| Role | Hex | Use |
|---|---|---|
| paper | `#efe6d2` | Background and reversed type; cream stock, never white |
| ink | `#141414` | Type on paper (14.8:1), black bars, the photo's shadows |
| red | `#d42a1f` | The one big shape: a wedge, a beam, a field. Cream type on it at display size (4.1:1) |
| yellow | `#f2b31b` | One small accent: a disc behind a focal point, a square. Ink on it if anything (9.9:1), never cream |
| blue | `#1f4fa0` | One bar or small field with cream text (6.3:1) |

Rules: red dominates as a single shape, black carries the type, yellow and blue appear once each and small. Flat fills only, no tints, no gradients, no transparency. Alternatives that keep the logic: red + black only on cream (the purest version), or Bauhaus primaries on white `#f4f1ea` with the blue as the big shape and red as the accent.

## Typography

- Display: League Spartan 900, uppercase, tight (`letter-spacing: -.02em`). Alternatives: Big Shoulders Display 900 (condensed, Soviet), Oswald 700 (condensed), Bebas Neue (one line only). Text: Jost 400–600 (Futura-like). Two families.
- Type is construction. Three ways, in order of impact:
  1. **Crescendo:** the title grows letter by letter along the axis, so its silhouette is a cone from the point of origin (the example; built in its script, letter size proportional to distance from the lens, beam fitted to the word).
  2. **On the axis:** a word set in one size and rotated to the diagonal, cut into the wedge or reversed out of the bar.
  3. **Static crescendo with lettering.cjs:** `node .claude/skills/html-graphics/scripts/lettering.cjs "MONTAGE" -o assets/title.svg --google "League Spartan" --weight 900 --warp perspective --amount .6 --width 1100 --fill '#efe6d2'`, then rotate the SVG to the axis.
- Sizes on a 1080 artboard: crescendo letters 60–330 px; slogan 78 px (`.bc-display`, line height .9); bar text 44 px (`.bc-head`) or 24 px semibold caps; info 22 px Jost (`.bc-text`); labels 18 px caps tracked `.04em` (`.bc-small`).
- Only two angles: the axis and the frame (0° / 90°). Text rotated to the axis reads upward (−45° or −30°), never downward.

## Imagery

- One black-and-white photo, cut out: a person doing something with an instrument (camera, megaphone, hand, telescope, machine), placed so the action points along the axis. Photomontage, not illustration.
- Cut out, crop to the action, then map to two inks at the display size:
  ```bash
  T=.claude/skills/html-graphics/scripts/treat.py
  python3 $T cutout photo.jpg -o cut.png
  python3 $T duotone cut.png -o assets/figure.png --colors '#141414,#efe6d2' --levels .04,.8
  ```
  The figure bleeds off one or two edges; its cropped edge never floats in the paper.
- The figure meets the geometry: the yellow disc sits behind the lens or the mouth, the red wedge starts exactly at that point. The example's script anchors the figure, disc and beam on the lens coordinate (`LENS_IN_IMG`).
- Shapes are pure CSS or SVG: circle (`.bc-circle`), triangle (`.bc-tri`), bars, the beam polygon.

## Texture

Printed flat ink: `filter: url(#speckle)` (`.bc-printed`) on the red and yellow so the colour has a fine letterpress speckle, and `--grain: .3` with `multiply` over everything. Nothing else: no paper folds, dust or distress. The photo keeps its own grain.

## Composition

- Archetypes: **diagonal** (the default: one force line from a point of origin to the far corner), **type as image** (the beam, the wedge), asymmetric split with photomontage. Never centred, never a title above an image.
- Choose the point of origin first (a lens, a mouth, a fist, a corner) and the axis angle (−45° or −30°). Every secondary block is parallel to the axis or square to the frame.
- Leave at least a third of the paper empty, on the side the axis points away from. Empty space is part of the movement.
- Information: the date and venue in coloured bars parallel to the axis, stepped below the beam (`onAxis()` in the example places them in axis coordinates); a slogan block and a kicker square to the frame at the top-left margin (60 px); the small print bottom-right, flush right.
- Layer order (z low to high): paper, disc, beam and crescendo word, splice cuts, figure, slogan and bars, info, grain.

## Signature moves

1. One diagonal from a point of origin, with everything else on the axis or the frame.
2. Type as a built object: a crescendo cone, a word cut into a red wedge.
3. Photomontage: a black-and-white cut-out figure plus flat elementary shapes (a yellow disc behind the focal point).
4. Information in coloured bars parallel to the axis, stepped like construction.
5. Cream, black, red, with yellow and blue once each.

## Don't

- Rotate things to several different angles; one axis plus 0° / 90° only.
- Use gradients, shadows, rounded corners on bars, or soft and humanist fonts.
- Fill the empty paper with more shapes or text; it kills the movement.
- Let a bar's text run off the canvas: bars may bleed, their words may not.
- Put cream type on yellow or small cream type on red (under 4.5:1 below display size).
- Recreate a famous poster (Rodchenko's shouting woman for Lengiz, Lissitzky's red wedge): take the moves (a cone of type from a source, a wedge against a circle) with your own subject and layout.

## Check before delivering

- Squint: the red shape and the title read first, the figure second, the bars third.
- Every block is on the axis or square to the frame (check the angles in the source, not by eye).
- All text is complete inside the canvas; the title's last letter is whole.
- The figure's crop edges bleed off the canvas; the point of origin (lens, mouth) sits exactly at the start of the beam.
- At least a third of the paper is empty.

## Build

Link `../_base.css` and `tokens.css`; paste `#speckle` from `templates/filters.html` after `<body>`. Helpers: `.bc-display`, `.bc-head`, `.bc-text`, `.bc-small`, `.bc-red`, `.bc-yellow`, `.bc-blue`, `.bc-black`, `.bc-circle`, `.bc-tri`, `.bc-on-axis` (rotate about the left edge to `--axis`), `.bc-printed`. The example's `window.layout()` builds the geometry from a few constants (lens position `L`, `AXIS`, figure scale `K`, the word, its start and end distance): the figure, disc, beam, crescendo letters, splice cuts and both bars are all computed from them, so changing the word or the angle keeps everything aligned. It is deterministic and waits for the display font before measuring.
