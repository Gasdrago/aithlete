import "react-native-reanimated";
import { StatusBar } from "expo-status-bar";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { DarkTheme, Theme, ThemeProvider } from "@react-navigation/native";
import * as SplashScreen from "expo-splash-screen";
import { useFonts } from "expo-font";
import React, { useEffect } from "react";
import { WidgetProvider } from "@/contexts/WidgetContext";
import { SystemBars } from "react-native-edge-to-edge";
import { Stack, useRouter, useSegments } from "expo-router";
import {
  Cinzel_400Regular,
  Cinzel_600SemiBold,
  Cinzel_700Bold,
  Cinzel_900Black,
} from "@expo-google-fonts/cinzel";
import {
  CormorantGaramond_500Medium,
  CormorantGaramond_500Medium_Italic,
  CormorantGaramond_600SemiBold,
  CormorantGaramond_700Bold,
} from "@expo-google-fonts/cormorant-garamond";
import {
  Inter_400Regular,
  Inter_500Medium,
  Inter_600SemiBold,
  Inter_700Bold,
} from "@expo-google-fonts/inter";

import { AthleteProvider, useAthlete } from "@/contexts/AthleteContext";
import { palette } from "@/styles/olympus";

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

const OlympusTheme: Theme = {
  ...DarkTheme,
  colors: {
    ...DarkTheme.colors,
    primary: palette.gold,
    background: palette.night,
    card: palette.nightRaised,
    text: palette.ivory,
    border: palette.border,
    notification: palette.gold,
  },
};

/** Sends first-time visitors through the onboarding rite. */
function OnboardingGate() {
  const { ready, state } = useAthlete();
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    if (!ready) return;
    SplashScreen.hideAsync();
    const inOnboarding = segments[0] === "onboarding";
    if (!state.profile.onboarded && !inOnboarding) {
      router.replace("/onboarding");
    }
  }, [ready, state.profile.onboarded, segments, router]);

  return null;
}

export default function RootLayout() {
  const [loaded] = useFonts({
    SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
    Cinzel_400Regular,
    Cinzel_600SemiBold,
    Cinzel_700Bold,
    Cinzel_900Black,
    CormorantGaramond_500Medium,
    CormorantGaramond_500Medium_Italic,
    CormorantGaramond_600SemiBold,
    CormorantGaramond_700Bold,
    Inter_400Regular,
    Inter_500Medium,
    Inter_600SemiBold,
    Inter_700Bold,
  });

  if (!loaded) {
    return null;
  }

  return (
    <GestureHandlerRootView style={{ flex: 1, backgroundColor: palette.night }}>
      <WidgetProvider>
        <AthleteProvider>
          <ThemeProvider value={OlympusTheme}>
            <SystemBars style="light" />
            <Stack
              screenOptions={{
                headerShown: false,
                animation: "fade",
                contentStyle: { backgroundColor: palette.night },
              }}
            >
              <Stack.Screen name="(tabs)" />
              <Stack.Screen name="onboarding" options={{ gestureEnabled: false }} />
              <Stack.Screen name="profile" options={{ animation: "slide_from_right" }} />
              <Stack.Screen name="exercise-detail" options={{ animation: "slide_from_right" }} />
              <Stack.Screen
                name="modal"
                options={{
                  presentation: "modal",
                  animation: "slide_from_bottom",
                }}
              />
              <Stack.Screen
                name="formsheet"
                options={{
                  presentation: "formSheet",
                  sheetAllowedDetents: [0.5, 1],
                  sheetGrabberVisible: true,
                }}
              />
              <Stack.Screen
                name="transparent-modal"
                options={{
                  presentation: "transparentModal",
                  animation: "fade",
                }}
              />
            </Stack>
            <OnboardingGate />
            <StatusBar style="light" />
          </ThemeProvider>
        </AthleteProvider>
      </WidgetProvider>
    </GestureHandlerRootView>
  );
}
