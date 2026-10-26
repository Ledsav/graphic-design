# Worked examples

Five original posters built with this skill, one per recipe in `references/poster-styles.md`. Read them for technique; don't reuse their compositions, palettes or copy. The event names, venues and people listed are invented.

| File | Recipe | Techniques shown |
|---|---|---|
| `exposure.html` | Photocopy / xerox zine | photocopy treatment of a cut-out, Didone title fitted between double rules, text on a circle with a paper halo, orbit lines passing behind and in front of the subject, fold, dust and grain overlays |
| `liftoff.html` | Cut-out sticker over giant type | rembg cut-out with the `#sticker` filter, two words each fitted to the width, `#speckle` print texture, wobbly contour background, bottom info band |
| `senal.html` | Halftone and torn paper | inverted halftone of a cut-out flattened on black, torn edges with a paper rim, tape, blackletter with `#rough` + `#distress`, paper, grunge and dust |
| `frame.html` | Editorial cover with depth | photo and cut-out in the same box with the title between them, light rays, duotone, small columns, generated barcode |
| `lowend.html` | Riso two-ink | flat two-ink design with multiply overlaps and wobble/rough filters, printed afterwards with `treat.py riso` |

`previews/` has the rendered results. To render them yourself, from the repo root:

```bash
node .claude/skills/html-graphics/scripts/render.cjs .claude/skills/html-graphics/examples/*.html --sheet
python3 .claude/skills/html-graphics/scripts/treat.py riso .claude/skills/html-graphics/examples/export/lowend-flat.png \
  -o .claude/skills/html-graphics/examples/export/lowend-riso.png --inks '#e8412c,#2f4b7c' --paper '#f1ece2'
```

The remaining renderer warnings are deliberate (titles fitted edge to edge inside the safe margin, a tightly stacked title).

## Image credits

Source photos come from the sample data shipped with [scikit-image](https://scikit-image.org):

- `astronaut`: Eileen Collins, NASA. Public domain.
- `camera`: Lav Varshney. CC0.

Assets in `assets/` were made from them with `scripts/treat.py` (cutout, photocopy, duotone, halftone, torn) and its procedural textures.
