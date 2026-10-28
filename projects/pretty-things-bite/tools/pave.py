"""Pavé texture: hex-packed round stones with varied brightness, fire and glints."""
import sys, random, math
import numpy as np
from PIL import Image, ImageDraw, ImageFilter

W, H, D = int(sys.argv[2]), int(sys.argv[3]), int(sys.argv[4])  # size, stone diameter (px)
out = sys.argv[1]
rnd = random.Random(9)
r = D / 2

def sprite(level, tint):
    s = D + 2
    yy, xx = np.mgrid[0:s, 0:s].astype(float)
    cx = cy = s / 2
    d = np.hypot(xx - cx, yy - cy) / r                      # 0 centre .. 1 rim
    hx, hy = cx - r * .3, cy - r * .32
    h = np.hypot(xx - hx, yy - hy) / r
    body = np.clip(1.05 - d * .9, 0, 1) ** 1.4 * level        # dome shading
    facets = .18 * np.sign(np.sin(np.arctan2(yy - cy, xx - cx) * 4)) * (1 - d)   # crude facet split
    spec = np.clip(1 - h * 3.2, 0, 1) ** 2                   # hot highlight
    v = np.clip(body + facets * level + spec, 0, 1)
    rgb = np.stack([v * tint[0], v * tint[1], v * tint[2]], -1)
    a = np.clip((1 - d) * r * .9, 0, 1)                      # antialiased rim
    return Image.fromarray(np.dstack([rgb * 255, a * 255]).astype(np.uint8), 'RGBA')

tints = [(1, 1, 1), (.93, .97, 1.08), (1.06, .96, 1.02), (.96, 1.05, 1), (1.04, 1.02, .9)]
sprites = [sprite(l, t) for l in (.55, .7, .82, .95) for t in tints]
img = Image.new('RGBA', (W, H), (12, 13, 17, 255))
step_x, step_y = D * 1.02, D * .9
row = 0
y = -D
while y < H + D:
    x = -D + (step_x / 2 if row % 2 else 0)
    while x < W + D:
        sp = rnd.choice(sprites)
        img.alpha_composite(sp, (int(round(x)), int(round(y))))
        x += step_x
    y += step_y; row += 1

glints = Image.new('RGBA', (W, H), (0, 0, 0, 0)); g = ImageDraw.Draw(glints)
for _ in range(int(W * H / 9000)):
    x, y, L = rnd.uniform(0, W), rnd.uniform(0, H), rnd.uniform(D * .6, D * 1.8)
    g.line([(x - L, y), (x + L, y)], fill=(255, 255, 255, 230), width=1)
    g.line([(x, y - L), (x, y + L)], fill=(255, 255, 255, 230), width=1)
    g.ellipse([x - 2, y - 2, x + 2, y + 2], fill=(255, 255, 255, 255))
img.alpha_composite(glints.filter(ImageFilter.GaussianBlur(.6)))
img.alpha_composite(glints)
img.convert('RGB').save(out)
print('wrote', out, img.size)
