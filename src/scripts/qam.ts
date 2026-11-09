// 16-QAM over AWGN — a real (tiny) simulation shared by server render and client.
export const LEVELS = [-3, -1, 1, 3];
export const ES = 10; // average symbol energy for levels ±1, ±3
export const N = 512;

function mulberry32(seed: number) {
  return () => {
    seed |= 0; seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export type Draw = { si: number; sq: number; ni: number; nq: number };

/** Fixed symbols + unit-variance noise; SNR only rescales the noise, so points glide. */
export function draws(seed = 7): Draw[] {
  const r = mulberry32(seed);
  const out: Draw[] = [];
  for (let k = 0; k < N; k++) {
    const sym = k % 16;
    const u1 = Math.max(r(), 1e-12), u2 = r();
    const mag = Math.sqrt(-2 * Math.log(u1));
    out.push({
      si: LEVELS[sym % 4], sq: LEVELS[sym >> 2],
      ni: mag * Math.cos(2 * Math.PI * u2), nq: mag * Math.sin(2 * Math.PI * u2),
    });
  }
  return out;
}

const decide = (v: number) => Math.max(-3, Math.min(3, 2 * Math.floor(v / 2) + 1));

export function received(d: Draw[], snrDb: number) {
  const sigma = Math.sqrt(ES / (2 * 10 ** (snrDb / 10)));
  let errors = 0;
  const pts = d.map((p) => {
    const i = p.si + sigma * p.ni, q = p.sq + sigma * p.nq;
    const err = decide(i) !== p.si || decide(q) !== p.sq;
    if (err) errors++;
    return { i, q, err };
  });
  return { pts, errors };
}

// Complementary error function (Numerical Recipes erfcc, |rel err| < 1.2e-7)
function erfc(x: number) {
  const z = Math.abs(x), t = 1 / (1 + 0.5 * z);
  const r = t * Math.exp(-z * z - 1.26551223 + t * (1.00002368 + t * (0.37409196 + t * (0.09678418 + t * (-0.18628806 + t * (0.27886807 + t * (-1.13520398 + t * (1.48851587 + t * (-0.82215223 + t * 0.17087277)))))))));
  return x >= 0 ? r : 2 - r;
}
const Q = (x: number) => 0.5 * erfc(x / Math.SQRT2);

/** Theoretical symbol error rate of square 16-QAM at Es/N0 (dB). */
export function serTheory(snrDb: number) {
  const g = 10 ** (snrDb / 10);
  const p = 2 * (1 - 1 / 4) * Q(Math.sqrt((3 * g) / 15));
  return 1 - (1 - p) ** 2;
}

export const fmtSci = (v: number) => {
  if (v === 0) return '0';
  if (v >= 0.01) return v.toFixed(3);
  const e = Math.floor(Math.log10(v));
  return `${(v / 10 ** e).toFixed(1)}e${e}`;
};
