import { useEffect, useRef } from "react";
import { ScrollView, View, Text, Pressable, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter, useLocalSearchParams, useFocusEffect } from "expo-router";
import { useCallback } from "react";
import Animated, {
  FadeIn,
  FadeInDown,
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withSequence,
  withTiming,
} from "react-native-reanimated";
import * as Haptics from "expo-haptics";
import { useProgress, type SubLevelRecord } from "@/hooks/useProgress";
import { useStreak } from "@/hooks/useStreak";
import { useSound } from "@/hooks/useSound";

// ─── Data ─────────────────────────────────────────────────────────────────────

interface LevelDef {
  level: 1 | 2 | 3 | 4;
  cefr: string;
  description: string;
  accent: string;
  accentDark: string;
}

const LEVEL_DEFS: LevelDef[] = [
  {
    level: 1,
    cefr: "A1",
    description: "Einfache Verben im Präsens",
    accent: "#58CC02",
    accentDark: "#46A302",
  },
  {
    level: 2,
    cefr: "A2",
    description: "Alltagsverben & Perfekt",
    accent: "#1CB0F6",
    accentDark: "#0A8FCF",
  },
  {
    level: 3,
    cefr: "B1",
    description: "Perfekt & komplexe Verben",
    accent: "#FFC800",
    accentDark: "#E6B400",
  },
  {
    level: 4,
    cefr: "B2",
    description: "Nebensätze & B2-Verben",
    accent: "#FF4B4B",
    accentDark: "#E63939",
  },
];

// ─── LevelCard ────────────────────────────────────────────────────────────────

interface LevelCardProps {
  def: LevelDef;
  animationIndex: number;
  records: SubLevelRecord[];
  unlocked: boolean;
  onPress: () => void;
}

function LevelCard({ def, animationIndex, records, unlocked, onPress }: LevelCardProps) {
  const completedCount = records.filter((r) => r.completed).length;
  const totalStars = records.reduce((sum, r) => sum + r.bestStars, 0);
  const progressPct: `${number}%` = `${(completedCount / 5) * 100}%`;

  return (
    <Animated.View
      entering={FadeInDown.delay(animationIndex * 130).duration(500)}
      className="mb-5"
    >
      <Pressable
        onPress={onPress}
        disabled={!unlocked}
        accessibilityLabel={`Level ${def.level} ${def.cefr}: ${def.description}`}
        accessibilityRole="button"
        accessibilityState={{ disabled: !unlocked }}
        style={[styles.cardShadow, { shadowColor: def.accent }]}
        className="rounded-2xl"
      >
        {/* ── Card body ── */}
        <View className="bg-surface rounded-2xl overflow-hidden">

          {/* Accent top strip */}
          <View style={{ height: 5, backgroundColor: def.accent }} />

          {/* Content */}
          <View className="px-4 pt-4 pb-5">

            {/* Title row */}
            <View className="flex-row items-center mb-3">

              {/* Numbered badge */}
              <View
                style={{
                  backgroundColor: def.accent,
                  width: 46,
                  height: 46,
                  borderRadius: 23,
                  borderBottomWidth: 3,
                  borderBottomColor: def.accentDark,
                }}
                className="items-center justify-center mr-3"
              >
                <Text style={{ color: "#001d3d", fontSize: 20, fontWeight: "900" }}>
                  {def.level}
                </Text>
              </View>

              {/* Level title + description */}
              <View className="flex-1">
                <Text className="text-foreground font-bold text-base leading-tight">
                  Level {def.level} — {def.cefr}
                </Text>
                <Text className="text-muted text-sm mt-0.5">
                  {def.description}
                </Text>
              </View>

              {/* Stars total */}
              <View className="items-end ml-2">
                <Text style={{ color: def.accent, fontSize: 16, fontWeight: "800" }}>
                  {totalStars}
                </Text>
                <Text style={{ color: "#AFAFAF", fontSize: 11 }}>
                  / 15 ⭐
                </Text>
              </View>
            </View>

            {/* Progress bar track */}
            <View className="h-2.5 bg-border rounded-full mb-4">
              <View
                style={{
                  width: progressPct,
                  height: "100%",
                  backgroundColor: def.accent,
                  borderRadius: 999,
                }}
              />
            </View>

            {/* SubLevel stars — one star per subLevel, filled when completed */}
            <View className="flex-row justify-around">
              {records.map((record) => (
                <View key={record.subLevel} className="items-center gap-0.5">
                  <Text
                    style={{
                      fontSize: 22,
                      color: record.completed ? def.accent : "#2C4551",
                    }}
                  >
                    ★
                  </Text>
                  <Text style={{ color: "#AFAFAF", fontSize: 10 }}>
                    {record.subLevel}
                  </Text>
                </View>
              ))}
            </View>
          </View>
        </View>

        {/* ── Lock overlay ── */}
        {!unlocked && (
          <View
            className="absolute inset-0 rounded-2xl items-center justify-center"
            style={{ backgroundColor: "rgba(0, 10, 30, 0.72)" }}
          >
            <Text style={{ fontSize: 38 }}>🔒</Text>
            <Text className="text-muted text-sm mt-2 font-semibold">
              Schließ Level {def.level - 1} ab
            </Text>
          </View>
        )}
      </Pressable>
    </Animated.View>
  );
}

// ─── HomeScreen ───────────────────────────────────────────────────────────────

export default function HomeScreen() {
  const router = useRouter();
  const { unlocked } = useLocalSearchParams<{ unlocked?: string }>();
  const { getLevelProgress, isLevelUnlocked, reloadProgress } = useProgress();
  const { currentStreak } = useStreak();
  const { soundEnabled, toggleSound, playUnlock } = useSound();

  // ── Flame pulse — subtle scale breathe when streak is active ────────────────
  const flameScale = useSharedValue(1);
  const flameStyle = useAnimatedStyle(() => ({
    transform: [{ scale: flameScale.value }],
  }));

  useEffect(() => {
    if (currentStreak > 0) {
      flameScale.value = withRepeat(
        withSequence(
          withTiming(1.22, { duration: 650 }),
          withTiming(1.0,  { duration: 650 }),
        ),
        -1, // infinite
      );
    } else {
      flameScale.value = withTiming(1, { duration: 300 });
    }
  }, [currentStreak]);

  // ── Reload progress each time the home screen comes into focus ──────────────
  useFocusEffect(
    useCallback(() => {
      reloadProgress();
    }, [reloadProgress]),
  );

  // ── Play unlock sound once when arriving from a level completion ─────────────
  const unlockedPlayed = useRef(false);
  useEffect(() => {
    if (unlocked && !unlockedPlayed.current) {
      unlockedPlayed.current = true;
      const t = setTimeout(() => playUnlock(), 350); // short delay lets screen settle
      return () => clearTimeout(t);
    }
  }, [unlocked]);

  const handleCardPress = (level: 1 | 2 | 3 | 4) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    router.push({ pathname: "/game/[level]", params: { level: String(level) } });
  };

  return (
    <SafeAreaView className="flex-1 bg-background" edges={["top"]}>
      <ScrollView
        className="flex-1"
        contentContainerStyle={{ paddingBottom: 40 }}
        showsVerticalScrollIndicator={false}
      >
        {/* ── Header ─────────────────────────────────────────────────────── */}
        <View className="px-6 pt-5 pb-8">

          {/* Title row */}
          <View className="flex-row items-center justify-between mb-1">

            {/* App title — split color */}
            <Animated.View entering={FadeIn.duration(600)}>
              <Text style={styles.titleText}>
                <Text style={{ color: "#1CB0F6" }}>Prä</Text>
                <Text style={{ color: "#FFC800" }}>Fix</Text>
              </Text>
            </Animated.View>

            {/* Right-side controls */}
            <Animated.View
              entering={FadeIn.delay(150).duration(500)}
              className="flex-row items-center gap-2"
            >
              {/* Gear / settings */}
              <Pressable
                onPress={() => router.push("/settings")}
                accessibilityRole="button"
                accessibilityLabel="Einstellungen öffnen"
                style={styles.soundBtn}
              >
                <Text style={styles.soundBtnIcon}>⚙️</Text>
              </Pressable>

              {/* Sound toggle */}
              <Pressable
                onPress={toggleSound}
                accessibilityRole="button"
                accessibilityLabel={soundEnabled ? "Ton ausschalten" : "Ton einschalten"}
                style={styles.soundBtn}
              >
                <Text style={styles.soundBtnIcon}>{soundEnabled ? "🔊" : "🔇"}</Text>
              </Pressable>

              {/* Streak badge */}
              <View
                className="flex-row items-center bg-surface px-4 py-2.5 rounded-2xl"
                style={styles.streakBadge}
              >
                <Animated.Text style={[styles.streakFlame, flameStyle]}>🔥</Animated.Text>
                <Text style={styles.streakLabel}>Tag </Text>
                <Text style={styles.streakNum}>{currentStreak}</Text>
              </View>
            </Animated.View>
          </View>

          {/* Subtitle */}
          <Animated.View entering={FadeIn.delay(80).duration(600)}>
            <Text className="text-muted text-base">
              Trennbare Verben meistern
            </Text>
          </Animated.View>
        </View>

        {/* ── Level cards ────────────────────────────────────────────────── */}
        <View className="px-5">
          {LEVEL_DEFS.map((def, i) => (
            <LevelCard
              key={def.level}
              def={def}
              animationIndex={i}
              records={getLevelProgress(def.level)}
              unlocked={isLevelUnlocked(def.level)}
              onPress={() => handleCardPress(def.level)}
            />
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  titleText: {
    fontSize: 40,
    fontWeight: "900",
    letterSpacing: -0.5,
    lineHeight: 46,
  },
  soundBtn: {
    width: 40,
    height: 40,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#1A2E35",
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: "#2C4551",
  },
  soundBtnIcon: {
    fontSize: 18,
  },
  streakBadge: {
    borderWidth: 1.5,
    borderColor: "#FF9600",
  },
  streakFlame: {
    fontSize: 20,
  },
  streakLabel: {
    color: "#FF9600",
    fontWeight: "700",
    fontSize: 13,
    marginLeft: 6,
    marginTop: 1, // optical alignment
  },
  streakNum: {
    color: "#FF9600",
    fontWeight: "900",
    fontSize: 18,
  },
  cardShadow: {
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.35,
    shadowRadius: 12,
    elevation: 8,
  },
});
