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
import * as Haptics from "expo-haptics";
import { Ionicons } from "@expo/vector-icons";

// ─── Palette ──────────────────────────────────────────────────────────────────

const C = {
  bg:      "#001d3d",
  surface: "#1A2E35",
  border:  "#2C4551",
  fg:      "#FFFFFF",
  muted:   "#AFAFAF",
  green:   "#58CC02",
  greenBg: "rgba(88,204,2,0.10)",
  blue:    "#1CB0F6",
} as const;

// ─── Verbs that exist in the game data ───────────────────────────────────────

const GAME_VERBS = new Set([
  "abfahren", "abholen", "anerkennen", "anfangen", "ankommen", "anrufen",
  "aufhören", "aufmachen", "aufräumen", "aufstehen", "auseinandersetzen",
  "ausfüllen", "ausgehen", "beitragen", "durchführen", "einkaufen", "einladen",
  "entgegenkommen", "fernsehen", "festhalten", "herausfinden", "herstellen",
  "mitkommen", "nachdenken", "teilnehmen", "umziehen", "vorbereiten",
  "vorstellen", "zumachen", "zurückkommen", "zusammenarbeiten", "übereinstimmen",
]);

// ─── Data ─────────────────────────────────────────────────────────────────────

interface VerbEntry {
  verb: string;       // e.g. "aufmachen"
  translation: string; // e.g. "to open"
}

interface PrefixDef {
  prefix: string;
  meaning: string;
  accent: string;
  verbs: VerbEntry[];
}

const PREFIXES: PrefixDef[] = [
  {
    prefix: "auf-",
    meaning: "up, open",
    accent: "#58CC02",
    verbs: [
      { verb: "aufmachen",  translation: "to open" },
      { verb: "aufstehen",  translation: "to get up" },
      { verb: "aufräumen",  translation: "to tidy up" },
      { verb: "aufhören",   translation: "to stop" },
    ],
  },
  {
    prefix: "zu-",
    meaning: "closed, toward",
    accent: "#1CB0F6",
    verbs: [
      { verb: "zumachen",  translation: "to close" },
      { verb: "zuhören",   translation: "to listen" },
      { verb: "zusehen",   translation: "to watch" },
      { verb: "zunehmen",  translation: "to gain weight" },
    ],
  },
  {
    prefix: "an-",
    meaning: "on, at, beginning",
    accent: "#FFC800",
    verbs: [
      { verb: "anfangen",  translation: "to begin" },
      { verb: "anrufen",   translation: "to call" },
      { verb: "ankommen",  translation: "to arrive" },
      { verb: "anmachen",  translation: "to turn on" },
    ],
  },
  {
    prefix: "ab-",
    meaning: "off, away, down",
    accent: "#FF9600",
    verbs: [
      { verb: "abfahren",  translation: "to depart" },
      { verb: "abholen",   translation: "to pick up" },
      { verb: "abnehmen",  translation: "to lose weight" },
      { verb: "absagen",   translation: "to cancel" },
    ],
  },
  {
    prefix: "aus-",
    meaning: "out, off, finished",
    accent: "#E8547A",
    verbs: [
      { verb: "ausgehen",   translation: "to go out" },
      { verb: "ausmachen",  translation: "to turn off" },
      { verb: "aussteigen", translation: "to get off" },
      { verb: "ausfüllen",  translation: "to fill out" },
    ],
  },
  {
    prefix: "ein-",
    meaning: "in, into",
    accent: "#7C3AED",
    verbs: [
      { verb: "einkaufen",    translation: "to shop" },
      { verb: "einladen",     translation: "to invite" },
      { verb: "einsteigen",   translation: "to get on" },
      { verb: "einschlafen",  translation: "to fall asleep" },
    ],
  },
  {
    prefix: "mit-",
    meaning: "with, along",
    accent: "#059669",
    verbs: [
      { verb: "mitkommen",   translation: "to come along" },
      { verb: "mitmachen",   translation: "to participate" },
      { verb: "mitbringen",  translation: "to bring along" },
      { verb: "mitnehmen",   translation: "to take along" },
    ],
  },
  {
    prefix: "um-",
    meaning: "around, change, over",
    accent: "#1CB0F6",
    verbs: [
      { verb: "umziehen",   translation: "to move house" },
      { verb: "umsteigen",  translation: "to transfer" },
      { verb: "umdrehen",   translation: "to turn around" },
    ],
  },
  {
    prefix: "vor-",
    meaning: "before, forward, in front",
    accent: "#FFC800",
    verbs: [
      { verb: "vorstellen",   translation: "to introduce" },
      { verb: "vorbereiten",  translation: "to prepare" },
      { verb: "vorlesen",     translation: "to read aloud" },
      { verb: "vorschlagen",  translation: "to suggest" },
    ],
  },
  {
    prefix: "zurück-",
    meaning: "back",
    accent: "#58CC02",
    verbs: [
      { verb: "zurückkommen",  translation: "to come back" },
      { verb: "zurückgeben",   translation: "to give back" },
      { verb: "zurückgehen",   translation: "to go back" },
    ],
  },
  {
    prefix: "nach-",
    meaning: "after, following",
    accent: "#E8547A",
    verbs: [
      { verb: "nachdenken",  translation: "to think about" },
      { verb: "nachmachen",  translation: "to imitate" },
      { verb: "nachfragen",  translation: "to inquire" },
    ],
  },
  {
    prefix: "fest-",
    meaning: "firm, fixed",
    accent: "#FF9600",
    verbs: [
      { verb: "festhalten",   translation: "to hold tight" },
      { verb: "feststellen",  translation: "to determine" },
      { verb: "festlegen",    translation: "to establish" },
    ],
  },
  {
    prefix: "zusammen-",
    meaning: "together",
    accent: "#7C3AED",
    verbs: [
      { verb: "zusammenarbeiten",  translation: "to work together" },
      { verb: "zusammenfassen",    translation: "to summarize" },
    ],
  },
  {
    prefix: "bei-",
    meaning: "with, at, contributing",
    accent: "#059669",
    verbs: [
      { verb: "beibringen",  translation: "to teach" },
      { verb: "beistehen",   translation: "to stand by" },
      { verb: "beitragen",   translation: "to contribute" },
    ],
  },
  {
    prefix: "her-",
    meaning: "toward the speaker, from",
    accent: "#1CB0F6",
    verbs: [
      { verb: "herkommen",   translation: "to come from / here" },
      { verb: "hergeben",    translation: "to hand over" },
      { verb: "herstellen",  translation: "to produce" },
    ],
  },
  {
    prefix: "hin-",
    meaning: "away from speaker, toward destination",
    accent: "#FFC800",
    verbs: [
      { verb: "hinsetzen",  translation: "to sit down" },
      { verb: "hinfahren",  translation: "to drive there" },
      { verb: "hinlegen",   translation: "to put down" },
    ],
  },
  {
    prefix: "los-",
    meaning: "start, begin, off",
    accent: "#FF4B4B",
    verbs: [
      { verb: "losfahren",  translation: "to drive off" },
      { verb: "losgehen",   translation: "to set off" },
      { verb: "loslassen",  translation: "to let go" },
    ],
  },
  {
    prefix: "weg-",
    meaning: "away, gone",
    accent: "#E8547A",
    verbs: [
      { verb: "weggehen",   translation: "to go away" },
      { verb: "wegrennen",  translation: "to run away" },
      { verb: "wegnehmen",  translation: "to take away" },
    ],
  },
  {
    prefix: "weiter-",
    meaning: "further, continue",
    accent: "#58CC02",
    verbs: [
      { verb: "weiterlernen",   translation: "to continue learning" },
      { verb: "weitermachen",   translation: "to carry on" },
      { verb: "weiterfahren",   translation: "to drive on" },
    ],
  },
  {
    prefix: "statt-",
    meaning: "in place of",
    accent: "#AFAFAF",
    verbs: [
      { verb: "stattfinden",  translation: "to take place" },
    ],
  },
];

// ─── PrefixCard ───────────────────────────────────────────────────────────────

interface PrefixCardProps {
  def: PrefixDef;
  index: number;
  onVerbPress: (verb: string) => void;
}

function PrefixCard({ def, index, onVerbPress }: PrefixCardProps) {
  return (
    <Animated.View
      entering={FadeInDown.delay(index * 60).duration(350)}
      style={S.card}
    >
      {/* Prefix header */}
      <View style={S.cardHeader}>
        <Text style={[S.prefixLabel, { color: def.accent }]}>{def.prefix}</Text>
        <Text style={S.meaningLabel}>{def.meaning}</Text>
      </View>

      <View style={S.divider} />

      {/* Verb list */}
      <View style={S.verbList}>
        {def.verbs.map((entry) => {
          const inGame = GAME_VERBS.has(entry.verb);
          return (
            <Pressable
              key={entry.verb}
              onPress={() => inGame && onVerbPress(entry.verb)}
              disabled={!inGame}
              accessibilityRole={inGame ? "button" : "text"}
              accessibilityLabel={`${entry.verb} — ${entry.translation}`}
              style={({ pressed }) => [
                S.verbRow,
                inGame && { backgroundColor: pressed ? "rgba(88,204,2,0.08)" : "transparent" },
              ]}
            >
              {/* Prefix portion highlighted */}
              <Text style={S.verbText}>
                <Text style={{ color: def.accent }}>
                  {def.prefix.replace("-", "")}
                </Text>
                <Text style={S.verbStem}>
                  {entry.verb.slice(def.prefix.replace("-", "").length)}
                </Text>
              </Text>

              <Text style={S.verbTranslation}>{entry.translation}</Text>

              {inGame && (
                <View style={S.gameChip}>
                  <Text style={S.gameChipText}>im Spiel</Text>
                </View>
              )}
            </Pressable>
          );
        })}
      </View>
    </Animated.View>
  );
}

// ─── VorsilbenScreen ──────────────────────────────────────────────────────────

export default function VorsilbenScreen() {
  const router = useRouter();

  const handleVerbPress = (verb: string) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    // Navigate to verb detail when dictionary screen exists
    router.push(`/lernen/verb/${verb}` as never);
  };

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
        <Text style={S.headerTitle}>Vorsilben-Guide</Text>
        <View style={S.backBtn} />
      </View>

      {/* Subtitle */}
      <Text style={S.subtitle}>
        {PREFIXES.length} Vorsilben · Verben im Spiel{" "}
        <Text style={{ color: C.green }}>grün markiert</Text>
      </Text>

      {/* List */}
      <ScrollView
        contentContainerStyle={S.listContent}
        showsVerticalScrollIndicator={false}
      >
        {PREFIXES.map((def, i) => (
          <PrefixCard
            key={def.prefix}
            def={def}
            index={i}
            onVerbPress={handleVerbPress}
          />
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

  subtitle: {
    fontFamily: "Nunito_400Regular",
    fontSize: 13,
    color: C.muted,
    textAlign: "center",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: C.border,
  },

  listContent: {
    padding: 16,
    gap: 12,
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

  cardHeader: {
    flexDirection: "row",
    alignItems: "baseline",
    gap: 10,
    paddingHorizontal: 16,
    paddingTop: 14,
    paddingBottom: 10,
  },
  prefixLabel: {
    fontFamily: "Nunito_700Bold",
    fontSize: 26,
    lineHeight: 30,
  },
  meaningLabel: {
    fontFamily: "Nunito_400Regular",
    fontSize: 14,
    color: C.muted,
    fontStyle: "italic",
  },

  divider: {
    height: 1,
    backgroundColor: C.border,
    marginHorizontal: 16,
  },

  verbList: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    gap: 2,
  },

  verbRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingHorizontal: 6,
    paddingVertical: 8,
    borderRadius: 8,
  },

  verbText: {
    fontFamily: "Nunito_700Bold",
    fontSize: 15,
    color: C.fg,
    minWidth: 160,
  },
  verbStem: {
    color: C.fg,
  },
  verbTranslation: {
    flex: 1,
    fontFamily: "Nunito_400Regular",
    fontSize: 13,
    color: C.muted,
    fontStyle: "italic",
  },

  gameChip: {
    backgroundColor: C.greenBg,
    borderWidth: 1,
    borderColor: C.green,
    borderRadius: 20,
    paddingHorizontal: 8,
    paddingVertical: 3,
  },
  gameChipText: {
    fontFamily: "Nunito_700Bold",
    fontSize: 10,
    color: C.green,
  },
});
