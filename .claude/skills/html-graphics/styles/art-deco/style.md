---
id: art-deco
name: Art Deco
family: ornamental
mood: [glamorous, elegant, celebratory, confident, nocturnal]
fits: [galas and balls, hotels and bars, anniversaries and centenaries, premium launches, jazz and cabaret, New Year's parties, theatre and cinema, spirits and cocktails]
avoid: [rustic and craft, eco and organic, children's events, grassroots and DIY, anything casual or playful]
formats: [poster, invitation, menu, social post, label, programme]
palette: { navy: "#0e1a2b", night: "#0a1220", ray: "#15263d", gold: "#c9a14a", gold-pale: "#f1dea6", cream: "#efe4cc", jade: "#2f6e62" }
fonts: { display: "Federo 400 (drawn, stretched tall)", text: "Josefin Sans 400/600" }
---

# Art Deco

The 1925–1939 poster and interior style: symmetry on a strong vertical axis, stepped setbacks and ziggurats, sunbursts and fans, tall thin-and-thick capitals, gold on midnight, and ornament made of straight lines and arcs instead of plants. It comes from skyscraper lobbies, ocean-liner and railway posters, cinema fronts and cocktail menus. It works because the geometry is rigorous and the material is luxurious: one axis, repeated steps and rays, and banded metallic gold make even a short piece of text feel like an event.

## Palette

| Role | Hex | Use |
|---|---|---|
| navy | `#0e1a2b` | Ground (a vertical gradient from `#13233a` to `night`) |
| night | `#0a1220` | Silhouettes: the tower, a skyline, a figure |
| ray | `#15263d` | The lighter sunburst ray; never text |
| gold | `#c9a14a` | Rules, keylines, fluting, small caps and dates (7.2:1 on navy) |
| gold-pale | `#f1dea6` | The aureole's light centre; with gold it makes the gilt gradient |
| cream | `#efe4cc` | Headline and details on navy (13.9:1) |
| jade | `#2f6e62` | One small accent (a diamond, a chevron); never text (2.9:1) |

Rules: navy, gold, cream; jade once. Gold appears in two finishes: flat gold for lines and small type, gilt (`--deco-gilt`, a banded metallic gradient) for the title and big shapes. One airbrushed gradient is allowed (the ground, the aureole); everything else is flat. Alternatives that keep the logic: black `#0d0d0d` + gold + ivory (classic), ivory ground `#f2eadb` + black + gold (daylight invitation), emerald `#0f3b33` + gold, or oxblood `#4a1420` + gold + blush `#e8c4b8`.

## Typography

- Display: Federo, drawn with `lettering.cjs` and stretched tall (2–3× its natural height) so the contrast of thick and thin strokes becomes the ornament. Alternatives: Limelight (heavier, quirky), Bodoni Moda 900 stretched (Broadway), Poiret One (thin, for a light, airy version), Josefin Sans 700 (geometric, plainer).
- Make the title into architecture. The example's skyline sets each letter at one horizontal scale (natural width × 1.47) and steps the heights up toward the axis (240, 290, 340, 400, 400, 340, 290, 240 px):
  ```bash
  L=.claude/skills/html-graphics/scripts/lettering.cjs
  node $L "E" -o /tmp/n.svg --google Federo --height 100          # natural width at 100 px tall (E = 65)
  node $L "E" -o assets/l3-e.svg --google Federo --width 95 --height 400 --fill '#000'   # used as a mask over the gilt
  ```
  Other ways: one word stretched to the full width (`--width 960 --height 420`), a word fanned on an arc (`--warp arch --amount .2`), letters stacked vertically up the axis.
- Text: Josefin Sans. Tracked caps (`.deco-caps`, 600, 22 px, `.32em`) for kickers and the footer; the headline in Federo 46 px tracked `.16em` in cream (`.deco-head`); dates in Federo 40 px gold (`.deco-date`); details 22 px caps tracked `.12em` (`.deco-text`). Tracked text needs `padding-left` equal to its letter-spacing so centred lines stay on the axis (built into the helpers).

## Imagery

- Drawn, geometric, symmetrical: a stepped tower, a fan, a fountain, a liner's bow, a stylised figure in profile, a cocktail glass. Build it in inline SVG from straight lines and arcs: setbacks (stepped `H`/`V` paths), a needle, fluting (a 20 px stripe `pattern` centred on the axis), ledges.
- Silhouette the motif in night against a light shape (the gold-pale aureole) so it reads at a glance, with a gold keyline (`stroke="url(#gilt)"`).
- Photos only if duotoned to navy and gold (`treat.py duotone photo.jpg -o assets/p.png --colors '#0a1220,#c9a14a,#f1dea6'`) and framed in a geometric window (circle, arch, octagon).
- Never a famous building, liner or logo (no Chrysler spire, no Normandie bow): invent your own.

## Texture

Smooth and luxurious: grain `--grain: .18` with `overlay` only, to stop the gradients banding. No paper, dust, halftone or distress. The richness comes from gilt, rays and fine lines.

## Composition

- Archetypes: **symmetry on an axis** (the default: motif, title and details all centred on one vertical line), **sunburst** (rays from a focal point), **frame** (a stepped-corner border holding everything). This is the one style where the centred stack is right, but the title must still be drawn and interlock with the motif (the skyline stands in front of the tower).
- Build from the axis out: the needle, the tower's centre, the diamond on the rule and the line splitting the details are all on x = 540.
- Information below a double rule (`.deco-rule`): headline centred, then two columns mirrored about the axis line (date right-aligned on the left, details left-aligned on the right), footer in tracked caps.
- Frame: a thick and a thin rule with notched corners, inset 28 and 38 px; margins 72 px inside it.
- Layer order (z low to high): navy gradient, sunburst (masked to fade before the text), aureole and rings, tower, skyline title, years and kicker, rule, details, frame, grain.

## Signature moves

1. A drawn title of tall, stretched gilt capitals that forms architecture (a skyline stepping up to the axis).
2. A stepped tower or ziggurat silhouetted on a gold aureole, with fluting and a needle.
3. A sunburst of alternating rays from the focal point, fading out toward the text.
4. Strict symmetry on one axis, carried down into the information as a dividing line.
5. A double frame with notched corners; gold in two finishes (flat lines, gilt shapes).

## Don't

- Use script fonts, organic ornament or florals: that's Art Nouveau.
- Use flat yellow for gold: lines in `--gold`, big shapes in the gilt gradient.
- Break the symmetry by accident: every centred element sits exactly on the axis (check tracked caps).
- Run a line or a ray through text: stop the axis line short of the headline, fade the rays before the details.
- Put jade or the ray colour on text; use jade more than once.
- Recreate a famous poster or building (Cassandre's liners and trains, the Chrysler crown); take the moves, not the piece.

## Check before delivering

- Squint: the aureole and tower first, the title second, the date third.
- The stretched title still reads as the word at thumbnail size; no letter is so thin it disappears.
- All centred elements sit on the axis (needle, diamond, divider, headline).
- Small text in gold or cream only (≥ 7:1 on navy); nothing crosses a line or a ray.
- Gilt on big shapes only; lines and small type flat gold.

## Build

Link `../_base.css` and `tokens.css`. Helpers: `.deco-gilt` (a lettering SVG as a mask over the gilt gradient; set `--m`, position and size inline), `.deco-sunburst` (`--sx`, `--sy`), `.deco-caps`, `.deco-head`, `.deco-date`, `.deco-text`, `.deco-rule`; tokens `--deco-gilt`, `--gold`, `--ray`. The example draws the aureole, tower, fluting, ledges, axis, diamond and frame in one inline SVG on the artboard's grid, with an SVG copy of the gilt gradient (`#gilt`) for the keylines. Each skyline letter is a `div.deco-gilt` whose box is the lettering SVG's size (ink box plus 2 px padding on every side), placed with its bottom on the baseline.
