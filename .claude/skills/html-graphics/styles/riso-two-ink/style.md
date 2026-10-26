---
id: riso-two-ink
name: Riso two-ink
family: print-era
mood: [indie, warm, grainy, playful, underground]
fits: [club nights, techno and experimental music, zines, small festivals, bookshops, indie brands]
avoid: [luxury, corporate, photo-realistic products, anything needing exact brand colours]
formats: [poster, social post, flyer, zine cover]
palette: { paper: "#f1ece2", ink-1: "#e8412c", ink-2: "#2f4b7c" }
fonts: { display: "Unbounded 900", text: "Unbounded 500/700" }
post: "treat.py riso {in} -o {out} --inks '#e8412c,#2f4b7c' --paper '#f1ece2'"
---

# Riso two-ink

Risograph printing: two flat soy inks on off-white paper, overlaps that darken, grain in every flat area and a slight misregistration between the colours. It comes from small-press zines and club flyers. It works because two inks force graphic decisions, and the grain and overprint make even simple shapes feel tactile and alive.

## Palette

| Role | Hex | Use |
|---|---|---|
| paper | `#f1ece2` | Background |
| ink-1 | `#e8412c` | Shapes and accents |
| ink-2 | `#2f4b7c` | Type and line work |

Rules: exactly two inks plus paper. Overlaps use `mix-blend-mode: multiply` in the HTML so they show as they will print. Real riso ink pairs: fluorescent pink `#ff48b0` + blue `#0078bf`; yellow `#ffe800` + teal `#00838a`; red `#ff665e` + purple `#765ba7`; any ink + black.

## Typography

- Display: a wide or heavy grotesk (Unbounded 900, Dela Gothic One, Krona One, Archivo with `wdth` 125), drawn and repeated with `lettering.cjs`:
  - solid: `--google Unbounded --weight 900 --tracking -30 --width 980 --fill '#2f4b7c'`
  - echo copies: add `--warp wave --amount .11–.55 --freq 1.6 --fill none --stroke '#2f4b7c' --stroke-width 10` (hollow outlines are masked clean)
- Text: the same family at 500–700, 26–30 px; labels in caps.
- Vertical side text with `writing-mode: vertical-rl`.

## Imagery

- Flat shapes rather than photos: blobs (8-value `border-radius`) with `url(#wobble)`, concentric rings (`repeating-radial-gradient`) with `url(#rough)`.
- A photo can be printed in two inks: `treat.py riso photo.jpg -o out.png --inks ... --split luma`.

## Texture

- None in the HTML; the `post` step adds grain, uneven drum ink and misregistration: `treat.py riso flat.png -o riso.png --inks '#e8412c,#2f4b7c' --paper '#f1ece2'` (`--grain`, `--offset dx,dy` to tune).

## Composition

- Archetypes: echo (the title repeated and distorted), orbit, type as frame.
- A big shape bleeding off one edge in ink-1, type in ink-2 crossing it.
- Stack: paper, ink-1 shapes, ink-2 type (multiply), small info.

## Signature moves

1. Overprint: where blue type crosses red shapes, a dark third colour appears.
2. The title echoed and bent by a wave.
3. Heavy grain and a few pixels of misregistration (from the post step).
4. One giant organic or circular shape bleeding off the frame.

## Don't

- Use a third colour, gradients or soft shadows (riso can't print them).
- Design on pure white paper.
- Put small text in ink-1 over ink-1 shapes.
- Skip the post step: the flat render alone looks like vector clip art.

## Check before delivering

- Render, then run the `post` command, and review the riso PNG, not the flat one.
- Small text stays legible after grain (≥ 26 px).
- Overlaps read as intentional, not muddy.

## Build

Link `../_base.css` and `tokens.css`. Render, then apply `post`. `scripts/previews.py` runs the post step automatically for the catalog preview.
