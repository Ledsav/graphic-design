# Glass effect test

**Goal:** show that the "frosted glass with clear-cut letters" look from a Photoshop tutorial the user shared on Pinterest (pin 755478906284768142, from an Instagram carousel) can be rebuilt with this studio's own tools. The technique is the reference; the image, copy and layout are original.

**Format:** 1080 × 1350 px (Instagram portrait), PNG.

## How the effect breaks down

| Photoshop step in the tutorial | Here |
|---|---|
| Field Blur, sharp centre and blurry edges | Two copies of the photo: `blur(26px)` everywhere, `blur(8px)` under a radial mask around the eagle's head |
| Filter Gallery > Glass (frosted texture) | `#frost` SVG filter: fractal-noise displacement plus a soft specular sheen from the same noise |
| Sharp duplicate clipped to the text | The same photo, unblurred, masked by `assets/title.svg` (`mask: url(...)`) |
| Bevel & Emboss + Inner Shadow on the text | `#glass-edge` SVG filter on the title shapes: milky outer rim, lit far wall, inner shadow, hairline |
| White fill in Soft Light | `.haze` (white, soft-light, 34%) plus a faint warm `.milk` layer over the frosted part only |
| Colour grade and overlays | `treat.py duotone` gradient map, vignette, `treat.py texture grain` in overlay |

## Tuning

- Bump size: `baseFrequency` in `#frost` (lower = bigger bumps). Distortion: `scale`. Sheen: `k3`.
- Glass thickness: `dx`/`dy` on the wall highlight, `dy` and blur on the inner shadow, `radius` on the rim.
- Focus: the `.frost.near` mask centre and size.
- Title position: the `--title-*` variables (the mask and the edge layer both read them).

## Rebuild

```bash
python3 -c "from PIL import Image; Image.open('.claude/skills/html-graphics/styles/_shared/photos/eagle.jpg').crop((296,174,1256,1374)).resize((1080,1350), Image.LANCZOS).save('projects/glass-effect-test/assets/eagle-crop.png')"
python3 .claude/skills/html-graphics/scripts/treat.py duotone projects/glass-effect-test/assets/eagle-crop.png -o projects/glass-effect-test/assets/eagle-warm.png --colors '#0b0302,#3d0d0a,#8e2417,#d06a3c,#f2c9a0' --levels 0,.93 --gamma .7
node .claude/skills/html-graphics/scripts/lettering.cjs "STAY|SHARP" -o projects/glass-effect-test/assets/title.svg --google "Archivo Black" --align justify --leading 0.86 --tracking -20 --width 984 --height 640 --fill '#000'
python3 .claude/skills/html-graphics/scripts/treat.py texture grain -o projects/glass-effect-test/assets/grain.png --size 1080x1350
node .claude/skills/html-graphics/scripts/render.cjs projects/glass-effect-test/glass.html
```
