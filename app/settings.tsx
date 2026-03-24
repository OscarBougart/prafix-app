import {
  View,
  Text,
  Pressable,
  Switch,
  Alert,
  ScrollView,
  StyleSheet,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Stack, useRouter } from "expo-router";
import Constants from "expo-constants";
import Animated, { FadeInDown } from "react-native-reanimated";

import { useSound } from "@/hooks/useSound";
import { useSettings } from "@/hooks/useSettings";
import { useProgress } from "@/hooks/useProgress";

// ─── Palette ──────────────────────────────────────────────────────────────────

const C = {
  bg:         "#001d3d",
  surface:    "#1A2E35",
  border:     "#2C4551",
  foreground: "#FFFFFF",
  muted:      "#AFAFAF",
  gold:       "#FFC800",
  blue:       "#1CB0F6",
  red:        "#FF4B4B",
  redDark:    "#CC3333",
} as const;

// ─── SettingsRow ──────────────────────────────────────────────────────────────

interface SettingsRowProps {
  label: string;
  description?: string;
  children: React.ReactNode;
}

function SettingsRow({ label, description, children }: SettingsRowProps) {
  return (
    <View style={S.row}>
      <View style={{ flex: 1 }}>
        <Text style={S.rowLabel}>{label}</Text>
        {description ? <Text style={S.rowDesc}>{description}</Text> : null}
      </View>
      <View style={S.rowControl}>{children}</View>
    </View>
  );
}

// ─── SectionHeader ────────────────────────────────────────────────────────────

function SectionHeader({ title }: { title: string }) {
  return <Text style={S.sectionHeader}>{title}</Text>;
}

// ─── SettingsScreen ───────────────────────────────────────────────────────────

export default function SettingsScreen() {
  const router = useRouter();
  const { soundEnabled, toggleSound } = useSound();
  const { settings, updateSettings } = useSettings();
  const { resetProgress } = useProgress();

  const appVersion = Constants.expoConfig?.version ?? "1.0.0";

  const handleResetProgress = () => {
    Alert.alert(
      "Fortschritt zurücksetzen",
      "Alle Level-Fortschritte und Sterne werden gelöscht. Diese Aktion kann nicht rückgängig gemacht werden.",
      [
        { text: "Abbrechen", style: "cancel" },
        {
          text: "Zurücksetzen",
          style: "destructive",
          onPress: async () => {
            await resetProgress();
            Alert.alert("Erledigt", "Dein Fortschritt wurde zurückgesetzt.");
          },
        },
      ],
    );
  };

  return (
    <SafeAreaView style={S.root} edges={["top", "bottom"]}>
      <Stack.Screen
        options={{
          title: "Einstellungen",
          headerShown: true,
          headerStyle: { backgroundColor: C.bg },
          headerTintColor: C.foreground,
          headerTitleStyle: { fontWeight: "bold" },
        }}
      />

      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={S.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* ── Sound & Gameplay ── */}
        <Animated.View entering={FadeInDown.delay(0).duration(350)}>
          <SectionHeader title="TON & GAMEPLAY" />

          <View style={S.card}>
            <SettingsRow
              label="Ton"
              description="Klänge für richtige und falsche Antworten"
            >
              <Switch
                value={soundEnabled}
                onValueChange={toggleSound}
                trackColor={{ false: C.border, true: C.gold }}
                thumbColor={C.foreground}
                accessibilityLabel="Ton ein- oder ausschalten"
              />
            </SettingsRow>

            <View style={S.divider} />

            <SettingsRow
              label="Übersetzung anzeigen"
              description="Englische Übersetzung im Spielfeld"
            >
              <Switch
                value={settings.showTranslation}
                onValueChange={(val) => updateSettings({ showTranslation: val })}
                trackColor={{ false: C.border, true: C.blue }}
                thumbColor={C.foreground}
                accessibilityLabel="Übersetzung ein- oder ausschalten"
              />
            </SettingsRow>
          </View>
        </Animated.View>

        {/* ── Data ── */}
        <Animated.View entering={FadeInDown.delay(80).duration(350)}>
          <SectionHeader title="DATEN" />

          <View style={S.card}>
            <Pressable
              onPress={handleResetProgress}
              style={({ pressed }) => [S.dangerRow, pressed && { opacity: 0.7 }]}
              accessibilityRole="button"
              accessibilityLabel="Fortschritt zurücksetzen"
            >
              <Text style={S.dangerLabel}>Fortschritt zurücksetzen</Text>
              <Text style={S.dangerArrow}>›</Text>
            </Pressable>
          </View>
        </Animated.View>

        {/* ── About ── */}
        <Animated.View entering={FadeInDown.delay(160).duration(350)}>
          <SectionHeader title="APP-INFO" />

          <View style={S.card}>
            <SettingsRow label="Version">
              <Text style={S.valueText}>{appVersion}</Text>
            </SettingsRow>

            <View style={S.divider} />

            <SettingsRow label="App">
              <Text style={S.valueText}>PräFix</Text>
            </SettingsRow>

            <View style={S.divider} />

            <SettingsRow label="Thema">
              <Text style={S.valueText}>Trennbare Verben</Text>
            </SettingsRow>
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
  scrollContent: {
    padding: 20,
    paddingBottom: 40,
  },
  sectionHeader: {
    color: C.muted,
    fontSize: 11,
    fontWeight: "700",
    letterSpacing: 1.4,
    marginBottom: 10,
    marginTop: 24,
    marginLeft: 4,
  },
  card: {
    backgroundColor: C.surface,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: C.border,
    overflow: "hidden",
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 14,
    minHeight: 56,
  },
  rowLabel: {
    color: C.foreground,
    fontSize: 15,
    fontWeight: "600",
  },
  rowDesc: {
    color: C.muted,
    fontSize: 12,
    marginTop: 2,
  },
  rowControl: {
    marginLeft: 12,
    flexShrink: 0,
  },
  divider: {
    height: 1,
    backgroundColor: C.border,
    marginLeft: 16,
  },
  dangerRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 16,
    minHeight: 56,
  },
  dangerLabel: {
    flex: 1,
    color: C.red,
    fontSize: 15,
    fontWeight: "600",
  },
  dangerArrow: {
    color: C.red,
    fontSize: 20,
    fontWeight: "300",
  },
  valueText: {
    color: C.muted,
    fontSize: 14,
  },
});
