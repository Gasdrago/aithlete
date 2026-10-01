/**
 * Parametric Greek statue generator.
 *
 * Produces a platform-agnostic scene (paths + paint references) describing a
 * classical marble statue. The same generator draws the gods of the pantheon
 * and the athlete: body widths come straight from body measurements, so the
 * comparison between the user and a god is literal, not decorative.
 *
 * Coordinates: x = 100 is the vertical axis, the figure stands from y ≈ 16
 * (top of skull) to y = 336 (soles) — eight heads, the classical canon.
 */

export type StatueSex = 'male' | 'female';

export type StatueMaterial = 'clay' | 'bronze' | 'marble' | 'gold';

export type HeadGear =
  | 'none'
  | 'curls'
  | 'ribbon'
  | 'laurel'
  | 'helmet'
  | 'petasos'
  | 'crown'
  | 'lionHood'
  | 'diadem'
  | 'crescent';

export type Attribute =
  | 'none'
  | 'thunderbolt'
  | 'trident'
  | 'caduceus'
  | 'spearShield'
  | 'club'
  | 'lyre'
  | 'bow'
  | 'scepter'
  | 'apple'
  | 'wreath'
  | 'javelin';

export interface StatueParams {
  sex: StatueSex;
  neck: number;
  shoulder: number;
  chest: number;
  waist: number;
  hip: number;
  arm: number;
  forearm: number;
  thigh: number;
  calf: number;
  /** Muscle definition, 0 (soft) → 1 (carved). */
  definition: number;
}

export interface StatueStyle {
  headGear: HeadGear;
  attribute: Attribute;
  beard?: boolean;
  longHair?: boolean;
  wings?: boolean;
}

export type Paint =
  | 'skin'
  | 'cloth'
  | 'hair'
  | 'gold'
  | 'line'
  | 'lineSoft'
  | 'light'
  | 'shadow'
  | 'void'
  | 'plinth'
  | 'plinthTrim'
  | 'none';

export interface PathLayer {
  kind: 'path';
  d: string;
  fill?: Paint;
  stroke?: Paint;
  strokeWidth?: number;
  opacity?: number;
  /** Part of the body silhouette (used to clip the global shading). */
  clip?: boolean;
}

export interface EllipseLayer {
  kind: 'ellipse';
  cx: number;
  cy: number;
  rx: number;
  ry: number;
  fill?: Paint;
  stroke?: Paint;
  strokeWidth?: number;
  opacity?: number;
  clip?: boolean;
}

export type Layer = PathLayer | EllipseLayer;

export interface StatueScene {
  viewBox: [number, number, number, number];
  layers: Layer[];
  /** Horizontal extent of the figure, used by the lighting gradient. */
  lightSpan: [number, number];
}

export interface MaterialPalette {
  skin: [string, string, string, string];
  hair: [string, string, string, string];
  cloth: [string, string, string, string];
  line: string;
  light: string;
}

export const MATERIALS: Record<StatueMaterial, MaterialPalette> = {
  marble: {
    skin: ['#FFFDF8', '#EEE8DC', '#CFC5B4', '#9C907E'],
    hair: ['#E9E2D4', '#D6CDBB', '#B5AA97', '#83786A'],
    cloth: ['#F7F3EA', '#E2DACB', '#C2B7A4', '#8E8270'],
    line: '#5E5446',
    light: '#FFFFFF',
  },
  bronze: {
    skin: ['#F2C99A', '#C98F58', '#94603A', '#5A3820'],
    hair: ['#D9A574', '#A8713F', '#7A4D2A', '#4A2D17'],
    cloth: ['#E3B585', '#B67C49', '#85552F', '#52331B'],
    line: '#2E1A0C',
    light: '#FFE3BF',
  },
  clay: {
    skin: ['#E8C2A8', '#C99479', '#A2705A', '#6F4A3A'],
    hair: ['#D2A88F', '#B07E65', '#8A5C48', '#5C3C2E'],
    cloth: ['#DDB79D', '#BB8B71', '#956752', '#644334'],
    line: '#3F271D',
    light: '#F7DCC8',
  },
  gold: {
    skin: ['#FFF4CF', '#F2D27F', '#C99A3E', '#7E5A1C'],
    hair: ['#F7DF97', '#DDB45A', '#A87A2C', '#694915'],
    cloth: ['#FFF0C2', '#EACB78', '#BF9241', '#7A5720'],
    line: '#4A3410',
    light: '#FFFBEA',
  },
};

// ───────────────────────────────────────────────────────────── helpers ──

const CX = 100;
type Pt = [number, number];
interface Seg {
  c1: Pt;
  c2: Pt;
  p: Pt;
}

const n = (v: number) => (Math.round(v * 10) / 10).toString();
const R = ([dx, y]: Pt) => `${n(CX + dx)},${n(y)}`;
const L = ([dx, y]: Pt) => `${n(CX - dx)},${n(y)}`;
const clamp = (v: number, lo: number, hi: number) => Math.min(hi, Math.max(lo, v));

/** A path symmetric about the axis: right side described, left mirrored. */
function mirrored(start: Pt, segs: Seg[], close = true): string {
  let d = `M${R(start)}`;
  for (const s of segs) d += ` C${R(s.c1)} ${R(s.c2)} ${R(s.p)}`;
  for (let i = segs.length - 1; i >= 0; i--) {
    const s = segs[i];
    const prev = i === 0 ? start : segs[i - 1].p;
    d += ` C${L(s.c2)} ${L(s.c1)} ${L(prev)}`;
  }
  return close ? `${d} Z` : d;
}

/** A one-sided path (right side) and its mirror image. */
function sided(start: Pt, segs: Seg[], close: boolean): [string, string] {
  const build = (map: (p: Pt) => string) => {
    let d = `M${map(start)}`;
    for (const s of segs) d += ` C${map(s.c1)} ${map(s.c2)} ${map(s.p)}`;
    return close ? `${d} Z` : d;
  };
  return [build(R), build(L)];
}

/** Same as `sided` but for an already formatted relative path builder. */
function both(fn: (map: (p: Pt) => string) => string): [string, string] {
  return [fn(R), fn(L)];
}

function leaf(cx: number, cy: number, angle: number, len: number, wid: number): string {
  const ux = Math.cos(angle);
  const uy = Math.sin(angle);
  const nx = -uy;
  const ny = ux;
  const tip: Pt = [cx + (ux * len) / 2, cy + (uy * len) / 2];
  const base: Pt = [cx - (ux * len) / 2, cy - (uy * len) / 2];
  const a: Pt = [cx + nx * wid, cy + ny * wid];
  const b: Pt = [cx - nx * wid, cy - ny * wid];
  return `M${n(base[0])},${n(base[1])} Q${n(a[0])},${n(a[1])} ${n(tip[0])},${n(tip[1])} Q${n(b[0])},${n(b[1])} ${n(base[0])},${n(base[1])} Z`;
}

// ───────────────────────────────────────────────────── body geometry ──

interface Frame {
  yWaist: number;
  yHip: number;
  yCrotch: number;
  yKnee: number;
  legC: number;
  ax0: number;
  ax1: number;
  ax2: number;
}

function frameFor(p: StatueParams): Frame {
  const female = p.sex === 'female';
  const legC = clamp(p.hip - p.thigh * 0.9, p.thigh * 0.55, 34);
  const ax0 = p.shoulder - p.arm * 0.95;
  const spread = clamp((p.chest - 28) * 0.25, -1, 4);
  const ax1 = ax0 + 3.2 + spread;
  const ax2 = ax1 + 2.6 + spread * 0.4;
  return {
    yWaist: female ? 140 : 146,
    yHip: female ? 174 : 170,
    yCrotch: female ? 192 : 190,
    yKnee: 252,
    legC,
    ax0,
    ax1,
    ax2,
  };
}

function torso(p: StatueParams, f: Frame): Seg[] {
  const { neck, shoulder: S, chest: C, waist: W, hip: Hp } = p;
  const female = p.sex === 'female';
  const trapH = female ? 72 : 70;
  return [
    { c1: [neck, 54], c2: [neck + 0.4, 60], p: [neck + 1, 64] },
    { c1: [neck + 3, trapH - 1], c2: [S - (female ? 13 : 16), trapH], p: [S - 7, 75] },
    { c1: [S - 2, 77], c2: [S + 1, 84], p: [S, 93] },
    { c1: [S - 1, 100], c2: [C + 3, 101], p: [C, 105] },
    { c1: [C - 0.5, 118], c2: [W + 1, f.yWaist - 14], p: [W, f.yWaist] },
    { c1: [W - 0.5, f.yWaist + 10], c2: [Hp - 1.5, f.yHip - 10], p: [Hp, f.yHip] },
    { c1: [Hp + 0.6, f.yHip + 10], c2: [10, f.yCrotch], p: [0, f.yCrotch + 1] },
  ];
}

function legSegs(p: StatueParams, f: Frame): { start: Pt; segs: Seg[] } {
  const T = p.thigh;
  const Cf = p.calf;
  const K = clamp(T * 0.56, 7.5, 12.5);
  const A = clamp(Cf * 0.42, 3.8, 5.6);
  const c = f.legC;
  const inner = Math.max(1.4, c - T * 0.9);
  const yK = f.yKnee;
  return {
    start: [p.hip - 1, f.yHip - 4],
    segs: [
      { c1: [p.hip + 1.5, f.yHip + 10], c2: [c + T + 1.5, 196], p: [c + T, 212] },
      { c1: [c + T - 1, 228], c2: [c + K + 2, yK - 12], p: [c + K, yK] },
      { c1: [c + K - 0.5, yK + 10], c2: [c + Cf + 1, yK + 16], p: [c + Cf, yK + 30] },
      { c1: [c + Cf - 1, yK + 46], c2: [c + A + 1.5, 312], p: [c + A, 322] },
      { c1: [c + A + 0.5, 328], c2: [c + A + 4, 331], p: [c + A + 4.6, 335.6] },
      { c1: [c + A + 1, 336.2], c2: [c - A - 1, 336.2], p: [c - A - 3.6, 335.6] },
      { c1: [c - A - 3, 331], c2: [c - A - 0.5, 328], p: [c - A + 0.3, 322] },
      { c1: [c - A - 0.5, 310], c2: [c - Cf * 0.85 - 1, yK + 44], p: [c - Cf * 0.85, yK + 30] },
      { c1: [c - Cf * 0.85 + 0.5, yK + 18], c2: [c - K + 0.5, yK + 12], p: [c - K, yK] },
      { c1: [c - K - 1.5, yK - 16], c2: [c - T * 0.85, 222], p: [inner, 204] },
      { c1: [1.5, 196], c2: [1, f.yCrotch], p: [1, f.yCrotch - 6] },
    ],
  };
}

function armSegs(p: StatueParams, f: Frame): { start: Pt; segs: Seg[] } {
  const U = p.arm;
  const Fa = p.forearm;
  const { ax0, ax1, ax2 } = f;
  return {
    start: [ax0 + U * 0.92, 90],
    segs: [
      { c1: [ax0 + U * 1.0, 100], c2: [ax0 + U * 1.06 + 1.5, 110], p: [ax0 + 1.2 + U * 1.02, 118] },
      { c1: [ax0 + 2.5 + U * 0.98, 128], c2: [ax1 + U * 0.78, 136], p: [ax1 + U * 0.72, 142] },
      { c1: [ax1 + U * 0.72 + 0.3, 146], c2: [ax1 + Fa + 1, 148], p: [ax1 + 1.2 + Fa, 156] },
      { c1: [ax1 + 1.5 + Fa * 0.95, 168], c2: [ax2 + 5.2, 178], p: [ax2 + 4.6, 186] },
      { c1: [ax2 + 6.6, 190], c2: [ax2 + 7, 202], p: [ax2 + 5, 207] },
      { c1: [ax2 + 3.5, 211.5], c2: [ax2 - 3.5, 211.5], p: [ax2 - 4.6, 206] },
      { c1: [ax2 - 6, 200], c2: [ax2 - 5.5, 190], p: [ax2 - 4.2, 186] },
      { c1: [ax2 - 4.6, 176], c2: [ax1 - Fa * 0.9 - 0.5, 162], p: [ax1 - Fa * 0.85, 150] },
      { c1: [ax1 - Fa * 0.8, 146], c2: [ax1 - U * 0.66, 144], p: [ax1 - U * 0.66, 140] },
      { c1: [ax1 - U * 0.7 - 0.5, 128], c2: [ax0 - U * 0.95 + 0.5, 112], p: [ax0 - U * 0.85, 100] },
      { c1: [ax0 - U * 0.8, 97], c2: [ax0 - U * 0.75, 95], p: [ax0 - U * 0.7, 94] },
    ],
  };
}

function segsToOpen(start: Pt, segs: Seg[], map: (p: Pt) => string): string {
  let d = `M${map(start)}`;
  for (const s of segs) d += ` C${map(s.c1)} ${map(s.c2)} ${map(s.p)}`;
  return d;
}

// ──────────────────────────────────────────────────────── the builder ──

export function buildStatue(
  p: StatueParams,
  style: StatueStyle,
  opts: { pedestal?: boolean; crop?: 'full' | 'bust' } = {},
): StatueScene {
  const layers: Layer[] = [];
  const f = frameFor(p);
  const female = p.sex === 'female';
  const defA = 0.1 + 0.5 * clamp(p.definition, 0, 1);
  const lineW = 0.7;

  const push = (l: Layer) => layers.push(l);
  const body = (d: string, outline?: string) => {
    push({ kind: 'path', d, fill: 'skin', clip: true });
    push({ kind: 'path', d: outline ?? d, fill: 'none', stroke: 'line', strokeWidth: lineW, opacity: 0.55 });
  };
  const detail = (d: string, a = defA, w = 0.8) => {
    push({ kind: 'path', d, fill: 'none', stroke: 'line', strokeWidth: w, opacity: a });
  };
  const highlight = (d: string, a = defA * 0.9, w = 0.7) => {
    push({ kind: 'path', d, fill: 'none', stroke: 'light', strokeWidth: w, opacity: a });
  };

  // ── wings (behind everything) ─────────────────────────────────────
  if (style.wings) {
    const [wr, wl] = sided(
      [10, 96],
      [
        { c1: [18, 60], c2: [40, 6], p: [70, -6] },
        { c1: [78, -8], c2: [90, 4], p: [92, 22] },
        { c1: [90, 50], c2: [80, 90], p: [66, 130] },
        { c1: [60, 150], c2: [48, 170], p: [36, 180] },
        { c1: [30, 160], c2: [20, 130], p: [14, 118] },
      ],
      true,
    );
    for (const w of [wr, wl]) {
      push({ kind: 'path', d: w, fill: 'cloth' });
      push({ kind: 'path', d: w, fill: 'none', stroke: 'line', strokeWidth: lineW, opacity: 0.5 });
    }
    const feathers = both(
      (m) =>
        [
          `M${m([20, 92])} C${m([40, 60])} ${m([60, 20])} ${m([76, 4])}`,
          `M${m([24, 110])} C${m([50, 80])} ${m([72, 44])} ${m([88, 26])}`,
          `M${m([28, 126])} C${m([52, 104])} ${m([72, 80])} ${m([84, 62])}`,
          `M${m([32, 142])} C${m([50, 128])} ${m([64, 112])} ${m([76, 98])}`,
          `M${m([34, 160])} C${m([46, 150])} ${m([56, 140])} ${m([66, 130])}`,
        ].join(' '),
    );
    feathers.forEach((d) => detail(d, 0.35, 0.7));
  }

  // ── long hair falling behind the shoulders ───────────────────────
  if (style.longHair || female) {
    const d = mirrored(
      [0, 14],
      [
        { c1: [12, 14], c2: [17, 26], p: [17, 42] },
        { c1: [17.5, 54], c2: [18, 64], p: [15, 74] },
        { c1: [10, 77], c2: [4, 76], p: [0, 74] },
      ],
    );
    push({ kind: 'path', d, fill: 'hair' });
    push({ kind: 'path', d, fill: 'none', stroke: 'line', strokeWidth: lineW, opacity: 0.4 });
  }

  // ── attributes held behind the hands ─────────────────────────────
  const handR: Pt = [f.ax2, 198];
  const handL: Pt = [-f.ax2, 198];
  const gold = (d: string, stroke = true) => {
    push({ kind: 'path', d, fill: 'gold' });
    if (stroke) push({ kind: 'path', d, fill: 'none', stroke: 'line', strokeWidth: 0.6, opacity: 0.6 });
  };
  const staff = (x: number, top: number, bottom: number, w = 1.6) => {
    const d = `M${n(CX + x - w)},${n(top)} L${n(CX + x + w)},${n(top)} L${n(CX + x + w)},${n(bottom)} L${n(CX + x - w)},${n(bottom)} Z`;
    gold(d);
  };

  switch (style.attribute) {
    case 'trident': {
      const x = handR[0] + 0.5;
      staff(x, 4, 336);
      const prongs =
        `M${n(CX + x - 12)},${n(-4)} L${n(CX + x - 10)},${n(-8)} L${n(CX + x - 8.5)},${n(-3)} ` +
        `C${n(CX + x - 8.5)},10 ${n(CX + x - 4)},14 ${n(CX + x - 1.4)},14 L${n(CX + x - 1.4)},${n(-10)} ` +
        `L${n(CX + x)},${n(-16)} L${n(CX + x + 1.4)},${n(-10)} L${n(CX + x + 1.4)},14 ` +
        `C${n(CX + x + 4)},14 ${n(CX + x + 8.5)},10 ${n(CX + x + 8.5)},${n(-3)} L${n(CX + x + 10)},${n(-8)} ` +
        `L${n(CX + x + 12)},${n(-4)} C${n(CX + x + 12)},12 ${n(CX + x + 6)},18 ${n(CX + x + 1.6)},19 ` +
        `L${n(CX + x - 1.6)},19 C${n(CX + x - 6)},18 ${n(CX + x - 12)},12 ${n(CX + x - 12)},${n(-4)} Z`;
      gold(prongs);
      break;
    }
    case 'spearShield': {
      const x = handR[0] + 0.5;
      staff(x, 10, 336, 1.3);
      gold(
        `M${n(CX + x)},${n(-10)} C${n(CX + x + 4.5)},0 ${n(CX + x + 4)},8 ${n(CX + x)},14 C${n(CX + x - 4)},8 ${n(CX + x - 4.5)},0 ${n(CX + x)},${n(-10)} Z`,
      );
      break;
    }
    case 'javelin': {
      const x = handR[0] + 0.5;
      staff(x, 20, 336, 1);
      gold(
        `M${n(CX + x)},${n(4)} C${n(CX + x + 3)},12 ${n(CX + x + 2.6)},18 ${n(CX + x)},22 C${n(CX + x - 2.6)},18 ${n(CX + x - 3)},12 ${n(CX + x)},${n(4)} Z`,
      );
      break;
    }
    case 'scepter': {
      const x = handR[0] + 0.5;
      staff(x, 40, 336, 1.3);
      push({ kind: 'ellipse', cx: CX + x, cy: 34, rx: 5, ry: 5, fill: 'gold' });
      gold(
        `M${n(CX + x - 7)},${n(30)} C${n(CX + x - 6)},20 ${n(CX + x - 2)},18 ${n(CX + x)},14 C${n(CX + x + 2)},18 ${n(CX + x + 6)},20 ${n(CX + x + 7)},30 C${n(CX + x + 3)},27 ${n(CX + x - 3)},27 ${n(CX + x - 7)},30 Z`,
      );
      break;
    }
    case 'club': {
      const x = handR[0];
      const d =
        `M${n(CX + x - 2.5)},194 C${n(CX + x - 3)},240 ${n(CX + x - 5)},300 ${n(CX + x - 4)},334 ` +
        `C${n(CX + x)},338 ${n(CX + x + 10)},338 ${n(CX + x + 13)},333 ` +
        `C${n(CX + x + 12)},300 ${n(CX + x + 6)},240 ${n(CX + x + 3)},194 Z`;
      push({ kind: 'path', d, fill: 'hair' });
      push({ kind: 'path', d, fill: 'none', stroke: 'line', strokeWidth: 0.7, opacity: 0.6 });
      const knots = [
        [x - 1.5, 232],
        [x + 6, 262],
        [x - 2.4, 288],
        [x + 9, 304],
        [x + 2, 318],
      ];
      knots.forEach(([kx, ky]) =>
        push({ kind: 'ellipse', cx: CX + kx, cy: ky, rx: 2.2, ry: 1.6, fill: 'none', stroke: 'line', strokeWidth: 0.6, opacity: 0.5 }),
      );
      break;
    }
    case 'caduceus': {
      const x = handL[0] - 0.5;
      staff(x, 136, 262, 1.1);
      const wing = (s: number) =>
        `M${n(CX + x)},${n(140)} C${n(CX + x + s * 6)},${n(130)} ${n(CX + x + s * 12)},${n(128)} ${n(CX + x + s * 14)},${n(124)} ` +
        `C${n(CX + x + s * 12)},${n(134)} ${n(CX + x + s * 8)},${n(140)} ${n(CX + x)},${n(144)} Z`;
      gold(wing(1));
      gold(wing(-1));
      push({ kind: 'ellipse', cx: CX + x, cy: 136, rx: 2.6, ry: 2.6, fill: 'gold' });
      let s1 = `M${n(CX + x)},${n(150)}`;
      let s2 = `M${n(CX + x)},${n(150)}`;
      for (let i = 0; i < 4; i++) {
        const y0 = 150 + i * 24;
        s1 += ` C${n(CX + x + 7)},${n(y0 + 4)} ${n(CX + x + 7)},${n(y0 + 8)} ${n(CX + x)},${n(y0 + 12)} C${n(CX + x - 7)},${n(y0 + 16)} ${n(CX + x - 7)},${n(y0 + 20)} ${n(CX + x)},${n(y0 + 24)}`;
        s2 += ` C${n(CX + x - 7)},${n(y0 + 4)} ${n(CX + x - 7)},${n(y0 + 8)} ${n(CX + x)},${n(y0 + 12)} C${n(CX + x + 7)},${n(y0 + 16)} ${n(CX + x + 7)},${n(y0 + 20)} ${n(CX + x)},${n(y0 + 24)}`;
      }
      push({ kind: 'path', d: s1, fill: 'none', stroke: 'gold', strokeWidth: 1.6 });
      push({ kind: 'path', d: s2, fill: 'none', stroke: 'gold', strokeWidth: 1.6 });
      break;
    }
    case 'bow': {
      const x = handL[0] - 1;
      const bow = `M${n(CX + x + 1)},${n(132)} C${n(CX + x - 30)},${n(170)} ${n(CX + x - 30)},${n(226)} ${n(CX + x + 1)},${n(264)}`;
      push({ kind: 'path', d: bow, fill: 'none', stroke: 'gold', strokeWidth: 2.6 });
      push({ kind: 'path', d: `M${n(CX + x + 1)},132 L${n(CX + x + 1)},264`, fill: 'none', stroke: 'line', strokeWidth: 0.5, opacity: 0.6 });
      break;
    }
    case 'lyre': {
      const x = CX + handL[0] - 2;
      const y = 214;
      const frame =
        `M${n(x - 9)},${n(y)} C${n(x - 13)},${n(y - 10)} ${n(x - 6)},${n(y - 18)} ${n(x - 12)},${n(y - 30)} ` +
        `L${n(x - 9.5)},${n(y - 31)} C${n(x - 3)},${n(y - 20)} ${n(x - 9)},${n(y - 10)} ${n(x - 6)},${n(y)} Z ` +
        `M${n(x + 9)},${n(y)} C${n(x + 13)},${n(y - 10)} ${n(x + 6)},${n(y - 18)} ${n(x + 12)},${n(y - 30)} ` +
        `L${n(x + 9.5)},${n(y - 31)} C${n(x + 3)},${n(y - 20)} ${n(x + 9)},${n(y - 10)} ${n(x + 6)},${n(y)} Z ` +
        `M${n(x - 12)},${n(y - 27)} L${n(x + 12)},${n(y - 27)} L${n(x + 12)},${n(y - 25)} L${n(x - 12)},${n(y - 25)} Z`;
      gold(frame);
      push({ kind: 'ellipse', cx: x, cy: y + 2, rx: 11, ry: 6.5, fill: 'gold' });
      push({ kind: 'ellipse', cx: x, cy: y + 2, rx: 11, ry: 6.5, fill: 'none', stroke: 'line', strokeWidth: 0.6, opacity: 0.6 });
      let strings = '';
      for (let i = -3; i <= 3; i += 1.5) strings += `M${n(x + i)},${n(y - 25)} L${n(x + i * 1.2)},${n(y + 1)} `;
      push({ kind: 'path', d: strings, fill: 'none', stroke: 'line', strokeWidth: 0.35, opacity: 0.7 });
      break;
    }
    default:
      break;
  }

  // ── legs ─────────────────────────────────────────────────────────
  const leg = legSegs(p, f);
  const [legRFill, legLFill] = sided(leg.start, leg.segs, true);
  const legOutline = both((m) => segsToOpen(leg.start, leg.segs, m));
  body(legRFill, legOutline[0]);
  body(legLFill, legOutline[1]);
  // knees, quads, calves
  const c = f.legC;
  const T = p.thigh;
  const kneeDetail = both(
    (m) =>
      `M${m([c - 5, f.yKnee - 4])} C${m([c - 3, f.yKnee + 2])} ${m([c + 3, f.yKnee + 2])} ${m([c + 5, f.yKnee - 4])} ` +
      `M${m([c - 6, f.yKnee + 8])} C${m([c - 2, f.yKnee + 11])} ${m([c + 2, f.yKnee + 11])} ${m([c + 6, f.yKnee + 8])}`,
  );
  kneeDetail.forEach((d) => detail(d, defA * 0.9, 0.7));
  if (!female) {
    const quads = both(
      (m) =>
        `M${m([c + 1, 206])} C${m([c + 2, 222])} ${m([c + 1, 236])} ${m([c - 2, f.yKnee - 8])} ` +
        `M${m([c - T * 0.55, 226])} C${m([c - T * 0.7, 236])} ${m([c - T * 0.5, f.yKnee - 6])} ${m([c - 4, f.yKnee - 6])} ` +
        `M${m([c + T * 0.75, 214])} C${m([c + T * 0.65, 230])} ${m([c + T * 0.45, 242])} ${m([c + 5, f.yKnee - 5])}`,
    );
    quads.forEach((d) => detail(d));
  }
  const calves = both(
    (m) =>
      `M${m([c - p.calf * 0.7, f.yKnee + 18])} C${m([c - p.calf * 0.6, f.yKnee + 34])} ${m([c - 2, f.yKnee + 44])} ${m([c - 1, f.yKnee + 54])}`,
  );
  calves.forEach((d) => detail(d, defA * 0.9));

  // ── torso ────────────────────────────────────────────────────────
  const tSegs = torso(p, f);
  const torsoStart: Pt = [p.neck - 0.5, 48];
  const torsoFill = mirrored(torsoStart, tSegs);
  push({ kind: 'path', d: torsoFill, fill: 'skin', clip: true });
  push({ kind: 'path', d: mirrored(torsoStart, tSegs, false), fill: 'none', stroke: 'line', strokeWidth: lineW, opacity: 0.55 });

  const S = p.shoulder;
  const C = p.chest;
  const W = p.waist;
  const Hp = p.hip;

  if (!female) {
    // clavicles
    detail(
      both((m) => `M${m([p.neck + 0.5, 67])} C${m([p.neck + 6, 71])} ${m([S * 0.6, 70])} ${m([S - 8, 75])}`).join(' '),
      0.25 + defA * 0.3,
      0.8,
    );
    // sternum & pectorals
    const pecLow = 108 + (1 - p.definition) * 3;
    const pecs = both(
      (m) =>
        `M${m([1.2, 80])} L${m([1.2, pecLow])} ` +
        `M${m([1.5, pecLow + 1])} C${m([8, pecLow + 6])} ${m([C - 5, pecLow + 4])} ${m([C - 1.5, 99])}`,
    );
    pecs.forEach((d) => detail(d, 0.2 + defA * 0.7, 1));
    const pecShadow = both(
      (m) =>
        `M${m([2, pecLow + 1])} C${m([8, pecLow + 6])} ${m([C - 5, pecLow + 4])} ${m([C - 1.5, 99])} ` +
        `C${m([C - 4, pecLow + 8])} ${m([10, pecLow + 10])} ${m([2, pecLow + 4])} Z`,
    );
    pecShadow.forEach((d) => push({ kind: 'path', d, fill: 'shadow', opacity: 0.08 + defA * 0.25 }));
    highlight(both((m) => `M${m([4, 86])} C${m([10, 82])} ${m([C - 8, 84])} ${m([C - 4, 92])}`)[1], defA * 0.6);
    // deltoid separation
    detail(both((m) => `M${m([S - 9, 78])} C${m([S - 12, 86])} ${m([S - 11, 94])} ${m([S - 7, 100])}`).join(' '), defA * 0.8);
    // abdominals
    const absW = W * 0.52;
    let abs = `M${n(CX)},${n(pecLow + 4)} L${n(CX)},${n(f.yWaist + 12)} `;
    [pecLow + 13, pecLow + 25, f.yWaist - 2].forEach((y, i) => {
      const w = absW - i * 0.8;
      abs += `M${n(CX - w)},${n(y + 1)} C${n(CX - w * 0.5)},${n(y - 1.5)} ${n(CX - 1)},${n(y)} ${n(CX)},${n(y + 0.5)} C${n(CX + 1)},${n(y)} ${n(CX + w * 0.5)},${n(y - 1.5)} ${n(CX + w)},${n(y + 1)} `;
    });
    detail(abs, defA * 0.95, 0.8);
    const semilunar = both(
      (m) => `M${m([absW + 1, pecLow + 6])} C${m([absW + 2, pecLow + 22])} ${m([absW, f.yWaist])} ${m([absW * 0.7, f.yWaist + 16])}`,
    );
    semilunar.forEach((d) => detail(d, defA * 0.9));
    // serratus
    const serr = both(
      (m) =>
        `M${m([C - 3, 108])} l-3,2 M${m([C - 3.5, 114])} l-3,2 M${m([C - 4, 120])} l-3,2`,
    );
    serr.forEach((d) => detail(d, defA * 0.7, 0.7));
    // iliac furrow — the "Apollo's belt"
    const belt = both((m) => `M${m([Hp - 3, f.yHip - 12])} C${m([Hp - 5, f.yHip - 2])} ${m([10, f.yHip + 8])} ${m([5, f.yHip + 14])}`);
    belt.forEach((d) => detail(d, 0.15 + defA * 0.8, 1));
    // navel
    push({ kind: 'ellipse', cx: CX, cy: f.yWaist - 4, rx: 1.1, ry: 1.6, fill: 'shadow', opacity: 0.35 });
  }

  // ── drapery ──────────────────────────────────────────────────────
  if (female) {
    const dressSegs: Seg[] = [
      { c1: [5, 75], c2: [p.neck + 3, 71], p: [p.neck + 4, 66] },
      { c1: [p.neck + 9, 69], c2: [S - 6, 71], p: [S - 1, 80] },
      { c1: [S + 1.5, 83], c2: [S + 2, 90], p: [S + 1.5, 97] },
      { c1: [S, 101], c2: [C + 3, 103], p: [C + 1, 105] },
      { c1: [C + 1.5, 118], c2: [W + 2.5, 128], p: [W + 1.8, 138] },
      { c1: [W + 1.5, 150], c2: [Hp + 2, 158], p: [Hp + 3, 174] },
      { c1: [Hp + 4.5, 196], c2: [Hp + 7, 222], p: [Hp + 7.5, 242] },
      { c1: [Hp * 0.6, 248], c2: [Hp * 0.3, 238], p: [0, 244] },
    ];
    const dress = mirrored([0, 75], dressSegs);
    push({ kind: 'path', d: dress, fill: 'cloth', clip: true });
    push({ kind: 'path', d: dress, fill: 'none', stroke: 'line', strokeWidth: lineW, opacity: 0.5 });
    // bust and folds
    const bust = both((m) => `M${m([2, 104])} C${m([6, 109])} ${m([C - 6, 109])} ${m([C - 3, 98])}`);
    bust.forEach((d) => detail(d, 0.35, 0.9));
    const folds = both(
      (m) =>
        `M${m([p.neck + 5, 70])} C${m([10, 90])} ${m([6, 112])} ${m([4, 134])} ` +
        `M${m([S - 6, 76])} C${m([C - 2, 96])} ${m([W, 118])} ${m([W - 3, 134])} ` +
        `M${m([3, 146])} C${m([4, 180])} ${m([3, 210])} ${m([4, 240])} ` +
        `M${m([W * 0.6, 146])} C${m([Hp * 0.6, 182])} ${m([Hp * 0.7, 214])} ${m([Hp * 0.75, 242])} ` +
        `M${m([W + 1, 150])} C${m([Hp + 1, 190])} ${m([Hp + 3.5, 220])} ${m([Hp + 4, 240])}`,
    );
    folds.forEach((d) => detail(d, 0.4, 0.8));
    folds.forEach((d) => push({ kind: 'path', d, fill: 'none', stroke: 'light', strokeWidth: 0.6, opacity: 0.35 }));
    // belt
    const beltD = mirrored([0, 135.5], [
      { c1: [W * 0.5, 135.5], c2: [W + 1, 135], p: [W + 2.4, 135.2] },
      { c1: [W + 2.6, 137], c2: [W + 2.6, 139.5], p: [W + 2.2, 141.5] },
      { c1: [W + 1, 141.8], c2: [W * 0.5, 142], p: [0, 142] },
    ]);
    gold(beltD);
  } else {
    // a himation wrapped around the hips
    const top1: Pt = [Hp + 2.5, 162];
    const drape =
      `M${R(top1)} C${R([Hp * 0.5, 167])} ${L([Hp * 0.5, 164])} ${L([Hp + 2.5, 158])} ` +
      `C${L([Hp + 4.5, 172])} ${L([Hp + 5, 192])} ${L([Hp + 4, 214])} ` +
      `C${L([Hp * 0.4, 220])} ${R([Hp * 0.2, 212])} ${R([Hp * 0.7, 203])} ` +
      `C${R([Hp + 1.5, 200])} ${R([Hp + 3.8, 198])} ${R([Hp + 3.6, 190])} ` +
      `C${R([Hp + 4.2, 180])} ${R([Hp + 3.5, 168])} ${R(top1)} Z`;
    push({ kind: 'path', d: drape, fill: 'cloth', clip: true });
    push({ kind: 'path', d: drape, fill: 'none', stroke: 'line', strokeWidth: lineW, opacity: 0.55 });
    const folds =
      `M${R([Hp, 168])} C${R([Hp * 0.4, 176])} ${L([Hp * 0.3, 180])} ${L([Hp + 2, 184])} ` +
      `M${R([Hp + 1, 178])} C${R([Hp * 0.4, 190])} ${L([Hp * 0.2, 194])} ${L([Hp + 2.5, 200])} ` +
      `M${R([Hp + 1, 188])} C${R([Hp * 0.5, 198])} ${L([Hp * 0.1, 204])} ${L([Hp * 0.8, 212])} ` +
      `M${R([Hp - 4, 165])} C${R([Hp * 0.5, 172])} ${L([Hp * 0.2, 172])} ${L([Hp - 3, 168])}`;
    detail(folds, 0.45, 0.9);
    push({ kind: 'path', d: folds, fill: 'none', stroke: 'light', strokeWidth: 0.6, opacity: 0.45 });
    // knot on the right hip
    push({ kind: 'ellipse', cx: CX + Hp + 1.5, cy: 166, rx: 3.6, ry: 3, fill: 'cloth' });
    push({ kind: 'ellipse', cx: CX + Hp + 1.5, cy: 166, rx: 3.6, ry: 3, fill: 'none', stroke: 'line', strokeWidth: 0.6, opacity: 0.5 });
  }

  // ── Heracles' lion skin over the shoulders ───────────────────────
  if (style.headGear === 'lionHood') {
    // the forelegs of the Nemean lion, knotted on the chest
    const pelt = both(
      (m) =>
        `M${m([p.neck + 1, 52])} C${m([p.neck + 7, 62])} ${m([12, 76])} ${m([3, 86])} ` +
        `L${m([1, 82])} C${m([8, 74])} ${m([p.neck + 2, 64])} ${m([p.neck - 2, 54])} Z`,
    );
    pelt.forEach((d) => {
      push({ kind: 'path', d, fill: 'hair' });
      push({ kind: 'path', d, fill: 'none', stroke: 'line', strokeWidth: 0.6, opacity: 0.5 });
    });
    const paw = both(
      (m) =>
        `M${m([1.5, 88])} C${m([4.5, 94])} ${m([5, 100])} ${m([3.8, 106])} C${m([3, 108.5])} ${m([1, 108.5])} ${m([0.6, 105])} C${m([0.4, 99])} ${m([0.6, 93])} ${m([1.5, 88])} Z`,
    );
    paw.forEach((d) => {
      push({ kind: 'path', d, fill: 'hair' });
      push({ kind: 'path', d, fill: 'none', stroke: 'line', strokeWidth: 0.6, opacity: 0.55 });
    });
    push({ kind: 'ellipse', cx: CX, cy: 87, rx: 4, ry: 3, fill: 'hair' });
    push({ kind: 'ellipse', cx: CX, cy: 87, rx: 4, ry: 3, fill: 'none', stroke: 'line', strokeWidth: 0.6, opacity: 0.5 });
  }

  // Artemis' quiver strap
  if (style.attribute === 'bow') {
    gold(`M${R([p.neck + 6, 70])} L${R([p.neck + 9, 72])} L${L([W + 1, 136])} L${L([W - 2, 134])} Z`);
  }
  // Ares' and Athena's shield
  if (style.attribute === 'spearShield') {
    const sx = CX - (f.ax2 + 13);
    const sy = 232;
    push({ kind: 'ellipse', cx: sx, cy: sy, rx: 27, ry: 27, fill: 'gold' });
    push({ kind: 'ellipse', cx: sx, cy: sy, rx: 27, ry: 27, fill: 'none', stroke: 'line', strokeWidth: 0.7, opacity: 0.6 });
    push({ kind: 'ellipse', cx: sx, cy: sy, rx: 22, ry: 22, fill: 'cloth' });
    push({ kind: 'ellipse', cx: sx, cy: sy, rx: 22, ry: 22, fill: 'none', stroke: 'line', strokeWidth: 0.6, opacity: 0.5 });
    // a laurel-like rosette motif
    for (let i = 0; i < 10; i++) {
      const a = (i / 10) * Math.PI * 2;
      push({ kind: 'path', d: leaf(sx + Math.cos(a) * 11, sy + Math.sin(a) * 11, a, 9, 2.2), fill: 'gold', opacity: 0.9 });
    }
    push({ kind: 'ellipse', cx: sx, cy: sy, rx: 4.5, ry: 4.5, fill: 'gold' });
  }

  // ── arms ─────────────────────────────────────────────────────────
  const arm = armSegs(p, f);
  const [armRFill, armLFill] = sided(arm.start, arm.segs, true);
  const armOutline = both((m) => segsToOpen(arm.start, arm.segs, m));
  body(armRFill, armOutline[0]);
  body(armLFill, armOutline[1]);
  const U = p.arm;
  const armDetail = both(
    (m) =>
      `M${m([f.ax0 - U * 0.2, 104])} C${m([f.ax0 + U * 0.25, 116])} ${m([f.ax0 + U * 0.35, 128])} ${m([f.ax1 + 0.5, 140])} ` +
      `M${m([f.ax1 - U * 0.3, 147])} C${m([f.ax1 + 1, 156])} ${m([f.ax1 + 2, 166])} ${m([f.ax2 + 1, 180])}`,
  );
  armDetail.forEach((d) => detail(d, defA * (female ? 0.4 : 0.85)));
  const fingers = both(
    (m) => `M${m([f.ax2 - 3.8, 200])} L${m([f.ax2 + 2.5, 200])} M${m([f.ax2 - 3.5, 204])} L${m([f.ax2 + 3, 204])}`,
  );
  fingers.forEach((d) => detail(d, 0.35, 0.6));

  // things held in front of the hand
  if (style.attribute === 'thunderbolt') {
    const x = CX + handR[0];
    const bolt =
      `M${n(x)},${n(146)} L${n(x + 3.4)},${n(160)} L${n(x + 1.2)},${n(161)} L${n(x + 6.5)},${n(180)} L${n(x + 2.4)},${n(181)} ` +
      `L${n(x + 8)},${n(200)} L${n(x + 2)},${n(199)} L${n(x + 5)},${n(220)} L${n(x + 1)},${n(219)} L${n(x)},${n(246)} ` +
      `L${n(x - 3.4)},${n(232)} L${n(x - 1.2)},${n(231)} L${n(x - 6.5)},${n(212)} L${n(x - 2.4)},${n(211)} ` +
      `L${n(x - 8)},${n(192)} L${n(x - 2)},${n(193)} L${n(x - 5)},${n(172)} L${n(x - 1)},${n(173)} Z`;
    gold(bolt);
  }
  if (style.attribute === 'apple') {
    const x = CX + handR[0] + 1;
    push({ kind: 'ellipse', cx: x, cy: 214, rx: 5.2, ry: 4.8, fill: 'gold' });
    push({ kind: 'ellipse', cx: x, cy: 214, rx: 5.2, ry: 4.8, fill: 'none', stroke: 'line', strokeWidth: 0.6, opacity: 0.6 });
    push({ kind: 'path', d: leaf(x + 2, 208, -0.6, 4, 1.4), fill: 'gold' });
  }
  if (style.attribute === 'wreath') {
    const x = CX + handR[0] + 1;
    const y = 222;
    for (let i = 0; i < 14; i++) {
      const a = (i / 14) * Math.PI * 2;
      push({ kind: 'path', d: leaf(x + Math.cos(a) * 8, y + Math.sin(a) * 8, a + Math.PI / 2, 5, 1.6), fill: 'gold' });
    }
  }

  // ── head ─────────────────────────────────────────────────────────
  buildHead(p, style, push, defA);

  // ── pedestal ─────────────────────────────────────────────────────
  if (opts.pedestal !== false) {
    const top = 337;
    push({ kind: 'path', d: `M44,${top} L156,${top} L152,${top + 6} L48,${top + 6} Z`, fill: 'plinth' });
    push({ kind: 'path', d: `M52,${top + 6} L148,${top + 6} L148,${top + 24} L52,${top + 24} Z`, fill: 'plinth' });
    push({ kind: 'path', d: `M46,${top + 24} L154,${top + 24} L156,${top + 30} L44,${top + 30} Z`, fill: 'plinth' });
    push({ kind: 'path', d: `M44,${top} L156,${top} M52,${top + 9} L148,${top + 9} M52,${top + 21} L148,${top + 21} M44,${top + 30} L156,${top + 30}`, fill: 'none', stroke: 'plinthTrim', strokeWidth: 0.7, opacity: 0.9 });
  }

  const wingSpan = style.wings ? 96 : 0;
  const reach = Math.max(
    p.shoulder + 4,
    f.ax2 + 10,
    style.attribute === 'spearShield' ? f.ax2 + 42 : 0,
    style.attribute === 'bow' ? f.ax2 + 26 : 0,
    style.attribute === 'trident' ? f.ax2 + 14 : 0,
    wingSpan,
    58,
  );

  if (opts.crop === 'bust') {
    const half = Math.max(p.shoulder + 10, 40);
    return {
      viewBox: [CX - half, style.headGear === 'helmet' ? -10 : 2, half * 2, half * 2 * 1.05],
      layers,
      lightSpan: [CX - reach, CX + reach],
    };
  }

  const top = style.headGear === 'helmet' || style.attribute === 'trident' || style.wings ? -18 : 0;
  const bottom = opts.pedestal === false ? 340 : 370;
  return {
    viewBox: [0, top, 200, bottom - top],
    layers,
    lightSpan: [CX - reach, CX + reach],
  };
}

// ─────────────────────────────────────────────────────────────── head ──

function buildHead(p: StatueParams, style: StatueStyle, push: (l: Layer) => void, defA: number) {
  const female = p.sex === 'female';
  const g = style.headGear;
  const line = (d: string, a: number, w = 0.7) => push({ kind: 'path', d, fill: 'none', stroke: 'line', strokeWidth: w, opacity: a });
  const goldFill = (d: string) => {
    push({ kind: 'path', d, fill: 'gold' });
    push({ kind: 'path', d, fill: 'none', stroke: 'line', strokeWidth: 0.5, opacity: 0.55 });
  };

  if (female && g !== 'helmet') {
    // chignon on top
    push({ kind: 'ellipse', cx: CX, cy: 13, rx: 7.5, ry: 5.5, fill: 'hair' });
    push({ kind: 'ellipse', cx: CX, cy: 13, rx: 7.5, ry: 5.5, fill: 'none', stroke: 'line', strokeWidth: 0.6, opacity: 0.45 });
    line(`M${n(CX - 5)},12 C${n(CX - 2)},9 ${n(CX + 2)},9 ${n(CX + 5)},12 M${n(CX - 4)},15.5 C${n(CX - 1)},13 ${n(CX + 1)},13 ${n(CX + 4)},15.5`, 0.35, 0.6);
  }

  // ears
  if (!female) {
    [-1, 1].forEach((s) => {
      push({ kind: 'ellipse', cx: CX + s * 13.8, cy: 41, rx: 2.3, ry: 5, fill: 'skin' });
      push({ kind: 'ellipse', cx: CX + s * 13.8, cy: 41, rx: 2.3, ry: 5, fill: 'none', stroke: 'line', strokeWidth: 0.5, opacity: 0.5 });
    });
  }

  // face shape
  const jaw = female ? 11.5 : 12.2;
  const chin = female ? 56.5 : 57.6;
  const head = mirrored([0, 16], [
    { c1: [8, 16], c2: [13.6, 22], p: [13.8, 32] },
    { c1: [14, 38], c2: [13.4, 44], p: [jaw, 48] },
    { c1: [jaw - 1.5, 52.5], c2: [6.5, chin - 1], p: [3, chin] },
    { c1: [1.5, chin + 0.4], c2: [0.6, chin + 0.4], p: [0, chin + 0.4] },
  ]);
  push({ kind: 'path', d: head, fill: 'skin', clip: true });
  push({ kind: 'path', d: head, fill: 'none', stroke: 'line', strokeWidth: 0.7, opacity: 0.5 });

  // shading on the shadow side of the face
  push({
    kind: 'path',
    d: `M${n(CX + 8)},33 C${n(CX + 12)},38 ${n(CX + 12)},46 ${n(CX + jaw - 1)},49 C${n(CX + 8)},54 ${n(CX + 5)},57 ${n(CX + 2)},${n(chin)} C${n(CX + 6)},52 ${n(CX + 9)},44 ${n(CX + 8)},33 Z`,
    fill: 'shadow',
    opacity: 0.16,
  });

  // features
  const brow = both((m) => `M${m([10, 34.6])} C${m([7.5, 32.6])} ${m([4, 32.6])} ${m([1.8, 34.2])}`);
  brow.forEach((d) => line(d, 0.55, 0.8));
  const eyes = both(
    (m) =>
      `M${m([8.8, 39.2])} C${m([7.2, 37.6])} ${m([4.6, 37.6])} ${m([3, 39.2])} C${m([4.6, 40.4])} ${m([7.2, 40.4])} ${m([8.8, 39.2])} Z`,
  );
  eyes.forEach((d) => push({ kind: 'path', d, fill: 'shadow', opacity: 0.22 }));
  eyes.forEach((d) => line(d, 0.45, 0.5));
  line(`M${n(CX + 1.1)},35.5 C${n(CX + 1.4)},40 ${n(CX + 2.6)},44 ${n(CX + 2.5)},46.6`, 0.5, 0.7);
  push({ kind: 'path', d: `M${n(CX + 1.1)},36 C${n(CX + 1.6)},41 ${n(CX + 3)},44.5 ${n(CX + 2.6)},47 L${n(CX + 1)},47.6 Z`, fill: 'shadow', opacity: 0.18 });
  line(`M${n(CX - 2.6)},47.2 C${n(CX - 1)},48.6 ${n(CX + 1)},48.6 ${n(CX + 2.6)},47.2`, 0.5, 0.6);

  if (style.beard) {
    const beard = mirrored([0, 47.4], [
      { c1: [2, 46.6], c2: [4.5, 46.4], p: [6.4, 48.2] },
      { c1: [9, 49], c2: [12.8, 44], p: [13.8, 37] },
      { c1: [15, 44], c2: [15.2, 53], p: [13, 59] },
      { c1: [11.5, 65], c2: [9.5, 70], p: [6, 72] },
      { c1: [3.5, 73.6], c2: [1.5, 74], p: [0, 74] },
    ]);
    push({ kind: 'path', d: beard, fill: 'hair' });
    push({ kind: 'path', d: beard, fill: 'none', stroke: 'line', strokeWidth: 0.6, opacity: 0.5 });
    push({ kind: 'ellipse', cx: CX, cy: 52.4, rx: 3.6, ry: 1.9, fill: 'skin' });
    line(`M${n(CX - 3.4)},52 C${n(CX - 1)},53.2 ${n(CX + 1)},53.2 ${n(CX + 3.4)},52`, 0.55, 0.6);
    let curls = '';
    [[0, 58], [-5, 57], [5, 57], [-9.5, 54], [9.5, 54], [-2.5, 63], [2.5, 63], [-7, 62], [7, 62], [0, 68], [-4.5, 68], [4.5, 68]].forEach(([x, y]) => {
      curls += `M${n(CX + x - 1.8)},${n(y)} C${n(CX + x - 1.8)},${n(y - 2.2)} ${n(CX + x + 1.8)},${n(y - 2.2)} ${n(CX + x + 1.8)},${n(y)} C${n(CX + x + 1.8)},${n(y + 1.6)} ${n(CX + x - 0.4)},${n(y + 1.8)} ${n(CX + x - 0.4)},${n(y + 0.2)} `;
    });
    line(curls, 0.45, 0.6);
    // moustache
    const stache = both((m) => `M${m([0.5, 48.6])} C${m([3, 47.6])} ${m([5.5, 48.6])} ${m([7.5, 51.6])}`);
    stache.forEach((d) => line(d, 0.55, 0.9));
  } else {
    line(`M${n(CX - 4.2)},51.3 C${n(CX - 1.5)},50.3 ${n(CX - 0.5)},50.9 ${n(CX)},51 C${n(CX + 0.5)},50.9 ${n(CX + 1.5)},50.3 ${n(CX + 4.2)},51.3`, 0.4, 0.6);
    line(`M${n(CX - 4)},51.7 C${n(CX - 1.5)},52.6 ${n(CX + 1.5)},52.6 ${n(CX + 4)},51.7`, 0.55, 0.7);
    push({ kind: 'path', d: `M${n(CX - 2.6)},53.6 C${n(CX - 1)},55 ${n(CX + 1)},55 ${n(CX + 2.6)},53.6 C${n(CX + 1)},54.4 ${n(CX - 1)},54.4 ${n(CX - 2.6)},53.6 Z`, fill: 'shadow', opacity: 0.25 });
  }

  // ── hair ──
  if (g === 'lionHood') {
    const hood = mirrored([0, 2], [
      { c1: [12, 2], c2: [19, 10], p: [19.5, 24] },
      { c1: [20, 34], c2: [19, 44], p: [16.5, 50] },
      { c1: [15.5, 40], c2: [14.6, 34], p: [14, 30] },
      { c1: [10, 27], c2: [4, 27], p: [0, 27.4] },
    ]);
    push({ kind: 'path', d: hood, fill: 'hair' });
    push({ kind: 'path', d: hood, fill: 'none', stroke: 'line', strokeWidth: 0.6, opacity: 0.55 });
    // ears of the lion
    const ears = both((m) => `M${m([10, 6])} C${m([12, -2])} ${m([18, -2])} ${m([17, 8])} Z`);
    ears.forEach((d) => {
      push({ kind: 'path', d, fill: 'hair' });
      push({ kind: 'path', d, fill: 'none', stroke: 'line', strokeWidth: 0.6, opacity: 0.55 });
    });
    // brow, eyes and teeth of the beast
    const lionEyes = both((m) => `M${m([3, 14])} C${m([5, 12.6])} ${m([7.5, 12.6])} ${m([9, 14.2])}`);
    lionEyes.forEach((d) => line(d, 0.7, 1));
    let teeth = '';
    for (let i = -10; i < 10; i += 2.5) teeth += `M${n(CX + i)},26.8 L${n(CX + i + 1.25)},29.6 L${n(CX + i + 2.5)},26.8 `;
    push({ kind: 'path', d: teeth, fill: 'skin', stroke: 'line', strokeWidth: 0.4, opacity: 0.8 });
    let mane = '';
    for (let y = 10; y < 48; y += 5) {
      mane += `M${n(CX - 17)},${n(y)} c-2,2 -2,4 0,6 M${n(CX + 17)},${n(y)} c2,2 2,4 0,6 `;
    }
    line(mane, 0.5, 0.6);
    line(`M${n(CX - 1)},8 L${n(CX - 1)},20 M${n(CX + 1)},8 L${n(CX + 1)},20`, 0.35, 0.6);
    return;
  }

  if (g === 'helmet') {
    const helm = mirrored([0, 4], [
      { c1: [10, 4], c2: [16, 12], p: [16, 22] },
      { c1: [16.2, 27], c2: [15.6, 31], p: [14.6, 34] },
      { c1: [12, 31], c2: [8, 30], p: [0, 30] },
    ]);
    push({ kind: 'path', d: helm, fill: 'gold' });
    push({ kind: 'path', d: helm, fill: 'none', stroke: 'line', strokeWidth: 0.6, opacity: 0.6 });
    const slits = both((m) => `M${m([2.6, 17])} C${m([4, 14.4])} ${m([9, 14.6])} ${m([11.5, 18])} C${m([9, 21])} ${m([4.5, 21])} ${m([2.6, 17])} Z`);
    slits.forEach((d) => push({ kind: 'path', d, fill: 'void', opacity: 0.7 }));
    push({ kind: 'path', d: `M${n(CX - 1.6)},12 L${n(CX + 1.6)},12 L${n(CX + 1.2)},26 L${n(CX - 1.2)},26 Z`, fill: 'gold' });
    const crest = mirrored([0, -16], [
      { c1: [4, -16], c2: [5.5, -10], p: [5.2, -2] },
      { c1: [5, 2], c2: [3.5, 5], p: [0, 6] },
    ]);
    push({ kind: 'path', d: crest, fill: 'hair' });
    push({ kind: 'path', d: crest, fill: 'none', stroke: 'line', strokeWidth: 0.6, opacity: 0.5 });
    line(`M${n(CX)},-15 L${n(CX)},5 M${n(CX - 2.5)},-12 C${n(CX - 3)},-6 ${n(CX - 2.8)},0 ${n(CX - 2)},5 M${n(CX + 2.5)},-12 C${n(CX + 3)},-6 ${n(CX + 2.8)},0 ${n(CX + 2)},5`, 0.4, 0.5);
    if (female) {
      // hair escaping below the helmet
      const locks = both((m) => `M${m([13, 32])} C${m([15, 40])} ${m([15.5, 50])} ${m([14, 60])} C${m([13, 52])} ${m([12.5, 42])} ${m([12, 34])} Z`);
      locks.forEach((d) => push({ kind: 'path', d, fill: 'hair' }));
    }
    return;
  }

  if (female) {
    const hair = mirrored([0, 15], [
      { c1: [9, 15], c2: [16, 22], p: [16, 36] },
      { c1: [16.4, 44], c2: [15.4, 50], p: [13.6, 56] },
      { c1: [12.8, 48], c2: [12.6, 42], p: [12.4, 36] },
      { c1: [12, 30], c2: [9, 26.5], p: [4, 25.4] },
      { c1: [2, 25], c2: [0.8, 24], p: [0, 23.6] },
    ]);
    push({ kind: 'path', d: hair, fill: 'hair' });
    push({ kind: 'path', d: hair, fill: 'none', stroke: 'line', strokeWidth: 0.6, opacity: 0.45 });
    const waves = both(
      (m) =>
        `M${m([0.5, 18])} C${m([5, 18])} ${m([10, 22])} ${m([14, 30])} ` +
        `M${m([2, 21.5])} C${m([7, 22])} ${m([11.5, 26])} ${m([14.5, 38])} ` +
        `M${m([9, 18.5])} C${m([13, 21])} ${m([15, 28])} ${m([15.4, 44])}`,
    );
    waves.forEach((d) => line(d, 0.4, 0.6));
  } else {
    const cap = mirrored([0, 12.4], [
      { c1: [9.5, 12.4], c2: [15.8, 19], p: [14.8, 36] },
      { c1: [13.8, 33], c2: [13, 29.5], p: [11.4, 27.6] },
      { c1: [10.6, 30], c2: [8.4, 30], p: [7.6, 27.4] },
      { c1: [6.8, 29.8], c2: [4.4, 29.8], p: [3.8, 27] },
      { c1: [3, 29.4], c2: [0.8, 29.4], p: [0, 27] },
    ]);
    push({ kind: 'path', d: cap, fill: 'hair' });
    push({ kind: 'path', d: cap, fill: 'none', stroke: 'line', strokeWidth: 0.6, opacity: 0.5 });
    let curls = '';
    const rows: [number, number][] = [
      [-11, 24], [-7, 23], [-3, 22.6], [1, 22.6], [5, 23], [9, 24], [12.5, 27],
      [-12.5, 27], [-9, 19], [-5, 18], [-1, 17.6], [3, 17.6], [7, 18], [11, 19.5],
      [-6, 14], [-2, 13.6], [2, 13.6], [6, 14],
    ];
    rows.forEach(([x, y]) => {
      curls += `M${n(CX + x - 1.7)},${n(y)} C${n(CX + x - 1.7)},${n(y - 2.1)} ${n(CX + x + 1.7)},${n(y - 2.1)} ${n(CX + x + 1.7)},${n(y)} C${n(CX + x + 1.7)},${n(y + 1.5)} ${n(CX + x - 0.3)},${n(y + 1.7)} ${n(CX + x - 0.3)},${n(y + 0.2)} `;
    });
    line(curls, 0.42, 0.55);
    if (style.longHair) {
      push({ kind: 'ellipse', cx: CX, cy: 10, rx: 6, ry: 4.4, fill: 'hair' });
      push({ kind: 'ellipse', cx: CX, cy: 10, rx: 6, ry: 4.4, fill: 'none', stroke: 'line', strokeWidth: 0.6, opacity: 0.45 });
      const locks = both((m) => `M${m([14, 34])} C${m([16, 42])} ${m([17, 52])} ${m([15, 62])} M${m([13.5, 40])} C${m([15, 48])} ${m([15.5, 56])} ${m([13, 66])}`);
      locks.forEach((d) => line(d, 0.4, 0.8));
    }
  }

  // ── headgear ──
  switch (g) {
    case 'laurel': {
      for (let i = 0; i < 9; i++) {
        const dx = 2 + i * 1.7;
        const y = 25.5 - (female ? 1.5 : 0) + Math.pow(dx / 15.5, 2) * 7;
        const ang = Math.atan2(Math.pow(dx / 15.5, 1) * 0.9, 1);
        [-1, 1].forEach((s) => {
          push({ kind: 'path', d: leaf(CX + s * dx, y - 1.6, s > 0 ? -2.4 + ang : -Math.PI + 2.4 - ang, 5.2, 1.5), fill: 'gold' });
          push({ kind: 'path', d: leaf(CX + s * (dx + 0.8), y + 1.2, s > 0 ? 2.6 + ang * 0.4 : Math.PI - 2.6 - ang * 0.4, 5, 1.4), fill: 'gold' });
        });
      }
      break;
    }
    case 'ribbon': {
      const band = mirrored([0, 24.6], [
        { c1: [6, 24.6], c2: [12, 26], p: [14.6, 30] },
        { c1: [14.6, 31.6], c2: [14.4, 32.4], p: [14.2, 33] },
        { c1: [11.6, 29.6], c2: [6, 27.8], p: [0, 27.8] },
      ]);
      goldFill(band);
      break;
    }
    case 'diadem': {
      const stephane = mirrored([0, 15], [
        { c1: [4, 17], c2: [9, 21], p: [14.2, 28] },
        { c1: [14.5, 29.6], c2: [14.3, 30.4], p: [14, 31] },
        { c1: [9, 26.4], c2: [4, 25.2], p: [0, 25] },
      ]);
      goldFill(stephane);
      line(`M${n(CX - 9)},23 C${n(CX - 4)},20 ${n(CX + 4)},20 ${n(CX + 9)},23`, 0.5, 0.5);
      break;
    }
    case 'crescent': {
      goldFill(
        `M${n(CX - 7)},20 C${n(CX - 6)},26 ${n(CX + 6)},26 ${n(CX + 7)},20 C${n(CX + 4)},23.4 ${n(CX - 4)},23.4 ${n(CX - 7)},20 Z`,
      );
      break;
    }
    case 'crown': {
      let d = `M${n(CX - 14.6)},29 `;
      const spikes = 7;
      for (let i = 0; i <= spikes; i++) {
        const x = -14 + (28 / spikes) * i;
        const yBase = 24 + Math.abs(x) * 0.18;
        d += `L${n(CX + x)},${n(yBase)} `;
        if (i < spikes) d += `L${n(CX + x + 14 / spikes)},${n(yBase - 9 + Math.abs(x) * 0.25)} `;
      }
      d += `L${n(CX + 14.6)},29 C${n(CX + 8)},27 ${n(CX - 8)},27 ${n(CX - 14.6)},29 Z`;
      goldFill(d);
      break;
    }
    case 'petasos': {
      const wings = both(
        (m) =>
          `M${m([11, 20])} C${m([16, 10])} ${m([22, 2])} ${m([30, -2])} C${m([29, 3])} ${m([27, 6])} ${m([25, 8])} ` +
          `C${m([27, 9])} ${m([28, 11])} ${m([27, 13])} C${m([24, 13])} ${m([22, 15])} ${m([20, 16])} ` +
          `C${m([21, 18])} ${m([20, 20])} ${m([18, 21])} C${m([15, 21])} ${m([13, 22])} ${m([11, 22])} Z`,
      );
      wings.forEach((d) => goldFill(d));
      const dome = mirrored([0, 6], [
        { c1: [7, 6], c2: [12, 10], p: [12.4, 20] },
        { c1: [12.4, 21], c2: [12, 22], p: [0, 22] },
      ]);
      push({ kind: 'path', d: dome, fill: 'hair' });
      push({ kind: 'path', d: dome, fill: 'none', stroke: 'line', strokeWidth: 0.6, opacity: 0.5 });
      push({ kind: 'ellipse', cx: CX, cy: 22.5, rx: 19, ry: 3.4, fill: 'hair' });
      push({ kind: 'ellipse', cx: CX, cy: 22.5, rx: 19, ry: 3.4, fill: 'none', stroke: 'line', strokeWidth: 0.6, opacity: 0.55 });
      break;
    }
    default:
      break;
  }
}
