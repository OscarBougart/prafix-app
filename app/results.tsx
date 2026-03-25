import {
  View,
  Text,
  Pressable,
  ScrollView,
  StyleSheet,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { BlurView } from "expo-blur";
import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import Animated, {
  FadeIn,
  FadeInDown,
} from "react-native-reanimated";
import * as Haptics from "expo-haptics";
import { useEffect, useRef, useState } from "react";

import { useProgress } from "@/hooks/useProgress"; // for streak only — mastery saved in game screen
import { useStreak } from "@/hooks/useStreak";
import { useRounds } from "@/hooks/useRounds";
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

// ─── Score quotes ─────────────────────────────────────────────────────────────

const QUOTES: Record<"terrible" | "bad" | "okay" | "good" | "perfect", string[]> = {
  terrible: [
    "Noch viel Luft nach oben!",
    "Das wird noch!",
    "Übung macht den Meister.",
    "Nicht aufgeben!",
    "Jeder fängt mal klein an.",
  ],
  bad: [
    "Du kommst näher!",
    "Weiter so, du schaffst das!",
    "Noch ein bisschen üben.",
    "Fast dabei!",
    "Nicht schlecht für den Anfang.",
  ],
  okay: [
    "Solide! Weiter üben.",
    "Ganz okay — du wirst besser!",
    "Mittelmäßig, aber auf dem Weg.",
    "Halbzeit! Jetzt richtig loslegen.",
    "Du bist auf dem richtigen Weg.",
  ],
  good: [
    "Sehr gut gemacht!",
    "Stark! Fast perfekt.",
    "Beeindruckend!",
    "Du kennst deine Präfixe.",
    "Fast makellos!",
  ],
  perfect: [
    "Perfekte Runde!",
    "Unglaublich! Alles richtig.",
    "Meisterhaft!",
    "Fehlerlos — Respekt!",
    "Du bist ein Präfix-Profi!",
  ],
};

function getQuote(score: number): string {
  const tier =
    score === 10 ? "perfect" :
    score >= 8   ? "good" :
    score >= 5   ? "okay" :
    score >= 3   ? "bad" :
                   "terrible";
  const pool = QUOTES[tier];
  return pool[Math.floor(Math.random() * pool.length)]!;
}

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
      style={S.sentenceRow}
    >
      {/* ✓ icon — only when correct */}
      {correct && (
        <View style={[S.iconBadge, { backgroundColor: C.correct, alignSelf: "center" }]}>
          <Text style={S.iconText}>✓</Text>
        </View>
      )}

      {/* Text block */}
      <View style={{ flex: 1 }}>
        <Text style={S.rowSentence}>{fullSentence}</Text>
        <Text style={S.rowTranslation}>{sentence.translation}</Text>

        {/* Wrong-answer detail */}
        {!correct && (
          <Text style={S.rowWrongLine}>
            <Text style={{ color: C.wrong }}>{answeredPrefix}</Text>
            {"  →  "}
            <Text style={{ color: C.correct }}>{sentence.correctPrefix}</Text>
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
    score: string;
    stars: string;
  }>();

  const level = Math.max(1, Math.min(4, parseInt(params.level ?? "1", 10))) as 1 | 2 | 3 | 4;
  const score = parseInt(params.score ?? "0", 10);
  const stars = parseInt(params.stars ?? "0", 10);

  // Consume sentence-level results from the module store (written by game screen)
  const roundRef = useRef<PendingRoundResult | null>(consumePendingResult());
  const sentenceResults: SentenceResult[] = roundRef.current?.results ?? [];
  const quote = useRef(getQuote(score)).current;

  // ── Hooks ──────────────────────────────────────────────────────────────────
  useProgress(); // keep hook mounted so mastery state stays live
  const { bumpStreak }        = useStreak();
  const { incrementRounds }   = useRounds();
  const { playLevelComplete } = useSound();

  // ── Save once on mount ─────────────────────────────────────────────────────
  const savedRef = useRef(false);
  useEffect(() => {
    if (savedRef.current) return;
    savedRef.current = true;
    incrementRounds();
    if (stars >= 1) {
      bumpStreak();
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    }
    const t = setTimeout(() => playLevelComplete(), 400);
    return () => clearTimeout(t);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const [retryPressed, setRetryPressed]       = useState(false);
  const [continuePressed, setContinuePressed] = useState(false);

  // ── Navigation ─────────────────────────────────────────────────────────────
  const handleRetry = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    router.replace({
      pathname: "/game/[level]",
      params: { level: String(level) },
    });
  };

  const handleContinue = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    router.replace("/");
  };

  // ── Render ─────────────────────────────────────────────────────────────────
  return (
    <SafeAreaView style={S.root} edges={["top", "bottom"]}>
      <Stack.Screen options={{ headerShown: false }} />

      {/* ── Header: score + quote ── */}
      <View style={S.header}>

        <Animated.View entering={FadeIn.duration(400)} style={S.scoreRow}>
          <Text style={S.scoreMain}>{score}</Text>
          <Text style={S.scoreDenom}> / 10</Text>
        </Animated.View>

        <Animated.Text
          entering={FadeInDown.delay(300).duration(400)}
          style={S.quoteText}
        >
          {quote}
        </Animated.Text>

      </View>

      {/* ── Sentence list ── */}
      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={S.listContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={S.outerCard}>
          <Text style={S.listLabel}>Ergebnisse</Text>

          {sentenceResults.map((result, i) => (
            <SentenceRow key={result.sentence.id} result={result} index={i} />
          ))}

          {sentenceResults.length === 0 && (
            <Text style={S.emptyMsg}>Keine Daten verfügbar.</Text>
          )}
        </View>
      </ScrollView>

      {/* ── Bottom buttons ── */}
      <Animated.View entering={FadeIn.delay(200).duration(600)} style={S.bottomBar}>
      <BlurView intensity={8} tint="dark" style={StyleSheet.absoluteFill} />
        {/* Nochmal — retry same level */}
        <Pressable
          onPress={handleRetry}
          onPressIn={() => setRetryPressed(true)}
          onPressOut={() => setRetryPressed(false)}
          accessibilityRole="button"
          accessibilityLabel="Nochmal spielen"
          style={[S.btn, S.btnOutline, {
            borderBottomWidth: retryPressed ? 0 : 4,
            borderLeftWidth: retryPressed ? 0 : 1.5,
            borderRightWidth: retryPressed ? 0 : 1.5,
            borderTopWidth: 0,
            transform: [{ translateY: retryPressed ? 4 : 0 }],
          }]}
        >
          <Text style={[S.btnText, { color: C.gold }]}>Nochmal</Text>
        </Pressable>

        {/* Weiter — back to home */}
        <Pressable
          onPress={handleContinue}
          onPressIn={() => setContinuePressed(true)}
          onPressOut={() => setContinuePressed(false)}
          accessibilityRole="button"
          accessibilityLabel="Zum Hauptmenü"
          style={[S.btn, S.btnFilled, {
            borderBottomWidth: continuePressed ? 0 : 4,
            borderLeftWidth: continuePressed ? 0 : 1.5,
            borderRightWidth: continuePressed ? 0 : 1.5,
            borderTopWidth: 0,
            transform: [{ translateY: continuePressed ? 4 : 0 }],
          }]}
        >
          <Text style={[S.btnText, { color: C.bg }]}>Fertig</Text>
        </Pressable>
      </Animated.View>
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
    borderBottomWidth: 0,
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
  quoteText: {
    fontFamily: "Nunito_700Bold",
    color: C.gold,
    fontSize: 16,
    marginTop: -2,
    textAlign: "center",
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
    padding: 16,
    paddingBottom: 100,
  },
  outerCard: {
    backgroundColor: C.surface,
    borderRadius: 20,
    padding: 16,
    borderWidth: 1,
    borderColor: C.border,
  },
  listLabel: {
    fontFamily: "Nunito_700Bold",
    color: C.foreground,
    fontSize: 15,
    marginBottom: 14,
  },
  sentenceRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 12,
    backgroundColor: C.bg,
    borderRadius: 12,
    padding: 14,
    marginBottom: 8,
  },
  iconBadge: {
    width: 26,
    height: 26,
    borderRadius: 13,
    alignItems: "center",
    justifyContent: "center",
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
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: "row",
    gap: 12,
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: "transparent",
  },
  btn: {
    flex: 1,
    height: 56,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
  },
  btnFilled: {
    backgroundColor: C.gold,
    borderColor: C.goldDark,
  },
  btnOutline: {
    backgroundColor: C.surface,
    borderColor: C.gold,
    borderBottomColor: C.goldDark,
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
