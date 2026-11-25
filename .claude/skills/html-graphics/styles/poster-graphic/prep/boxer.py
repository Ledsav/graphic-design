"""Boxer cut-out for example.html: knock back the hoodie print and the glove emblem, drop the stray smear,
crop to the figure and scale to the export size. Then treat.py duotone does the colour (see style.md)."""
import sys
import numpy as np
from PIL import Image

SRC, OUT = sys.argv[1], sys.argv[2]          # src/boxer-clean.png -> assets/boxer-prep.png
im = np.asarray(Image.open(SRC).convert("RGBA")).astype(np.float32) / 255
rgb, a = im[..., :3], im[..., 3]
a[:, 1640:] = 0                               # residue of the wall edge to the right of the glove

def knock_back(x0, y0, x1, y1, keep=0.12, floor=0.10):
    """Pull everything brighter than the black fabric down to it, keeping a ghost of the texture."""
    r = rgb[y0:y1, x0:x1]
    lum = r @ np.array([.299, .587, .114], np.float32)
    fabric = np.array([.055, .05, .05], np.float32)
    w = np.clip((lum - floor) / .15, 0, 1)[..., None]           # only the print, not the folds
    ghost = fabric + (lum[..., None] - floor) * keep
    rgb[y0:y1, x0:x1] = r * (1 - w) + np.clip(ghost, 0, 1) * w

knock_back(985, 1150, 1300, 1470, keep=.02)           # chest print
knock_back(1295, 1680, 1375, 1815, keep=.2, floor=.14)   # glove emblem

out = Image.fromarray((np.dstack([rgb, a]) * 255 + .5).astype(np.uint8), "RGBA")
box = (480, 600, 1680, 2400)                  # hood to shins, with room for the fade
out = out.crop(box)
scale = float(sys.argv[3]) if len(sys.argv) > 3 else 1.4
out = out.resize((round(out.width * scale), round(out.height * scale)), Image.LANCZOS)
out.save(OUT)
print(OUT, out.size, "crop", box, "scale", scale)
