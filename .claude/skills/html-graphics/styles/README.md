# Style library

Each folder is one visual style with the same parts:

| File | What |
|---|---|
| `style.md` | The spec: front matter (machine-readable) plus guidelines in fixed sections |
| `tokens.css` | Fonts, palette and texture variables plus the style's helper classes. Link it after `../_base.css` |
| `example.html` | A reference poster built in the style |
| `preview.jpg` | The rendered example. Show it when someone asks for a reference of the style |
| `assets/` | Lettering SVGs, treated images and textures the example uses (optional) |

Shared photos live in `_shared/photos/` (public domain and CC0, see `_shared/CREDITS.md`).

## Using a style

1. Pick from the catalog below by mood, use and format. When the user asks to see a style, send its `preview.jpg` (or `catalog.jpg` for all of them).
2. Read the style's `style.md` in full. Start the piece from the plain template or the example's structure, and link `styles/_base.css` and the style's `tokens.css` (paths relative to the project file, e.g. `../../.claude/skills/html-graphics/styles/riso-two-ink/tokens.css` from `projects/<slug>/`).
3. Follow the sections in order: palette, typography (lettering commands), imagery (treatment commands), texture stack, composition. Make the piece specific to its brief; the example shows the style, not a layout to reuse.
4. Run the style's "Check before delivering" list on top of the usual critique.

A user's own house style goes in the same format (`styles/<brand>/`), so every piece for that brand stays consistent.

## The spec format

```markdown
---
id: riso-two-ink                      # folder name
name: Riso two-ink
family: print-era                     # print-era | modernist | ornamental | pop | digital | editorial | genre
mood: [raw, warm, indie, grainy]
fits: [club nights, zines, indie brands]
avoid: [luxury, corporate finance]
formats: [poster, social post, flyer]
palette: { paper: "#f1ece2", ink-1: "#e8412c", ink-2: "#2f4b7c" }
fonts: { display: "Unbounded 900", text: "Unbounded 500" }
post: "treat.py riso {in} -o {out} --inks '#e8412c,#2f4b7c' --paper '#f1ece2'"   # optional step after rendering
---

# Name

One paragraph: what the style is, where it comes from, why it works.

## Palette          roles with hex values, the rules for using them, alternatives
## Typography       display and text faces, sizes, lettering.cjs presets
## Imagery          what images suit it and the treat.py / filter commands
## Texture          the overlay stack with blend modes and opacities
## Composition      archetypes that fit, grid and margins, layering order
## Signature moves  3-5 things that make it read as this style
## Don't            the common ways it goes wrong
## Check before delivering   style-specific checks
```

## Previews and catalog

`python3 .claude/skills/html-graphics/scripts/previews.py` renders every `example.html`, applies any `post` step, writes each `preview.jpg`, rebuilds `catalog.jpg`, and refreshes the table below from the front matter. Pass style ids to rebuild only those.

## Catalog

<!-- catalog:start -->
| Style | Family | Mood | Fits | Preview |
|---|---|---|---|---|
| [Editorial cover with depth](editorial-depth/style.md) | editorial | moody, cinematic, premium, intimate, serious | magazine and zine covers, album covers, film and theatre posters, exhibition key art, portrait-led campaigns | [preview](editorial-depth/preview.jpg) |
| [Halftone punk](halftone-punk/style.md) | print-era | loud, gritty, rebellious, eerie, energetic | gigs, punk and garage nights, horror and cult film screenings, skate and DIY events, record releases | [preview](halftone-punk/preview.jpg) |
| [Neon horror](neon-horror/style.md) | genre | spooky, campy, loud, nocturnal, fun | Halloween parties, horror screenings, haunted events, metal and goth nights, game nights | [preview](neon-horror/preview.jpg) |
| [Photocopy zine](photocopy-zine/style.md) | print-era | raw, literary, underground, austere, handmade | zines, small presses, photography and art events, punk and post-punk gigs, poetry nights, indie labels | [preview](photocopy-zine/preview.jpg) |
| [Riso two-ink](riso-two-ink/style.md) | print-era | indie, warm, grainy, playful, underground | club nights, techno and experimental music, zines, small festivals, bookshops, indie brands | [preview](riso-two-ink/preview.jpg) |
| [Sticker cut-out](sticker-cutout/style.md) | pop | bold, playful, confident, social, loud | club and party nights, DJ lineups, festivals, fashion drops, social campaigns, sports | [preview](sticker-cutout/preview.jpg) |
| [Swiss International](swiss-international/style.md) | modernist | rational, clean, confident, cultural, calm | concert series, museums and exhibitions, architecture, tech and science events, annual reports, institutions | [preview](swiss-international/preview.jpg) |
<!-- catalog:end -->
