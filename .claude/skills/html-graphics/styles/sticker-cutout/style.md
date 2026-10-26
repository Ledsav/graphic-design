---
id: sticker-cutout
name: Sticker cut-out
family: pop
mood: [bold, playful, confident, social, loud]
fits: [club and party nights, DJ lineups, festivals, fashion drops, social campaigns, sports]
avoid: [funerals, finance, quiet cultural events, anything without a person or object to cut out]
formats: [social post, poster, story, flyer]
palette: { base: "#c3161c", deep: "#9e0f14", cream: "#f4e6cc" }
fonts: { display: "Bagel Fat One (drawn)", text: "Instrument Sans 500/700" }
---

# Sticker cut-out

A saturated background, two words of chunky display type drawn huge, and a cut-out person or object with a white die-cut border breaking through the title, with one letter wrapping in front. Information in the same display face, in tight clusters. It comes from party flyers and streetwear drops. It works because the sticker border makes the subject pop off the page and the interlocking type gives instant depth.

## Palette

| Role | Hex | Use |
|---|---|---|
| base | `#c3161c` | Background |
| deep | `#9e0f14` | Contour rings, extrusion, shadows |
| cream | `#f4e6cc` | Title, info, badge |

Rules: one saturated base, its darker shade, and cream. Alternatives: cobalt `#1d3fd1`/`#142c99`/`#f4e6cc`; hot pink `#ff3d8b`/`#c41a63`/`#fff1d6`; lime `#b8f02a`/`#7fae0e`/`#1a1a1a`.

## Typography

- Display: chunky rounded or soft faces (Bagel Fat One, Bowlby One, Lilita One, Titan One, Shrikhand), drawn as a justified stack with a rise and an extrusion:
  `lettering.cjs "LIFT|OFF" --google "Bagel Fat One" --align justify --leading .78 --tracking -20 --warp rise --amount .14 --extrude 22 --extrude-angle 115 --extrude-color '#7a0b10' --fill '#f4e6cc' --width 1000`
- Front letter: the same command with `--only <index>` (from `--list`) for a copy laid over the cut-out.
- Text: date in the display face 54 px; secondary info Instrument Sans★ 700 at 22–26 px; a vertical kicker along one edge.
- `filter: url(#speckle)` on the title for a printed fill.

## Imagery

- A person or object cut out cleanly: `treat.py cutout photo.jpg -o assets/cut.png` (rembg).
- Border: CSS `filter: url(#sticker) drop-shadow(0 18px 30px rgb(60 0 0 / .5))`, or `treat.py outline cut.png -o sticker.png --size 18`.
- Keep the face clear of front letters.

## Texture

- Contour rings: `repeating-radial-gradient` in `--deep` at .45 opacity with `url(#wobble)`.
- A dot pattern faded by a mask (`radial-gradient` dots, 9 px), .18 opacity.
- Grain .55 overlay.
- A bottom band (gradient to `--base`) so the info never sits on the busy photo.

## Composition

- Archetype: depth sandwich with interlocking (one letter in front of the subject, the head in front of another).
- The title fills the top 60%; the subject is large, cropped at the bottom, slightly off-centre.
- A rotated circular badge (text on a circle) as a counterweight.
- Info in two clusters at the bottom corners.
- Stack: base, contours, dots, title, cut-out, front letter, kicker, badge, band, info, grain.

## Signature moves

1. The white die-cut border.
2. One letter wrapping in front of the subject.
3. A drawn, extruded title rising across the frame.
4. A rotated badge with text on a circle.

## Don't

- Let a front letter cover the face.
- Centre the subject exactly under a centred title (the default stack).
- Put info text over the photo without a band.
- Use photos with hair or edges rembg can't separate cleanly without checking the border.

## Check before delivering

- The interlock reads: one letter in front, one behind, both legible.
- The sticker border has no halo or gaps at thumbnail size.
- Image resolution: the cut-out isn't upscaled more than 1.2×.

## Build

Link `../_base.css` and `tokens.css`; paste `templates/filters.html` for `#sticker`, `#speckle` and `#wobble`. `thumbnails.html` in this folder shows the composition step for this example (five layouts compared before choosing the depth sandwich).
