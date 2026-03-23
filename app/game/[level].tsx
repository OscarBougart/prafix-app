import { View, Text, Pressable } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";

export default function GameScreen() {
  const { level } = useLocalSearchParams<{ level: string }>();
  const router = useRouter();

  return (
    <SafeAreaView className="flex-1 bg-background items-center justify-center px-6">
      <Text className="text-foreground text-3xl font-bold mb-2">Level {level}</Text>
      <Text className="text-muted text-base text-center mb-10">
        Game screen — coming soon
      </Text>
      <Pressable
        onPress={() => router.back()}
        className="bg-surface border border-border rounded-2xl px-8 py-4"
        accessibilityRole="button"
        accessibilityLabel="Go back"
      >
        <Text className="text-foreground font-semibold">← Zurück</Text>
      </Pressable>
    </SafeAreaView>
  );
}
