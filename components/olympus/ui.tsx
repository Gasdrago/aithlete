import React from 'react';
import {
  ActivityIndicator,
  Image,
  Pressable,
  ScrollView,
  StyleProp,
  StyleSheet,
  Text,
  TextStyle,
  View,
  ViewStyle,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import * as Haptics from 'expo-haptics';

import { palette, fonts, radius, space, TAB_BAR_SPACE, goldGradient } from '@/styles/olympus';
import { Backdrop, CoinRim } from './ornaments';
import Statue from './Statue';
import type { Deity } from '@/data/pantheon';
import { statueParamsFrom } from '@/utils/divinity';
import { STATUE_IMAGES } from '@/data/statueImages';

export type IconName = keyof typeof MaterialCommunityIcons.glyphMap;

export const tap = () => {
  Haptics.selectionAsync().catch(() => {});
};

/** Standard scrolling screen on the Olympus backdrop. */
export function Screen({
  children,
  tabBar = true,
  contentStyle,
  glow,
}: {
  children: React.ReactNode;
  tabBar?: boolean;
  contentStyle?: StyleProp<ViewStyle>;
  glow?: 'top' | 'center';
}) {
  const insets = useSafeAreaInsets();
  return (
    <View style={styles.screen}>
      <Backdrop glow={glow} />
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[
          {
            paddingTop: insets.top + space.lg,
            paddingBottom: (tabBar ? TAB_BAR_SPACE : space.huge) + insets.bottom,
            paddingHorizontal: space.gutter,
            width: '100%',
            maxWidth: 640,
            alignSelf: 'center',
          },
          contentStyle,
        ]}
        keyboardShouldPersistTaps="handled"
      >
        {children}
      </ScrollView>
    </View>
  );
}

export function Eyebrow({ children, style, center }: { children: React.ReactNode; style?: StyleProp<TextStyle>; center?: boolean }) {
  return <Text style={[styles.eyebrow, center && { textAlign: 'center' }, style]}>{children}</Text>;
}

export function ScreenHeader({
  greek,
  title,
  subtitle,
  right,
  center,
}: {
  greek: string;
  title: string;
  subtitle?: string;
  right?: React.ReactNode;
  center?: boolean;
}) {
  return (
    <View style={[styles.header, center && { alignItems: 'center' }]}>
      <View style={{ flex: 1, alignItems: center ? 'center' : 'flex-start' }}>
        <Eyebrow center={center}>{greek}</Eyebrow>
        <Text style={[styles.title, center && { textAlign: 'center' }]}>{title}</Text>
        {subtitle ? <Text style={[styles.subtitle, center && { textAlign: 'center' }]}>{subtitle}</Text> : null}
      </View>
      {right}
    </View>
  );
}

export function SectionTitle({ children, action, onAction }: { children: React.ReactNode; action?: string; onAction?: () => void }) {
  return (
    <View style={styles.sectionRow}>
      <View style={styles.sectionDiamond} />
      <Text style={styles.sectionTitle}>{children}</Text>
      <View style={styles.sectionLine} />
      {action ? (
        <Pressable onPress={onAction} hitSlop={10}>
          <Text style={styles.sectionAction}>{action}</Text>
        </Pressable>
      ) : null}
    </View>
  );
}

/** Translucent panel with a gold hairline and engraved corners. */
export function Panel({
  children,
  style,
  variant = 'default',
  corners = true,
  onPress,
}: {
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  variant?: 'default' | 'gold' | 'flat';
  corners?: boolean;
  onPress?: () => void;
}) {
  const content = (
    <>
      {variant === 'gold' && (
        <LinearGradient
          colors={['rgba(212,175,106,0.16)', 'rgba(212,175,106,0.02)']}
          start={{ x: 0, y: 0 }}
          end={{ x: 0.6, y: 1 }}
          style={[StyleSheet.absoluteFill, { borderRadius: radius.lg }]}
        />
      )}
      {corners && (
        <>
          <View style={[styles.corner, { top: 6, left: 6, borderTopWidth: 1, borderLeftWidth: 1 }]} />
          <View style={[styles.corner, { top: 6, right: 6, borderTopWidth: 1, borderRightWidth: 1 }]} />
          <View style={[styles.corner, { bottom: 6, left: 6, borderBottomWidth: 1, borderLeftWidth: 1 }]} />
          <View style={[styles.corner, { bottom: 6, right: 6, borderBottomWidth: 1, borderRightWidth: 1 }]} />
        </>
      )}
      {children}
    </>
  );
  const base = [styles.panel, variant === 'gold' && styles.panelGold, variant === 'flat' && styles.panelFlat, style];
  if (onPress) {
    return (
      <Pressable
        onPress={() => {
          tap();
          onPress();
        }}
        style={({ pressed }) => [...base, pressed && { opacity: 0.85, transform: [{ scale: 0.99 }] }]}
      >
        {content}
      </Pressable>
    );
  }
  return <View style={base}>{content}</View>;
}

export function GoldButton({
  label,
  onPress,
  variant = 'primary',
  icon,
  disabled,
  loading,
  style,
  compact,
}: {
  label: string;
  onPress?: () => void;
  variant?: 'primary' | 'outline' | 'ghost';
  icon?: IconName;
  disabled?: boolean;
  loading?: boolean;
  style?: StyleProp<ViewStyle>;
  compact?: boolean;
}) {
  const isPrimary = variant === 'primary';
  const color = isPrimary ? '#1A1206' : palette.goldBright;
  return (
    <Pressable
      disabled={disabled || loading}
      onPress={() => {
        tap();
        onPress?.();
      }}
      style={({ pressed }) => [
        styles.button,
        compact && styles.buttonCompact,
        variant === 'outline' && styles.buttonOutline,
        variant === 'ghost' && styles.buttonGhost,
        (disabled || loading) && { opacity: 0.5 },
        pressed && { transform: [{ scale: 0.98 }], opacity: 0.9 },
        style,
      ]}
    >
      {isPrimary && (
        <LinearGradient colors={goldGradient} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={[StyleSheet.absoluteFill, { borderRadius: radius.pill }]} />
      )}
      {loading ? (
        <ActivityIndicator color={color} />
      ) : (
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
          {icon ? <MaterialCommunityIcons name={icon} size={compact ? 16 : 18} color={color} /> : null}
          <Text style={[styles.buttonText, compact && { fontSize: 12 }, { color }]}>{label}</Text>
        </View>
      )}
    </Pressable>
  );
}

export function Chip({ label, active, onPress, icon }: { label: string; active?: boolean; onPress?: () => void; icon?: IconName }) {
  return (
    <Pressable
      onPress={() => {
        tap();
        onPress?.();
      }}
      style={[styles.chip, active && styles.chipActive]}
    >
      {icon ? <MaterialCommunityIcons name={icon} size={15} color={active ? '#1A1206' : palette.goldBright} /> : null}
      <Text style={[styles.chipText, active && styles.chipTextActive]}>{label}</Text>
    </Pressable>
  );
}

/** Compact numeric stepper for body measurements. */
export function Stepper({
  label,
  value,
  unit,
  step = 0.5,
  min = 0,
  max = 400,
  onChange,
  hint,
}: {
  label: string;
  value: number;
  unit: string;
  step?: number;
  min?: number;
  max?: number;
  onChange: (v: number) => void;
  hint?: string;
}) {
  const set = (v: number) => {
    tap();
    onChange(Math.round(Math.min(max, Math.max(min, v)) * 10) / 10);
  };
  return (
    <View style={styles.stepper}>
      <View style={{ flex: 1 }}>
        <Text style={styles.stepperLabel}>{label}</Text>
        {hint ? <Text style={styles.stepperHint}>{hint}</Text> : null}
      </View>
      <Pressable onPress={() => set(value - step)} style={styles.stepperBtn} hitSlop={6}>
        <MaterialCommunityIcons name="minus" size={16} color={palette.goldBright} />
      </Pressable>
      <Text style={styles.stepperValue}>
        {Number.isInteger(value) ? value : value.toFixed(1)}
        <Text style={styles.stepperUnit}> {unit}</Text>
      </Text>
      <Pressable onPress={() => set(value + step)} style={styles.stepperBtn} hitSlop={6}>
        <MaterialCommunityIcons name="plus" size={16} color={palette.goldBright} />
      </Pressable>
    </View>
  );
}

/** Progress bar in burnished gold. */
export function GoldBar({ progress, height = 6, style }: { progress: number; height?: number; style?: StyleProp<ViewStyle> }) {
  const p = Math.max(0, Math.min(1, progress));
  return (
    <View style={[{ height, borderRadius: height, backgroundColor: palette.hairline, overflow: 'hidden' }, style]}>
      <LinearGradient
        colors={[palette.goldDeep, palette.gold, palette.goldBright]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={{ width: `${p * 100}%`, height: '100%', borderRadius: height }}
      />
    </View>
  );
}

/** Engraved stat tablet. */
export function Tablet({ value, label, icon }: { value: string | number; label: string; icon?: IconName }) {
  return (
    <View style={styles.tablet}>
      {icon ? <MaterialCommunityIcons name={icon} size={16} color={palette.gold} style={{ marginBottom: 6 }} /> : null}
      <Text style={styles.tabletValue}>{value}</Text>
      <Text style={styles.tabletLabel}>{label}</Text>
    </View>
  );
}

/** A deity's bust struck on a golden coin. */
export function DeityMedallion({ deity, size, veiled }: { deity: Deity; size: number; veiled?: boolean }) {
  const params = React.useMemo(() => statueParamsFrom(deity.body, deity.heightCm, deity.sex), [deity]);
  const photo = STATUE_IMAGES[deity.id];
  return (
    <View style={{ width: size, height: size, borderRadius: size / 2, overflow: 'hidden', backgroundColor: '#15110C', alignItems: 'center', justifyContent: 'flex-start' }}>
      <LinearGradient colors={['#2A2116', '#0E0B08']} style={StyleSheet.absoluteFill} />
      {photo ? (
        <Image source={photo.bust} style={{ width: size, height: size, opacity: veiled ? 0.32 : 1 }} resizeMode="cover" />
      ) : (
        <View style={{ marginTop: size * 0.1 }}>
          <Statue params={params} styleSpec={deity.style} width={size * 0.86} crop="bust" pedestal={false} veiled={veiled} material={deity.tier === 0 ? 'clay' : 'marble'} />
        </View>
      )}
      <CoinRim size={size} />
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: palette.night },
  header: { flexDirection: 'row', alignItems: 'flex-start', marginBottom: space.xl },
  eyebrow: {
    fontFamily: fonts.displaySemi,
    fontSize: 11,
    letterSpacing: 4,
    color: palette.gold,
    marginBottom: 6,
  },
  title: {
    fontFamily: fonts.display,
    fontSize: 32,
    lineHeight: 38,
    letterSpacing: 1.5,
    color: palette.ivory,
  },
  subtitle: {
    fontFamily: fonts.serifItalic,
    fontSize: 18,
    lineHeight: 24,
    color: palette.stone,
    marginTop: 4,
  },
  sectionRow: { flexDirection: 'row', alignItems: 'center', marginTop: space.xxl, marginBottom: space.lg, gap: 10 },
  sectionDiamond: { width: 6, height: 6, backgroundColor: palette.gold, transform: [{ rotate: '45deg' }] },
  sectionTitle: { fontFamily: fonts.displaySemi, fontSize: 13, letterSpacing: 3, color: palette.goldBright, textTransform: 'uppercase' },
  sectionLine: { flex: 1, height: StyleSheet.hairlineWidth, backgroundColor: palette.border },
  sectionAction: { fontFamily: fonts.sansMedium, fontSize: 12, color: palette.gold, letterSpacing: 0.5 },
  panel: {
    backgroundColor: palette.surface,
    borderRadius: radius.lg,
    borderWidth: StyleSheet.hairlineWidth * 2,
    borderColor: palette.border,
    padding: space.xl,
    overflow: 'hidden',
  },
  panelGold: { borderColor: palette.borderStrong, backgroundColor: 'rgba(20,16,10,0.6)' },
  panelFlat: { padding: space.lg },
  corner: { position: 'absolute', width: 10, height: 10, borderColor: palette.gold, opacity: 0.6 },
  button: {
    height: 54,
    borderRadius: radius.pill,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: space.xxl,
    overflow: 'hidden',
  },
  buttonCompact: { height: 40, paddingHorizontal: space.lg },
  buttonOutline: { borderWidth: 1, borderColor: palette.borderStrong, backgroundColor: 'rgba(212,175,106,0.06)' },
  buttonGhost: { backgroundColor: 'transparent' },
  buttonText: { fontFamily: fonts.display, fontSize: 14, letterSpacing: 2.2, textTransform: 'uppercase' },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 14,
    paddingVertical: 9,
    borderRadius: radius.pill,
    borderWidth: 1,
    borderColor: palette.border,
    backgroundColor: palette.surface,
  },
  chipActive: { backgroundColor: palette.gold, borderColor: palette.gold },
  chipText: { fontFamily: fonts.sansMedium, fontSize: 13, color: palette.marble },
  chipTextActive: { color: '#1A1206', fontFamily: fonts.sansSemi },
  stepper: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: palette.hairline,
    gap: 10,
  },
  stepperLabel: { fontFamily: fonts.sansMedium, fontSize: 14, color: palette.ivory },
  stepperHint: { fontFamily: fonts.sans, fontSize: 11, color: palette.stoneDim, marginTop: 2 },
  stepperBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: palette.border,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: palette.surfaceGold,
  },
  stepperValue: { fontFamily: fonts.sansSemi, fontSize: 16, color: palette.ivory, minWidth: 74, textAlign: 'center' },
  stepperUnit: { fontFamily: fonts.sans, fontSize: 11, color: palette.stone },
  tablet: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: space.lg,
    paddingHorizontal: space.sm,
    borderRadius: radius.md,
    borderWidth: StyleSheet.hairlineWidth * 2,
    borderColor: palette.border,
    backgroundColor: palette.surface,
  },
  tabletValue: { fontFamily: fonts.display, fontSize: 22, color: palette.ivory },
  tabletLabel: { fontFamily: fonts.sansMedium, fontSize: 10, letterSpacing: 1.5, color: palette.stone, marginTop: 4, textTransform: 'uppercase' },
});

export const olympusText = StyleSheet.create({
  body: { fontFamily: fonts.serif, fontSize: 17, lineHeight: 24, color: palette.marble },
  bodyItalic: { fontFamily: fonts.serifItalic, fontSize: 17, lineHeight: 24, color: palette.stone },
  label: { fontFamily: fonts.sansMedium, fontSize: 11, letterSpacing: 1.6, color: palette.stone, textTransform: 'uppercase' },
  small: { fontFamily: fonts.sans, fontSize: 12, lineHeight: 17, color: palette.stone },
  name: { fontFamily: fonts.display, fontSize: 22, letterSpacing: 1.2, color: palette.ivory },
  greek: { fontFamily: fonts.displaySemi, fontSize: 10, letterSpacing: 3, color: palette.gold },
});
