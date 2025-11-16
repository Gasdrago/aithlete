
import { exerciseDatabase, Exercise } from '@/components/ExerciseLibrary';

export interface WorkoutPlan {
  name: string;
  exercises: WorkoutExercise[];
  duration: string;
  difficulty: string;
  goal: string;
}

export interface WorkoutExercise {
  name: string;
  sets: number;
  reps: string;
  rest: string;
  exercise?: Exercise;
}

export interface WorkoutGeneratorInput {
  goal: string;
  experience: string;
  equipment: string;
  daysPerWeek?: number;
}

/**
 * Generate a personalized workout plan based on user input
 * This is a placeholder implementation - in production, this would call an AI API
 */
export function generateWorkoutPlan(input: WorkoutGeneratorInput): WorkoutPlan {
  const { goal, experience, equipment } = input;
  
  // Filter exercises based on available equipment
  const availableExercises = exerciseDatabase.filter(exercise => {
    const equipmentList = equipment.toLowerCase().split(',').map(e => e.trim());
    return exercise.equipment.some(eq => 
      equipmentList.includes(eq.toLowerCase()) || 
      equipmentList.includes('all') ||
      eq.toLowerCase() === 'bodyweight'
    );
  });

  // Determine sets, reps, and rest based on experience level
  const getSetsRepsRest = (exerciseDifficulty: string) => {
    if (experience === 'Beginner') {
      return { sets: 3, reps: '10-12', rest: '60s' };
    } else if (experience === 'Intermediate') {
      return { sets: 4, reps: '8-10', rest: '90s' };
    } else {
      return { sets: 5, reps: '6-8', rest: '120s' };
    }
  };

  // Select exercises based on goal
  let selectedExercises: Exercise[] = [];
  
  if (goal.toLowerCase().includes('muscle')) {
    // Focus on compound movements
    selectedExercises = availableExercises
      .filter(e => ['Legs', 'Chest', 'Back', 'Shoulders'].includes(e.category))
      .slice(0, 6);
  } else if (goal.toLowerCase().includes('fat') || goal.toLowerCase().includes('loss')) {
    // Mix of compound and cardio-focused
    selectedExercises = availableExercises
      .filter(e => e.equipment.includes('Bodyweight') || e.category === 'Legs')
      .slice(0, 6);
  } else if (goal.toLowerCase().includes('endurance')) {
    // Higher rep, lower rest exercises
    selectedExercises = availableExercises
      .filter(e => e.equipment.includes('Bodyweight'))
      .slice(0, 6);
  } else {
    // General fitness - balanced approach
    selectedExercises = availableExercises.slice(0, 6);
  }

  // Build workout exercises
  const workoutExercises: WorkoutExercise[] = selectedExercises.map(exercise => {
    const { sets, reps, rest } = getSetsRepsRest(exercise.difficulty);
    return {
      name: exercise.name,
      sets,
      reps,
      rest,
      exercise,
    };
  });

  // Calculate estimated duration
  const totalSets = workoutExercises.reduce((sum, ex) => sum + ex.sets, 0);
  const estimatedMinutes = totalSets * 3; // Rough estimate: 3 minutes per set

  return {
    name: getWorkoutName(goal),
    exercises: workoutExercises,
    duration: `${estimatedMinutes} minutes`,
    difficulty: experience,
    goal,
  };
}

function getWorkoutName(goal: string): string {
  if (goal.toLowerCase().includes('muscle')) {
    return 'Muscle Building Program';
  } else if (goal.toLowerCase().includes('fat') || goal.toLowerCase().includes('loss')) {
    return 'Fat Loss Circuit';
  } else if (goal.toLowerCase().includes('endurance')) {
    return 'Endurance Training';
  } else {
    return 'Full Body Workout';
  }
}

/**
 * Sample workout plans for different goals
 */
export const sampleWorkoutPlans: Record<string, WorkoutPlan> = {
  beginner: {
    name: 'Beginner Full Body',
    difficulty: 'Beginner',
    duration: '30 minutes',
    goal: 'General Fitness',
    exercises: [
      { name: 'Push-ups', sets: 3, reps: '8-10', rest: '60s' },
      { name: 'Bodyweight Squats', sets: 3, reps: '12-15', rest: '60s' },
      { name: 'Plank', sets: 3, reps: '30s', rest: '45s' },
      { name: 'Lunges', sets: 3, reps: '10 each leg', rest: '60s' },
    ],
  },
  intermediate: {
    name: 'Intermediate Strength',
    difficulty: 'Intermediate',
    duration: '45 minutes',
    goal: 'Muscle Gain',
    exercises: [
      { name: 'Barbell Squats', sets: 4, reps: '8-10', rest: '90s' },
      { name: 'Bench Press', sets: 4, reps: '8-10', rest: '90s' },
      { name: 'Deadlifts', sets: 3, reps: '6-8', rest: '120s' },
      { name: 'Pull-ups', sets: 3, reps: '8-12', rest: '60s' },
      { name: 'Overhead Press', sets: 3, reps: '8-10', rest: '90s' },
    ],
  },
  advanced: {
    name: 'Advanced Hypertrophy',
    difficulty: 'Advanced',
    duration: '60 minutes',
    goal: 'Muscle Gain',
    exercises: [
      { name: 'Barbell Squats', sets: 5, reps: '6-8', rest: '120s' },
      { name: 'Bench Press', sets: 5, reps: '6-8', rest: '120s' },
      { name: 'Deadlifts', sets: 4, reps: '5-6', rest: '180s' },
      { name: 'Pull-ups', sets: 4, reps: '8-10', rest: '90s' },
      { name: 'Overhead Press', sets: 4, reps: '6-8', rest: '120s' },
      { name: 'Barbell Rows', sets: 4, reps: '8-10', rest: '90s' },
    ],
  },
};
