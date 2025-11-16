
import React, { useState } from "react";
import { ScrollView, StyleSheet, View, Text, TouchableOpacity, TextInput } from "react-native";
import { useTheme } from "@react-navigation/native";
import { colors, commonStyles } from "@/styles/commonStyles";
import { IconSymbol } from "@/components/IconSymbol";
import { BlurView } from "expo-blur";
import { generateWorkoutPlan, WorkoutPlan } from "@/utils/workoutGenerator";

export default function WorkoutScreen() {
  const theme = useTheme();
  const [goal, setGoal] = useState("");
  const [experience, setExperience] = useState("");
  const [equipment, setEquipment] = useState("");
  const [workoutPlan, setWorkoutPlan] = useState<WorkoutPlan | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  const generateWorkout = () => {
    setIsGenerating(true);
    
    // Simulate AI generation with placeholder data
    setTimeout(() => {
      const generatedPlan = generateWorkoutPlan({
        goal: goal || 'General Fitness',
        experience: experience || 'Intermediate',
        equipment: equipment || 'Bodyweight',
      });
      setWorkoutPlan(generatedPlan);
      setIsGenerating(false);
    }, 2000);
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <ScrollView 
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <Text style={styles.title}>AI Workout Generator</Text>
          <Text style={styles.subtitle}>Personalized training plans powered by AI</Text>
        </View>

        {/* Input Section */}
        <View style={styles.inputSection}>
          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Fitness Goal</Text>
            <TextInput
              style={styles.input}
              placeholder="e.g., Muscle gain, Fat loss, Endurance"
              placeholderTextColor={colors.textSecondary}
              value={goal}
              onChangeText={setGoal}
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Experience Level</Text>
            <View style={styles.buttonGroup}>
              {["Beginner", "Intermediate", "Advanced"].map((level) => (
                <TouchableOpacity
                  key={level}
                  style={[
                    styles.optionButton,
                    experience === level && styles.optionButtonActive,
                  ]}
                  onPress={() => setExperience(level)}
                >
                  <Text
                    style={[
                      styles.optionButtonText,
                      experience === level && styles.optionButtonTextActive,
                    ]}
                  >
                    {level}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Available Equipment</Text>
            <TextInput
              style={styles.input}
              placeholder="e.g., Dumbbells, Barbell, Bodyweight"
              placeholderTextColor={colors.textSecondary}
              value={equipment}
              onChangeText={setEquipment}
            />
          </View>

          <TouchableOpacity
            style={styles.generateButton}
            onPress={generateWorkout}
            disabled={isGenerating}
          >
            <Text style={styles.generateButtonText}>
              {isGenerating ? "Generating..." : "Generate Workout Plan"}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Workout Plan Display */}
        {workoutPlan && (
          <View style={styles.workoutPlanSection}>
            <View style={styles.planHeader}>
              <Text style={styles.planTitle}>{workoutPlan.name}</Text>
              <View style={styles.planMeta}>
                <Text style={styles.planMetaText}>⏱ {workoutPlan.duration}</Text>
                <Text style={styles.planMetaText}>💪 {workoutPlan.difficulty}</Text>
              </View>
            </View>

            {workoutPlan.exercises.map((exercise, index) => (
              <View key={index} style={styles.exerciseCard}>
                <View style={styles.exerciseHeader}>
                  <Text style={styles.exerciseName}>{exercise.name}</Text>
                  <IconSymbol
                    ios_icon_name="checkmark.circle"
                    android_material_icon_name="check_circle"
                    size={24}
                    color={colors.textSecondary}
                  />
                </View>
                <View style={styles.exerciseDetails}>
                  <Text style={styles.exerciseDetail}>{exercise.sets} sets</Text>
                  <Text style={styles.exerciseDetail}>{exercise.reps} reps</Text>
                  <Text style={styles.exerciseDetail}>{exercise.rest} rest</Text>
                </View>
              </View>
            ))}
          </View>
        )}

        <View style={{ height: 120 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    paddingTop: 60,
    paddingHorizontal: 20,
  },
  header: {
    marginBottom: 32,
  },
  title: {
    fontSize: 32,
    fontWeight: '700',
    color: colors.text,
    fontFamily: 'PlayfairDisplay_700Bold',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: colors.textSecondary,
    fontFamily: 'Inter_400Regular',
  },
  inputSection: {
    marginBottom: 32,
  },
  inputContainer: {
    marginBottom: 24,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
    fontFamily: 'Inter_600SemiBold',
    marginBottom: 8,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  input: {
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 12,
    padding: 16,
    color: colors.text,
    fontFamily: 'Inter_400Regular',
    fontSize: 16,
  },
  buttonGroup: {
    flexDirection: 'row',
    gap: 8,
  },
  optionButton: {
    flex: 1,
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 12,
    padding: 12,
    alignItems: 'center',
  },
  optionButtonActive: {
    backgroundColor: colors.text,
    borderColor: colors.text,
  },
  optionButtonText: {
    color: colors.text,
    fontFamily: 'Inter_500Medium',
    fontSize: 14,
  },
  optionButtonTextActive: {
    color: colors.background,
  },
  generateButton: {
    backgroundColor: colors.text,
    borderRadius: 12,
    padding: 18,
    alignItems: 'center',
    marginTop: 8,
  },
  generateButtonText: {
    color: colors.background,
    fontFamily: 'Inter_600SemiBold',
    fontSize: 16,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  workoutPlanSection: {
    marginBottom: 32,
  },
  planHeader: {
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
  },
  planTitle: {
    fontSize: 24,
    fontWeight: '600',
    color: colors.text,
    fontFamily: 'PlayfairDisplay_600SemiBold',
    marginBottom: 12,
  },
  planMeta: {
    flexDirection: 'row',
    gap: 16,
  },
  planMetaText: {
    fontSize: 14,
    color: colors.textSecondary,
    fontFamily: 'Inter_400Regular',
  },
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
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  exerciseName: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    fontFamily: 'Inter_600SemiBold',
  },
  exerciseDetails: {
    flexDirection: 'row',
    gap: 16,
  },
  exerciseDetail: {
    fontSize: 14,
    color: colors.textSecondary,
    fontFamily: 'Inter_400Regular',
  },
});
