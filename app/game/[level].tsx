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
import { setPendingResult } from "@/utils/resultsStore";
import type { Sentence } from "@/data/types";

// ─── Layout constants ─────────────────────────────────────────────────────────

const { width: SCREEN_W } = Dimensions.get("window");
const H_PAD = 20;
const CLOSE_W = 40;
const SCORE_W = 68;
const BAR_GAPS = 8 * 2; // gap on each side of the bar
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
        withTiming(12, { duration: 55 }),
        withTiming(-9, { duration: 55 }),
        withTiming(9,  { duration: 55 }),
        withTiming(-5, { duration: 55 }),
        withTiming(0,  { duration: 55 }),
      );
    }
  }, [btnState]);

  const shakeStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: shakeX.value }],
  }));

  const isActive   = btnState === "correct" || btnState === "hint";
  const isWrong    = btnState === "wrong";
  const isDefault  = btnState === "idle" || btnState === "dimmed";

  const bgColor      = isActive ? C.correct : isWrong ? C.wrong : C.btnYellow;
  const borderColor  = isActive ? C.correctDark : isWrong ? C.wrongDark : C.btnYellowDk;
  const labelColor   = isDefault ? C.bg : C.foreground;
  const opacity      = btnState === "dimmed" ? 0.42 : 1;

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

// ─── SentenceDisplay ─────────────────────────────────────────────────────────
//
// Renders the sentence as nested <Text> components.
// Blank slots are displayed inline:
//   • idle    →  " ___ "  (muted colour)
//   • correct →  " auf- " (green, bold)
//   • wrong   →  " auf- " (red, bold)
//
// For Präsens the conjugated verb stem also fills its slot (auto, blue/bold).
// For Perfekt / Nebensatz the text after the blank (= stem) is bold blue.

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

  const blankWeight: "700" | "900" =
    answer.phase === "idle" ? "700" : "900";

  const blankNode = (
    <Text style={{ fontFamily: "Nunito_700Bold", color: blankColor, fontSize: 20 }}>
      {blankText}
    </Text>
  );

  if (sentence.tense === "praesens") {
    // parts = [before_verb_blank, between_blanks, after_prefix_blank]
    return (
      <Text style={S.sentenceText}>
        {parts[0]}
        {/* Auto-filled verb stem */}
        <Text style={S.verbChipText}>{sentence.conjugatedStem}</Text>
        {parts[1]}
        {/* Interactive prefix blank */}
        {blankNode}
        {parts[2]}
      </Text>
    );
  }

  // Perfekt / Nebensatz — parts = [before_prefix_blank, stem_text]
  return (
    <Text style={S.sentenceText}>
      {parts[0]}
      {blankNode}
      {/* Verb stem/participle after the blank — styled bold blue */}
      <Text style={S.stemChipText}>{parts[1]}</Text>
    </Text>
  );
}

// ─── GameRound ────────────────────────────────────────────────────────────────

interface GameRoundProps {
  level: 1 | 2 | 3 | 4;
  subLevel: 1 | 2 | 3 | 4 | 5;
}

function GameRound({ level, subLevel }: GameRoundProps) {
  const router = useRouter();
  const isMounted = useRef(true);
  useEffect(() => () => { isMounted.current = false; }, []);

  const {
    currentSentence,
    sentenceIndex,
    score,
    totalSentences,
    gameState,
    submitAnswer,
    stars,
    results,
  } = useGameEngine({ level, subLevel });

  // Hold last sentence visible during the result-animation delay
  const [displayedSentence, setDisplayedSentence] = useState<Sentence | null>(
    currentSentence,
  );
  useEffect(() => {
    if (currentSentence !== null) setDisplayedSentence(currentSentence);
  }, [currentSentence?.id]);

  // Shuffle options once per sentence
  const [options, setOptions] = useState<string[]>(["", "", "", ""]);
  useEffect(() => {
    if (currentSentence) {
      setOptions(
        shuffle([currentSentence.correctPrefix, ...currentSentence.distractors]),
      );
    }
  }, [currentSentence?.id]);

  // ── Answer state ────────────────────────────────────────────────────────────
  const [answer, setAnswer] = useState<AnswerState>(IDLE);
  const { playCorrect, playWrong } = useSound();

  // ── Translation toggle — reset on each new sentence ─────────────────────────
  const [showTranslation, setShowTranslation] = useState(false);
  useEffect(() => {
    setShowTranslation(false);
  }, [currentSentence?.id]);

  // ── Animations ──────────────────────────────────────────────────────────────

  // Progress bar (pixel width)
  const progressAnim = useSharedValue(0);
  useEffect(() => {
    progressAnim.value = withTiming(
      (sentenceIndex / totalSentences) * PROGRESS_TRACK_W,
      { duration: 500 },
    );
  }, [sentenceIndex]);
  const progressStyle = useAnimatedStyle(() => ({
    width: progressAnim.value,
  }));

  // Sentence card scale — pulses on correct answer
  const cardScale = useSharedValue(1);
  const cardStyle = useAnimatedStyle(() => ({
    transform: [{ scale: cardScale.value }],
  }));

  // ── Navigate when finished ──────────────────────────────────────────────────
  useEffect(() => {
    if (gameState === "finished") {
      setPendingResult({ level, subLevel, score, stars, results });
      router.replace({
        pathname: "/results",
        params: {
          level:    String(level),
          subLevel: String(subLevel),
          score:    String(score),
          stars:    String(stars),
        },
      });
    }
  }, [gameState]);

  // ── Handle tap ──────────────────────────────────────────────────────────────
  const handleOptionPress = useCallback(
    (prefix: string) => {
      if (answer.phase === "answering" || !currentSentence) return;

      const isCorrect = prefix === currentSentence.correctPrefix;

      setAnswer({
        phase: "answering",
        selectedPrefix: prefix,
        isCorrect,
        correctPrefix: currentSentence.correctPrefix,
      });

      // Sound + haptic
      if (isCorrect) { playCorrect(); } else { playWrong(); }
      Haptics.notificationAsync(
        isCorrect
          ? Haptics.NotificationFeedbackType.Success
          : Haptics.NotificationFeedbackType.Error,
      );

      // Card pulse on correct
      if (isCorrect) {
        cardScale.value = withSequence(
          withTiming(1.03, { duration: 110 }),
          withSpring(1,    { damping: 14, stiffness: 250 }),
        );
      }

      // Advance after delay
      const delay = isCorrect ? 800 : 1200;
      setTimeout(() => {
        if (!isMounted.current) return;
        submitAnswer(prefix);
        setAnswer(IDLE);
      }, delay);
    },
    [answer.phase, currentSentence, submitAnswer, cardScale, playCorrect, playWrong],
  );

  // ── Render ──────────────────────────────────────────────────────────────────
  if (!displayedSentence) return null;
  const isAnswering = answer.phase === "answering";

  return (
    <SafeAreaView className="flex-1 bg-background" edges={["top", "bottom"]}>
      <Stack.Screen options={{ headerShown: false }} />

      {/* ── Top bar ── */}
      <View style={[S.topBar, { paddingHorizontal: H_PAD }]}>

        {/* Close button */}
        <Pressable
          onPress={() => router.back()}
          style={S.closeBtn}
          accessibilityRole="button"
          accessibilityLabel="Spiel verlassen"
          hitSlop={8}
        >
          <Text style={S.closeBtnText}>✕</Text>
        </Pressable>

        {/* Progress track */}
        <View style={S.progressTrack}>
          <Animated.View style={[S.progressFill, progressStyle]} />
        </View>

        {/* Score badge */}
        <View style={S.scoreBadge}>
          <Text style={S.scoreNum}>{score}</Text>
          <Entypo name="star" size={30} color={C.btnYellow} style={{ marginBottom: 6 }} />
        </View>
      </View>

      {/* ── Sentence card ── */}
      <View className="flex-1 px-5 justify-center">
        {/* Outer view owns the enter animation; inner view owns the scale transform. */}
        {/* Combining both on one Animated.View causes a Reanimated conflict warning. */}
        <Animated.View key={displayedSentence.id} entering={FadeInDown.duration(350).springify()}>
          {/* Sentence counter — right-aligned above the card */}
          <Text style={[S.sentenceCounter, { marginBottom: 6 }]}>
            {sentenceIndex + 1} / {totalSentences}
          </Text>
          <Animated.View style={[S.sentenceCard, cardStyle]}>
            <SentenceDisplay sentence={displayedSentence} answer={answer} />
          </Animated.View>

          {/* Translate button + translation below card, right-aligned */}
          <View style={S.translationRow}>
            {showTranslation && (
              <Text style={S.translationText}>{displayedSentence.translation}</Text>
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
              disabled={isAnswering || opt === ""}
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
              disabled={isAnswering || opt === ""}
            />
          ))}
        </View>
      </View>
    </SafeAreaView>
  );
}

// ─── GameScreen (outer shell) ─────────────────────────────────────────────────
//
// Waits for progress to load, then picks the first incomplete subLevel for the
// given level. If all 5 subLevels are complete, replays from subLevel 1.

export default function GameScreen() {
  const { level: levelParam, subLevel: subLevelParam } = useLocalSearchParams<{
    level: string;
    subLevel?: string;
  }>();
  const level = Math.max(1, Math.min(4, parseInt(levelParam ?? "1", 10))) as
    | 1 | 2 | 3 | 4;

  const { isLoading, getLevelProgress } = useProgress();

  if (isLoading) {
    return (
      <SafeAreaView className="flex-1 bg-background items-center justify-center">
        <Stack.Screen options={{ headerShown: false }} />
        <Text className="text-muted text-base">Lädt…</Text>
      </SafeAreaView>
    );
  }

  let subLevel: 1 | 2 | 3 | 4 | 5;
  if (subLevelParam !== undefined) {
    subLevel = Math.max(1, Math.min(5, parseInt(subLevelParam, 10))) as 1 | 2 | 3 | 4 | 5;
  } else {
    const records = getLevelProgress(level);
    subLevel = (records.find((r) => !r.completed)?.subLevel ?? 1) as 1 | 2 | 3 | 4 | 5;
  }

  return <GameRound level={level} subLevel={subLevel} />;
}

// ─── Styles ───────────────────────────────────────────────────────────────────

const S = StyleSheet.create({
  // Top bar
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
    fontSize: 18,
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

  // Sentence counter
  sentenceCounter: {
    fontFamily: "Nunito_700Bold",
    color: C.muted,
    fontSize: 13,
    textAlign: "right",
  },

  // Sentence card
  sentenceCard: {
    backgroundColor: C.surface,
    borderRadius: 20,
    padding: 24,
    borderWidth: 1,
    borderColor: C.border,
    gap: 14,
    // Subtle shadow
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
  // Verb stem chip (Präsens: auto-filled first blank)
  verbChipText: {
    fontFamily: "Nunito_700Bold",
    color: C.stemColor,
    fontSize: 20,
  },
  // Stem text after prefix blank (Perfekt / Nebensatz)
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
    alignItems: "center",
    justifyContent: "flex-end",
    gap: 10,
    marginTop: 8,
    paddingHorizontal: 4,
  },

  // Options
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
