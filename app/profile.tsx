import { View, Text, ScrollView, Pressable, StyleSheet } from "react-native";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";
import { Stack, useRouter } from "expo-router";
import Animated, { FadeIn, FadeInDown } from "react-native-reanimated";
import { Ionicons, FontAwesome6 } from "@expo/vector-icons";

// ─── Palette ──────────────────────────────────────────────────────────────────

const C = {
  bg:         "#131F24",
  surface:    "#1A2E35",
  border:     "#2C4551",
  foreground: "#FFFFFF",
  muted:      "#AFAFAF",
  blue:       "#1CB0F6",
  gold:       "#FFC800",
  green:      "#58CC02",
  red:        "#FF4B4B",
} as const;

// ─── Header ───────────────────────────────────────────────────────────────────

function ProfileHeader({ onBack }: { onBack: () => void }) {
  const insets = useSafeAreaInsets();
  return (
    <View style={[S.headerBar, { paddingTop: insets.top }]}>
      <Pressable onPress={onBack} style={S.headerBack} accessibilityRole="button" accessibilityLabel="Zurück">
        <Text style={S.headerArrow}>‹</Text>
      </Pressable>
      <Text style={S.headerTitle} pointerEvents="none">Profil</Text>
      <View style={{ width: 48 }} />
    </View>
  );
}

// ─── StatBadge ────────────────────────────────────────────────────────────────

function StatBadge({ icon, value, label, color }: { icon: string; value: string; label: string; color: string }) {
  return (
    <View style={S.statBadge}>
      <Text style={{ fontSize: 22 }}>{icon}</Text>
      <Text style={[S.statValue, { color }]}>{value}</Text>
      <Text style={S.statLabel}>{label}</Text>
    </View>
  );
}

// ─── SectionHeader ────────────────────────────────────────────────────────────

function SectionHeader({ title }: { title: string }) {
  return <Text style={S.sectionHeader}>{title}</Text>;
}

// ─── InfoRow ──────────────────────────────────────────────────────────────────

function InfoRow({ icon, label, value, accent }: { icon: keyof typeof Ionicons.glyphMap; label: string; value: string; accent?: string }) {
  return (
    <View style={S.row}>
      <View style={[S.rowIcon, { backgroundColor: accent ? accent + "22" : C.border }]}>
        <Ionicons name={icon} size={18} color={accent ?? C.muted} />
      </View>
      <View style={{ flex: 1 }}>
        <Text style={S.rowLabel}>{label}</Text>
        <Text style={S.rowValue}>{value}</Text>
      </View>
    </View>
  );
}

// ─── ProfileScreen ────────────────────────────────────────────────────────────

export default function ProfileScreen() {
  const router = useRouter();

  return (
    <SafeAreaView style={S.root} edges={["bottom"]}>
      <Stack.Screen
        options={{
          headerShown: true,
          header: () => <ProfileHeader onBack={() => router.back()} />,
        }}
      />

      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={S.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* ── Avatar + Name ── */}
        <Animated.View entering={FadeIn.duration(400)} style={S.avatarSection}>
          <View style={S.avatarRing}>
            <View style={S.avatar}>
              <FontAwesome6 name="user" size={48} color={C.blue} />
            </View>
          </View>
          <Text style={S.name}>Oscar Bougart</Text>
          <Text style={S.email}>oscar.bougart.dev@gmail.com</Text>

          <Pressable style={S.editBtn} accessibilityRole="button" accessibilityLabel="Profil bearbeiten">
            <Ionicons name="pencil" size={14} color={C.blue} />
            <Text style={S.editBtnText}>Profil bearbeiten</Text>
          </Pressable>
        </Animated.View>

        {/* ── Stats row ── */}
        <Animated.View entering={FadeInDown.delay(80).duration(400)} style={S.statsRow}>
          <StatBadge icon="🔥" value="7" label="Tagesstreak" color={C.gold} />
          <View style={S.statDivider} />
          <StatBadge icon="⭐" value="34" label="Gesamtsterne" color={C.gold} />
          <View style={S.statDivider} />
          <StatBadge icon="✅" value="12" label="Abgeschlossen" color={C.green} />
        </Animated.View>

        {/* ── Lernfortschritt ── */}
        <Animated.View entering={FadeInDown.delay(140).duration(400)}>
          <SectionHeader title="LERNFORTSCHRITT" />
          <View style={S.card}>
            <InfoRow icon="trophy" label="Aktuelles Level" value="Level 2 — A2" accent={C.blue} />
            <View style={S.divider} />
            <InfoRow icon="time" label="Lernzeit gesamt" value="3 Std. 24 Min." accent={C.blue} />
            <View style={S.divider} />
            <InfoRow icon="flame" label="Längster Streak" value="14 Tage" accent="#FF9600" />
            <View style={S.divider} />
            <InfoRow icon="calendar" label="Mitglied seit" value="März 2025" accent={C.muted} />
          </View>
        </Animated.View>

        {/* ── Erfolge ── */}
        <Animated.View entering={FadeInDown.delay(200).duration(400)}>
          <SectionHeader title="ERFOLGE" />
          <View style={S.card}>
            <InfoRow icon="star" label="Erste Runde" value="Level 1 abgeschlossen" accent={C.gold} />
            <View style={S.divider} />
            <InfoRow icon="flash" label="Perfekte Runde" value="10/10 ohne Fehler" accent={C.gold} />
            <View style={S.divider} />
            <InfoRow icon="ribbon" label="Wochenchampion" value="7 Tage in Folge gelernt" accent={C.gold} />
          </View>
        </Animated.View>

        {/* ── Sprache & Einstellungen ── */}
        <Animated.View entering={FadeInDown.delay(260).duration(400)}>
          <SectionHeader title="LERNPROFIL" />
          <View style={S.card}>
            <InfoRow icon="language" label="Muttersprache" value="Englisch" accent={C.blue} />
            <View style={S.divider} />
            <InfoRow icon="school" label="Zielsprache" value="Deutsch (B2)" accent={C.blue} />
            <View style={S.divider} />
            <InfoRow icon="bar-chart" label="Schwierigkeitsgrad" value="Mittel" accent={C.blue} />
          </View>
        </Animated.View>
      </ScrollView>
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
  headerBar: {
    backgroundColor: C.bg,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 8,
    paddingBottom: 14,
  },
  headerBack: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    width: 48,
  },
  headerArrow: {
    color: C.foreground,
    fontSize: 50,
    fontWeight: "300",
    includeFontPadding: false,
  },
  headerTitle: {
    fontFamily: "Nunito_700Bold",
    flex: 1,
    color: C.foreground,
    fontSize: 17,
    textAlign: "center",
  },

  // ── Scroll ──
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 8,
    paddingBottom: 40,
  },

  // ── Avatar section ──
  avatarSection: {
    alignItems: "center",
    paddingVertical: 24,
  },
  avatarRing: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 3,
    borderColor: C.blue,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 14,
    backgroundColor: C.surface,
  },
  avatar: {
    alignItems: "center",
    justifyContent: "center",
  },
  name: {
    fontFamily: "GravitasOne_400Regular",
    fontSize: 24,
    color: C.foreground,
    letterSpacing: 1,
    marginBottom: 4,
  },
  email: {
    fontFamily: "Nunito_400Regular",
    fontSize: 13,
    color: C.muted,
    marginBottom: 14,
  },
  editBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1.5,
    borderColor: C.blue,
  },
  editBtnText: {
    fontFamily: "Nunito_700Bold",
    fontSize: 13,
    color: C.blue,
  },

  // ── Stats ──
  statsRow: {
    flexDirection: "row",
    backgroundColor: C.surface,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: C.border,
    marginBottom: 6,
    paddingVertical: 16,
  },
  statBadge: {
    flex: 1,
    alignItems: "center",
    gap: 4,
  },
  statValue: {
    fontFamily: "GravitasOne_400Regular",
    fontSize: 20,
  },
  statLabel: {
    fontFamily: "Nunito_400Regular",
    fontSize: 11,
    color: C.muted,
    textAlign: "center",
  },
  statDivider: {
    width: 1,
    backgroundColor: C.border,
    marginVertical: 4,
  },

  // ── Section ──
  sectionHeader: {
    fontFamily: "Nunito_700Bold",
    color: C.muted,
    fontSize: 11,
    letterSpacing: 1.4,
    marginBottom: 10,
    marginTop: 18,
    marginLeft: 4,
  },
  card: {
    backgroundColor: C.surface,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: C.border,
    overflow: "hidden",
  },
  divider: {
    height: 1,
    backgroundColor: C.border,
    marginLeft: 56,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 14,
    gap: 12,
  },
  rowIcon: {
    width: 36,
    height: 36,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  rowLabel: {
    fontFamily: "Nunito_400Regular",
    color: C.muted,
    fontSize: 12,
    marginBottom: 2,
  },
  rowValue: {
    fontFamily: "Nunito_700Bold",
    color: C.foreground,
    fontSize: 14,
  },
});
