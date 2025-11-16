
import React from "react";
import { ScrollView, StyleSheet, View, Text, TouchableOpacity, Dimensions } from "react-native";
import { useTheme } from "@react-navigation/native";
import { colors, commonStyles } from "@/styles/commonStyles";
import { IconSymbol } from "@/components/IconSymbol";
import { LinearGradient } from "expo-linear-gradient";
import { BlurView } from "expo-blur";
import { router } from "expo-router";

const { width } = Dimensions.get('window');

interface FeatureCardProps {
  title: string;
  description: string;
  icon: string;
  onPress: () => void;
}

const FeatureCard: React.FC<FeatureCardProps> = ({ title, description, icon, onPress }) => {
  return (
    <TouchableOpacity onPress={onPress} style={styles.featureCard} activeOpacity={0.8}>
      <BlurView intensity={20} tint="dark" style={styles.blurContainer}>
        <View style={styles.cardContent}>
          <View style={styles.iconContainer}>
            <IconSymbol 
              ios_icon_name="figure.strengthtraining.traditional" 
              android_material_icon_name={icon}
              size={48} 
              color={colors.text} 
            />
          </View>
          <Text style={styles.cardTitle}>{title}</Text>
          <Text style={styles.cardDescription}>{description}</Text>
        </View>
      </BlurView>
    </TouchableOpacity>
  );
};

export default function HomeScreen() {
  const theme = useTheme();

  const features = [
    {
      title: "AI Workout Generator",
      description: "Get personalized workout plans powered by AI",
      icon: "fitness_center",
      route: "/(tabs)/workout"
    },
    {
      title: "Posture Check",
      description: "Real-time form analysis with camera",
      icon: "accessibility_new",
      route: "/(tabs)/posture"
    },
    {
      title: "Body Projection",
      description: "See your future physique in 3, 6, 12 months",
      icon: "photo_camera",
      route: "/body-projection"
    },
    {
      title: "Progress Tracking",
      description: "Track your fitness journey and metrics",
      icon: "trending_up",
      route: "/(tabs)/progress"
    },
  ];

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <ScrollView 
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Hero Section */}
        <View style={styles.heroSection}>
          <Text style={styles.appTitle}>AITHLETE</Text>
          <Text style={styles.tagline}>Your Divine Fitness Companion</Text>
          <View style={styles.divider} />
        </View>

        {/* Stats Overview */}
        <View style={styles.statsContainer}>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>0</Text>
            <Text style={styles.statLabel}>Workouts</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>0</Text>
            <Text style={styles.statLabel}>Days Active</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>0</Text>
            <Text style={styles.statLabel}>Calories</Text>
          </View>
        </View>

        {/* Feature Cards */}
        <View style={styles.featuresSection}>
          <Text style={styles.sectionTitle}>Features</Text>
          {features.map((feature, index) => (
            <FeatureCard
              key={index}
              title={feature.title}
              description={feature.description}
              icon={feature.icon}
              onPress={() => router.push(feature.route as any)}
            />
          ))}
        </View>

        {/* Bottom Padding for Tab Bar */}
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
  heroSection: {
    alignItems: 'center',
    marginBottom: 32,
  },
  appTitle: {
    fontSize: 48,
    fontWeight: '700',
    color: colors.text,
    fontFamily: 'PlayfairDisplay_700Bold',
    letterSpacing: 4,
    marginBottom: 8,
  },
  tagline: {
    fontSize: 16,
    color: colors.textSecondary,
    fontFamily: 'Inter_400Regular',
    letterSpacing: 2,
    textTransform: 'uppercase',
  },
  divider: {
    width: 60,
    height: 2,
    backgroundColor: colors.accent,
    marginTop: 16,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 32,
  },
  statCard: {
    flex: 1,
    backgroundColor: colors.card,
    borderRadius: 16,
    padding: 16,
    marginHorizontal: 4,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
  },
  statValue: {
    fontSize: 28,
    fontWeight: '700',
    color: colors.text,
    fontFamily: 'Inter_700Bold',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: colors.textSecondary,
    fontFamily: 'Inter_400Regular',
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  featuresSection: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '600',
    color: colors.text,
    fontFamily: 'PlayfairDisplay_600SemiBold',
    marginBottom: 16,
  },
  featureCard: {
    marginBottom: 16,
    borderRadius: 20,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: colors.border,
  },
  blurContainer: {
    overflow: 'hidden',
    borderRadius: 20,
  },
  cardContent: {
    padding: 24,
    backgroundColor: colors.card,
  },
  iconContainer: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: colors.highlight,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: colors.text,
    fontFamily: 'PlayfairDisplay_600SemiBold',
    marginBottom: 8,
  },
  cardDescription: {
    fontSize: 14,
    color: colors.textSecondary,
    fontFamily: 'Inter_400Regular',
    lineHeight: 20,
  },
});
