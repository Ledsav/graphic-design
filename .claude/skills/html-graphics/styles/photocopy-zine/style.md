---
id: photocopy-zine
name: Photocopy zine
family: print-era
mood: [raw, literary, underground, austere, handmade]
fits: [zines, small presses, photography and art events, punk and post-punk gigs, poetry nights, indie labels]
avoid: [luxury, tech launches, kids, anything that must look polished or colourful]
formats: [poster, story, zine cover, flyer]
palette: { paper: "#e7e2d6", ink: "#141414" }
fonts: { display: "Bodoni Moda 500 (drawn) or a typewriter face", text: "Crimson Pro 600/700" }
---

# Photocopy zine

Black toner on cheap paper: a high-contrast photocopied image with grit and specks, a Didone or typewriter title, boxed notes, text set on paths, folds and dust. It comes from DIY zines and xeroxed gig flyers. It works because the one-colour limit forces strong shapes and hierarchy, and the imperfections of the copier make it feel made by hand.

## Palette

| Role | Hex | Use |
|---|---|---|
| paper | `#e7e2d6` | Background (warm grey-white, never pure white) |
| ink | `#141414` | Everything printed |

Rules: one ink. Inverted variant (paper `#111`, ink `#ece8de`) works for night events; then treat images with `--invert`. A second ink is allowed only as a hand-applied stamp (red `#c8271e`) on one small element.

## Typography

- Display: a Didone (Bodoni Moda, Playfair Display) drawn with `lettering.cjs --google "Bodoni Moda" --weight 500 --tracking -15`, or a typewriter face (Special Elite, Courier Prime) for a rougher zine.
- Text: Crimson Pro★ 600–700, 19–30 px, uppercase for labels, sentence case for notes.
- Notes live in boxes: `border: 2px solid var(--ink); padding: 22px 24px`.
- Text on paths: `<textPath>` along circles or the subject's contour, with a paper-coloured halo: `stroke="#e7e2d6" stroke-width="7" paint-order="stroke"`.
- Don't put `ink-bleed` or `distress` on Didone hairlines; they break.

## Imagery

- Subjects with strong silhouettes: people, statues, objects.
- `treat.py photocopy photo.jpg -o assets/copy.png --width 2160 --levels .1,.88 --threshold .5 --paper none --ink '#141414' --grit 1.3 --specks .6` (add `--invert` with light ink on a dark poster).
- Cut out first (`treat.py cutout`) so the grit sits on the figure only.
- `treat.py contour cut.png -o contour.svg --offset 34 --part top --round 120` for text that follows the figure.

## Texture

- Folds: `treat.py texture folds --size 1080x1920 --folds 2x3`, `mix-blend-mode: soft-light`.
- Dust: `treat.py texture dust --color '#141414'`, opacity .6.
- Grain .45 overlay.

## Composition

- Archetypes: giant crop (the figure fills the frame and bleeds), type as frame (vertical title along an edge), orbit (rings passing behind and in front of the figure).
- Header row with double rule (`border-bottom: 7px double`), boxes in the corners, the title vertical or between rules.
- Stack: paper, title (behind), figure, text paths, boxes, folds, dust, grain.

## Signature moves

1. A huge photocopied figure cropped by the frame.
2. A Didone title set vertically or between double rules, partly behind the figure.
3. Text running along the figure's outline with a paper halo.
4. Boxed notes and a quote in caps.
5. Visible folds and toner dust.

## Don't

- Use grey tones; the copier makes black or paper.
- Put a dark figure on a dark background (it disappears) — choose polarity per background.
- Over-texture: folds, dust and grain at once are enough.
- Use colour photos.

## Check before delivering

- The figure's silhouette reads at thumbnail size.
- Text on paths is legible where it crosses the figure (halo present).
- No text touches the folds' crossing points in a way that looks like damage.
- Boxes align to each other and to the header.

## Build

Link `../_base.css` and `tokens.css` (it also imports the bundled fonts for browser previews). The example shows the vertical drawn title, the contour text path and the overlay stack.
