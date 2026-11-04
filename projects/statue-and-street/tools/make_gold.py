"""Gold foil texture and a thin eight-point star (used as a CSS mask).
Usage: python3 tools/make_gold.py  (run from projects/statue-and-street)"""
import math
import numpy as np
from PIL import Image
from scipy import ndimage

rng = np.random.default_rng(11)
N = 1400
field = np.zeros((N, N))
for sigma, w in [(90, 1.0), (28, .55), (7, .25), (1.2, .12)]:
    f = ndimage.gaussian_filter(rng.standard_normal((N, N)), sigma)
    field += w * f / f.std()
yy, xx = np.mgrid[0:N, 0:N] / N
field = (field - field.min()) / (field.max() - field.min())
field = .62 * field + .38 * (np.sin((xx * 1.1 + yy * .6) * math.pi * 1.6) * .5 + .5)
stops = [(0, (86, 58, 14)), (.3, (150, 106, 32)), (.5, (204, 160, 70)),
         (.66, (238, 208, 132)), (.78, (255, 241, 196)), (.9, (214, 176, 88)), (1, (122, 86, 24))]
pos = np.array([s[0] for s in stops]); cols = np.array([s[1] for s in stops], float)
rgb = np.stack([np.interp(field, pos, cols[:, c]) for c in range(3)], -1)
Image.fromarray(rgb.clip(0, 255).astype(np.uint8)).save('assets/foil.png')

# star: thin kites from the centre; long N-S, shorter E-W, short diagonals
rays = [(-90, 210, 7), (90, 210, 7), (0, 128, 6), (180, 128, 6),
        (-45, 62, 4), (45, 62, 4), (135, 62, 4), (-135, 62, 4)]
paths = []
for ang, length, w in rays:
    a = math.radians(ang); ux, uy = math.cos(a), math.sin(a); px, py = -uy, ux
    pts = [(ux * length, uy * length), (px * w, py * w), (-ux * w, -uy * w), (-px * w, -py * w)]
    paths.append('M' + ' L'.join(f'{x:.2f},{y:.2f}' for x, y in pts) + 'Z')
svg = ('<svg xmlns="http://www.w3.org/2000/svg" viewBox="-130 -212 260 424" width="260" height="424">'
       f'<path fill="#000" d="{" ".join(paths)}"/></svg>')
open('assets/star.svg', 'w').write(svg)
print('ok')
