#!/usr/bin/env node
/*
 * Turn text into drawn lettering: real glyph outlines from a font, then warped,
 * jittered, dripped, outlined and extruded like sign-painted or hand-lettered
 * titles. Output is an SVG to place in the HTML (<img>, inline, or as a mask).
 *
 * Usage: node lettering.cjs "TEXT" -o title.svg [options]
 *
 *   Font
 *   --google "Family"     Google Fonts family (downloaded and cached), with --weight / --italic
 *   --font <file>         or a local .ttf/.otf/.woff
 *   --weight 400          --italic
 *
 *   Layout
 *   "LINE ONE|LINE TWO"   | starts a new line
 *   --size 300            em size in px before fitting (default 300)
 *   --leading 0.9         line spacing in em
 *   --tracking 0          letter spacing in 1/1000 em (negative tightens)
 *   --align center        left | center | right | justify (each line scaled to the same width)
 *   --width <px>          scale the finished lettering to this width
 *   --height <px>         ...or this height; with both, stretch to fit (condensed / expanded)
 *
 *   Shape
 *   --warp <kind>         arch | arc | arc-upper | arc-lower | bulge | pinch | wave | rise | perspective | shear
 *   --amount 0.3          warp strength, -1..1 (negative flips it)
 *   --freq 1              waves across the text (wave)
 *   --jitter 0.3          hand-lettered bounce: per-letter rotation, baseline and size (0..1)
 *   --drip 0.5            paint drips hanging from the letters (0..1)
 *   --seed 7
 *
 *   Paint
 *   --fill '#111'         face colour (default #111111; currentColor when inlined)
 *   --stroke '#fff'       outline colour, painted behind the face; --stroke-width 10 (visible width = half)
 *                         with --fill none you get a clean hollow outline (interiors masked)
 *   --stroke2 '#000'      second, wider outline behind the first; --stroke2-width 24
 *   --extrude 24          3D block depth in px (after fitting); --extrude-angle 135; --extrude-color '#000'
 *   --shadow dx,dy,color  flat offset shadow
 *
 *   Per-letter
 *   --only 0,3            keep only these letters (same canvas): a "front" copy for interlocking with a subject
 *   --list                print the letter indexes and exit
 */
'use strict';

const fs = require('fs');
const os = require('os');
const path = require('path');
const { execFileSync } = require('child_process');

let opentype;
try {
  opentype = require('opentype.js');
} catch {
  console.error('lettering.cjs needs opentype.js: npm install (repo root) or npm i -D opentype.js');
  process.exit(2);
}

function fail(msg) {
  console.error(`lettering.cjs: ${msg}`);
  process.exit(2);
}

function usage(code) {
  const text = fs.readFileSync(__filename, 'utf8').split('\n');
  console.log(text.slice(text.findIndex((l) => l.includes('Usage:')), text.indexOf(' */')).map((l) => l.replace(/^ \* ?/, '')).join('\n'));
  process.exit(code);
}

function parseArgs(argv) {
  const o = { size: 300, leading: 0.9, tracking: 0, align: 'center', amount: 0.3, freq: 1, jitter: 0, drip: 0, seed: 7,
    weight: 400, fill: '#111111', strokeWidth: 10, stroke2Width: 24, extrudeAngle: 135, extrudeColor: '#000' };
  const num = (v, name) => (Number.isFinite(Number(v)) ? Number(v) : fail(`${name} must be a number`));
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    const v = () => (i + 1 < argv.length ? argv[++i] : fail(`${a} needs a value`));
    switch (a) {
      case '-o': case '--out': o.out = v(); break;
      case '--google': o.google = v(); break;
      case '--font': o.font = v(); break;
      case '--weight': o.weight = num(v(), a); break;
      case '--italic': o.italic = true; break;
      case '--size': o.size = num(v(), a); break;
      case '--leading': o.leading = num(v(), a); break;
      case '--tracking': o.tracking = num(v(), a); break;
      case '--align': o.align = v(); break;
      case '--width': o.width = num(v(), a); break;
      case '--height': o.height = num(v(), a); break;
      case '--warp': o.warp = v(); break;
      case '--amount': o.amount = num(v(), a); break;
      case '--freq': o.freq = num(v(), a); break;
      case '--jitter': o.jitter = num(v(), a); break;
      case '--drip': o.drip = num(v(), a); break;
      case '--seed': o.seed = num(v(), a); break;
      case '--fill': o.fill = v(); break;
      case '--stroke': o.stroke = v(); break;
      case '--stroke-width': o.strokeWidth = num(v(), a); break;
      case '--stroke2': o.stroke2 = v(); break;
      case '--stroke2-width': o.stroke2Width = num(v(), a); break;
      case '--extrude': o.extrude = num(v(), a); break;
      case '--extrude-angle': o.extrudeAngle = num(v(), a); break;
      case '--extrude-color': o.extrudeColor = v(); break;
      case '--shadow': { const [dx, dy, c] = v().split(','); o.shadow = { dx: Number(dx), dy: Number(dy), color: c || '#000' }; break; }
      case '--only': o.only = v().split(',').map(Number); break;
      case '--list': o.list = true; break;
      case '-h': case '--help': usage(0); break;
      default:
        if (a.startsWith('-')) fail(`unknown option ${a} (see --help)`);
        if (o.text !== undefined) fail('give the text once; use | for line breaks');
        o.text = a;
    }
  }
  if (o.text === undefined) usage(2);
  if (!o.out && !o.list) fail('-o <file.svg> is required');
  if (!o.google && !o.font) fail('choose a font with --google "Family" or --font file.ttf');
  if (!['left', 'center', 'right', 'justify'].includes(o.align)) fail('--align must be left, center, right or justify');
  const warps = ['arch', 'arc', 'arc-upper', 'arc-lower', 'bulge', 'pinch', 'wave', 'rise', 'perspective', 'shear'];
  if (o.warp && !warps.includes(o.warp)) fail(`--warp must be one of ${warps.join(', ')}`);
  return o;
}

// ---------- font loading ----------

function googleFont(family, weight, italic) {
  const dir = path.join(os.tmpdir(), 'html-graphics-fonts');
  fs.mkdirSync(dir, { recursive: true });
  const file = path.join(dir, `${family.replace(/\W+/g, '_')}-${weight}${italic ? 'i' : ''}.ttf`);
  if (fs.existsSync(file)) return file;
  const fam = family.trim().replace(/ +/g, '+');
  const tries = [`${fam}:ital,wght@${italic ? 1 : 0},${weight}`, italic ? `${fam}:ital@1` : null, `${fam}:wght@${weight}`, fam].filter(Boolean);
  for (const t of tries) {
    let css;
    try {
      // curl, not fetch: it honours HTTPS_PROXY everywhere, and its user agent gets TTF files.
      css = execFileSync('curl', ['-sSf', '-m', '30', `https://fonts.googleapis.com/css2?family=${t}`], { encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'] });
    } catch { continue; }
    const url = (css.match(/url\((https:[^)]+\.ttf)\)/) || [])[1];
    if (!url) continue;
    execFileSync('curl', ['-sSf', '-m', '60', '-o', file, url]);
    if (!t.includes(String(weight)) && weight !== 400) console.error(`note: ${family} has no ${weight} weight; used the default`);
    return file;
  }
  fail(`could not download "${family}" from Google Fonts (check the name at fonts.google.com, and network access)`);
}

// ---------- geometry ----------

function rng(seed) {
  let s = seed >>> 0 || 1;
  return () => ((s = (s * 1664525 + 1013904223) >>> 0) / 4294967296);
}
const gauss = (r) => Math.sqrt(-2 * Math.log(r() + 1e-9)) * Math.cos(2 * Math.PI * r());

// Glyph outline -> contours of segments with absolute points.
function contours(cmds) {
  const out = [];
  let cur = null, start = null, pen = null;
  for (const c of cmds) {
    if (c.type === 'M') { cur = { start: [c.x, c.y], segs: [] }; out.push(cur); pen = start = [c.x, c.y]; }
    else if (c.type === 'L') { cur.segs.push({ t: 'L', p: [pen, [c.x, c.y]] }); pen = [c.x, c.y]; }
    else if (c.type === 'Q') { cur.segs.push({ t: 'Q', p: [pen, [c.x1, c.y1], [c.x, c.y]] }); pen = [c.x, c.y]; }
    else if (c.type === 'C') { cur.segs.push({ t: 'C', p: [pen, [c.x1, c.y1], [c.x2, c.y2], [c.x, c.y]] }); pen = [c.x, c.y]; }
    else if (c.type === 'Z') { if (pen[0] !== start[0] || pen[1] !== start[1]) cur.segs.push({ t: 'L', p: [pen, start] }); pen = start; }
  }
  return out;
}

const lerp = (a, b, t) => [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t];

// Split a segment into n pieces (de Casteljau), so warps bend straight edges too.
function split(seg, n) {
  const res = [];
  let s = seg;
  for (let k = n; k > 1; k--) {
    const t = 1 / k;
    const p = s.p;
    if (s.t === 'L') { const m = lerp(p[0], p[1], t); res.push({ t: 'L', p: [p[0], m] }); s = { t: 'L', p: [m, p[1]] }; }
    else if (s.t === 'Q') {
      const a = lerp(p[0], p[1], t), b = lerp(p[1], p[2], t), m = lerp(a, b, t);
      res.push({ t: 'Q', p: [p[0], a, m] }); s = { t: 'Q', p: [m, b, p[2]] };
    } else {
      const a = lerp(p[0], p[1], t), b = lerp(p[1], p[2], t), c = lerp(p[2], p[3], t);
      const d = lerp(a, b, t), e = lerp(b, c, t), m = lerp(d, e, t);
      res.push({ t: 'C', p: [p[0], a, d, m] }); s = { t: 'C', p: [m, e, c, p[3]] };
    }
  }
  res.push(s);
  return res;
}

function mapContours(cs, fn) {
  return cs.map((c) => ({ start: fn(c.start), segs: c.segs.map((s) => ({ t: s.t, p: s.p.map(fn) })) }));
}

function bounds(letters) {
  let x0 = Infinity, y0 = Infinity, x1 = -Infinity, y1 = -Infinity;
  for (const l of letters) for (const c of l.cs) for (const s of c.segs) for (const [x, y] of s.p) {
    if (x < x0) x0 = x; if (x > x1) x1 = x; if (y < y0) y0 = y; if (y > y1) y1 = y;
  }
  return { x0, y0, x1, y1, w: x1 - x0, h: y1 - y0 };
}

function warpFn(kind, a, freq, b) {
  const W = b.w, H = b.h, cx = b.x0 + W / 2;
  const hump = (u) => 1 - (2 * u - 1) ** 2;
  switch (kind) {
    case 'arch': {
      // Bend the baseline round a circle; a = fraction of a half turn.
      const theta = Math.max(Math.abs(a), 1e-3) * Math.PI, R = W / theta;
      return ([x, y]) => {
        const phi = (x - cx) / R;
        if (a >= 0) { const r = R + (b.y1 - y); return [cx + r * Math.sin(phi), b.y1 + R - r * Math.cos(phi)]; }
        const r = R + (y - b.y0); return [cx + r * Math.sin(phi), b.y0 - R + r * Math.cos(phi)];
      };
    }
    case 'arc': return ([x, y]) => [x, y - a * H * hump((x - b.x0) / W)];
    case 'arc-upper': return ([x, y]) => [x, y - a * H * hump((x - b.x0) / W) * (1 - (y - b.y0) / H)];
    case 'arc-lower': return ([x, y]) => [x, y + a * H * hump((x - b.x0) / W) * ((y - b.y0) / H)];
    case 'bulge': return ([x, y]) => [x, y + a * H * hump((x - b.x0) / W) * ((y - b.y0) / H - 0.5) * 2];
    case 'pinch': return ([x, y]) => [x, y - a * H * 0.5 * hump((x - b.x0) / W) * ((y - b.y0) / H - 0.5) * 2];
    case 'wave': return ([x, y]) => [x, y + a * H * 0.5 * Math.sin(2 * Math.PI * freq * (x - b.x0) / W)];
    case 'rise': return ([x, y]) => [x, y - a * H * ((x - b.x0) / W - 0.5)];
    case 'perspective': return ([x, y]) => [cx + (x - cx) * (1 - a * 0.6 * (1 - (y - b.y0) / H)), y];
    case 'shear': return ([x, y]) => [x + a * H * (0.5 - (y - b.y0) / H), y];
    default: return (p) => p;
  }
}

// Point on a contour polyline sample for drip placement.
function samples(cs, step) {
  const pts = [];
  for (const c of cs) for (const s of c.segs) {
    const n = Math.max(2, Math.ceil(Math.hypot(s.p[s.p.length - 1][0] - s.p[0][0], s.p[s.p.length - 1][1] - s.p[0][1]) / step));
    for (const piece of split(s, n)) pts.push(piece.p[piece.p.length - 1]);
  }
  return pts;
}

function dripPaths(letter, amount, size, r) {
  const pts = samples(letter.cs, size * 0.01);
  if (!pts.length) return [];
  const xs = pts.map((p) => p[0]), ys = pts.map((p) => p[1]);
  const lx0 = Math.min(...xs), lx1 = Math.max(...xs), ly0 = Math.min(...ys), ly1 = Math.max(...ys);
  // Candidate spots: the lowest ink at a spread of x positions, kept only near the letter's bottom.
  const spots = [];
  for (let k = 0; k < 14; k++) {
    const x = lx0 + (0.12 + (0.76 * k) / 13) * (lx1 - lx0);
    const near = pts.filter((p) => Math.abs(p[0] - x) < size * 0.015);
    if (!near.length) continue;
    const yb = Math.max(...near.map((p) => p[1]));
    if (yb >= ly1 - (ly1 - ly0) * 0.18) spots.push([x, yb]);
  }
  const count = Math.min(spots.length, Math.round(amount * (0.4 + r() * 1.5)));
  const out = [];
  const f = (n) => n.toFixed(2);
  for (let i = 0; i < count; i++) {
    const [x, yb] = spots.splice(Math.floor(r() * spots.length), 1)[0];
    // Wide where it leaves the letter, tapering to a neck, ending in a drop no wider than the stem.
    const w = size * (0.09 + r() * 0.09), L = size * amount * (0.15 + r() ** 1.3 * 0.65), fl = w * 0.3, rb = w * 0.4;
    const top = yb - w * 0.35;   // starts inside the letter, so the join is hidden by the face
    out.push(`M${f(x - w / 2 - fl)} ${f(top)}Q${f(x - w / 2)} ${f(top)} ${f(x - w / 2)} ${f(yb + w * 0.5)}` +
      `C${f(x - w / 2)} ${f(yb + L * 0.55)} ${f(x - w * 0.32)} ${f(yb + L * 0.7)} ${f(x - w * 0.34)} ${f(yb + L)}` +
      `A${f(rb)} ${f(rb)} 0 1 0 ${f(x + w * 0.34)} ${f(yb + L)}` +
      `C${f(x + w * 0.32)} ${f(yb + L * 0.7)} ${f(x + w / 2)} ${f(yb + L * 0.55)} ${f(x + w / 2)} ${f(yb + w * 0.5)}` +
      `Q${f(x + w / 2)} ${f(top)} ${f(x + w / 2 + fl)} ${f(top)}Z`);
  }
  return out;
}

function toD(cs) {
  const f = (n) => n.toFixed(2);
  let d = '';
  for (const c of cs) {
    d += `M${f(c.start[0])} ${f(c.start[1])}`;
    for (const s of c.segs) {
      const p = s.p;
      if (s.t === 'L') d += `L${f(p[1][0])} ${f(p[1][1])}`;
      else if (s.t === 'Q') d += `Q${f(p[1][0])} ${f(p[1][1])} ${f(p[2][0])} ${f(p[2][1])}`;
      else d += `C${f(p[1][0])} ${f(p[1][1])} ${f(p[2][0])} ${f(p[2][1])} ${f(p[3][0])} ${f(p[3][1])}`;
    }
    d += 'Z';
  }
  return d;
}

// ---------- main ----------

function main() {
  const o = parseArgs(process.argv.slice(2));
  const file = o.font || googleFont(o.google, o.weight, o.italic);
  const font = opentype.parse(new Uint8Array(fs.readFileSync(file)).buffer);
  const size = o.size;
  const unit = size / font.unitsPerEm;
  const r = rng(o.seed);

  // Lay out lines with kerning and tracking.
  const lines = o.text.split('|');
  let letters = [], index = 0;
  const lineInfo = [];
  lines.forEach((text, li) => {
    const glyphs = font.stringToGlyphs(text);
    let x = 0;
    const start = letters.length;
    glyphs.forEach((g, gi) => {
      const ch = text[gi] ?? '';
      const cs = contours(g.getPath(x, 0, size).commands);
      if (cs.length) letters.push({ i: index++, ch, line: li, cs, adv: [x, x + g.advanceWidth * unit] });
      x += g.advanceWidth * unit + (o.tracking / 1000) * size;
      if (gi + 1 < glyphs.length) x += font.getKerningValue(g, glyphs[gi + 1]) * unit;
    });
    lineInfo.push({ start, end: letters.length, width: x - (o.tracking / 1000) * size });
  });
  if (o.list) {
    letters.forEach((l) => console.log(`${l.i}\t${l.ch}\tline ${l.line + 1}`));
    return;
  }

  // Align and stack lines (justify: scale each line to the widest).
  const maxW = Math.max(...lineInfo.map((l) => l.width));
  let y = 0;
  lineInfo.forEach((li, n) => {
    const s = o.align === 'justify' && li.width > 0 ? maxW / li.width : 1;
    const dx = o.align === 'center' ? (maxW - li.width * s) / 2 : o.align === 'right' ? maxW - li.width * s : 0;
    y += (n === 0 ? 1 : o.leading) * size * s * (n === 0 ? 0.75 : 1);
    const base = y;
    for (let k = li.start; k < li.end; k++) {
      letters[k].cs = mapContours(letters[k].cs, ([px, py]) => [dx + px * s, base + py * s]);
    }
  });

  // Hand-lettered jitter: rotate, lift and scale each letter round its centre.
  if (o.jitter > 0) {
    letters = letters.map((l) => {
      const b = bounds([l]);
      const cx = b.x0 + b.w / 2, cy = b.y0 + b.h / 2;
      const ang = gauss(r) * o.jitter * 0.12, lift = gauss(r) * o.jitter * size * 0.05, sc = 1 + gauss(r) * o.jitter * 0.07;
      const cos = Math.cos(ang), sin = Math.sin(ang);
      return { ...l, cs: mapContours(l.cs, ([px, py]) => {
        const qx = (px - cx) * sc, qy = (py - cy) * sc;
        return [cx + qx * cos - qy * sin, cy + qx * sin + qy * cos + lift];
      }) };
    });
  }

  // Warp the whole block.
  if (o.warp) {
    const b = bounds(letters);
    const maxLen = Math.max(b.w, b.h) / 60;
    const fn = warpFn(o.warp, o.amount, o.freq, b);
    letters = letters.map((l) => ({ ...l, cs: l.cs.map((c) => {
      const segs = [];
      for (const s of c.segs) {
        const len = Math.hypot(s.p[s.p.length - 1][0] - s.p[0][0], s.p[s.p.length - 1][1] - s.p[0][1]);
        segs.push(...split(s, Math.max(1, Math.ceil(len / maxLen))));
      }
      return { start: fn(c.start), segs: segs.map((s) => ({ t: s.t, p: s.p.map(fn) })) };
    }) }));
  }

  // Fit to the requested size.
  let b = bounds(letters);
  let sx = 1, sy = 1;
  if (o.width && o.height) { sx = o.width / b.w; sy = o.height / b.h; }
  else if (o.width) sx = sy = o.width / b.w;
  else if (o.height) sx = sy = o.height / b.h;
  letters = letters.map((l) => ({ ...l, cs: mapContours(l.cs, ([px, py]) => [(px - b.x0) * sx, (py - b.y0) * sy]) }));
  const fitted = size * Math.min(sx, sy);

  // Drips hang after warping and fitting, so they fall straight down.
  const drips = new Map();
  if (o.drip > 0) for (const l of letters) drips.set(l.i, dripPaths(l, o.drip, fitted, r));

  const keep = o.only ? letters.filter((l) => o.only.includes(l.i)) : letters;
  // Drips get their own paths: sharing a path with the letter, opposite winding would cut holes.
  const letterSvg = (l) => `<g class="l l-${l.i}"><path d="${toD(l.cs)}"/>${(drips.get(l.i) || []).map((d) => `<path d="${d}"/>`).join('')}</g>`;

  // Canvas: lettering plus outlines, extrusion, shadow and drips (bounds of everything, from all letters).
  b = bounds(letters);
  let dripBottom = b.y1;
  for (const list of drips.values()) for (const d of list) {
    for (const m of d.matchAll(/A[\d.]+ ([\d.]+) 0 1 0 [\d.-]+ ([\d.-]+)/g)) dripBottom = Math.max(dripBottom, Number(m[2]) + Number(m[1]) * 2);
  }
  const pad = Math.max(o.stroke ? o.strokeWidth / 2 : 0, o.stroke2 ? o.stroke2Width / 2 : 0) + 2;
  const ang = (o.extrudeAngle * Math.PI) / 180;
  const ex = o.extrude ? [Math.cos(ang) * o.extrude, Math.sin(ang) * o.extrude] : [0, 0];
  const sh = o.shadow ? [o.shadow.dx, o.shadow.dy] : [0, 0];
  const vx0 = b.x0 - pad + Math.min(0, ex[0], sh[0]), vy0 = b.y0 - pad + Math.min(0, ex[1], sh[1]);
  const vx1 = b.x1 + pad + Math.max(0, ex[0], sh[0]), vy1 = Math.max(b.y1, dripBottom) + pad + Math.max(0, ex[1], sh[1]);
  const W = vx1 - vx0, H = vy1 - vy0;

  const f = (n) => n.toFixed(2);
  const layers = [];
  if (o.shadow) layers.push(`<use href="#face" fill="${o.shadow.color}" transform="translate(${f(sh[0])} ${f(sh[1])})"/>`);
  if (o.extrude) {
    const steps = Math.min(64, Math.max(2, Math.ceil(o.extrude / 1.2)));
    const copies = [];
    for (let k = steps; k >= 1; k--) copies.push(`<use href="#face" transform="translate(${f((ex[0] * k) / steps)} ${f((ex[1] * k) / steps)})"/>`);
    layers.push(`<g fill="${o.extrudeColor}"${o.stroke ? ` stroke="${o.extrudeColor}" stroke-width="${o.strokeWidth}" stroke-linejoin="round"` : ''}>${copies.join('')}</g>`);
  }
  if (o.stroke2) layers.push(`<use href="#face" fill="none" stroke="${o.stroke2}" stroke-width="${o.stroke2Width}" stroke-linejoin="round"/>`);
  // Outline-only lettering: mask out the letter interiors, so overlapping contours (common in
  // static instances of variable fonts) don't show as stray lines inside the letters.
  const hollow = o.fill === 'none';
  const mask = hollow
    ? `<mask id="outside" maskUnits="userSpaceOnUse" x="${f(vx0)}" y="${f(vy0)}" width="${f(W)}" height="${f(H)}">` +
      `<rect x="${f(vx0)}" y="${f(vy0)}" width="${f(W)}" height="${f(H)}" fill="#fff"/><use href="#face" fill="#000"/></mask>`
    : '';
  if (o.stroke) layers.push(`<use href="#face" fill="none" stroke="${o.stroke}" stroke-width="${o.strokeWidth}" stroke-linejoin="round"${hollow ? ' mask="url(#outside)"' : ''}/>`);
  if (!hollow) layers.push(`<use href="#face" fill="${o.fill}"/>`);
  const defs = `<defs><g id="face">${keep.map(letterSvg).join('')}</g>${mask}</defs>`;
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${f(vx0)} ${f(vy0)} ${f(W)} ${f(H)}" width="${Math.round(W)}" height="${Math.round(H)}">` +
    `${defs}${layers.join('')}</svg>\n`;
  fs.writeFileSync(o.out, svg);
  console.log(`Wrote ${o.out} (${Math.round(W)} x ${Math.round(H)} px, ${keep.length} letters${o.only ? ` of ${letters.length}` : ''})`);
}

main();
