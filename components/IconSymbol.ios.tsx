
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
  
  // Profile screen icons
  edit: 'pencil',
  'person-outline': 'person',
  flag: 'flag.fill',
  target: 'target',
  goals: 'flag.fill',
  settings: 'gearshape.fill',
  notifications: 'bell.fill',
  logout: 'rectangle.portrait.and.arrow.right',
  'exit-to-app': 'rectangle.portrait.and.arrow.right',
  lock: 'lock.fill',
  straighten: 'ruler.fill',
  info: 'info.circle.fill',
  help: 'questionmark.circle.fill',
  description: 'doc.text.fill',
  policy: 'shield.fill',
  
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
  
  // Camera and posture icons
  camera: 'camera.fill',
  'camera-alt': 'camera.fill',
  'flip-camera-ios': 'camera.rotate',
  'camera-rotate': 'camera.rotate',
  
  // Navigation icons
  'chevron-right': 'chevron.right',
  'account-circle': 'person.circle.fill',
  'person-circle': 'person.circle.fill',
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
  
  // Profile screen icons
  edit: 'edit',
  'person-outline': 'person-outline',
  flag: 'flag',
  target: 'flag',
  goals: 'flag',
  settings: 'settings',
  notifications: 'notifications',
  logout: 'logout',
  'exit-to-app': 'exit-to-app',
  lock: 'lock',
  straighten: 'straighten',
  info: 'info',
  help: 'help',
  description: 'description',
  policy: 'policy',
  
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
  
  // Camera and posture icons
  camera: 'camera-alt',
  'camera-alt': 'camera-alt',
  'flip-camera-ios': 'flip-camera-ios',
  'camera-rotate': 'flip-camera-ios',
  
  // Navigation icons
  'chevron-right': 'chevron-right',
  'account-circle': 'account-circle',
  'person-circle': 'account-circle',
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
