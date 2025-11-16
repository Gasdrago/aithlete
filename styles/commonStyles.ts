
import { StyleSheet } from 'react-native';

// AITHLETE Premium Black & White Color Palette with Liquid Glass & Greek Inspiration
export const colors = {
  background: '#000000',           // Pure Black
  text: '#FFFFFF',                 // Pure White
  textSecondary: '#AAAAAA',        // Soft Silver
  primary: '#FFFFFF',              // White
  secondary: '#DDDDDD',            // Light Silver
  accent: '#CCCCCC',               // Metallic Silver
  card: 'rgba(255, 255, 255, 0.05)', // Liquid Glass - Translucent White
  highlight: 'rgba(255, 255, 255, 0.12)', // Active State Glass
  border: 'rgba(255, 255, 255, 0.15)', // Greek Engraved Border
  success: '#FFFFFF',
  warning: '#CCCCCC',
  error: '#FFFFFF',
  glassLight: 'rgba(255, 255, 255, 0.08)', // Light Glass Layer
  glassDark: 'rgba(0, 0, 0, 0.3)',         // Dark Glass Layer
  marbleGlow: 'rgba(255, 255, 255, 0.2)',  // Marble Halo Effect
};

export const buttonStyles = StyleSheet.create({
  primaryButton: {
    backgroundColor: colors.primary,
    alignSelf: 'center',
    width: '100%',
    borderRadius: 16,
    paddingVertical: 18,
    borderWidth: 1,
    borderColor: colors.border,
  },
  secondaryButton: {
    backgroundColor: colors.card,
    alignSelf: 'center',
    width: '100%',
    borderRadius: 16,
    paddingVertical: 18,
    borderWidth: 1,
    borderColor: colors.border,
  },
});

export const commonStyles = StyleSheet.create({
  wrapper: {
    backgroundColor: colors.background,
    width: '100%',
    height: '100%',
  },
  container: {
    flex: 1,
    backgroundColor: colors.background,
    width: '100%',
    height: '100%',
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    maxWidth: 800,
    width: '100%',
  },
  title: {
    fontSize: 36,
    fontWeight: '700',
    textAlign: 'center',
    color: colors.text,
    marginBottom: 12,
    fontFamily: 'PlayfairDisplay_700Bold',
    letterSpacing: 2,
  },
  subtitle: {
    fontSize: 22,
    fontWeight: '600',
    textAlign: 'center',
    color: colors.text,
    marginBottom: 10,
    fontFamily: 'PlayfairDisplay_600SemiBold',
    letterSpacing: 1,
  },
  text: {
    fontSize: 16,
    fontWeight: '400',
    color: colors.text,
    marginBottom: 8,
    lineHeight: 24,
    textAlign: 'center',
    fontFamily: 'Inter_400Regular',
  },
  textSecondary: {
    fontSize: 14,
    fontWeight: '400',
    color: colors.textSecondary,
    marginBottom: 8,
    lineHeight: 20,
    textAlign: 'center',
    fontFamily: 'Inter_400Regular',
  },
  section: {
    width: '100%',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  buttonContainer: {
    width: '100%',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  card: {
    backgroundColor: colors.card,
    borderColor: colors.border,
    borderWidth: 1,
    borderRadius: 20,
    padding: 24,
    marginVertical: 12,
    width: '100%',
    shadowColor: '#FFFFFF',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 4,
  },
  glassCard: {
    backgroundColor: colors.glassLight,
    borderColor: colors.border,
    borderWidth: 1,
    borderRadius: 24,
    padding: 28,
    marginVertical: 16,
    width: '100%',
    shadowColor: '#FFFFFF',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.12,
    shadowRadius: 16,
    elevation: 6,
  },
  icon: {
    width: 60,
    height: 60,
    tintColor: colors.text,
  },
  divider: {
    width: '100%',
    height: 1,
    backgroundColor: colors.border,
    marginVertical: 16,
  },
  greekBorder: {
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: colors.border,
    paddingVertical: 12,
  },
});
