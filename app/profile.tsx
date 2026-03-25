import {
  View,
  Text,
  ScrollView,
  Pressable,
  StyleSheet,
  TextInput,
  Image,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";
import { Stack, useRouter } from "expo-router";
import Animated, { FadeIn, FadeInDown } from "react-native-reanimated";
import { Ionicons, FontAwesome6, FontAwesome5, Entypo, MaterialIcons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import React, { useEffect, useState } from "react";
import { storage } from "@/utils/storage";
import { useStreak } from "@/hooks/useStreak";
import { useProgress } from "@/hooks/useProgress";
import { useRounds } from "@/hooks/useRounds";

// ─── Palette ──────────────────────────────────────────────────────────────────

const C = {
  bg:         "#131F24",
  surface:    "#1A2E35",
  border:     "#2C4551",
  foreground: "#FFFFFF",
  muted:      "#AFAFAF",
  blue:       "#1CB0F6",
  gold:       "#FFC800",
  goldDark:   "#E6B400",
  green:      "#58CC02",
  red:        "#FF4B4B",
} as const;

// ─── Constants ────────────────────────────────────────────────────────────────

const PROFILE_KEY = "prafix:profile";

const MUTTERSPRACHEN = [
  "Englisch", "Spanisch", "Türkisch", "Arabisch", "Ukrainisch", "Französisch",
  "Portugiesisch", "Italienisch", "Polnisch", "Russisch", "Niederländisch",
  "Schwedisch", "Norwegisch", "Dänisch", "Finnisch", "Griechisch",
  "Japanisch", "Koreanisch", "Chinesisch", "Hindi", "Vietnamesisch",
];

const CEFR_LEVELS = ["A1", "A2", "B1", "B2", "C1", "C2"] as const;
type CefrLevel = typeof CEFR_LEVELS[number];

interface ProfileData {
  name: string;
  muttersprache: string;
  cefrLevel: CefrLevel;
  photoUri: string | null;
}

const DEFAULT_PROFILE: ProfileData = {
  name: "Dein Name",
  muttersprache: "Englisch",
  cefrLevel: "B2",
  photoUri: null,
};

// ─── UI strings ───────────────────────────────────────────────────────────────

const UI = {
  de: {
    title:             "Profil",
    tagesstreak:       "Tagesstreak",
    sterne:            "Sterne",
    verbenGelernt:     "Verben gelernt",
    lernfortschritt:   "LERNFORTSCHRITT",
    laengsterStreak:   "Längster Streak",
    tage:              "Tage",
    gespielteRunden:   "Gespielte Runden",
    erfolge:           "ERFOLGE",
    ersteRunde:        "Erste Runde",
    ersteRundeSub:     "Level 1 abgeschlossen",
    perfekteRunde:     "Perfekte Runde",
    perfekteRundeSub:  "10/10 ohne Fehler",
    wochenchampion:    "Wochenchampion",
    wochenchampionSub: "7 Tage in Folge gelernt",
    lernprofil:        "LERNPROFIL",
    muttersprache:     "Muttersprache",
    zielsprache:       "Zielsprache",
    bearbeiten:        "Profil bearbeiten",
    fertig:            "Fertig",
    waehleDeinNiveau:  "Wähle dein Niveau",
  },
  en: {
    title:             "Profile",
    tagesstreak:       "Daily Streak",
    sterne:            "Stars",
    verbenGelernt:     "Verbs Learned",
    lernfortschritt:   "PROGRESS",
    laengsterStreak:   "Longest Streak",
    tage:              "days",
    gespielteRunden:   "Rounds Played",
    erfolge:           "ACHIEVEMENTS",
    ersteRunde:        "First Round",
    ersteRundeSub:     "Completed Level 1",
    perfekteRunde:     "Perfect Round",
    perfekteRundeSub:  "10/10 without mistakes",
    wochenchampion:    "Week Champion",
    wochenchampionSub: "7 days in a row",
    lernprofil:        "LEARNING PROFILE",
    muttersprache:     "Native Language",
    zielsprache:       "Target Language",
    bearbeiten:        "Edit Profile",
    fertig:            "Done",
    waehleDeinNiveau:  "Choose your level",
  },
} as const;

type Lang = keyof typeof UI;

// ─── Header ───────────────────────────────────────────────────────────────────

function ProfileHeader({ onBack, translated, onToggleTranslate }: {
  onBack: () => void;
  translated: boolean;
  onToggleTranslate: () => void;
}) {
  const t = translated ? UI.en : UI.de;
  return (
    <View style={S.headerBar}>
      <Pressable onPress={onBack} style={S.headerBack} accessibilityRole="button" accessibilityLabel="Zurück">
        <Text style={S.headerArrow}>‹</Text>
      </Pressable>
      <Text style={S.headerTitle} pointerEvents="none">{t.title}</Text>
      <Pressable
        onPress={onToggleTranslate}
        style={S.headerBack}
        accessibilityRole="button"
        accessibilityLabel="Sprache wechseln"
      >
        <MaterialIcons name="translate" size={22} color={translated ? C.blue : C.muted} />
      </Pressable>
    </View>
  );
}

// ─── StatBadge ────────────────────────────────────────────────────────────────

function StatBadge({ icon, value, label, color }: { icon: React.ReactNode; value: string; label: string; color: string }) {
  return (
    <View style={S.statBadge}>
      <View style={S.statIconWrap}>{icon}</View>
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

// ─── PickerRow ────────────────────────────────────────────────────────────────

function PickerRow<T extends string>({
  label,
  icon,
  accent,
  options,
  value,
  onChange,
}: {
  label: string;
  icon: keyof typeof Ionicons.glyphMap;
  accent: string;
  options: readonly T[];
  value: T;
  onChange: (v: T) => void;
}) {
  return (
    <View style={S.pickerRowContainer}>
      <View style={S.row}>
        <View style={[S.rowIcon, { backgroundColor: accent + "22" }]}>
          <Ionicons name={icon} size={18} color={accent} />
        </View>
        <Text style={S.rowLabel}>{label}</Text>
      </View>
      <View style={S.chipRow}>
        {options.map((opt) => {
          const selected = opt === value;
          return (
            <Pressable
              key={opt}
              onPress={() => onChange(opt)}
              style={[S.chip, selected && S.chipSelected]}
              accessibilityRole="button"
              accessibilityLabel={opt}
            >
              <Text style={[S.chipText, selected && S.chipTextSelected]}>{opt}</Text>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

// ─── ProfileScreen ────────────────────────────────────────────────────────────

export default function ProfileScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  // ── Real data hooks ────────────────────────────────────────────────────────
  const { currentStreak, longestStreak } = useStreak();
  const { getTotalMastered, getLevelStars } = useProgress();
  const { roundsPlayed } = useRounds();

  const totalMastered = getTotalMastered();
  const totalStars    = ([1, 2, 3, 4] as const).reduce((sum, lvl) => sum + getLevelStars(lvl), 0);

  // ── Translation ───────────────────────────────────────────────────────────
  const [translated, setTranslated] = useState(false);
  const t = translated ? UI.en : UI.de;

  // ── Saved profile state ────────────────────────────────────────────────────
  const [profile, setProfile] = useState<ProfileData>(DEFAULT_PROFILE);
  const [editing, setEditing] = useState(false);

  // ── Draft state (only committed on Save) ──────────────────────────────────
  const [draftName, setDraftName]               = useState(profile.name);
  const [draftMutter, setDraftMutter]           = useState(profile.muttersprache);
  const [draftLevel, setDraftLevel]             = useState<CefrLevel>(profile.cefrLevel);
  const [draftPhoto, setDraftPhoto]             = useState<string | null>(profile.photoUri);
  const [savePressed, setSavePressed]           = useState(false);

  // ── Load persisted profile ─────────────────────────────────────────────────
  useEffect(() => {
    storage.get<ProfileData>(PROFILE_KEY).then((saved) => {
      if (saved) {
        setProfile(saved);
        setDraftName(saved.name);
        setDraftMutter(saved.muttersprache);
        setDraftLevel(saved.cefrLevel);
        setDraftPhoto(saved.photoUri);
      }
    });
  }, []);

  // ── Start editing: copy live → draft ──────────────────────────────────────
  const startEditing = () => {
    setDraftName(profile.name);
    setDraftMutter(profile.muttersprache);
    setDraftLevel(profile.cefrLevel);
    setDraftPhoto(profile.photoUri);
    setEditing(true);
  };

  // ── Save draft → profile ───────────────────────────────────────────────────
  const saveEdit = async () => {
    const updated: ProfileData = {
      name: draftName.trim() || DEFAULT_PROFILE.name,
      muttersprache: draftMutter,
      cefrLevel: draftLevel,
      photoUri: draftPhoto,
    };
    setProfile(updated);
    await storage.set(PROFILE_KEY, updated);
    setEditing(false);
  };

  // ── Photo picker ──────────────────────────────────────────────────────────
  const pickPhoto = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") return;
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: "images",
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.7,
    });
    if (!result.canceled && result.assets[0]) {
      setDraftPhoto(result.assets[0].uri);
    }
  };

  // ── Avatar display ────────────────────────────────────────────────────────
  const photoUri = editing ? draftPhoto : profile.photoUri;

  // ── Render ────────────────────────────────────────────────────────────────
  return (
    <SafeAreaView style={S.root} edges={["top", "bottom"]}>
      <Stack.Screen options={{ headerShown: false }} />

      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        keyboardVerticalOffset={0}
      >
        <ScrollView
          style={{ flex: 1 }}
          contentContainerStyle={[
            S.scrollContent,
            { paddingBottom: editing ? 100 + insets.bottom : 40 },
          ]}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {/* ── Header bar — scrolls away ── */}
          <ProfileHeader
            onBack={() => router.back()}
            translated={translated}
            onToggleTranslate={() => setTranslated(v => !v)}
          />

          {/* ── Avatar + Name ── */}
          <Animated.View entering={FadeIn.duration(400)} style={S.avatarSection}>

            {/* Avatar — tappable in edit mode */}
            <Pressable
              onPress={editing ? pickPhoto : undefined}
              style={S.avatarRing}
              accessibilityRole={editing ? "button" : "image"}
              accessibilityLabel={editing ? "Foto ändern" : "Profilbild"}
            >
              {photoUri ? (
                <Image source={{ uri: photoUri }} style={S.avatarImage} />
              ) : (
                <View style={S.avatar}>
                  <FontAwesome6 name="user" size={48} color={C.blue} />
                </View>
              )}
              {editing && (
                <View style={S.photoOverlay}>
                  <Ionicons name="camera" size={20} color={C.foreground} />
                </View>
              )}
            </Pressable>

            {/* Name */}
            {editing ? (
              <TextInput
                style={S.nameInput}
                value={draftName}
                onChangeText={setDraftName}
                placeholder="Dein Name"
                placeholderTextColor={C.muted}
                autoCorrect={false}
                maxLength={40}
                selectTextOnFocus
                accessibilityLabel="Name bearbeiten"
              />
            ) : (
              <Text style={S.name}>{profile.name}</Text>
            )}


          </Animated.View>

          {/* ── Stats row ── */}
          <Animated.View entering={FadeInDown.delay(80).duration(400)} style={S.statsRow}>
            <StatBadge
              icon={<FontAwesome6 name="fire" size={22} color="#FF9600" />}
              value={String(currentStreak)}
              label={t.tagesstreak}
              color={C.blue}
            />
            <View style={S.statDivider} />
            <StatBadge
              icon={<Entypo name="star" size={28} color={C.gold} />}
              value={String(totalStars)}
              label={t.sterne}
              color={C.blue}
            />
            <View style={S.statDivider} />
            <StatBadge
              icon={<FontAwesome5 name="brain" size={20} color="#E91E8C" />}
              value={String(totalMastered)}
              label={t.verbenGelernt}
              color={C.blue}
            />
          </Animated.View>

          {/* ── Lernfortschritt ── */}
          <Animated.View entering={FadeInDown.delay(140).duration(400)}>
            <SectionHeader title={t.lernfortschritt} />
            <View style={S.card}>
              <InfoRow icon="flame" label={t.laengsterStreak} value={`${longestStreak} ${t.tage}`} accent="#FF9600" />
              <View style={S.divider} />
              <InfoRow icon="repeat" label={t.gespielteRunden} value={String(roundsPlayed)} accent={C.blue} />
            </View>
          </Animated.View>

          {/* ── Erfolge ── */}
          <Animated.View entering={FadeInDown.delay(200).duration(400)}>
            <SectionHeader title={t.erfolge} />
            <View style={S.card}>
              <InfoRow icon="star" label={t.ersteRunde} value={t.ersteRundeSub} accent={C.gold} />
              <View style={S.divider} />
              <InfoRow icon="flash" label={t.perfekteRunde} value={t.perfekteRundeSub} accent={C.gold} />
              <View style={S.divider} />
              <InfoRow icon="ribbon" label={t.wochenchampion} value={t.wochenchampionSub} accent={C.gold} />
            </View>
          </Animated.View>

          {/* ── Lernprofil — editable in edit mode ── */}
          <Animated.View entering={FadeInDown.delay(260).duration(400)}>
            <SectionHeader title={t.lernprofil} />
            {editing ? (
              <View style={S.card}>

                {/* Muttersprache picker */}
                <PickerRow
                  label={t.muttersprache}
                  icon="language"
                  accent={C.blue}
                  options={MUTTERSPRACHEN}
                  value={draftMutter}
                  onChange={setDraftMutter}
                />

                <View style={S.divider} />

                {/* Zielsprache — fixed Deutsch, pick CEFR level */}
                <View style={S.pickerRowContainer}>
                  <View style={S.row}>
                    <View style={[S.rowIcon, { backgroundColor: C.blue + "22" }]}>
                      <Ionicons name="school" size={18} color={C.blue} />
                    </View>
                    <View style={{ flex: 1 }}>
                      <Text style={S.rowLabel}>{t.zielsprache} — Deutsch</Text>
                      <Text style={[S.rowValue, { color: C.muted, fontSize: 12 }]}>{t.waehleDeinNiveau}</Text>
                    </View>
                  </View>
                  <View style={S.chipRow}>
                    {CEFR_LEVELS.map((lvl) => {
                      const selected = lvl === draftLevel;
                      return (
                        <Pressable
                          key={lvl}
                          onPress={() => setDraftLevel(lvl)}
                          style={[S.chip, selected && S.chipSelected]}
                          accessibilityRole="button"
                          accessibilityLabel={lvl}
                        >
                          <Text style={[S.chipText, selected && S.chipTextSelected]}>{lvl}</Text>
                        </Pressable>
                      );
                    })}
                  </View>
                </View>

              </View>
            ) : (
              <View style={S.card}>
                <InfoRow icon="language" label={t.muttersprache} value={profile.muttersprache} accent={C.blue} />
                <View style={S.divider} />
                <InfoRow icon="school" label={t.zielsprache} value={`Deutsch (${profile.cefrLevel})`} accent={C.blue} />
              </View>
            )}
          </Animated.View>

          {/* ── Profil bearbeiten — end of scroll ── */}
          {!editing && (
            <Pressable
              onPress={startEditing}
              accessibilityRole="button"
              accessibilityLabel="Profil bearbeiten"
              style={[S.editBarBtn, { marginTop: 24 }]}
            >
              <Ionicons name="pencil" size={15} color={C.blue} />
              <Text style={S.editBtnText}>{t.bearbeiten}</Text>
            </Pressable>
          )}

        </ScrollView>

        {/* ── Sticky save button — only in edit mode ── */}
        {editing && (
          <View style={[S.saveBar, { paddingBottom: insets.bottom + 12 }]}>
            <Pressable
              onPress={saveEdit}
              onPressIn={() => setSavePressed(true)}
              onPressOut={() => setSavePressed(false)}
              accessibilityRole="button"
              accessibilityLabel="Änderungen speichern"
              style={[S.saveBtn, {
                borderBottomWidth: savePressed ? 0 : 4,
                borderLeftWidth: savePressed ? 0 : 1.5,
                borderRightWidth: savePressed ? 0 : 1.5,
                borderTopWidth: 0,
                transform: [{ translateY: savePressed ? 4 : 0 }],
              }]}
            >
              <Text style={S.saveBtnText}>{t.fertig}</Text>
            </Pressable>
          </View>
        )}
      </KeyboardAvoidingView>
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
    paddingTop: 0,
  },

  // ── Avatar section ──
  avatarSection: {
    alignItems: "center",
    paddingTop: 6,
    paddingBottom: 24,
  },
  avatarRing: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 3,
    borderColor: C.gold,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 14,
    backgroundColor: C.surface,
    overflow: "hidden",
    shadowColor: C.gold,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.6,
    shadowRadius: 10,
    elevation: 8,
  },
  avatarImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  avatar: {
    alignItems: "center",
    justifyContent: "center",
  },
  photoOverlay: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: 32,
    backgroundColor: "rgba(0,0,0,0.5)",
    alignItems: "center",
    justifyContent: "center",
  },
  name: {
    fontFamily: "GravitasOne_400Regular",
    fontSize: 24,
    color: C.gold,
    letterSpacing: 1,
    marginBottom: 4,
  },
  nameInput: {
    fontFamily: "GravitasOne_400Regular",
    fontSize: 22,
    color: C.foreground,
    letterSpacing: 1,
    marginBottom: 4,
    borderBottomWidth: 2,
    borderBottomColor: C.blue,
    paddingVertical: 4,
    paddingHorizontal: 8,
    minWidth: 180,
    textAlign: "center",
  },
  editBarBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    height: 56,
    borderRadius: 16,
    borderWidth: 1.5,
    borderColor: C.blue,
    backgroundColor: C.surface,
  },
  editBtnText: {
    fontFamily: "Nunito_700Bold",
    fontSize: 15,
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
    paddingHorizontal: 8,
    alignItems: "center",
  },
  statBadge: {
    flex: 1,
    alignItems: "center",
    gap: 6,
  },
  statIconWrap: {
    width: 32,
    height: 32,
    alignItems: "center",
    justifyContent: "center",
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
    height: 40,
    backgroundColor: C.border,
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

  // ── Picker chips ──
  pickerRowContainer: {
    paddingBottom: 14,
  },
  chipRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    paddingHorizontal: 16,
    paddingBottom: 4,
  },
  chip: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 1.5,
    borderColor: C.border,
    backgroundColor: C.bg,
  },
  chipSelected: {
    borderColor: C.blue,
    backgroundColor: C.blue + "22",
  },
  chipText: {
    fontFamily: "Nunito_700Bold",
    fontSize: 13,
    color: C.muted,
  },
  chipTextSelected: {
    color: C.blue,
  },

  // ── Save bar ──
  saveBar: {
    paddingHorizontal: 20,
    paddingTop: 12,
    backgroundColor: C.bg,
    borderTopWidth: 1,
    borderTopColor: C.border,
  },
  saveBtn: {
    height: 56,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: C.gold,
    borderColor: C.goldDark,
  },
  saveBtnText: {
    fontFamily: "Nunito_700Bold",
    fontSize: 16,
    color: C.bg,
    letterSpacing: 0.3,
  },
});
