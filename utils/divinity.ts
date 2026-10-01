import type { StatueMaterial, StatueParams } from '@/components/olympus/statueGeometry';
import { pantheonFor, type Deity } from '@/data/pantheon';

export type Sex = 'male' | 'female';
export type Goal = 'muscle' | 'fat-loss' | 'endurance' | 'general';
export type Level = 'Beginner' | 'Intermediate' | 'Advanced';

/** All circumferences in centimetres, weight in kilograms. */
export interface BodyMeasurements {
  date: string;
  weight: number;
  /** Optional: when missing it is estimated with the U.S. Navy method. */
  bodyFat?: number;
  neck: number;
  shoulders: number;
  chest: number;
  waist: number;
  hips: number;
  arm: number;
  thigh: number;
  calf: number;
}

export type MeasureKey = Exclude<keyof BodyMeasurements, 'date'>;

export interface WorkoutLog {
  id: string;
  date: string;
  trialId: string;
  name: string;
  durationMin: number;
  calories: number;
}

const clamp01 = (v: number) => Math.min(1, Math.max(0, v));

// ─────────────────────────────────────────────────────── body metrics ──

/** U.S. Navy body-fat estimate (circumferences in cm). */
export function estimateBodyFat(m: Pick<BodyMeasurements, 'waist' | 'neck' | 'hips'>, heightCm: number, sex: Sex): number {
  const log10 = Math.log10;
  let bf: number;
  if (sex === 'male') {
    const diff = Math.max(m.waist - m.neck, 10);
    bf = 495 / (1.0324 - 0.19077 * log10(diff) + 0.15456 * log10(heightCm)) - 450;
  } else {
    const diff = Math.max(m.waist + m.hips - m.neck, 20);
    bf = 495 / (1.29579 - 0.35004 * log10(diff) + 0.221 * log10(heightCm)) - 450;
  }
  return Math.round(Math.min(50, Math.max(4, bf)) * 10) / 10;
}

export function bodyFatOf(m: BodyMeasurements | Deity['body'], heightCm: number, sex: Sex): number {
  return m.bodyFat ?? estimateBodyFat(m, heightCm, sex);
}

/** Shoulder-to-waist ratio. The classical ideal for men is φ ≈ 1.618. */
export const adonisIndex = (m: { shoulders: number; waist: number }) => m.shoulders / m.waist;
export const waistToHip = (m: { waist: number; hips: number }) => m.waist / m.hips;

export function ffmi(weight: number, bodyFat: number, heightCm: number): number {
  const lean = weight * (1 - bodyFat / 100);
  const h = heightCm / 100;
  return lean / (h * h) + 6.1 * (1.8 - h);
}

export const PHI = 1.618;

// ──────────────────────────────────────────────────── divinity score ──

export interface DivinityBreakdown {
  /** 0–100 */
  score: number;
  muscle: number;
  leanness: number;
  proportion: number;
  discipline: number;
  bodyFat: number;
}

/** Training consistency over the last 30 days, 0–1 (16 sessions = full favour). */
export function disciplineFrom(workouts: WorkoutLog[], now = Date.now()): number {
  const month = workouts.filter((w) => now - new Date(w.date).getTime() < 30 * 864e5).length;
  return clamp01(month / 16);
}

export function divinityOf(
  m: BodyMeasurements | Deity['body'],
  heightCm: number,
  sex: Sex,
  discipline: number,
): DivinityBreakdown {
  const bf = bodyFatOf(m, heightCm, sex);
  // circumferences carry fat as well as muscle: discount the excess over a lean baseline
  const excess = Math.max(0, bf - (sex === 'male' ? 12 : 21));
  const sh = (m.shoulders / heightCm) * (1 - excess * 0.004);
  const arm = (m.arm / heightCm) * (1 - excess * 0.012);
  let muscle: number;
  let leanness: number;
  let proportion: number;
  if (sex === 'male') {
    muscle = 0.55 * clamp01((sh - 0.62) / (0.755 - 0.62)) + 0.45 * clamp01((arm - 0.17) / (0.24 - 0.17));
    leanness = bf <= 10 ? clamp01(1 - (10 - bf) / 12) : clamp01(1 - (bf - 10) / 16);
    proportion = clamp01(1 - Math.abs(adonisIndex(m) - PHI) / 0.42);
  } else {
    muscle = 0.55 * clamp01((sh - 0.58) / (0.645 - 0.58)) + 0.45 * clamp01((arm - 0.15) / (0.185 - 0.15));
    leanness = bf <= 19 ? clamp01(1 - (19 - bf) / 12) : clamp01(1 - (bf - 19) / 16);
    proportion =
      0.6 * clamp01(1 - Math.abs(waistToHip(m) - 0.7) / 0.2) + 0.4 * clamp01(1 - Math.abs(adonisIndex(m) - 1.62) / 0.45);
  }
  const d = clamp01(discipline);
  const score = 100 * (0.35 * muscle + 0.25 * leanness + 0.25 * proportion + 0.15 * d);
  return {
    score: Math.round(score * 10) / 10,
    muscle,
    leanness,
    proportion,
    discipline: d,
    bodyFat: bf,
  };
}

export interface RankInfo {
  current: Deity;
  next: Deity | null;
  /** 0–1 progress from the current rank threshold to the next one. */
  progress: number;
  pointsToNext: number;
  ladder: Deity[];
}

export function rankFor(score: number, sex: Sex): RankInfo {
  const ladder = pantheonFor(sex);
  let current = ladder[0];
  for (const d of ladder) if (score >= d.threshold) current = d;
  const next = ladder.find((d) => d.tier === current.tier + 1) ?? null;
  const progress = next ? clamp01((score - current.threshold) / (next.threshold - current.threshold)) : 1;
  return {
    current,
    next,
    progress,
    pointsToNext: next ? Math.max(0, Math.ceil(next.threshold - score)) : 0,
    ladder,
  };
}

/** Statue material earned by rank: clay → bronze → marble → gold. */
export function materialForTier(tier: number, ladderLength: number): StatueMaterial {
  if (tier <= 0) return 'clay';
  if (tier === 1) return 'bronze';
  if (tier >= ladderLength - 2) return 'gold';
  return 'marble';
}

// ─────────────────────────────────────────────────────── resemblance ──

export interface MetricComparison {
  key: MeasureKey | 'adonis';
  label: string;
  unit: string;
  yours: number;
  /** The deity's value scaled to the athlete's height. */
  target: number;
  /** 0–1 */
  match: number;
  /** Which way progress goes for this metric. */
  better: 'higher' | 'lower' | 'neutral';
}

const COMPARED: { key: MeasureKey; label: string; tol: number; weight: number }[] = [
  { key: 'shoulders', label: 'Shoulders', tol: 0.075, weight: 1.4 },
  { key: 'chest', label: 'Chest', tol: 0.075, weight: 1 },
  { key: 'waist', label: 'Waist', tol: 0.075, weight: 1.3 },
  { key: 'hips', label: 'Hips', tol: 0.075, weight: 0.6 },
  { key: 'arm', label: 'Arms', tol: 0.035, weight: 1.1 },
  { key: 'thigh', label: 'Thighs', tol: 0.05, weight: 0.8 },
  { key: 'calf', label: 'Calves', tol: 0.03, weight: 0.4 },
];

export function compareTo(
  m: BodyMeasurements,
  heightCm: number,
  sex: Sex,
  deity: Deity,
): { similarity: number; metrics: MetricComparison[] } {
  const scale = heightCm / deity.heightCm;
  const metrics: MetricComparison[] = [];
  let acc = 0;
  let wsum = 0;
  for (const c of COMPARED) {
    const yours = m[c.key] as number;
    const target = (deity.body[c.key] as number) * scale;
    const match = clamp01(1 - Math.abs(yours - target) / heightCm / c.tol);
    metrics.push({
      key: c.key,
      label: c.label,
      unit: 'cm',
      yours,
      target: Math.round(target * 10) / 10,
      match,
      better: c.key === 'waist' ? 'lower' : c.key === 'hips' ? 'neutral' : 'higher',
    });
    acc += match * c.weight;
    wsum += c.weight;
  }
  const bf = bodyFatOf(m, heightCm, sex);
  const gbf = bodyFatOf(deity.body, deity.heightCm, sex);
  const bfMatch = clamp01(1 - Math.abs(bf - gbf) / 12);
  metrics.push({
    key: 'bodyFat',
    label: 'Body fat',
    unit: '%',
    yours: bf,
    target: gbf,
    match: bfMatch,
    better: 'lower',
  });
  acc += bfMatch * 1.4;
  wsum += 1.4;
  const ai = adonisIndex(m);
  const gai = adonisIndex(deity.body);
  metrics.push({
    key: 'adonis',
    label: sex === 'male' ? 'Adonis index' : 'Shoulder / waist',
    unit: '',
    yours: Math.round(ai * 100) / 100,
    target: Math.round(gai * 100) / 100,
    match: clamp01(1 - Math.abs(ai - gai) / 0.3),
    better: 'higher',
  });
  return { similarity: acc / wsum, metrics };
}

export function resemblances(m: BodyMeasurements, heightCm: number, sex: Sex) {
  return pantheonFor(sex)
    .filter((d) => d.tier > 0)
    .map((deity) => ({ deity, ...compareTo(m, heightCm, sex, deity) }))
    .sort((a, b) => b.similarity - a.similarity);
}

// ──────────────────────────────────────────────────────── projection ──

type Rates = Partial<Record<MeasureKey, number>>;

/** Typical monthly change for a consistent trainee, per goal (male baseline). */
const MONTHLY: Record<Goal, Rates> = {
  muscle: { weight: 0.6, bodyFat: -0.15, shoulders: 0.65, chest: 0.6, waist: 0.05, hips: 0.1, arm: 0.32, thigh: 0.4, calf: 0.12, neck: 0.15 },
  'fat-loss': { weight: -1.6, bodyFat: -0.9, shoulders: -0.1, chest: -0.6, waist: -1.4, hips: -1.0, arm: -0.1, thigh: -0.5, calf: -0.1, neck: -0.2 },
  endurance: { weight: -0.6, bodyFat: -0.55, shoulders: 0.15, chest: -0.1, waist: -0.8, hips: -0.5, arm: 0.05, thigh: 0.1, calf: 0.25, neck: 0 },
  general: { weight: -0.2, bodyFat: -0.45, shoulders: 0.35, chest: 0.25, waist: -0.6, hips: -0.3, arm: 0.18, thigh: 0.15, calf: 0.1, neck: 0.05 },
};

const LEVEL_FACTOR: Record<Level, number> = { Beginner: 1.3, Intermediate: 1, Advanced: 0.55 };

export function projectBody(
  m: BodyMeasurements,
  months: number,
  opts: { sex: Sex; heightCm: number; goal: Goal; level: Level; adherence: number },
): BodyMeasurements {
  const rates = MONTHLY[opts.goal];
  const sexFactor = opts.sex === 'female' ? 0.6 : 1;
  const effort = (0.55 + 0.45 * clamp01(opts.adherence)) * LEVEL_FACTOR[opts.level];
  // gains slow down over time
  const t = Math.pow(months, 0.85);
  const bf0 = bodyFatOf(m, opts.heightCm, opts.sex);
  const out: BodyMeasurements = { ...m, bodyFat: bf0, date: new Date(Date.now() + months * 30 * 864e5).toISOString() };
  (Object.keys(rates) as MeasureKey[]).forEach((k) => {
    const isGrowth = (rates[k] ?? 0) > 0 && k !== 'weight';
    const r = (rates[k] ?? 0) * effort * (isGrowth ? sexFactor : 1);
    const base = (out[k] as number) ?? 0;
    (out as any)[k] = Math.round((base + r * t) * 10) / 10;
  });
  const floorBf = opts.sex === 'male' ? 8 : 16;
  out.bodyFat = Math.round(Math.max(Math.min(floorBf, bf0), out.bodyFat ?? bf0) * 10) / 10;
  return out;
}

// ──────────────────────────────────────────────── statue parameters ──

const STATUE_HEIGHT = 320;

/** Translate real measurements into statue half-widths (heroically amplified). */
export function statueParamsFrom(
  m: BodyMeasurements | Deity['body'],
  heightCm: number,
  sex: Sex,
): StatueParams {
  const s = STATUE_HEIGHT / heightCm;
  const tau = Math.PI * 2;
  const bf = bodyFatOf(m, heightCm, sex);
  const female = sex === 'female';
  // average statue widths around which differences are amplified
  const ref = female
    ? { neck: 9.5, shoulder: 36.5, chest: 28, waist: 24, hip: 34, arm: 8.6, thigh: 17, calf: 11 }
    : { neck: 11, shoulder: 41, chest: 30, waist: 27, hip: 31.5, arm: 9.8, thigh: 16.5, calf: 11 };
  const amp = (v: number, r: number) => r + (v - r) * 1.35;
  const neck = amp((m.neck / tau) * 0.95 * s, ref.neck);
  const shoulder = amp(((m.shoulders * 0.39) / 2) * s, ref.shoulder);
  const chest = amp(((m.chest * 0.33) / 2) * s, ref.chest);
  const waist = amp(((m.waist * 0.345) / 2) * s, ref.waist);
  const hip = amp(((m.hips * 0.36) / 2) * s, ref.hip);
  const arm = amp((m.arm / tau) * s * 1.05, ref.arm);
  const thigh = amp((m.thigh / tau) * s, ref.thigh);
  const calf = amp((m.calf / tau) * s, ref.calf);
  const c = (v: number, lo: number, hi: number) => Math.min(hi, Math.max(lo, v));
  const sh = c(shoulder, 30, 58);
  const ch = c(Math.min(chest, sh - 5), 22, 46);
  return {
    sex,
    neck: c(neck, 7.5, 16),
    shoulder: sh,
    chest: ch,
    waist: c(Math.min(waist, ch + 9), 17, 44),
    hip: c(hip, 24, 46),
    arm: c(arm, 6, 16),
    forearm: c(arm * 0.86, 5.2, 14),
    thigh: c(thigh, 11, 25),
    calf: c(calf, 8, 15.5),
    definition: female ? clamp01((34 - bf) / 16) : clamp01((25 - bf) / 15),
  };
}

// ────────────────────────────────────────────────────────── streaks ──

export function streakOf(workouts: WorkoutLog[], now = new Date()): number {
  const days = new Set(workouts.map((w) => new Date(w.date).toDateString()));
  let streak = 0;
  const d = new Date(now);
  // a streak survives until the end of today
  if (!days.has(d.toDateString())) d.setDate(d.getDate() - 1);
  while (days.has(d.toDateString())) {
    streak++;
    d.setDate(d.getDate() - 1);
  }
  return streak;
}

export function estimateCalories(durationMin: number, intensity: 'low' | 'medium' | 'high', weightKg: number): number {
  const met = { low: 3.5, medium: 6, high: 8.5 }[intensity];
  return Math.round(((met * 3.5 * weightKg) / 200) * durationMin);
}
