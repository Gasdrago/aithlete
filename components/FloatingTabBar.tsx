
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
} from 'react-native-reanimated';
import { useTheme } from '@react-navigation/native';
import { BlurView } from 'expo-blur';
import React from 'react';

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

const { width: screenWidth } = Dimensions.get('window');

export default function FloatingTabBar({
  tabs,
  containerWidth = screenWidth * 0.95,
  borderRadius = 30,
  bottomMargin = 20,
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

  const tabWidthPercent = 100 / tabs.length;

  const animatedIndicatorStyle = useAnimatedStyle(() => {
    return {
      left: `${indicatorPosition.value * tabWidthPercent}%`,
      width: `${tabWidthPercent}%`,
    };
  });

  return (
    <SafeAreaView style={styles.safeArea} edges={['bottom']}>
      <View
        style={[
          styles.container,
          {
            width: containerWidth,
            marginBottom: bottomMargin,
          },
        ]}
      >
        <BlurView
          intensity={90}
          tint="dark"
          style={[styles.blurContainer, { borderRadius }]}
        >
          {/* Liquid Glass Background Layer */}
          <View style={styles.glassBackground} />
          
          {/* Greek-inspired engraved line decoration */}
          <View style={styles.topBorder} />
          <View style={styles.bottomBorder} />
          
          {/* Active Tab Indicator with Marble Halo */}
          <Animated.View style={[styles.indicator, animatedIndicatorStyle]}>
            <View style={styles.marbleHalo} />
          </Animated.View>

          <View style={styles.tabsContainer}>
            {tabs.map((tab, index) => {
              const isActive = index === activeIndex;

              return (
                <TouchableOpacity
                  key={index}
                  style={styles.tab}
                  onPress={() => handleTabPress(tab.route)}
                  activeOpacity={0.7}
                >
                  <View style={styles.tabContent}>
                    <IconSymbol
                      android_material_icon_name={tab.icon}
                      ios_icon_name={tab.icon}
                      size={24}
                      color={isActive ? '#FFFFFF' : '#888888'}
                    />
                    <Text
                      style={[
                        styles.tabLabel,
                        {
                          color: isActive ? '#FFFFFF' : '#888888',
                          fontWeight: isActive ? '600' : '400',
                        },
                      ]}
                    >
                      {tab.label}
                    </Text>
                  </View>
                </TouchableOpacity>
              );
            })}
          </View>
        </BlurView>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    zIndex: 1000,
    alignItems: 'center',
  },
  container: {
    alignSelf: 'center',
  },
  blurContainer: {
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
    ...Platform.select({
      ios: {
        backgroundColor: 'rgba(20, 20, 20, 0.7)',
        shadowColor: '#FFFFFF',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 12,
      },
      android: {
        backgroundColor: 'rgba(20, 20, 20, 0.85)',
        elevation: 8,
      },
      web: {
        backgroundColor: 'rgba(20, 20, 20, 0.85)',
        backdropFilter: 'blur(20px)',
        boxShadow: '0 8px 32px rgba(255, 255, 255, 0.1)',
      },
    }),
  },
  glassBackground: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(255, 255, 255, 0.03)',
  },
  topBorder: {
    position: 'absolute',
    top: 0,
    left: 20,
    right: 20,
    height: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
  },
  bottomBorder: {
    position: 'absolute',
    bottom: 0,
    left: 20,
    right: 20,
    height: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
  },
  indicator: {
    position: 'absolute',
    top: 8,
    bottom: 8,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.12)',
    zIndex: 0,
  },
  marbleHalo: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    ...Platform.select({
      ios: {
        shadowColor: '#FFFFFF',
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
      },
      android: {
        elevation: 4,
      },
      web: {
        boxShadow: '0 0 20px rgba(255, 255, 255, 0.3)',
      },
    }),
  },
  tabsContainer: {
    flexDirection: 'row',
    paddingVertical: 12,
    paddingHorizontal: 8,
    zIndex: 1,
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
  },
  tabContent: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabLabel: {
    fontSize: 11,
    marginTop: 4,
    fontFamily: 'Inter_400Regular',
    letterSpacing: 0.5,
  },
});
