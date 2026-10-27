# graphic-design

A Claude Code workspace set up as a full-service graphic design studio. Open this repo in Claude Code and ask for a logo, a poster, a brand identity, a social campaign, a deck or a print-ready flyer. `CLAUDE.md` makes Claude work like a senior designer, and the skills in `.claude/skills/` supply the craft.

## Skills

| Skill | What it does | Source |
|---|---|---|
| `html-graphics` | Posters, flyers, covers, social posts and ads built in HTML/CSS and rendered to exact PNG/JPEG/PDF. Includes a renderer that checks the output, a lettering tool for drawn titles (warps, drips, extrusion, hand-lettered bounce, interlocking with the subject), image treatments (halftone, photocopy, riso, duotone, cut-outs, torn paper, silhouette contours, textures), an SVG filter library, composition guides, and a style library with a reference poster per style. | Written for this repo |
| `canvas-design` | Art prints and abstract visual pieces as PNG/PDF, driven by a written design philosophy. Ships 29 open-licence (OFL) font families. | Anthropic |
| `algorithmic-art` | Generative art in p5.js: flow fields, particles, patterns, textures, with an interactive parameter viewer. | Anthropic |
| `theme-factory` | 10 curated colour and type themes, plus custom ones, applied consistently to decks, docs and pages. | Anthropic |
| `frontend-design` | Distinctive web and landing-page design that avoids templated "AI look" defaults. | Anthropic |
| `slack-gif-creator` | Animated GIFs, stickers and emoji with size and frame-rate constraints. | Anthropic |
| `design` | Logos (55 styles), corporate identity (50 deliverables), icons, social images, banners and slides. Optional AI image generation. | ui-ux-pro-max |
| `brand` | Brand identity, voice, messaging, guidelines template, logo usage rules, asset validation. | ui-ux-pro-max |
| `banner-design` | Social covers, ad banners, website heroes and print banners at exact platform sizes, in 22 art-direction styles. | ui-ux-pro-max |
| `design-system` | Turns a brand into primitive, semantic and component design tokens. | ui-ux-pro-max |
| `slides` | Strategic HTML presentations with layout patterns and copywriting formulas. | ui-ux-pro-max |
| `ui-ux-pro-max` | Searchable offline catalogue: 192 palettes, 74 font pairings, 79 styles, UX rules. | ui-ux-pro-max |
| `print-production` | Prepress: canvas sizing with bleed, preflight (PPI, colour mode), CMYK conversion, press PDF with crop marks. | Written for this repo |

Sources:
- Anthropic: [anthropics/skills](https://github.com/anthropics/skills) at `dbd4588f`, Apache-2.0 (`LICENSE.txt` in each folder).
- ui-ux-pro-max: [nextlevelbuilder/ui-ux-pro-max-skill](https://github.com/nextlevelbuilder/ui-ux-pro-max-skill) at `28b3b8de`, MIT (`LICENSE.txt` added to each folder).

The vendored skills are unmodified copies of upstream.

Left out on purpose:
- Anthropic's `brand-guidelines`, which applies Anthropic's own brand.
- The `ui-styling` skill, which is shadcn/Tailwind code rather than graphic design.
- [pbakaus/impeccable](https://github.com/pbakaus/impeccable), which is excellent for product UI but downloads a native engine binary. Install it as a plugin if you do a lot of interface work.

## Setup

```bash
pip install -r requirements.txt
npm install && npx playwright install chromium   # HTML renderer and lettering tool
pip install rembg onnxruntime                     # optional: background removal for cut-outs
```

Optional: for AI-generated logos, identity mockups and icons in the `design` skill, set `GEMINI_API_KEY` (or `MUAPI_API_KEY` / `ATLASCLOUD_API_KEY`) in your environment or in `~/.claude/.env`. Without a key, Claude draws logos and icons as SVG by hand, and everything else works offline.

## Style library

`.claude/skills/html-graphics/styles/` holds the visual styles, each with a spec (palette, type, imagery, texture, composition, signature moves, don'ts, checks), CSS tokens and an original reference poster. `styles/catalog.jpg` shows them all; ask "show me the Art Deco style" to get a reference. Rebuild previews with `python3 .claude/skills/html-graphics/scripts/previews.py`.

## Try it

- "Design a logo for Ember, an artisan coffee roaster. Give me three directions first."
- "Make an A3 gig poster for a jazz night on 14 March, print-ready."
- "Create a brand identity for a Barcelona yoga studio: palette, type, logo and guidelines."
- "Instagram carousel (5 slides) announcing our spring collection."
- "Business cards for Ana Ruiz, architect. EU size, print-ready PDF."

## Updating skills

Re-copy a skill folder from its upstream repo at a newer commit and update the commit hash above. For the ui-ux-pro-max skills, keep the `LICENSE.txt` that was added to each folder.
