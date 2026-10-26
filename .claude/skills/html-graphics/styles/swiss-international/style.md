---
id: swiss-international
name: Swiss International
family: modernist
mood: [rational, clean, confident, cultural, calm]
fits: [concert series, museums and exhibitions, architecture, tech and science events, annual reports, institutions]
avoid: [anything that needs warmth or nostalgia, kids, horror, party flyers that must shout]
formats: [poster, social post, programme, exhibition graphics, report cover]
palette: { paper: "#f4f2ee", ink: "#111111", signal: "#e3000f", grey: "#8c8a86" }
fonts: { display: "Schibsted Grotesk 900", text: "Schibsted Grotesk 400/500/700" }
---

# Swiss International

The International Typographic Style of 1950s–60s Switzerland: a strict modular grid, one sans-serif family, flush-left text, objective imagery or pure geometry, and a single signal colour. Order is the expression. It works because every element visibly belongs to one system, so the one thing that breaks the rhythm (a red circle, a cropped word) becomes the event.

## Palette

| Role | Hex | Use |
|---|---|---|
| paper | `#f4f2ee` | Background; never pure white on screen |
| ink | `#111111` | Type, geometry, rules |
| signal | `#e3000f` | Exactly one element or one word |
| grey | `#8c8a86` | Tertiary info only; never for body text |

Rules: one accent, used once. Alternatives that keep the logic: signal blue `#0047bb`, signal orange `#ff5a00`, or inverted (paper `#111`, ink `#f4f2ee`). No gradients, no tints.

## Typography

- One grotesque family in 2–3 weights: Schibsted Grotesk, Archivo, Hanken Grotesk, Familjen Grotesk, Work Sans★.
- Display: 900 weight, `line-height: .82`, `letter-spacing: -.045em`, often lowercase. Huge (300–500 px on a 1080 artboard), set flush left, and allowed to crop at a frame edge.
- Text: 16–22 px, 1.3–1.35 leading, flush left, ragged right. Never centred, never justified.
- Hierarchy by size and weight only: no colour coding, no underlines, no boxes.
- Lettering: no warps or drips. "Drawn" here means scale, tight tracking, cropping and rotation by 90° on the grid. If a title needs fitting, use `lettering.cjs --tracking -40 --width <grid width>` with no effects.

## Imagery

- Pure geometry carrying the idea: circles, bars, grids, arcs whose sizes encode something (rhythm, data, growth).
- Or objective black-and-white photography, cropped hard to the grid: `treat.py duotone in.jpg -o out.png --colors '#111111,#f4f2ee'`, or grayscale with `filter: grayscale(1) contrast(1.15)`.
- No illustration, no textures inside images.

## Texture

Almost none. `--grain: .12` with `multiply` to suggest offset paper. No paper, dust or folds.

## Composition

- Archetypes: word stack, asymmetric split, type as frame. Diagonal only if the whole grid rotates (15° or 30°, everything on the rotated axes).
- Grid: 6 columns on 1080 px (margin 60, gutter 20), 12 px baseline. Every left edge, top edge and rule lands on the grid; `.swiss-grid-guide` shows it while previewing.
- Layering: background, geometry or photo, display type, small type. Rarely more.
- Big white space is a shape: leave one large quiet area.

## Signature moves

1. A systematic figure (matrix, bars, concentric arcs) that encodes the content, with one element in the signal colour.
2. A gigantic lowercase or numeric title cropped by the frame edge.
3. Information in tight flush-left blocks aligned to column edges, separated by 2–3 px rules.
4. Extreme scale contrast: 470 px display against 16 px text.

## Don't

- Centre anything.
- Use a second accent colour, a gradient, a drop shadow or a texture overlay.
- Mix type families or add a serif "for warmth".
- Place elements off the grid "by eye".
- Use Helvetica-alike defaults with no tension: the grid needs one decisive break.

## Check before delivering

- Turn on the grid guide (`render.cjs --guides`): every edge sits on a column or baseline.
- Exactly one signal-coloured element.
- All text flush left; no orphans in the small blocks.
- The thumbnail still reads: the figure and the title are the two things you see.

## Build

Link `../_base.css` and `tokens.css`. Helpers: `.swiss-display`, `.swiss-head`, `.swiss-text`, `.swiss-small`, `.swiss-signal`, `.swiss-grid` (a 6-column CSS grid inside the margins), `.swiss-grid-guide`. The example builds its rhythm matrix with a few lines of JS; any generated figure should be deterministic (no `Math.random`).
