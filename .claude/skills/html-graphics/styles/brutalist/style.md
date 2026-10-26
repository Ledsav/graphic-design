---
id: brutalist
name: Brutalist
family: digital
mood: [raw, confrontational, loud, structural, deadpan]
fits: [noise, techno and industrial nights, architecture and design talks, hackathons and tech meetups, independent publishers, art-school shows, streetwear drops]
avoid: [luxury, weddings, wellness and care, children, anything that must feel friendly or soft]
formats: [poster, social post, flyer, banner, zine cover]
palette: { paper: "#f0efea", ink: "#0b0b0b", concrete: "#a3a19b", acid: "#ccff00" }
fonts: { display: "Archivo Black 400", text: "Space Mono 400/700" }
---

# Brutalist

Béton brut translated to print and screen: structure left exposed, material left raw, nothing softened. It borrows from brutalist architecture (slabs, heavy lintels, repetition, concrete grey) and from raw web brutalism (monospace, brackets, default-looking tables, hard borders, difference blending). A grotesque is stretched until it fills its box, a photo is photocopied until only black and white remain, and the construction lines stay in the final file. It works because it refuses polish: the honesty of the structure is the aesthetic, and a single acid block makes the austerity feel intentional rather than unfinished.

## Palette

| Role | Hex | Use |
|---|---|---|
| paper | `#f0efea` | Background; raw stock, never pure white |
| ink | `#0b0b0b` | Display type, slabs, rules, all text |
| concrete | `#a3a19b` | A second slab or a secondary fill; never text |
| acid | `#ccff00` | Exactly one block, with ink text on it |

Rules: black, white and grey carry the poster; the acid is one rectangle (date, price, CTA). Acid on paper is about 1.1:1, so never set acid text or thin acid lines on paper; acid is a fill behind ink text, or a fill on the ink slab. Alternatives that keep the logic: safety orange `#ff5100`, hazard yellow `#ffe100`, or electric blue `#2b2bff` with paper text on it. Inverted works too (paper `#0b0b0b`, ink `#f0efea`). No gradients, no tints, no transparency on colour.

## Typography

- Two families only: one heavy grotesque for display, one monospace for everything else. Display: Archivo Black (default), Anton, Big Shoulders Display 900, Inter Tight 900. Text: Space Mono 400/700 (default), IBM Plex Mono★, DM Mono★.
- Display is drawn, not typed: stretch each word non-proportionally to fill a structural box exactly, then let the frame crop it.
  - `L=.claude/skills/html-graphics/scripts/lettering.cjs`
  - `node $L "MAX" -o assets/max.svg --google "Archivo Black" --tracking -40 --width 860 --height 400` (a word forced into an 860 × 400 box; place it so a third of the last letter runs off the edge)
  - `node $L "Q" -o assets/q.svg --google "Archivo Black" --height 1010` (a single giant glyph that becomes architecture; keep its identifying part, here the tail, inside the frame)
  - Stacks: `node $L "RAW|LOAD" -o t.svg --google Anton --align justify --leading .8 --width 1000 --height 1300`
  - No warps, drips, jitter or extrusion: distortion here is only stretch, scale and crop.
- Sizes on a 1080 artboard: display glyphs 400–1000 px tall; mono labels 18 px bold uppercase, `letter-spacing: .02em`; one mono line at 34 px bold for the key fact (date); table rows 18–20 px. Nothing in between: the scale jump is the point.
- Labels read like a spec sheet: `[MAX Q]`, `FIG. 01`, `T−00:00:10`, `SHEET 1/1`, numbered rows `01 02 03`, units and formulas. Set formulas and units with `text-transform: none` (uppercase turns ρ into P and kPa into KPA).
- Space Mono crashes `lettering.cjs` (opentype.js does not support one of its substitution lookups); use it as HTML text only.

## Imagery

- One photo, treated until it is pure black and white, then cropped into a slab: a narrow full-height column, a band, or a box with a 12 px border. Structures, machines, concrete, crowds and hands suit it; portraits rarely do.
- Crop first (hard, tight, off-centre), then treat at the final pixel size:
  - Crop: `python3 -c "from PIL import Image; Image.open('in.jpg').crop((200,0,440,427)).save('crop.png')"`
  - Photocopy, white subject on a black slab: `treat.py photocopy crop.png -o assets/slab.png --width 840 --levels .34,.6 --gamma 1.3 --grit .8 --specks 1.2 --ink '#0b0b0b' --paper '#f0efea'` (push `--levels` until the sky or background is solid black)
  - Inverted, black subject on paper: add `--invert` and swap `--ink` / `--paper`.
  - Coarse screen: `treat.py halftone crop.png -o assets/slab.png --width 840 --cell 18 --angle 45 --ink '#0b0b0b' --paper '#f0efea' --levels .15,.7`
- No duotones in colour, no cut-outs with soft edges, no smooth photos. Never upscale beyond about 3.5× even with photocopy: past that the subject turns to mush.

## Texture

Raw, not distressed. The photocopy grit lives inside the image; over the whole poster only `--grain: .22` with `multiply`, like toner on cheap stock. No paper, folds, dust or grunge overlays, no speckle on type: solid ink stays solid.

## Composition

- Archetypes: asymmetric split (a slab column against giant type), word stack broken into boxes, type as frame. Everything orthogonal: 0° or 90°, never a diagonal.
- Structure is shown, not hidden. Units on a 1080 artboard: 40 px margin, one slab column (about 300 px), 12 px structural rules and borders, 2 px hairlines. At least one construction line runs edge to edge, and one dimension line measures something (the title's height).
- Overlaps are decisive: a box covers ≥ 40 px of a letter, a letter crosses the slab by a third of its width, or there is a clear gap of ≥ 16 px. Never a near-tangent.
- Bleed hard: the slab bleeds top and bottom, the stretched word loses a third of its last letter to the edge, the acid block runs off the bottom.
- Layer order (low to high): paper; slab (ink fill + treated photo); stretched display word; 12 px rules; the giant crossing glyph with `mix-blend-mode: difference` (`.brut-xray`); construction lines (white, `difference`); mono labels and tables; the acid block; grain (`multiply`, .22).
- Nest information inside the structure: the lineup table in a letter's counter, labels on the slab, the date block pinned over a letter's foot.

## Signature moves

1. A grotesque stretched to fill a box exactly, then cropped by the frame.
2. A black slab holding a photocopied photo, bleeding top and bottom.
3. X-ray: a giant glyph crosses the slab in difference mode, black on paper and white on the slab.
4. Spec-sheet apparatus: bracketed mono labels, FIG. numbers, a dimension line with ticks, numbered tables between 2 px rules.
5. One acid block with ink text, overlapping a letter decisively.

## Don't

- Round a corner, add a shadow, a blur, a gradient or a glow.
- Put acid text or acid hairlines on paper, or use the acid twice.
- Rotate anything by an angle other than 90°.
- Use medium sizes: a 120 px headline next to 40 px subheads is a corporate flyer.
- Centre the layout, or tidy overlaps to a few pixels (it reads as a mistake, not as force).
- Mistake brutal for grungy: torn paper, drips and distressed fonts belong to punk, not here.

## Check before delivering

- Squint: the giant type and the slab are the first two reads; the acid block is the third.
- Every overlap is ≥ 40 px or a clear gap of ≥ 16 px; no tangents between a box edge and a letter edge.
- Exactly one acid element, with ink text on it (contrast about 17:1).
- All small text in the mono at ≥ 16 px; formulas and units not mangled by `uppercase`.
- The difference-blend glyph inverts only what it should: it sits above the slab and display word and below the text and the acid block.
- The cropped letter is cropped by a third, the bleeding photo by more than a few pixels, and the subject is still recognisable.

## Build

Link `../_base.css` and `tokens.css`. Helpers: `.brut-display`, `.brut-label` (18 px mono caps), `.brut-text`, `.brut-big` (34 px mono for the key fact), `.brut-box` (12 px border), `.brut-cell`, `.brut-acid`, `.brut-slab`, `.brut-rule`, `.brut-table` (numbered rows between 2 px rules, tabular figures), `.brut-xray` (turns a black SVG white and blends it with `difference`), `.brut-vline` / `.brut-hline` (construction lines; set `--x` / `--y`). The example draws its dimension line with two pseudo-element ticks and a rotated label on a paper background that breaks the line. All positions are whole pixels taken from the structure (slab edge, rule, margin), never nudged by eye.
