import { View, Text, Pressable } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter, useLocalSearchParams } from "expo-router";
import Animated, { FadeInDown, FadeIn } from "react-native-reanimated";

export default function ResultsScreen() {
  const router = useRouter();
  const { level, subLevel, score, stars } = useLocalSearchParams<{
    level: string;
    subLevel: string;
    score: string;
    stars: string;
  }>();

  const scoreNum = Number(score ?? 0);
  const starsNum = Number(stars ?? 0);
  const starsDisplay = "★".repeat(starsNum) + "☆".repeat(3 - starsNum);

  return (
    <SafeAreaView className="flex-1 bg-background items-center justify-center px-6">
      <Animated.View entering={FadeIn.duration(500)} className="items-center mb-8">
        <Text style={{ fontSize: 64 }}>
          {starsNum === 3 ? "🏆" : starsNum >= 1 ? "🎉" : "💪"}
        </Text>
      </Animated.View>

      <Animated.View
        entering={FadeInDown.delay(100).duration(500)}
        className="items-center mb-6"
      >
        <Text style={{ fontSize: 36, color: "#FFC800", fontWeight: "900", letterSpacing: 4 }}>
          {starsDisplay}
        </Text>
        <Text className="text-foreground text-2xl font-bold mt-3">
          {scoreNum} / 10 richtig
        </Text>
        <Text className="text-muted text-sm mt-1">
          Level {level} · Stufe {subLevel}
        </Text>
      </Animated.View>

      <Animated.View
        entering={FadeInDown.delay(250).duration(500)}
        className="w-full gap-3"
      >
        <Pressable
          onPress={() => router.replace("/")}
          className="bg-primary rounded-2xl items-center py-4"
          style={{ borderBottomWidth: 4, borderBottomColor: "#46A302" }}
          accessibilityLabel="Zur Startseite"
          accessibilityRole="button"
        >
          <Text className="text-foreground font-bold text-base">Zur Startseite</Text>
        </Pressable>
      </Animated.View>
    </SafeAreaView>
  );
}
