#!/usr/bin/env python3
"""Render the style library: every styles/<id>/example.html -> preview.jpg,
a contact sheet styles/catalog.jpg, and the catalog table in styles/README.md.

Usage:
  previews.py                 all styles
  previews.py riso-two-ink    only these (the catalog and table still cover all)
  previews.py --no-render     rebuild catalog and table from existing previews

Needs Node + Playwright (render.cjs) and Pillow.
"""

import re
import shlex
import subprocess
import sys
from pathlib import Path

from PIL import Image, ImageDraw, ImageFont

HERE = Path(__file__).resolve().parent
STYLES = HERE.parent / "styles"
FONT = HERE.parents[1] / "canvas-design" / "canvas-fonts" / "InstrumentSans-Bold.ttf"


def front_matter(path):
    """Tiny parser for the style.md front matter: scalars, [lists] and {maps}."""
    text = path.read_text()
    m = re.match(r"---\n(.*?)\n---", text, re.S)
    if not m:
        return {}
    out = {}
    for line in m.group(1).splitlines():
        line = re.sub(r"\s+#(?=(?:[^\"]*\"[^\"]*\")*[^\"]*$).*$", "", line).rstrip()
        if not line or ":" not in line:
            continue
        key, val = line.split(":", 1)
        val = val.strip()
        if val.startswith("[") and val.endswith("]"):
            out[key.strip()] = [v.strip().strip('"') for v in val[1:-1].split(",") if v.strip()]
        elif val.startswith("{") and val.endswith("}"):
            pairs = re.findall(r'([\w-]+)\s*:\s*"([^"]*)"', val)
            out[key.strip()] = dict(pairs)
        else:
            out[key.strip()] = val.strip('"')
    return out


def render(style_dir):
    export = style_dir / "export"
    cmd = ["node", str(HERE / "render.cjs"), str(style_dir / "example.html"), "--out", str(export)]
    res = subprocess.run(cmd, capture_output=True, text=True)
    for line in res.stdout.splitlines():
        if "WARN" in line:
            print(f"  {style_dir.name}: {line.strip()}")
    if res.returncode != 0:
        print(res.stdout, res.stderr)
        raise SystemExit(f"render failed for {style_dir.name}")
    pngs = sorted(export.glob("example*.png"))
    if not pngs:
        raise SystemExit(f"no export for {style_dir.name}")
    return pngs[0]


def post(style_dir, meta, png):
    step = meta.get("post")
    if not step:
        return png
    out = png.with_name(png.stem + "-post.png")
    args = shlex.split(step.replace("{in}", str(png)).replace("{out}", str(out)))
    if args[0] == "treat.py":
        args = [sys.executable, str(HERE / "treat.py")] + args[1:]
    subprocess.run(args, check=True, capture_output=True)
    return out


def preview(png, dest):
    im = Image.open(png).convert("RGB")
    im.thumbnail((900, 1600), Image.LANCZOS)
    im.save(dest, quality=86)


def catalog(styles):
    H, pad, label = 620, 28, 54
    ims = []
    for d, meta in styles:
        p = d / "preview.jpg"
        if p.exists():
            im = Image.open(p).convert("RGB")
            ims.append((meta.get("name", d.name), im.resize((round(im.width * H / im.height), H), Image.LANCZOS)))
    if not ims:
        return
    per_row = 6
    rows = [ims[i:i + per_row] for i in range(0, len(ims), per_row)]
    W = max(sum(im.width for _, im in r) + pad * (len(r) + 1) for r in rows)
    sheet = Image.new("RGB", (W, len(rows) * (H + label + pad) + pad), (28, 28, 28))
    draw = ImageDraw.Draw(sheet)
    font = ImageFont.truetype(str(FONT), 24) if FONT.exists() else ImageFont.load_default()
    y = pad
    for r in rows:
        x = pad
        for name, im in r:
            sheet.paste(im, (x, y))
            draw.text((x, y + H + 12), name, font=font, fill=(235, 235, 235))
            x += im.width + pad
        y += H + label + pad
    sheet.save(STYLES / "catalog.jpg", quality=84)
    print(f"Wrote {STYLES / 'catalog.jpg'} ({len(ims)} styles)")


def table(styles):
    rows = ["| Style | Family | Mood | Fits | Preview |", "|---|---|---|---|---|"]
    for d, meta in styles:
        mood = ", ".join(meta.get("mood", []))
        fits = ", ".join(meta.get("fits", []))
        rows.append(f"| [{meta.get('name', d.name)}]({d.name}/style.md) | {meta.get('family', '')} | {mood} | {fits} | [preview]({d.name}/preview.jpg) |")
    readme = STYLES / "README.md"
    text = readme.read_text()
    new = re.sub(r"<!-- catalog:start -->.*<!-- catalog:end -->",
                 "<!-- catalog:start -->\n" + "\n".join(rows) + "\n<!-- catalog:end -->", text, flags=re.S)
    readme.write_text(new)
    print(f"Updated catalog table in {readme} ({len(styles)} styles)")


def main():
    args = [a for a in sys.argv[1:] if not a.startswith("--")]
    skip_render = "--no-render" in sys.argv
    styles = []
    for d in sorted(p for p in STYLES.iterdir() if p.is_dir() and not p.name.startswith("_")):
        if (d / "style.md").exists():
            styles.append((d, front_matter(d / "style.md")))
    if not skip_render:
        for d, meta in styles:
            if args and d.name not in args:
                continue
            if not (d / "example.html").exists():
                print(f"  {d.name}: no example.html yet")
                continue
            png = post(d, meta, render(d))
            preview(png, d / "preview.jpg")
            print(f"Wrote {d / 'preview.jpg'}")
    catalog(styles)
    table(styles)


if __name__ == "__main__":
    main()
