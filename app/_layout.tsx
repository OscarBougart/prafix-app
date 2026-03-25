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
import { useEffect, useState, useRef } from "react";
import { Text, StyleSheet, Pressable } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
} from "react-native-reanimated";

// Keep the native splash visible while fonts load
SplashScreen.preventAutoHideAsync();

// ─── Animated splash component ────────────────────────────────────────────────

function AnimatedSplash({ onDone }: { onDone: () => void }) {
  const opacity = useSharedValue(1);
  const timerT = useRef<ReturnType<typeof setTimeout> | null>(null);
  const timerDone = useRef<ReturnType<typeof setTimeout> | null>(null);

  const skip = () => {
    if (timerT.current) clearTimeout(timerT.current);
    if (timerDone.current) clearTimeout(timerDone.current);
    opacity.value = withTiming(0, { duration: 300 });
    timerDone.current = setTimeout(() => onDone(), 300);
  };

  useEffect(() => {
    timerT.current = setTimeout(() => {
      opacity.value = withTiming(0, { duration: 500 });
    }, 3900);
    timerDone.current = setTimeout(() => onDone(), 4400);
    return () => {
      if (timerT.current) clearTimeout(timerT.current);
      if (timerDone.current) clearTimeout(timerDone.current);
    };
  }, []);

  const animStyle = useAnimatedStyle(() => ({ opacity: opacity.value }));

  return (
    <Pressable onPress={skip} style={StyleSheet.absoluteFillObject}>
      <Animated.View style={[splashStyles.root, animStyle]}>
        <Text style={splashStyles.title}>
          <Text style={{ color: "#1CB0F6" }}>Prä</Text>
          <Text style={{ color: "#FFC800" }}>Fix</Text>
        </Text>
      </Animated.View>
    </Pressable>
  );
}

const splashStyles = StyleSheet.create({
  root: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "#001d3d",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 999,
  },
  title: {
    fontFamily: "GravitasOne_400Regular",
    fontSize: 52,
    letterSpacing: 4,
  },
});

// ─── Root layout ──────────────────────────────────────────────────────────────

export default function RootLayout() {
  const [fontsLoaded, fontError] = useFonts({
    GravitasOne_400Regular: require("@expo-google-fonts/gravitas-one/400Regular/GravitasOne_400Regular.ttf"),
    Nunito_700Bold:         require("@expo-google-fonts/nunito/700Bold/Nunito_700Bold.ttf"),
    Nunito_400Regular:      require("@expo-google-fonts/nunito/400Regular/Nunito_400Regular.ttf"),
  });

  const [splashDone, setSplashDone] = useState(false);

  // Hide the native splash as soon as fonts are ready, then show our animated one
  useEffect(() => {
    if (fontsLoaded || fontError) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded, fontError]);

  if (!fontsLoaded && !fontError) {
    return null;
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <StatusBar style="light" />

      <Stack
        screenOptions={{
          headerStyle: { backgroundColor: "#001d3d" },
          headerTintColor: "#FFFFFF",
          headerTitleStyle: { fontWeight: "bold" },
          animation: "slide_from_right",
        }}
      >
        <Stack.Screen name="index" options={{ headerShown: false, animation: "none" }} />
        <Stack.Screen name="game/[level]" options={{ headerShown: false, animation: "slide_from_bottom" }} />
        <Stack.Screen name="results" options={{ headerShown: false, animation: "fade" }} />
        <Stack.Screen name="settings" options={{ animation: "slide_from_right" }} />
        <Stack.Screen name="profile" options={{ animation: "slide_from_left" }} />
      </Stack>

      {!splashDone && <AnimatedSplash onDone={() => setSplashDone(true)} />}
    </GestureHandlerRootView>
  );
}
