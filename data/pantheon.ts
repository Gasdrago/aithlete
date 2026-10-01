import type { StatueStyle } from '@/components/olympus/statueGeometry';
import type { Sex, BodyMeasurements } from '@/utils/divinity';

/**
 * The ladder of ascension. Each figure is a physique archetype: its
 * measurements (at its own height) feed both the statue renderer and the
 * comparison engine, so "you vs. Apollo" compares real numbers.
 */
export interface Deity {
  id: string;
  name: string;
  greek: string;
  epithet: string;
  sex: Sex;
  /** Position on the ladder; 0 is the mortal starting point. */
  tier: number;
  /** Divinity score required to ascend to this figure. */
  threshold: number;
  virtue: string;
  lore: string;
  /** Archetype body, measured at `heightCm`. */
  heightCm: number;
  body: Omit<BodyMeasurements, 'date' | 'weight'> & { weight: number };
  style: StatueStyle;
  trialId: string;
}

export const GODS: Deity[] = [
  {
    id: 'mortal',
    name: 'Mortal',
    greek: 'ΘΝΗΤΟΣ',
    epithet: 'Shaped from clay',
    sex: 'male',
    tier: 0,
    threshold: 0,
    virtue: 'Potential',
    lore: 'Prometheus shaped the first men from clay. Every legend begins here — unformed, but full of fire.',
    heightCm: 178,
    body: { weight: 80, bodyFat: 23, neck: 38, shoulders: 112, chest: 99, waist: 91, hips: 100, arm: 31, thigh: 56, calf: 37 },
    style: { headGear: 'curls', attribute: 'none' },
    trialId: 'hero-path',
  },
  {
    id: 'achilles',
    name: 'Achilles',
    greek: 'ΑΧΙΛΛΕΥΣ',
    epithet: 'The Hero',
    sex: 'male',
    tier: 1,
    threshold: 30,
    virtue: 'Courage',
    lore: 'Swift-footed and fearless, the greatest of the Achaeans chose glory over a long life. Your first transformation.',
    heightCm: 182,
    body: { weight: 80, bodyFat: 15, neck: 39, shoulders: 120, chest: 103, waist: 83, hips: 96, arm: 35, thigh: 57, calf: 38 },
    style: { headGear: 'ribbon', attribute: 'javelin' },
    trialId: 'hero-path',
  },
  {
    id: 'hermes',
    name: 'Hermes',
    greek: 'ΕΡΜΗΣ',
    epithet: 'The Swift',
    sex: 'male',
    tier: 2,
    threshold: 45,
    virtue: 'Speed',
    lore: 'Messenger of the gods, lean and quick, he outran the wind in winged sandals. Agility over bulk.',
    heightCm: 178,
    body: { weight: 72, bodyFat: 9, neck: 37, shoulders: 117, chest: 98, waist: 75, hips: 91, arm: 33, thigh: 55, calf: 38 },
    style: { headGear: 'petasos', attribute: 'caduceus' },
    trialId: 'winged-sandals',
  },
  {
    id: 'apollo',
    name: 'Apollo',
    greek: 'ΑΠΟΛΛΩΝ',
    epithet: 'The Radiant',
    sex: 'male',
    tier: 3,
    threshold: 60,
    virtue: 'Harmony',
    lore: 'God of light and music, sculpted to the golden ratio. His shoulders measure φ times his waist — the canon of beauty.',
    heightCm: 183,
    body: { weight: 82, bodyFat: 10, neck: 39, shoulders: 127, chest: 105, waist: 78.5, hips: 94, arm: 37.5, thigh: 58, calf: 39 },
    style: { headGear: 'laurel', attribute: 'lyre', longHair: true },
    trialId: 'apollo-canon',
  },
  {
    id: 'ares',
    name: 'Ares',
    greek: 'ΑΡΗΣ',
    epithet: 'The Warrior',
    sex: 'male',
    tier: 4,
    threshold: 72,
    virtue: 'Ferocity',
    lore: 'Untamed god of war. A body forged for battle: dense, explosive, built to endure the clash of bronze.',
    heightCm: 182,
    body: { weight: 88, bodyFat: 11, neck: 42, shoulders: 131, chest: 110, waist: 81, hips: 97, arm: 40, thigh: 62, calf: 40 },
    style: { headGear: 'helmet', attribute: 'spearShield' },
    trialId: 'wrath-of-ares',
  },
  {
    id: 'poseidon',
    name: 'Poseidon',
    greek: 'ΠΟΣΕΙΔΩΝ',
    epithet: 'The Earth-Shaker',
    sex: 'male',
    tier: 5,
    threshold: 82,
    virtue: 'Power',
    lore: 'Lord of the seas, whose trident splits mountains. A thick, powerful core and a chest like the tide.',
    heightCm: 185,
    body: { weight: 95, bodyFat: 12, neck: 43, shoulders: 135, chest: 114, waist: 84, hips: 100, arm: 42, thigh: 64, calf: 41 },
    style: { headGear: 'crown', attribute: 'trident', beard: true },
    trialId: 'tides-of-poseidon',
  },
  {
    id: 'heracles',
    name: 'Heracles',
    greek: 'ΗΡΑΚΛΗΣ',
    epithet: 'The Mighty',
    sex: 'male',
    tier: 6,
    threshold: 90,
    virtue: 'Strength',
    lore: 'Twelve impossible labors, completed. The strongest of all mortals became a god by sheer force of will.',
    heightCm: 186,
    body: { weight: 102, bodyFat: 12, neck: 46, shoulders: 140, chest: 118, waist: 86.5, hips: 102, arm: 45, thigh: 67, calf: 43 },
    style: { headGear: 'lionHood', attribute: 'club', beard: true },
    trialId: 'twelve-labors',
  },
  {
    id: 'zeus',
    name: 'Zeus',
    greek: 'ΖΕΥΣ',
    epithet: 'King of Olympus',
    sex: 'male',
    tier: 7,
    threshold: 96,
    virtue: 'Sovereignty',
    lore: 'Father of gods and men. Strength, leanness and proportion in perfect balance — the summit of the ascension.',
    heightCm: 186,
    body: { weight: 98, bodyFat: 10, neck: 44, shoulders: 140, chest: 116, waist: 86.5, hips: 100, arm: 44, thigh: 65, calf: 42 },
    style: { headGear: 'laurel', attribute: 'thunderbolt', beard: true },
    trialId: 'twelve-labors',
  },
];

export const GODDESSES: Deity[] = [
  {
    id: 'mortal-f',
    name: 'Mortal',
    greek: 'ΘΝΗΤΗ',
    epithet: 'Shaped from clay',
    sex: 'female',
    tier: 0,
    threshold: 0,
    virtue: 'Potential',
    lore: 'Every legend begins unformed. The clay is soft, the fire is yours — the gods favour those who rise.',
    heightCm: 166,
    body: { weight: 66, bodyFat: 32, neck: 33, shoulders: 100, chest: 92, waist: 80, hips: 103, arm: 29, thigh: 58, calf: 36 },
    style: { headGear: 'none', attribute: 'none' },
    trialId: 'hero-path',
  },
  {
    id: 'atalanta',
    name: 'Atalanta',
    greek: 'ΑΤΑΛΑΝΤΗ',
    epithet: 'The Heroine',
    sex: 'female',
    tier: 1,
    threshold: 30,
    virtue: 'Courage',
    lore: 'Raised by a she-bear, she outran every suitor and hunted the Calydonian boar. Your first transformation.',
    heightCm: 168,
    body: { weight: 60, bodyFat: 23, neck: 32, shoulders: 101, chest: 88, waist: 70, hips: 96, arm: 27, thigh: 54, calf: 35 },
    style: { headGear: 'ribbon', attribute: 'javelin' },
    trialId: 'hero-path',
  },
  {
    id: 'nike',
    name: 'Nike',
    greek: 'ΝΙΚΗ',
    epithet: 'Winged Victory',
    sex: 'female',
    tier: 2,
    threshold: 45,
    virtue: 'Speed',
    lore: 'Goddess of victory, who flies above the stadium to crown the champion. Light, fast, relentless.',
    heightCm: 168,
    body: { weight: 58, bodyFat: 19, neck: 32, shoulders: 102, chest: 87, waist: 66, hips: 93, arm: 27, thigh: 53, calf: 35 },
    style: { headGear: 'laurel', attribute: 'wreath', wings: true },
    trialId: 'winged-sandals',
  },
  {
    id: 'artemis',
    name: 'Artemis',
    greek: 'ΑΡΤΕΜΙΣ',
    epithet: 'The Huntress',
    sex: 'female',
    tier: 3,
    threshold: 60,
    virtue: 'Endurance',
    lore: 'Twin of Apollo, queen of the wild. She ranges the mountains all night — an athlete of the hunt.',
    heightCm: 170,
    body: { weight: 61, bodyFat: 18, neck: 32, shoulders: 105, chest: 89, waist: 67, hips: 94, arm: 28.5, thigh: 54, calf: 36 },
    style: { headGear: 'crescent', attribute: 'bow' },
    trialId: 'hunt-of-artemis',
  },
  {
    id: 'aphrodite',
    name: 'Aphrodite',
    greek: 'ΑΦΡΟΔΙΤΗ',
    epithet: 'The Golden',
    sex: 'female',
    tier: 4,
    threshold: 72,
    virtue: 'Harmony',
    lore: 'Born of the sea foam, the measure of beauty itself. Her waist is seven tenths of her hips — the ancient ideal.',
    heightCm: 168,
    body: { weight: 60, bodyFat: 20, neck: 31, shoulders: 104, chest: 92, waist: 66, hips: 95, arm: 28, thigh: 56, calf: 35 },
    style: { headGear: 'diadem', attribute: 'apple' },
    trialId: 'apollo-canon',
  },
  {
    id: 'athena',
    name: 'Athena',
    greek: 'ΑΘΗΝΑ',
    epithet: 'The Strategist',
    sex: 'female',
    tier: 5,
    threshold: 84,
    virtue: 'Wisdom',
    lore: 'Born fully armed from the head of Zeus. Strategy, discipline and a warrior’s strength in one body.',
    heightCm: 172,
    body: { weight: 65, bodyFat: 19, neck: 33, shoulders: 109, chest: 92, waist: 68, hips: 96, arm: 30.5, thigh: 56, calf: 37 },
    style: { headGear: 'helmet', attribute: 'spearShield' },
    trialId: 'aegis-of-athena',
  },
  {
    id: 'hera',
    name: 'Hera',
    greek: 'ΗΡΑ',
    epithet: 'Queen of Olympus',
    sex: 'female',
    tier: 6,
    threshold: 94,
    virtue: 'Sovereignty',
    lore: 'Queen of the gods, crowned and unshakable. Strength, leanness and proportion in perfect balance.',
    heightCm: 172,
    body: { weight: 66, bodyFat: 19, neck: 33, shoulders: 111, chest: 93, waist: 67, hips: 96, arm: 31, thigh: 57, calf: 37 },
    style: { headGear: 'diadem', attribute: 'scepter' },
    trialId: 'aegis-of-athena',
  },
];

export function pantheonFor(sex: Sex): Deity[] {
  return sex === 'female' ? GODDESSES : GODS;
}

export function findDeity(id: string): Deity | undefined {
  return GODS.find((g) => g.id === id) ?? GODDESSES.find((g) => g.id === id);
}

export const ORACLE_SAYINGS: { text: string; author: string }[] = [
  { text: 'Know thyself.', author: 'Inscription at Delphi' },
  { text: 'We are what we repeatedly do. Excellence, then, is not an act but a habit.', author: 'Aristotle' },
  { text: 'Become who you are.', author: 'Pindar' },
  { text: 'No man ever steps in the same river twice.', author: 'Heraclitus' },
  { text: 'The gods help those who help themselves.', author: 'Aesop' },
  { text: 'It is a shame for a man to grow old without seeing the beauty and strength of which his body is capable.', author: 'Socrates' },
  { text: 'Nothing in excess.', author: 'Inscription at Delphi' },
  { text: 'Through suffering, learning.', author: 'Aeschylus' },
];
