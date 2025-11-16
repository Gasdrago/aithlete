
import { Href } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, usePathname } from 'expo-router';
import { IconSymbol } from '@/components/IconSymbol';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Platform,
  Dimensions,
} from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  interpolate,
} from 'react-native-reanimated';
import { useTheme } from '@react-navigation/native';
import { BlurView } from 'expo-blur';
import React from 'react';
import { colors } from '@/styles/commonStyles';

export interface TabBarItem {
  name: string;
  route: Href;
  icon: string;
  label: string;
}

interface FloatingTabBarProps {
  tabs: TabBarItem[];
  containerWidth?: number;
  borderRadius?: number;
  bottomMargin?: number;
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingBottom: Platform.OS === 'ios' ? 20 : 16,
    paddingHorizontal: 16,
  },
  tabBar: {
    flexDirection: 'row',
    borderRadius: 24,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: colors.border,
  },
  blurView: {
    flexDirection: 'row',
    paddingVertical: 12,
    paddingHorizontal: 8,
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    paddingHorizontal: 4,
  },
  tabLabel: {
    fontSize: 11,
    marginTop: 4,
    fontFamily: 'Inter_500Medium',
  },
  activeIndicator: {
    position: 'absolute',
    backgroundColor: colors.highlight,
    borderRadius: 16,
    top: 4,
    bottom: 4,
  },
});

export default function FloatingTabBar({
  tabs,
  containerWidth,
  borderRadius,
  bottomMargin,
}: FloatingTabBarProps) {
  const router = useRouter();
  const pathname = usePathname();
  const theme = useTheme();

  const activeIndex = tabs.findIndex((tab) => {
    const tabPath = typeof tab.route === 'string' ? tab.route : tab.route.pathname;
    return pathname.startsWith(tabPath || '');
  });

  const indicatorPosition = useSharedValue(activeIndex >= 0 ? activeIndex : 0);

  React.useEffect(() => {
    if (activeIndex >= 0) {
      indicatorPosition.value = withSpring(activeIndex, {
        damping: 20,
        stiffness: 200,
      });
    }
  }, [activeIndex]);

  const handleTabPress = (route: Href) => {
    router.push(route);
  };

  const animatedIndicatorStyle = useAnimatedStyle(() => {
    const tabWidth = 100 / tabs.length;
    return {
      left: `${indicatorPosition.value * tabWidth}%`,
      width: `${tabWidth}%`,
    };
  });

  return (
    <SafeAreaView edges={['bottom']} style={styles.container}>
      <View style={styles.tabBar}>
        <BlurView intensity={80} tint="dark" style={styles.blurView}>
          <Animated.View style={[styles.activeIndicator, animatedIndicatorStyle]} />
          {tabs.map((tab, index) => {
            const isActive = index === activeIndex;
            return (
              <TouchableOpacity
                key={tab.name}
                style={styles.tab}
                onPress={() => handleTabPress(tab.route)}
                activeOpacity={0.7}
              >
                <IconSymbol
                  ios_icon_name={tab.icon}
                  android_material_icon_name={tab.icon}
                  size={24}
                  color={isActive ? colors.text : colors.textSecondary}
                />
                <Text
                  style={[
                    styles.tabLabel,
                    { color: isActive ? colors.text : colors.textSecondary },
                  ]}
                >
                  {tab.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </BlurView>
      </View>
    </SafeAreaView>
  );
}
