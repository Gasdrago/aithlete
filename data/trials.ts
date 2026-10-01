/**
 * The Trials — training programs, each placed under a patron deity whose
 * physique it builds toward.
 */
export interface TrialExercise {
  name: string;
  sets: number;
  reps: string;
  rest: string;
  cue?: string;
}

export interface Trial {
  id: string;
  title: string;
  patronId: string;
  /** Patron shown to athletes measured against the goddesses. */
  patronIdFemale: string;
  patron: string;
  focus: string;
  builds: string;
  durationMin: number;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  intensity: 'low' | 'medium' | 'high';
  description: string;
  exercises: TrialExercise[];
}

export const TRIALS: Trial[] = [
  {
    id: 'hero-path',
    title: 'The Hero’s Path',
    patronId: 'achilles',
    patronIdFemale: 'atalanta',
    patron: 'Achilles · Atalanta',
    focus: 'Foundations',
    builds: 'Full body · Habit',
    durationMin: 25,
    difficulty: 'Beginner',
    intensity: 'medium',
    description: 'Every hero begins with the basics. Bodyweight movements to forge the habit and wake the muscles.',
    exercises: [
      { name: 'Bodyweight Squats', sets: 3, reps: '15', rest: '60s', cue: 'Chest proud, knees track the toes' },
      { name: 'Push-ups', sets: 3, reps: '8–12', rest: '60s', cue: 'Knees down if needed — keep a rigid line' },
      { name: 'Glute Bridge', sets: 3, reps: '15', rest: '45s' },
      { name: 'Reverse Lunges', sets: 3, reps: '10 / leg', rest: '60s' },
      { name: 'Plank', sets: 3, reps: '40s', rest: '45s' },
    ],
  },
  {
    id: 'apollo-canon',
    title: 'Apollo’s Canon',
    patronId: 'apollo',
    patronIdFemale: 'aphrodite',
    patron: 'Apollo · Aphrodite',
    focus: 'Aesthetics',
    builds: 'Shoulders · Chest · Waist',
    durationMin: 55,
    difficulty: 'Intermediate',
    intensity: 'medium',
    description: 'Sculpt toward the golden ratio: wider shoulders, a fuller chest, a tighter waist.',
    exercises: [
      { name: 'Incline Dumbbell Press', sets: 4, reps: '8–10', rest: '90s' },
      { name: 'Lateral Raises', sets: 4, reps: '15', rest: '45s', cue: 'Lead with the elbows — this builds the width of a god' },
      { name: 'Pull-ups', sets: 4, reps: '6–10', rest: '90s' },
      { name: 'Cable Fly', sets: 3, reps: '12', rest: '60s' },
      { name: 'Barbell Curl', sets: 3, reps: '10', rest: '60s' },
      { name: 'Triceps Dips', sets: 3, reps: '10–12', rest: '60s' },
      { name: 'Vacuum Hold', sets: 3, reps: '20s', rest: '30s', cue: 'Draws the waist in — the secret of the classical torso' },
    ],
  },
  {
    id: 'winged-sandals',
    title: 'Winged Sandals',
    patronId: 'hermes',
    patronIdFemale: 'nike',
    patron: 'Hermes · Nike',
    focus: 'Speed',
    builds: 'Leanness · Agility',
    durationMin: 30,
    difficulty: 'Intermediate',
    intensity: 'high',
    description: 'Intervals fit for the messenger of the gods. Burn fat, sharpen your feet, outrun the wind.',
    exercises: [
      { name: 'Sprint Intervals', sets: 8, reps: '30s on', rest: '60s' },
      { name: 'Box Jumps', sets: 4, reps: '8', rest: '60s' },
      { name: 'Jump Rope', sets: 5, reps: '1 min', rest: '30s' },
      { name: 'Burpees', sets: 4, reps: '12', rest: '60s' },
      { name: 'Mountain Climbers', sets: 4, reps: '40s', rest: '30s' },
    ],
  },
  {
    id: 'wrath-of-ares',
    title: 'Wrath of Ares',
    patronId: 'ares',
    patronIdFemale: 'athena',
    patron: 'Ares',
    focus: 'War conditioning',
    builds: 'Density · Power',
    durationMin: 40,
    difficulty: 'Advanced',
    intensity: 'high',
    description: 'A metabolic battle. Heavy, fast, relentless — the body of a warrior is forged under fatigue.',
    exercises: [
      { name: 'Kettlebell Swings', sets: 5, reps: '20', rest: '45s' },
      { name: 'Barbell Thrusters', sets: 5, reps: '10', rest: '75s' },
      { name: 'Battle Ropes', sets: 4, reps: '40s', rest: '40s' },
      { name: 'Weighted Push-ups', sets: 4, reps: '12', rest: '60s' },
      { name: 'Bear Crawl', sets: 4, reps: '20 m', rest: '45s' },
    ],
  },
  {
    id: 'tides-of-poseidon',
    title: 'Tides of Poseidon',
    patronId: 'poseidon',
    patronIdFemale: 'artemis',
    patron: 'Poseidon',
    focus: 'Core & power',
    builds: 'Core · Chest · Grip',
    durationMin: 35,
    difficulty: 'Intermediate',
    intensity: 'medium',
    description: 'A core like the ocean floor. Rotational power and unshakable stability.',
    exercises: [
      { name: 'Medicine Ball Slams', sets: 4, reps: '12', rest: '45s' },
      { name: 'Hanging Leg Raises', sets: 4, reps: '10–12', rest: '60s' },
      { name: 'Pallof Press', sets: 3, reps: '12 / side', rest: '45s' },
      { name: 'Russian Twists', sets: 3, reps: '20', rest: '45s' },
      { name: 'Turkish Get-up', sets: 3, reps: '3 / side', rest: '60s' },
      { name: 'Dead Hang', sets: 3, reps: 'max', rest: '60s' },
    ],
  },
  {
    id: 'hunt-of-artemis',
    title: 'Hunt of Artemis',
    patronId: 'artemis',
    patronIdFemale: 'artemis',
    patron: 'Artemis',
    focus: 'Endurance',
    builds: 'Legs · Lungs',
    durationMin: 45,
    difficulty: 'Beginner',
    intensity: 'medium',
    description: 'Range the mountains like the huntress. Steady cardio and strong, tireless legs.',
    exercises: [
      { name: 'Tempo Run', sets: 1, reps: '20 min', rest: '—' },
      { name: 'Walking Lunges', sets: 3, reps: '20 steps', rest: '60s' },
      { name: 'Step-ups', sets: 3, reps: '12 / leg', rest: '60s' },
      { name: 'Single-leg Romanian Deadlift', sets: 3, reps: '10 / leg', rest: '60s' },
      { name: 'Calf Raises', sets: 4, reps: '20', rest: '30s' },
    ],
  },
  {
    id: 'aegis-of-athena',
    title: 'Aegis of Athena',
    patronId: 'athena',
    patronIdFemale: 'athena',
    patron: 'Athena · Hera',
    focus: 'Functional strength',
    builds: 'Balance · Strength',
    durationMin: 45,
    difficulty: 'Intermediate',
    intensity: 'medium',
    description: 'Strategy made flesh: balanced, functional strength that serves every battle.',
    exercises: [
      { name: 'Goblet Squat', sets: 4, reps: '10', rest: '75s' },
      { name: 'Push Press', sets: 4, reps: '8', rest: '75s' },
      { name: 'Renegade Rows', sets: 3, reps: '8 / side', rest: '60s' },
      { name: 'Hip Thrust', sets: 3, reps: '12', rest: '60s' },
      { name: 'Side Plank', sets: 3, reps: '30s / side', rest: '30s' },
    ],
  },
  {
    id: 'twelve-labors',
    title: 'The Twelve Labors',
    patronId: 'heracles',
    patronIdFemale: 'hera',
    patron: 'Heracles · Zeus',
    focus: 'Raw strength',
    builds: 'Back · Legs · Mass',
    durationMin: 65,
    difficulty: 'Advanced',
    intensity: 'high',
    description: 'Heavy compound lifts, the way Heracles wrestled the Nemean lion. Only for the worthy.',
    exercises: [
      { name: 'Deadlift', sets: 5, reps: '5', rest: '3 min', cue: 'Brace like you carry the sky for Atlas' },
      { name: 'Back Squat', sets: 5, reps: '5', rest: '3 min' },
      { name: 'Weighted Pull-ups', sets: 4, reps: '6', rest: '2 min' },
      { name: 'Overhead Press', sets: 4, reps: '6', rest: '2 min' },
      { name: 'Farmer’s Carry', sets: 4, reps: '40 m', rest: '90s' },
      { name: 'Barbell Row', sets: 3, reps: '8', rest: '90s' },
    ],
  },
];

export function patronIdFor(trial: Trial, sex: 'male' | 'female'): string {
  return sex === 'female' ? trial.patronIdFemale : trial.patronId;
}

export function trialById(id: string): Trial | undefined {
  return TRIALS.find((t) => t.id === id);
}
