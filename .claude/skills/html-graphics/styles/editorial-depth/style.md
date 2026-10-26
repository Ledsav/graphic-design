---
id: editorial-depth
name: Editorial cover with depth
family: editorial
mood: [moody, cinematic, premium, intimate, serious]
fits: [magazine and zine covers, album covers, film and theatre posters, exhibition key art, portrait-led campaigns]
avoid: [loud party flyers, kids, data-heavy layouts, anything without a strong photo]
formats: [cover, poster, social post, story]
palette: { shade: "#0c1014", ink: "#e9e3d4", mid: "#3a4a50", light: "#d9d4c7" }
fonts: { display: "Fraunces 560 (opsz 144, SOFT 100, WONK 1)", text: "Instrument Sans 400/700" }
---

# Editorial cover with depth

A magazine or album cover where a moody, treated photo carries the piece and a huge decorative title sits behind the subject, so the person stands in front of their own masthead. Small columns of text, corner metadata and a barcode frame it like a printed object. It works because the depth layering makes a flat page feel physical, and the restraint of everything around the title makes the photo feel expensive.

## Palette

| Role | Hex | Use |
|---|---|---|
| shade | `#0c1014` | Background and the gradient that the title sits on |
| ink | `#e9e3d4` | Title and all type: warm off-white, never pure white |
| mid | `#3a4a50` | Duotone midtone |
| light | `#d9d4c7` | Duotone highlight |

Rules: the photo is a three-stop duotone in the palette (`treat.py duotone --colors '#0c1014,#3a4a50,#d9d4c7'`). One warm or cold cast per cover; alternatives: oxblood `#2a0c0e`/`#c9b8a6`, ink-blue `#0d1626`/`#c6d2dc`.

## Typography

- Display: an ornamental or high-contrast serif at 300–360 px on 1080 wide: Fraunces with SOFT/WONK axes, Bodoni Moda, Playfair Display, Gloock★. Tight tracking (-.03em), one word, title case or lowercase.
- Text: a plain sans (Instrument Sans★, Work Sans★) at 17–20 px for columns, 34 px bold for column heads, 16–18 px bold for corner metadata.
- A secondary line in the display face's italic (load the `ital` axis) above the title, 40–48 px.
- Drawn titles: for more presence use `lettering.cjs "Frame" --google Fraunces --weight 600 --tracking -30 --width 1000`; keep warps subtle (`arc-lower --amount .08` at most).

## Imagery

- One portrait or object with a clear head or top silhouette and directional light.
- `treat.py duotone photo.jpg -o assets/photo-duo.png --colors '#0c1014,#3a4a50,#d9d4c7'` and `treat.py cutout photo.jpg -o assets/cut.png`, then duotone the cut-out with the same colours.
- The photo and the cut-out sit in the same box (same left, top, width, height); the title goes between them.

## Texture

- Top gradient from `--shade` (8%) to transparent (40%), plus a radial vignette.
- Light rays: `repeating-conic-gradient` from the top centre, `filter: blur(14px)`, `mix-blend-mode: screen`, opacity .3–.4, masked to fade downwards.
- Grain at .6–.8 overlay (`--grain: .75`).

## Composition

- Archetype: depth sandwich. The head overlaps the lower half of two or three title letters, never so many that the word stops reading.
- Columns of text left and right at different heights, aligned to the subject (shoulder line, hand), 260 px wide.
- Corners: masthead or label top-left, issue top-right, date and price bottom-left, barcode bottom-right, all 44 px from the edge.
- Stack: photo, shade, rays, small italic line, title, cut-out, columns and meta, grain.

## Signature moves

1. The subject in front of the title.
2. A warm off-white title on a near-black duotone.
3. Light rays or a halo falling behind the head.
4. Tiny, perfectly placed metadata and a generated barcode that make it read as a real printed cover.

## Don't

- Use a photo without a clear head shape against the background; the depth trick fails.
- Hide more than half of the title.
- Add colour accents, stickers or loud shapes; the restraint is the style.
- Use a flat dark overlay over the whole photo instead of a shaped gradient.

## Check before delivering

- The title still reads at thumbnail size with the head in front of it.
- The cut-out lines up exactly with the photo (no ghost edge).
- Column text sits on calm areas of the photo with at least 4.5:1 contrast.
- Faux italic or fallback warnings from the renderer: none.

## Build

Link `../_base.css` and `tokens.css`. The example shows the photo + cut-out box (`.photo`, `.cut`), shade, rays and a deterministic barcode script.
