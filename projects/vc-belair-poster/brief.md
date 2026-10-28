# VC Belair: season poster

- Client: VC Belair (the "Belair Lions"), volleyball club in Belair, Luxembourg City, since 1963 (vcb.lu)
- Goal: a sports poster for the club, built from the supplied player photo
- Hook: Men 1 and Women 1 are promoted to the Mixvoip League, Luxembourg's top flight, for 2026/27 (vcb.lu news, May 2026)
- Copy, all from vcb.lu: slogan "Roar together", "Belair Lions · since 1963", home games at Hall sportif de Belair, 14 Rue d'Ostende, L-2271 Luxembourg; vcb.lu; Instagram @vc.belair
- No fixtures are published on vcb.lu yet (matches page: "No upcoming matches yet"), so this is a season poster, not a match-day one
- Format: 1080 x 1528 (A-series ratio): portrait social post or screen; see "Print" below

## Design
- Club system from the site's stylesheet: Barlow Condensed (display, italic 900), Inter and JetBrains Mono (text); blue #1a5fa8, light #378add, dark #0c447c, ice #9fd9ec on navy
- The shard lion from the club logo, 1400 px wide in the club blues, behind the player; its shards echo the jersey print
- Player cut out (rembg) and kept whole from the head to the hem, so the jersey sponsor (Vallair) stays fully visible; "ROAR / TOGETHER" crosses in front of the shorts
- Reversed (white) logo top left; league and season top right; hall, address, site and Instagram along the foot

## Files
- `vc-belair-roar-together.png` final
- `poster.html` source; `assets/` cut-out, logo versions (`logo-white.png`, `logo-blue.png`, `lion-white.png`, made from the club's `logo.jpg` on vcb.lu) and lettering

## Rebuild
node .claude/skills/html-graphics/scripts/render.cjs projects/vc-belair-poster/poster.html

## Print
The photo is 1024 x 1536 px: fine on screens and up to about A4 at 150 ppi. For an A3 or larger printed poster, get the original full-resolution photo, then run print-production (bleed, CMYK, press PDF).
