// Dimension lines: hovering or keyboard-focusing any [data-dim] element draws
// real drafting dimensions (width above, height to the right) measured in CSS px.

const SVG = 'http://www.w3.org/2000/svg';
const layer = document.getElementById('dim-layer') as SVGSVGElement | null;
const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)');
const reduce = window.matchMedia('(prefers-reduced-motion: reduce)');

let active: Element | null = null;
let raf = 0;

const OFFSET = 12;   // gap from element edge to dimension line
const EXT = 4;       // extension-line overshoot
const TICK = 4;      // half-length of the 45° architectural tick

function el<K extends keyof SVGElementTagNameMap>(tag: K, attrs: Record<string, string | number>) {
  const n = document.createElementNS(SVG, tag);
  for (const k in attrs) n.setAttribute(k, String(attrs[k]));
  return n;
}

function line(x1: number, y1: number, x2: number, y2: number, cls: string, animate: boolean) {
  const n = el('line', { x1, y1, x2, y2, class: cls });
  if (animate) {
    const len = Math.hypot(x2 - x1, y2 - y1);
    n.style.setProperty('--len', String(len));
    n.classList.add('draw');
  }
  return n;
}

function tick(x: number, y: number) {
  return el('line', { x1: x - TICK, y1: y + TICK, x2: x + TICK, y2: y - TICK, class: 'fade' });
}

function label(x: number, y: number, text: string, vertical = false) {
  const g = el('g', { class: 'fade' });
  const w = text.length * 6.2 + 8;
  const h = 13;
  const rect = vertical
    ? el('rect', { x: x - h / 2, y: y - w / 2, width: h, height: w, class: 'bg' })
    : el('rect', { x: x - w / 2, y: y - h / 2, width: w, height: h, class: 'bg' });
  const t = el('text', {
    x, y,
    'text-anchor': 'middle',
    'dominant-baseline': 'central',
    ...(vertical ? { transform: `rotate(-90 ${x} ${y})` } : {}),
  });
  t.textContent = text;
  g.append(rect, t);
  return g;
}

function draw(target: Element, animate: boolean) {
  if (!layer) return;
  layer.replaceChildren();
  const r = target.getBoundingClientRect();
  if (r.width < 8 || r.height < 8) return;
  const vw = window.innerWidth;

  const w = Math.round(r.width);
  const h = Math.round(r.height);

  // Horizontal (width) dimension above; flip below if no room.
  const above = r.top - OFFSET > 16;
  const y = above ? r.top - OFFSET : r.bottom + OFFSET;
  const ey0 = above ? r.top - 2 : r.bottom + 2;
  const ey1 = above ? y - EXT : y + EXT;
  layer.append(
    line(r.left, ey0, r.left, ey1, 'ext', animate),
    line(r.right, ey0, r.right, ey1, 'ext', animate),
    line(r.left, y, r.right, y, 'dim', animate),
    tick(r.left, y), tick(r.right, y),
  );
  if (r.width > 34) layer.append(label((r.left + r.right) / 2, y, String(w)));

  // Vertical (height) dimension to the right; flip left if no room.
  if (r.height >= 18) {
    const right = r.right + OFFSET + 16 < vw;
    const x = right ? r.right + OFFSET : r.left - OFFSET;
    const ex0 = right ? r.right + 2 : r.left - 2;
    const ex1 = right ? x + EXT : x - EXT;
    layer.append(
      line(ex0, r.top, ex1, r.top, 'ext', animate),
      line(ex0, r.bottom, ex1, r.bottom, 'ext', animate),
      line(x, r.top, x, r.bottom, 'dim', animate),
      tick(x, r.top), tick(x, r.bottom),
    );
    if (r.height > 34) layer.append(label(x, (r.top + r.bottom) / 2, String(h), true));
  }
}

function show(target: Element) {
  active = target;
  draw(target, !reduce.matches);
}

function hide(target?: Element) {
  if (target && target !== active) return;
  active = null;
  layer?.replaceChildren();
}

function follow() {
  if (!active) return;
  cancelAnimationFrame(raf);
  raf = requestAnimationFrame(() => active && draw(active, false));
}

document.addEventListener('pointerover', (e) => {
  if (!finePointer.matches || e.pointerType !== 'mouse') return;
  const t = (e.target as Element).closest('[data-dim]');
  if (t && t !== active) show(t);
});
document.addEventListener('pointerout', (e) => {
  const t = (e.target as Element).closest('[data-dim]');
  const to = (e.relatedTarget as Element | null)?.closest?.('[data-dim]');
  if (t && t !== to) hide(t);
});
document.addEventListener('focusin', (e) => {
  // Test the focused element itself: the [data-dim] ancestor (e.g. a register
  // <tr>) is never :focus-visible.
  const target = e.target as Element;
  const t = target.closest('[data-dim]');
  if (t && target.matches(':focus-visible')) show(t);
});
document.addEventListener('focusout', (e) => {
  const t = (e.target as Element).closest('[data-dim]');
  if (t) hide(t);
});
window.addEventListener('scroll', follow, { passive: true });
window.addEventListener('resize', follow);
