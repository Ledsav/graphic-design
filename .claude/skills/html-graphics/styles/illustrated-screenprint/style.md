---
id: illustrated-screenprint
name: Illustrated screen-print
family: print-era
mood: [warm, crafted, witty, folksy, characterful]
fits: [folk, blues, jazz and roots gigs, food and drink festivals, breweries and coffee, outdoor and nature events, markets and fairs, bookshops, community events]
avoid: [corporate and finance, luxury fashion, tech launches, anything that needs photography of the real thing]
formats: [poster, gig poster, flyer, label, social post, t-shirt]
palette: { paper: "#f2e6c9", key: "#182b3a", ink-a: "#2b7a78", ink-b: "#e8532b", ink-c: "#f2b134" }
fonts: { display: "Shrikhand (drawn, bulged, extruded)", text: "Archivo 500/800" }
---

# Illustrated screen-print

The hand-pulled gig poster: a drawn scene in four flat inks on cream stock, each colour a separate screen landing slightly off the key line, transparent inks overprinting into a fifth colour, pinholes where the ink didn't quite cover. The illustration is the poster: one character-led scene (an animal, an object, a landscape) with a visual pun on the event's name, and fat retro lettering that takes part in the scene instead of sitting over it. It comes from the American gig-poster and folk-art print tradition. It works because the limits of the process (few inks, flat shapes, imperfect registration) force a strong silhouette and make the piece feel made by hand.

## Palette

| Role | Hex | Use |
|---|---|---|
| paper | `#f2e6c9` | Bare stock: highlights, the submerged title, bubbles; a colour, so leave it bare |
| key | `#182b3a` | Prints last: outlines, details, extrusions, small type, the riverbed. 11.7:1 on paper |
| ink-a | `#2b7a78` | The big field: water, sky, ground. Paper on it 4.1:1 (large text only) |
| ink-b | `#e8532b` | The warm ink: the title and the character. 3:1 on paper, display only, always with a key-ink extrusion |
| ink-c | `#f2b134` | The light ink: belly, eye, small info shapes; small type on key (7.7:1) |

Rules: four inks plus paper, like four screens. Every flat shape is one ink; overlaps of transparent inks multiply into a fifth colour (`.sp-over`). Small text is key on paper, paper or ink-c on key, never on ink-a or ink-b. Alternatives that keep the logic: forest (ink-a `#3f6b3a`, ink-b `#d9432f`, ink-c `#efc04a`), night (paper `#e9dfc6`, ink-a `#2f3d6e`, ink-b `#e0693a`, ink-c `#f5d36b`), or a three-ink job (drop ink-c, use paper for highlights).

## Typography

- Display: Shrikhand, drawn with `lettering.cjs`: a left-aligned stack, bulged, bounced, with a key-ink extrusion. Alternatives: Bowlby One (rounder, stable), Chango (fat, wide), Lilita One, Rye (western), Sancreek (circus). Never a straight, unextruded title.
- The title takes part in the scene: half under the water line, sitting on a hill, held by the character, wrapped round the sun. Draw it twice with the same flags in two inks when the scene splits it (the example: vermilion above the surface, paper below, the lower copy clipped to the water and wobbled):
  ```bash
  L=.claude/skills/html-graphics/scripts/lettering.cjs
  node $L "DEEP|WATER" -o assets/title-above.svg --google Shrikhand --align left --leading .84 --warp bulge --amount .22 --jitter .35 --seed 4 --fill '#e8532b' --extrude 16 --extrude-angle 120 --extrude-color '#182b3a' --width 960
  node $L "DEEP|WATER" -o assets/title-below.svg --google Shrikhand --align left --leading .84 --warp bulge --amount .22 --jitter .35 --seed 4 --fill '#f2e6c9' --extrude 16 --extrude-angle 120 --extrude-color '#182b3a' --width 960
  node $L "BLUES" -o assets/blues.svg --google Shrikhand --warp wave --amount .35 --freq 1.2 --jitter .2 --fill '#f2e6c9' --width 470
  ```
- Text: Archivo. Heads and lineups 800 caps, 28–30 px, `letter-spacing: .02em`, each act in a `white-space: nowrap` span so no name breaks across lines; body 500 at 20–21 px; labels 800 caps at 18 px tracked `.08em`. Dates in the display face at 64 px (`.sp-date`).
- Info lives in shapes from the scene: bubbles, a sun, a badge, the riverbed (`.sp-shape` centres text in a circle).

## Imagery

- Drawn, not photographed: one character in inline SVG built from a few simple paths (body, tail, fins), flat fills per ink, a key-ink outline and details on top, paper-colour highlights (fin rays, an eye glint). Keep the drawing in its own coordinate grid and place it with one `transform`.
- Give it character: a tilt toward the action, an eye with a glint, an expressive feature (the catfish's barbels, drawn as tapered centre lines by the example's `taper()`).
- A visual pun ties scene and event: the bait on the hook is a guitar pick; the title sinks into the river.
- No photos. If the brief insists on one, posterize it to these inks first (`treat.py duotone` with key and paper, then flat ink shapes over it), but a drawing is the point of the style.

## Texture

- Each colour layer gets `.sp-ink` (`#speckle`: pinholes knocked out of the flat ink, about 6%).
- Off-register colour screens: `.sp-mis-b` (6 px, 4 px) and `.sp-mis-c` (−5 px, 5 px) on the colour layers, never on the key, so colour peeks out past the outline.
- `.sp-over` (multiply) where one transparent ink prints over another (weeds over the river).
- Paper: `treat.py texture paper -o assets/paper.png --size 1080x1527` as an overlay, `multiply` .5, then grain `--grain: .28` with `multiply`.
- No dust, folds, halftone or photocopy grit: screen ink is flat.

## Composition

- Archetypes: **scene** (a full-bleed drawn world with a horizon), **depth sandwich** (title behind the character, a part of it in front), **type in the scene**. One character, large, cropped by the frame or the ground; it looks at or moves toward something (the bait, the title, the info).
- Bands: sky and title (top 35%), the scene (middle), a ground or riverbed band that carries the lineup (bottom 15–20%). The horizon is drawn (waves, hills), never a straight line.
- Margins: 56 px for text. Pieces of the scene bleed freely.
- Layer order (z low to high): paper, title above the line, field ink (water, sky), title below the line, ground, weeds behind, character (colour screens, then key), weeds in front, line and bait, info shapes, kicker and lineup, paper overlay, grain.

## Signature moves

1. A drawn character in four flat inks with a key outline and colour screens off-register.
2. Fat, bounced, extruded lettering that takes part in the scene (sinking, sitting, held).
3. A visual pun connecting the scene to the event.
4. Info set into shapes from the scene (bubbles, sun, ground band).
5. Pinholes in the ink, overprints making a fifth colour, paper left bare as a colour.

## Don't

- Use gradients, soft shadows or photo textures: everything is a flat screen.
- Misregister the key ink: only the colour screens move, the key holds the drawing together.
- Set small text on ink-a or ink-b, or let a lineup name break across lines.
- Draw in clip-art style (symmetrical, centred, front-on): tilt the character, crop it, give it a gaze.
- Copy another illustrator's character or signature style; invent your own creature and pun.
- Add more than four inks; a fifth colour only comes from an overprint.

## Check before delivering

- Squint: the title and the character read first, the date bubble second.
- The title spells correctly where it crosses the scene (the submerged half still reads as the same word).
- Small text: key on paper, paper or ink-c on key only; every act's name on one line; prices carry a currency.
- Off-register shifts are on colour layers only, 4–6 px, and no colour gap opens where it would read as a mistake (an eye, a mouth).
- Exactly four inks plus paper; overprints only where shapes overlap.

## Build

Link `../_base.css` and `tokens.css`, and paste `#speckle`, `#wobble` and `#rough` from `templates/filters.html` after `<body>` (the example tunes `#speckle` to 10.2 and stretches `#wobble` horizontally for water). Helpers: `.sp-ink`, `.sp-mis-b`, `.sp-mis-c`, `.sp-over`, `.sp-wobble`, `.sp-date`, `.sp-head`, `.sp-text`, `.sp-small`, `.sp-shape`. The example draws the whole scene in one inline SVG on the artboard's grid: the water path doubles as the clip for the submerged title, the catfish is drawn on its own 1000 × 560 grid and placed with one transform, and each ink is its own `<g>` in print order (colours first, key last).
