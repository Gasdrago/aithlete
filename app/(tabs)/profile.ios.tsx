
import React from "react";
import { ScrollView, StyleSheet, View, Text, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useTheme } from "@react-navigation/native";
import { colors } from "@/styles/commonStyles";
import { IconSymbol } from "@/components/IconSymbol";
import { BlurView } from "expo-blur";
import { TAB_BAR_HEIGHT } from "@/components/FloatingTabBar";

interface SettingItemProps {
  title: string;
  icon: string;
  iosIcon: string;
  onPress?: () => void;
  isLast?: boolean;
}

const SettingItem: React.FC<SettingItemProps> = ({ title, icon, iosIcon, onPress, isLast }) => {
  return (
    <TouchableOpacity 
      style={[styles.settingItem, isLast && styles.settingItemLast]} 
      onPress={onPress} 
      activeOpacity={0.7}
    >
      <View style={styles.settingLeft}>
        <View style={styles.iconContainer}>
          <IconSymbol
            ios_icon_name={iosIcon}
            android_material_icon_name={icon}
            size={22}
            color={colors.text}
          />
        </View>
        <Text style={styles.settingTitle}>{title}</Text>
      </View>
      <IconSymbol
        ios_icon_name="chevron.right"
        android_material_icon_name="chevron-right"
        size={18}
        color={colors.textSecondary}
      />
    </TouchableOpacity>
  );
};

export default function ProfileScreen() {
  const theme = useTheme();

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]} edges={['top']}>
      <ScrollView 
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <Text style={styles.title}>Profile</Text>
          <Text style={styles.subtitle}>Manage your AITHLETE account</Text>
        </View>

        {/* Profile Card with Liquid Glass */}
        <BlurView intensity={20} tint="dark" style={styles.profileCard}>
          <View style={styles.glassOverlay} />
          <View style={styles.topEngravedLine} />
          
          <View style={styles.avatarContainer}>
            <View style={styles.avatarGlow}>
              <IconSymbol
                ios_icon_name="person-circle"
                android_material_icon_name="account-circle"
                size={90}
                color={colors.text}
              />
            </View>
          </View>
          
          <Text style={styles.profileName}>Athlete</Text>
          <Text style={styles.profileEmail}>athlete@aithlete.app</Text>
          
          <View style={styles.bottomEngravedLine} />
        </BlurView>

        {/* Stats Overview with Liquid Glass */}
        <BlurView intensity={20} tint="dark" style={styles.statsSection}>
          <View style={styles.glassOverlay} />
          <View style={styles.statItem}>
            <Text style={styles.statValue}>0</Text>
            <Text style={styles.statLabel}>Workouts</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={styles.statValue}>0</Text>
            <Text style={styles.statLabel}>Days Active</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={styles.statValue}>0</Text>
            <Text style={styles.statLabel}>Achievements</Text>
          </View>
        </BlurView>

        {/* Settings Section */}
        <View style={styles.settingsSection}>
          <Text style={styles.sectionTitle}>Account</Text>
          <BlurView intensity={20} tint="dark" style={styles.settingsCard}>
            <View style={styles.glassOverlay} />
            <SettingItem 
              title="Edit Profile" 
              icon="edit" 
              iosIcon="edit"
            />
            <SettingItem 
              title="Fitness Goals" 
              icon="flag" 
              iosIcon="goals"
            />
            <SettingItem 
              title="Notifications" 
              icon="notifications" 
              iosIcon="notifications"
            />
            <SettingItem 
              title="Privacy" 
              icon="lock" 
              iosIcon="lock"
              isLast
            />
          </BlurView>
        </View>

        {/* App Section */}
        <View style={styles.settingsSection}>
          <Text style={styles.sectionTitle}>Support</Text>
          <BlurView intensity={20} tint="dark" style={styles.settingsCard}>
            <View style={styles.glassOverlay} />
            <SettingItem 
              title="About AITHLETE" 
              icon="info" 
              iosIcon="info"
            />
            <SettingItem 
              title="Help & Support" 
              icon="help" 
              iosIcon="help"
            />
            <SettingItem 
              title="Terms of Service" 
              icon="description" 
              iosIcon="description"
              isLast
            />
          </BlurView>
        </View>

        {/* Logout Section */}
        <View style={styles.settingsSection}>
          <BlurView intensity={20} tint="dark" style={styles.settingsCard}>
            <View style={styles.glassOverlay} />
            <SettingItem 
              title="Logout" 
              icon="exit-to-app" 
              iosIcon="logout"
              isLast
            />
          </BlurView>
        </View>

        {/* Version */}
        <Text style={styles.versionText}>AITHLETE v1.0.0</Text>
        <Text style={styles.versionSubtext}>Powered by AI • Inspired by the Gods</Text>

        <View style={{ height: TAB_BAR_HEIGHT + 20 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    paddingTop: 20,
    paddingHorizontal: 20,
  },
  header: {
    marginBottom: 32,
  },
  title: {
    fontSize: 36,
    fontWeight: '700',
    color: colors.text,
    fontFamily: 'PlayfairDisplay_700Bold',
    letterSpacing: 1,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: colors.textSecondary,
    fontFamily: 'Inter_400Regular',
  },
  profileCard: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 24,
    padding: 32,
    alignItems: 'center',
    marginBottom: 24,
    overflow: 'hidden',
    backgroundColor: 'rgba(255, 255, 255, 0.03)',
  },
  glassOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(255, 255, 255, 0.02)',
  },
  topEngravedLine: {
    position: 'absolute',
    top: 0,
    left: 30,
    right: 30,
    height: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
  },
  bottomEngravedLine: {
    position: 'absolute',
    bottom: 0,
    left: 30,
    right: 30,
    height: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
  },
  avatarContainer: {
    marginBottom: 20,
    marginTop: 8,
  },
  avatarGlow: {
    shadowColor: '#FFFFFF',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 8,
  },
  profileName: {
    fontSize: 28,
    fontWeight: '700',
    color: colors.text,
    fontFamily: 'PlayfairDisplay_700Bold',
    marginBottom: 6,
    letterSpacing: 1,
  },
  profileEmail: {
    fontSize: 14,
    color: colors.textSecondary,
    fontFamily: 'Inter_400Regular',
    marginBottom: 8,
  },
  statsSection: {
    flexDirection: 'row',
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 20,
    padding: 24,
    marginBottom: 32,
    overflow: 'hidden',
    backgroundColor: 'rgba(255, 255, 255, 0.03)',
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statDivider: {
    width: 1,
    backgroundColor: colors.border,
    marginHorizontal: 8,
  },
  statValue: {
    fontSize: 28,
    fontWeight: '700',
    color: colors.text,
    fontFamily: 'Inter_700Bold',
    marginBottom: 6,
  },
  statLabel: {
    fontSize: 11,
    color: colors.textSecondary,
    fontFamily: 'Inter_400Regular',
    textAlign: 'center',
    letterSpacing: 0.5,
  },
  settingsSection: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
    fontFamily: 'PlayfairDisplay_600SemiBold',
    marginBottom: 12,
    letterSpacing: 0.5,
  },
  settingsCard: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 20,
    overflow: 'hidden',
    backgroundColor: 'rgba(255, 255, 255, 0.03)',
  },
  settingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 18,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  settingItemLast: {
    borderBottomWidth: 0,
  },
  settingLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
  },
  iconContainer: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  settingTitle: {
    fontSize: 16,
    color: colors.text,
    fontFamily: 'Inter_400Regular',
  },
  versionText: {
    fontSize: 13,
    color: colors.textSecondary,
    fontFamily: 'Inter_600SemiBold',
    textAlign: 'center',
    marginTop: 24,
    letterSpacing: 1,
  },
  versionSubtext: {
    fontSize: 11,
    color: colors.textSecondary,
    fontFamily: 'Inter_400Regular',
    textAlign: 'center',
    marginTop: 4,
    opacity: 0.6,
  },
});
