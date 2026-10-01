/**
 * AITHLETE — "Olympus" design system.
 *
 * Obsidian night, carved marble and burnished gold. Titles are set in Cinzel
 * (Roman/Greek inscriptional capitals), prose in Cormorant Garamond, data and
 * UI labels in Inter.
 */

export const palette = {
  night: '#07060A',
  nightRaised: '#0E0C11',
  nightDeep: '#030204',
  surface: 'rgba(255, 244, 222, 0.035)',
  surfaceStrong: 'rgba(255, 244, 222, 0.07)',
  surfaceGold: 'rgba(212, 175, 106, 0.08)',
  hairline: 'rgba(255, 244, 222, 0.08)',
  border: 'rgba(212, 175, 106, 0.22)',
  borderStrong: 'rgba(212, 175, 106, 0.5)',

  gold: '#D4AF6A',
  goldBright: '#F3D9A0',
  goldPale: '#FFF1CC',
  goldDeep: '#9C7A3C',
  goldShadow: '#5A4320',

  ivory: '#F4EEE3',
  marble: '#E6DFD2',
  stone: '#A79F92',
  stoneDim: '#6E675D',
  bronze: '#C08A57',
  terracotta: '#C47A5A',

  laurel: '#A9BA8E',
  wine: '#B4584A',
  aegean: '#7FA6B8',
} as const;

export const goldGradient = ['#FFF1C4', '#E6C478', '#C49A48', '#8E6A2C'] as const;
export const goldGradientSoft = ['#F3D9A0', '#D4AF6A', '#A8853F'] as const;

export const fonts = {
  display: 'Cinzel_700Bold',
  displaySemi: 'Cinzel_600SemiBold',
  displayRegular: 'Cinzel_400Regular',
  displayBlack: 'Cinzel_900Black',
  serif: 'CormorantGaramond_500Medium',
  serifBold: 'CormorantGaramond_700Bold',
  serifSemi: 'CormorantGaramond_600SemiBold',
  serifItalic: 'CormorantGaramond_500Medium_Italic',
  sans: 'Inter_400Regular',
  sansMedium: 'Inter_500Medium',
  sansSemi: 'Inter_600SemiBold',
  sansBold: 'Inter_700Bold',
} as const;

export const space = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 28,
  huge: 40,
  gutter: 20,
} as const;

export const radius = {
  sm: 10,
  md: 14,
  lg: 20,
  xl: 28,
  pill: 999,
} as const;

/** Bottom space every scrollable screen keeps free for the floating tab bar. */
export const TAB_BAR_SPACE = 130;
