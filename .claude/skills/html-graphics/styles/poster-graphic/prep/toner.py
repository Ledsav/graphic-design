"""Photocopy toner overlay (black on transparent, or paper-coloured dropouts that wear the black ink): fine speckle everywhere, denser grit toward the edges,
a few scuffed bands from the copier drum and sparse larger flecks. Multiply-free: use as a plain layer."""
import sys
import numpy as np
from PIL import Image, ImageFilter

out, W, H = sys.argv[1], int(sys.argv[2]), int(sys.argv[3])
rng = np.random.default_rng(int(sys.argv[4]) if len(sys.argv) > 4 else 11)
y, x = np.mgrid[0:H, 0:W].astype(np.float32)
edge = np.minimum(np.minimum(x, W - x), np.minimum(y, H - y)) / (0.12 * min(W, H))
edge = np.clip(1 - edge, 0, 1) ** 2                                  # 1 at the border, 0 inside
lowf = np.asarray(Image.fromarray((rng.random((H // 90 + 2, W // 90 + 2)) * 255).astype(np.uint8))
                  .resize((W, H), Image.BICUBIC), np.float32) / 255
band = np.zeros(H, np.float32)
for _ in range(5):                                                   # drum scuffs: soft horizontal bands
    c, w = rng.uniform(0, H), rng.uniform(6, 40)
    band += np.exp(-((np.arange(H) - c) / w) ** 2) * rng.uniform(.2, .6)
p = .006 + .10 * edge + .03 * lowf ** 3 + .025 * band[:, None] * rng.random((H, W)).astype(np.float32)
speck = (rng.random((H, W)) < p).astype(np.float32)
fleck = (rng.random((H, W)) < 0.000006).astype(np.uint8) * 255
fleck = np.asarray(Image.fromarray(fleck).filter(ImageFilter.MaxFilter(3)).filter(ImageFilter.GaussianBlur(.8)), np.float32) / 255
a = np.clip(speck * rng.uniform(.4, 1, (H, W)) + fleck * 1.5, 0, 1)
a = np.asarray(Image.fromarray((a * 255).astype(np.uint8)).filter(ImageFilter.GaussianBlur(.5)), np.float32) / 255
col = sys.argv[5].lstrip("#") if len(sys.argv) > 5 else "141210"           # pass the paper colour for ink dropouts
img = np.zeros((H, W, 4), np.uint8); img[..., :3] = tuple(int(col[i:i + 2], 16) for i in (0, 2, 4)); img[..., 3] = (np.clip(a * 1.3, 0, 1) * 255).astype(np.uint8)
Image.fromarray(img, "RGBA").save(out)
print(out, (W, H))
