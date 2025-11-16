
import { SymbolView, SymbolViewProps, SymbolWeight } from "expo-symbols";
import { StyleProp, ViewStyle } from "react-native";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";

export function IconSymbol({
  ios_icon_name,
  android_material_icon_name,
  size = 24,
  color,
  style,
  weight = "regular",
}: {
  ios_icon_name: SymbolViewProps["name"];
  android_material_icon_name: any;
  size?: number;
  color: string;
  style?: StyleProp<ViewStyle>;
  weight?: SymbolWeight;
}) {
  // Fallback to MaterialIcons if SF Symbol name is invalid
  if (!ios_icon_name || ios_icon_name === '') {
    const iconName = android_material_icon_name && MaterialIcons.glyphMap[android_material_icon_name] 
      ? android_material_icon_name 
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
      name={ios_icon_name}
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
