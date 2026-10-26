#!/usr/bin/env python3
"""Image treatments for poster graphics: the print-era looks CSS can't fake well.

  halftone   AM dot/line/square screen at any angle; ink on paper, or ink on transparent
  photocopy  hard black-and-white with toner noise, grit and specks (xerox, zine, punk)
  duotone    gradient map through 2-4 colours
  riso       two-ink risograph print: separation, grain, uneven ink, misregistration
  cutout     subject on a transparent background (rembg if installed, else flood from the edges)
  outline    sticker border around a cut-out
  torn       torn-paper edges with a fibrous paper rim
  contour    a cut-out's silhouette as an SVG path, for text that follows the figure
  texture    procedural overlays: grain, paper, dust, folds, grunge

Every photo command takes --width (resize before treating: halftone and photocopy
hide low resolution, so treat at the final pixel size) and tone controls
--levels BLACK,WHITE and --gamma. Outputs are PNG. Requires Pillow and numpy.

Examples:
  treat.py halftone in.jpg -o out.png --width 2160 --cell 14 --angle 45 --ink '#111' --paper none
  treat.py photocopy statue.jpg -o statue.png --width 2160 --levels .15,.85 --paper none
  treat.py riso poster.png -o poster-riso.png --inks '#e8412c,#3d5a80' --paper '#f1ece2'
  treat.py texture folds -o folds.png --size 2160x3840 --folds 2x3
"""

import argparse
import sys

import numpy as np
from PIL import Image, ImageChops, ImageDraw, ImageFilter


# ---------- helpers ----------

def rgb(hexstr):
    h = hexstr.strip().lstrip("#")
    if len(h) == 3:
        h = "".join(c * 2 for c in h)
    if len(h) != 6:
        raise argparse.ArgumentTypeError(f"bad colour {hexstr!r}; use #rrggbb")
    return np.array([int(h[i:i + 2], 16) for i in (0, 2, 4)], dtype=np.float32) / 255


def colour_or_none(text):
    return None if text.lower() in ("none", "transparent") else rgb(text)


def colours(text):
    return [rgb(c) for c in text.split(",")]


def pair(text, cast=float):
    a, b = text.split(",")
    return cast(a), cast(b)


def size(text):
    w, h = text.lower().split("x")
    return int(w), int(h)


def load(path, width=None, flatten=None):
    img = Image.open(path)
    img = img.convert("RGBA") if "A" in img.getbands() or "transparency" in img.info else img.convert("RGB")
    if flatten is not None and img.mode == "RGBA":
        base = Image.new("RGBA", img.size, tuple(int(c * 255) for c in flatten) + (255,))
        img = Image.alpha_composite(base, img).convert("RGB")
    if width and width != img.width:
        img = img.resize((width, round(img.height * width / img.width)), Image.LANCZOS)
    return img


def gray(img, levels=(0.0, 1.0), gamma=1.0, blur=0.0):
    """Luminance in 0..1 (1 = white) after levels and gamma."""
    g = img.convert("L")
    if blur > 0:
        g = g.filter(ImageFilter.GaussianBlur(blur))
    a = np.asarray(g, dtype=np.float32) / 255
    lo, hi = levels
    a = np.clip((a - lo) / max(hi - lo, 1e-6), 0, 1)
    return a ** gamma


def alpha_of(img):
    return np.asarray(img.getchannel("A"), dtype=np.float32) / 255 if img.mode == "RGBA" else None


def compose(cover, ink, paper, src_alpha=None):
    """Ink coverage (0..1) -> RGB on paper, or RGBA ink when paper is None."""
    cover = np.clip(cover, 0, 1)
    if paper is None:
        a = cover if src_alpha is None else cover * src_alpha
        out = np.dstack([np.broadcast_to(ink, cover.shape + (3,)), a[..., None]])
        return Image.fromarray((out * 255 + 0.5).astype(np.uint8), "RGBA")
    out = paper * (1 - cover[..., None]) + ink * cover[..., None]
    if src_alpha is not None:
        out = np.dstack([out, src_alpha])
        return Image.fromarray((out * 255 + 0.5).astype(np.uint8), "RGBA")
    return Image.fromarray((out * 255 + 0.5).astype(np.uint8), "RGB")


def noise(shape, scale, rng):
    """Smooth value noise in 0..1 with features about `scale` px across."""
    h, w = shape
    sw, sh = max(2, int(w / max(scale, 1)) + 2), max(2, int(h / max(scale, 1)) + 2)
    small = Image.fromarray((rng.random((sh, sw)) * 255).astype(np.uint8))
    return np.asarray(small.resize((w, h), Image.BICUBIC), dtype=np.float32) / 255


def fractal(shape, scale, rng, octaves=4):
    total, amp, norm = np.zeros(shape, np.float32), 1.0, 0.0
    for i in range(octaves):
        total += amp * noise(shape, scale / 2 ** i, rng)
        norm += amp
        amp *= 0.5
    return total / norm


def uniform(a):
    """Rank-normalise to a uniform 0..1 distribution (for dithering thresholds)."""
    flat = a.ravel()
    ranks = np.empty(flat.size, np.float32)
    ranks[np.argsort(flat, kind="stable")] = np.linspace(0, 1, flat.size, dtype=np.float32)
    return ranks.reshape(a.shape)


def save(img, path):
    img.save(path)
    print(f"Wrote {path} ({img.width} x {img.height}, {img.mode})")


# ---------- commands ----------

def cmd_halftone(a):
    img = load(a.image, a.width, a.flatten)
    g = gray(img, a.levels, a.gamma, blur=a.cell * 0.3)
    d = g if a.invert else 1 - g                      # ink coverage wanted per pixel
    h, w = d.shape
    yy, xx = np.mgrid[0:h, 0:w].astype(np.float32)
    t = np.deg2rad(a.angle)
    u = (xx * np.cos(t) + yy * np.sin(t)) / a.cell
    v = (-xx * np.sin(t) + yy * np.cos(t)) / a.cell
    fu, fv = u - np.floor(u) - 0.5, v - np.floor(v) - 0.5
    if a.shape == "dot":                              # dot area = coverage: 2r^2 = d
        dist = (np.hypot(fu, fv) - np.sqrt(d / 2)) * a.cell
    elif a.shape == "line":
        dist = (np.abs(fv) - d / 2) * a.cell
    else:                                             # square
        dist = (np.maximum(np.abs(fu), np.abs(fv)) - np.sqrt(d) / 2) * a.cell
    cover = np.clip(0.5 - dist, 0, 1)                 # 1px analytic anti-aliasing
    cover[d < 0.01] = 0
    save(compose(cover, a.ink, a.paper, alpha_of(img)), a.output)


def cmd_photocopy(a):
    img = load(a.image, a.width, a.flatten)
    rng = np.random.default_rng(a.seed)
    g = gray(img, a.levels, a.gamma)
    if a.invert:
        g = 1 - g
    grit = (rng.normal(0, 1, g.shape) * 0.6 + (noise(g.shape, 3, rng) - 0.5) * 3) * a.grit
    v = g + grit * 0.18
    cover = np.clip((a.threshold - v) / 0.03 + 0.5, 0, 1)
    # toner specks in the light areas, dropouts in the dark ones
    specks = rng.random(g.shape) < a.specks * 0.002
    blobs = Image.fromarray((specks * 255).astype(np.uint8)).filter(ImageFilter.GaussianBlur(1.2))
    blobs = np.asarray(blobs, np.float32) / 255 > 0.08
    cover = np.maximum(cover, blobs * (g > a.threshold))
    holes = noise(g.shape, 2, rng) > 1 - a.specks * 0.05
    cover = np.where(holes & (cover > 0.5), cover * 0.0, cover)
    save(compose(cover, a.ink, a.paper, alpha_of(img)), a.output)


def cmd_duotone(a):
    img = load(a.image, a.width, a.flatten)
    g = gray(img, a.levels, a.gamma)
    stops = a.colors
    pos = np.linspace(0, 1, len(stops))
    out = np.dstack([np.interp(g, pos, [c[i] for c in stops]) for i in range(3)])
    src_alpha = alpha_of(img)
    if src_alpha is not None:
        out = np.dstack([out, src_alpha])
    save(Image.fromarray((out * 255 + 0.5).astype(np.uint8), "RGBA" if src_alpha is not None else "RGB"), a.output)


def cmd_riso(a):
    img = load(a.image, a.width, a.flatten)
    rng = np.random.default_rng(a.seed)
    paper = a.paper
    ink_a, ink_b = a.inks
    src = np.asarray(img.convert("RGB"), np.float32) / 255
    h, w, _ = src.shape
    if a.split == "luma":
        d = 1 - gray(img, a.levels, a.gamma)
        cov = [d, np.clip((d - 0.45) / 0.55, 0, 1)]
    else:                                             # unmix each pixel into the two inks
        da, db = paper - paper * ink_a, paper - paper * ink_b
        m = np.stack([da, db], axis=1)                # 3x2
        pinv = np.linalg.pinv(m)                      # 2x3
        cov_ab = np.einsum("ij,hwj->hwi", pinv, paper - src)
        cov = [np.clip(cov_ab[..., 0], 0, 1), np.clip(cov_ab[..., 1], 0, 1)]
    layers = []
    for i, c in enumerate(cov):
        thresh = uniform(noise((h, w), a.grain_size, rng) * 0.6 + rng.random((h, w)) * 0.4)
        dither = (c > thresh).astype(np.float32)
        c = (1 - a.grain) * c + a.grain * dither
        c *= 1 - a.uneven * fractal((h, w), max(h, w) / 3, rng, 3)   # uneven drum ink
        layers.append(c)
    dx, dy = a.offset
    layers[1] = np.roll(layers[1], (dy, dx), axis=(0, 1))
    out = paper * (1 - layers[0][..., None] * (1 - ink_a)) * (1 - layers[1][..., None] * (1 - ink_b))
    save(Image.fromarray((np.clip(out, 0, 1) * 255 + 0.5).astype(np.uint8), "RGB"), a.output)


def cmd_cutout(a):
    img = load(a.image, a.width, a.flatten).convert("RGB")
    if a.method in ("auto", "rembg"):
        try:
            from rembg import new_session, remove
            out = remove(img, session=new_session(a.model))
            save(out, a.output)
            return
        except ImportError:
            if a.method == "rembg":
                sys.exit("rembg is not installed: pip install rembg onnxruntime")
    arr = np.asarray(img, np.float32)
    border = np.concatenate([arr[0], arr[-1], arr[:, 0], arr[:, -1]])
    bg = np.median(border, axis=0)
    similar = np.linalg.norm(arr - bg, axis=2) < a.tolerance
    allowed = Image.fromarray((similar * 255).astype(np.uint8))

    def edges(mask):
        m = np.zeros(mask.shape, np.uint8)
        m[0], m[-1], m[:, 0], m[:, -1] = mask[0], mask[-1], mask[:, 0], mask[:, -1]
        return Image.fromarray(m)

    def grow(cur, allowed):
        """Background region: grow seeds through allowed pixels until it stops changing."""
        cur = ImageChops.multiply(cur, allowed)
        for i in range(100000):
            grown = ImageChops.multiply(cur.filter(ImageFilter.MaxFilter(5)), allowed)
            if i % 8 == 7 and ImageChops.difference(grown, cur).getbbox() is None:
                return grown
            cur = grown
        return cur

    # Coarse pass on a small copy, then finish at full size from that head start.
    h, w = similar.shape
    f = max(1, int(np.ceil(max(w, h) / 400)))
    seed = edges(np.asarray(allowed))
    if f > 1:
        small_allowed = allowed.resize((w // f, h // f), Image.BOX).point(lambda v: 255 if v > 250 else 0)
        small = grow(edges(np.asarray(small_allowed)), small_allowed)
        seed = ImageChops.lighter(seed, small.resize((w, h), Image.NEAREST).filter(ImageFilter.MinFilter(3)))
    alpha = ImageChops.invert(grow(seed, allowed))
    alpha = alpha.filter(ImageFilter.MinFilter(3)).filter(ImageFilter.GaussianBlur(a.feather))
    out = img.convert("RGBA")
    out.putalpha(alpha)
    print(f"Background {bg.astype(int).tolist()} removed by flood fill; check the edges, "
          "and use rembg (pip install rembg onnxruntime) for busy backgrounds.")
    save(out, a.output)


def cmd_outline(a):
    img = Image.open(a.image).convert("RGBA")
    pad = a.size * 2
    canvas = Image.new("RGBA", (img.width + 2 * pad, img.height + 2 * pad), (0, 0, 0, 0))
    canvas.paste(img, (pad, pad))
    alpha = canvas.getchannel("A").point(lambda v: 255 if v > 128 else 0)
    grown = alpha.filter(ImageFilter.GaussianBlur(a.size / 2))
    grown = grown.point(lambda v: 255 if v > 10 else 0).filter(ImageFilter.GaussianBlur(0.8))
    border = Image.new("RGBA", canvas.size, tuple(int(c * 255) for c in a.color) + (255,))
    border.putalpha(grown)
    border.alpha_composite(canvas)
    save(border.crop(border.getbbox()) if a.trim else border, a.output)


def cmd_torn(a):
    img = load(a.image, a.width, a.flatten).convert("RGBA")
    rng = np.random.default_rng(a.seed)
    w, h = img.size
    alpha = np.asarray(img.getchannel("A"), np.float32) / 255
    rgbarr = np.asarray(img.convert("RGB"), np.float32) / 255
    rim = np.zeros((h, w), np.float32)
    yy, xx = np.mgrid[0:h, 0:w]
    for edge in a.edges.split(","):
        n = w if edge in ("top", "bottom") else h
        line = fractal((1, n), n / 6, rng, 5)[0]
        jag = rng.random(n) * 0.25
        depth = a.depth * (0.35 + line * 0.8 + jag)
        fiber = depth + a.rim * (0.6 + rng.random(n) * 0.8)
        pos = {"top": yy, "bottom": h - 1 - yy, "left": xx, "right": w - 1 - xx}[edge]
        idx = xx if edge in ("top", "bottom") else yy
        alpha = np.where(pos < depth[idx], 0, alpha)
        rim = np.maximum(rim, (pos >= depth[idx]) & (pos < fiber[idx]))
    rimc = a.rim_color
    out = rgbarr * (1 - rim[..., None]) + rimc * rim[..., None]
    out = np.dstack([out, alpha])
    res = Image.fromarray((out * 255 + 0.5).astype(np.uint8), "RGBA")
    a_ch = res.getchannel("A").filter(ImageFilter.GaussianBlur(0.6))
    res.putalpha(a_ch)
    save(res, a.output)


def cmd_contour(a):
    """Trace a cut-out's silhouette (offset outward) as an SVG path for text to follow."""
    img = Image.open(a.image).convert("RGBA")
    w, h = img.size
    alpha = img.getchannel("A").point(lambda v: 255 if v > 128 else 0)
    if a.offset + a.round > 0:                     # grow by offset + round, then shrink by round: fills tight concave corners
        alpha = alpha.filter(ImageFilter.GaussianBlur((a.offset + a.round) / 2)).point(lambda v: 255 if v > 10 else 0)
    if a.round > 0:
        alpha = alpha.filter(ImageFilter.GaussianBlur(a.round / 2)).point(lambda v: 255 if v > 245 else 0)
    f = max(1.0, max(w, h) / 500)
    small = alpha.resize((max(1, round(w / f)), max(1, round(h / f))), Image.BOX).point(lambda v: 255 if v > 127 else 0)
    m = np.pad(np.asarray(small) > 0, 1)
    if not m.any():
        sys.exit("no opaque pixels to trace")
    ys, xs = np.nonzero(m)
    k = np.lexsort((xs, ys))[0]
    start = (int(ys[k]), int(xs[k]))
    ring = [(0, -1), (-1, -1), (-1, 0), (-1, 1), (0, 1), (1, 1), (1, 0), (1, -1)]
    pts, cur, back = [start], start, 0                 # Moore-neighbour tracing, clockwise
    for _ in range(400000):
        for step in range(8):
            d = (back + step) % 8
            ny, nx = cur[0] + ring[d][0], cur[1] + ring[d][1]
            if m[ny, nx]:
                pd = (back + step - 1) % 8
                by, bx = cur[0] + ring[pd][0], cur[1] + ring[pd][1]
                cur, back = (ny, nx), ring.index((by - ny, bx - nx))
                break
        else:
            break
        if cur == start:
            break
        pts.append(cur)
    pts = np.array([((x - 1 + 0.5) * f, (y - 1 + 0.5) * f) for y, x in pts], np.float64)
    pts = pts[:: max(1, len(pts) // 240)]
    closed = a.part == "full"
    if not closed:                                    # left-most to right-most point over the top (or under the bottom)
        i0, i1 = int(np.argmin(pts[:, 0])), int(np.argmax(pts[:, 0]))
        seg1 = np.concatenate([pts[i0:], pts[:i1 + 1]]) if i0 > i1 else pts[i0:i1 + 1]
        seg2 = np.concatenate([pts[i1:], pts[:i0 + 1]]) if i1 > i0 else pts[i1:i0 + 1]
        seg2 = seg2[::-1]
        pick_top = a.part == "top"
        pts = seg1 if (seg1[:, 1].mean() < seg2[:, 1].mean()) == pick_top else seg2
    for _ in range(a.smooth):                         # Chaikin corner cutting
        q = 0.75 * pts + 0.25 * np.roll(pts, -1, axis=0)
        r = 0.25 * pts + 0.75 * np.roll(pts, -1, axis=0)
        sm = np.empty((len(pts) * 2, 2))
        sm[0::2], sm[1::2] = q, r
        pts = sm if closed else np.vstack([pts[:1], sm[:-2], pts[-1:]])
    d = "M" + " L".join(f"{x:.1f} {y:.1f}" for x, y in pts) + ("Z" if closed else "")
    length = float(np.sum(np.hypot(*np.diff(np.vstack([pts, pts[:1]]) if closed else pts, axis=0).T)))
    svg = (f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {w} {h}" width="{w}" height="{h}">'
           f'<path id="contour" d="{d}" fill="none" stroke="#ff0066" stroke-width="3"/></svg>\n')
    with open(a.output, "w") as fh:
        fh.write(svg)
    print(f"Wrote {a.output}: {a.part} contour, {len(pts)} points, length {length:.0f}px in a {w}x{h} viewBox "
          "(place it over the image box; use the path d in a <textPath>)")


def cmd_texture(a):
    w, h = a.size
    rng = np.random.default_rng(a.seed)
    k = a.kind
    if k == "grain":                                  # grey-centred: use mix-blend-mode overlay / soft-light
        g = 0.5 + (rng.normal(0, 1, (h, w)) * 0.7 + (noise((h, w), 2, rng) - 0.5) * 1.2) * 0.12 * a.strength
        img = Image.fromarray((np.clip(g, 0, 1) * 255).astype(np.uint8)).convert("RGB")
    elif k == "paper":                                # near-white: use multiply
        mottle = fractal((h, w), max(w, h) / 4, rng, 5)
        fibres = noise((h, w), 1.5, rng) * 0.5 + noise((h, w), 6, rng) * 0.5
        g = 1 - (mottle * 0.06 + (fibres - 0.5) ** 2 * 0.25) * a.strength
        img = Image.fromarray((np.clip(g, 0, 1) * 255).astype(np.uint8)).convert("RGB")
    elif k == "dust":                                 # transparent specks, hairs and scratches
        img = Image.new("RGBA", (w, h), (0, 0, 0, 0))
        dr = ImageDraw.Draw(img)
        col = tuple(int(c * 255) for c in a.color)
        for _ in range(int(w * h / 4000 * a.strength)):
            x, y, r = rng.random() * w, rng.random() * h, rng.random() ** 3 * 3 + 0.4
            dr.ellipse((x - r, y - r, x + r, y + r), fill=col + (int(120 + rng.random() * 135),))
        for _ in range(int(12 * a.strength)):
            x, y = rng.random() * w, rng.random() * h
            pts = [(x, y)]
            ang = rng.random() * 6.28
            for _ in range(int(6 + rng.random() * 18)):
                ang += rng.normal(0, 0.25)
                x, y = x + np.cos(ang) * 6, y + np.sin(ang) * 6
                pts.append((x, y))
            dr.line(pts, fill=col + (150,), width=1)
        for _ in range(int(6 * a.strength)):
            x, y = rng.random() * w, rng.random() * h
            ln, ang = 40 + rng.random() * 300, rng.normal(np.pi / 2, 0.08)
            dr.line([(x, y), (x + np.cos(ang) * ln, y + np.sin(ang) * ln)], fill=col + (90,), width=1)
        img = img.filter(ImageFilter.GaussianBlur(0.35))
    elif k == "folds":                                # grey-centred creases: use overlay / soft-light
        cols, rows = a.folds
        g = np.full((h, w), 0.5, np.float32)
        yy, xx = np.mgrid[0:h, 0:w].astype(np.float32)
        wobble = (fractal((h, w), 300, rng, 3) - 0.5) * 8
        for i in range(1, cols):
            x0 = w * i / cols + wobble
            dist = xx - x0
            g += np.exp(-(dist / 2.2) ** 2) * 0.28 - np.exp(-((dist - 3) / 2.5) ** 2) * 0.22
            g += np.sign(dist) * np.exp(-np.abs(dist) / (w / cols / 2)) * 0.035
        for i in range(1, rows):
            y0 = h * i / rows + wobble
            dist = yy - y0
            g += np.exp(-(dist / 2.2) ** 2) * 0.28 - np.exp(-((dist - 3) / 2.5) ** 2) * 0.22
            g += np.sign(dist) * np.exp(-np.abs(dist) / (h / rows / 2)) * 0.035
        g += (fractal((h, w), 200, rng, 4) - 0.5) * 0.06
        g = 0.5 + (g - 0.5) * a.strength
        img = Image.fromarray((np.clip(g, 0, 1) * 255).astype(np.uint8)).convert("RGB")
    else:                                             # grunge: dark blotches and roller streaks on transparent
        blot = fractal((h, w), max(w, h) / 6, rng, 7) + (rng.random((h, w)) - 0.5) * 0.08
        fine = noise((h, w), 1.5, rng)
        streak = noise((h, 1), 2, rng)[:, :1] * np.ones((1, w), np.float32)
        a_ = np.clip((blot - 0.6) * 14, 0, 1) * (0.55 + 0.45 * fine)       # hard-edged, mottled ink
        a_ = np.maximum(a_, np.clip((streak - 0.82) * 6, 0, 1) * 0.35 * fine)
        a_ *= a.strength
        col = a.color
        out = np.dstack([np.broadcast_to(col, (h, w, 3)), np.clip(a_, 0, 1)])
        img = Image.fromarray((out * 255).astype(np.uint8), "RGBA")
    save(img, a.output)


# ---------- CLI ----------

def main():
    p = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    sub = p.add_subparsers(dest="cmd", required=True)

    def photo(name, help_):
        sp = sub.add_parser(name, help=help_)
        sp.add_argument("image")
        sp.add_argument("-o", "--output", required=True)
        sp.add_argument("--width", type=int, help="resize to this width first (final pixel size)")
        sp.add_argument("--levels", type=pair, default=(0.0, 1.0), help="black,white points 0..1 (default 0,1)")
        sp.add_argument("--gamma", type=float, default=1.0, help=">1 darkens midtones, <1 lightens")
        sp.add_argument("--flatten", type=rgb, help="put a transparent image on this colour first")
        sp.add_argument("--seed", type=int, default=7)
        return sp

    sp = photo("halftone", "AM halftone screen")
    sp.add_argument("--cell", type=float, default=12, help="screen cell size in px (default 12)")
    sp.add_argument("--angle", type=float, default=45)
    sp.add_argument("--shape", choices=["dot", "line", "square"], default="dot")
    sp.add_argument("--ink", type=rgb, default=rgb("#111111"))
    sp.add_argument("--paper", type=colour_or_none, default=rgb("#ffffff"), help="hex or none")
    sp.add_argument("--invert", action="store_true", help="dots carry the light (light ink on dark paper)")
    sp.set_defaults(func=cmd_halftone)

    sp = photo("photocopy", "hard black-and-white with toner grit")
    sp.add_argument("--threshold", type=float, default=0.5)
    sp.add_argument("--grit", type=float, default=1.0, help="edge roughness (0..2)")
    sp.add_argument("--specks", type=float, default=1.0, help="toner specks and dropouts (0..3)")
    sp.add_argument("--invert", action="store_true", help="ink carries the light (light ink on a dark poster)")
    sp.add_argument("--ink", type=rgb, default=rgb("#111111"))
    sp.add_argument("--paper", type=colour_or_none, default=rgb("#f2f0ea"), help="hex or none")
    sp.set_defaults(func=cmd_photocopy)

    sp = photo("duotone", "gradient map")
    sp.add_argument("--colors", type=colours, required=True, help="dark-to-light hex stops, e.g. '#111,#e63,#fbe9d0'")
    sp.set_defaults(func=cmd_duotone)

    sp = photo("riso", "two-ink risograph")
    sp.add_argument("--inks", type=lambda t: colours(t)[:2], default=colours("#ff48b0,#0078bf"))
    sp.add_argument("--paper", type=rgb, default=rgb("#f3efe6"))
    sp.add_argument("--split", choices=["unmix", "luma"], default="unmix",
                    help="unmix: separate colours into the two inks; luma: ink 1 = tones, ink 2 = shadows")
    sp.add_argument("--grain", type=float, default=0.75, help="0 smooth .. 1 fully dithered")
    sp.add_argument("--grain-size", type=float, default=1.6)
    sp.add_argument("--uneven", type=float, default=0.18, help="drum ink variation 0..0.5")
    sp.add_argument("--offset", type=lambda t: pair(t, int), default=(4, -3), help="ink 2 misregistration dx,dy px")
    sp.set_defaults(func=cmd_riso)

    sp = photo("cutout", "subject on transparent")
    sp.add_argument("--method", choices=["auto", "rembg", "flood"], default="auto")
    sp.add_argument("--model", default="isnet-general-use",
                    help="rembg model (default isnet-general-use, Apache-2.0, ~170MB; birefnet-general is MIT and "
                         "sharper but ~900MB). Avoid bria-rmbg, rembg's own default: it is licensed for "
                         "non-commercial use only")
    sp.add_argument("--tolerance", type=float, default=40, help="flood: colour distance 0..441")
    sp.add_argument("--feather", type=float, default=0.8)
    sp.set_defaults(func=cmd_cutout)

    sp = sub.add_parser("outline", help="sticker border around a transparent PNG")
    sp.add_argument("image")
    sp.add_argument("-o", "--output", required=True)
    sp.add_argument("--size", type=int, default=16, help="border width px")
    sp.add_argument("--color", type=rgb, default=rgb("#ffffff"))
    sp.add_argument("--trim", action="store_true", help="crop to the result")
    sp.set_defaults(func=cmd_outline)

    sp = photo("torn", "torn paper edges")
    sp.add_argument("--edges", default="top", help="comma list: top,bottom,left,right")
    sp.add_argument("--depth", type=float, default=40, help="how far the tear bites in, px")
    sp.add_argument("--rim", type=float, default=7, help="paper fibre rim width, px")
    sp.add_argument("--rim-color", type=rgb, default=rgb("#f1eee6"))
    sp.set_defaults(func=cmd_torn)

    sp = sub.add_parser("contour", help="silhouette outline as an SVG path for text on a path")
    sp.add_argument("image", help="cut-out PNG with transparency")
    sp.add_argument("-o", "--output", required=True, help=".svg")
    sp.add_argument("--offset", type=float, default=24, help="distance outside the silhouette, px")
    sp.add_argument("--part", choices=["full", "top", "bottom"], default="top",
                    help="full closed outline, or left-to-right over the top / under the bottom")
    sp.add_argument("--round", type=float, default=60, help="fill concave corners tighter than this radius, px (text flows better)")
    sp.add_argument("--smooth", type=int, default=3, help="smoothing passes")
    sp.set_defaults(func=cmd_contour)

    sp = sub.add_parser("texture", help="procedural overlay")
    sp.add_argument("kind", choices=["grain", "paper", "dust", "folds", "grunge"])
    sp.add_argument("-o", "--output", required=True)
    sp.add_argument("--size", type=size, required=True, help="WxH px")
    sp.add_argument("--strength", type=float, default=1.0)
    sp.add_argument("--color", type=rgb, default=rgb("#111111"), help="dust/grunge colour")
    sp.add_argument("--folds", type=lambda t: tuple(int(v) for v in t.lower().split("x")), default=(2, 3),
                    help="folds: COLSxROWS panels (default 2x3)")
    sp.add_argument("--seed", type=int, default=7)
    sp.set_defaults(func=cmd_texture)

    args = p.parse_args()
    args.func(args)


if __name__ == "__main__":
    main()
