/* VC Belair game-day post (Instagram feed, 1080 x 1350).
   A game file sets window.GAMEDAY (date, games, player cut-out) and then loads this script, which builds the post.
   Things that stay the same every week (logo, hall, league, sponsors) live in CLUB below.
   Any empty value ("") renders as a dashed placeholder. */

const CLUB = {
  logo: 'assets/logo-white.png',
  venue: { name: 'Hall sportif de Belair', address: "14 Rue d'Ostende, Luxembourg" },
  league: 'Mixvoip League',
  // Sponsor logos run in one colour (white) on the dark bar. assets/sponsors/white/ holds white versions made from
  // the banner crops; replace them with the sponsors' official white or one-colour files when you have them.
  // Every logo gets the same area; `scale` nudges one that looks too heavy or too light.
  sponsors: [
    { name: 'Bitrock Team', logo: 'assets/sponsors/white/bitrock-team.png' },
    { name: 'taxx.lu', logo: 'assets/sponsors/white/taxx.png' },
    { name: 'Vallair', logo: 'assets/sponsors/white/vallair.png' },
    { name: 'Foyer Stevenson Della Siega', logo: 'assets/sponsors/white/foyer-stevenson-della-siega.png', scale: 1.28 },
    { name: 'Pacha', logo: 'assets/sponsors/white/pacha.png', scale: 0.92 },
    { name: 'F45', logo: 'assets/sponsors/white/f45.png', scale: 0.92 },
    { name: 'Toitures Goerens', logo: 'assets/sponsors/white/toitures-goerens.png', scale: 1.08 },
    { name: 'Salary', logo: '' },   // the banner copy is covered by Instagram's mute icon: needs the real file
  ],
};

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

function fixture(fx) {
  const away = fx.home === false;
  const sub = [fx.competition, away ? (fx.venue ? `Away at ${fx.venue}` : 'Away') : null].filter(Boolean).join(', ');
  return `<div class="fx${away ? ' fx-away' : ''}">
      <p class="fx-team">${ph(fx.team, 'Team')}</p>
      <p class="fx-time">${ph(fx.time, '00:00')}</p>
      <div class="fx-opp">
        <span class="fx-vs">${away ? 'at' : 'vs'}</span>
        ${crest(fx)}
        <span class="fx-name">${ph(fx.opponent, 'Opponent')}</span>
      </div>
      ${sub ? `<p class="fx-sub">${esc(sub)}</p>` : ''}
    </div>`;
}

function sponsor(s) {
  if (s.logo) return `<div class="sp"><img src="${esc(s.logo)}" alt="${esc(s.name)}" data-sponsor data-scale="${s.scale || 1}"></div>`;
  return `<div class="sp sp-ph" data-ignore><span>${esc(s.name || 'Sponsor')} logo</span></div>`;
}

function build(g) {
  const date = formatDate(g.date);
  const title = (g.title || 'Game|Day').split('|');
  const anyHome = g.fixtures.some((f) => f.home !== false);
  const hasPlayer = g.player !== null;

  const a = el('section', `artboard feed n${g.fixtures.length}${hasPlayer ? '' : ' no-player'}`);
  a.dataset.name = 'post';
  a.innerHTML = `
    <div class="bg"></div>
    <div class="rays"></div>
    <div class="lion"></div>
    <h1 class="title" data-ignore aria-label="${esc(title.join(' '))}">${title.map((l) => `<span class="tl">${esc(l)}</span>`).join('')}</h1>
    ${!hasPlayer ? '' : g.player
      ? `<img class="player" src="${esc(g.player)}" alt="VC Belair player">`
      : `<div class="player player-ph"><span>Player cut-out<small>transparent PNG, head to waist</small></span></div>`}

    <header class="head">
      <img class="logo" src="${CLUB.logo}" alt="VC Belair">
      <p class="league">${esc(CLUB.league).replace(' ', '<br>')}</p>
    </header>

    <div class="info">
      <div class="when">
        <p class="date">${date ? `${date.weekday} ${date.day} ${date.month}` : `<span class="ph">Day 00 Month</span>`}</p>
        ${anyHome ? `<p class="venue"><b>${esc(CLUB.venue.name)}</b><br>${esc(CLUB.venue.address)}</p>` : ''}
      </div>
      <div class="fixtures">${g.fixtures.map(fixture).join('')}</div>
    </div>

    <footer class="partners"><div class="sponsors">${CLUB.sponsors.map(sponsor).join('')}</div></footer>
    <div class="grain"></div>`;
  return a;
}

/* ---- Layout: runs on load and again once the fonts are in (render.cjs calls window.layout). ---- */

// Title: both words at one size, so the longest fills --title-w; the shorter one leaves room for the player.
function layoutTitle(t) {
  const target = parseFloat(getComputedStyle(t).getPropertyValue('--title-w'));
  const lines = [...t.querySelectorAll('.tl')];
  t.style.fontSize = '100px';
  const w = Math.max(...lines.map((l) => l.getBoundingClientRect().width));
  t.style.fontSize = `${(100 * target) / w}px`;
}

// Opponent names: shrink to fit one line, down to a floor; past that, wrap onto two balanced lines.
function layoutNames(a) {
  for (const name of a.querySelectorAll('.fx-name')) {
    const box = name.parentElement;
    name.style.fontSize = '';
    name.style.whiteSpace = 'nowrap';
    const max = parseFloat(getComputedStyle(name).fontSize);
    let fs = max;
    while (box.scrollWidth > box.clientWidth && fs > max * 0.7) { fs -= 1; name.style.fontSize = `${fs}px`; }
    if (box.scrollWidth > box.clientWidth) name.style.whiteSpace = 'normal';
  }
}

// Date line: long dates (Wednesday 18 November) shrink so the hall still fits beside them.
function layoutWhen(a) {
  const when = a.querySelector('.when'), date = a.querySelector('.date');
  date.style.fontSize = '';
  let fs = parseFloat(getComputedStyle(date).fontSize);
  while (when.scrollWidth > when.clientWidth && fs > 36) { fs -= 1; date.style.fontSize = `${fs}px`; }
}

// Sponsor logos: equal visual weight, so each gets the same area, capped by the cell.
function layoutSponsors(a) {
  for (const img of a.querySelectorAll('img[data-sponsor]')) {
    const cell = img.parentElement;
    const area = parseFloat(getComputedStyle(cell).getPropertyValue('--logo-area')) * parseFloat(img.dataset.scale) ** 2;
    const maxW = cell.clientWidth * 0.84, maxH = cell.clientHeight * 0.78;
    const r = img.naturalWidth / img.naturalHeight || 2;
    const h = Math.sqrt(area / r), w = h * r;
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

document.body.appendChild(build(window.GAMEDAY));
document.fonts.ready.then(() => window.layout());
