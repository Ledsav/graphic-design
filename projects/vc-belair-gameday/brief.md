# VC Belair: game-day post

- Client: VC Belair (vcb.lu), volleyball club in Belair, Luxembourg City.
- Brief: a professional weekly game-day post for Instagram, better than the current one. It needs the club logo and the sponsors; everything that changes each week is a placeholder.
- Format: Instagram feed post, 1080 x 1350.
- Example: Saturday 31 October 2026, home at Hall sportif de Belair. Men v VC Stroossen 16:30, Women v Gym Volley 19:00 (from the club's post).

## Design
- The club's own system from vcb.lu: Barlow Condensed and Inter; blue #1a5fa8, light #378add, ice #9fd9ec on navy #071630. White carries what matters, ice the labels, blue only the light.
- Hero: "GAME DAY" in huge upright Barlow Condensed Black, with the player standing in front of it (his head crosses the E). A cool rim light and a blue glow lift him off the background; the lion from the crest sits faint behind, with hall-light beams from the top right.
- Information in one block: date and hall on one line, then one column per game, with the time as the biggest thing after the title.
- Sponsors in one colour (white) on a dark bar, 4 x 2, every logo at the same visual weight. That is what makes a sponsor bar look professional: no clash of colours and backgrounds.

## Files
- `vc-belair-gameday-2026-10-31.png`: this Saturday, ready to post.
- `vc-belair-gameday-template.png`: the blank master with every placeholder showing.
- `2026-10-31.html`, `template.html`: the game files (data only). `gameday.css` and `gameday.js`: the shared design.
- `tests/variants.html`: edge cases (no player, three games, an away game, a long club name).
- `thumbnails.html`: the composition sketches from the first round.

## Making next week's post
1. Copy `2026-10-31.html` to e.g. `2026-11-07.html` and edit only the `window.GAMEDAY` block:
   - `date`: `'2026-11-07'` (the weekday and month are written out for you).
   - `player`: a transparent PNG cut-out in `assets/` (head to waist works best), `''` for a placeholder, or `null` for no player (the lion fills the space).
   - `fixtures`: one line per game, 1 to 4 games; the columns resize to fit. `crest` is the opponent's logo file. With no crest, the opponent's initials go in a badge. For an away game add `home: false, venue: 'Hall, Town'` (the column says "at" and names the hall). `competition: 'Division 1'` adds a small line.
2. Render from the repo root: `node .claude/skills/html-graphics/scripts/render.cjs projects/vc-belair-gameday/2026-11-07.html`. The PNG lands in `export/`.

## Sponsors, league, hall
Set once in `CLUB` at the top of `gameday.js`. Sponsor logos run in white: `assets/sponsors/white/` holds white versions made from the banner crops. To replace one, drop the sponsor's official white (or one-colour) logo there and point its `logo` path at it; `scale` nudges a logo that looks too heavy or too light. A sponsor with `logo: ''` shows a placeholder (Salary, for now).

## Still needed from the club
- Official logo files for all 8 sponsors, ideally white or one-colour SVG (or PNG at least 600 px wide). The current ones are made from enlarged crops of the old banner and are soft; Salary is missing entirely.
- Opponent crests each week (the two here are cut from the club's own post, at low resolution), and a player cut-out if you want one.
