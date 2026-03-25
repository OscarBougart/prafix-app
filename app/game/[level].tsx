import {
  View,
  Text,
  Pressable,
  StyleSheet,
  Dimensions,
} from "react-native";
import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withSequence,
  withSpring,
  FadeInDown,
} from "react-native-reanimated";
import * as Haptics from "expo-haptics";
import { MaterialIcons, Entypo } from "@expo/vector-icons";
import { useState, useEffect, useCallback, useRef } from "react";

import { useGameEngine } from "@/hooks/useGameEngine";
import { useProgress } from "@/hooks/useProgress";
import { useSound } from "@/hooks/useSound";
import { useFavorites } from "@/hooks/useFavorites";
import { setPendingResult } from "@/utils/resultsStore";
import { allSentences } from "@/data/sentences";
import type { Sentence } from "@/data/types";

// ─── Layout constants ─────────────────────────────────────────────────────────

const { width: SCREEN_W } = Dimensions.get("window");
const H_PAD = 20;
const CLOSE_W = 44;
const SCORE_W = 68;
const BAR_GAPS = 8 * 2;
const PROGRESS_TRACK_W = SCREEN_W - H_PAD * 2 - CLOSE_W - SCORE_W - BAR_GAPS;

// ─── Palette ──────────────────────────────────────────────────────────────────

const C = {
  bg:          "#001d3d",
  surface:     "#1A2E35",
  border:      "#2C4551",
  correct:     "#58CC02",
  correctDark: "#46A302",
  wrong:       "#FF4B4B",
  wrongDark:   "#CC3333",
  btnYellow:   "#FFC800",
  btnYellowDk: "#E6B400",
  blue:        "#1CB0F6",
  blueDark:    "#0A8FCF",
  foreground:  "#FFFFFF",
  muted:       "#AFAFAF",
  stemColor:   "#1CB0F6",
  blankColor:  "#4A7090",
} as const;

// ─── Types ────────────────────────────────────────────────────────────────────

interface AnswerState {
  phase: "idle" | "answering";
  selectedPrefix: string;
  isCorrect: boolean;
  correctPrefix: string;
}

const IDLE: AnswerState = {
  phase: "idle",
  selectedPrefix: "",
  isCorrect: false,
  correctPrefix: "",
};

type BtnState = "idle" | "correct" | "wrong" | "hint" | "dimmed";

// ─── Helpers ──────────────────────────────────────────────────────────────────

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function getBtnState(option: string, answer: AnswerState): BtnState {
  if (answer.phase === "idle") return "idle";
  if (option === answer.selectedPrefix) return answer.isCorrect ? "correct" : "wrong";
  if (!answer.isCorrect && option === answer.correctPrefix) return "hint";
  return "dimmed";
}

// ─── OptionButton ─────────────────────────────────────────────────────────────

interface OptionButtonProps {
  option: string;
  btnState: BtnState;
  onPress: () => void;
  disabled: boolean;
}

function OptionButton({ option, btnState, onPress, disabled }: OptionButtonProps) {
  const shakeX = useSharedValue(0);

  useEffect(() => {
    if (btnState === "wrong") {
      shakeX.value = withSequence(
        withTiming(-12, { duration: 55 }),
        withTiming(12,  { duration: 55 }),
        withTiming(-9,  { duration: 55 }),
        withTiming(9,   { duration: 55 }),
        withTiming(-5,  { duration: 55 }),
        withTiming(0,   { duration: 55 }),
      );
    }
  }, [btnState]);

  const shakeStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: shakeX.value }],
  }));

  const isActive  = btnState === "correct" || btnState === "hint";
  const isWrong   = btnState === "wrong";
  const isDefault = btnState === "idle" || btnState === "dimmed";

  const bgColor     = isActive ? C.correct : isWrong ? C.wrong : C.btnYellow;
  const borderColor = isActive ? C.correctDark : isWrong ? C.wrongDark : C.btnYellowDk;
  const labelColor  = isDefault ? C.bg : C.foreground;
  const opacity     = btnState === "dimmed" ? 0.42 : 1;

  return (
    <Animated.View style={[{ flex: 1 }, shakeStyle]}>
      <Pressable
        onPress={onPress}
        disabled={disabled}
        accessibilityRole="button"
        accessibilityLabel={`${option} strich`}
        style={[
          S.optionBtn,
          { backgroundColor: bgColor, borderBottomColor: borderColor, opacity },
        ]}
      >
        <Text style={[S.optionBtnText, { color: labelColor }]}>{option}</Text>
      </Pressable>
    </Animated.View>
  );
}

// ─── SentenceDisplay ──────────────────────────────────────────────────────────

interface SentenceDisplayProps {
  sentence: Sentence;
  answer: AnswerState;
}

function SentenceDisplay({ sentence, answer }: SentenceDisplayProps) {
  const parts = sentence.template.split("_____");

  const blankText =
    answer.phase === "idle"
      ? " ___ "
      : ` ${answer.selectedPrefix} `;

  const blankColor =
    answer.phase === "idle"
      ? C.blankColor
      : answer.isCorrect
      ? C.correct
      : C.wrong;

  const blankNode = (
    <Text style={{ fontFamily: "Nunito_700Bold", color: blankColor, fontSize: 20 }}>
      {blankText}
    </Text>
  );

  if (sentence.tense === "praesens") {
    return (
      <Text style={S.sentenceText}>
        {parts[0]}
        <Text style={S.verbChipText}>{sentence.conjugatedStem}</Text>
        {parts[1]}
        {blankNode}
        {parts[2]}
      </Text>
    );
  }

  return (
    <Text style={S.sentenceText}>
      {parts[0]}
      {blankNode}
      <Text style={S.stemChipText}>{parts[1]}</Text>
    </Text>
  );
}

// ─── GameRound ────────────────────────────────────────────────────────────────

interface GameRoundProps {
  level: 1 | 2 | 3 | 4;
  sentences: Sentence[];
  trackMastery: boolean;
}

function GameRound({ level, sentences, trackMastery }: GameRoundProps) {
  const router   = useRouter();
  const isMounted = useRef(true);
  useEffect(() => () => { isMounted.current = false; }, []);

  const { updateVerbMastery } = useProgress();

  // Called at round end with net tally per verb
  const handleMasteryFlush = useCallback(
    (tally: Record<string, "correct" | "wrong" | "tie">) => {
      for (const [verb, result] of Object.entries(tally)) {
        if (result === "tie") continue;
        updateVerbMastery(verb, result === "correct");
      }
    },
    [updateVerbMastery],
  );

  const {
    currentSentence,
    sentenceIndex,
    score,
    totalSentences,
    gameState,
    submitAnswer,
    stars,
    results,
  } = useGameEngine({ sentences, trackMastery, onMasteryFlush: handleMasteryFlush });

  const [displayedSentence, setDisplayedSentence] = useState<Sentence | null>(
    currentSentence,
  );
  useEffect(() => {
    if (currentSentence !== null) setDisplayedSentence(currentSentence);
  }, [currentSentence?.id]);

  const [options, setOptions] = useState<string[]>(["", "", "", ""]);
  useEffect(() => {
    if (currentSentence) {
      setOptions(
        shuffle([currentSentence.correctPrefix, ...currentSentence.distractors]),
      );
    }
  }, [currentSentence?.id]);

  const [answer, setAnswer]           = useState<AnswerState>(IDLE);
  const { playCorrect, playWrong }    = useSound();
  const { isFavorite, toggleFavorite } = useFavorites();

  const [showTranslation, setShowTranslation] = useState(false);
  useEffect(() => {
    setShowTranslation(false);
  }, [currentSentence?.id]);

  // ── Progress bar ────────────────────────────────────────────────────────────
  const progressAnim = useSharedValue(0);
  useEffect(() => {
    progressAnim.value = withTiming(
      (sentenceIndex / totalSentences) * PROGRESS_TRACK_W,
      { duration: 500 },
    );
  }, [sentenceIndex]);
  const progressStyle = useAnimatedStyle(() => ({ width: progressAnim.value }));

  // ── Card scale pulse ─────────────────────────────────────────────────────────
  const cardScale = useSharedValue(1);
  const cardStyle = useAnimatedStyle(() => ({
    transform: [{ scale: cardScale.value }],
  }));

  // ── Navigate when finished ───────────────────────────────────────────────────
  useEffect(() => {
    if (gameState === "finished") {
      setPendingResult({ level, subLevel: 1, score, stars, results });
      router.replace({
        pathname: "/results",
        params: { level: String(level), score: String(score), stars: String(stars) },
      });
    }
  }, [gameState]);

  // ── Handle tap ───────────────────────────────────────────────────────────────
  const handleOptionPress = useCallback(
    (prefix: string) => {
      if (!currentSentence) return;

      if (answer.phase === "answering") {
        submitAnswer(answer.selectedPrefix);
        setAnswer(IDLE);
        return;
      }

      const isCorrect = prefix === currentSentence.correctPrefix;

      setAnswer({
        phase: "answering",
        selectedPrefix: prefix,
        isCorrect,
        correctPrefix: currentSentence.correctPrefix,
      });

      if (isCorrect) { playCorrect(); } else { playWrong(); }
      Haptics.notificationAsync(
        isCorrect
          ? Haptics.NotificationFeedbackType.Success
          : Haptics.NotificationFeedbackType.Error,
      );

      if (isCorrect) {
        cardScale.value = withSequence(
          withTiming(1.03, { duration: 110 }),
          withSpring(1, { damping: 14, stiffness: 250 }),
        );
      }
    },
    [answer, currentSentence, submitAnswer, cardScale, playCorrect, playWrong],
  );

  if (!displayedSentence) return null;
  const isAnswering = answer.phase === "answering";

  return (
    <SafeAreaView className="flex-1 bg-background" edges={["top", "bottom"]}>
      <Stack.Screen options={{ headerShown: false }} />

      {/* ── Top bar ── */}
      <View style={[S.topBar, { paddingHorizontal: H_PAD }]}>
        <Pressable
          onPress={() => router.back()}
          style={S.closeBtn}
          accessibilityRole="button"
          accessibilityLabel="Spiel verlassen"
          hitSlop={8}
        >
          <Text style={S.closeBtnText}>✕</Text>
        </Pressable>

        <View style={S.progressTrack}>
          <Animated.View style={[S.progressFill, progressStyle]}>
            <View style={S.progressShine} />
          </Animated.View>
        </View>

        <View style={S.scoreBadge}>
          <Text style={S.scoreNum}>{score}</Text>
          <Entypo name="star" size={30} color={C.btnYellow} style={{ marginBottom: 6 }} />
        </View>
      </View>

      {/* ── Sentence card ── */}
      <View className="flex-1 px-5 justify-center">
        <Animated.View key={displayedSentence.id} entering={FadeInDown.duration(350).springify()}>

          <View style={S.aboveCardRow}>
            <Text style={S.sentenceCounter}>
              {sentenceIndex + 1} / {totalSentences}
            </Text>
            {isAnswering && (
              <Pressable
                onPress={() => toggleFavorite(displayedSentence.id)}
                accessibilityRole="button"
                accessibilityLabel="Favorit umschalten"
                hitSlop={8}
              >
                <Entypo
                  name={isFavorite(displayedSentence.id) ? "heart" : "heart-outlined"}
                  size={24}
                  color={isFavorite(displayedSentence.id) ? C.wrong : C.muted}
                />
              </Pressable>
            )}
          </View>

          <Animated.View style={[S.sentenceCard, cardStyle]}>
            <SentenceDisplay sentence={displayedSentence} answer={answer} />
          </Animated.View>

          <View style={S.translationRow}>
            {showTranslation && (
              <Text style={[S.translationText, { flex: 1 }]}>{displayedSentence.translation}</Text>
            )}
            <Pressable
              onPress={() => setShowTranslation((v) => !v)}
              accessibilityRole="button"
              accessibilityLabel="Übersetzung umschalten"
              hitSlop={8}
            >
              <MaterialIcons name="translate" size={24} color={showTranslation ? C.blue : C.muted} />
            </Pressable>
          </View>

        </Animated.View>
      </View>

      {/* ── Option buttons (2×2 grid) ── */}
      <View style={[S.optionsContainer, { paddingHorizontal: H_PAD }]}>
        <View style={S.optionRow}>
          {options.slice(0, 2).map((opt, i) => (
            <OptionButton
              key={i}
              option={opt}
              btnState={getBtnState(opt, answer)}
              onPress={() => handleOptionPress(opt)}
              disabled={opt === ""}
            />
          ))}
        </View>
        <View style={S.optionRow}>
          {options.slice(2, 4).map((opt, i) => (
            <OptionButton
              key={i + 2}
              option={opt}
              btnState={getBtnState(opt, answer)}
              onPress={() => handleOptionPress(opt)}
              disabled={opt === ""}
            />
          ))}
        </View>
      </View>
    </SafeAreaView>
  );
}

// ─── GameScreen (outer shell) ─────────────────────────────────────────────────

export default function GameScreen() {
  const { level: levelParam, mode } = useLocalSearchParams<{
    level: string;
    mode?: "favorites" | "wrong";
  }>();
  const level = Math.max(1, Math.min(4, parseInt(levelParam ?? "1", 10))) as 1 | 2 | 3 | 4;

  const { isLoading, selectSentencesForRound, getMistakes } = useProgress();
  const { favoriteIds } = useFavorites();

  if (isLoading) {
    return (
      <SafeAreaView className="flex-1 bg-background items-center justify-center">
        <Stack.Screen options={{ headerShown: false }} />
        <Text className="text-muted text-base">Lädt…</Text>
      </SafeAreaView>
    );
  }

  // ── Favoriten mode ───────────────────────────────────────────────────────────
  if (mode === "favorites") {
    const customSentences = allSentences.filter((s) => favoriteIds.has(s.id));
    if (customSentences.length === 0) {
      return (
        <SafeAreaView className="flex-1 bg-background items-center justify-center" edges={["top", "bottom"]}>
          <Stack.Screen options={{ headerShown: false }} />
          <Text className="text-foreground text-lg" style={{ fontFamily: "Nunito_700Bold", marginBottom: 8 }}>
            Keine Favoriten
          </Text>
          <Text className="text-muted text-sm" style={{ fontFamily: "Nunito_400Regular" }}>
            Markiere Sätze im Spiel mit ♥
          </Text>
        </SafeAreaView>
      );
    }
    return <GameRound level={level} sentences={customSentences} trackMastery={false} />;
  }

  // ── Fehler üben mode ─────────────────────────────────────────────────────────
  if (mode === "wrong") {
    const mistakes = getMistakes();
    if (mistakes.length === 0) {
      return (
        <SafeAreaView className="flex-1 bg-background items-center justify-center" edges={["top", "bottom"]}>
          <Stack.Screen options={{ headerShown: false }} />
          <Text className="text-foreground text-lg" style={{ fontFamily: "Nunito_700Bold", marginBottom: 8 }}>
            Keine Fehler gespeichert
          </Text>
          <Text className="text-muted text-sm" style={{ fontFamily: "Nunito_400Regular" }}>
            Spiele eine Runde, um Fehler zu speichern
          </Text>
        </SafeAreaView>
      );
    }
    // Pick one random sentence per mistake verb (any level)
    const sentences: Sentence[] = [];
    for (const m of mistakes) {
      const pool = allSentences.filter((s) => s.verbInfinitive === m.verbInfinitive);
      if (pool.length > 0) {
        sentences.push(pool[Math.floor(Math.random() * pool.length)]!);
      }
    }
    return <GameRound level={level} sentences={sentences} trackMastery={false} />;
  }

  // ── Normal level play ────────────────────────────────────────────────────────
  const sentences = selectSentencesForRound(level);
  return <GameRound level={level} sentences={sentences} trackMastery={true} />;
}

// ─── Styles ───────────────────────────────────────────────────────────────────

const S = StyleSheet.create({
  topBar: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingTop: 6,
    paddingBottom: 4,
  },
  closeBtn: {
    width: CLOSE_W,
    height: 40,
    alignItems: "center",
    justifyContent: "center",
  },
  closeBtnText: {
    fontFamily: "Nunito_700Bold",
    color: C.muted,
    fontSize: 24,
  },
  progressTrack: {
    width: PROGRESS_TRACK_W,
    height: 14,
    backgroundColor: C.border,
    borderRadius: 99,
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    backgroundColor: C.blue,
    borderRadius: 99,
    overflow: "hidden",
  },
  progressShine: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: "50%",
    borderRadius: 99,
    backgroundColor: "rgba(255,255,255,0.22)",
  },
  scoreBadge: {
    width: SCORE_W,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-end",
    gap: 3,
  },
  scoreNum: {
    color: C.foreground,
    fontFamily: "Nunito_700Bold",
    fontSize: 18,
  },
  scoreStar: {
    fontSize: 16,
  },
  sentenceCounter: {
    fontFamily: "Nunito_700Bold",
    color: C.muted,
    fontSize: 13,
    textAlign: "right",
  },
  sentenceCard: {
    backgroundColor: C.surface,
    borderRadius: 20,
    padding: 24,
    borderWidth: 1,
    borderColor: C.border,
    gap: 14,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 12,
    elevation: 6,
  },
  sentenceText: {
    fontFamily: "Nunito_700Bold",
    color: C.foreground,
    fontSize: 20,
    lineHeight: 30,
  },
  verbChipText: {
    fontFamily: "Nunito_700Bold",
    color: C.stemColor,
    fontSize: 20,
  },
  stemChipText: {
    fontFamily: "Nunito_700Bold",
    color: C.stemColor,
    fontSize: 20,
  },
  divider: {
    height: 1,
    backgroundColor: C.border,
  },
  translationText: {
    fontFamily: "Nunito_400Regular",
    color: C.muted,
    fontSize: 14,
    fontStyle: "italic",
    lineHeight: 20,
  },
  translationRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "flex-end",
    gap: 10,
    marginTop: 8,
    paddingHorizontal: 4,
  },
  aboveCardRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 6,
    paddingHorizontal: 4,
  },
  tapToContinue: {
    fontFamily: "Nunito_400Regular",
    color: C.muted,
    fontSize: 12,
    textAlign: "center",
    marginTop: 6,
  },
  optionsContainer: {
    gap: 10,
    paddingTop: 8,
    paddingBottom: 12,
  },
  optionRow: {
    flexDirection: "row",
    gap: 10,
  },
  optionBtn: {
    height: 64,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
    borderBottomWidth: 4,
  },
  optionBtnText: {
    fontFamily: "Nunito_700Bold",
    fontSize: 17,
    letterSpacing: 0.2,
  },
});
