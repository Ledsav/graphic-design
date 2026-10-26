# Imagery

HTML and CSS draw type, shapes, patterns and effects. Photographs and illustrations have to come from somewhere. Settle this before designing: a poster built around a weak or unlicensed image fails however good the type is.

## Where images come from, in order

1. **The user's own assets.** Photos they took or commissioned, their illustrations, brand imagery. Ask first; it is always the best source.
2. **AI generation**, when the user has an image model available. The `design` skill's generators need `GEMINI_API_KEY` (or MuAPI / Atlas Cloud keys). Write prompts for poster use:
   - "studio photograph of <subject> on a plain mid-grey background, dramatic side light, high contrast, sharp focus, no text": plain backgrounds cut out cleanly.
   - For illustration: "flat screen-print illustration of <subject>, 4 flat colours (<hexes>), bold shapes, no gradients, no text, plain background".
   - Generate at the largest size available, never with text in the image (set type in HTML), and say in the hand-off that the image is AI-generated.
3. **Public domain and CC0 collections.** Free for any use, no attribution required (credit is still good practice). Classical sculpture, masks, engravings, botanical plates, space photography.
   - **The Met Open Access** (no key). Search, then check `isPublicDomain` and take `primaryImage`:
     ```bash
     curl -s 'https://collectionapi.metmuseum.org/public/collection/v1/search?hasImages=true&q=marble%20head'
     curl -s 'https://collectionapi.metmuseum.org/public/collection/v1/objects/<objectID>'
     ```
   - **Art Institute of Chicago** (no key). Public-domain works are CC0; images come from IIIF:
     ```bash
     curl -sg 'https://api.artic.edu/api/v1/artworks/search?q=mask&query[term][is_public_domain]=true&fields=id,title,image_id&limit=10'
     curl -so assets/mask.jpg 'https://www.artic.edu/iiif/2/<image_id>/full/1686,/0/default.jpg'
     ```
   - **NASA Image and Video Library** (images.nasa.gov): generally public domain; check each item's notes and avoid NASA logos.
   - **Wikimedia Commons**: check each file's licence; only public domain or CC0 is safe without attribution.
   - **Rijksmuseum, Smithsonian Open Access, Cleveland Museum of Art**: CC0 open access (Rijksmuseum and Smithsonian need a free API key).
4. **Free stock** (Unsplash, Pexels). Their licences allow commercial use without attribution, but not implied endorsement by people pictured, and not trademarks or artwork shown in the photo.

Record every external image in `projects/<project>/assets/CREDITS.md`: source URL, author, licence, date fetched.

**Never:** pull images from Google Images, Pinterest, Instagram or other people's posters; use film or game characters, masks, logos or celebrities the user has no rights to; trace or reuse elements of reference images the user shares. Reference images set the genre and the quality bar, nothing more.

**Cloud sessions:** the network policy may block image hosts. If a download is refused, tell the user which host to allow (environment settings, Network access, Allowed domains) and carry on with the parts that don't need it.

## Preparing an image

All in `scripts/treat.py` (Pillow + numpy). Treat at the final pixel size (`--width`): halftone and photocopy hide low resolution, smooth photos don't.

| Need | Command |
|---|---|
| Subject without background | `treat.py cutout in.jpg -o subject.png` |
| Sticker / die-cut border | CSS `filter: url(#sticker)`, or `treat.py outline subject.png -o sticker.png --size 18` |
| Halftone, dark dots on paper | `treat.py halftone in.jpg -o out.png --width 2160 --cell 14 --ink '#111' --paper '#f2e33a'` |
| Halftone, light dots on dark | `... --invert --ink '#f2e33a' --paper '#121212'` |
| Halftone only (transparent) | `... --paper none` |
| Photocopy / xerox | `treat.py photocopy in.jpg -o out.png --width 2160 --levels .1,.9` (add `--invert` for light ink on dark) |
| Duotone / gradient map | `treat.py duotone in.jpg -o out.png --colors '#0c1014,#3a4a50,#d9d4c7'` |
| Riso print of a photo or a finished poster | `treat.py riso in.png -o out.png --inks '#e8412c,#2f4b7c' --paper '#f1ece2'` |
| Torn paper edges | `treat.py torn in.png -o out.png --edges top,bottom --depth 60` |
| Overlays | `treat.py texture grain|paper|dust|folds|grunge -o t.png --size 1080x1350` |

Overlay blend modes: `grain` and `folds` are grey-centred (use `mix-blend-mode: overlay` or `soft-light`), `paper` is near-white (`multiply`), `dust` and `grunge` are transparent PNGs in the colour you pass (normal blending).

### Cut-outs

`cutout` uses [rembg](https://github.com/danielgatis/rembg) when it is installed (`pip install rembg onnxruntime`), else a flood fill from the image edges that works for plain backgrounds (museum objects, studio shots, generated images on grey).

- The default model is `isnet-general-use` (Apache-2.0, about 170 MB, downloaded on first use). `--model birefnet-general` is sharper on hair and fine edges (MIT, about 900 MB).
- Don't use `bria-rmbg`: rembg's own default model is licensed for non-commercial use only.
- Always check the edges in the render: halos show on dark backgrounds. The sticker border hides small flaws.

### Finding positions on a cut-out

To put a ring around a head or text beside a shoulder, measure the subject instead of guessing:

```bash
python3 -c "
from PIL import Image; import numpy as np
a = np.asarray(Image.open('assets/subject.png').getchannel('A')); ys, xs = np.nonzero(a > 128)
print('bbox', xs.min(), ys.min(), xs.max(), ys.max())
top = ys.min(); head = ys < top + a.shape[0] * 0.15; print('head x', xs[head].min(), xs[head].max())"
```

Scale those pixel positions by the image's displayed width over its natural width, add its offset, render, and adjust.
