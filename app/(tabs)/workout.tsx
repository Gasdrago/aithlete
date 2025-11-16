
import React, { useState } from "react";
import { ScrollView, StyleSheet, View, Text, TouchableOpacity, TextInput, Platform } from "react-native";
import { useTheme } from "@react-navigation/native";
import { colors, commonStyles } from "@/styles/commonStyles";
import { IconSymbol } from "@/components/IconSymbol";
import { BlurView } from "expo-blur";
import { generateWorkoutPlan, WorkoutPlan } from "@/utils/workoutGenerator";
import { TAB_BAR_HEIGHT } from "@/components/FloatingTabBar";

interface WorkoutCardProps {
  title: string;
  description: string;
  duration: string;
  difficulty: string;
  icon: string;
  iosIcon: string;
  onPress: () => void;
}

const WorkoutCard: React.FC<WorkoutCardProps> = ({ 
  title, 
  description, 
  duration, 
  difficulty, 
  icon, 
  iosIcon, 
  onPress 
}) => {
  return (
    <TouchableOpacity onPress={onPress} style={styles.workoutCard} activeOpacity={0.8}>
      <BlurView intensity={25} tint="dark" style={styles.cardBlur}>
        <View style={styles.cardTopBorder} />
        <View style={styles.cardBottomBorder} />
        
        <View style={styles.workoutCardContent}>
          <View style={styles.workoutIconContainer}>
            <View style={styles.iconGlow} />
            <IconSymbol 
              ios_icon_name={iosIcon}
              android_material_icon_name={icon as any}
              size={32} 
              color="#FFFFFF" 
            />
          </View>
          
          <View style={styles.workoutInfo}>
            <Text style={styles.workoutTitle}>{title}</Text>
            <Text style={styles.workoutDescription}>{description}</Text>
            
            <View style={styles.workoutMeta}>
              <View style={styles.metaBadge}>
                <IconSymbol 
                  ios_icon_name="clock"
                  android_material_icon_name="schedule"
                  size={14} 
                  color={colors.textSecondary} 
                />
                <Text style={styles.metaText}>{duration}</Text>
              </View>
              <View style={styles.metaBadge}>
                <IconSymbol 
                  ios_icon_name="flame"
                  android_material_icon_name="local_fire_department"
                  size={14} 
                  color={colors.textSecondary} 
                />
                <Text style={styles.metaText}>{difficulty}</Text>
              </View>
            </View>
          </View>
        </View>
      </BlurView>
    </TouchableOpacity>
  );
};

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

  // Sample workout data
  const aiRecommended = [
    {
      title: "Full Body Strength",
      description: "Build overall muscle and power",
      duration: "45 min",
      difficulty: "Intermediate",
      icon: "fitness_center",
      iosIcon: "figure.strengthtraining.traditional",
    },
    {
      title: "Core Conditioning",
      description: "Strengthen your core muscles",
      duration: "30 min",
      difficulty: "Beginner",
      icon: "self_improvement",
      iosIcon: "figure.core.training",
    },
  ];

  const todayWorkout = [
    {
      title: "Upper Body Focus",
      description: "Chest, shoulders, and arms",
      duration: "50 min",
      difficulty: "Advanced",
      icon: "fitness_center",
      iosIcon: "figure.arms.open",
    },
  ];

  const allWorkouts = [
    {
      title: "Leg Day Power",
      description: "Quads, hamstrings, and glutes",
      duration: "55 min",
      difficulty: "Advanced",
      icon: "directions_run",
      iosIcon: "figure.run",
    },
    {
      title: "Cardio Blast",
      description: "High-intensity interval training",
      duration: "35 min",
      difficulty: "Intermediate",
      icon: "favorite",
      iosIcon: "heart.fill",
    },
    {
      title: "Flexibility & Mobility",
      description: "Improve range of motion",
      duration: "25 min",
      difficulty: "Beginner",
      icon: "self_improvement",
      iosIcon: "figure.flexibility",
    },
  ];

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <ScrollView 
        contentContainerStyle={[
          styles.scrollContent,
          { paddingBottom: TAB_BAR_HEIGHT + 20 }
        ]}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <Text style={styles.title}>Workout</Text>
          <Text style={styles.subtitle}>Train like a Greek god</Text>
        </View>

        {/* AI Recommended Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <View style={styles.sectionDivider} />
            <Text style={styles.sectionTitle}>AI Recommended</Text>
            <View style={styles.sectionDivider} />
          </View>
          
          {aiRecommended.map((workout, index) => (
            <React.Fragment key={index}>
              <WorkoutCard
                title={workout.title}
                description={workout.description}
                duration={workout.duration}
                difficulty={workout.difficulty}
                icon={workout.icon}
                iosIcon={workout.iosIcon}
                onPress={() => console.log('Workout pressed:', workout.title)}
              />
            </React.Fragment>
          ))}
        </View>

        {/* Today's Workout Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <View style={styles.sectionDivider} />
            <Text style={styles.sectionTitle}>Today&apos;s Workout</Text>
            <View style={styles.sectionDivider} />
          </View>
          
          {todayWorkout.map((workout, index) => (
            <React.Fragment key={index}>
              <WorkoutCard
                title={workout.title}
                description={workout.description}
                duration={workout.duration}
                difficulty={workout.difficulty}
                icon={workout.icon}
                iosIcon={workout.iosIcon}
                onPress={() => console.log('Workout pressed:', workout.title)}
              />
            </React.Fragment>
          ))}
        </View>

        {/* All Workouts Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <View style={styles.sectionDivider} />
            <Text style={styles.sectionTitle}>All Workouts</Text>
            <View style={styles.sectionDivider} />
          </View>
          
          {allWorkouts.map((workout, index) => (
            <React.Fragment key={index}>
              <WorkoutCard
                title={workout.title}
                description={workout.description}
                duration={workout.duration}
                difficulty={workout.difficulty}
                icon={workout.icon}
                iosIcon={workout.iosIcon}
                onPress={() => console.log('Workout pressed:', workout.title)}
              />
            </React.Fragment>
          ))}
        </View>

        {/* AI Generator Section */}
        <View style={styles.generatorSection}>
          <View style={styles.sectionHeader}>
            <View style={styles.sectionDivider} />
            <Text style={styles.sectionTitle}>AI Generator</Text>
            <View style={styles.sectionDivider} />
          </View>

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
                {isGenerating ? "Generating..." : "Generate Custom Plan"}
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
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    paddingTop: Platform.OS === 'android' ? 60 : 80,
    paddingHorizontal: 20,
  },
  header: {
    marginBottom: 32,
    alignItems: 'center',
  },
  title: {
    fontSize: 42,
    fontWeight: '700',
    color: colors.text,
    fontFamily: 'PlayfairDisplay_700Bold',
    letterSpacing: 4,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: colors.textSecondary,
    fontFamily: 'Inter_400Regular',
    letterSpacing: 2,
    textTransform: 'uppercase',
  },
  section: {
    marginBottom: 32,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  sectionDivider: {
    flex: 1,
    height: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    fontFamily: 'PlayfairDisplay_600SemiBold',
    marginHorizontal: 16,
    letterSpacing: 2,
    textTransform: 'uppercase',
  },
  workoutCard: {
    marginBottom: 16,
    borderRadius: 20,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.15)',
    ...Platform.select({
      ios: {
        shadowColor: '#FFFFFF',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 10,
      },
      android: {
        elevation: 5,
      },
      web: {
        boxShadow: '0 4px 20px rgba(255, 255, 255, 0.1)',
      },
    }),
  },
  cardBlur: {
    overflow: 'hidden',
    borderRadius: 20,
  },
  cardTopBorder: {
    position: 'absolute',
    top: 0,
    left: 20,
    right: 20,
    height: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    zIndex: 1,
  },
  cardBottomBorder: {
    position: 'absolute',
    bottom: 0,
    left: 20,
    right: 20,
    height: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    zIndex: 1,
  },
  workoutCardContent: {
    flexDirection: 'row',
    padding: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.02)',
    alignItems: 'center',
  },
  workoutIconContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
    position: 'relative',
  },
  iconGlow: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: 30,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    ...Platform.select({
      ios: {
        shadowColor: '#FFFFFF',
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.3,
        shadowRadius: 10,
      },
      web: {
        boxShadow: '0 0 20px rgba(255, 255, 255, 0.3)',
      },
    }),
  },
  workoutInfo: {
    flex: 1,
  },
  workoutTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
    fontFamily: 'PlayfairDisplay_600SemiBold',
    marginBottom: 6,
    letterSpacing: 0.5,
  },
  workoutDescription: {
    fontSize: 14,
    color: colors.textSecondary,
    fontFamily: 'Inter_400Regular',
    marginBottom: 12,
    lineHeight: 20,
  },
  workoutMeta: {
    flexDirection: 'row',
    gap: 12,
  },
  metaBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  metaText: {
    fontSize: 12,
    color: colors.textSecondary,
    fontFamily: 'Inter_400Regular',
  },
  generatorSection: {
    marginBottom: 32,
  },
  inputSection: {
    marginBottom: 24,
  },
  inputContainer: {
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 12,
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
    fontSize: 15,
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
    fontSize: 13,
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
    fontSize: 15,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  workoutPlanSection: {
    marginTop: 24,
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
    fontSize: 22,
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
