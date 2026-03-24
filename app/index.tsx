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
import { Ionicons } from "@expo/vector-icons";
import { FontAwesome6 } from "@expo/vector-icons";
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
    accent: "#D4A800",
    accentDark: "#B08E00",
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
  const dimmed = !unlocked;

  return (
    <Animated.View
      entering={FadeInDown.delay(animationIndex * 130).duration(500)}
      style={{ marginBottom: 14 }}
    >
      <Pressable
        onPress={onPress}
        disabled={!unlocked}
        accessibilityLabel={`Level ${def.level} ${def.cefr}: ${def.description}`}
        accessibilityRole="button"
        accessibilityState={{ disabled: !unlocked }}
        style={[
          styles.cardShadow,
          { shadowColor: dimmed ? "#000" : def.accent },
          {
            backgroundColor: dimmed ? "#1A2430" : def.accent,
            borderRadius: 18,
            borderBottomWidth: 5,
            borderBottomColor: dimmed ? "#111820" : def.accentDark,
          },
        ]}
      >
        <View style={{ paddingHorizontal: 18, paddingTop: 16, paddingBottom: 14 }}>

          {/* Title row */}
          <View style={{ flexDirection: "row", alignItems: "flex-start", marginBottom: 10 }}>
            <View style={{ flex: 1 }}>
              <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
                <Text style={[styles.cardTitle, { color: dimmed ? "#4A6070" : "#001d3d" }]}>
                  Level {def.level}
                </Text>
                {dimmed && <Ionicons name="lock-closed" size={14} color="#4A6070" />}

                {/* Stars — inline with title, pushed to the right */}
                <View style={{ flex: 1, flexDirection: "row", justifyContent: "flex-end", gap: 3 }}>
                  {[1, 2, 3].map((i) => (
                    <Text
                      key={i}
                      style={{
                        fontSize: 18,
                        color: dimmed ? "#3A5060" : totalStars >= i * 5 ? "#001d3d" : "rgba(0,29,61,0.3)",
                      }}
                    >
                      ★
                    </Text>
                  ))}
                </View>
              </View>
              <Text style={[styles.cardCefr, { color: dimmed ? "#3A5060" : "rgba(0,29,61,0.75)" }]}>
                {def.cefr}
              </Text>
              <Text style={[styles.cardDesc, { color: dimmed ? "#3A5060" : "rgba(0,29,61,0.65)" }]}>
                {def.description}
              </Text>
            </View>
          </View>

          {/* Progress bar + counter */}
          <View style={{ flexDirection: "row", alignItems: "center", gap: 10 }}>
            <View style={[styles.progressTrack, { backgroundColor: dimmed ? "#111820" : "rgba(0,29,61,0.2)" }]}>
              <View
                style={{
                  width: progressPct,
                  height: "100%",
                  backgroundColor: dimmed ? "#2C4551" : "rgba(0,29,61,0.5)",
                  borderRadius: 999,
                }}
              />
            </View>
            <Text style={[styles.progressLabel, { color: dimmed ? "#3A5060" : "rgba(0,29,61,0.7)" }]}>
              {completedCount}/5
            </Text>
          </View>
        </View>
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
  const { playUnlock } = useSound();

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
        <View className="px-6 pt-5 pb-6">

          {/* Top bar: Profile | Streak | Settings */}
          <Animated.View
            entering={FadeIn.delay(100).duration(500)}
            style={styles.topBar}
          >
            {/* Left: Profile */}
            <View style={styles.topBarSide}>
              <Pressable
                onPress={() => router.push("/profile")}
                accessibilityRole="button"
                accessibilityLabel="Profil öffnen"
                style={styles.iconBtn}
              >
                <Ionicons name="person" size={22} color="#1CB0F6" />
              </Pressable>
            </View>

            {/* Center: Streak badge */}
            <View style={styles.topBarCenter}>
              <View style={styles.streakBadge}>
                <Animated.View style={flameStyle}>
                  <FontAwesome6 name="fire" size={20} color="#FF9600" />
                </Animated.View>
                <Text style={styles.streakNum}>{currentStreak}</Text>
                <Text style={styles.streakLabel}>{currentStreak === 1 ? "Tag" : "Tage"}</Text>
              </View>
            </View>

            {/* Right: Settings */}
            <View style={[styles.topBarSide, { alignItems: "flex-end" }]}>
              <Pressable
                onPress={() => router.push("/settings")}
                accessibilityRole="button"
                accessibilityLabel="Einstellungen öffnen"
                style={styles.iconBtn}
              >
                <Ionicons name="settings" size={22} color="#1CB0F6" />
              </Pressable>
            </View>
          </Animated.View>

          {/* Title — centered, wide */}
          <Animated.View entering={FadeIn.duration(600)} style={{ alignItems: "center", marginTop: 20, marginBottom: 0 }}>
            <Text style={styles.titleText}>
              <Text style={{ color: "#1CB0F6" }}>Prä</Text>
              <Text style={{ color: "#FFC800" }}>Fix</Text>
            </Text>
          </Animated.View>

          {/* Subtitle */}
          <Animated.View entering={FadeIn.delay(80).duration(600)} style={{ alignItems: "center" }}>
            <Text className="text-muted text-base" style={{ fontFamily: "Nunito_400Regular" }}>
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
  topBar: {
    flexDirection: "row",
    alignItems: "center",
  },
  topBarSide: {
    flex: 1,
    alignItems: "flex-start",
  },
  topBarCenter: {
    flex: 1,
    alignItems: "center",
  },
  iconBtn: {
    width: 44,
    height: 44,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#0A2A4A",
    borderRadius: 10,
    borderWidth: 1.5,
    borderColor: "#2C4551",
    shadowColor: "#0A8FCF",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 3,
    elevation: 2,
  },
  titleText: {
    fontFamily: "GravitasOne_400Regular",
    fontSize: 52,
    letterSpacing: 3,
    lineHeight: 60,
    textAlign: "center",
  },
  streakBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 999,
    backgroundColor: "#1A2E35",
  },
  streakLabel: {
    fontFamily: "Nunito_700Bold",
    color: "#FF9600",
    fontSize: 14  ,
  },
  streakNum: {
    fontFamily: "GravitasOne_400Regular",
    color: "#FF9600",
    fontSize: 18,
    textAlignVertical: "center",
    includeFontPadding: false,
  },
  cardShadow: {
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.35,
    shadowRadius: 12,
    elevation: 8,
  },
  card: {
    flexDirection: "row",
    backgroundColor: "#1A2E35",
    borderRadius: 16,
    overflow: "hidden",
  },
  cardDimmed: {
    backgroundColor: "#111E24",
  },
  cardTitle: {
    fontFamily: "GravitasOne_400Regular",
    color: "#FFFFFF",
    fontSize: 20,
    lineHeight: 26,
  },
  cardCefr: {
    fontFamily: "Nunito_700Bold",
    fontSize: 14,
    marginTop: 2,
  },
  cardDesc: {
    fontFamily: "Nunito_400Regular",
    fontSize: 13,
    marginTop: 1,
  },
  progressTrack: {
    flex: 1,
    height: 7,
    backgroundColor: "#2C4551",
    borderRadius: 999,
    overflow: "hidden",
  },
  progressLabel: {
    fontFamily: "Nunito_700Bold",
    color: "#AFAFAF",
    fontSize: 12,
    minWidth: 24,
    textAlign: "right",
  },
  textDimmed: {
    color: "#5A7080",
  },
});
