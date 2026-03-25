import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  TextInput,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Stack, useRouter } from "expo-router";
import Animated, { FadeInDown } from "react-native-reanimated";
import { Ionicons } from "@expo/vector-icons";
import { useState, useMemo } from "react";
import { allVerbs } from "@/data/verbs";
import { useProgress } from "@/hooks/useProgress";
import type { SeparableVerb } from "@/data/types";

// ─── Palette ──────────────────────────────────────────────────────────────────

const C = {
  bg:          "#001d3d",
  surface:     "#1A2E35",
  surfaceDark: "#0F2030",
  border:      "#2C4551",
  fg:          "#FFFFFF",
  muted:       "#AFAFAF",
  green:       "#58CC02",
  greenBg:     "rgba(88,204,2,0.12)",
  greenBorder: "rgba(88,204,2,0.35)",
  gold:        "#FFC800",
  goldBg:      "rgba(255,200,0,0.10)",
  blue:        "#1CB0F6",
  blueBg:      "rgba(28,176,246,0.10)",
  inputBg:     "#0A1E34",
} as const;

const LEVEL_LABELS: Record<1 | 2 | 3 | 4, string> = {
  1: "A1", 2: "A2", 3: "B1", 4: "B2",
};

const LEVEL_COLORS: Record<1 | 2 | 3 | 4, string> = {
  1: "#D4A800", 2: "#1CB0F6", 3: "#FFC800", 4: "#FF4B4B",
};

// ─── VerbCard ─────────────────────────────────────────────────────────────────

interface VerbCardProps {
  verb: SeparableVerb;
  index: number;
  correctCount: number;
  mastered: boolean;
}

function VerbCard({ verb, index, correctCount, mastered }: VerbCardProps) {
  const levelColor = LEVEL_COLORS[verb.level];
  const progressDots = [1, 2, 3].map((i) => correctCount >= i);

  return (
    <Animated.View
      entering={FadeInDown.delay(index * 40).duration(320)}
      style={S.card}
    >
      {/* Left: prefix badge */}
      <View style={[S.prefixBadge, { borderColor: levelColor + "55", backgroundColor: levelColor + "18" }]}>
        <Text style={[S.prefixText, { color: levelColor }]}>{verb.prefix}-</Text>
      </View>

      {/* Middle: verb info */}
      <View style={S.cardBody}>
        <View style={S.verbTitleRow}>
          <Text style={S.infinitive}>
            <Text style={{ color: levelColor }}>{verb.prefix}</Text>
            <Text style={S.stem}>{verb.stem}</Text>
          </Text>
          {mastered && (
            <View style={S.masteredBadge}>
              <Ionicons name="checkmark" size={11} color={C.green} />
              <Text style={S.masteredText}>Gelernt</Text>
            </View>
          )}
        </View>
        <Text style={S.meaning}>{verb.meaning}</Text>

        {/* Progress dots */}
        <View style={S.progressRow}>
          {progressDots.map((filled, i) => (
            <View
              key={i}
              style={[S.progressDot, filled && { backgroundColor: C.green }]}
            />
          ))}
          <Text style={S.progressLabel}>
            {correctCount >= 3 ? "Gemeistert" : `${correctCount}/3`}
          </Text>
        </View>
      </View>

      {/* Right: level chip */}
      <View style={[S.levelChip, { borderColor: levelColor + "55" }]}>
        <Text style={[S.levelText, { color: levelColor }]}>{LEVEL_LABELS[verb.level]}</Text>
      </View>
    </Animated.View>
  );
}

// ─── WoerterbuchScreen ────────────────────────────────────────────────────────

const FILTER_LEVELS = ["Alle", "A1", "A2", "B1", "B2"] as const;
type FilterLevel = typeof FILTER_LEVELS[number];

export default function WoerterbuchScreen() {
  const router = useRouter();
  const { getVerbMastery } = useProgress();

  const [search, setSearch] = useState("");
  const [filterLevel, setFilterLevel] = useState<FilterLevel>("Alle");

  const filteredVerbs = useMemo(() => {
    let list = allVerbs;

    // Level filter
    if (filterLevel !== "Alle") {
      const lvl = FILTER_LEVELS.indexOf(filterLevel) as 1 | 2 | 3 | 4;
      list = list.filter((v) => v.level === lvl);
    }

    // Search filter
    const q = search.trim().toLowerCase();
    if (q) {
      list = list.filter(
        (v) =>
          v.infinitive.toLowerCase().includes(q) ||
          v.prefix.toLowerCase().includes(q) ||
          v.stem.toLowerCase().includes(q) ||
          v.meaning.toLowerCase().includes(q),
      );
    }

    return list;
  }, [search, filterLevel]);

  const totalMastered = useMemo(
    () => allVerbs.filter((v) => getVerbMastery(v.infinitive)?.mastered).length,
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  );

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
        <Text style={S.headerTitle}>Wörterbuch</Text>
        <View style={S.backBtn} />
      </View>

      {/* Stats bar */}
      <View style={S.statsBar}>
        <View style={S.statItem}>
          <Text style={S.statNum}>{allVerbs.length}</Text>
          <Text style={S.statLabel}>Verben</Text>
        </View>
        <View style={S.statDivider} />
        <View style={S.statItem}>
          <Text style={[S.statNum, { color: C.green }]}>{totalMastered}</Text>
          <Text style={S.statLabel}>Gemeistert</Text>
        </View>
        <View style={S.statDivider} />
        <View style={S.statItem}>
          <Text style={[S.statNum, { color: C.gold }]}>A1–B2</Text>
          <Text style={S.statLabel}>CEFR</Text>
        </View>
      </View>

      {/* Search */}
      <View style={S.searchRow}>
        <Ionicons name="search" size={18} color={C.muted} style={S.searchIcon} />
        <TextInput
          style={S.searchInput}
          placeholder="Verb suchen..."
          placeholderTextColor={C.muted}
          value={search}
          onChangeText={setSearch}
          autoCapitalize="none"
          autoCorrect={false}
          clearButtonMode="while-editing"
        />
      </View>

      {/* Level filter chips */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={S.filterRow}
      >
        {FILTER_LEVELS.map((lvl) => {
          const active = filterLevel === lvl;
          const color = lvl === "Alle" ? C.blue : LEVEL_COLORS[FILTER_LEVELS.indexOf(lvl) as 1 | 2 | 3 | 4];
          return (
            <Pressable
              key={lvl}
              onPress={() => setFilterLevel(lvl)}
              style={[
                S.filterChip,
                active && { backgroundColor: color + "22", borderColor: color },
              ]}
              accessibilityRole="button"
              accessibilityLabel={`Filter ${lvl}`}
            >
              <Text style={[S.filterChipText, active && { color }]}>{lvl}</Text>
            </Pressable>
          );
        })}
      </ScrollView>

      {/* Result count */}
      <Text style={S.resultCount}>
        {filteredVerbs.length} {filteredVerbs.length === 1 ? "Eintrag" : "Einträge"}
      </Text>

      {/* Verb list */}
      <ScrollView
        contentContainerStyle={S.listContent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {filteredVerbs.map((verb, i) => {
          const mastery = getVerbMastery(verb.infinitive);
          return (
            <VerbCard
              key={verb.infinitive}
              verb={verb}
              index={i}
              correctCount={Math.min(mastery?.correctCount ?? 0, 3)}
              mastered={mastery?.mastered ?? false}
            />
          );
        })}

        {filteredVerbs.length === 0 && (
          <View style={S.emptyState}>
            <Ionicons name="search" size={36} color={C.border} />
            <Text style={S.emptyText}>Kein Verb gefunden.</Text>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────

const S = StyleSheet.create({
  root: { flex: 1, backgroundColor: C.bg },

  // ── Header ──
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

  // ── Stats bar ──
  statsBar: {
    flexDirection: "row",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: C.border,
    backgroundColor: C.surfaceDark,
  },
  statItem: { flex: 1, alignItems: "center" },
  statNum: {
    fontFamily: "Nunito_700Bold",
    fontSize: 20,
    color: C.fg,
    lineHeight: 26,
  },
  statLabel: {
    fontFamily: "Nunito_400Regular",
    fontSize: 11,
    color: C.muted,
    marginTop: 1,
  },
  statDivider: {
    width: 1,
    backgroundColor: C.border,
    marginVertical: 2,
  },

  // ── Search ──
  searchRow: {
    flexDirection: "row",
    alignItems: "center",
    marginHorizontal: 16,
    marginTop: 12,
    backgroundColor: C.inputBg,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: C.border,
    paddingHorizontal: 12,
    height: 44,
  },
  searchIcon: { marginRight: 8 },
  searchInput: {
    flex: 1,
    fontFamily: "Nunito_400Regular",
    fontSize: 15,
    color: C.fg,
    height: "100%",
  },

  // ── Filter chips ──
  filterRow: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    gap: 8,
  },
  filterChip: {
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: C.border,
    backgroundColor: "transparent",
  },
  filterChipText: {
    fontFamily: "Nunito_700Bold",
    fontSize: 13,
    color: C.muted,
  },

  resultCount: {
    fontFamily: "Nunito_400Regular",
    fontSize: 12,
    color: C.muted,
    paddingHorizontal: 20,
    paddingBottom: 6,
  },

  // ── List ──
  listContent: {
    paddingHorizontal: 16,
    paddingBottom: 32,
    gap: 8,
  },

  // ── Verb card ──
  card: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: C.surface,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: C.border,
    borderBottomWidth: 3,
    borderBottomColor: "#0A1A22",
    paddingHorizontal: 12,
    paddingVertical: 12,
    gap: 12,
  },

  prefixBadge: {
    width: 48,
    height: 48,
    borderRadius: 12,
    borderWidth: 1.5,
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },
  prefixText: {
    fontFamily: "Nunito_700Bold",
    fontSize: 13,
    textAlign: "center",
  },

  cardBody: {
    flex: 1,
    gap: 3,
  },
  verbTitleRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  infinitive: {
    fontFamily: "Nunito_700Bold",
    fontSize: 17,
    color: C.fg,
  },
  stem: {
    color: C.fg,
  },
  meaning: {
    fontFamily: "Nunito_400Regular",
    fontSize: 13,
    color: C.muted,
    fontStyle: "italic",
  },

  progressRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    marginTop: 4,
  },
  progressDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: C.border,
  },
  progressLabel: {
    fontFamily: "Nunito_400Regular",
    fontSize: 11,
    color: C.muted,
    marginLeft: 4,
  },

  masteredBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 3,
    backgroundColor: C.greenBg,
    borderWidth: 1,
    borderColor: C.greenBorder,
    borderRadius: 20,
    paddingHorizontal: 7,
    paddingVertical: 2,
  },
  masteredText: {
    fontFamily: "Nunito_700Bold",
    fontSize: 10,
    color: C.green,
  },

  levelChip: {
    width: 34,
    height: 34,
    borderRadius: 10,
    borderWidth: 1.5,
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },
  levelText: {
    fontFamily: "Nunito_700Bold",
    fontSize: 11,
    textAlign: "center",
  },

  // ── Empty state ──
  emptyState: {
    alignItems: "center",
    justifyContent: "center",
    paddingTop: 60,
    gap: 12,
  },
  emptyText: {
    fontFamily: "Nunito_400Regular",
    fontSize: 15,
    color: C.muted,
  },
});
