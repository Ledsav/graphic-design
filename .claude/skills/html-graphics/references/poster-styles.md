# Poster styles

The genre recipes now live in the style library: `styles/<id>/style.md`, each with tokens and a reference poster. This page covers what every expressive poster shares, whichever style it uses. Pick the style first (`styles/README.md` has the catalog, `styles/catalog.jpg` shows them all), then use this page and `type-and-composition.md` while building.

When the user shares reference images, take the genre and the level of finish from them, never the layout, the imagery or the type lockup. Map the references to the closest library style (or a mix: one style with a single move borrowed from another) and say which.

## What every strong poster has

1. **A strong image** or a strong figure: half the poster. A subject with a clear silhouette and decisive light, or a geometric or typographic figure that carries the idea. See `imagery.md` for where images come from.
2. **A treatment** on the image: almost never a raw photo. Halftone, photocopy, duotone, riso, posterize, or a cut-out (`scripts/treat.py`, `templates/filters.html`).
3. **Display type with character, drawn,** very large (`scripts/lettering.cjs`). One family carries the poster; a plain text face handles the small print.
4. **Texture** appropriate to the style: grain at minimum for print-era looks; none for modernist ones.
5. **Depth from layering:** the title behind the subject, a letter in front, a sticker border, a ring that passes behind and in front.
6. **Small type doing structure:** corner metadata, boxed notes, rules, lineups in columns. Tiny, but it frames the big gesture.

## Stack order

From the back (low z-index) to the front: background colour, background shapes or texture, photo, shade or scrim, title, cut-out subject, front letters, small type, rings and lines, paper, dust and folds overlays, grain.

## Which style for which brief

| Brief | Start with |
|---|---|
| Concert series, museum, institution, architecture, science | `swiss-international`, `bauhaus-constructivist` |
| Magazine or album cover, film or theatre, portrait campaign | `editorial-depth`, `art-nouveau`, `art-deco` |
| Gig, punk, garage, cult screening, DIY | `halftone-punk`, `photocopy-zine`, `collage-scrapbook`, `brutalist` |
| Club night, techno, rave, experimental | `riso-two-ink`, `rave-acid`, `y2k-chrome`, `brutalist` |
| Party, festival, DJ lineup, fashion drop | `sticker-cutout`, `retro-70s`, `psychedelic-60s`, `y2k-chrome` |
| Halloween, horror, goth, metal | `neon-horror`, `halftone-punk` |
| Jazz, folk, food and drink, craft, illustrated | `illustrated-screenprint`, `retro-70s`, `art-nouveau` |
| Gala, hotel, premium launch, anniversary | `art-deco`, `editorial-depth`, `swiss-international` |

## Finishing pass (all styles)

- Look at the export at full size and at feed size (the `--sheet` thumbnail). The title must read at thumbnail size; the small print must read at full size.
- One gesture dominates. If the title, the image and a texture all shout, quiet two of them.
- Check every crossing of text and image; add a halo, scrim or band where legibility drops.
- Texture belongs on everything or nothing: grain sits above the whole poster, not on one element.
- Run the style's own "Check before delivering" list.
- No real people's faces, brands or characters without rights. For anything printed, run `print-production`.
