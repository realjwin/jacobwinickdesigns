// Vellum (light) <-> Blueprint (dark). Defaults to the OS preference.
const root = document.documentElement;
const mq = window.matchMedia('(prefers-color-scheme: dark)');

const current = (): 'light' | 'dark' =>
  (root.dataset.theme as 'light' | 'dark' | undefined) ?? (mq.matches ? 'dark' : 'light');

function paint() {
  const t = current();
  document.querySelectorAll<HTMLButtonElement>('.theme-toggle').forEach((b) => {
    b.setAttribute('aria-pressed', String(t === 'dark'));
    const l = b.querySelector('.tt-label');
    if (l) l.textContent = t === 'dark' ? 'Vellum' : 'Blueprint';
    b.setAttribute('aria-label', t === 'dark' ? 'Switch to vellum (light) mode' : 'Switch to blueprint (dark) mode');
  });
}

document.addEventListener('click', (e) => {
  const btn = (e.target as Element).closest('.theme-toggle');
  if (!btn) return;
  const next = current() === 'dark' ? 'light' : 'dark';
  root.dataset.theme = next;
  try { localStorage.setItem('jw-theme', next); } catch {}
  paint();
});

mq.addEventListener('change', paint);
paint();
