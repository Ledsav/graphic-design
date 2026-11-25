// Poster graphic helpers. Seeded, so every render is identical.
// pgBarcode(svgEl, seed, colour): fills an <svg viewBox="0 0 W H"> with EAN-looking bars (guard bars run long).
function pgBarcode(svg, seed = 7, colour = 'currentColor') {
  const [, , W, H] = svg.getAttribute('viewBox').split(/\s+/).map(Number);
  let s = seed, x = 0, bars = '';
  const rnd = () => (s = (s * 9301 + 49297) % 233280) / 233280;
  const guard = (gx) => { bars += `<rect x="${gx}" width="1.4" height="${H}" fill="${colour}"/><rect x="${gx + 3}" width="1.4" height="${H}" fill="${colour}"/>`; };
  guard(0); x = 6;
  while (x < W - 7) {
    if (Math.abs(x - W / 2) < 3) { guard(x); x += 6; continue; }
    const w = .9 + Math.floor(rnd() * 3) * .9;
    if (rnd() > .42) bars += `<rect x="${x.toFixed(1)}" width="${w.toFixed(1)}" height="${H * .86}" fill="${colour}"/>`;
    x += w + .9;
  }
  guard(W - 4.4);
  svg.innerHTML = bars;
}
document.querySelectorAll('svg[data-barcode]').forEach((el) => pgBarcode(el, Number(el.dataset.barcode) || 7, el.dataset.colour));
