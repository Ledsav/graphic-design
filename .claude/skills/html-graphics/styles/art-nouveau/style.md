---
id: art-nouveau
name: Art Nouveau
family: ornamental
mood: [organic, ornate, romantic, botanical, warm, nostalgic]
fits: [garden and flower shows, animal and pet shows, tea, perfume and wine, theatre and opera, book fairs, craft festivals, cafés and patisseries]
avoid: [tech launches, sport, sales that must read in one second, minimal or brutal brands, anything urgent]
formats: [poster, label, menu, book cover, invitation, packaging]
palette: { paper: "#efe4cb", ink: "#3b2a20", sage: "#9aa47f", sage-deep: "#6e7b58", ochre: "#c8933b", rose: "#cf968a", sienna: "#9c5a3c" }
fonts: { display: "Federant 400", text: "Cormorant Garamond 500/600/700, italic 500/600" }
---

# Art Nouveau

The decorative poster of the 1890s–1910s: colour lithographs in a few flat, muted inks held together by a dark contour, a figure or object framed by a circular halo or an arch, botanical ornament built from whiplash curves, and lettering drawn by hand into curved bands. Nothing is straight that could curve, and the ornament is never decoration added afterwards: stems, halos and letters are the structure of the page. It works because a single line quality (umber contours of one weight) unifies image, ornament and type into one drawing.

## Palette

| Role | Hex | Use |
|---|---|---|
| paper | `#efe4cb` | Background; warm cream, never white |
| ink | `#3b2a20` | Every contour, all small type, solid display words. 10.8:1 on paper |
| sage | `#9aa47f` | Halo discs, leaves, quiet fields behind the subject |
| sage-deep | `#6e7b58` | Display lettering fill (3.6:1 on paper, display sizes only), leaf shade |
| ochre | `#c8933b` | Halo bands, the subject's midtone; one large shape |
| rose | `#cf968a` | Flowers, a thin inner halo band. Never text (2:1) |
| sienna | `#9c5a3c` | Subject shadow tone only |

Rules: flat colour fills, every filled shape outlined in ink. Warm (ochre, sienna, rose) belongs to the subject and its halo; cool (sage) to the leaves, the ground and the title, so the two read apart. Small text only in ink. No gradients, no pure black, no saturated hues. Alternative inks that keep the logic: dusk (paper `#eadfcf`, ink `#2c2433`, sage `#8a9a9a`, ochre `#b98a4a`, rose `#b88a9e`) or autumn (sage `#7f8a5a`, ochre `#c27a2c`, rose `#b8664f`).

## Typography

- Display: Federant 400, drawn with `lettering.cjs`, never typed straight. Its long F, tapering stems and flared terminals are the period's hand-lettering. Alternatives: Macondo Swash Caps, Elsie Swash Caps, Mystery Quest (lighter, whimsical), Ribeye (heavier, for drinks), Cinzel Decorative (formal, for opera or wine).
- Split the title into two sizes: a kicker word at 360–420 px wide and a hero word at the full width (900–980 px), each on its own curve. Mixed case reads more period than caps.
- Curved bands: `--warp arch` (whole word on an arc) or `--warp arc-upper` (flat baseline, rising cap line: the shop-sign band). Hero words can smile (`--amount -.2`) to cradle a halo above them.
- Fill the hero word sage-deep with an ink outline (`--stroke '#3b2a20' --stroke-width 14`); a kicker word can be solid ink. One treatment per word.
- Text: Cormorant Garamond. Small caps tracked `.16em` at 20–22 px for labels and the ring line; 600 weight at 24 px for details; italic 600 at 26 px for a tagline. Dates can be set in Federant at 48–56 px. Nothing below 20 px: Cormorant's x-height is small.

```bash
L=.claude/skills/html-graphics/scripts/lettering.cjs
node $L "Félin" -o assets/title-felin.svg --google Federant --warp arch --amount -.22 --tracking 10 --width 960 --fill '#6e7b58' --stroke '#3b2a20' --stroke-width 14
node $L "Félin" --google Federant --list -o x.svg      # 0 F, 1 é, 2 l, 3 i, 4 n
node $L "Félin" -o assets/title-felin-front.svg --google Federant --warp arch --amount -.22 --tracking 10 --width 960 --fill '#6e7b58' --stroke '#3b2a20' --stroke-width 14 --only 3
node $L "Salon" -o assets/title-salon.svg --google Federant --warp arch --amount .45 --tracking 30 --width 400 --fill '#3b2a20'
node $L "Maison Verte" -o assets/band.svg --google Federant --warp arc-upper --amount .35 --tracking 20 --width 900 --fill '#3b2a20'
```

The `--only` copy goes in the same box above the halo, so a letter whose dot or accent would vanish under the ring steps in front of it while its neighbours tuck behind.

## Imagery

- One subject, posterized into four flat tones with ink contours, as if redrawn for the litho stone: a face (animal or person you have rights to), a flower, a bottle, a cup. Head-and-shoulders crops suit the halo.
- Prepare a greyscale cut-out at the display size, with the levels stretched to the subject's own range (find the 5th and 98th percentile of its luminance), then flatten it live with the `#nv-tones` filter from `example.html` (blur 7, luminance snapped to ink / sienna / ochre / paper, contours between tones, a 5 px keyline round the silhouette):

```bash
python3 .claude/skills/html-graphics/scripts/treat.py duotone .claude/skills/html-graphics/styles/_shared/photos/chelsea-cut.png -o assets/cat-tone.png --width 1600 --levels .25,.6 --colors '#000000,#ffffff'
```

- Tune in the filter: `stdDeviation` 4–9 (bigger = flatter, fewer specks); the ten `tableValues` steps set how much of each tone you get (the example uses ink 20%, sienna 20%, ochre 40%, paper 20% of the range). Mirror the subject (`transform: scaleX(-1)`) so it looks into the poster, at the title.
- Put the subject in a window: a circle (`.nv-halo`) or a round-topped arch (`.nv-arch`), sized so the cut-out's cropped edges fall outside it.
- Ornament is drawn, not sourced: tapered whiplash stems, opposite leaf pairs and flower spikes in inline SVG (the example's `taper`, `leafPairs` and `spike` functions place them deterministically along guide paths).

## Texture

Lithograph, not grunge: `treat.py texture paper -o assets/paper.png --size 1080x1527` over everything with `multiply` at `.55` (`.nv-paper`), then grain `--grain: .14` with `multiply`. No dust, folds, halftone or distress: the stone printed clean, flat ink.

## Composition

- Archetypes: orbit (subject in a halo, a line of text on its circumference), giant crop (the halo bleeds off one or two edges), window (arch), type as frame (kicker and hero words wrap the halo). Asymmetric: the halo's centre sits on a third, never dead centre.
- Margins: 56 px; a double-rule frame (`.nv-frame`, 4 px + 2 px, 22 px radius) inset 26 px from the trim. The halo and the stems may cross the frame; leaves and text never cross the trim.
- The whiplash: one main stem rising in an S from behind the hero word to curl under the kicker, so the eye travels kicker, halo, hero word, info. Taper it 16 to 4 px; end it in a spiral, not a cut.
- Layer order (z-index low to high): paper, frame, stems, hero word, halo bands, subject window, front letters and the ring line, kicker word and info, paper overlay (multiply .55), grain.
- Information in two clusters at the foot: date in Federant on one side, venue and details in Cormorant on the other, both 52 px from the bottom.

## Signature moves

1. The subject flattened to four inks with umber contours, framed by a halo of bands: ochre with cream beads, a thin rose ring, ink keylines.
2. A hand-drawn title on curves in two sizes, woven into the halo: some letters behind the ring, one in front.
3. A tapered whiplash stem with opposite leaf pairs and a flower spike, growing from behind the title.
4. A line of tracked small caps set on the halo's circumference.
5. A double-rule frame with rounded corners that the halo breaks.

## Don't

- Recreate a specific poster or an artist's signature figure (no long-haired woman in a mosaic halo with a Byzantine border); evoke the genre with your own subject and botany.
- Centre everything with a straight title above and info below; Art Nouveau is asymmetric and curved.
- Use hairline ornament: contours carry the style and need weight (4–10 px at 1080 wide), all the same ink.
- Add gradients, drop shadows, glows, neon or saturated hues; or a sans-serif for the small print.
- Leave a photo smooth inside a flat-colour poster, or let the cut-out's cropped edges show.
- Fill every gap with leaves. Keep one quiet cream area.

## Check before delivering

- Every display word still spells correctly: no i-dot or accent lost under the halo or a leaf.
- Contours are one weight and one colour throughout; small text is ink on paper only.
- Stems taper and end in curls or flowers, never blunt; no leaf crosses the trim.
- The subject looks into the poster, and no straight crop edge of the cut-out is visible.
- At thumbnail size: halo first, hero word second, the stem leads between them.

## Build

Link `../_base.css` and `tokens.css`. Helpers: `.nv-display`, `.nv-caps`, `.nv-text`, `.nv-italic`, `.nv-line`, `.nv-frame`, `.nv-arch`, `.nv-halo`, `.nv-rings`, `.nv-tones`, `.nv-paper`. Paste the `<svg>` with the `#nv-tones` filter and the `#leaf` symbol from `example.html` after `<body>` (filters must live in the same document). The halo bands, beads and ring line are inline SVG on the same centre; the stems are guide paths turned into tapered fills by the example's script, which is deterministic (no `Math.random`).
