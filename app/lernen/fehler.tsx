import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Stack, useRouter } from "expo-router";
import Animated, { FadeInDown } from "react-native-reanimated";
import { Ionicons } from "@expo/vector-icons";

// ─── Palette ──────────────────────────────────────────────────────────────────

const C = {
  bg:         "#001d3d",
  surface:    "#1A2E35",
  border:     "#2C4551",
  fg:         "#FFFFFF",
  muted:      "#AFAFAF",
  green:      "#58CC02",
  greenBg:    "rgba(88,204,2,0.10)",
  greenBorder:"rgba(88,204,2,0.30)",
  red:        "#FF4B4B",
  redBg:      "rgba(255,75,75,0.10)",
  redBorder:  "rgba(255,75,75,0.30)",
  gold:       "#FFC800",
  goldBg:     "rgba(255,200,0,0.10)",
} as const;

// ─── Data ─────────────────────────────────────────────────────────────────────

interface MistakeCard {
  id: string;
  title: string;
  wrong: string;
  correct: string;
  explanation: string;
  /** substring to highlight green in correct sentence */
  highlight?: string;
}

const MISTAKES: MistakeCard[] = [
  {
    id: "m1",
    title: "Präfix vergessen",
    wrong:   "Ich stehe jeden Morgen um 7 Uhr.",
    correct: "Ich stehe jeden Morgen um 7 Uhr auf.",
    highlight: "auf",
    explanation:
      "Ohne das Präfix ändert sich die Bedeutung komplett! 'stehen' = to stand, 'aufstehen' = to get up. Das Präfix am Ende ist unverzichtbar — vergiss nie die Verbklammer!",
  },
  {
    id: "m2",
    title: "Falsche Wortstellung",
    wrong:   "Ich aufmache die Tür.",
    correct: "Ich mache die Tür auf.",
    highlight: "auf",
    explanation:
      "Das konjugierte Verb steht immer an Position 2. Nur das Präfix geht ans Satzende.",
  },
  {
    id: "m3",
    title: "Trennung im Perfekt",
    wrong:   "Ich habe die Tür auf gemacht.",
    correct: "Ich habe die Tür aufgemacht.",
    highlight: "auf",
    explanation:
      "Im Perfekt hängt das Präfix wieder am Partizip — kein Leerzeichen zwischen Präfix und Partizip!",
  },
  {
    id: "m4",
    title: "Trennung im Nebensatz",
    wrong:   "...weil ich mache die Tür auf.",
    correct: "...weil ich die Tür aufmache.",
    highlight: "auf",
    explanation:
      "In Nebensätzen (weil, dass, wenn...) geht das vollständige Verb ans Ende — keine Trennung! Das trennbare Verb bleibt zusammen.",
  },
  {
    id: "m5",
    title: "'ge' falsch platziert im Perfekt",
    wrong:   "Ich habe geaufmacht.",
    correct: "Ich habe aufgemacht.",
    highlight: "ge",
    explanation:
      "'ge' steht ZWISCHEN Präfix und Stamm. Formel: Präfix + ge + Stamm + t → auf-ge-macht, ein-ge-kauft, an-ge-rufen.",
  },
  {
    id: "m6",
    title: "Trennung bei Modalverben",
    wrong:   "Ich muss die Tür machen auf.",
    correct: "Ich muss die Tür aufmachen.",
    highlight: "auf",
    explanation:
      "Bei Modalverben (können, müssen, wollen, sollen, dürfen) bleibt das trennbare Verb als Infinitiv am Satzende zusammen.",
  },
  {
    id: "m7",
    title: "Falsche 'zu'-Stellung im Infinitiv",
    wrong:   "Ich versuche, die Tür zu aufmachen.",
    correct: "Ich versuche, die Tür aufzumachen.",
    highlight: "zu",
    explanation:
      "Bei 'zu + Infinitiv' geht 'zu' ZWISCHEN Präfix und Stamm: auf-zu-machen, an-zu-rufen, aus-zu-schalten.",
  },
  {
    id: "m8",
    title: "Untrennbares Verb wie trennbares behandelt",
    wrong:   "Ich stehe das Problem ver.",
    correct: "Ich verstehe das Problem.",
    highlight: "ver",
    explanation:
      "Verben mit be-, emp-, ent-, er-, ge-, miss-, ver-, zer- trennen sich NIE. Auch kein 'ge' im Partizip II: 'verstanden' — NICHT 'geverstanden', 'besucht' — NICHT 'gebesucht'.",
  },
  {
    id: "m9",
    title: "Falsches Hilfsverb im Perfekt",
    wrong:   "Ich habe aufgestanden.",
    correct: "Ich bin aufgestanden.",
    highlight: "bin",
    explanation:
      "'aufstehen' bildet das Perfekt mit 'sein', nicht 'haben'. Bewegungs- und Zustandsänderungs-Verben verwenden 'sein'.",
  },
];

// ─── Helpers ─────────────────────────────────────────────────────────────────

function HighlightedText({
  text,
  highlight,
  baseStyle,
  highlightColor,
}: {
  text: string;
  highlight?: string;
  baseStyle: object;
  highlightColor: string;
}) {
  if (!highlight) return <Text style={baseStyle}>{text}</Text>;
  const idx = text.indexOf(highlight);
  if (idx === -1) return <Text style={baseStyle}>{text}</Text>;
  return (
    <Text style={baseStyle}>
      {text.slice(0, idx)}
      <Text style={{ color: highlightColor, fontFamily: "Nunito_700Bold" }}>
        {highlight}
      </Text>
      {text.slice(idx + highlight.length)}
    </Text>
  );
}

// ─── MistakeCard component ───────────────────────────────────────────────────

function MistakeCardView({ card, index }: { card: MistakeCard; index: number }) {
  return (
    <Animated.View
      entering={FadeInDown.delay(index * 70).duration(380)}
      style={S.card}
    >
      {/* Title */}
      <View style={S.cardTitleRow}>
        <Text style={S.cardNumber}>{index + 1}</Text>
        <Text style={S.cardTitle}>{card.title}</Text>
      </View>

      {/* Wrong */}
      <View style={S.wrongBlock}>
        <View style={S.sentenceRow}>
          <Ionicons name="close-circle" size={18} color={C.red} style={S.sentenceIcon} />
          <Text style={S.wrongText}>{card.wrong}</Text>
        </View>
      </View>

      {/* Correct */}
      <View style={S.correctBlock}>
        <View style={S.sentenceRow}>
          <Ionicons name="checkmark-circle" size={18} color={C.green} style={S.sentenceIcon} />
          <HighlightedText
            text={card.correct}
            highlight={card.highlight}
            baseStyle={S.correctText}
            highlightColor={C.green}
          />
        </View>
      </View>

      {/* Explanation */}
      <View style={S.explanationBlock}>
        <Text style={S.explanationText}>{card.explanation}</Text>
      </View>
    </Animated.View>
  );
}

// ─── TypischeFehlerScreen ─────────────────────────────────────────────────────

export default function TypischeFehlerScreen() {
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
        <Text style={S.headerTitle}>Typische Fehler</Text>
        <View style={S.backBtn} />
      </View>

      <ScrollView
        contentContainerStyle={S.listContent}
        showsVerticalScrollIndicator={false}
      >
        {MISTAKES.map((card, i) => (
          <MistakeCardView key={card.id} card={card} index={i} />
        ))}
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
    fontSize: 18,
    color: C.fg,
    textAlign: "center",
  },

  listContent: {
    padding: 16,
    gap: 14,
    paddingBottom: 32,
  },

  // ── Card ──
  card: {
    backgroundColor: C.surface,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: C.border,
    borderBottomWidth: 4,
    borderBottomColor: "#0A1A22",
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 5,
  },

  cardTitleRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    paddingHorizontal: 16,
    paddingTop: 14,
    paddingBottom: 12,
  },
  cardNumber: {
    fontFamily: "Nunito_700Bold",
    fontSize: 12,
    color: C.muted,
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: C.border,
    textAlign: "center",
    lineHeight: 18,
  },
  cardTitle: {
    fontFamily: "Nunito_700Bold",
    fontSize: 15,
    color: C.fg,
  },

  // ── Wrong block ──
  wrongBlock: {
    backgroundColor: C.redBg,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: C.redBorder,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  sentenceRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 8,
  },
  sentenceIcon: {
    marginTop: 1,
    flexShrink: 0,
  },
  wrongText: {
    fontFamily: "Nunito_700Bold",
    fontSize: 15,
    color: C.red,
    textDecorationLine: "line-through",
    flex: 1,
    lineHeight: 22,
  },

  // ── Correct block ──
  correctBlock: {
    backgroundColor: C.greenBg,
    borderBottomWidth: 1,
    borderColor: C.greenBorder,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  correctText: {
    fontFamily: "Nunito_700Bold",
    fontSize: 15,
    color: C.green,
    flex: 1,
    lineHeight: 22,
  },

  // ── Explanation ──
  explanationBlock: {
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  explanationText: {
    fontFamily: "Nunito_400Regular",
    fontSize: 13,
    color: C.muted,
    lineHeight: 20,
  },
});
