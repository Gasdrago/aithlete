import { Stack } from 'expo-router';
import { palette } from '@/styles/olympus';

export default function HomeLayout() {
  return (
    <Stack screenOptions={{ headerShown: false, contentStyle: { backgroundColor: palette.night } }}>
      <Stack.Screen name="index" />
    </Stack>
  );
}
