
/**
 * Progress Tracking Utilities
 * 
 * This module provides functions for tracking and calculating fitness progress.
 * In a production app, this would integrate with AsyncStorage or a backend database.
 */

export interface WorkoutLog {
  id: string;
  date: Date;
  workoutName: string;
  exercises: ExerciseLog[];
  duration: number; // minutes
  caloriesBurned: number;
  notes?: string;
}

export interface ExerciseLog {
  exerciseName: string;
  sets: SetLog[];
}

export interface SetLog {
  reps: number;
  weight?: number; // kg
  completed: boolean;
}

export interface BodyMetrics {
  date: Date;
  weight?: number; // kg
  bodyFat?: number; // percentage
  measurements?: {
    chest?: number; // cm
    waist?: number;
    hips?: number;
    arms?: number;
    thighs?: number;
  };
}

export interface FitnessStats {
  totalWorkouts: number;
  activeDays: number;
  totalCalories: number;
  averageWorkoutDuration: number;
  currentStreak: number;
  longestStreak: number;
  fitnessIndex: number;
}

/**
 * Calculate fitness index based on various metrics
 * Range: 0-100
 */
export function calculateFitnessIndex(
  workouts: WorkoutLog[],
  bodyMetrics: BodyMetrics[]
): number {
  if (workouts.length === 0) return 0;

  // Factors that contribute to fitness index:
  // 1. Workout consistency (40%)
  // 2. Progressive overload (30%)
  // 3. Body composition improvement (30%)

  const consistencyScore = calculateConsistencyScore(workouts);
  const progressScore = calculateProgressScore(workouts);
  const bodyScore = calculateBodyScore(bodyMetrics);

  const fitnessIndex = Math.round(
    consistencyScore * 0.4 + progressScore * 0.3 + bodyScore * 0.3
  );

  return Math.min(100, Math.max(0, fitnessIndex));
}

function calculateConsistencyScore(workouts: WorkoutLog[]): number {
  if (workouts.length === 0) return 0;

  const last30Days = workouts.filter(
    w => new Date(w.date).getTime() > Date.now() - 30 * 24 * 60 * 60 * 1000
  );

  // Ideal: 4-5 workouts per week
  const workoutsPerWeek = (last30Days.length / 30) * 7;
  const idealWorkouts = 4.5;

  return Math.min(100, (workoutsPerWeek / idealWorkouts) * 100);
}

function calculateProgressScore(workouts: WorkoutLog[]): number {
  if (workouts.length < 2) return 50; // Default score for new users

  // Check if user is lifting heavier weights over time
  // This is a simplified version - in production, track specific exercises
  const recentWorkouts = workouts.slice(-10);
  const olderWorkouts = workouts.slice(0, 10);

  const recentAvgDuration = average(recentWorkouts.map(w => w.duration));
  const olderAvgDuration = average(olderWorkouts.map(w => w.duration));

  const improvement = ((recentAvgDuration - olderAvgDuration) / olderAvgDuration) * 100;

  return Math.min(100, 50 + improvement);
}

function calculateBodyScore(bodyMetrics: BodyMetrics[]): number {
  if (bodyMetrics.length < 2) return 50; // Default score

  const latest = bodyMetrics[bodyMetrics.length - 1];
  const oldest = bodyMetrics[0];

  let score = 50;

  // Weight change (if losing fat or gaining muscle)
  if (latest.weight && oldest.weight) {
    const weightChange = latest.weight - oldest.weight;
    // Assuming goal is fat loss: negative change is good
    score += Math.min(20, Math.abs(weightChange) * 2);
  }

  // Body fat percentage improvement
  if (latest.bodyFat && oldest.bodyFat) {
    const fatChange = oldest.bodyFat - latest.bodyFat;
    score += Math.min(30, fatChange * 5);
  }

  return Math.min(100, score);
}

/**
 * Calculate weekly statistics
 */
export function calculateWeeklyStats(workouts: WorkoutLog[]): {
  totalWorkouts: number;
  activeDays: number;
  totalTime: number;
  totalCalories: number;
} {
  const oneWeekAgo = Date.now() - 7 * 24 * 60 * 60 * 1000;
  const weekWorkouts = workouts.filter(
    w => new Date(w.date).getTime() > oneWeekAgo
  );

  const uniqueDays = new Set(
    weekWorkouts.map(w => new Date(w.date).toDateString())
  ).size;

  return {
    totalWorkouts: weekWorkouts.length,
    activeDays: uniqueDays,
    totalTime: weekWorkouts.reduce((sum, w) => sum + w.duration, 0),
    totalCalories: weekWorkouts.reduce((sum, w) => sum + w.caloriesBurned, 0),
  };
}

/**
 * Calculate current workout streak
 */
export function calculateStreak(workouts: WorkoutLog[]): {
  current: number;
  longest: number;
} {
  if (workouts.length === 0) return { current: 0, longest: 0 };

  const sortedWorkouts = [...workouts].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  let currentStreak = 0;
  let longestStreak = 0;
  let tempStreak = 0;
  let lastDate: Date | null = null;

  for (const workout of sortedWorkouts) {
    const workoutDate = new Date(workout.date);
    workoutDate.setHours(0, 0, 0, 0);

    if (!lastDate) {
      tempStreak = 1;
      currentStreak = 1;
    } else {
      const daysDiff = Math.floor(
        (lastDate.getTime() - workoutDate.getTime()) / (24 * 60 * 60 * 1000)
      );

      if (daysDiff === 1) {
        tempStreak++;
        if (lastDate.toDateString() === new Date().toDateString()) {
          currentStreak = tempStreak;
        }
      } else if (daysDiff > 1) {
        longestStreak = Math.max(longestStreak, tempStreak);
        tempStreak = 1;
      }
    }

    lastDate = workoutDate;
  }

  longestStreak = Math.max(longestStreak, tempStreak);

  return { current: currentStreak, longest: longestStreak };
}

/**
 * Estimate calories burned based on workout duration and intensity
 */
export function estimateCaloriesBurned(
  duration: number, // minutes
  intensity: 'low' | 'medium' | 'high',
  bodyWeight: number = 70 // kg
): number {
  // MET (Metabolic Equivalent of Task) values
  const metValues = {
    low: 3.5, // Light exercise
    medium: 6.0, // Moderate exercise
    high: 8.5, // Vigorous exercise
  };

  const met = metValues[intensity];
  const caloriesPerMinute = (met * 3.5 * bodyWeight) / 200;

  return Math.round(caloriesPerMinute * duration);
}

// Helper function
function average(numbers: number[]): number {
  if (numbers.length === 0) return 0;
  return numbers.reduce((sum, n) => sum + n, 0) / numbers.length;
}

/**
 * Sample data for testing
 */
export const sampleWorkoutLogs: WorkoutLog[] = [
  {
    id: '1',
    date: new Date(),
    workoutName: 'Full Body Strength',
    duration: 45,
    caloriesBurned: 350,
    exercises: [
      {
        exerciseName: 'Squats',
        sets: [
          { reps: 10, weight: 60, completed: true },
          { reps: 10, weight: 60, completed: true },
          { reps: 8, weight: 60, completed: true },
        ],
      },
    ],
  },
];
