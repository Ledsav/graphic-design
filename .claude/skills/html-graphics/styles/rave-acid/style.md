---
id: rave-acid
name: Rave acid
family: digital
mood: [loud, hypnotic, technical, nocturnal, euphoric]
fits: [acid house, techno and rave nights, warehouse parties, club residencies, electronic releases, audio and synth meetups, late-night festivals]
avoid: [daytime family events, weddings, heritage and craft, healthcare and finance, anything quiet or elegant]
formats: [poster, social post, story, flyer, record sleeve]
palette: { black: "#0a0a0a", acid: "#d4ff00", magenta: "#ff1fa8", uv: "#5a12d6", chalk: "#f2f2ec" }
fonts: { display: "Dela Gothic One 400 (drawn, stretched)", text: "Space Mono 400/700" }
---

# Rave acid

Warehouse-black posters with neon inks: an acid yellow-green, a UV magenta printed off-register behind it, and a violet halftone fog. The display type is stretched until it becomes a machine (a spectrum analyser, a waveform, a wall of bars), and the information reads like equipment: monospace spec sheets, frequency scales, barcodes, catalogue numbers. It comes from 1988–92 acid house flyers, white-label sleeves and the technical graphics of synths and test gear. It works because the title is both word and signal, and the two neons on black read from across a dark room.

## Palette

| Role | Hex | Use |
|---|---|---|
| black | `#0a0a0a` | Background; the poster is black first |
| acid | `#d4ff00` | The main ink: title, spec text, rules, barcode (17:1 on black) |
| magenta | `#ff1fa8` | Second ink: the off-register echo, labels and times (5.7:1, 16 px and up) |
| uv | `#5a12d6` | Halftone fog and image shadows only; never type (2.4:1) |
| chalk | `#f2f2ec` | Dust and the odd line of small print |

Rules: two inks on black, acid dominant, magenta as its echo and for labels. Acid next to magenta is only 3:1, so never set small text of one on the other. No gradients between the neons; the only soft transitions are halftone dots and glow. Alternatives that keep the logic: acid `#39ff14` + UV `#7a2bff`; orange `#ff6a00` + cyan `#00e5ff`; or a negative version (acid ground `#d4ff00`, black ink, magenta echo).

## Typography

- Display: Dela Gothic One, drawn with `lettering.cjs` and stretched non-proportionally (`--width` and `--height` together). Alternatives: Anton, Six Caps (condensed), Krona One and Syncopate (wide, techno), Unbounded 900. Monoton only as an echo line.
- Build the title into a machine. The example's analyser sets each letter as one frequency band, 138 px wide, stretched to a different height, with a taller magenta copy behind it as the peak hold:
  ```bash
  L=.claude/skills/html-graphics/scripts/lettering.cjs
  node $L "Q" -o assets/bar-1.svg  --google "Dela Gothic One" --width 138 --height 1662 --fill '#d4ff00'   # body 1330 x 1.25: Q's tail dives off the bottom
  node $L "Q" -o assets/peak-1.svg --google "Dela Gothic One" --width 138 --height 1738 --fill '#ff1fa8'   # body + 60 px peak, same scaling
  ```
  Other machines: a waveform (`--warp wave --amount .4 --freq 1.5 --width 1700 --height 700`, cropped by the frame), an echo stack (the same word five times with rising `--amount` and magenta outlines, `--fill none --stroke '#ff1fa8' --stroke-width 6`), a tunnel (`--warp perspective --amount .55`).
- Text: Space Mono caps. Spec rows 18 px (`.acid-spec`), labels 16 px bold tracked `.08em` in magenta (`.acid-label`), act names 24 px bold (`.acid-name`). The date in the display face at 72 px with `.acid-split`. Two families only.
- Write info as equipment: `TYPE / TIME / LOC / BPM / RES` rows, frequency labels under the bars (`40 Hz … 2.5k`), a catalogue number (`SQ-130327`), a barcode.

## Imagery

- Optional and abstract: space, oscilloscopes, crowds as noise, smiley-free. Map it into the inks:
  `treat.py duotone hubble_deep_field.jpg -o assets/hubble-acid.png --colors '#0a0a0a,#5a12d6,#ff1fa8,#e6ff00' --levels .02,.55`
  then crop it into a disc (a sun setting behind the analyser) with a 2 px acid keyline.
- Halftone fog: `.acid-halftone` (UV dots growing toward one corner).
- No photos of people, no smiley faces or other borrowed rave icons; the title is the image.

## Texture

- `.acid-grid` (48 px technical grid at .12) over the black.
- Dust: `treat.py texture dust -o assets/dust.png --size 1080x1527 --color '#f2f2ec' --seed 3` as `.overlay` at .35.
- Grain `--grain: .4` with `overlay`, so the inks get texture and the black stays black.
- Glitch: one or two thin horizontal bands of the title, copied and shifted 18–26 px sideways (`.slice` in the example, filled by its script).
- Glow (`.acid-neon`) on one accent at most; most of the poster is flat ink.

## Composition

- Archetypes: **type as image** (the machine fills 60–80% of the frame), **giant crop** (the waveform bleeds off both sides), **grid** (spec sheet plus a column of bars).
- Margins 40 px (`--safe: 40px`). A baseline axis (2 px acid rule) with a scale under it grounds the bars; the bars grow up from it.
- Information goes inside the machine: acts sit on the peaks of their bands, the spec sheet in the top corner where the bars are short, the date vertical up the edge where the first band is short.
- Layer order (z low to high): black, grid, halftone fog, image disc, axis, peak copies, bars, glitch slices, labels and acts, spec sheet, dust, grain.

## Signature moves

1. The title stretched into a machine (analyser, waveform, tunnel) that fills the poster.
2. A magenta copy behind the acid ink: off-register echo or peak hold.
3. Spec-sheet information: monospace rows in a ruled box, a scale, a barcode, a catalogue number.
4. UV halftone fog and a cropped space disc on warehouse black.
5. One or two glitch slices.

## Don't

- Use a yellow smiley, a "rave" stock font, or chrome: that's a different style (Y2K) or a cliché.
- Set small text in acid on magenta or the reverse, or anything in UV.
- Glow everything: one accent at most.
- Let the stretched title stop reading as a word: check it at thumbnail size, and repeat it in the spec sheet.
- Let act names or labels touch the sheet, the bars or each other; give every label a clear 12 px.

## Check before delivering

- At 300 px wide the title still reads as the word, and the date reads.
- Every act name sits clear of other elements and on its own band.
- Text contrast: acid or chalk for anything under 16 px; magenta 16 px and up; no UV text.
- Glitch slices cut across bars, not across small text.
- Dates and times agree (the weekday in the sheet matches the date).

## Build

Link `../_base.css` and `tokens.css`; paste the `#neon` and `#acid-split` filters from `example.html` after `<body>`. Helpers: `.acid-spec`, `.acid-label`, `.acid-name`, `.acid-sheet` (a ruled spec box: one `<div>` per row with two `<span>`s), `.acid-barcode`, `.acid-grid`, `.acid-halftone`, `.acid-neon`, `.acid-split`. In the example each band is one `<img>` placed by hand on a 144 px pitch, with its box top at the baseline minus the letter's height; the glitch slices are copies of the whole wall filled by a three-line script and cut with `clip-path: inset()`.
