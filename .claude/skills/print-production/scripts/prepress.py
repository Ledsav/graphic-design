#!/usr/bin/env python3
"""Prepress helper for print-ready graphic design files.

Subcommands:
  size   Pixel dimensions to design at for a trim size + bleed + resolution.
  check  Preflight a raster artwork: effective PPI, colour mode, alpha, aspect.
  cmyk   Convert RGB artwork to CMYK (TIFF or JPEG), optionally via an ICC profile.
  sheet  Wrap artwork in a press PDF with bleed, crop marks and Trim/Bleed boxes.

Sizes accept a preset name (a4, letter, business-card-eu, ...) or WxH with a
unit suffix: 210x297mm, 8.5x11in, 50x70cm. Bleed and slug take a single length
such as 3mm or 0.125in.

Requires Pillow. `sheet` also requires reportlab.
"""

import argparse
import io
import re
import sys
from pathlib import Path

from PIL import Image, ImageCms

MM_PER_IN = 25.4
PT_PER_MM = 72 / MM_PER_IN

# Trim sizes in millimetres (width x height, portrait).
PRESETS = {
    "a0": (841, 1189),
    "a1": (594, 841),
    "a2": (420, 594),
    "a3": (297, 420),
    "a4": (210, 297),
    "a5": (148, 210),
    "a6": (105, 148),
    "dl": (99, 210),
    "letter": (215.9, 279.4),
    "legal": (215.9, 355.6),
    "tabloid": (279.4, 431.8),
    "business-card-eu": (85, 55),
    "business-card-us": (88.9, 50.8),
    "postcard-a6": (148, 105),
    "postcard-us": (152.4, 101.6),
    "poster-18x24": (457.2, 609.6),
    "poster-24x36": (609.6, 914.4),
    "poster-50x70": (500, 700),
    "poster-70x100": (700, 1000),
    "square-210": (210, 210),
}

UNIT_TO_MM = {"mm": 1.0, "cm": 10.0, "in": MM_PER_IN, "pt": 1 / PT_PER_MM}


def parse_length(text):
    """'3mm' / '0.125in' / '1cm' -> millimetres."""
    m = re.fullmatch(r"\s*([0-9]*\.?[0-9]+)\s*(mm|cm|in|pt)\s*", text.lower())
    if not m:
        raise argparse.ArgumentTypeError(f"bad length {text!r}; use e.g. 3mm or 0.125in")
    return float(m.group(1)) * UNIT_TO_MM[m.group(2)]


def parse_size(text):
    """Preset name or 'WxH<unit>' -> (width_mm, height_mm)."""
    key = text.lower().strip()
    if key in PRESETS:
        return PRESETS[key]
    m = re.fullmatch(r"\s*([0-9]*\.?[0-9]+)\s*x\s*([0-9]*\.?[0-9]+)\s*(mm|cm|in|pt)\s*", key)
    if not m:
        names = ", ".join(sorted(PRESETS))
        raise argparse.ArgumentTypeError(
            f"bad size {text!r}; use WxH with a unit (210x297mm, 8.5x11in) or a preset: {names}"
        )
    factor = UNIT_TO_MM[m.group(3)]
    return float(m.group(1)) * factor, float(m.group(2)) * factor


def mm_to_px(mm, dpi):
    return round(mm / MM_PER_IN * dpi)


def fmt_mm(mm):
    return f"{mm:g}mm ({mm / MM_PER_IN:.3f}in)"


def cmd_size(args):
    tw, th = args.trim
    bw, bh = tw + 2 * args.bleed, th + 2 * args.bleed
    safe = args.safe
    print(f"Trim:        {fmt_mm(tw)} x {fmt_mm(th)}")
    print(f"With bleed:  {fmt_mm(bw)} x {fmt_mm(bh)}  (bleed {args.bleed:g}mm per side)")
    print(f"Resolution:  {args.dpi} PPI")
    print()
    print(f"Design canvas (trim + bleed): {mm_to_px(bw, args.dpi)} x {mm_to_px(bh, args.dpi)} px")
    print(f"Trim area:                    {mm_to_px(tw, args.dpi)} x {mm_to_px(th, args.dpi)} px")
    inset = mm_to_px(args.bleed + safe, args.dpi)
    print(f"Keep text/logos at least {inset} px from every canvas edge "
          f"(bleed {args.bleed:g}mm + safe margin {safe:g}mm).")


def effective_ppi(px, mm):
    return px / (mm / MM_PER_IN)


def cmd_check(args):
    img = Image.open(args.image)
    w, h = img.size
    tw, th = args.trim
    art_w = tw + (0 if args.art_is_trim else 2 * args.bleed)
    art_h = th + (0 if args.art_is_trim else 2 * args.bleed)
    ppi_x, ppi_y = effective_ppi(w, art_w), effective_ppi(h, art_h)
    ppi = min(ppi_x, ppi_y)
    aspect_err = abs((w / h) / (art_w / art_h) - 1) * 100

    failures, warnings = [], []
    print(f"File:        {args.image}")
    print(f"Pixels:      {w} x {h}, mode {img.mode}")
    print(f"Placed at:   {art_w:g} x {art_h:g}mm "
          f"({'trim only' if args.art_is_trim else f'trim + {args.bleed:g}mm bleed'})")
    print(f"Effective:   {ppi_x:.0f} x {ppi_y:.0f} PPI")
    print(f"ICC profile: {'embedded' if img.info.get('icc_profile') else 'none'}")
    print()

    if ppi < args.min_ppi * 0.5:
        failures.append(f"resolution {ppi:.0f} PPI is under half the {args.min_ppi} PPI target")
    elif ppi < args.min_ppi * 0.95:
        warnings.append(f"resolution {ppi:.0f} PPI is below the {args.min_ppi} PPI target")
    if aspect_err > 1:
        failures.append(f"aspect ratio is off by {aspect_err:.1f}% from the placed size; "
                        "the art would be stretched or cropped")
    if args.art_is_trim and args.bleed > 0:
        warnings.append("art covers trim only: anything printed to the edge needs bleed, "
                        "so extend the background past the trim")
    has_alpha = ("A" in img.mode and img.getchannel("A").getextrema()[0] < 255) or (
        img.mode == "P" and "transparency" in img.info)
    if has_alpha:
        warnings.append("image has transparency; flatten onto the paper colour before press")
    if img.mode != "CMYK":
        warnings.append(f"colour mode is {img.mode}; convert to CMYK with the printer's profile "
                        "(prepress.py cmyk) unless the printer asks for RGB")

    for msg in failures:
        print(f"FAIL  {msg}")
    for msg in warnings:
        print(f"WARN  {msg}")
    if not failures and not warnings:
        print("PASS  ready for press")
    elif not failures:
        print("PASS  with warnings")
    return 1 if failures else 0


def flatten(img, background=(255, 255, 255)):
    if img.mode in ("RGBA", "LA") or (img.mode == "P" and "transparency" in img.info):
        rgba = img.convert("RGBA")
        base = Image.new("RGB", rgba.size, background)
        base.paste(rgba, mask=rgba.getchannel("A"))
        return base
    return img


def cmd_cmyk(args):
    src = Image.open(args.image)
    dpi = src.info.get("dpi", (args.dpi, args.dpi))
    if src.mode == "CMYK":
        print("Image is already CMYK; nothing to convert.", file=sys.stderr)
        return 1
    rgb = flatten(src).convert("RGB")
    save_kwargs = {"dpi": dpi}
    if args.icc:
        embedded = src.info.get("icc_profile")
        if embedded and src.mode in ("RGB", "RGBA"):
            src_profile = ImageCms.ImageCmsProfile(io.BytesIO(embedded))
        else:
            src_profile = ImageCms.ImageCmsProfile(ImageCms.createProfile("sRGB"))
        dst_profile = ImageCms.ImageCmsProfile(str(args.icc))
        intent = {"perceptual": 0, "relative": 1, "saturation": 2, "absolute": 3}[args.intent]
        cmyk = ImageCms.profileToProfile(rgb, src_profile, dst_profile,
                                         renderingIntent=intent, outputMode="CMYK")
        save_kwargs["icc_profile"] = dst_profile.tobytes()
        how = f"via {Path(args.icc).name} ({args.intent} intent)"
    else:
        cmyk = rgb.convert("CMYK")
        how = "naive conversion (no ICC profile: colours are approximate; ask the printer for theirs)"

    out = Path(args.output)
    if out.suffix.lower() in (".tif", ".tiff"):
        save_kwargs["compression"] = "tiff_lzw"
    elif out.suffix.lower() in (".jpg", ".jpeg"):
        save_kwargs["quality"] = 95
        save_kwargs["subsampling"] = 0
    else:
        print("Output must be .tif/.tiff or .jpg/.jpeg", file=sys.stderr)
        return 2
    cmyk.save(out, **save_kwargs)
    print(f"Wrote {out} ({cmyk.size[0]} x {cmyk.size[1]} px, CMYK, {how})")
    return 0


def fit_cover(img, target_aspect):
    """Center-crop img to target_aspect (w/h)."""
    w, h = img.size
    if w / h > target_aspect:
        new_w = round(h * target_aspect)
        left = (w - new_w) // 2
        return img.crop((left, 0, left + new_w, h))
    new_h = round(w / target_aspect)
    top = (h - new_h) // 2
    return img.crop((0, top, w, top + new_h))


def cmd_sheet(args):
    try:
        from reportlab import rl_config
        from reportlab.lib.colors import CMYKColor
        from reportlab.lib.utils import ImageReader
        from reportlab.pdfgen import canvas
    except ImportError:
        print("sheet needs reportlab: pip install reportlab", file=sys.stderr)
        return 2

    tw, th = args.trim
    bleed = args.bleed
    slug = args.slug if args.marks else 0
    art_w, art_h = tw + 2 * bleed, th + 2 * bleed
    page_w, page_h = art_w + 2 * slug, art_h + 2 * slug

    img = Image.open(args.image)
    aspect_err = abs((img.width / img.height) / (art_w / art_h) - 1) * 100
    if aspect_err > 1:
        if not args.crop:
            print(f"Artwork aspect is {aspect_err:.1f}% off trim+bleed ({art_w:g}x{art_h:g}mm). "
                  "Re-export at the size from `prepress.py size`, or pass --crop to centre-crop.",
                  file=sys.stderr)
            return 1
        img = fit_cover(img, art_w / art_h)
    img = flatten(img)

    pt = PT_PER_MM
    rl_config.useA85 = 0  # binary streams; ASCII85 only inflates the file
    c = canvas.Canvas(str(args.output), pagesize=(page_w * pt, page_h * pt))
    c.setTitle(Path(args.image).stem)
    c.drawImage(ImageReader(img), slug * pt, slug * pt, width=art_w * pt, height=art_h * pt)

    trim_x0, trim_y0 = (slug + bleed) * pt, (slug + bleed) * pt
    trim_x1, trim_y1 = trim_x0 + tw * pt, trim_y0 + th * pt
    c.setTrimBox((trim_x0, trim_y0, trim_x1, trim_y1))
    c.setBleedBox((slug * pt, slug * pt, (slug + art_w) * pt, (slug + art_h) * pt))

    if args.marks:
        # Registration colour so marks print on every plate.
        c.setStrokeColor(CMYKColor(1, 1, 1, 1))
        c.setLineWidth(0.25)
        gap = (bleed + 1) * pt  # marks start just outside the bleed
        length = max(slug - bleed - 2, 3) * pt
        for x, sx in ((trim_x0, -1), (trim_x1, 1)):
            for y, sy in ((trim_y0, -1), (trim_y1, 1)):
                c.line(x + sx * gap, y, x + sx * (gap + length), y)  # horizontal
                c.line(x, y + sy * gap, x, y + sy * (gap + length))  # vertical
    c.showPage()
    c.save()

    print(f"Wrote {args.output}")
    print(f"  page {page_w:g} x {page_h:g}mm, trim {tw:g} x {th:g}mm, bleed {bleed:g}mm"
          f"{', crop marks' if args.marks else ''}")
    print(f"  artwork {img.width} x {img.height} px -> "
          f"{effective_ppi(img.width, art_w):.0f} PPI, mode {img.mode}")
    return 0


def main():
    p = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    sub = p.add_subparsers(dest="cmd", required=True)

    def add_trim(sp):
        sp.add_argument("--trim", type=parse_size, required=True,
                        help="finished size: preset (a4, letter, ...) or WxH with unit")
        sp.add_argument("--bleed", type=parse_length, default=3.0,
                        help="bleed per side (default 3mm; US printers often ask 0.125in)")

    sp = sub.add_parser("size", help="pixel canvas for a trim size + bleed")
    add_trim(sp)
    sp.add_argument("--dpi", type=int, default=300)
    sp.add_argument("--safe", type=parse_length, default=4.0,
                    help="safe margin inside trim for text/logos (default 4mm)")
    sp.set_defaults(func=cmd_size)

    sp = sub.add_parser("check", help="preflight a raster artwork")
    sp.add_argument("image")
    add_trim(sp)
    sp.add_argument("--min-ppi", type=int, default=300,
                    help="target resolution (300 for close reading; 150 is fine for large posters)")
    sp.add_argument("--art-is-trim", action="store_true",
                    help="the artwork covers the trim size only, without bleed")
    sp.set_defaults(func=cmd_check)

    sp = sub.add_parser("cmyk", help="convert artwork to CMYK")
    sp.add_argument("image")
    sp.add_argument("-o", "--output", required=True, help=".tif/.tiff or .jpg/.jpeg")
    sp.add_argument("--icc", help="printer's CMYK ICC profile (e.g. FOGRA39, GRACoL, SWOP)")
    sp.add_argument("--intent", choices=["perceptual", "relative", "saturation", "absolute"],
                    default="perceptual")
    sp.add_argument("--dpi", type=int, default=300, help="DPI to record if the source has none")
    sp.set_defaults(func=cmd_cmyk)

    sp = sub.add_parser("sheet", help="press PDF with bleed and crop marks")
    sp.add_argument("image", help="artwork sized to trim + bleed")
    sp.add_argument("-o", "--output", required=True)
    add_trim(sp)
    sp.add_argument("--slug", type=parse_length, default=10.0,
                    help="margin outside the bleed that holds the crop marks (default 10mm)")
    sp.add_argument("--no-marks", dest="marks", action="store_false")
    sp.add_argument("--crop", action="store_true",
                    help="centre-crop artwork whose aspect does not match trim + bleed")
    sp.set_defaults(func=cmd_sheet)

    args = p.parse_args()
    return args.func(args) or 0


if __name__ == "__main__":
    sys.exit(main())
