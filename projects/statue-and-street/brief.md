# Statue and street: two styles, three posters

## Brief
Make graphics in the two looks of the client's reference images:
1. **Halftone angel**: a halftone classical statue on flat red, a red script title, gold foil star and gold vertical lettering, tiny serif notes.
2. **Fashion masthead**: a saturated colour-wall portrait standing in front of a huge Didone masthead, with a short lowercase lesson in white sans.

Photos supplied by the client: Winged Victory of Samothrace (used for style 1) and two colour-wall portraits (green and red, used for style 2). The second angel photo (cave render) was offered as an alternative and not used.

## Deliverables
| File | Size | Use |
|---|---|---|
| `victory-poster.png` | 2480 × 3508 px (A4 ratio, 300 dpi at A4) | Poster / screen |
| `chroma-01-complementary.png` | 2400 × 3600 px (2:3) | Poster / social |
| `chroma-02-overlap.png` | 2400 × 3600 px (2:3) | Poster / social |

## Direction
**Victory.** Giant crop: the wings bleed off both edges. The gold star sits exactly where the head is missing. The script title changes ink as it crosses the statue's silhouette: red on the marble, paper white on the red ground. Greek ΝΙΚΗ ("Nike", the statue's own name) in gold runs down the corner. Ballet (title, drawn to outlines) + GFS Didot (everything else). Palette: red `#cf1b20`, paper `#f0ede6`, ink `#141414`, gold foil `#7d5a14 → #fff0b8`.

**Chroma lessons.** An original masthead, CHROMA (the reference used a real magazine's trademark, so it was not reused). Each poster's copy explains the visual idea it shows, the way the reference explains "pattern interrupt". No. 01 sets the masthead low so the stride cuts through it, with the M stepping in front of the trouser leg. No. 02 is the classic cover, with the head in front of the O. Bodoni Moda (masthead) + Outfit (copy).

## Rebuild
```bash
# angel
python3 projects/statue-and-street/tools/prep_victory.py <tmp> 0.035 0.65      # run from projects/statue-and-street
python3 ../../.claude/skills/html-graphics/scripts/treat.py halftone <tmp>/victory-tone.png -o <tmp>/victory-ht.png --width 3800 --cell 28 --angle 45 --ink '#141414' --paper '#f0ede6' --levels 0.1,0.85
#   then put <tmp>/victory-alpha.png on it as alpha -> assets/victory-halftone.png, and a 1900 px copy of the alpha -> assets/victory-mask.png
# fashion cut-outs
python3 .claude/skills/html-graphics/scripts/treat.py cutout projects/statue-and-street/src/green-wall.jpg -o <tmp>/green-cut.png   # then resize to 3600 px tall
# render (from the repo root)
node .claude/skills/html-graphics/scripts/render.cjs projects/statue-and-street/victory.html projects/statue-and-street/chroma.html --scale 2
```
`thumbs-angel.html` and `thumbs-fashion.html` hold the composition sketches that were compared before picking the layouts.
