#!/usr/bin/env node
/*
 * Render HTML artboards to PNG/JPEG (and optionally vector PDF) with headless
 * Chromium, then flag what silently ruins HTML graphics: fallback fonts,
 * faux bold/italic, text outside the artboard or clipped by a container, text
 * in the safe margin, overlapping or tiny text, broken or upscaled images.
 *
 * Usage: node render.cjs <file.html> [more.html ...] [options]
 *
 *   --out <dir>        output directory (default: export/ next to the HTML)
 *   --selector <css>   what counts as an artboard (default: .artboard)
 *   --only <names>     comma-separated artboard names to render
 *   --scale <n>        device pixel ratio; 1 = exact CSS size (default), 2 = retina
 *   --dpi <n>          for mm/in-sized print artboards: scale = dpi / 96
 *   --format png|jpeg  raster format (default png)
 *   --quality <n>      JPEG quality (default 92)
 *   --transparent      PNG with transparent background (stickers, overlays)
 *   --pdf              also write a vector PDF per artboard
 *   --pdf-pages        also write one multi-page PDF of all artboards (same size)
 *   --sheet            also write a contact sheet of all artboards
 *   --guides           keep .guides visible in the export
 *   --min-font <px>    warn below this size (default: artboard width / 72, at least 10)
 *   --wait <ms>        extra wait before capture, e.g. for JS-driven layout
 *   --no-local-fonts   don't register the bundled fonts
 *   --strict           exit 1 when there are warnings
 *
 * An artboard is named by data-name, then id, then its position. Its safe
 * margin comes from the CSS custom property --safe (1-4 lengths like margin).
 * Mark intentional overlaps with data-allow-overlap and decorative or
 * intentionally cropped text with data-ignore. If the page defines
 * window.layout() (e.g. fit-to-width text), it runs again once fonts are loaded.
 */
'use strict';

const fs = require('fs');
const path = require('path');
const { pathToFileURL } = require('url');

const FONTS_CSS = path.join(__dirname, '..', 'assets', 'fonts.css');

function usage(code) {
  const text = fs.readFileSync(__filename, 'utf8').split('\n');
  console.log(text.slice(text.findIndex((l) => l.includes('Usage:')), text.indexOf(" */")).map((l) => l.replace(/^ \* ?/, '')).join('\n'));
  process.exit(code);
}

function fail(msg) {
  console.error(`render.cjs: ${msg}`);
  process.exit(2);
}

function parseArgs(argv) {
  const opts = { files: [], selector: '.artboard', scale: 1, format: 'png', quality: 92, wait: 0, localFonts: true };
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    const value = () => (i + 1 < argv.length ? argv[++i] : fail(`${a} needs a value`));
    switch (a) {
      case '--out': opts.out = value(); break;
      case '--selector': opts.selector = value(); break;
      case '--only': opts.only = value().split(',').map((s) => s.trim()); break;
      case '--scale': opts.scale = Number(value()); break;
      case '--dpi': opts.scale = Number(value()) / 96; break;
      case '--format': opts.format = value(); break;
      case '--quality': opts.quality = Number(value()); break;
      case '--min-font': opts.minFont = Number(value()); break;
      case '--wait': opts.wait = Number(value()); break;
      case '--transparent': opts.transparent = true; break;
      case '--pdf': opts.pdf = true; break;
      case '--pdf-pages': opts.pdfPages = true; break;
      case '--sheet': opts.sheet = true; break;
      case '--guides': opts.guides = true; break;
      case '--no-local-fonts': opts.localFonts = false; break;
      case '--strict': opts.strict = true; break;
      case '-h': case '--help': usage(0); break;
      default:
        if (a.startsWith('-')) fail(`unknown option ${a} (see --help)`);
        opts.files.push(a);
    }
  }
  if (!opts.files.length) usage(2);
  if (!['png', 'jpeg'].includes(opts.format)) fail('--format must be png or jpeg');
  if (opts.transparent && opts.format !== 'png') fail('--transparent needs png');
  if (!(opts.scale > 0)) fail('--scale/--dpi must be a positive number');
  return opts;
}

const slug = (s) => s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

// The bundled @font-face rules, as FontFace descriptors with absolute file URLs.
function bundledFaces() {
  const css = fs.readFileSync(FONTS_CSS, 'utf8');
  return [...css.matchAll(/@font-face\s*{([^}]*)}/g)].map(([, body]) => {
    const get = (prop) => (body.match(new RegExp(`${prop}\\s*:\\s*([^;]+)`)) || [])[1]?.trim();
    const src = get('src').match(/url\(\s*["']?([^"')]+)/)[1];
    return {
      family: get('font-family').replace(/^["']|["']$/g, ''),
      url: pathToFileURL(path.resolve(path.dirname(FONTS_CSS), src)).href,
      weight: get('font-weight') || '400',
      style: get('font-style') || 'normal',
    };
  });
}

// Register the bundled fonts before any page script runs, so scripts that
// measure text (fit-to-width headlines) see the real fonts.
async function registerFonts(ctx) {
  await ctx.addInitScript((faces) => {
    for (const f of faces) {
      document.fonts.add(new FontFace(f.family, `url("${f.url}")`, { weight: f.weight, style: f.style, display: 'block' }));
    }
  }, bundledFaces());
}

// Load the page and wait until every face in use and every image is ready.
// If the page defines window.layout() (text fitting etc.), run it once fonts are in.
async function load(page, url, opts, problems) {
  try {
    await page.goto(url, { waitUntil: 'load', timeout: 30000 });
  } catch (e) {
    problems.push(`page load: ${e.message.split('\n')[0]}`);
  }
  await page.evaluate(async ({ sel, guides, transparent }) => {
    const root = document.documentElement;
    root.classList.add('is-rendering');
    if (guides) root.classList.add('show-guides');
    if (transparent) {
      const s = document.createElement('style');
      s.textContent = 'html, body { background: transparent !important; }';
      document.head.appendChild(s);
    }
    document.body.getBoundingClientRect();
    const specs = new Set();
    for (const el of document.querySelectorAll(`${sel}, ${sel} *`)) {
      if (![...el.childNodes].some((n) => n.nodeType === 3 && n.textContent.trim())) continue;
      const cs = getComputedStyle(el);
      specs.add(`${cs.fontStyle} ${cs.fontWeight} 16px ${cs.fontFamily}`);
    }
    await Promise.all([...specs].map((s) => document.fonts.load(s).catch(() => {})));
    await document.fonts.ready;
    if (typeof window.layout === 'function') {
      await window.layout();
      await document.fonts.ready;
    }
    await Promise.all([...document.images].map((img) => img.decode().catch(() => {})));
    await new Promise((r) => requestAnimationFrame(() => requestAnimationFrame(r)));
  }, { sel: opts.selector, guides: !!opts.guides, transparent: !!opts.transparent });
  if (opts.wait) await page.waitForTimeout(opts.wait);
}

// Runs in the page: inspect one artboard and return warnings.
function inspect({ sel, index, minFont, scale }) {
  const board = document.querySelectorAll(sel)[index];
  const B = board.getBoundingClientRect();
  const out = [];
  const GENERIC = new Set(['serif', 'sans-serif', 'monospace', 'cursive', 'fantasy', 'system-ui', 'ui-serif',
    'ui-sans-serif', 'ui-monospace', 'ui-rounded', 'emoji', 'math', 'fangsong']);
  const clean = (f) => f.trim().replace(/^['"]|['"]$/g, '');
  const snip = (el) => {
    const t = [...el.childNodes].filter((n) => n.nodeType === 3).map((n) => n.textContent).join(' ').replace(/\s+/g, ' ').trim();
    return `"${t.length > 36 ? `${t.slice(0, 35)}…` : t}"`;
  };
  const describe = (el) => el.tagName.toLowerCase() + (el.classList.length ? `.${[...el.classList].join('.')}` : '');

  if (B.width < 1 || B.height < 1) return ['artboard has no size; give it an explicit width and height'];
  if (scale === 1 && (Math.abs(B.width - Math.round(B.width)) > 0.01 || Math.abs(B.height - Math.round(B.height)) > 0.01)) {
    out.push(`size ${B.width.toFixed(2)}×${B.height.toFixed(2)} CSS px is fractional; the PNG is cropped to whole pixels ` +
      '(use whole px for screen graphics, or --dpi for mm-sized print artboards)');
  }

  // Loaded webfont faces, by family.
  const faces = {};
  for (const f of document.fonts) {
    if (f.status !== 'loaded') continue;
    const w = String(f.weight).split(/\s+/).map((v) => (v === 'normal' ? 400 : v === 'bold' ? 700 : Number(v)));
    (faces[clean(f.family).toLowerCase()] ||= []).push({ min: w[0], max: w[w.length - 1], italic: f.style !== 'normal' });
  }

  // Safe margin from --safe (or data-safe), expanded like the margin shorthand.
  let safe = null;
  const safeSpec = (getComputedStyle(board).getPropertyValue('--safe') || board.dataset.safe || '').trim();
  if (safeSpec) {
    const parts = [];
    let depth = 0, cur = '';
    for (const ch of safeSpec) {
      depth += ch === '(' ? 1 : ch === ')' ? -1 : 0;
      if (/\s/.test(ch) && depth === 0) { if (cur) parts.push(cur); cur = ''; } else cur += ch;
    }
    if (cur) parts.push(cur);
    const px = parts.slice(0, 4).map((p) => {
      const probe = document.createElement('div');
      probe.style.cssText = `position:absolute;visibility:hidden;height:0;width:${p}`;
      board.appendChild(probe);
      const v = probe.getBoundingClientRect().width;
      probe.remove();
      return v;
    });
    const [t, r = t, b = t, l = r] = px;
    safe = { t, r, b, l };
  }

  // Text-bearing elements and the rects of their own text. Range rects span the
  // font's whole ascender-descender box, far taller than the letters in tightly
  // leaded display type, so trim each line to the measured ink of its glyphs.
  const ctx2d = document.createElement('canvas').getContext('2d');
  const inkTrim = (cs, text) => {
    const tt = cs.textTransform;
    const t = tt === 'uppercase' ? text.toUpperCase() : tt === 'lowercase' ? text.toLowerCase() : text;
    ctx2d.font = `${cs.fontStyle} ${cs.fontWeight} ${cs.fontSize} ${cs.fontFamily}`;
    const m = ctx2d.measureText(t.trim());
    if (!m.fontBoundingBoxAscent) return null;
    return { top: m.fontBoundingBoxAscent - m.actualBoundingBoxAscent, ascent: m.fontBoundingBoxAscent, descent: m.actualBoundingBoxDescent };
  };
  const texts = [];
  for (const el of [board, ...board.querySelectorAll('*')]) {
    const nodes = [...el.childNodes].filter((n) => n.nodeType === 3 && n.textContent.trim());
    if (!nodes.length || el.closest('.guides, [data-ignore]')) continue;
    const cs = getComputedStyle(el);
    if (cs.visibility === 'hidden' || Number(cs.opacity) === 0) continue;
    const rects = [];
    for (const n of nodes) {
      const range = document.createRange();
      range.selectNodeContents(n);
      const trim = el instanceof SVGElement ? null : inkTrim(cs, n.textContent);
      for (const r of range.getClientRects()) {
        if (r.width <= 0.5 || r.height <= 0.5) continue;
        rects.push(trim
          ? { left: r.left, right: r.right, top: r.top + trim.top, bottom: Math.min(r.bottom, r.top + trim.ascent + trim.descent) }
          : { left: r.left, right: r.right, top: r.top, bottom: r.bottom });
      }
    }
    if (!rects.length) continue;
    const box = {
      left: Math.min(...rects.map((r) => r.left)), top: Math.min(...rects.map((r) => r.top)),
      right: Math.max(...rects.map((r) => r.right)), bottom: Math.max(...rects.map((r) => r.bottom)),
    };
    // Visible part of each line, after clipping by overflow containers (used for overlap).
    let clip = { left: -Infinity, top: -Infinity, right: Infinity, bottom: Infinity };
    for (let a = el; a; a = a === board ? null : a.parentElement) {
      const acs = getComputedStyle(a);
      if (acs.overflowX === 'visible' && acs.overflowY === 'visible') continue;
      const ar = a.getBoundingClientRect();
      clip = { left: Math.max(clip.left, ar.left), top: Math.max(clip.top, ar.top),
        right: Math.min(clip.right, ar.right), bottom: Math.min(clip.bottom, ar.bottom) };
    }
    const visible = rects.map((r) => ({
      left: Math.max(r.left, clip.left), top: Math.max(r.top, clip.top),
      right: Math.min(r.right, clip.right), bottom: Math.min(r.bottom, clip.bottom),
    })).filter((r) => r.right > r.left && r.bottom > r.top);
    texts.push({ el, cs, rects: visible, box });
  }

  const fallbacks = new Map();
  const faux = new Set();
  for (const { el, cs, box } of texts) {
    const first = clean(cs.fontFamily.split(',')[0]);
    const key = first.toLowerCase();
    if (!GENERIC.has(key)) {
      const pool = faces[key];
      if (!pool) {
        if (!fallbacks.has(first)) fallbacks.set(first, snip(el));
      } else {
        const weight = Number(cs.fontWeight);
        const italic = cs.fontStyle !== 'normal';
        const sameStyle = pool.filter((f) => f.italic === italic);
        if (italic && !sameStyle.length) faux.add(`faux italic: "${first}" has no italic face loaded (${snip(el)})`);
        const usable = sameStyle.length ? sameStyle : pool;
        const heaviest = Math.max(...usable.map((f) => f.max));
        const lightest = Math.min(...usable.map((f) => f.min));
        if (weight >= 600 && heaviest < 600) faux.add(`faux bold: "${first}" has no face heavier than ${heaviest} (${snip(el)})`);
        if (weight < lightest - 50) faux.add(`weight ${weight} requested but the lightest "${first}" face is ${lightest} (${snip(el)})`);
      }
    }

    // SVG text (textPath, viewBox scaling) has unreliable client rects: font checks only.
    if (el instanceof SVGElement) continue;
    const size = parseFloat(cs.fontSize);
    if (size < minFont) out.push(`small text ${size.toFixed(1)}px (min ${minFont}px): ${snip(el)}`);

    const pad = 1;
    if (box.left < B.left - pad || box.top < B.top - pad || box.right > B.right + pad || box.bottom > B.bottom + pad) {
      out.push(`text runs outside the artboard: ${snip(el)}`);
      continue;
    }
    if (safe && (box.left < B.left + safe.l - pad || box.top < B.top + safe.t - pad ||
        box.right > B.right - safe.r + pad || box.bottom > B.bottom - safe.b + pad)) {
      out.push(`text inside the safe margin: ${snip(el)}`);
    }
    for (let a = el; a && a !== board; a = a.parentElement) {
      const acs = a === el ? cs : getComputedStyle(a);
      if (acs.overflowX === 'visible' && acs.overflowY === 'visible') continue;
      const ar = a.getBoundingClientRect();
      if (box.left < ar.left - pad || box.top < ar.top - pad || box.right > ar.right + pad || box.bottom > ar.bottom + pad) {
        out.push(`text clipped by ${describe(a)}: ${snip(el)}`);
        break;
      }
    }
  }
  for (const [family, sample] of fallbacks) {
    out.push(`font "${family}" is not loaded as a webfont; text falls back to another font (${sample})`);
  }
  out.push(...faux);

  // Overlapping text (line rects, not bounding boxes).
  const reported = new Set();
  const htmlTexts = texts.filter((t) => !(t.el instanceof SVGElement));
  for (let i = 0; i < htmlTexts.length; i++) {
    for (let j = i + 1; j < htmlTexts.length; j++) {
      const a = htmlTexts[i], b = htmlTexts[j];
      if (a.el.contains(b.el) || b.el.contains(a.el)) continue;
      if (a.el.closest('[data-allow-overlap]') || b.el.closest('[data-allow-overlap]')) continue;
      const hit = a.rects.some((ra) => b.rects.some((rb) => {
        const w = Math.min(ra.right, rb.right) - Math.max(ra.left, rb.left);
        const h = Math.min(ra.bottom, rb.bottom) - Math.max(ra.top, rb.top);
        const area = (r) => (r.right - r.left) * (r.bottom - r.top);
        return w > 2 && h > 2 && w * h > 0.05 * Math.min(area(ra), area(rb));
      }));
      const key = `${snip(a.el)}|${snip(b.el)}`;
      if (hit && !reported.has(key)) {
        reported.add(key);
        out.push(`text overlaps text: ${snip(a.el)} and ${snip(b.el)} (add data-allow-overlap if intended)`);
      }
    }
  }

  // Images: broken, or upscaled beyond their pixels at this export scale.
  for (const img of board.querySelectorAll('img')) {
    const name = img.getAttribute('src') || '(no src)';
    if (!img.complete || img.naturalWidth === 0) { out.push(`broken image: ${name}`); continue; }
    const r = img.getBoundingClientRect();
    const fit = getComputedStyle(img).objectFit;
    const sx = r.width / img.naturalWidth, sy = r.height / img.naturalHeight;
    const s = fit === 'none' ? 1 : fit === 'contain' || fit === 'scale-down' ? Math.min(sx, sy) : Math.max(sx, sy);
    const eff = s * window.devicePixelRatio;
    if (eff > 1.15 && !/\.svg(\?|#|$)/i.test(name)) {
      out.push(`image upscaled ${eff.toFixed(1)}x, will look soft: ${name} (${img.naturalWidth}×${img.naturalHeight} px)`);
    }
  }
  return out;
}

// Runs in the page: keep only the chosen artboards (all when index is null) and
// stack them one per PDF page. Chrome rounds page sizes up to whole points, so
// the page background takes the first artboard's colour to hide the sliver.
function isolate({ sel, index }) {
  const boards = [...document.querySelectorAll(sel)];
  const keep = index === null ? boards : [boards[index]];
  for (const el of document.body.querySelectorAll('*')) {
    if (keep.some((b) => b === el || b.contains(el))) continue;
    if (keep.some((b) => el.contains(b))) {
      for (const [k, v] of [['display', 'block'], ['margin', '0'], ['padding', '0'], ['border', '0'], ['transform', 'none']]) el.style.setProperty(k, v, 'important');
    } else if (!['STYLE', 'SCRIPT', 'LINK'].includes(el.tagName)) {
      el.style.setProperty('display', 'none', 'important');
    }
  }
  const bg = getComputedStyle(keep[0]).backgroundColor;
  const s = document.createElement('style');
  s.textContent = `html, body { margin: 0 !important; padding: 0 !important; display: block !important; background: ${bg} !important; }` +
    '* { -webkit-print-color-adjust: exact !important; print-color-adjust: exact !important; }';
  document.head.appendChild(s);
  for (const b of keep) {
    for (const [k, v] of [['margin', '0'], ['transform', 'none'], ['break-after', 'page'], ['break-inside', 'avoid']]) b.style.setProperty(k, v, 'important');
  }
}

// Playwright clips element screenshots to whole CSS pixels, so an artboard that
// is 582.05px wide (any mm size) picks up a sliver of page background. Crop to
// the device pixels the artboard fully covers, and encode JPEG if asked.
async function exact(cropper, shot, box, opts) {
  const s = opts.scale;
  const x0 = (box.x - Math.floor(box.x)) * s, y0 = (box.y - Math.floor(box.y)) * s;
  const sx = Math.ceil(x0 - 0.01), sy = Math.ceil(y0 - 0.01);
  const w = Math.floor(x0 + box.width * s + 0.01) - sx, h = Math.floor(y0 + box.height * s + 0.01) - sy;
  const shotW = shot.readUInt32BE(16), shotH = shot.readUInt32BE(20);
  if (opts.format === 'png' && sx === 0 && sy === 0 && w === shotW && h === shotH) return shot;
  const url = await cropper.evaluate(async ({ src, sx, sy, w, h, jpeg, quality }) => {
    const img = new Image();
    img.src = src;
    await img.decode();
    const c = document.createElement('canvas');
    c.width = w;
    c.height = h;
    const g = c.getContext('2d');
    if (jpeg) { g.fillStyle = '#fff'; g.fillRect(0, 0, w, h); }
    g.drawImage(img, sx, sy, w, h, 0, 0, w, h);
    return c.toDataURL(jpeg ? 'image/jpeg' : 'image/png', quality);
  }, { src: `data:image/png;base64,${shot.toString('base64')}`, sx, sy, w, h, jpeg: opts.format === 'jpeg', quality: opts.quality / 100 });
  return Buffer.from(url.slice(url.indexOf(',') + 1), 'base64');
}

function pngSize(file) {
  const b = fs.readFileSync(file);
  return b.toString('ascii', 1, 4) === 'PNG' ? `${b.readUInt32BE(16)}×${b.readUInt32BE(20)} px` : '';
}

async function writeSheet(browser, items, file) {
  const ctx = await browser.newContext({ viewport: { width: 1400, height: 900 } });
  const page = await ctx.newPage();
  const figs = items.map(({ file: f, label }) => {
    const mime = f.endsWith('.png') ? 'image/png' : 'image/jpeg';
    return `<figure><img src="data:${mime};base64,${fs.readFileSync(f).toString('base64')}"><figcaption>${label}</figcaption></figure>`;
  }).join('');
  await page.setContent(`<style>body{margin:0;padding:32px;background:#d4d4d4;font:13px/1.4 system-ui,sans-serif;color:#333}
    main{display:flex;flex-wrap:wrap;gap:32px;align-items:flex-start}figure{margin:0}
    img{display:block;max-height:420px;max-width:640px;box-shadow:0 1px 4px rgb(0 0 0/.3);
    background:repeating-conic-gradient(#eee 0 25%,#fff 0 50%) 0 0/16px 16px}figcaption{margin-top:8px}</style><main>${figs}</main>`);
  await page.evaluate(() => Promise.all([...document.images].map((i) => i.decode())));
  await page.screenshot({ path: file, fullPage: true });
  await ctx.close();
}

async function renderFile(browser, file, opts) {
  const abs = path.resolve(file);
  if (!fs.existsSync(abs)) fail(`no such file: ${file}`);
  const url = pathToFileURL(abs).href;
  const base = path.basename(abs, path.extname(abs));
  const outDir = path.resolve(opts.out || path.join(path.dirname(abs), 'export'));
  fs.mkdirSync(outDir, { recursive: true });

  const ctx = await browser.newContext({ deviceScaleFactor: opts.scale, viewport: { width: 1600, height: 1200 }, reducedMotion: 'reduce' });
  if (opts.localFonts) await registerFonts(ctx);
  const page = await ctx.newPage();
  const problems = [];
  page.on('pageerror', (e) => problems.push(`script error: ${e.message.split('\n')[0]}`));
  page.on('requestfailed', (r) => problems.push(`failed to load ${r.url()} (${r.failure()?.errorText || 'error'})`));
  await load(page, url, opts, problems);

  let boards = await page.evaluate((sel) => [...document.querySelectorAll(sel)].map((el, index) => {
    const r = el.getBoundingClientRect();
    return { index, name: el.dataset.name || el.id || '', width: r.width, height: r.height };
  }), opts.selector);
  if (!boards.length) fail(`${file}: no element matches ${opts.selector}; wrap each graphic in <section class="artboard">`);
  boards.forEach((b) => { b.name = slug(b.name) || (boards.length > 1 ? String(b.index + 1).padStart(2, '0') : ''); });
  if (opts.only) boards = boards.filter((b) => opts.only.includes(b.name));

  const maxW = Math.max(...boards.map((b) => b.width)), maxH = Math.max(...boards.map((b) => b.height));
  await page.setViewportSize({ width: Math.ceil(Math.max(1280, maxW + 64)), height: Math.ceil(Math.max(800, maxH + 64)) });
  const failedFaces = await page.evaluate(() => [...document.fonts].filter((f) => f.status === 'error').map((f) => f.family));
  for (const f of new Set(failedFaces)) problems.push(`font file for ${f} failed to load`);

  console.log(file);
  let warnings = problems.length;
  for (const p of problems) console.log(`  WARN  ${p}`);
  const handles = await page.$$(opts.selector);
  const cropCtx = await browser.newContext();
  const cropper = await cropCtx.newPage();
  const rendered = [];
  for (const b of boards) {
    const minFont = opts.minFont ?? Math.max(10, Math.round(b.width / 72));
    const issues = await page.evaluate(inspect, { sel: opts.selector, index: b.index, minFont, scale: opts.scale });
    const ext = opts.format === 'jpeg' ? 'jpg' : 'png';
    const outFile = path.join(outDir, `${b.name ? `${base}-${b.name}` : base}.${ext}`);
    if (Math.max(b.width, b.height) * opts.scale > 16384) issues.push('over 16384 px at this scale; Chromium may fail, lower --scale/--dpi');
    const shot = await handles[b.index].screenshot({ type: 'png', omitBackground: !!opts.transparent, animations: 'disabled', caret: 'hide' });
    fs.writeFileSync(outFile, await exact(cropper, shot, await handles[b.index].boundingBox(), opts));
    const label = `${b.name || base}  ${Math.round(b.width)}×${Math.round(b.height)}`;
    console.log(`  ok    ${(b.name || base).padEnd(14)} ${pngSize(outFile) || `${Math.floor(b.width * opts.scale + 0.01)}×${Math.floor(b.height * opts.scale + 0.01)} px`}  -> ${path.relative(process.cwd(), outFile)}`);
    for (const i of issues) console.log(`  WARN  ${i}`);
    warnings += issues.length;
    rendered.push({ file: outFile, label });

    if (opts.pdf) {
      const pdfPage = await ctx.newPage();
      await load(pdfPage, url, opts, []);
      await pdfPage.evaluate(isolate, { sel: opts.selector, index: b.index });
      const pdfFile = outFile.replace(/\.(png|jpg)$/, '.pdf');
      await pdfPage.pdf({ path: pdfFile, width: `${b.width / 96}in`, height: `${b.height / 96}in`, printBackground: true, pageRanges: '1' });
      await pdfPage.close();
      console.log(`  pdf   ${(b.name || base).padEnd(14)} ${(b.width / 96 * 25.4).toFixed(1)}×${(b.height / 96 * 25.4).toFixed(1)} mm  -> ${path.relative(process.cwd(), pdfFile)}`);
    }
  }
  if (opts.pdfPages && rendered.length) {
    const { width, height } = boards[0];
    if (boards.some((b) => Math.abs(b.width - width) > 0.5 || Math.abs(b.height - height) > 0.5)) {
      console.log('  WARN  --pdf-pages needs artboards of one size; skipped');
      warnings += 1;
    } else {
      const pdfPage = await ctx.newPage();
      await load(pdfPage, url, opts, []);
      if (opts.only) {
        await pdfPage.evaluate(({ sel, keep }) => {
          [...document.querySelectorAll(sel)].forEach((el, i) => { if (!keep.includes(i)) el.remove(); });
        }, { sel: opts.selector, keep: boards.map((b) => b.index) });
      }
      await pdfPage.evaluate(isolate, { sel: opts.selector, index: null });
      const pdfFile = path.join(outDir, `${base}.pdf`);
      await pdfPage.pdf({ path: pdfFile, width: `${width / 96}in`, height: `${height / 96}in`, printBackground: true });
      await pdfPage.close();
      console.log(`  pdf   ${boards.length} pages ${(width / 96 * 25.4).toFixed(1)}×${(height / 96 * 25.4).toFixed(1)} mm  -> ${path.relative(process.cwd(), pdfFile)}`);
    }
  }
  await ctx.close();
  await cropCtx.close();

  if (opts.sheet && rendered.length) {
    const sheetFile = path.join(outDir, `${base}-sheet.png`);
    await writeSheet(browser, rendered, sheetFile);
    console.log(`  sheet ${path.relative(process.cwd(), sheetFile)}`);
  }
  return warnings;
}

async function main() {
  const opts = parseArgs(process.argv.slice(2));
  let chromium;
  try {
    ({ chromium } = require('playwright'));
  } catch {
    fail('needs Playwright: npm install (or npm i -D playwright) then npx playwright install chromium');
  }
  // Honour an HTTPS proxy for remote fonts and images (e.g. Google Fonts).
  const proxyEnv = process.env.HTTPS_PROXY || process.env.https_proxy;
  let proxy;
  if (proxyEnv) {
    const u = new URL(proxyEnv);
    proxy = { server: `${u.protocol}//${u.host}`, username: decodeURIComponent(u.username) || undefined, password: decodeURIComponent(u.password) || undefined };
  }
  // file:// pages count as one origin, so shape-outside, masks and canvas can read local images.
  const browser = await chromium.launch({ args: ['--allow-file-access-from-files'], ...(proxy ? { proxy } : {}) });
  let warnings = 0;
  try {
    for (const f of opts.files) warnings += await renderFile(browser, f, opts);
  } finally {
    await browser.close();
  }
  console.log(warnings ? `${warnings} warning${warnings > 1 ? 's' : ''}` : 'no warnings');
  process.exit(opts.strict && warnings ? 1 : 0);
}

main().catch((e) => { console.error(e); process.exit(1); });
