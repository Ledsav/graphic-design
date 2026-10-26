---
name: print-production
description: Prepress and print-ready export for anything that will be physically printed - posters, flyers, business cards, postcards, brochures, packaging, book covers, stickers, signage. Use when a design is headed to a printer or the user mentions print, bleed, crop marks, trim, CMYK, DPI/PPI, Pantone, PDF/X, paper sizes (A4, letter, 18x24...), or "print-ready". Also use BEFORE starting a print design, to set the canvas size correctly.
---

# Print Production

Screen design forgives; print does not. A design that looks perfect as a PNG can come back from the printer with white slivers at the edges, a muddy palette, soft type, or a logo cut in half by the trimmer. This skill closes that gap.

`scripts/prepress.py` is relative to this skill's directory. Run it from the project root with the full path, e.g. `python3 .claude/skills/print-production/scripts/prepress.py size --trim a4`. It needs Pillow; `sheet` also needs reportlab.

## Workflow

### 1. Before designing: set up the canvas

Ask (or decide, and say so): finished size, printing method (digital / offset / large-format), paper (coated / uncoated), and whether the printer has a spec sheet. A printer's spec sheet beats every default below.

```bash
python3 .claude/skills/print-production/scripts/prepress.py size --trim a4 --bleed 3mm
python3 .claude/skills/print-production/scripts/prepress.py size --trim 8.5x11in --bleed 0.125in
python3 .claude/skills/print-production/scripts/prepress.py size --trim business-card-eu
```

Design at the **design canvas** size it prints (trim + bleed). Run any other design skill (canvas-design, banner-design, design...) at exactly that pixel size.

### 2. While designing: the three zones

- **Bleed** (outer 3mm / 0.125in): backgrounds and images that touch the edge must extend all the way through it. Nothing important lives here; it gets cut off.
- **Trim**: where the knife falls. Expect ±1-2mm of drift.
- **Safe area** (4-5mm inside trim, more for bound edges): all text, logos, faces and anything that must not be cut. `size` reports the pixel inset.

Never put a thin border right at the trim. Drift makes it visibly uneven; either keep it well inside the safe area or bleed it off.

### 3. Preflight

```bash
python3 .claude/skills/print-production/scripts/prepress.py check out/poster.png --trim a4
```

It reports effective PPI at the printed size, colour mode, embedded profile, transparency, and aspect mismatch. Fix every FAIL. Exit code is 1 on FAIL.

### 4. Convert to CMYK

```bash
python3 .claude/skills/print-production/scripts/prepress.py cmyk out/poster.png -o out/poster-cmyk.tif --icc path/to/printer-profile.icc
```

With the printer's ICC profile (common ones: FOGRA39/FOGRA51 for European coated, GRACoL2013 / SWOP for US), conversion is colour-managed. Without one it falls back to a naive conversion; say so to the user and present colours as approximate. Some digital printers want RGB: follow their spec.

After conversion, saturated screen colours (electric blues, neon greens, hot magentas, bright oranges) will dull. Warn the user up front when the palette depends on them; consider a spot colour.

### 5. Build the press PDF

```bash
python3 .claude/skills/print-production/scripts/prepress.py sheet out/poster-cmyk.tif -o out/poster-press.pdf --trim a4 --bleed 3mm
```

Produces a PDF with the artwork at exact physical size, TrimBox and BleedBox set, and registration crop marks in a slug outside the bleed. `--no-marks` for printers who add their own (many online printers want no marks, bleed included). `--crop` centre-crops artwork whose aspect is off.

### 6. Proof

Render the PDF and look at it: `pdftoppm -r 50 -png out/poster-press.pdf out/proof` (or open it in a browser). Check the corners, the safe area, and that nothing important sits in the bleed. Recommend a physical proof for anything costly or colour-critical.

## Rules of thumb

**Resolution.** 300 PPI at final size for anything read at arm's length. 150-200 PPI is fine for posters viewed from a metre or more; 100 PPI for billboards and banners. Upscaling a low-res image does not add detail - say so instead of hiding it.

**Black.** Small text and fine lines: 100% K only (C0 M0 Y0 K100), so registration drift cannot make it fuzzy. Large black areas: rich black (C60 M40 Y40 K100) so it reads deep, not grey. Never use registration black (100/100/100/100) for artwork.

**Ink limit.** Total ink (C+M+Y+K) about 300% on coated stock, 260% on uncoated, lower on newsprint. Rich blacks above this smear and dry slowly.

**Type.** Minimum about 6pt for body copy (7-8pt for reversed/white-on-dark or thin serifs), and avoid hairline weights under 0.25pt. Reversed small type on a four-colour background goes blurry: thicken it or simplify the background.

**Uncoated paper** absorbs ink: colours darken and soften and dot gain fattens fine detail. Lighten mid-tones slightly and avoid very fine reversed details.

**Spot colours (Pantone).** Use when a brand colour must match exactly or sits outside the CMYK gamut (vivid orange, fluorescent, metallic). Raster output from this toolchain is process CMYK only - flag spot colours as a handoff note for a DTP tool rather than faking them.

**Folds and binding.** Panels of a tri-fold are not equal (the inside panel is 1-3mm narrower). Saddle-stitched booklets need page counts in multiples of 4 and creep on thick ones. Keep text 6mm+ from folds and the spine.

## Handoff checklist

Deliver to the user (and the printer):
- Press PDF (`*-press.pdf`) with bleed, trim box and marks as the printer asked
- The CMYK master (TIFF) and the RGB master used for screen and social
- A one-paragraph spec: trim size, bleed, colour profile used (or "naive CMYK - approximate"), paper assumption, any spot colours, and anything you could not verify

## Limits

This is a raster pipeline: it does not produce certified PDF/X, live spot-colour separations, overprint settings, or vector type. When a job needs those (packaging dielines, foil/varnish layers, long-run offset with strict preflight), say so and recommend finishing in a DTP tool (InDesign, Affinity Publisher, Scribus) or a design engine that exports PDF/X.
