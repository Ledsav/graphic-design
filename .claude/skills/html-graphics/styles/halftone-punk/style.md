---
id: halftone-punk
name: Halftone punk
family: print-era
mood: [loud, gritty, rebellious, eerie, energetic]
fits: [gigs, punk and garage nights, horror and cult film screenings, skate and DIY events, record releases]
avoid: [luxury, wellness, corporate, children]
formats: [poster, flyer, story, social post]
palette: { paper: "#f2e33a", ink: "#121212", scrap: "#efe9d9" }
fonts: { display: "Sancreek (drawn, with drips)", text: "Crimson Pro 400/700" }
---

# Halftone punk

A loud flat paper colour, a black block of halftoned photo with torn edges and tape, a western or blackletter title with drips, a serif date and a venue on a paper scrap. It comes from photocopied gig flyers and wheat-pasted posters. It works because the halftone turns any photo into pure graphic texture, and the collage moves (tear, tape, tilt) give it urgency.

## Palette

| Role | Hex | Use |
|---|---|---|
| paper | `#f2e33a` | Background and the halftone dots' colour |
| ink | `#121212` | Title, photo block, text |
| scrap | `#efe9d9` | Paper scrap for venue details |

Rules: two colours plus the scrap. Paper alternatives: hot pink `#ff4f9a`, safety orange `#ff6a13`, acid green `#c6f432`, off-white `#efe9d9` with red ink `#d0221a`.

## Typography

- Display: western, blackletter or horror faces (Sancreek, Rye, Pirata One, Grenze Gotisch, Creepster), drawn with drips and a paper-coloured outline so it reads over the black photo: `lettering.cjs "A|B" --google Sancreek --align justify --leading .8 --tracking -10 --drip .65 --fill '#121212' --stroke '#f2e33a' --stroke-width 20 --width 940`.
- Text: a bold serif (Crimson Pro★ 700) for the date, 120–250 px; venue 46 px bold + 25 px regular.
- Date can run vertically along an edge (`writing-mode: vertical-rl`).

## Imagery

- A subject with a strong silhouette; cut out and flattened on black reads as a ghost: `treat.py halftone cut.png -o ht.png --flatten '#000000' --width 1600 --cell 12 --invert --ink '#f2e33a' --paper '#121212' --levels .08,.85`, then `treat.py torn ht.png -o torn.png --edges top,bottom --depth 70 --rim 10 --rim-color '#f2e33a'`.
- Without a cut-out, halftone the whole photo with dark dots on the paper colour.

## Texture

- Paper: `treat.py texture paper` with `mix-blend-mode: multiply`.
- Grunge: `treat.py texture grunge --color '#111' --strength .5` at .3 opacity.
- Dust: `treat.py texture dust --color '#111'` at .7.
- Tape: 200×60 px `rgb(236 236 226 / .6)` rotated 6–38°, `filter: url(#torn)`; on scraps, put the filter on a `::before` background, never on the text.

## Composition

- Archetypes: diagonal collage, depth sandwich (title over the photo's top edge).
- The photo block tilted 2–4° and nearly bleeding off both sides; the title tilted the other way (−5 to −8°).
- Stack: paper, grunge, photo block, title, tape, scrap, date, dust.

## Signature moves

1. A torn halftone photo block with a paper-coloured rim.
2. A dripping title outlined in the paper colour, crossing into the photo.
3. Tape strips and a taped paper scrap for the details.
4. A giant date in the paper colour on the black block.

## Don't

- Cover the subject's face with the title or the tape.
- Apply `#torn` or `#rough` to text you need people to read.
- Use more than one display face.
- Make everything straight; the tilt is part of the urgency.

## Check before delivering

- The face (or the subject's key feature) is clear of the title and drips.
- Every text block sits on a colour it contrasts with (black text on yellow, yellow on black).
- Tape covers corners, never words.

## Build

Link `../_base.css` and `tokens.css`. Paste `templates/filters.html` for `#rough` and `#torn`.
