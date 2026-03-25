import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Pressable,
  useWindowDimensions,
  ScrollView,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Stack, useRouter } from "expo-router";
import { useRef, useState, useCallback } from "react";
import { Ionicons } from "@expo/vector-icons";

// ─── Palette ──────────────────────────────────────────────────────────────────

const C = {
  bg:      "#001d3d",
  surface: "#1A2E35",
  border:  "#2C4551",
  fg:      "#FFFFFF",
  muted:   "#AFAFAF",
  green:   "#58CC02",
  greenBg: "rgba(88,204,2,0.12)",
  blue:    "#1CB0F6",
  gold:    "#FFC800",
  red:     "#FF4B4B",
  noteBg:  "rgba(255,200,0,0.10)",
  noteBorder: "rgba(255,200,0,0.35)",
} as const;

// ─── Helper: InlinePrefix ─────────────────────────────────────────────────────
// Renders a sentence with a highlighted segment. Pass `highlight` as the exact
// substring to colour green; everything else renders in fg.

interface InlinePrefixProps {
  text: string;
  highlight: string;
}

function InlinePrefix({ text, highlight }: InlinePrefixProps) {
  const idx = text.indexOf(highlight);
  if (idx === -1) return <Text style={S.exampleText}>{text}</Text>;
  const before = text.slice(0, idx);
  const after  = text.slice(idx + highlight.length);
  return (
    <Text style={S.exampleText}>
      {before}
      <Text style={S.exampleHighlight}>{highlight}</Text>
      {after}
    </Text>
  );
}

// ─── Helper: SatzklammerDiagram ───────────────────────────────────────────────

interface DiagramProps {
  verb: string;
  middle: string;
  prefix: string;
}

function SatzklammerDiagram({ verb, middle, prefix }: DiagramProps) {
  return (
    <View style={S.diagram}>
      <View style={S.diagramRow}>
        <View style={S.diagramPill}>
          <Text style={S.diagramPillText}>{verb}</Text>
        </View>
        <Text style={S.diagramMiddle}>{middle}</Text>
        <View style={[S.diagramPill, S.diagramPillGreen]}>
          <Text style={[S.diagramPillText, { color: C.green }]}>{prefix}</Text>
        </View>
      </View>
      <View style={S.diagramLabels}>
        <Text style={S.diagramLabel}>Verb (Pos. 2)</Text>
        <Text style={[S.diagramLabel, { color: C.green }]}>Präfix (Ende)</Text>
      </View>
    </View>
  );
}

// ─── Helper: FormulaRow ───────────────────────────────────────────────────────

interface FormulaProps {
  parts: { text: string; highlight?: boolean }[];
  result: string;
}

function FormulaRow({ parts, result }: FormulaProps) {
  return (
    <View style={S.formula}>
      {parts.map((p, i) => (
        <View key={i} style={{ flexDirection: "row", alignItems: "center" }}>
          {i > 0 && <Text style={S.formulaOp}>+</Text>}
          <Text style={[S.formulaPart, p.highlight && { color: C.green }]}>{p.text}</Text>
        </View>
      ))}
      <Text style={S.formulaOp}>=</Text>
      <Text style={S.formulaResult}>{result}</Text>
    </View>
  );
}

// ─── Helper: NoteBox ─────────────────────────────────────────────────────────

function NoteBox({ text }: { text: string }) {
  return (
    <View style={S.noteBox}>
      <Text style={S.noteText}>{text}</Text>
    </View>
  );
}

// ─── Helper: KeyConcept ──────────────────────────────────────────────────────

function KeyConcept({ label }: { label: string }) {
  return (
    <View style={S.keyConcept}>
      <Text style={S.keyConceptText}>{label}</Text>
    </View>
  );
}

// ─── Card data ────────────────────────────────────────────────────────────────

interface CardDef {
  id: string;
  title: string;
  render: () => React.ReactNode;
}

const CARDS: CardDef[] = [
  {
    id: "praesens",
    title: "Präsens & Präteritum — Hauptsatz",
    render: () => (
      <>
        <Text style={S.ruleText}>
          In Hauptsätzen steht das konjugierte Verb an <Text style={S.bold}>Position 2</Text> und
          das Präfix geht ans <Text style={S.bold}>Satzende</Text>. Das nennt man die{" "}
          <Text style={S.bold}>Satzklammer</Text>.
        </Text>

        <SatzklammerDiagram
          verb="stehe"
          middle="jeden Morgen um 7 Uhr"
          prefix="auf"
        />

        <View style={S.exampleBlock}>
          <Text style={S.exampleLabel}>Präsens</Text>
          <InlinePrefix
            text="Ich stehe jeden Morgen um 7 Uhr auf."
            highlight="auf"
          />
          <Text style={S.translation}>I get up every morning at 7.</Text>

          <Text style={[S.exampleLabel, { marginTop: 12 }]}>Präteritum</Text>
          <InlinePrefix
            text="Er rief mich gestern an."
            highlight="an"
          />
          <Text style={S.translation}>He called me yesterday.</Text>
        </View>

        <KeyConcept label="Satzklammer / Verbklammer" />
      </>
    ),
  },
  {
    id: "perfekt",
    title: "Perfekt & Plusquamperfekt — Partizip II",
    render: () => (
      <>
        <Text style={S.ruleText}>
          Im Perfekt hängt das Präfix wieder am Partizip II. Das{" "}
          <Text style={S.bold}>-ge-</Text> wird <Text style={S.bold}>zwischen</Text> Präfix und
          Stamm eingefügt.
        </Text>

        <FormulaRow
          parts={[
            { text: "auf", highlight: true },
            { text: "ge" },
            { text: "macht" },
          ]}
          result="aufgemacht"
        />

        <NoteBox text="Das -ge- steht immer ZWISCHEN Präfix und Verbstamm!" />

        <View style={S.exampleBlock}>
          <Text style={S.exampleLabel}>Perfekt</Text>
          <InlinePrefix
            text="Ich habe die Tür aufgeschlossen."
            highlight="auf"
          />
          <Text style={S.translation}>I unlocked the door.</Text>

          <Text style={[S.exampleLabel, { marginTop: 12 }]}>Plusquamperfekt</Text>
          <InlinePrefix
            text="Er war früh aufgestanden."
            highlight="auf"
          />
          <Text style={S.translation}>He had gotten up early.</Text>

          <Text style={[S.exampleLabel, { marginTop: 12 }]}>Weiteres Beispiel</Text>
          <InlinePrefix
            text="Ich habe die Tür aufgemacht."
            highlight="auf"
          />
          <Text style={S.translation}>I opened the door.</Text>
        </View>
      </>
    ),
  },
  {
    id: "modal",
    title: "Modalverben",
    render: () => (
      <>
        <Text style={S.ruleText}>
          Mit Modalverben (müssen, können, wollen, sollen, dürfen) bleibt das trennbare Verb{" "}
          <Text style={S.bold}>zusammen als Infinitiv</Text> am Satzende.
        </Text>

        <View style={S.exampleBlock}>
          <InlinePrefix
            text="Ich muss die Tür aufmachen."
            highlight="auf"
          />
          <Text style={S.translation}>I have to open the door.</Text>

          <View style={S.exampleSpacer} />

          <InlinePrefix
            text="Er will morgen früh aufstehen."
            highlight="auf"
          />
          <Text style={S.translation}>He wants to get up early tomorrow.</Text>
        </View>

        <KeyConcept label="Modal + Infinitiv am Ende — kein Trennen!" />
      </>
    ),
  },
  {
    id: "nebensatz",
    title: "Nebensätze — Keine Trennung!",
    render: () => (
      <>
        <Text style={S.ruleText}>
          In Nebensätzen (weil, dass, wenn, obwohl, ob…) wird das trennbare Verb{" "}
          <Text style={S.bold}>nicht getrennt</Text>. Es steht zusammen am{" "}
          <Text style={S.bold}>Satzende</Text>.
        </Text>

        <View style={S.exampleBlock}>
          <InlinePrefix
            text="Ich weiß, dass er um sechs Uhr aufsteht."
            highlight="auf"
          />
          <Text style={S.translation}>I know that he gets up at six.</Text>

          <View style={S.exampleSpacer} />

          <InlinePrefix
            text="Sie sagte, dass sie ihn später anruft."
            highlight="an"
          />
          <Text style={S.translation}>She said she'd call him later.</Text>

          <View style={S.exampleSpacer} />

          <InlinePrefix
            text="...obwohl ich die Tür aufmache."
            highlight="auf"
          />
          <Text style={S.translation}>...even though I open the door.</Text>
        </View>

        <KeyConcept label="Im Nebensatz: KEINE Trennung!" />
      </>
    ),
  },
  {
    id: "infinitiv",
    title: "Infinitiv mit 'zu'",
    render: () => (
      <>
        <Text style={S.ruleText}>
          Bei „zu + Infinitiv" wird das <Text style={S.bold}>zu</Text> zwischen Präfix und
          Verbstamm eingefügt — als <Text style={S.bold}>ein Wort</Text>.
        </Text>

        <FormulaRow
          parts={[
            { text: "auf", highlight: true },
            { text: "zu" },
            { text: "machen" },
          ]}
          result="aufzumachen"
        />

        <View style={S.exampleBlock}>
          <InlinePrefix
            text="Ich habe vergessen, das Licht auszuschalten."
            highlight="aus"
          />
          <Text style={S.translation}>I forgot to turn off the light.</Text>

          <View style={S.exampleSpacer} />

          <InlinePrefix
            text="Er hat vor, morgen anzurufen."
            highlight="an"
          />
          <Text style={S.translation}>He plans to call tomorrow.</Text>

          <View style={S.exampleSpacer} />

          <InlinePrefix
            text="Ich versuche, die Tür aufzumachen."
            highlight="auf"
          />
          <Text style={S.translation}>I'm trying to open the door.</Text>
        </View>

        <KeyConcept label="zu geht ZWISCHEN Präfix und Stamm!" />
      </>
    ),
  },
  {
    id: "imperativ",
    title: "Imperativ",
    render: () => (
      <>
        <Text style={S.ruleText}>
          Im Imperativ trennt sich das Verb: das konjugierte Verb steht am{" "}
          <Text style={S.bold}>Satzanfang</Text>, das Präfix am <Text style={S.bold}>Ende</Text>.
        </Text>

        <View style={S.exampleBlock}>
          <Text style={S.exampleLabel}>du-Form</Text>
          <InlinePrefix text="Steh bitte auf!" highlight="auf" />
          <Text style={S.translation}>Get up, please!</Text>

          <Text style={[S.exampleLabel, { marginTop: 12 }]}>Sie-Form</Text>
          <InlinePrefix text="Rufen Sie ihn bitte an!" highlight="an" />
          <Text style={S.translation}>Please call him!</Text>

          <Text style={[S.exampleLabel, { marginTop: 12 }]}>ihr-Form</Text>
          <InlinePrefix text="Macht das Fenster zu!" highlight="zu" />
          <Text style={S.translation}>Close the window!</Text>
        </View>

        <KeyConcept label="Imperativ: Verb vorne, Präfix hinten!" />
      </>
    ),
  },
  {
    id: "fragen",
    title: "Fragen",
    render: () => (
      <>
        <Text style={S.ruleText}>
          In Ja/Nein-Fragen steht das konjugierte Verb an{" "}
          <Text style={S.bold}>erster Stelle</Text>, das Präfix weiterhin am{" "}
          <Text style={S.bold}>Satzende</Text>.
        </Text>

        <View style={S.exampleBlock}>
          <InlinePrefix text="Machst du die Tür auf?" highlight="auf" />
          <Text style={S.translation}>Are you opening the door?</Text>

          <View style={S.exampleSpacer} />

          <InlinePrefix text="Stehst du morgen früh auf?" highlight="auf" />
          <Text style={S.translation}>Are you getting up early tomorrow?</Text>
        </View>

        <KeyConcept label="Fragen: Verb zuerst, Präfix zuletzt!" />
      </>
    ),
  },
];

// ─── RegelnDetailScreen ───────────────────────────────────────────────────────

export default function RegelnDetailScreen() {
  const router = useRouter();
  const { width } = useWindowDimensions();
  const CARD_WIDTH = width - 32; // 16px padding each side

  const listRef = useRef<FlatList>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  const onViewableItemsChanged = useCallback(
    ({ viewableItems }: { viewableItems: { index: number | null }[] }) => {
      if (viewableItems[0]?.index != null) {
        setActiveIndex(viewableItems[0].index);
      }
    },
    [],
  );

  const scrollToIndex = (index: number) => {
    listRef.current?.scrollToIndex({ index, animated: true });
    setActiveIndex(index);
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
        <Text style={S.headerTitle}>Die Grundregeln</Text>
        <View style={S.backBtn} />
      </View>

      {/* Counter */}
      <Text style={S.counter}>{activeIndex + 1} / {CARDS.length}</Text>

      {/* Carousel */}
      <FlatList
        ref={listRef}
        data={CARDS}
        keyExtractor={(item) => item.id}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        snapToInterval={CARD_WIDTH + 16}
        snapToAlignment="start"
        decelerationRate="fast"
        contentContainerStyle={{ paddingHorizontal: 16, gap: 16 }}
        onViewableItemsChanged={onViewableItemsChanged}
        viewabilityConfig={{ itemVisiblePercentThreshold: 50 }}
        renderItem={({ item }) => (
          <View style={[S.card, { width: CARD_WIDTH }]}>
            <ScrollView
              showsVerticalScrollIndicator={false}
              contentContainerStyle={{ paddingBottom: 8 }}
            >
              <Text style={S.cardTitle}>{item.title}</Text>
              <View style={S.divider} />
              {item.render()}
            </ScrollView>
          </View>
        )}
      />

      {/* Dot indicators */}
      <View style={S.dots}>
        {CARDS.map((_, i) => (
          <Pressable
            key={i}
            onPress={() => scrollToIndex(i)}
            hitSlop={8}
            accessibilityRole="button"
            accessibilityLabel={`Karte ${i + 1}`}
          >
            <View style={[S.dot, i === activeIndex && S.dotActive]} />
          </Pressable>
        ))}
      </View>
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

  counter: {
    fontFamily: "Nunito_700Bold",
    fontSize: 13,
    color: C.muted,
    textAlign: "center",
    marginTop: 12,
    marginBottom: 4,
  },

  // ── Card ──
  card: {
    backgroundColor: C.surface,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: C.border,
    borderBottomWidth: 4,
    borderBottomColor: "#0A1A22",
    padding: 20,
    marginVertical: 8,
    flex: 1,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 8,
  },
  cardTitle: {
    fontFamily: "Nunito_700Bold",
    fontSize: 17,
    color: C.fg,
    marginBottom: 10,
    lineHeight: 24,
  },
  divider: {
    height: 1,
    backgroundColor: C.border,
    marginBottom: 14,
  },

  // ── Rule text ──
  ruleText: {
    fontFamily: "Nunito_400Regular",
    fontSize: 14,
    color: C.muted,
    lineHeight: 22,
    marginBottom: 16,
  },
  bold: {
    fontFamily: "Nunito_700Bold",
    color: C.fg,
  },

  // ── Diagram ──
  diagram: {
    backgroundColor: "rgba(0,0,0,0.25)",
    borderRadius: 14,
    padding: 14,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: C.border,
  },
  diagramRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    flexWrap: "wrap",
  },
  diagramPill: {
    backgroundColor: "rgba(255,255,255,0.08)",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: C.border,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  diagramPillGreen: {
    backgroundColor: C.greenBg,
    borderColor: C.green,
  },
  diagramPillText: {
    fontFamily: "Nunito_700Bold",
    fontSize: 15,
    color: C.fg,
  },
  diagramMiddle: {
    fontFamily: "Nunito_400Regular",
    fontSize: 13,
    color: C.muted,
    flex: 1,
    textAlign: "center",
  },
  diagramLabels: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 8,
  },
  diagramLabel: {
    fontFamily: "Nunito_400Regular",
    fontSize: 11,
    color: C.muted,
  },

  // ── Formula ──
  formula: {
    flexDirection: "row",
    alignItems: "center",
    flexWrap: "wrap",
    gap: 6,
    backgroundColor: "rgba(0,0,0,0.25)",
    borderRadius: 12,
    padding: 14,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: C.border,
  },
  formulaPart: {
    fontFamily: "Nunito_700Bold",
    fontSize: 16,
    color: C.fg,
  },
  formulaOp: {
    fontFamily: "Nunito_400Regular",
    fontSize: 16,
    color: C.muted,
    paddingHorizontal: 2,
  },
  formulaResult: {
    fontFamily: "Nunito_700Bold",
    fontSize: 16,
    color: C.green,
  },

  // ── Examples ──
  exampleBlock: {
    backgroundColor: "rgba(0,0,0,0.2)",
    borderRadius: 12,
    padding: 14,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: C.border,
    gap: 2,
  },
  exampleLabel: {
    fontFamily: "Nunito_700Bold",
    fontSize: 11,
    color: C.blue,
    textTransform: "uppercase",
    letterSpacing: 0.8,
    marginBottom: 4,
  },
  exampleText: {
    fontFamily: "Nunito_700Bold",
    fontSize: 15,
    color: C.fg,
    lineHeight: 22,
  },
  exampleHighlight: {
    color: C.green,
  },
  translation: {
    fontFamily: "Nunito_400Regular",
    fontSize: 12,
    color: C.muted,
    fontStyle: "italic",
    lineHeight: 18,
    marginTop: 2,
  },
  exampleSpacer: {
    height: 10,
  },

  // ── Note box ──
  noteBox: {
    backgroundColor: C.noteBg,
    borderWidth: 1,
    borderColor: C.noteBorder,
    borderRadius: 10,
    padding: 12,
    marginBottom: 14,
  },
  noteText: {
    fontFamily: "Nunito_700Bold",
    fontSize: 13,
    color: C.gold,
    lineHeight: 19,
    textAlign: "center",
  },

  // ── Key concept ──
  keyConcept: {
    alignSelf: "flex-start",
    backgroundColor: C.greenBg,
    borderWidth: 1,
    borderColor: C.green,
    borderRadius: 20,
    paddingHorizontal: 14,
    paddingVertical: 6,
    marginTop: 2,
  },
  keyConceptText: {
    fontFamily: "Nunito_700Bold",
    fontSize: 12,
    color: C.green,
    letterSpacing: 0.3,
  },

  // ── Dots ──
  dots: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 8,
    paddingVertical: 16,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: C.border,
  },
  dotActive: {
    width: 22,
    height: 8,
    borderRadius: 4,
    backgroundColor: C.green,
  },
});
