/**
 * Root Layout — app/_layout.tsx
 *
 * This is the single entry point for the entire app (Expo Router).
 * It handles:
 *   - NativeWind: importing global.css activates Tailwind processing
 *   - expo-font: loads custom fonts before the UI renders
 *   - expo-splash-screen: holds the splash until fonts are ready
 *   - expo-router <Stack>: defines the root navigation stack
 *
 * Add global providers here (e.g. context providers, auth wrappers).
 */

import "../global.css"; // ← Must be the first import — activates NativeWind

import { Stack } from "expo-router";
import { useFonts } from "expo-font";
import * as SplashScreen from "expo-splash-screen";
import { StatusBar } from "expo-status-bar";
import { useEffect } from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";

// Keep the splash screen visible while fonts load
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  // ─── Font loading ─────────────────────────────────────────────────────────
  // Add custom fonts here after dropping .ttf files into assets/fonts/
  // Example:
  //   'Nunito_400Regular': require('../assets/fonts/Nunito-Regular.ttf'),
  const [fontsLoaded, fontError] = useFonts({
    // placeholder — add your fonts here
  });

  // Hide splash screen once fonts are ready (or if there's an error)
  useEffect(() => {
    if (fontsLoaded || fontError) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded, fontError]);

  // Block rendering until fonts are loaded
  if (!fontsLoaded && !fontError) {
    return null;
  }

  return (
    // GestureHandlerRootView is required at the root for react-native-gesture-handler
    <GestureHandlerRootView style={{ flex: 1 }}>
      {/*
       * StatusBar style="light" pairs well with the dark background (#131F24).
       * Change to "dark" if you switch to a light theme.
       */}
      <StatusBar style="light" />

      <Stack
        screenOptions={{
          // Default header style — matches the dark palette
          headerStyle: { backgroundColor: "#001d3d" },
          headerTintColor: "#FFFFFF",
          headerTitleStyle: { fontWeight: "bold" },
          // Uncomment to hide headers globally and control per-screen:
          // headerShown: false,
        }}
      >
        {/* Add additional screens/groups here as your app grows */}
        <Stack.Screen name="index" options={{ headerShown: false }} />
      </Stack>
    </GestureHandlerRootView>
  );
}
