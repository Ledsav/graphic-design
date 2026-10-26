# Type and composition

The difference between a generated-looking poster and a designed one is mostly here. Fonts used as-is, set in straight centred lines, stacked title / image / info, read as a template however good the image is. Designers draw the type, weave it into the image, and build compositions with tension.

## The default to beat

Before building, write down the layout you would produce without thinking. It is usually:

```
+-----------------+
|   CENTRED TITLE |   one font, one size, straight baseline
|  +-----------+  |
|  |   image   |  |   image in a rectangle, centred
|  +-----------+  |
|  date    venue  |   info row at the bottom
+-----------------+
```

Then don't make that. Every poster should do at least three of the moves below, and the title should never be plain font output in a straight centred line unless that austerity is the idea.

## Process: thumbnails first

Designers decide the composition small and fast, before details.

1. Build 4–6 composition variants as separate artboards in one HTML file: real image (or its cut-out), real title, nothing else. No textures, no small print. Each must use a different archetype from the list below.
2. `render.cjs file.html --scale 0.35 --sheet` and look at the sheet. Squint: which one has a clear focal point, real scale contrast and tension?
3. Develop the strongest one (or two) to full detail. Keep the losers in the file for the user to see if they ask for options.

## Composition archetypes

| Archetype | Sketch | Notes |
|---|---|---|
| **Depth sandwich** | title behind, subject in front, small type on top | Photo and cut-out in the same box; some letters can come in front too (interlocking, below). |
| **Giant crop** | subject fills 80–120% of the frame and bleeds off two edges | Type tucks into the negative space, following the subject's contour. The crop is the idea: crop tighter than feels safe. |
| **Type as frame** | words run along all four edges, image in the middle | Vertical type on the sides, the title across the top or bottom, corners hold the meta. |
| **Diagonal** | title on a -6° to -15° axis across the subject | Everything secondary aligns to the same axis or to the frame, never to a third angle. |
| **Word stack** | 2–4 words justified to the full width, each its own size | The stack is the image; a photo sits inside the letters (mask) or a cut-out breaks through it. |
| **Asymmetric split** | image bleeds on one side (60–70%), a narrow type column on the other | Column aligned hard to one edge; huge title rotated 90° along the image edge. |
| **Orbit** | subject centred, type on circles and ellipses around it | Rings pass behind and in front of the subject; text on a path follows the silhouette (`treat.py contour`). |
| **Collage** | torn scraps, two or three photos, labels, tape, overlapping at angles | One anchor element keeps order; everything else is subordinate and rotated 2–8°. |
| **Echo** | the title repeated 3–6 times: solid, outline, fading, offset | Rave and techno posters; works with a single strong image or none. |
| **Window** | image seen through a shape: arch, circle, the letters themselves | Shapes cut with `clip-path` or masks; the lettering SVG works as a mask. |

### Principles

- **Scale contrast.** The biggest type should be 10–30× the smallest. Medium sizes flatten a poster; use giant and small, with little in between.
- **One dominant.** Image or title wins, not both. The other supports it at roughly half the visual weight; everything else is small.
- **Break the frame.** At least one thing bleeds off an edge: the subject, a letter, a shape.
- **Asymmetry with balance.** Off-centre focal point (thirds, or hard against an edge), balanced by a small heavy element on the opposite side.
- **Align to the subject, not just the page.** Small type sits against the edge of the big title or follows the line of a shoulder. That's what makes it look designed rather than placed.
- **Cluster the information.** Group the small print into 1–3 tight clusters (date and time; venue and address; lineup). Scattered labels read as noise.
- **Use the subject's direction.** Gaze, gesture and the line of the body point at the title or into the frame, never out of it.
- **Negative space is a shape.** Leave one big quiet area; don't fill every gap with texture or labels.

## Expressive typography

### Draw the title: `scripts/lettering.cjs`

Turns text into real glyph outlines (Google Fonts or a local file) and reshapes them, outputting an SVG.

```bash
L=.claude/skills/html-graphics/scripts/lettering.cjs
node $L "JAZZ" -o title.svg --google "Bowlby One" --warp bulge --amount .35 --jitter .5 --extrude 26 --extrude-color '#5a1033' --fill '#ef5a24' --width 900
node $L "COSTA|FANTASMA" -o title.svg --google Sancreek --align justify --leading .82 --drip .7 --width 900
node $L "HALLOWEEN|PARTY" -o title.svg --google Creepster --align justify --warp arch --amount .22 --drip .6 --fill '#ff2b2b' --stroke '#1a0000' --stroke-width 14 --width 900
node $L "SOUND|BEYOND|THE|ORDINARY" -o title.svg --google "Lilita One" --align justify --jitter .7 --stroke '#2a0a1a' --stroke-width 8 --stroke2 '#f6e7c8' --stroke2-width 26 --width 600
node $L "GIRLS|NIGHT" -o title.svg --google "Bagel Fat One" --align justify --tracking -30 --width 900 --height 600
```

| Move | Flags | Reads as |
|---|---|---|
| Arch / rainbow | `--warp arch --amount .2` (negative for a smile) | Circus, western, team, vintage badge |
| Bulge | `--warp bulge --amount .35` | Jazz, retro, cartoon, swollen sound |
| Arc top or bottom only | `--warp arc-upper` / `arc-lower` | Vintage signage, labels |
| Wave | `--warp wave --amount .3 --freq 1.5` | Psychedelic, liquid, flag |
| Rise | `--warp rise --amount .25` | Motion, energy, sports |
| Perspective | `--warp perspective --amount .35` | Monumental, receding, cinematic |
| Hand-lettered bounce | `--jitter .4–.8` | Hand-painted, playful, zine |
| Drips | `--drip .5–.8` | Horror, paint, melt, punk |
| 3D block | `--extrude 20 --extrude-angle 120 --extrude-color` | Sign painting, retro, pop |
| Double outline | `--stroke` + `--stroke2` | Sign painting, stickers, sports |
| Stretch | `--width` and `--height` together | Condensed tower type, squashed wide type |
| Justified stack | `"A|B|C" --align justify` | Gig posters; each word its own size |

Place the SVG with `<img src="title.svg">` (or inline it to style it with CSS). Combine with the filters (`#rough`, `#distress`, `#speckle`) on the `<img>` for print texture.

**Letters in front of the subject (interlocking).** Render the title twice: the full title behind the cut-out, and a copy with `--only` (letter indexes from `--list`) on top, in the same position and size.

```bash
node $L "LIFT|OFF" --google "Bowlby One" --list -o x.svg              # 0 L, 1 I, 2 F, 3 T, 4 O, 5 F, 6 F
node $L "LIFT|OFF" -o title.svg       --google "Bowlby One" --align justify --width 990
node $L "LIFT|OFF" -o title-front.svg --google "Bowlby One" --align justify --width 990 --only 4,6
```

**Photo inside the letters.** Use the lettering SVG as a mask: `mask: url(title.svg) center / contain no-repeat;` on a div with the photo as its background.

### Per-letter control in HTML

Split a word into spans and give each letter its own size, lift, rotation or colour. CSS `sin()` gives an organic rhythm without hand-placing each letter.

```html
<h1 class="bouncy" data-split>Groove Hall</h1>
<script>
for (const el of document.querySelectorAll('[data-split]')) {
  el.innerHTML = [...el.textContent].map((c, i) => c === ' ' ? ' ' : `<span style="--i:${i}">${c}</span>`).join('');
}
</script>
<style>
.bouncy span { display: inline-block;
  transform: translateY(calc(sin(var(--i) * 1.3rad) * 18px)) rotate(calc(sin(var(--i) * 2.1rad) * 7deg));
  font-size: calc(1em + sin(var(--i) * 0.9rad) * .18em); }
</style>
```

For interlocking with a cut-out using HTML text: the title must not create a stacking context (no `filter`, `opacity`, `transform` or `z-index` on the title element itself). Then give individual spans `position: relative; z-index` above the cut-out's and the rest below it. Apply filters per span if needed.

### Type around the image

- **Wrap body copy around the silhouette:** float the cut-out with `shape-outside: url(assets/subject.png); shape-image-threshold: .5; shape-margin: 24px;`. The renderer allows local images for this.
- **Text along the figure:** `treat.py contour subject.png -o contour.svg --offset 30 --part top --round 80` traces the silhouette. Put its path `d` in an inline SVG with the same `viewBox`, laid over the image box, with `<textPath href="#c" startOffset="50%" text-anchor="middle">`. Set `overflow: visible` on that svg.
- **Rings round a head** and orbits round a body: see the orbit technique in `poster-styles.md` (one copy behind the subject, one clipped copy in front).

### Mixing and nesting

- **One display face, used hard,** beats three faces used politely. Add a contrast face only for one or two words: a script word over a heavy grotesk, a small serif italic tucked into a gap.
- **Nest small words** into the counters and gaps of big ones ("for" above the J of JUDGEMENT; "the" between two stacked words, rotated 90°).
- **Mix scales in one line:** the key word huge, linking words at a third of the size, aligned to the cap height or the baseline of the big word.
- **Let letters touch or overlap** at big sizes: negative tracking (-40 to -80 in `lettering.cjs`, or `letter-spacing: -.06em`), separated by an outline in the background colour where they cross.
- **Crop letters at the frame edge.** A title cut off by the edge reads bigger than one that fits.
- **Vertical and rotated type** for secondary lines: `writing-mode: vertical-rl`, or `rotate(-90deg)` along an image edge.

### Display fonts by mood

All Google Fonts (verified), loaded with a `<link>`, or downloaded by `lettering.cjs --google`.

| Mood | Fonts |
|---|---|
| Western, circus, wanted poster | Sancreek, Rye, Ewert, Smokum, Diplomata, Ultra, Holtwood One SC |
| Horror, drip, monster | Creepster, Nosifer, Butcherman, Eater, Rubik Wet Paint, Rubik Beastly |
| Chunky, groovy, retro | Bagel Fat One, Bowlby One, Shrikhand, Lilita One, Luckiest Guy, Titan One, Chango, Darumadrop One, Gajraj One, Londrina Solid |
| Ornate, Art Nouveau, decorative | Berkshire Swash, Cinzel Decorative, Federo, Arbutus, Metamorphous, Macondo, Limelight, Fascinate, Moirai One, Monoton |
| Gothic, blackletter, metal | Pirata One, UnifrakturMaguntia, Grenze Gotisch, New Rocker |
| Didone, fashion | Bodoni Moda, Playfair Display, Abril Fatface, DM Serif Display |
| Wide, techno, rave | Unbounded, Dela Gothic One, Syncopate, Michroma, Krona One, Audiowide, Orbitron |
| Condensed towers | Anton, Bebas Neue, League Gothic, Six Caps, Pathway Gothic One, Antonio |
| Graffiti, marker, hand | Sedgwick Ave Display, Barrio, Permanent Marker, Rock Salt, Caveat Brush |
| Variable and experimental | Kablammo (MORF), Tilt Warp (XROT/YROT), Anybody (wdth 50–150), Roboto Flex, Climate Crisis (YEAR), Fraunces (SOFT/WONK), Nabla, Honk, Bungee Spice, Rubik Glitch, Rubik Puddles |
| Sign-painting scripts | Yesteryear, Damion, Mr Dafoe, Sonsie One |

Almendra Display is an outline font; it draws hollow letters.

## Composition critique

Ask these of every render:

1. Squint at the thumbnail. Is there one thing you see first, then a second, then the rest?
2. Is anything bleeding off an edge? Is there one big quiet area?
3. Is the title drawn (warped, stacked, interlocked, cropped, fitted to the subject), or is it just typed?
4. Does the small type align to something meaningful (the title's edge, the subject's line), and is it clustered?
5. Would this layout work unchanged for a different event? If yes, it isn't specific enough.
