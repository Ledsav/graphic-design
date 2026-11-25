"""Skater for example-skater.html.
  split : full-res cut-out (skater-cut2 alpha upscaled onto skater.jpg), shoe stripes / tongue logo / pocket logo
          knocked back, then split into the body and the board (they are separate in the photo).
  deck  : the board as a flat red silhouette, with photocopy ink kept only on the trucks and wheels
          (the deck graphic and its lettering are dropped).
python prep/skater.py split src/skater.jpg src/skater-cut2.png OUTDIR
python prep/skater.py deck OUTDIR/board.png OUTDIR/board-pc.png OUT.png"""
import sys
import numpy as np
from PIL import Image, ImageDraw, ImageFilter

K = 1.5  # skater-cut2.png is the photo at 2/3 size; polygons below are in its coordinates

def poly_mask(size, polys, ox=0, oy=0):
    m = Image.new("L", size, 0)
    d = ImageDraw.Draw(m)
    for p in polys:
        d.polygon([(x * K - ox, y * K - oy) for x, y in p], fill=255)
    return np.asarray(m, np.float32) / 255

BRAND = [  # shoe stripes (left, right), right tongue logo, shirt pocket logo
    [(749, 1315), (779, 1297), (807, 1297), (832, 1315), (839, 1345), (834, 1388), (814, 1388), (754, 1353)],
    [(1086, 1382), (1137, 1382), (1137, 1428), (1086, 1428)],
    [(1158, 1352), (1192, 1352), (1192, 1380), (1158, 1380)],
    [(1118, 900), (1218, 900), (1218, 946), (1118, 946)],
]
TRUCKS = [
    [(739, 1570), (794, 1570), (799, 1610), (779, 1640), (759, 1705), (744, 1745), (689, 1740), (686, 1700), (719, 1670), (744, 1610)],
    [(1144, 1617), (1199, 1617), (1199, 1665), (1184, 1690), (1189, 1750), (1194, 1800), (1139, 1805), (1124, 1750), (1129, 1690), (1149, 1665)],
]
SPLIT_Y = 1525          # between the feet and the board
BODY = (891, 970, 2400, int(SPLIT_Y * K))
BOARD = (891, int(SPLIT_Y * K), 2010, 2790)

if sys.argv[1] == "split":
    photo, cut, out = sys.argv[2:5]
    rgb = np.asarray(Image.open(photo).convert("RGB"), np.float32) / 255
    a = Image.open(cut).getchannel("A").resize((rgb.shape[1], rgb.shape[0]), Image.LANCZOS)
    a = np.asarray(a, np.float32) / 255
    m = poly_mask((rgb.shape[1], rgb.shape[0]), BRAND)[..., None]
    lum = (rgb @ np.array([.299, .587, .114], np.float32))[..., None]
    rgb = rgb * (1 - m) + np.minimum(rgb, .09 + lum * .08) * m      # whites down to shoe-black
    img = np.dstack([rgb, a])
    for name, box in (("body", BODY), ("board", BOARD)):
        x0, y0, x1, y1 = box
        Image.fromarray((img[y0:y1, x0:x1] * 255 + .5).astype(np.uint8), "RGBA").save(f"{out}/{name}.png")
        print(name, box)
elif sys.argv[1] == "deck":
    board, pc, out = sys.argv[2:5]
    b = Image.open(board)
    a = b.getchannel("A").filter(ImageFilter.MaxFilter(7)).filter(ImageFilter.MinFilter(7))   # close pin-holes
    a = np.asarray(a, np.float32) / 255
    a = np.where(a > .5, 1.0, a * 2)                                   # firm edge for a flat ink shape
    ink = np.asarray(Image.open(pc).convert("RGBA"), np.float32) / 255
    t = poly_mask(b.size, TRUCKS, BOARD[0], BOARD[1])
    red = np.array([.835, .165, .118], np.float32)
    ink_a = ink[..., 3] * t
    rgb = red * (1 - ink_a[..., None]) + ink[..., :3] * ink_a[..., None]
    Image.fromarray((np.dstack([rgb, np.maximum(a, ink_a)]) * 255 + .5).astype(np.uint8), "RGBA").save(out)
    print(out, b.size)
