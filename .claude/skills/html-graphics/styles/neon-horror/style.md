---
id: neon-horror
name: Neon horror
family: genre
mood: [spooky, campy, loud, nocturnal, fun]
fits: [Halloween parties, horror screenings, haunted events, metal and goth nights, game nights]
avoid: [anything serious or corporate, children's events that should not frighten]
formats: [story, poster, social post, flyer]
palette: { night: "#0b0a0d", blood: "#ff2b2b", slime: "#39ff6a", bone: "#efe9dc" }
fonts: { display: "Creepster (drawn, arched, dripping)", text: "Special Elite", accent: "Butcherman" }
---

# Neon horror

A black night with a red radial glow, neon green and blood red, a dripping horror title arched over the frame with a glow, a ribbon banner for the key line, a halftone moon, bats and a graveyard silhouette. It comes from B-movie posters and Halloween party flyers. It works because the glow and drips make the type itself the monster, and two neon colours on black read from across a room.

## Palette

| Role | Hex | Use |
|---|---|---|
| night | `#0b0a0d` | Background (with a `#2a0b10` radial glow behind the title) |
| blood | `#ff2b2b` | The title |
| slime | `#39ff6a` | Ribbon, kicker, rim light |
| bone | `#efe9dc` | Date and small text |

Rules: two neons maximum, glow on the title and one accent only. Alternatives: pumpkin `#ff7a1a` + purple `#8b3dff`; toxic `#c6ff00` + magenta `#ff2bd6`.

## Typography

- Display: horror faces (Creepster, Nosifer, Butcherman, Eater, Rubik Wet Paint), drawn arched with drips and a dark outline:
  `lettering.cjs "MONSTER|BALL" --google Creepster --align justify --leading .85 --warp arch --amount .2 --drip .75 --fill '#ff2b2b' --stroke '#1a0000' --stroke-width 16 --width 980`, then `filter: drop-shadow(0 0 18px rgb(255 43 43 / .55))`.
- Date as a smile curve: `lettering.cjs "OCT 31 · 9PM" --google Butcherman --warp arch --amount -.12 --fill '#efe9dc' --width 760`.
- Text: Special Elite (typewriter) 30–34 px; kicker in slime with `url(#neon)`.
- Ribbon: a `clip-path` notched band in slime with the line in Butcherman 54 px.

## Imagery

- Drawn elements: a moon (radial gradient + `treat.py texture grunge` craters at multiply + masked halftone dots), bats (SVG silhouettes with `url(#rough)`) placed over the moon so they read, a hill with crosses and tombstones (SVG) with a slime rim light.
- Photos only if treated: `treat.py duotone --colors '#000,#39ff6a'` or posterize. Never film characters, masks or logos the user doesn't own.

## Texture

- Fog: a slime radial gradient at .16 with `blur(10px)` above the hill.
- Dust in bone at .35; grain .7 overlay.

## Composition

- Archetypes: type-led, with the moon and title as a depth pair; for stories keep `--safe: 250px 72px 340px`.
- Title in the upper-middle, crossing the moon; ribbon tilted −4° below; date on its curve; info in two clusters above the hill.
- Stack: night glow, moon, bats, kicker, title, ribbon, date, info, fog, hill, dust, grain.

## Signature moves

1. An arched, dripping title with a red glow.
2. A notched neon ribbon for the key line.
3. Silhouettes (bats, hill) against a glowing moon.
4. A date set on a smile curve.

## Don't

- Use real horror characters, masks or franchise logos.
- Glow everything; glow on the title and one accent only.
- Place black silhouettes on the black sky (they vanish).
- Let drips from the first line fall onto words of the second.

## Check before delivering

- The title reads at thumbnail size despite drips and glow.
- Bats and silhouettes are visible (against the moon or rim light).
- Story safe zones are clear of key text.

## Build

Link `../_base.css` and `tokens.css`; paste `templates/filters.html` for `#rough` and `#neon`. The example draws the moon, bats, ribbon and graveyard in CSS and SVG.
