
import React, { useState } from "react";
import { ScrollView, StyleSheet, View, Text, TouchableOpacity } from "react-native";
import { useTheme } from "@react-navigation/native";
import { colors } from "@/styles/commonStyles";
import { IconSymbol } from "@/components/IconSymbol";
import { router } from "expo-router";

interface GoalOption {
  id: string;
  title: string;
  description: string;
  icon: string;
}

export default function OnboardingScreen() {
  const theme = useTheme();
  const [selectedGoal, setSelectedGoal] = useState<string | null>(null);
  const [selectedLevel, setSelectedLevel] = useState<string | null>(null);

  const goals: GoalOption[] = [
    {
      id: "muscle",
      title: "Build Muscle",
      description: "Gain strength and muscle mass",
      icon: "fitness_center",
    },
    {
      id: "fat-loss",
      title: "Lose Fat",
      description: "Burn fat and get lean",
      icon: "local_fire_department",
    },
    {
      id: "endurance",
      title: "Improve Endurance",
      description: "Boost stamina and cardio",
      icon: "directions_run",
    },
    {
      id: "general",
      title: "General Fitness",
      description: "Stay healthy and active",
      icon: "favorite",
    },
  ];

  const levels = ["Beginner", "Intermediate", "Advanced"];

  const handleContinue = () => {
    if (selectedGoal && selectedLevel) {
      // In a real app, save these preferences
      router.replace("/(tabs)/(home)/");
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <ScrollView 
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Welcome to</Text>
          <Text style={styles.appTitle}>AITHLETE</Text>
          <Text style={styles.subtitle}>Your Divine Fitness Companion</Text>
          <View style={styles.divider} />
        </View>

        {/* Goal Selection */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>What&apos;s your primary goal?</Text>
          <View style={styles.optionsGrid}>
            {goals.map((goal) => (
              <TouchableOpacity
                key={goal.id}
                style={[
                  styles.goalCard,
                  selectedGoal === goal.id && styles.goalCardSelected,
                ]}
                onPress={() => setSelectedGoal(goal.id)}
                activeOpacity={0.8}
              >
                <View style={styles.goalIconContainer}>
                  <IconSymbol
                    ios_icon_name="figure.strengthtraining.traditional"
                    android_material_icon_name={goal.icon}
                    size={32}
                    color={selectedGoal === goal.id ? colors.background : colors.text}
                  />
                </View>
                <Text
                  style={[
                    styles.goalTitle,
                    selectedGoal === goal.id && styles.goalTitleSelected,
                  ]}
                >
                  {goal.title}
                </Text>
                <Text
                  style={[
                    styles.goalDescription,
                    selectedGoal === goal.id && styles.goalDescriptionSelected,
                  ]}
                >
                  {goal.description}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Experience Level */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>What&apos;s your experience level?</Text>
          <View style={styles.levelButtons}>
            {levels.map((level) => (
              <TouchableOpacity
                key={level}
                style={[
                  styles.levelButton,
                  selectedLevel === level && styles.levelButtonSelected,
                ]}
                onPress={() => setSelectedLevel(level)}
                activeOpacity={0.8}
              >
                <Text
                  style={[
                    styles.levelButtonText,
                    selectedLevel === level && styles.levelButtonTextSelected,
                  ]}
                >
                  {level}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Continue Button */}
        <TouchableOpacity
          style={[
            styles.continueButton,
            (!selectedGoal || !selectedLevel) && styles.continueButtonDisabled,
          ]}
          onPress={handleContinue}
          disabled={!selectedGoal || !selectedLevel}
        >
          <Text style={styles.continueButtonText}>Start Your Journey</Text>
          <IconSymbol
            ios_icon_name="arrow.right"
            android_material_icon_name="arrow_forward"
            size={20}
            color={colors.background}
          />
        </TouchableOpacity>

        <View style={{ height: 40 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    paddingTop: 80,
    paddingHorizontal: 20,
  },
  header: {
    alignItems: 'center',
    marginBottom: 48,
  },
  title: {
    fontSize: 20,
    color: colors.textSecondary,
    fontFamily: 'Inter_400Regular',
    marginBottom: 8,
  },
  appTitle: {
    fontSize: 56,
    fontWeight: '700',
    color: colors.text,
    fontFamily: 'PlayfairDisplay_700Bold',
    letterSpacing: 4,
    marginBottom: 12,
  },
  subtitle: {
    fontSize: 16,
    color: colors.textSecondary,
    fontFamily: 'Inter_400Regular',
    letterSpacing: 2,
    textTransform: 'uppercase',
  },
  divider: {
    width: 80,
    height: 2,
    backgroundColor: colors.accent,
    marginTop: 20,
  },
  section: {
    marginBottom: 40,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: colors.text,
    fontFamily: 'PlayfairDisplay_600SemiBold',
    marginBottom: 20,
    textAlign: 'center',
  },
  optionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  goalCard: {
    width: '48%',
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
  },
  goalCardSelected: {
    backgroundColor: colors.text,
    borderColor: colors.text,
  },
  goalIconContainer: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: colors.highlight,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  goalTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    fontFamily: 'Inter_600SemiBold',
    marginBottom: 4,
    textAlign: 'center',
  },
  goalTitleSelected: {
    color: colors.background,
  },
  goalDescription: {
    fontSize: 12,
    color: colors.textSecondary,
    fontFamily: 'Inter_400Regular',
    textAlign: 'center',
  },
  goalDescriptionSelected: {
    color: colors.background,
    opacity: 0.8,
  },
  levelButtons: {
    gap: 12,
  },
  levelButton: {
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 12,
    padding: 18,
    alignItems: 'center',
  },
  levelButtonSelected: {
    backgroundColor: colors.text,
    borderColor: colors.text,
  },
  levelButtonText: {
    fontSize: 16,
    fontWeight: '500',
    color: colors.text,
    fontFamily: 'Inter_500Medium',
  },
  levelButtonTextSelected: {
    color: colors.background,
  },
  continueButton: {
    backgroundColor: colors.text,
    borderRadius: 12,
    padding: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
  },
  continueButtonDisabled: {
    opacity: 0.3,
  },
  continueButtonText: {
    color: colors.background,
    fontFamily: 'Inter_600SemiBold',
    fontSize: 18,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
});
