# Formats

Artboard sizes in CSS px for screen and in mm for print. Platform specs drift, so when the user names a current spec, theirs wins. `banner-design/references/banner-sizes-and-styles.md` has more platforms and art-direction notes.

Export screen graphics at `--scale 1` for uploads (exact size). Use `--scale 2` for images placed in web pages or emails, which are shown at half size on high-density screens.

## Social

| Placement | Artboard | `--safe` | Notes |
|---|---|---|---|
| Instagram feed, portrait | 1080 × 1350 | 64px | The profile grid shows a centred 3:4 crop; keep the subject central |
| Instagram feed, square | 1080 × 1080 | 64px | |
| Instagram / Facebook story, Reels cover | 1080 × 1920 | 250px 72px 340px | Top and bottom are covered by UI |
| Instagram / LinkedIn carousel | 1080 × 1350 per slide | 64px | LinkedIn document carousels are a PDF: use `--pdf` and combine |
| TikTok cover | 1080 × 1920 | 160px 140px 420px 72px | Right side holds buttons; bottom holds the caption |
| LinkedIn post image | 1200 × 627 or 1080 × 1350 | 48px | |
| X / Twitter post | 1600 × 900 or 1080 × 1350 | 48px | |
| Facebook link / post | 1200 × 630 | 48px | |
| Pinterest pin | 1000 × 1500 | 60px | |
| YouTube thumbnail | 1280 × 720 | 40px | Bottom-right corner holds the duration badge; legible at 240px wide |
| Open Graph / link preview | 1200 × 630 | 60px | Often cropped to a square or 1.91:1 in different apps |

## Covers and headers

| Placement | Artboard | Safe area |
|---|---|---|
| YouTube channel banner | 2560 × 1440 | Centre 1546 × 423 is the only area visible everywhere |
| LinkedIn profile banner | 1584 × 396 | Left third is covered by the profile photo on desktop |
| LinkedIn company cover | 1128 × 191 | |
| X / Twitter header | 1500 × 500 | Bottom-left is covered by the avatar; top and bottom crop on some screens |
| Facebook page cover | 1640 × 624 (2× of 820 × 312) | Mobile crops the sides; keep content in the centre 1280px |
| Email header | 600px wide (export `--scale 2`) | Many clients block images; never put essential text only in the image |

## Display ads (IAB)

300 × 250, 336 × 280, 728 × 90, 970 × 250, 160 × 600, 300 × 600, 320 × 50, 320 × 100. Each size gets its own composition; a leaderboard (728 × 90) has room for a logo, one line and a button, nothing more. Keep the file under the network's weight limit (often 150 KB): export `--format jpeg --quality 85` for photographic ads.

## Presentation and video

| Use | Artboard |
|---|---|
| Slide 16:9 | 1920 × 1080 |
| Slide 4:3 | 1440 × 1080 |
| Video title card / lower third | 1920 × 1080 (export `--transparent` for overlays) |

## Print

Artboard = trim + 2 × bleed. Set `--bleed` and `--safe` on the artboard, render with `--dpi 300` (150 for posters over A2), then run `print-production`.

| Item | Trim (mm) | Artboard with 3mm bleed |
|---|---|---|
| A6 postcard / flyer | 105 × 148 | 111 × 154 |
| A5 flyer | 148 × 210 | 154 × 216 |
| A4 flyer / poster | 210 × 297 | 216 × 303 |
| A3 poster | 297 × 420 | 303 × 426 |
| A2 poster | 420 × 594 | 426 × 600 |
| US letter | 215.9 × 279.4 | 222.25 × 285.75 (0.125in bleed) |
| Poster 18 × 24in | 457.2 × 609.6 | 463.55 × 615.95 (0.125in bleed) |
| Business card EU | 85 × 55 | 91 × 61 |
| Business card US | 88.9 × 50.8 | 95.25 × 57.15 (0.125in bleed) |
| DL invitation / rack card | 99 × 210 | 105 × 216 |
| Square invitation | 148 × 148 | 154 × 154 |

```css
.artboard.a5 {
  --bleed: 3mm;
  width: calc(148mm + 2 * var(--bleed));
  height: calc(210mm + 2 * var(--bleed));
  --safe: calc(var(--bleed) + 5mm);
}
```

Type sizes in print are easiest in `pt` (`font-size: 9pt`). Minimum about 6pt for body text and 7–8pt for reversed (light on dark) text.
