import { View, Text, ScrollView, Pressable, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Stack, useRouter } from "expo-router";
import Animated, { FadeInDown } from "react-native-reanimated";
import * as Haptics from "expo-haptics";
import { Ionicons } from "@expo/vector-icons";
import { MaterialCommunityIcons } from "@expo/vector-icons";

// ─── Palette ──────────────────────────────────────────────────────────────────

const C = {
  bg:      "#001d3d",
  surface: "#1A2E35",
  border:  "#2C4551",
  fg:      "#FFFFFF",
  muted:   "#AFAFAF",
} as const;

// ─── Section definitions ──────────────────────────────────────────────────────

interface SectionDef {
  id: string;
  title: string;
  subtitle: string;
  icon: React.ComponentProps<typeof MaterialCommunityIcons>["name"];
  accent: string;
  accentDark: string;
  route: string;
}

const SECTIONS: SectionDef[] = [
  {
    id: "regeln",
    title: "Regeln",
    subtitle: "Wie trennbare Verben funktionieren",
    icon: "book-open-variant",
    accent: "#58CC02",
    accentDark: "#46A302",
    route: "/lernen/regeln",
  },
  {
    id: "vorsilben",
    title: "Vorsilben-Guide",
    subtitle: "auf, zu, an, ab, aus, ein…",
    icon: "puzzle",
    accent: "#1CB0F6",
    accentDark: "#0A8FCF",
    route: "/lernen/vorsilben",
  },
  {
    id: "fehler",
    title: "Typische Fehler",
    subtitle: "Die häufigsten Fehler und wie man sie vermeidet",
    icon: "alert-circle",
    accent: "#FF4B4B",
    accentDark: "#E63939",
    route: "/lernen/fehler",
  },
  {
    id: "trennbar",
    title: "Trennbar vs. Untrennbar",
    subtitle: "Lerne den Unterschied",
    icon: "call-split",
    accent: "#FFC800",
    accentDark: "#E6B400",
    route: "/lernen/trennbar-vs-untrennbar",
  },
];

// ─── SectionCard ─────────────────────────────────────────────────────────────

interface SectionCardProps {
  def: SectionDef;
  index: number;
  onPress: () => void;
}

function SectionCard({ def, index, onPress }: SectionCardProps) {
  return (
    <Animated.View entering={FadeInDown.delay(index * 100).duration(400)}>
      <Pressable
        onPress={onPress}
        accessibilityRole="button"
        accessibilityLabel={def.title}
        style={({ pressed }) => [S.card, pressed && S.cardPressed]}
      >
        {/* Icon circle */}
        <View style={[S.iconCircle, { backgroundColor: def.accent + "22", borderColor: def.accent + "55" }]}>
          <MaterialCommunityIcons name={def.icon} size={26} color={def.accent} />
        </View>

        {/* Text */}
        <View style={S.cardText}>
          <Text style={S.cardTitle}>{def.title}</Text>
          <Text style={S.cardSub}>{def.subtitle}</Text>
        </View>

        {/* Chevron */}
        <Ionicons name="chevron-forward" size={20} color={C.muted} />
      </Pressable>
    </Animated.View>
  );
}

// ─── LernenScreen ─────────────────────────────────────────────────────────────

export default function LernenScreen() {
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
        <Text style={S.headerTitle}>Lernen</Text>
        <View style={S.backBtn} />
      </View>

      {/* Cards */}
      <ScrollView
        contentContainerStyle={S.listContent}
        showsVerticalScrollIndicator={false}
      >
        {SECTIONS.map((def, i) => (
          <SectionCard
            key={def.id}
            def={def}
            index={i}
            onPress={() => {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
              router.push(def.route as never);
            }}
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
    fontFamily: "GravitasOne_400Regular",
    fontSize: 20,
    color: C.fg,
    textAlign: "center",
  },

  listContent: {
    padding: 16,
    gap: 12,
  },

  card: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: C.surface,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: C.border,
    borderBottomWidth: 4,
    borderBottomColor: "#0A1A22",
    paddingHorizontal: 16,
    paddingVertical: 18,
    gap: 14,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 5,
  },
  cardPressed: {
    opacity: 0.85,
    transform: [{ scale: 0.98 }],
  },

  iconCircle: {
    width: 52,
    height: 52,
    borderRadius: 16,
    borderWidth: 1.5,
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },

  cardText: { flex: 1 },
  cardTitle: {
    fontFamily: "GravitasOne_400Regular",
    fontSize: 16,
    color: C.fg,
    marginBottom: 3,
  },
  cardSub: {
    fontFamily: "Nunito_400Regular",
    fontSize: 13,
    color: C.muted,
    lineHeight: 18,
  },
});
