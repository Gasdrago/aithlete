import React from 'react';
import { Platform, Pressable, StyleSheet, Text, View, useWindowDimensions } from 'react-native';
import { Href, usePathname, useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import Animated, { useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated';

import { fonts, palette } from '@/styles/olympus';
import { tap } from '@/components/olympus/ui';

export const TAB_BAR_HEIGHT = 72;

export interface TabBarItem {
  name: string;
  route: Href;
  icon: keyof typeof MaterialCommunityIcons.glyphMap;
  label: string;
}

interface FloatingTabBarProps {
  tabs: TabBarItem[];
}

/** Floating obsidian bar with a golden laurel highlight on the active tab. */
export default function FloatingTabBar({ tabs }: FloatingTabBarProps) {
  const router = useRouter();
  const pathname = usePathname();
  const insets = useSafeAreaInsets();
  const { width: screenWidth } = useWindowDimensions();
  const barWidth = Math.min(screenWidth - 24, 520);
  const inner = barWidth - 12;
  const tabWidth = inner / tabs.length;

  const activeIndex = React.useMemo(() => {
    const idx = tabs.findIndex((t) => t.name !== '(home)' && pathname.startsWith(`/${t.name}`));
    return idx >= 0 ? idx : 0;
  }, [pathname, tabs]);

  const x = useSharedValue(activeIndex * tabWidth);
  React.useEffect(() => {
    x.value = withSpring(activeIndex * tabWidth, { damping: 18, stiffness: 160 });
  }, [activeIndex, tabWidth, x]);

  const indicator = useAnimatedStyle(() => ({ transform: [{ translateX: x.value }] }));

  return (
    <View pointerEvents="box-none" style={[styles.wrap, { paddingBottom: Math.max(insets.bottom, 12) }]}>
      <View style={[styles.bar, { width: barWidth }]}>
        <BlurView intensity={40} tint="dark" style={StyleSheet.absoluteFill} />
        <LinearGradient
          colors={['rgba(26,21,16,0.92)', 'rgba(8,7,10,0.96)']}
          start={{ x: 0, y: 0 }}
          end={{ x: 0, y: 1 }}
          style={StyleSheet.absoluteFill}
        />
        <LinearGradient
          colors={['transparent', palette.gold, 'transparent']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={styles.topRule}
        />
        <Animated.View style={[styles.indicator, { width: tabWidth }, indicator]}>
          <LinearGradient
            colors={['rgba(212,175,106,0.28)', 'rgba(212,175,106,0.04)']}
            start={{ x: 0.5, y: 0 }}
            end={{ x: 0.5, y: 1 }}
            style={styles.indicatorFill}
          />
          <View style={styles.indicatorGem} />
        </Animated.View>
        <View style={styles.row}>
          {tabs.map((tab, i) => {
            const active = i === activeIndex;
            return (
              <Pressable
                key={tab.name}
                accessibilityRole="tab"
                accessibilityState={{ selected: active }}
                accessibilityLabel={tab.label}
                style={styles.tab}
                onPress={() => {
                  if (!active) {
                    tap();
                    router.navigate(tab.route);
                  }
                }}
              >
                <MaterialCommunityIcons name={tab.icon} size={22} color={active ? palette.goldBright : palette.stone} />
                <Text numberOfLines={1} style={[styles.label, active && styles.labelActive]}>
                  {tab.label}
                </Text>
              </Pressable>
            );
          })}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    alignItems: 'center',
    zIndex: 1000,
  },
  bar: {
    height: TAB_BAR_HEIGHT,
    borderRadius: 26,
    overflow: 'hidden',
    borderWidth: StyleSheet.hairlineWidth * 2,
    borderColor: palette.border,
    paddingHorizontal: 6,
    ...Platform.select({
      ios: { shadowColor: '#000', shadowOpacity: 0.6, shadowRadius: 20, shadowOffset: { width: 0, height: 10 } },
      android: { elevation: 16 },
      web: { boxShadow: '0 12px 40px rgba(0,0,0,0.65), 0 0 24px rgba(212,175,106,0.08)' } as object,
    }),
  },
  topRule: { position: 'absolute', top: 0, left: 24, right: 24, height: 1, opacity: 0.8 },
  indicator: { position: 'absolute', top: 6, bottom: 6, left: 6, alignItems: 'center' },
  indicatorFill: { position: 'absolute', top: 0, bottom: 0, left: 4, right: 4, borderRadius: 20, borderWidth: 1, borderColor: 'rgba(212,175,106,0.35)' },
  indicatorGem: {
    position: 'absolute',
    top: -3,
    width: 6,
    height: 6,
    backgroundColor: palette.goldBright,
    transform: [{ rotate: '45deg' }],
  },
  row: { flex: 1, flexDirection: 'row' },
  tab: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 4 },
  label: { fontFamily: fonts.displaySemi, fontSize: 9, letterSpacing: 1.2, color: palette.stone, textTransform: 'uppercase' },
  labelActive: { color: palette.goldBright },
});
