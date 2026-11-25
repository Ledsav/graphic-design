"""Canvas-weave overlay (mid-grey, for mix-blend-mode: overlay/soft-light): fine warp and weft threads with
uneven thickness per thread, plus slow blotches, like a poster printed on textured stock.
python prep/canvas.py OUT.png W H [period]"""
import sys
import numpy as np
from PIL import Image, ImageFilter

out, W, H = sys.argv[1], int(sys.argv[2]), int(sys.argv[3])
period = float(sys.argv[4]) if len(sys.argv) > 4 else 5.0
rng = np.random.default_rng(3)
y, x = np.mgrid[0:H, 0:W].astype(np.float32)
warp = np.sin(x * 2 * np.pi / period)
weft = np.sin(y * 2 * np.pi / (period * 1.07))
thick_x = rng.normal(0, 1, W).astype(np.float32); thick_y = rng.normal(0, 1, H).astype(np.float32)
v = .5 * warp * (1 + .25 * thick_x[None, :]) + .5 * weft * (1 + .25 * thick_y[:, None])
noise = rng.normal(0, 1, (H, W)).astype(np.float32)
blot = np.asarray(Image.fromarray((rng.random((H // 64 + 2, W // 64 + 2)) * 255).astype(np.uint8)).resize((W, H), Image.BICUBIC), np.float32) / 255 - .5
g = 128 + v * 14 + noise * 9 + blot * 22
img = Image.fromarray(np.clip(g, 0, 255).astype(np.uint8), "L").filter(ImageFilter.GaussianBlur(.6))
img.save(out)
print(out, img.size)
