
import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { colors } from '@/styles/commonStyles';
import { IconSymbol } from './IconSymbol';

export interface Exercise {
  id: string;
  name: string;
  category: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  equipment: string[];
  muscleGroups: string[];
  description: string;
}

export const exerciseDatabase: Exercise[] = [
  {
    id: '1',
    name: 'Barbell Squat',
    category: 'Legs',
    difficulty: 'Intermediate',
    equipment: ['Barbell', 'Squat Rack'],
    muscleGroups: ['Quadriceps', 'Glutes', 'Hamstrings'],
    description: 'Compound lower body exercise targeting legs and core',
  },
  {
    id: '2',
    name: 'Bench Press',
    category: 'Chest',
    difficulty: 'Intermediate',
    equipment: ['Barbell', 'Bench'],
    muscleGroups: ['Chest', 'Triceps', 'Shoulders'],
    description: 'Primary chest exercise for building upper body strength',
  },
  {
    id: '3',
    name: 'Deadlift',
    category: 'Back',
    difficulty: 'Advanced',
    equipment: ['Barbell'],
    muscleGroups: ['Back', 'Glutes', 'Hamstrings', 'Core'],
    description: 'Full body compound movement for overall strength',
  },
  {
    id: '4',
    name: 'Pull-ups',
    category: 'Back',
    difficulty: 'Intermediate',
    equipment: ['Pull-up Bar'],
    muscleGroups: ['Lats', 'Biceps', 'Core'],
    description: 'Bodyweight exercise for back and arm development',
  },
  {
    id: '5',
    name: 'Overhead Press',
    category: 'Shoulders',
    difficulty: 'Intermediate',
    equipment: ['Barbell'],
    muscleGroups: ['Shoulders', 'Triceps', 'Core'],
    description: 'Vertical pressing movement for shoulder strength',
  },
  {
    id: '6',
    name: 'Push-ups',
    category: 'Chest',
    difficulty: 'Beginner',
    equipment: ['Bodyweight'],
    muscleGroups: ['Chest', 'Triceps', 'Shoulders', 'Core'],
    description: 'Classic bodyweight exercise for upper body',
  },
  {
    id: '7',
    name: 'Plank',
    category: 'Core',
    difficulty: 'Beginner',
    equipment: ['Bodyweight'],
    muscleGroups: ['Core', 'Shoulders'],
    description: 'Isometric core strengthening exercise',
  },
  {
    id: '8',
    name: 'Lunges',
    category: 'Legs',
    difficulty: 'Beginner',
    equipment: ['Bodyweight', 'Dumbbells'],
    muscleGroups: ['Quadriceps', 'Glutes', 'Hamstrings'],
    description: 'Unilateral leg exercise for balance and strength',
  },
];

interface ExerciseCardProps {
  exercise: Exercise;
  onPress?: () => void;
}

export const ExerciseCard: React.FC<ExerciseCardProps> = ({ exercise, onPress }) => {
  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Beginner':
        return colors.accent;
      case 'Intermediate':
        return colors.secondary;
      case 'Advanced':
        return colors.text;
      default:
        return colors.textSecondary;
    }
  };

  return (
    <TouchableOpacity 
      style={styles.exerciseCard} 
      onPress={onPress}
      activeOpacity={0.7}
    >
      <View style={styles.exerciseHeader}>
        <View style={styles.exerciseIconContainer}>
          <IconSymbol
            ios_icon_name="figure.strengthtraining.traditional"
            android_material_icon_name="fitness_center"
            size={24}
            color={colors.text}
          />
        </View>
        <View style={styles.exerciseInfo}>
          <Text style={styles.exerciseName}>{exercise.name}</Text>
          <Text style={styles.exerciseCategory}>{exercise.category}</Text>
        </View>
        <View style={[styles.difficultyBadge, { borderColor: getDifficultyColor(exercise.difficulty) }]}>
          <Text style={[styles.difficultyText, { color: getDifficultyColor(exercise.difficulty) }]}>
            {exercise.difficulty}
          </Text>
        </View>
      </View>
      
      <Text style={styles.exerciseDescription}>{exercise.description}</Text>
      
      <View style={styles.exerciseMeta}>
        <View style={styles.metaItem}>
          <IconSymbol
            ios_icon_name="dumbbell"
            android_material_icon_name="fitness_center"
            size={14}
            color={colors.textSecondary}
          />
          <Text style={styles.metaText}>{exercise.equipment.join(', ')}</Text>
        </View>
        <View style={styles.metaItem}>
          <IconSymbol
            ios_icon_name="figure.arms.open"
            android_material_icon_name="accessibility_new"
            size={14}
            color={colors.textSecondary}
          />
          <Text style={styles.metaText}>{exercise.muscleGroups.join(', ')}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  exerciseCard: {
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  exerciseHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  exerciseIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.highlight,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  exerciseInfo: {
    flex: 1,
  },
  exerciseName: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    fontFamily: 'Inter_600SemiBold',
    marginBottom: 2,
  },
  exerciseCategory: {
    fontSize: 12,
    color: colors.textSecondary,
    fontFamily: 'Inter_400Regular',
  },
  difficultyBadge: {
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  difficultyText: {
    fontSize: 10,
    fontFamily: 'Inter_600SemiBold',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  exerciseDescription: {
    fontSize: 14,
    color: colors.textSecondary,
    fontFamily: 'Inter_400Regular',
    lineHeight: 20,
    marginBottom: 12,
  },
  exerciseMeta: {
    gap: 8,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  metaText: {
    fontSize: 12,
    color: colors.textSecondary,
    fontFamily: 'Inter_400Regular',
  },
});
