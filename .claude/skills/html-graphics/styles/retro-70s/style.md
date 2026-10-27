---
id: retro-70s
name: Retro 70s
family: pop
mood: [warm, groovy, nostalgic, friendly, mellow]
fits: [coffee, food and drink, soul, funk and disco nights, record fairs, vintage and thrift markets, brunches and daytime parties, craft beer, surf and skate shops]
avoid: [tech and fintech, luxury minimal, medical, anything that must feel urgent or cutting-edge]
formats: [poster, social post, flyer, label, menu, record sleeve]
palette: { paper: "#f3e3c3", ink: "#4a2511", mustard: "#e3a92b", orange: "#d9631e", rust: "#a63c1c", avocado: "#5c6a22" }
fonts: { display: "Shrikhand 400 (drawn, risen, outlined, extruded)", text: "Young Serif 400" }
---

# Retro 70s

The 1970s in print: harvest gold, burnt orange, rust and chocolate on cream stock, a stack of rounded stripes that flows through the picture, fat italic display type with a cream inline and a chocolate drop, a warm, faded photo, and the odd starburst price sticker. It comes from record sleeves, diner menus, packaging and TV idents of the period. It works because everything is soft and rounded, the palette is one warm family, and the stripe band gives a single fluid gesture that ties the type, the photo and the information together.

## Palette

| Role | Hex | Use |
|---|---|---|
| paper | `#f3e3c3` | Background; the title's inline |
| ink | `#4a2511` | Chocolate: all small type (10.6:1), outlines, the extrusion, the darkest stripe |
| mustard | `#e3a92b` | Harvest gold: the lightest stripe, pills and stickers with ink text (6.4:1); never text on paper |
| orange | `#d9631e` | Burnt orange: the title face, a stripe. Display only (2.9:1) |
| rust | `#a63c1c` | A stripe, the kicker (5:1) |
| avocado | `#5c6a22` | The one cool note, used once if at all (4.7:1) |

Rules: one warm family plus chocolate. The stripe stack is always the same four, dark to light: ink, rust, orange, mustard (`--stripe-1` to `--stripe-4`). Small type in ink or rust only. No pure black, no white, no neon. Alternatives that keep the logic: earth (avocado, mustard, tan `#c9a26b`, brown), sunset (plum `#5b2a4a`, magenta `#c43d6b`, orange, gold), or teal and orange (`#2f6f6a` for the dark stripe).

## Typography

- Display: Shrikhand, drawn with `lettering.cjs` as a justified stack rising to the right, with a cream inline, a chocolate outline and a chocolate drop:
  ```bash
  L=.claude/skills/html-graphics/scripts/lettering.cjs
  node $L "SLOW|ROAST" -o assets/title.svg --google Shrikhand --align justify --leading .84 --tracking -10 --warp rise --amount .22 --fill '#d9631e' --stroke '#f3e3c3' --stroke-width 12 --stroke2 '#4a2511' --stroke2-width 30 --extrude 34 --extrude-angle 120 --extrude-color '#4a2511' --width 680
  ```
  Alternatives: Cooper-style soft serifs (Young Serif at display size, Fraunces 900 soft), Bagel Fat One, Righteous (for a funk sans), Monoton (disco, one line), Rye (country).
- Text: Young Serif 400 (bundled in `canvas-design/canvas-fonts`, also on Google Fonts). Kicker 26 px in rust, rotated to the title's angle; details 26 px (`.r70-text`); small print 20 px (`.r70-small`); caps labels 20 px tracked `.14em` in a mustard pill (`.r70-pill .r70-caps`). Sticker text in Shrikhand 38 px.
- Mixed case for everything but the title and the pill.

## Imagery

- One warm photo of an object, cut out and pushed into the palette with a four-stop duotone, so it looks like faded period print:
  `treat.py duotone .claude/skills/html-graphics/styles/_shared/photos/coffee-cut.png -o assets/coffee-warm.png --width 1040 --colors '#3b1d0e,#a63c1c,#e3a92b,#f6e6c4' --levels .04,.86`
- Objects suit it: a cup, a record, a can, a plant, a car, a guitar. People only with rights, and warm-toned the same way.
- Let the photo bleed off a corner. Low resolution is fine here (the duotone and grain hide it), but don't go past about 2× upscale.
- Drawn shapes: the stripe band (four offset strokes along one curve, built by the example's script), rainbow arcs (`.r70-arcs`), sunburst rays (`.r70-sunburst`), the starburst sticker (a 22-point star path).

## Texture

- Paper: `treat.py texture paper -o assets/paper.png --size 1080x1350 --seed 5` as `.overlay`, `multiply` at .85 (warms and mottles everything).
- Grain `--grain: .35` with `overlay`.
- No halftone, dust or distress: soft and worn, not grungy.

## Composition

- Archetypes: **flow** (the stripe band enters from the photo and leaves the frame, carrying the eye from image to title to edge), **sunrise** (rainbow arcs rising from the bottom edge behind a centred object), **badge** (everything inside a rounded box). Title on the band's diagonal, rising left to right.
- The band starts inside the object (rising out of the cup as steam, out of a record as sound) and exits off the frame. Clip it so it emerges from the object convincingly (`clipPath` with the object's opening).
- One info cluster, flush right or left, with a pill on top; a starburst sticker as a counterweight in the opposite corner.
- Margins 48 px; the photo and the band bleed.
- Layer order (z low to high): paper, photo, stripe band, kicker and title, sticker, info, paper overlay, grain.

## Signature moves

1. A four-stripe band (ink, rust, orange, mustard) flowing out of the subject and off the page.
2. Fat italic lettering, risen, with a cream inline, chocolate outline and drop.
3. A warm four-tone photo of an object, bleeding off a corner.
4. A starburst price sticker and a mustard pill with tracked caps.
5. Rounded everything: pills, rounded boxes, arcs.

## Don't

- Use the stripes in a different order or add a fifth colour; the stack is the identity.
- Use cool greys, pure black or white; even shadows are chocolate.
- Put orange or mustard text on paper (under 3:1).
- Let the band end inside the frame or cross the title's letters; it runs behind or beside them.
- Reach for a disco-ball, smiley or peace-sign cliché unless the brief asks; the band and the type carry the period.
- Let the pill or the sticker graze the photo: overlap decisively or leave a clear gap.

## Check before delivering

- Squint: title first, the band leads from the object to the title, info last.
- Small type in ink or rust only; the pill text in ink on mustard.
- The band emerges from the object believably (no hard clip edge outside it) and leaves the frame.
- Stripe order is ink, rust, orange, mustard everywhere it appears.
- The photo is no more than about 2× upscaled and reads as warm print, not as a filtered snapshot.

## Build

Link `../_base.css` and `tokens.css`. Helpers: `.r70-stripes` (straight stack), `.r70-arcs` (rainbow arcs; box width = 2 × radius), `.r70-sunburst` (`--sx`, `--sy`, `--ray-a`, `--ray-b`), `.r70-pill`, `.r70-box`, `.r70-display`, `.r70-head`, `.r70-text`, `.r70-small`, `.r70-caps`; `--stripe` sets the stripe width (40–60 px on 1080). The example's script builds the steam band from two cubic curves sampled into points, then draws four strokes offset along the normal (deterministic), and draws the 22-point starburst.
