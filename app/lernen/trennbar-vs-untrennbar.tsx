import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Stack, useRouter } from "expo-router";
import Animated, { FadeIn, FadeInDown, ZoomIn } from "react-native-reanimated";
import * as Haptics from "expo-haptics";
import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";

// ─── Palette ──────────────────────────────────────────────────────────────────

const C = {
  bg:           "#001d3d",
  surface:      "#1A2E35",
  surfaceDark:  "#0F2030",
  border:       "#2C4551",
  fg:           "#FFFFFF",
  muted:        "#AFAFAF",
  green:        "#58CC02",
  greenBg:      "rgba(88,204,2,0.12)",
  greenBorder:  "rgba(88,204,2,0.35)",
  red:          "#FF4B4B",
  redBg:        "rgba(255,75,75,0.12)",
  redBorder:    "rgba(255,75,75,0.35)",
  gold:         "#FFC800",
  goldBg:       "rgba(255,200,0,0.12)",
  goldBorder:   "rgba(255,200,0,0.35)",
  blue:         "#1CB0F6",
  blueBg:       "rgba(28,176,246,0.12)",
} as const;

// ─── Section 1 data ───────────────────────────────────────────────────────────

// ─── Section 2: Comparison table rows ────────────────────────────────────────

const TABLE_ROWS = [
  { label: "Präfixe",    trennbar: "ab-, an-, auf-, aus-, ein-...", untrennbar: "be-, ent-, er-, ver-, zer-..." },
  { label: "Betonung",   trennbar: "auf dem PRÄFIX",                 untrennbar: "auf dem STAMM" },
  { label: "Hauptsatz",  trennbar: "Präfix am Satzende",             untrennbar: "keine Trennung" },
  { label: "Partizip II",trennbar: "Präfix + ge + Stamm + t",        untrennbar: "KEIN \"ge\"!" },
  { label: "Beispiel",   trennbar: "Ich stehe früh auf.",            untrennbar: "Ich verstehe dich." },
  { label: "Partizip",   trennbar: "aufgestanden",                   untrennbar: "verstanden" },
];

// ─── Section 3 data ───────────────────────────────────────────────────────────

const TRENNBAR_PREFIXES = [
  "ab-","an-","auf-","aus-","bei-","ein-","fest-",
  "her-","hin-","los-","mit-","nach-","um-*",
  "vor-","weg-","zu-","zurück-","zusammen-",
];

const UNTRENNBAR_PREFIXES = [
  "be-","emp-","ent-","er-","ge-","miss-","ver-","zer-",
];

interface WechselDef {
  prefix: string;
  trennbarEx: string;
  trennbarEn: string;
  untrennbarEx: string;
  untrennbarEn: string;
}

const WECHSEL: WechselDef[] = [
  {
    prefix: "durch-",
    trennbarEx:    "Er bricht die Stifte durch.",
    trennbarEn:    "He breaks the pens in half (physical)",
    untrennbarEx:  "Er durchbricht die Wellen.",
    untrennbarEn:  "He breaks through the waves (figurative)",
  },
  {
    prefix: "über-",
    trennbarEx:    "Das Glas läuft über.",
    trennbarEn:    "The glass overflows (physical)",
    untrennbarEx:  "Sie überläuft die feindliche Linie.",
    untrennbarEn:  "She crosses the enemy line (abstract)",
  },
  {
    prefix: "um-",
    trennbarEx:    "Ich fahre den Poller um.",
    trennbarEn:    "I knock over the bollard (physical)",
    untrennbarEx:  "Ich umfahre den Stau.",
    untrennbarEn:  "I drive around the traffic jam (avoiding)",
  },
  {
    prefix: "unter-",
    trennbarEx:    "Die Schwerkraft drückt ihn unter.",
    trennbarEn:    "Gravity pushes him under (physical)",
    untrennbarEx:  "Er unterdrückt seine Gefühle.",
    untrennbarEn:  "He suppresses his feelings (abstract)",
  },
  {
    prefix: "wider-",
    trennbarEx:    "Das spiegelt meine Meinung wider.",
    trennbarEn:    "That reflects my opinion",
    untrennbarEx:  "Sie widersteht der Versuchung.",
    untrennbarEn:  "She resists the temptation",
  },
  {
    prefix: "wieder-",
    trennbarEx:    "Ich hole den Ball wieder.",
    trennbarEn:    "I retrieve the ball (getting back)",
    untrennbarEx:  "Ich wiederhole die Aufgabe.",
    untrennbarEn:  "I repeat the exercise (doing again)",
  },
];

// ─── Section 4: Quick test data ───────────────────────────────────────────────

type Answer = "trennbar" | "untrennbar";

interface QuizItem {
  verb: string;
  correct: Answer | "both";
  explanation: string;
}

const QUIZ: QuizItem[] = [
  { verb: "verstehen",  correct: "untrennbar", explanation: "ver- ist immer untrennbar." },
  { verb: "aufräumen",  correct: "trennbar",   explanation: "auf- ist immer trennbar." },
  { verb: "beginnen",   correct: "untrennbar", explanation: "be- ist immer untrennbar." },
  { verb: "mitkommen",  correct: "trennbar",   explanation: "mit- ist immer trennbar." },
  { verb: "übersetzen", correct: "both",       explanation: "über- ist ein Wechselpräfix — je nach Bedeutung und Betonung." },
];

// ─── Sub-components ──────────────────────────────────────────────────────────

function SectionHeader({ title }: { title: string }) {
  return (
    <View style={S.sectionHeader}>
      <Text style={S.sectionTitle}>{title}</Text>
    </View>
  );
}

// Section 1: Stress Rule
function StressRuleSection() {
  return (
    <Animated.View entering={FadeInDown.delay(80).duration(400)}>
      <View style={S.stressCard}>
        {/* Trennbar stress */}
        <View style={[S.stressRow, { borderBottomWidth: 1, borderBottomColor: C.border, paddingBottom: 16, marginBottom: 16 }]}>
          <View style={[S.stressBadge, { backgroundColor: C.greenBg, borderColor: C.greenBorder }]}>
            <Text style={[S.stressBadgeText, { color: C.green }]}>TRENNBAR</Text>
          </View>
          <View style={S.stressTextBlock}>
            <Text style={S.stressRuleText}>
              Betonung liegt auf dem{" "}
              <Text style={{ color: C.green, fontFamily: "Nunito_700Bold" }}>PRÄFIX</Text>
            </Text>
            <View style={S.stressWordRow}>
              <Text style={[S.stressWord, { color: C.green }]}>AUF</Text>
              <Text style={S.stressWord}>machen</Text>
            </View>
            <Text style={S.stressEx}>→ "Ich mache die Tür auf."</Text>
          </View>
        </View>

        {/* Untrennbar stress */}
        <View style={S.stressRow}>
          <View style={[S.stressBadge, { backgroundColor: C.redBg, borderColor: C.redBorder }]}>
            <Text style={[S.stressBadgeText, { color: C.red }]}>UNTRENNBAR</Text>
          </View>
          <View style={S.stressTextBlock}>
            <Text style={S.stressRuleText}>
              Betonung liegt auf dem{" "}
              <Text style={{ color: C.red, fontFamily: "Nunito_700Bold" }}>STAMM</Text>
            </Text>
            <View style={S.stressWordRow}>
              <Text style={S.stressWord}>ver</Text>
              <Text style={[S.stressWord, { color: C.red }]}>STE</Text>
              <Text style={S.stressWord}>hen</Text>
            </View>
            <Text style={S.stressEx}>→ "Ich verstehe dich."</Text>
          </View>
        </View>
      </View>
    </Animated.View>
  );
}

// Section 2: Comparison table
function ComparisonTable() {
  return (
    <Animated.View entering={FadeInDown.delay(160).duration(400)}>
      <View style={S.tableCard}>
        {/* Table header */}
        <View style={[S.tableRow, S.tableHeaderRow]}>
          <Text style={[S.tableCell, S.tableLabelCell, S.tableHeaderText]} />
          <Text style={[S.tableCell, S.tableHeaderText, { color: C.green }]}>Trennbar</Text>
          <Text style={[S.tableCell, S.tableHeaderText, { color: C.red }]}>Untrennbar</Text>
        </View>

        {TABLE_ROWS.map((row, i) => (
          <View
            key={row.label}
            style={[
              S.tableRow,
              i % 2 === 0 && { backgroundColor: "rgba(0,0,0,0.15)" },
              i === TABLE_ROWS.length - 1 && { borderBottomWidth: 0 },
            ]}
          >
            <Text style={[S.tableCell, S.tableLabelCell]}>{row.label}</Text>
            <Text style={[S.tableCell, S.tableCellText, { color: "rgba(88,204,2,0.9)" }]}>
              {row.trennbar}
            </Text>
            <Text style={[S.tableCell, S.tableCellText, { color: "rgba(255,75,75,0.9)" }]}>
              {row.untrennbar}
            </Text>
          </View>
        ))}
      </View>
    </Animated.View>
  );
}

// Section 3: Prefix groups
function PrefixGroupsSection() {
  return (
    <Animated.View entering={FadeInDown.delay(240).duration(400)} style={{ gap: 12 }}>
      {/* Always trennbar */}
      <View style={[S.groupCard, { borderColor: C.greenBorder }]}>
        <Text style={[S.groupTitle, { color: C.green }]}>Immer trennbar</Text>
        <View style={S.chipRow}>
          {TRENNBAR_PREFIXES.map((p) => (
            <View key={p} style={[S.chip, { backgroundColor: C.greenBg, borderColor: C.greenBorder }]}>
              <Text style={[S.chipText, { color: C.green }]}>{p}</Text>
            </View>
          ))}
        </View>
      </View>

      {/* Always untrennbar */}
      <View style={[S.groupCard, { borderColor: C.redBorder }]}>
        <Text style={[S.groupTitle, { color: C.red }]}>Immer untrennbar</Text>
        <View style={S.chipRow}>
          {UNTRENNBAR_PREFIXES.map((p) => (
            <View key={p} style={[S.chip, { backgroundColor: C.redBg, borderColor: C.redBorder }]}>
              <Text style={[S.chipText, { color: C.red }]}>{p}</Text>
            </View>
          ))}
        </View>
        <View style={S.noteRow}>
          <Ionicons name="information-circle" size={14} color={C.muted} />
          <Text style={S.noteText}>Kein 'ge' im Partizip II!</Text>
        </View>
      </View>

      {/* Wechselpräfixe */}
      <View style={[S.groupCard, { borderColor: C.goldBorder }]}>
        <View style={S.groupTitleRow}>
          <Ionicons name="warning" size={16} color={C.gold} />
          <Text style={[S.groupTitle, { color: C.gold }]}>Wechselpräfixe</Text>
        </View>
        <View style={S.chipRow}>
          {WECHSEL.map((w) => (
            <View key={w.prefix} style={[S.chip, { backgroundColor: C.goldBg, borderColor: C.goldBorder }]}>
              <Text style={[S.chipText, { color: C.gold }]}>{w.prefix}</Text>
            </View>
          ))}
        </View>
        <Text style={S.wechselExplain}>
          Diese Präfixe ändern ihr Verhalten je nach Bedeutung. Konkrete/physische Bedeutung = trennbar (Betonung auf Präfix). Abstrakte Bedeutung = untrennbar (Betonung auf Stamm).
        </Text>

        {WECHSEL.map((w) => (
          <View key={w.prefix} style={S.wechselItem}>
            <Text style={[S.wechselPrefix, { color: C.gold }]}>{w.prefix}</Text>
            <View style={[S.wechselRow, { backgroundColor: C.greenBg, borderColor: C.greenBorder }]}>
              <View style={[S.wechselBadge, { backgroundColor: C.greenBg }]}>
                <Text style={[S.wechselBadgeText, { color: C.green }]}>T</Text>
              </View>
              <View style={{ flex: 1 }}>
                <Text style={S.wechselSentence}>{w.trennbarEx}</Text>
                <Text style={S.wechselEn}>{w.trennbarEn}</Text>
              </View>
            </View>
            <View style={[S.wechselRow, { backgroundColor: C.redBg, borderColor: C.redBorder }]}>
              <View style={[S.wechselBadge, { backgroundColor: C.redBg }]}>
                <Text style={[S.wechselBadgeText, { color: C.red }]}>U</Text>
              </View>
              <View style={{ flex: 1 }}>
                <Text style={S.wechselSentence}>{w.untrennbarEx}</Text>
                <Text style={S.wechselEn}>{w.untrennbarEn}</Text>
              </View>
            </View>
          </View>
        ))}
      </View>
    </Animated.View>
  );
}

// Section 4: Quick test
type QuizState =
  | { phase: "question"; index: number }
  | { phase: "result"; index: number; picked: Answer; correct: boolean; isBoth: boolean }
  | { phase: "done"; score: number };

function QuickTestSection() {
  const [state, setState] = useState<QuizState>({ phase: "question", index: 0 });

  const handleAnswer = (picked: Answer) => {
    if (state.phase !== "question") return;
    const item = QUIZ[state.index]!;
    const isBoth = item.correct === "both";
    const correct = isBoth || item.correct === picked;
    Haptics.notificationAsync(
      correct
        ? Haptics.NotificationFeedbackType.Success
        : Haptics.NotificationFeedbackType.Error,
    );
    setState({ phase: "result", index: state.index, picked, correct, isBoth });
  };

  const handleNext = () => {
    if (state.phase !== "result") return;
    const nextIndex = state.index + 1;
    if (nextIndex >= QUIZ.length) {
      // count correct answers — both always counts as correct
      const score = QUIZ.filter((q) => q.correct === "both").length +
        QUIZ.filter((q) => q.correct !== "both").length; // simplified — all advance
      setState({ phase: "done", score: QUIZ.length });
    } else {
      setState({ phase: "question", index: nextIndex });
    }
  };

  const handleRestart = () => setState({ phase: "question", index: 0 });

  if (state.phase === "done") {
    return (
      <Animated.View entering={ZoomIn.duration(400)} style={S.quizDoneCard}>
        <Text style={S.quizDoneEmoji}>🎉</Text>
        <Text style={S.quizDoneTitle}>Geschafft!</Text>
        <Text style={S.quizDoneSub}>Du hast alle 5 Verben beantwortet.</Text>
        <Pressable onPress={handleRestart} style={S.quizRestartBtn}>
          <Text style={S.quizRestartText}>Nochmal</Text>
        </Pressable>
      </Animated.View>
    );
  }

  const currentIndex = state.phase === "question" ? state.index : state.index;
  const item = QUIZ[currentIndex]!;

  return (
    <Animated.View entering={FadeInDown.delay(320).duration(400)} style={S.quizCard}>
      {/* Progress */}
      <View style={S.quizProgressRow}>
        {QUIZ.map((_, i) => (
          <View
            key={i}
            style={[
              S.quizProgressDot,
              i < currentIndex && { backgroundColor: C.green },
              i === currentIndex && { backgroundColor: C.blue },
            ]}
          />
        ))}
      </View>

      {/* Verb */}
      <Text style={S.quizVerb}>{item.verb}</Text>
      <Text style={S.quizPrompt}>{currentIndex + 1} / {QUIZ.length}</Text>

      {/* Result feedback */}
      {state.phase === "result" && (
        <Animated.View entering={FadeIn.duration(250)} style={[
          S.quizFeedback,
          state.isBoth
            ? { backgroundColor: C.goldBg, borderColor: C.goldBorder }
            : state.correct
            ? { backgroundColor: C.greenBg, borderColor: C.greenBorder }
            : { backgroundColor: C.redBg, borderColor: C.redBorder },
        ]}>
          <Text style={[
            S.quizFeedbackResult,
            state.isBoth ? { color: C.gold } : state.correct ? { color: C.green } : { color: C.red },
          ]}>
            {state.isBoth ? "Beides möglich! ★" : state.correct ? "Richtig! ✓" : "Falsch ✗"}
          </Text>
          <Text style={S.quizFeedbackExplain}>{item.explanation}</Text>
          <Pressable onPress={handleNext} style={S.quizNextBtn}>
            <Text style={S.quizNextText}>
              {currentIndex + 1 < QUIZ.length ? "Weiter" : "Fertig"}
            </Text>
            <Ionicons name="arrow-forward" size={16} color={C.bg} />
          </Pressable>
        </Animated.View>
      )}

      {/* Buttons */}
      {state.phase === "question" && (
        <View style={S.quizBtnRow}>
          <Pressable
            onPress={() => handleAnswer("trennbar")}
            style={({ pressed }) => [S.quizBtn, S.quizBtnGreen, pressed && { opacity: 0.8 }]}
            accessibilityRole="button"
            accessibilityLabel="Trennbar"
          >
            <Text style={S.quizBtnText}>Trennbar</Text>
          </Pressable>
          <Pressable
            onPress={() => handleAnswer("untrennbar")}
            style={({ pressed }) => [S.quizBtn, S.quizBtnRed, pressed && { opacity: 0.8 }]}
            accessibilityRole="button"
            accessibilityLabel="Untrennbar"
          >
            <Text style={S.quizBtnText}>Untrennbar</Text>
          </Pressable>
        </View>
      )}
    </Animated.View>
  );
}

// ─── Main screen ──────────────────────────────────────────────────────────────

export default function TrennbarVsUntrennbarScreen() {
  const router = useRouter();

  return (
    <SafeAreaView style={S.root} edges={["top", "bottom"]}>
      <Stack.Screen options={{ headerShown: false }} />

      {/* Header */}
      <View style={S.header}>
        <Pressable
          onPress={() => router.back()}
          style={S.backBtn}
          accessibilityRole="button"
          accessibilityLabel="Zurück"
        >
          <Ionicons name="arrow-back" size={22} color={C.fg} />
        </Pressable>
        <Text style={S.headerTitle}>Trennbar vs. Untrennbar</Text>
        <View style={S.backBtn} />
      </View>

      <ScrollView
        contentContainerStyle={S.listContent}
        showsVerticalScrollIndicator={false}
      >
        <SectionHeader title="1. Die Betonungsregel" />
        <StressRuleSection />

        <SectionHeader title="2. Vergleichstabelle" />
        <ComparisonTable />

        <SectionHeader title="3. Präfix-Gruppen" />
        <PrefixGroupsSection />

        <SectionHeader title="4. Schnelltest — Trennbar oder nicht?" />
        <QuickTestSection />
      </ScrollView>
    </SafeAreaView>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────

const S = StyleSheet.create({
  root: { flex: 1, backgroundColor: C.bg },

  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: C.border,
  },
  backBtn: { width: 44, height: 44, alignItems: "center", justifyContent: "center" },
  headerTitle: {
    flex: 1,
    fontFamily: "Nunito_700Bold",
    fontSize: 16,
    color: C.fg,
    textAlign: "center",
  },

  listContent: {
    padding: 16,
    gap: 12,
    paddingBottom: 40,
  },

  sectionHeader: {
    marginTop: 8,
    marginBottom: 4,
  },
  sectionTitle: {
    fontFamily: "Nunito_700Bold",
    fontSize: 14,
    color: C.muted,
    textTransform: "uppercase",
    letterSpacing: 1,
  },

  // ── Section 1: Stress Rule ──
  stressCard: {
    backgroundColor: C.surface,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: C.border,
    borderBottomWidth: 4,
    borderBottomColor: "#0A1A22",
    padding: 16,
  },
  stressRow: {
    flexDirection: "row",
    gap: 12,
    alignItems: "flex-start",
  },
  stressBadge: {
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 4,
    alignSelf: "flex-start",
    minWidth: 90,
    alignItems: "center",
  },
  stressBadgeText: {
    fontFamily: "Nunito_700Bold",
    fontSize: 11,
    letterSpacing: 0.5,
  },
  stressTextBlock: {
    flex: 1,
    gap: 4,
  },
  stressRuleText: {
    fontFamily: "Nunito_400Regular",
    fontSize: 13,
    color: C.muted,
    lineHeight: 19,
  },
  stressWordRow: {
    flexDirection: "row",
    gap: 1,
    alignItems: "baseline",
  },
  stressWord: {
    fontFamily: "Nunito_700Bold",
    fontSize: 22,
    color: C.fg,
    lineHeight: 28,
  },
  stressEx: {
    fontFamily: "Nunito_400Regular",
    fontSize: 12,
    color: C.muted,
    fontStyle: "italic",
  },

  // ── Section 2: Table ──
  tableCard: {
    backgroundColor: C.surface,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: C.border,
    borderBottomWidth: 4,
    borderBottomColor: "#0A1A22",
    overflow: "hidden",
  },
  tableHeaderRow: {
    backgroundColor: C.surfaceDark,
    borderBottomWidth: 1,
    borderBottomColor: C.border,
  },
  tableRow: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: C.border,
    minHeight: 44,
    alignItems: "center",
  },
  tableCell: {
    flex: 1,
    paddingHorizontal: 10,
    paddingVertical: 8,
  },
  tableLabelCell: {
    flex: 0.8,
    fontFamily: "Nunito_700Bold",
    fontSize: 12,
    color: C.muted,
  },
  tableHeaderText: {
    fontFamily: "Nunito_700Bold",
    fontSize: 13,
    color: C.fg,
  },
  tableCellText: {
    fontFamily: "Nunito_400Regular",
    fontSize: 12,
    lineHeight: 18,
  },

  // ── Section 3: Groups ──
  groupCard: {
    backgroundColor: C.surface,
    borderRadius: 18,
    borderWidth: 1,
    borderBottomWidth: 4,
    borderBottomColor: "#0A1A22",
    padding: 16,
    gap: 10,
  },
  groupTitleRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  groupTitle: {
    fontFamily: "Nunito_700Bold",
    fontSize: 15,
  },
  chipRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  chip: {
    borderWidth: 1,
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 5,
  },
  chipText: {
    fontFamily: "Nunito_700Bold",
    fontSize: 13,
  },
  noteRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  noteText: {
    fontFamily: "Nunito_400Regular",
    fontSize: 12,
    color: C.muted,
    fontStyle: "italic",
  },
  wechselExplain: {
    fontFamily: "Nunito_400Regular",
    fontSize: 13,
    color: C.muted,
    lineHeight: 20,
  },
  wechselItem: {
    borderTopWidth: 1,
    borderTopColor: C.border,
    paddingTop: 12,
    gap: 6,
  },
  wechselPrefix: {
    fontFamily: "Nunito_700Bold",
    fontSize: 15,
    marginBottom: 2,
  },
  wechselRow: {
    flexDirection: "row",
    borderWidth: 1,
    borderRadius: 10,
    padding: 10,
    gap: 10,
    alignItems: "flex-start",
  },
  wechselBadge: {
    width: 22,
    height: 22,
    borderRadius: 11,
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },
  wechselBadgeText: {
    fontFamily: "Nunito_700Bold",
    fontSize: 12,
  },
  wechselSentence: {
    fontFamily: "Nunito_700Bold",
    fontSize: 13,
    color: C.fg,
    lineHeight: 18,
  },
  wechselEn: {
    fontFamily: "Nunito_400Regular",
    fontSize: 12,
    color: C.muted,
    fontStyle: "italic",
    lineHeight: 17,
  },

  // ── Section 4: Quiz ──
  quizCard: {
    backgroundColor: C.surface,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: C.border,
    borderBottomWidth: 4,
    borderBottomColor: "#0A1A22",
    padding: 20,
    alignItems: "center",
    gap: 16,
  },
  quizProgressRow: {
    flexDirection: "row",
    gap: 6,
  },
  quizProgressDot: {
    width: 28,
    height: 6,
    borderRadius: 3,
    backgroundColor: C.border,
  },
  quizVerb: {
    fontFamily: "Nunito_700Bold",
    fontSize: 32,
    color: C.fg,
    textAlign: "center",
  },
  quizPrompt: {
    fontFamily: "Nunito_400Regular",
    fontSize: 13,
    color: C.muted,
    marginTop: -8,
  },
  quizBtnRow: {
    flexDirection: "row",
    gap: 12,
    width: "100%",
  },
  quizBtn: {
    flex: 1,
    height: 52,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
    borderBottomWidth: 4,
  },
  quizBtnGreen: {
    backgroundColor: C.green,
    borderColor: "#46A302",
    borderBottomColor: "#46A302",
  },
  quizBtnRed: {
    backgroundColor: C.red,
    borderColor: "#E63939",
    borderBottomColor: "#E63939",
  },
  quizBtnText: {
    fontFamily: "Nunito_700Bold",
    fontSize: 15,
    color: C.bg,
  },
  quizFeedback: {
    width: "100%",
    borderWidth: 1,
    borderRadius: 14,
    padding: 14,
    gap: 8,
    alignItems: "center",
  },
  quizFeedbackResult: {
    fontFamily: "Nunito_700Bold",
    fontSize: 18,
  },
  quizFeedbackExplain: {
    fontFamily: "Nunito_400Regular",
    fontSize: 13,
    color: C.muted,
    textAlign: "center",
    lineHeight: 19,
  },
  quizNextBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: C.gold,
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
    marginTop: 4,
  },
  quizNextText: {
    fontFamily: "Nunito_700Bold",
    fontSize: 14,
    color: C.bg,
  },
  quizDoneCard: {
    backgroundColor: C.surface,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: C.border,
    padding: 28,
    alignItems: "center",
    gap: 10,
  },
  quizDoneEmoji: { fontSize: 40 },
  quizDoneTitle: {
    fontFamily: "Nunito_700Bold",
    fontSize: 24,
    color: C.fg,
  },
  quizDoneSub: {
    fontFamily: "Nunito_400Regular",
    fontSize: 14,
    color: C.muted,
    textAlign: "center",
  },
  quizRestartBtn: {
    marginTop: 8,
    backgroundColor: C.gold,
    paddingHorizontal: 28,
    paddingVertical: 12,
    borderRadius: 20,
  },
  quizRestartText: {
    fontFamily: "Nunito_700Bold",
    fontSize: 15,
    color: C.bg,
  },
});
