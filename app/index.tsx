/**
 * Home Screen — app/index.tsx
 *
 * This is the first screen shown when the app loads.
 * Replace this placeholder with your actual home screen content.
 *
 * Navigation:
 *   - Use <Link href="/screen-name"> for declarative navigation
 *   - Use router.push('/screen-name') for imperative navigation
 */

import { View, Text, Pressable } from "react-native";
import { useRouter } from "expo-router";
import * as Haptics from "expo-haptics";

export default function HomeScreen() {
  const router = useRouter();

  const handlePress = () => {
    // Haptic feedback — use ImpactFeedbackStyle for button taps
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    // router.push('/next-screen'); // ← navigate to next screen
  };

  return (
    <View className="flex-1 bg-background items-center justify-center px-6">
      {/* App name / logo area */}
      <Text className="text-foreground text-4xl font-bold mb-2">
        Your App
      </Text>
      <Text className="text-muted text-base text-center mb-12">
        Delete this placeholder and build something great.
      </Text>

      {/* Primary CTA — minimum 48pt touch target */}
      <Pressable
        onPress={handlePress}
        className="bg-primary rounded-2xl px-8 py-4 w-full items-center active:opacity-80"
        accessibilityLabel="Get started"
        accessibilityRole="button"
      >
        <Text className="text-background text-lg font-bold">Get Started</Text>
      </Pressable>
    </View>
  );
}
