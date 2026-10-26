---
id: psychedelic-60s
name: Psychedelic 60s
family: pop
mood: [hypnotic, liquid, loud, euphoric, dense]
fits: [concerts and dance nights, festivals, record and tape releases, light shows, art openings, record and vintage fairs, craft drink labels]
avoid: [corporate, healthcare and finance, anything that must be read at a glance from a distance, minimal luxury, children's safety messaging]
formats: [poster, album cover, social post, gig flyer, festival lineup]
palette: { ink: "#2a0b3d", cream: "#ffeec2", orange: "#ff5e1a", blue: "#4b8bff", magenta: "#e8178a", green: "#16934a" }
fonts: { display: "Gajraj One 400", alt-display: "Fascinate 400", text: "Righteous 400" }
---

# Psychedelic 60s

The mid-to-late-1960s dance-concert poster: lettering that swells and bends until it fills a shape and the whole frame, complementary colours of equal value that vibrate where they meet, concentric and radial op-art fields, Art Nouveau ornament, and a central figure or face flattened into a few inks. It works because it reverses the usual priorities: the poster is something to stare at first and read second, so the title can be tested hard as long as one clear outline keeps it legible, and the image, type and pattern melt into one surface.

## Palette

| Role | Hex | Use |
|---|---|---|
| ink | `#2a0b3d` | Frame band, every title outline, pupils, the darkest poster tone. Never pure black |
| cream | `#ffeec2` | Title face, image highlights, all small type on ink |
| orange | `#ff5e1a` | Pair A, warm side: ring fields, a poster tone |
| blue | `#4b8bff` | Pair A, cool side. Same value as orange (luminance .27 vs .29), so the pair vibrates |
| magenta | `#e8178a` | Pair B, warm side: second poster tone, iris rays, one accent |
| green | `#16934a` | Pair B, cool side (luminance .22 vs magenta .20). Accents only |

Rules:
- One vibrating pair carries the poster (the field); the second pair appears once, small (irises, a ribbon, a ring of rays).
- Vibrating pairs go only where nothing has to be read: fields, counters, irises, borders. Anything read is cream on ink (15:1) or ink on cream, or gets an ink outline at least 10 px wide.
- Ink is the only dark. Four or five inks plus cream in total, like a real offset or screen run.
- Alternative pairs at equal value: red `#f0412e` / cyan `#008f9c` (.23 / .22), or swap the ground to magenta with green rings. Check new pairs: luminance within 0.03 of each other.

## Typography

- Display: **Gajraj One** (flared, nouveau-ish, swells well). Alternatives: **Fascinate** (tall, high-contrast, Art Nouveau), **Berkshire Swash** (swash capitals), **Bagel Fat One** (blobby, when the brief is more cartoon). **Monoton** only as an op-art echo line, never the main title. Kablammo reads cartoon, not 60s. Rubik Puddles crashes `lettering.cjs` (opentype.js can't parse its substitutions); set it as HTML text if you need it.
- The title is always drawn, never typed: letters touching (`--tracking -40` to `-60`), justified lines, tight leading (`.72–.8`), bent into a shape. On a 1080 artboard it spans 900–1060 px.
- Text: **Righteous** 400, caps, `letter-spacing: .12–.16em`, 18–24 px. Badge numerals in the display face at 90–120 px. Nothing smaller than 18 px; vertical frame text 20–22 px.
- Lettering presets (`L=.claude/skills/html-graphics/scripts/lettering.cjs`, paint flags `--fill '#ffeec2' --stroke '#2a0b3d' --stroke-width 22`):

```bash
# Grin / smile under a face (the example): the block bent round a circle below
node $L "NINE|LIVES" -o assets/title.svg --google "Gajraj One" --align justify --leading .74 --tracking -50 --warp arch --amount -.3 --width 1040 <paint>
# Swollen block that fills a lens or a balloon shape
node $L "WORD|WORD" -o assets/title.svg --google "Gajraj One" --align justify --leading .78 --tracking -45 --warp bulge --amount .42 --width 1000 <paint>
# Squashed into a band (fills a width and a height exactly)
node $L "WORD|WORD" -o assets/title.svg --google "Fascinate" --align justify --tracking -40 --warp bulge --amount .4 --width 1000 --height 640 <paint>
# Liquid single line
node $L "WORD WORD" -o assets/title.svg --google "Gajraj One" --tracking -40 --warp wave --amount .45 --freq 1.5 --width 1500 <paint>
# Medallion: two runs that close a circle round an image
node $L "TOP" -o assets/top.svg --google "Gajraj One" --tracking -40 --warp arch --amount .32 --width 900 <paint>
node $L "BOTTOM" -o assets/bottom.svg --google "Gajraj One" --tracking -40 --warp arch --amount -.32 --width 900 <paint>
```

## Imagery

- A single figure or face, flattened into the palette: an animal, a portrait, a hand, an eye, a flower. The shared `chelsea-cut.png` (cat) or `astronaut-cut.png` work; so does no photo at all (pattern plus lettering).
- Posterize to the palette in two steps. First a grey, contrast-set file at the final display size:
  `python3 .claude/skills/html-graphics/scripts/treat.py duotone in-cut.png -o assets/x-grey.png --width <display px> --colors '#000000,#ffffff' --levels .2,.62`
  Then `class="psy-poster"` (the `#psy-poster` filter, in Build) maps four luminance bands to ink, magenta, orange and cream, smooths them with a 5 px blur and cuts a crisp edge. Pick `--levels` so each band gets 15–35% of the subject (the 10th and 90th luminance percentiles near .2 and .85); with no cream band the face goes muddy.
- Redraw the one feature that matters on top of the photo: eyes as `.psy-rays` irises with slit or spiral pupils, a mouth, a third eye. That is what turns a filtered photo into a drawing.
- A cut-out that is cropped by its photo (chin, shoulders) must bleed off the frame or end under the title. Where neither works, clip it with a `clip-path: path()` curve concentric with the title so the edge looks drawn.

## Texture

Flat inks, printed. Paper first, then grain:

1. `treat.py texture paper -o assets/paper.png --size 1080x1527` as `.overlay` with `mix-blend-mode: multiply; opacity: .7` (z 80). It warms the cream and mottles the ink band slightly.
2. `.grain` with `--grain: .28`, `overlay` (z 90).

No grunge, dust, folds or halftone: this was offset and screen print on good stock, not photocopy.

## Composition

- Archetypes: **giant crop** (a face filling the frame, title in front of it, the example), **orbit / medallion** (image in a circle window, lettering arched over and under, rings radiating from the centre), **word stack** (lettering swollen to fill the whole frame, figure tucked into a gap), **type as frame** (the small print running round an ornamental border). Never a straight title over a boxed image.
- Fill the frame: horror vacui is the style. There is no quiet area; one focal point (the eyes, the title) and everything else as pattern.
- Ring fields radiate from a meaningful point (the nose, a pupil, a mouth), never the artboard centre by default. `.psy-rings` with `--cx/--cy`, `--ring: 20–28px`, plus `.psy-melt` on an element inset by `-80px` so the displaced edges never show.
- Frame: ink band 60 px at the sides, 80 top, 96 bottom on 1080 × 1527, with a scalloped inner edge (`.psy-scallop-x/-y`, 34 px scallops) and small cream stars in the corners. Small print runs round it: venue top, address and URL bottom, lineups up the sides (left reads bottom-to-top, right top-to-bottom). Set `--safe: 16px` so the band text doesn't warn.
- Layer order (z): field 1, posterized figure 2, redrawn features 3, title 4, badge 5, frame band and scallops 6, frame text and ornaments 7, paper 80, grain 90.

## Signature moves

1. Lettering bent into the shape of something in the image (a grin, a halo, a balloon) and filling it edge to edge, letters touching, one thick ink outline.
2. An equal-value complementary op-art field (orange/blue rings) that vibrates behind everything, melted with a slow displacement.
3. A face posterized to four inks, with its eyes redrawn as hypnotic rays in the second pair.
4. An ink border with a scalloped inner edge carrying all the small print, plus a scalloped flower badge for the date.

## Don't

- Use rainbow gradients, neon glow or tie-dye clip art: that is a 90s revival, not the 60s.
- Set the title in a straight line, or let it sit on the vibrating field without an outline.
- Put small type on the rings or on the posterized face. It goes on ink or cream only.
- Centre the ring field on the artboard out of habit, or let a photo's crop edge show as a straight line.
- Use more than one vibrating pair at full strength; two fields fight and nothing reads.
- Copy a specific historical poster's lettering or layout; take the moves, not the piece.

## Check before delivering

- Squint at the thumbnail: the face and the title read in that order, and the title is legible at 200 px wide.
- Every word that matters has an ink outline or sits on ink or cream; no text over the field or the figure.
- The vibrating pair is within 0.03 luminance; small print contrast is 15:1 (cream on ink).
- No straight crop edge of a cut-out is visible; the ring centre sits on a feature.
- The posterized figure has all four bands (look for cream highlights) and no speckle noise (raise the filter blur to 5–6 if it has).

## Build

Link `../_base.css` and `tokens.css`. Helpers: `.psy-rings` (concentric field; `--cx`, `--cy`, `--ring`, `--ring-a`, `--ring-b`), `.psy-rays` (repeating-conic rays in the second pair), `.psy-poster` and `.psy-melt` (filters below), `.psy-display`, `.psy-label` (caps frame text), `.psy-text`, `.psy-scallop-x` / `.psy-scallop-y` (scalloped edge strips; rotate 180° for the bottom and right).

Paste these filters once after `<body>` (Chrome won't read filters from another file). Change the four `tableValues` columns if you change the palette: each column is one ink's R, G or B from dark to light.

```html
<svg width="0" height="0" style="position:absolute" aria-hidden="true"><defs>
  <filter id="psy-poster" x="0" y="0" width="100%" height="100%" color-interpolation-filters="sRGB">
    <feGaussianBlur in="SourceGraphic" stdDeviation="5" result="soft"/>
    <feColorMatrix in="soft" type="matrix" values=".2126 .7152 .0722 0 0  .2126 .7152 .0722 0 0  .2126 .7152 .0722 0 0  0 0 0 0 1" result="lum"/>
    <feComponentTransfer in="lum" result="flat">
      <feFuncR type="discrete" tableValues=".165 .910 1 1"/>
      <feFuncG type="discrete" tableValues=".043 .090 .369 .933"/>
      <feFuncB type="discrete" tableValues=".239 .541 .102 .761"/>
    </feComponentTransfer>
    <feGaussianBlur in="SourceAlpha" stdDeviation="5" result="ab"/>
    <feComponentTransfer in="ab" result="edge"><feFuncA type="discrete" tableValues="0 1"/></feComponentTransfer>
    <feComposite in="flat" in2="edge" operator="in"/>
  </filter>
  <filter id="psy-melt" x="-5%" y="-5%" width="110%" height="110%" color-interpolation-filters="sRGB">
    <feTurbulence type="fractalNoise" baseFrequency="0.0035" numOctaves="2" seed="3" result="n"/>
    <feDisplacementMap in="SourceGraphic" in2="n" scale="70" xChannelSelector="R" yChannelSelector="G"/>
  </filter>
</defs></svg>
```

The example draws its badge flower with a few lines of deterministic JS (16 arcs on a circle); any generated ornament should be deterministic too.
