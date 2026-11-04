"""Prepare the Winged Victory photo for halftone: local contrast, clean matte.
Usage: python3 tools/prep_victory.py <out_dir> <clip_limit> <gamma>"""
import sys
import numpy as np
from PIL import Image, ImageFilter
from scipy import ndimage
from skimage import exposure

out, clip, gamma = sys.argv[1], float(sys.argv[2]), float(sys.argv[3])
BOX = (1000, 300, 3000, 2624)
src = Image.open('src/victory.jpg').convert('L').crop(BOX)
cut = Image.open('assets/victory-cut.png').crop(BOX)

# matte: keep the largest blob (drops the hanging wire and specks), shrink 2 px
a = np.asarray(cut.getchannel('A')).astype(np.float32) / 255
lab, n = ndimage.label(a > .5)
sizes = ndimage.sum(np.ones_like(a), lab, range(1, n + 1))
keep = lab == (np.argmax(sizes) + 1)
keep = ndimage.binary_fill_holes(keep)
keep = ndimage.binary_erosion(keep, iterations=2)
alpha = Image.fromarray((keep * 255).astype(np.uint8)).filter(ImageFilter.GaussianBlur(0.6))

# tone: stretch inside the statue, then adaptive equalisation for the drapery
g = np.asarray(src).astype(np.float32) / 255
lo, hi = np.percentile(g[keep], [1, 99.5])
g = np.clip((g - lo) / (hi - lo), 0, 1)
g = exposure.equalize_adapthist(g, clip_limit=clip, kernel_size=160)
g = g ** gamma
mean = g[keep].mean()
g[~keep] = mean  # neutral outside so no halo forms at the edge
Image.fromarray((g * 255).astype(np.uint8)).save(f'{out}/victory-tone.png')
alpha.save(f'{out}/victory-alpha.png')
print('mean tone inside', round(float(mean), 3))
