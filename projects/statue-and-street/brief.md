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
**Victory.** Giant crop: the wings bleed off both edges. Solemn, not playful: a thin eight-point gold-foil star sits top right, its lower ray catching the wingtip like a point of light. Title: a calligraphic V (Imperial Script) with Didot capitals (GFS Didot). It is red on the marble and turns paper white where the V's loop leaves the statue. Gold ΣΑΜΟΘΡΑΚΗ (Samothrace) runs down the top-left corner beside a museum-style caption. The line beside the title, "the moment of landing, held in marble for twenty-two centuries", refers to what the statue depicts: Nike alighting on a ship's prow. Palette: red `#cf1b20`, paper `#f0ede6`, ink `#141414`, gold foil (`tools/make_gold.py`).

Revision 2: removed the star-as-head, the "lost / kept" quip and ΝΙΚΗ (reads as a sports brand). Those made the first version feel like a joke.

**Chroma lessons.** An original masthead, CHROMA (the reference used a real magazine's trademark, so it was not reused). Each poster's copy explains the visual idea it shows, the way the reference explains "pattern interrupt". No. 01 sets the masthead low so the stride cuts through it, with the M stepping in front of the trouser leg. No. 02 is the classic cover, with the head in front of the O. Bodoni Moda (masthead) + Outfit (copy).

## Rebuild
```bash
# angel
python3 projects/statue-and-street/tools/prep_victory.py <tmp> 0.035 0.65      # run from projects/statue-and-street
python3 ../../.claude/skills/html-graphics/scripts/treat.py halftone <tmp>/victory-tone.png -o <tmp>/victory-ht.png --width 3800 --cell 28 --angle 45 --ink '#141414' --paper '#f0ede6' --levels 0.1,0.85
#   then put <tmp>/victory-alpha.png on it as alpha -> assets/victory-halftone.png, and a 1900 px copy of the alpha -> assets/victory-mask.png
# fashion cut-outs
python3 .claude/skills/html-graphics/scripts/treat.py cutout projects/statue-and-street/src/green-wall.jpg -o <tmp>/green-cut.png   # then resize to 3600 px tall
python3 tools/make_gold.py                                                     # foil texture + star mask
# render (from the repo root)
node .claude/skills/html-graphics/scripts/render.cjs projects/statue-and-street/victory.html projects/statue-and-street/chroma.html --scale 2
```
`thumbs-angel.html` and `thumbs-fashion.html` hold the composition sketches that were compared before picking the layouts.
