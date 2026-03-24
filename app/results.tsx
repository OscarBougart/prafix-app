import {
  View,
  Text,
  Pressable,
  ScrollView,
  StyleSheet,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withSpring,
  withSequence,
  withDelay,
  FadeIn,
  FadeInDown,
} from "react-native-reanimated";
import * as Haptics from "expo-haptics";
import { useEffect, useRef } from "react";

import { useProgress } from "@/hooks/useProgress";
import { useStreak } from "@/hooks/useStreak";
import { useSound } from "@/hooks/useSound";
import { consumePendingResult, type PendingRoundResult } from "@/utils/resultsStore";
import type { SentenceResult } from "@/hooks/useGameEngine";
import type { Sentence } from "@/data/types";

// ─── Palette ──────────────────────────────────────────────────────────────────

const C = {
  bg:          "#001d3d",
  surface:     "#1A2E35",
  border:      "#2C4551",
  correct:     "#58CC02",
  correctDark: "#46A302",
  wrong:       "#FF4B4B",
  gold:        "#FFC800",
  goldDark:    "#E6B400",
  blue:        "#1CB0F6",
  foreground:  "#FFFFFF",
  muted:       "#AFAFAF",
} as const;

// ─── Helpers ──────────────────────────────────────────────────────────────────

/** Reconstruct the full correct sentence by filling all blanks. */
function buildCorrectSentence(sentence: Sentence): string {
  const parts = sentence.template.split("_____");
  if (sentence.tense === "praesens") {
    // parts = [before_stem, between, after_prefix]
    return (
      (parts[0] ?? "") +
      sentence.conjugatedStem +
      (parts[1] ?? "") +
      sentence.correctPrefix +
      (parts[2] ?? "")
    );
  }
  // perfekt / nebensatz: parts = [before_prefix, stem_text]
  return (parts[0] ?? "") + sentence.correctPrefix + (parts[1] ?? "");
}

// ─── AnimatedStar ─────────────────────────────────────────────────────────────

interface AnimatedStarProps {
  filled: boolean;
  delay: number; // ms before the pop animation starts
}

function AnimatedStar({ filled, delay }: AnimatedStarProps) {
  const scale = useSharedValue(filled ? 0.1 : 1);
  const glowOpacity = useSharedValue(0);

  useEffect(() => {
    if (filled) {
      scale.value = withDelay(
        delay,
        withSequence(
          withSpring(1.5, { damping: 6, stiffness: 500 }),
          withSpring(1.0, { damping: 14, stiffness: 250 }),
        ),
      );
      glowOpacity.value = withDelay(delay, withTiming(0.5, { duration: 350 }));
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const scaleStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const glowStyle = useAnimatedStyle(() => ({
    opacity: glowOpacity.value,
  }));

  return (
    <View style={S.starWrapper}>
      {/* Gold glow halo behind the star */}
      <Animated.View style={[S.starGlow, glowStyle]} />
      {/* Star character */}
      <Animated.Text
        style={[S.starChar, { color: filled ? C.gold : C.border }, scaleStyle]}
      >
        ★
      </Animated.Text>
    </View>
  );
}

// ─── SentenceRow ──────────────────────────────────────────────────────────────

interface SentenceRowProps {
  result: SentenceResult;
  index: number;
}

function SentenceRow({ result, index }: SentenceRowProps) {
  const { correct, sentence, answeredPrefix } = result;
  const fullSentence = buildCorrectSentence(sentence);

  return (
    <Animated.View
      entering={FadeInDown.delay(index * 45).duration(320)}
      style={[S.sentenceRow, { borderLeftColor: correct ? C.correct : C.wrong }]}
    >
      {/* ✓ / ✗ icon */}
      <View style={[S.iconBadge, { backgroundColor: correct ? C.correct : C.wrong }]}>
        <Text style={S.iconText}>{correct ? "✓" : "✗"}</Text>
      </View>

      {/* Text block */}
      <View style={{ flex: 1 }}>
        <Text style={S.rowSentence}>{fullSentence}</Text>
        <Text style={S.rowTranslation}>{sentence.translation}</Text>

        {/* Wrong-answer detail */}
        {!correct && (
          <Text style={S.rowWrongLine}>
            <Text style={{ color: C.wrong }}>{answeredPrefix}-</Text>
            {"  →  "}
            <Text style={{ color: C.correct }}>{sentence.correctPrefix}-</Text>
          </Text>
        )}
      </View>
    </Animated.View>
  );
}

// ─── ResultsScreen ────────────────────────────────────────────────────────────

export default function ResultsScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{
    level: string;
    subLevel: string;
    score: string;
    stars: string;
  }>();

  const level    = Math.max(1, Math.min(4, parseInt(params.level    ?? "1", 10))) as 1 | 2 | 3 | 4;
  const subLevel = Math.max(1, Math.min(5, parseInt(params.subLevel ?? "1", 10))) as 1 | 2 | 3 | 4 | 5;
  const score    = parseInt(params.score ?? "0", 10);
  const stars    = parseInt(params.stars ?? "0", 10);

  // Consume sentence-level results from the module store (written by game screen)
  const roundRef = useRef<PendingRoundResult | null>(consumePendingResult());
  const sentenceResults: SentenceResult[] = roundRef.current?.results ?? [];

  // ── Hooks ──────────────────────────────────────────────────────────────────
  const { saveRoundResult }  = useProgress();
  const { bumpStreak }       = useStreak();
  const { playLevelComplete } = useSound();

  // ── Derived ────────────────────────────────────────────────────────────────
  const isLevelComplete = subLevel === 5 && stars >= 1;

  // ── Save once on mount ─────────────────────────────────────────────────────
  const savedRef = useRef(false);
  useEffect(() => {
    if (savedRef.current) return;
    savedRef.current = true;
    saveRoundResult(level, subLevel, score, stars);
    if (stars >= 1) {
      bumpStreak();
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    }
    // Delay gives expo-audio time to finish loading the asset before play() is called.
    // Play complete sound for any finished round (not just the final subLevel).
    const t = setTimeout(() => playLevelComplete(), 400);
    return () => clearTimeout(t);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ── Navigation ─────────────────────────────────────────────────────────────
  const handleRetry = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    router.replace({
      pathname: "/game/[level]",
      params: { level: String(level), subLevel: String(subLevel) },
    });
  };

  const handleContinue = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    if (subLevel < 5) {
      router.replace({
        pathname: "/game/[level]",
        params: { level: String(level), subLevel: String(subLevel + 1) },
      });
    } else if (isLevelComplete) {
      // Pass unlocked=next level so the home screen can play the unlock sound
      router.replace({
        pathname: "/",
        params: level < 4 ? { unlocked: String(level + 1) } : {},
      });
    } else {
      router.replace("/");
    }
  };

  // ── Render ─────────────────────────────────────────────────────────────────
  return (
    <SafeAreaView style={S.root} edges={["top", "bottom"]}>
      <Stack.Screen options={{ headerShown: false }} />

      {/* ── Header: score + stars ── */}
      <View style={S.header}>

        {/* Numeric score */}
        <Animated.View entering={FadeIn.duration(400)} style={S.scoreRow}>
          <Text style={S.scoreMain}>{score}</Text>
          <Text style={S.scoreDenom}> / 10</Text>
        </Animated.View>

        {/* Animated stars */}
        <Animated.View entering={FadeIn.delay(100).duration(400)} style={S.starsRow}>
          <AnimatedStar filled={stars >= 1} delay={300} />
          <AnimatedStar filled={stars >= 2} delay={600} />
          <AnimatedStar filled={stars >= 3} delay={900} />
        </Animated.View>

        {/* 0-star encouragement */}
        {stars === 0 && (
          <Animated.Text
            entering={FadeInDown.delay(600).duration(400)}
            style={S.retryMsg}
          >
            Versuch es nochmal! 💪
          </Animated.Text>
        )}

        {/* Level-complete celebration banner */}
        {isLevelComplete && (
          <Animated.View
            entering={FadeInDown.delay(1200).duration(500)}
            style={S.celebrationCard}
          >
            <Text style={S.celebrationIcon}>🏆</Text>
            <View style={{ flex: 1 }}>
              <Text style={S.celebrationTitle}>Level {level} abgeschlossen!</Text>
              <Text style={S.celebrationSub}>
                {level < 4 ? `Level ${level + 1} ist jetzt freigeschaltet →` : "Du hast alle Level gemeistert!"}
              </Text>
            </View>
          </Animated.View>
        )}
      </View>

      {/* ── Sentence list ── */}
      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={S.listContent}
        showsVerticalScrollIndicator={false}
      >
        <Text style={S.listLabel}>ERGEBNISSE</Text>

        {sentenceResults.map((result, i) => (
          <SentenceRow key={result.sentence.id} result={result} index={i} />
        ))}

        {sentenceResults.length === 0 && (
          <Text style={S.emptyMsg}>Keine Daten verfügbar.</Text>
        )}
      </ScrollView>

      {/* ── Bottom buttons ── */}
      <View style={S.bottomBar}>
        {/* Nochmal — retry same subLevel */}
        <Pressable
          onPress={handleRetry}
          style={[S.btn, S.btnOutline]}
          accessibilityRole="button"
          accessibilityLabel="Nochmal spielen"
        >
          <Text style={[S.btnText, { color: C.gold }]}>Nochmal</Text>
        </Pressable>

        {/* Weiter — next subLevel or home */}
        <Pressable
          onPress={handleContinue}
          style={[S.btn, S.btnFilled]}
          accessibilityRole="button"
          accessibilityLabel={subLevel < 5 ? "Zur nächsten Stufe" : "Zum Hauptmenü"}
        >
          <Text style={[S.btnText, { color: C.bg }]}>
            {subLevel < 5 ? "Weiter →" : "Fertig ✓"}
          </Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────

const S = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: C.bg,
  },

  // ── Header ──
  header: {
    paddingHorizontal: 24,
    paddingTop: 20,
    paddingBottom: 20,
    alignItems: "center",
    borderBottomWidth: 1,
    borderBottomColor: C.border,
  },
  scoreRow: {
    flexDirection: "row",
    alignItems: "baseline",
    marginBottom: 18,
  },
  scoreMain: {
    fontFamily: "GravitasOne_400Regular",
    fontSize: 88,
    color: C.foreground,
    lineHeight: 96,
  },
  scoreDenom: {
    fontFamily: "Nunito_400Regular",
    fontSize: 34,
    color: C.muted,
  },
  starsRow: {
    flexDirection: "row",
    gap: 4,
    marginBottom: 4,
  },
  starWrapper: {
    width: 76,
    height: 76,
    alignItems: "center",
    justifyContent: "center",
  },
  starGlow: {
    position: "absolute",
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: C.gold,
  },
  starChar: {
    fontSize: 50,
    lineHeight: 56,
  },
  retryMsg: {
    fontFamily: "Nunito_700Bold",
    color: C.muted,
    fontSize: 15,
    marginTop: 10,
  },

  // ── Celebration banner ──
  celebrationCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: C.surface,
    borderRadius: 16,
    padding: 16,
    marginTop: 16,
    gap: 12,
    width: "100%",
    borderWidth: 1.5,
    borderColor: C.gold,
  },
  celebrationIcon: {
    fontSize: 30,
  },
  celebrationTitle: {
    fontFamily: "GravitasOne_400Regular",
    color: C.gold,
    fontSize: 15,
    lineHeight: 20,
  },
  celebrationSub: {
    fontFamily: "Nunito_400Regular",
    color: C.muted,
    fontSize: 13,
    marginTop: 2,
    lineHeight: 17,
  },

  // ── Sentence list ──
  listContent: {
    padding: 20,
    paddingBottom: 16,
  },
  listLabel: {
    fontFamily: "Nunito_700Bold",
    color: C.muted,
    fontSize: 11,
    letterSpacing: 1.4,
    marginBottom: 14,
  },
  sentenceRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 12,
    backgroundColor: C.surface,
    borderRadius: 12,
    padding: 14,
    marginBottom: 10,
    borderLeftWidth: 3,
  },
  iconBadge: {
    width: 26,
    height: 26,
    borderRadius: 13,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 2,
    flexShrink: 0,
  },
  iconText: {
    fontFamily: "Nunito_700Bold",
    color: C.foreground,
    fontSize: 13,
  },
  rowSentence: {
    fontFamily: "Nunito_700Bold",
    color: C.foreground,
    fontSize: 15,
    lineHeight: 22,
    marginBottom: 3,
  },
  rowTranslation: {
    fontFamily: "Nunito_400Regular",
    color: C.muted,
    fontSize: 13,
    fontStyle: "italic",
    lineHeight: 18,
  },
  rowWrongLine: {
    fontFamily: "Nunito_400Regular",
    marginTop: 6,
    fontSize: 13,
    color: C.muted,
    lineHeight: 18,
  },

  // ── Bottom bar ──
  bottomBar: {
    flexDirection: "row",
    gap: 12,
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 8,
    borderTopWidth: 1,
    borderTopColor: C.border,
  },
  btn: {
    flex: 1,
    height: 56,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
    borderBottomWidth: 4,
  },
  btnFilled: {
    backgroundColor: C.gold,
    borderBottomColor: C.goldDark,
  },
  btnOutline: {
    backgroundColor: C.surface,
    borderBottomColor: C.border,
    borderWidth: 1.5,
    borderColor: C.gold,
  },
  btnText: {
    fontFamily: "Nunito_700Bold",
    fontSize: 16,
    letterSpacing: 0.3,
  },

  emptyMsg: {
    color: C.muted,
    textAlign: "center",
    marginTop: 24,
    fontSize: 14,
  },
});
