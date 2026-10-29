/* VC Belair game-day template.
   A game file sets window.GAMEDAY (date, fixtures, player cut-out) and then loads this script, which builds
   the Instagram feed post (1080 x 1350) and the story (1080 x 1920). Things that stay the same every week
   (logo, hall, league, sponsors) live in CLUB below. Any empty value ("") renders as a dashed placeholder. */

const CLUB = {
  logo: 'assets/logo-white.png',
  venue: { name: 'Hall sportif de Belair', address: "14 Rue d'Ostende, Luxembourg" },
  // League mark: a white or full-colour PNG/SVG that reads on the club blue. Empty shows the name as type.
  league: { name: 'Mixvoip League', logo: '' },
  // Sponsor logos sit on a white band, so any file with a white or transparent background works.
  // Swap the banner crops for the sponsors' official files when you have them (same names, or edit the paths).
  // Logos all get the same area; `scale` nudges one that looks light (a crest with small type, a boxed logo).
  sponsors: [
    { name: 'Bitrock Team', logo: 'assets/sponsors/bitrock-team.png' },
    { name: 'taxx.lu', logo: 'assets/sponsors/taxx.png' },
    { name: 'Vallair', logo: 'assets/sponsors/vallair.png' },
    { name: 'Foyer Stevenson Della Siega', logo: 'assets/sponsors/foyer-stevenson-della-siega.png', scale: 1.1 },
    { name: 'Pacha', logo: 'assets/sponsors/pacha.png' },
    { name: 'F45', logo: 'assets/sponsors/f45.png' },
    { name: 'Toitures Goerens', logo: 'assets/sponsors/toitures-goerens.png', scale: 1.2 },
    { name: 'Salary', logo: '' },   // the banner copy is covered by Instagram's mute icon: needs the real file
  ],
};

const FORMATS = [
  { name: 'feed', w: 1080, h: 1350 },
  { name: 'story', w: 1080, h: 1920 },
];

const el = (tag, cls, html) => {
  const n = document.createElement(tag);
  if (cls) n.className = cls;
  if (html != null) n.innerHTML = html;
  return n;
};
const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
const ph = (value, fallback) => value ? esc(value) : `<span class="ph">${fallback}</span>`;

function formatDate(iso) {
  if (!iso) return null;
  const d = new Date(iso + 'T12:00:00');
  return {
    weekday: d.toLocaleDateString('en-GB', { weekday: 'long' }),
    day: String(d.getDate()),
    month: d.toLocaleDateString('en-GB', { month: 'long' }),
  };
}

function initials(name) {
  const words = name.replace(/[^A-Za-zÀ-ÿ0-9 ]/g, ' ').split(/\s+/).filter(Boolean);
  if (words.length === 1) return words[0].slice(0, 3).toUpperCase();
  return words.slice(0, 3).map((w) => w[0]).join('').toUpperCase();
}

function crest(fx) {
  if (fx.crest) return `<div class="crest"><img src="${esc(fx.crest)}" alt="${esc(fx.opponent || 'Opponent')}"></div>`;
  if (fx.opponent) return `<div class="crest crest-type"><span>${esc(initials(fx.opponent))}</span></div>`;
  return `<div class="crest crest-ph"><span>Logo</span></div>`;
}

function fixtureRow(fx) {
  const away = fx.home === false;
  const sub = [fx.competition, away ? (fx.venue ? `Away at ${fx.venue}` : 'Away') : null].filter(Boolean).join(', ');
  return `<div class="fx${away ? ' fx-away' : ''}">
      <div class="fx-when"><span class="fx-team">${ph(fx.team, 'Team')}</span><span class="fx-time">${ph(fx.time, '00:00')}</span></div>
      <span class="fx-vs">${away ? 'at' : 'vs'}</span>
      ${crest(fx)}
      <div class="fx-opp"><span class="fx-name">${ph(fx.opponent, 'Opponent')}</span>${sub ? `<span class="fx-sub">${esc(sub)}</span>` : ''}</div>
    </div>`;
}

function sponsorCell(s) {
  if (s.logo) return `<div class="sp"><img src="${esc(s.logo)}" alt="${esc(s.name)}" data-sponsor data-scale="${s.scale || 1}"></div>`;
  return `<div class="sp sp-ph" data-ignore><span>${esc(s.name || 'Sponsor')}</span><small>logo</small></div>`;
}

function build(fmt, g) {
  const date = formatDate(g.date);
  const titleLines = (g.title || 'Game|Day').split('|').map((l) => `<span class="tl">${esc(l)}</span>`).join('');
  const anyHome = g.fixtures.some((f) => f.home !== false);
  const hasPlayer = g.player !== null;

  const a = el('section', `artboard ${fmt.name}${hasPlayer ? '' : ' no-player'}`);
  a.dataset.name = fmt.name;
  a.innerHTML = `
    <div class="bg"></div>
    <div class="lion"></div>
    <!-- Three copies of the title, each showing one piece; the outer two are checked through the middle one
         (the checker measures text before clip-path, so their slid-over boxes would read as margin hits). -->
    <div class="title" aria-label="${esc((g.title || 'Game|Day').replace('|', ' '))}">
      <div class="slice" data-ignore>${titleLines}</div>
      <div class="slice" data-allow-overlap>${titleLines}</div>
      <div class="slice" data-ignore>${titleLines}</div>
    </div>
    ${!hasPlayer ? '' : g.player
      ? `<img class="player" src="${esc(g.player)}" alt="VC Belair player">`
      : `<div class="player player-ph"><span>Player cut-out<small>transparent PNG, head to waist</small></span></div>`}
    <div class="scrim"></div>
    <img class="logo" src="${CLUB.logo}" alt="VC Belair">

    <div class="info">
      <div class="when">
        <p class="date">${date
          ? `<span class="d-wd">${date.weekday}</span> <span class="d-dm">${date.day} ${date.month}</span>`
          : `<span class="ph">Day 00 Month</span>`}</p>
        ${anyHome ? `<p class="venue"><span class="home">Home</span><span>${esc(CLUB.venue.name)}<br>${esc(CLUB.venue.address)}</span></p>` : ''}
      </div>
      <div class="fixtures n${g.fixtures.length}">${g.fixtures.map(fixtureRow).join('')}</div>
    </div>

    <div class="partners">
      <div class="league" data-ignore>${CLUB.league.logo
        ? `<img src="${esc(CLUB.league.logo)}" alt="${esc(CLUB.league.name)}">`
        : `<span>${esc(CLUB.league.name).replace(' ', '<br>')}</span>`}</div>
      <div class="sponsors">${CLUB.sponsors.map(sponsorCell).join('')}</div>
    </div>`;
  return a;
}

/* ---- Layout: runs on load and again once the fonts are in (render.cjs calls window.layout). ---- */

// Fit each title line to the same width (a justified word stack), then cut the block along two shard lines
// parallel to the lion's mane and slide the pieces apart, like the gaps between the shards in the logo.
function layoutTitle(t) {
  const target = parseFloat(getComputedStyle(t).getPropertyValue('--title-w'));
  const lead = parseFloat(getComputedStyle(t).getPropertyValue('--title-lead')) || 0.06;
  for (const slice of t.querySelectorAll('.slice')) {
    for (const line of slice.querySelectorAll('.tl')) {
      line.style.fontSize = '100px';
      const w = line.getBoundingClientRect().width;
      line.style.fontSize = `${(100 * target) / w}px`;
    }
  }
  const lines = [...t.querySelector('.slice').querySelectorAll('.tl')];
  // Stack by cap height so the gap between lines is the same whatever their sizes.
  const cs = getComputedStyle(lines[0]);
  const ctx = document.createElement('canvas').getContext('2d');
  ctx.font = `${cs.fontStyle} ${cs.fontWeight} 100px ${cs.fontFamily}`;
  const m = ctx.measureText('H');
  const A = m.fontBoundingBoxAscent / 100, D = m.fontBoundingBoxDescent / 100, C = m.actualBoundingBoxAscent / 100;
  const capTop = (1 + A - D) / 2 - C;     // with line-height: 1
  let y = 0;
  for (const slice of t.querySelectorAll('.slice')) {
    y = 0;
    slice.querySelectorAll('.tl').forEach((line, i) => {
      const fs = parseFloat(line.style.fontSize);
      line.style.top = `${y - fs * capTop}px`;
      y += fs * C + (i < lines.length - 1 ? target * lead : 0);
    });
  }
  const W = target, H = y;
  t.style.width = `${W}px`;
  t.style.height = `${H}px`;

  const deg = parseFloat(getComputedStyle(t).getPropertyValue('--cut-angle')) || 22;
  const gap = parseFloat(getComputedStyle(t).getPropertyValue('--cut-gap')) || 12;
  const slide = parseFloat(getComputedStyle(t).getPropertyValue('--cut-slide')) || 16;
  const th = (deg * Math.PI) / 180;
  const n = [Math.sin(th), Math.cos(th)];            // normal pointing down-right
  const dir = [Math.cos(th), -Math.sin(th)];         // along the cut, rising to the right
  const cuts = [[0.30 * W, 0.24 * H], [0.60 * W, 0.74 * H]].map(([x, y]) => x * n[0] + y * n[1]);
  const P = 400;
  const rect = [[-P, -P], [W + P, -P], [W + P, H + P], [-P, H + P]];
  const clip = (poly, c, keepAbove) => {      // keep the side where (p·n - c) <= 0 (keepAbove) or >= 0
    const f = (p) => (keepAbove ? -1 : 1) * (p[0] * n[0] + p[1] * n[1] - c);
    const out = [];
    poly.forEach((p, i) => {
      const q = poly[(i + 1) % poly.length];
      const fp = f(p), fq = f(q);
      if (fp >= 0) out.push(p);
      if ((fp >= 0) !== (fq >= 0)) {
        const k = fp / (fp - fq);
        out.push([p[0] + (q[0] - p[0]) * k, p[1] + (q[1] - p[1]) * k]);
      }
    });
    return out;
  };
  const pieces = [
    clip(rect, cuts[0] - gap / 2, true),
    clip(clip(rect, cuts[0] + gap / 2, false), cuts[1] - gap / 2, true),
    clip(rect, cuts[1] + gap / 2, false),
  ];
  const shifts = [slide, 0, -slide];
  t.querySelectorAll('.slice').forEach((s, i) => {
    s.style.clipPath = `polygon(${pieces[i].map(([x, y]) => `${x.toFixed(1)}px ${y.toFixed(1)}px`).join(',')})`;
    s.style.transform = `translate(${(dir[0] * shifts[i]).toFixed(1)}px, ${(dir[1] * shifts[i]).toFixed(1)}px)`;
  });
}

// Opponent names: shrink to fit one line, down to a floor; past that, wrap onto two balanced lines.
function layoutNames(a) {
  for (const name of a.querySelectorAll('.fx-name')) {
    const box = name.parentElement;
    name.style.fontSize = '';
    name.style.whiteSpace = 'nowrap';
    const max = parseFloat(getComputedStyle(name).fontSize);
    const min = max * 0.68;
    let fs = max;
    name.style.fontSize = `${fs}px`;
    while (name.scrollWidth > box.clientWidth && fs > min) { fs -= 1; name.style.fontSize = `${fs}px`; }
    if (name.scrollWidth > box.clientWidth) name.style.whiteSpace = 'normal';
  }
}

// Date line: long dates (Wednesday 18 November) shrink so the hall still fits beside them.
function layoutWhen(a) {
  const when = a.querySelector('.when'), date = a.querySelector('.date');
  date.style.fontSize = '';
  let fs = parseFloat(getComputedStyle(date).fontSize);
  while (when.scrollWidth > when.clientWidth && fs > 44) { fs -= 1; date.style.fontSize = `${fs}px`; }
}

// Sponsor logos: equal visual weight, so each gets the same area, capped by the cell.
function layoutSponsors(a) {
  for (const img of a.querySelectorAll('img[data-sponsor]')) {
    const cell = img.parentElement;
    const area = parseFloat(getComputedStyle(cell).getPropertyValue('--logo-area')) * parseFloat(img.dataset.scale) ** 2;
    const maxW = cell.clientWidth * 0.86, maxH = cell.clientHeight * 0.8;
    const r = img.naturalWidth / img.naturalHeight || 2;
    let h = Math.sqrt(area / r), w = h * r;
    const k = Math.min(1, maxW / w, maxH / h);
    img.style.width = `${w * k}px`;
    img.style.height = `${h * k}px`;
  }
}

window.layout = async () => {
  await Promise.all([...document.images].map((i) => (i.complete ? null : new Promise((r) => { i.onload = i.onerror = r; }))));
  for (const a of document.querySelectorAll('.artboard')) {
    layoutTitle(a.querySelector('.title'));
    layoutNames(a);
    layoutWhen(a);
    layoutSponsors(a);
  }
};

const g = window.GAMEDAY;
for (const fmt of FORMATS) document.body.appendChild(build(fmt, g));
document.fonts.ready.then(() => window.layout());
