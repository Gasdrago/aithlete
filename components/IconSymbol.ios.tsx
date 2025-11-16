
import { SymbolView, SymbolViewProps, SymbolWeight } from "expo-symbols";
import { StyleProp, ViewStyle } from "react-native";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";

// Mapping of logical icon names to SF Symbols (iOS)
const IOS_ICON_MAP: Record<string, string> = {
  // Main navigation icons
  home: 'house.fill',
  workout: 'figure.strengthtraining.traditional',
  posture: 'figure.stand',
  projection: 'eye.fill',
  progress: 'chart.line.uptrend.xyaxis',
  profile: 'person.fill',
  
  // Additional icons used in the app
  schedule: 'clock.fill',
  clock: 'clock.fill',
  fire: 'flame.fill',
  flame: 'flame.fill',
  check: 'checkmark.circle.fill',
  checkmark: 'checkmark.circle.fill',
  run: 'figure.run',
  heart: 'heart.fill',
  meditation: 'figure.mind.and.body',
  flexibility: 'figure.flexibility',
  chart: 'chart.line.uptrend.xyaxis',
  weight: 'scalemass.fill',
  calories: 'flame.fill',
  fitness: 'figure.strengthtraining.traditional',
  body: 'figure.stand',
};

// Mapping of logical icon names to Material Icons (fallback)
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

export function IconSymbol({
  ios_icon_name,
  android_material_icon_name,
  size = 24,
  color,
  style,
  weight = "regular",
}: {
  ios_icon_name?: string;
  android_material_icon_name?: string;
  size?: number;
  color: string;
  style?: StyleProp<ViewStyle>;
  weight?: SymbolWeight;
}) {
  // Map logical name to actual SF Symbol name
  const mappedIosIconName = ios_icon_name ? IOS_ICON_MAP[ios_icon_name] : undefined;
  
  // Fallback to MaterialIcons if SF Symbol name is invalid or not found
  if (!mappedIosIconName || mappedIosIconName === '') {
    const logicalName = android_material_icon_name || ios_icon_name || '';
    const mappedIconName = ICON_MAP[logicalName];
    
    const iconName = (mappedIconName && MaterialIcons.glyphMap[mappedIconName]) 
      ? mappedIconName 
      : 'help-outline' as keyof typeof MaterialIcons.glyphMap;
    
    return (
      <MaterialIcons
        color={color}
        size={size}
        name={iconName}
        style={style as any}
      />
    );
  }

  return (
    <SymbolView
      weight={weight}
      tintColor={color}
      resizeMode="scaleAspectFit"
      name={mappedIosIconName as SymbolViewProps["name"]}
      style={[
        {
          width: size,
          height: size,
        },
        style,
      ]}
    />
  );
}
