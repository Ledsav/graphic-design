# Worked examples

Original posters built with this skill. Read them for technique; don't reuse their compositions, palettes or copy. The events, venues, people and acts are invented.

| File | Composition | Type | Techniques shown |
|---|---|---|---|
| `liftoff.html` | Depth sandwich with interlocking | Drawn: justified stack, rise warp, extrusion, speckle | Title behind the cut-out with one letter (`--only`) in front; sticker border; vertical kicker; badge with text on a circle; info in two clusters |
| `liftoff-thumbs.html` | Five composition thumbnails for the same poster | | The thumbnail step: sandwich, giant crop, diagonal, echo, frame, rendered with `--scale 0.5 --sheet` |
| `exposure.html` | Giant crop | Vertical Didone title behind the tripod; text along the silhouette | `treat.py photocopy`, `treat.py contour` + `<textPath>` with a paper halo, boxed notes, folds and dust |
| `senal.html` | Diagonal collage | Western display with drips and a paper-coloured outline so it reads over the photo | Torn halftone photo tilted against the title, taped paper scrap (filter on the background only), date running up the edge |
| `lowend.html` | Echo | Title repeated six times, each bent further by a wave; hollow outlines | Flat two-ink design with multiply, printed with `treat.py riso` |
| `monster.html` | Type-led | Arched, dripping, outlined title with glow; date on a smile curve | Halftone moon, rough-edged bats, ribbon banner, graveyard silhouette with rim light |
| `frame.html` | Depth sandwich | Fraunces with SOFT/WONK axes | Photo and cut-out in the same box, light rays, duotone, generated barcode |

`previews/` has the rendered results. To render them yourself, from the repo root:

```bash
node .claude/skills/html-graphics/scripts/render.cjs .claude/skills/html-graphics/examples/*.html --sheet
python3 .claude/skills/html-graphics/scripts/treat.py riso .claude/skills/html-graphics/examples/export/lowend-flat.png \
  -o .claude/skills/html-graphics/examples/export/lowend-riso.png --inks '#e8412c,#2f4b7c' --paper '#f1ece2'
```

The titles in `assets/*.svg` were drawn with `scripts/lettering.cjs`; the commands are in each section of `references/type-and-composition.md`. The remaining renderer warnings are expected: the sample photos are small (512 px originals), and two small labels sit just inside the safe margin.

## Image credits

Source photos come from the sample data shipped with [scikit-image](https://scikit-image.org):

- `astronaut`: Eileen Collins, NASA. Public domain.
- `camera`: Lav Varshney. CC0.

Assets in `assets/` were made from them with `scripts/treat.py` (cutout, photocopy, duotone, halftone, torn, contour) and its procedural textures.
