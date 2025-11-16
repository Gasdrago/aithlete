
import { StyleSheet, ViewStyle, TextStyle } from 'react-native';

// AITHLETE Premium Black & White Color Palette
export const colors = {
  background: '#000000',           // Black
  text: '#FFFFFF',                 // White
  textSecondary: '#AAAAAA',        // Light Gray
  primary: '#FFFFFF',              // White
  secondary: '#DDDDDD',            // Light Silver
  accent: '#BBBBBB',               // Metallic Silver
  card: 'rgba(255, 255, 255, 0.05)', // Translucent White
  highlight: 'rgba(255, 255, 255, 0.15)', // Slightly more opaque Translucent White
  border: 'rgba(255, 255, 255, 0.1)', // Border color
  success: '#FFFFFF',
  warning: '#CCCCCC',
  error: '#FFFFFF',
};

export const buttonStyles = StyleSheet.create({
  primaryButton: {
    backgroundColor: colors.primary,
    alignSelf: 'center',
    width: '100%',
    borderRadius: 12,
    paddingVertical: 16,
  },
  secondaryButton: {
    backgroundColor: colors.card,
    alignSelf: 'center',
    width: '100%',
    borderRadius: 12,
    paddingVertical: 16,
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
    fontSize: 32,
    fontWeight: '700',
    textAlign: 'center',
    color: colors.text,
    marginBottom: 10,
    fontFamily: 'PlayfairDisplay_700Bold',
  },
  subtitle: {
    fontSize: 20,
    fontWeight: '600',
    textAlign: 'center',
    color: colors.text,
    marginBottom: 8,
    fontFamily: 'PlayfairDisplay_600SemiBold',
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
    borderRadius: 16,
    padding: 20,
    marginVertical: 8,
    width: '100%',
    boxShadow: '0px 4px 12px rgba(255, 255, 255, 0.05)',
    elevation: 2,
  },
  glassCard: {
    backgroundColor: colors.card,
    borderColor: colors.border,
    borderWidth: 1,
    borderRadius: 20,
    padding: 24,
    marginVertical: 12,
    width: '100%',
    boxShadow: '0px 8px 24px rgba(255, 255, 255, 0.08)',
    elevation: 4,
  },
  icon: {
    width: 60,
    height: 60,
    tintColor: colors.text,
  },
});
