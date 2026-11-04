"""Replace the colour of a cut-out's soft edge pixels with colour pulled from inside the subject,
so no wall colour shows as a halo when the cut-out sits over a different background.
Usage: python3 tools/defringe.py in.png out.png"""
import sys
import numpy as np
from PIL import Image
from scipy import ndimage

im = np.asarray(Image.open(sys.argv[1]).convert('RGBA')).astype(np.float32)
rgb, a = im[..., :3], im[..., 3] / 255
solid = (a > .97).astype(np.float32)
solid = ndimage.binary_erosion(solid > 0, iterations=2).astype(np.float32)  # skip the outermost solid ring too
est = np.zeros_like(rgb)
for sigma in (2, 5, 12):
    w = ndimage.gaussian_filter(solid, sigma)
    for c in range(3):
        est_c = ndimage.gaussian_filter(rgb[..., c] * solid, sigma) / np.maximum(w, 1e-4)
        est[..., c] = np.where((est[..., c] == 0) & (w > 1e-3), est_c, est[..., c])
edge = (a < .97)[..., None]
out = np.where(edge, est, rgb)
Image.fromarray(np.dstack([out, a * 255]).clip(0, 255).astype(np.uint8)).save(sys.argv[2])
print('wrote', sys.argv[2])
