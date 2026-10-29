# VC Belair: game-day template

- Client: VC Belair (vcb.lu), volleyball club in Belair, Luxembourg City.
- Brief: a better weekly game-day graphic than the current post. It needs the club logo and the sponsors; everything that changes each week is a placeholder.
- Formats: Instagram feed post 1080 x 1350 and story 1080 x 1920, both built from the same data.
- Example: Saturday 31 October 2026, home at Hall sportif de Belair. Men v VC Stroossen 16:30, Women v Gym Volley 19:00 (from the club's post).

## Design
- The club's own system from vcb.lu: Barlow Condensed (italic 800/900) and Inter; blue #1a5fa8, dark #0c447c, light #378add, ice #9fd9ec on navy #081a33.
- "GAME / DAY" is a justified two-word stack cut along two lines parallel to the shards of the lion's mane, with the pieces slid apart like the gaps in the crest. The player stands in front of it and the lion mark sits behind.
- All the practical information is grouped below: date and hall on one line, then one row per game (team, time, opponent crest and name).
- Partners on a white band: the league, then 8 sponsor slots in a 4 x 2 grid. Every logo gets the same area, so wide wordmarks and square crests carry the same weight.

## Files
- `vc-belair-gameday-2026-10-31-feed.png`, `-story.png`: this Saturday, filled in.
- `vc-belair-gameday-template-feed.png`, `-story.png`: the blank master with every placeholder showing.
- `2026-10-31.html`, `template.html`: the game files (data only). `gameday.css` and `gameday.js`: the shared design.
- `tests/variants.html`: edge cases (no player, three games, an away game, a long club name).
- `thumbnails.html`: the five composition sketches; A (depth sandwich) was developed.

## Making next week's graphic
1. Copy `2026-10-31.html` to e.g. `2026-11-07.html` and edit only the `window.GAMEDAY` block:
   - `date`: `'2026-11-07'` (the weekday and month are written out for you).
   - `player`: a transparent PNG cut-out in `assets/` (head to waist works best), `''` for a placeholder, or `null` for no player (the lion fills the space).
   - `fixtures`: one line per game, 1 to 4 games; the rows resize to fit. `crest` is the opponent's logo file. With no crest, the opponent's initials go in a badge. For an away game add `home: false, venue: 'Hall, Town'` (the row says "at" and names the hall). `competition: 'Division 1'` adds a small line.
2. Render: `node .claude/skills/html-graphics/scripts/render.cjs projects/vc-belair-gameday/2026-11-07.html` (from the repo root). The PNGs land in `export/`.

## Sponsors, league, hall
Set once in `CLUB` at the top of `gameday.js`. To replace a logo, drop the official file in `assets/sponsors/` and point its `logo` path at it; `scale` nudges one that looks light. A sponsor with `logo: ''` shows a named placeholder (Salary, for now). Add the league's logo file as `league.logo` to replace the type.

## Still needed from the club
- Official logo files for all 8 sponsors (SVG, or PNG at least 600 px wide). The current ones are enlarged crops of the old banner and look soft; Salary is missing entirely.
- The Mixvoip League logo, white or full colour, for the blue league panel.
- Opponent crests each week, and a player cut-out if you want one.
