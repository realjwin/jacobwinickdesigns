// Vellum (light) <-> Blueprint (dark). Defaults to the OS preference.
const root = document.documentElement;
const mq = window.matchMedia('(prefers-color-scheme: dark)');

const current = (): 'light' | 'dark' =>
  (root.dataset.theme as 'light' | 'dark' | undefined) ?? (mq.matches ? 'dark' : 'light');

function paint() {
  const t = current();
  document.querySelectorAll<HTMLButtonElement>('.theme-toggle').forEach((b) => {
    // The button names the action ("Switch to Vellum mode"). No aria-pressed:
    // a pressed state plus a label that flips would announce contradictions.
    const l = b.querySelector('.tt-label');
    if (l) l.textContent = t === 'dark' ? 'Vellum' : 'Blueprint';
  });
}

document.addEventListener('click', (e) => {
  const btn = (e.target as Element).closest('.theme-toggle');
  if (!btn) return;
  const next = current() === 'dark' ? 'light' : 'dark';
  root.dataset.theme = next;
  document.querySelector('meta[name="theme-color"]:not([media])')?.remove();
  const m = document.createElement('meta');
  m.name = 'theme-color';
  m.content = next === 'dark' ? '#0f2140' : '#eef0ea';
  document.head.prepend(m); // first matching theme-color wins
  try { localStorage.setItem('jw-theme', next); } catch {}
  paint();
});

mq.addEventListener('change', paint);
paint();
