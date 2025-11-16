
// This file is a fallback for using MaterialIcons on Android and web.

import React from "react";
import { SymbolWeight } from "expo-symbols";
import {
  OpaqueColorValue,
  StyleProp,
  TextStyle,
  ViewStyle,
} from "react-native";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";

// Mapping of logical icon names to Material Icons
const ICON_MAP: Record<string, keyof typeof MaterialIcons.glyphMap> = {
  // Main navigation icons
  home: 'home',
  workout: 'fitness-center',
  posture: 'accessibility-new',
  projection: 'visibility',
  progress: 'trending-up',
  profile: 'person',
  
  // Additional icons used in the app
  schedule: 'schedule',
  clock: 'schedule',
  fire: 'local-fire-department',
  flame: 'local-fire-department',
  check: 'check-circle',
  checkmark: 'check-circle',
  run: 'directions-run',
  heart: 'favorite',
  meditation: 'self-improvement',
  flexibility: 'self-improvement',
  chart: 'trending-up',
  weight: 'monitor-weight',
  calories: 'local-fire-department',
  fitness: 'fitness-center',
  body: 'accessibility-new',
};

/**
 * An icon component that uses native SFSymbols on iOS, and MaterialIcons on Android and web. This ensures a consistent look across platforms, and optimal resource usage.
 *
 * Icon `name`s are based on SFSymbols and require manual mapping to MaterialIcons.
 */
export function IconSymbol({
  ios_icon_name = undefined,
  android_material_icon_name,
  size = 24,
  color,
  style,
}: {
  ios_icon_name?: string | undefined;
  android_material_icon_name: string;
  size?: number;
  color: string | OpaqueColorValue;
  style?: StyleProp<ViewStyle>;
  weight?: SymbolWeight;
}) {
  // Map logical name to actual Material Icon name
  const mappedIconName = ICON_MAP[android_material_icon_name];
  
  // Use mapped icon, or fallback to help-outline if not found
  const iconName = (mappedIconName && MaterialIcons.glyphMap[mappedIconName]) 
    ? mappedIconName 
    : 'help-outline' as keyof typeof MaterialIcons.glyphMap;

  return (
    <MaterialIcons
      color={color}
      size={size}
      name={iconName}
      style={style as StyleProp<TextStyle>}
    />
  );
}
