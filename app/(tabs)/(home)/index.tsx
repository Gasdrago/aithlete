
import React from "react";
import { ScrollView, StyleSheet, View, Text, TouchableOpacity, Dimensions, Platform } from "react-native";
import { useTheme } from "@react-navigation/native";
import { colors } from "@/styles/commonStyles";
import { IconSymbol } from "@/components/IconSymbol";
import { BlurView } from "expo-blur";
import { router } from "expo-router";

const { width } = Dimensions.get('window');

interface FeatureCardProps {
  title: string;
  description: string;
  icon: string;
  iosIcon: string;
  onPress: () => void;
}

const FeatureCard: React.FC<FeatureCardProps> = ({ title, description, icon, iosIcon, onPress }) => {
  return (
    <TouchableOpacity onPress={onPress} style={styles.featureCard} activeOpacity={0.8}>
      <BlurView intensity={30} tint="dark" style={styles.blurContainer}>
        {/* Greek-inspired engraved borders */}
        <View style={styles.cardTopBorder} />
        <View style={styles.cardBottomBorder} />
        
        <View style={styles.cardContent}>
          <View style={styles.iconContainer}>
            <View style={styles.iconGlow} />
            <IconSymbol 
              ios_icon_name={iosIcon}
              android_material_icon_name={icon}
              size={40} 
              color="#FFFFFF" 
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
      iosIcon: "figure.strengthtraining.traditional",
      route: "/(tabs)/workout"
    },
    {
      title: "AI Posture Check",
      description: "Real-time form analysis with camera",
      icon: "accessibility_new",
      iosIcon: "figure.walk",
      route: "/(tabs)/posture"
    },
    {
      title: "AI Body Projection",
      description: "See your future physique in 3, 6, 12 months",
      icon: "visibility",
      iosIcon: "eye.fill",
      route: "/(tabs)/projection"
    },
    {
      title: "Progress Dashboard",
      description: "Track your fitness journey and metrics",
      icon: "trending_up",
      iosIcon: "chart.line.uptrend.xyaxis",
      route: "/(tabs)/progress"
    },
  ];

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <ScrollView 
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Hero Section with Greek Styling */}
        <View style={styles.heroSection}>
          <Text style={styles.appTitle}>AITHLETE</Text>
          <View style={styles.laurelDivider}>
            <View style={styles.laurelLine} />
            <Text style={styles.laurelSymbol}>❖</Text>
            <View style={styles.laurelLine} />
          </View>
          <Text style={styles.tagline}>Your Divine Fitness Companion</Text>
        </View>

        {/* Stats Overview with Liquid Glass */}
        <View style={styles.statsContainer}>
          <View style={styles.statCard}>
            <BlurView intensity={20} tint="dark" style={styles.statBlur}>
              <View style={styles.statContent}>
                <Text style={styles.statValue}>0</Text>
                <Text style={styles.statLabel}>Workouts</Text>
              </View>
            </BlurView>
          </View>
          <View style={styles.statCard}>
            <BlurView intensity={20} tint="dark" style={styles.statBlur}>
              <View style={styles.statContent}>
                <Text style={styles.statValue}>0</Text>
                <Text style={styles.statLabel}>Days Active</Text>
              </View>
            </BlurView>
          </View>
          <View style={styles.statCard}>
            <BlurView intensity={20} tint="dark" style={styles.statBlur}>
              <View style={styles.statContent}>
                <Text style={styles.statValue}>0</Text>
                <Text style={styles.statLabel}>Calories</Text>
              </View>
            </BlurView>
          </View>
        </View>

        {/* Feature Cards Section */}
        <View style={styles.featuresSection}>
          <View style={styles.sectionHeader}>
            <View style={styles.sectionDivider} />
            <Text style={styles.sectionTitle}>Features</Text>
            <View style={styles.sectionDivider} />
          </View>
          {features.map((feature, index) => (
            <React.Fragment key={index}>
              <FeatureCard
                title={feature.title}
                description={feature.description}
                icon={feature.icon}
                iosIcon={feature.iosIcon}
                onPress={() => router.push(feature.route as any)}
              />
            </React.Fragment>
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
    paddingTop: Platform.OS === 'android' ? 60 : 80,
    paddingHorizontal: 20,
  },
  heroSection: {
    alignItems: 'center',
    marginBottom: 40,
  },
  appTitle: {
    fontSize: 52,
    fontWeight: '700',
    color: colors.text,
    fontFamily: 'PlayfairDisplay_700Bold',
    letterSpacing: 8,
    marginBottom: 16,
    textShadowColor: 'rgba(255, 255, 255, 0.3)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 8,
  },
  laurelDivider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  laurelLine: {
    width: 40,
    height: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.4)',
  },
  laurelSymbol: {
    fontSize: 16,
    color: colors.text,
    marginHorizontal: 12,
  },
  tagline: {
    fontSize: 14,
    color: colors.textSecondary,
    fontFamily: 'Inter_400Regular',
    letterSpacing: 3,
    textTransform: 'uppercase',
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 40,
    gap: 12,
  },
  statCard: {
    flex: 1,
    borderRadius: 20,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.15)',
    ...Platform.select({
      ios: {
        shadowColor: '#FFFFFF',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
      },
      android: {
        elevation: 4,
      },
      web: {
        boxShadow: '0 4px 16px rgba(255, 255, 255, 0.1)',
      },
    }),
  },
  statBlur: {
    padding: 16,
  },
  statContent: {
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.03)',
    borderRadius: 16,
    padding: 12,
  },
  statValue: {
    fontSize: 32,
    fontWeight: '700',
    color: colors.text,
    fontFamily: 'Inter_700Bold',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 11,
    color: colors.textSecondary,
    fontFamily: 'Inter_400Regular',
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  featuresSection: {
    marginBottom: 32,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
  },
  sectionDivider: {
    flex: 1,
    height: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: colors.text,
    fontFamily: 'PlayfairDisplay_600SemiBold',
    marginHorizontal: 16,
    letterSpacing: 2,
    textTransform: 'uppercase',
  },
  featureCard: {
    marginBottom: 20,
    borderRadius: 24,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.15)',
    ...Platform.select({
      ios: {
        shadowColor: '#FFFFFF',
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.12,
        shadowRadius: 12,
      },
      android: {
        elevation: 6,
      },
      web: {
        boxShadow: '0 6px 24px rgba(255, 255, 255, 0.12)',
      },
    }),
  },
  blurContainer: {
    overflow: 'hidden',
    borderRadius: 24,
  },
  cardTopBorder: {
    position: 'absolute',
    top: 0,
    left: 24,
    right: 24,
    height: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    zIndex: 1,
  },
  cardBottomBorder: {
    position: 'absolute',
    bottom: 0,
    left: 24,
    right: 24,
    height: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    zIndex: 1,
  },
  cardContent: {
    padding: 28,
    backgroundColor: 'rgba(255, 255, 255, 0.02)',
  },
  iconContainer: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
    position: 'relative',
  },
  iconGlow: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: 36,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    ...Platform.select({
      ios: {
        shadowColor: '#FFFFFF',
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.4,
        shadowRadius: 12,
      },
      web: {
        boxShadow: '0 0 24px rgba(255, 255, 255, 0.4)',
      },
    }),
  },
  cardTitle: {
    fontSize: 22,
    fontWeight: '600',
    color: colors.text,
    fontFamily: 'PlayfairDisplay_600SemiBold',
    marginBottom: 10,
    letterSpacing: 1,
  },
  cardDescription: {
    fontSize: 15,
    color: colors.textSecondary,
    fontFamily: 'Inter_400Regular',
    lineHeight: 22,
  },
});
