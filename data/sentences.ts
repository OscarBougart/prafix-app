import type { Sentence } from "./types";

// ─────────────────────────────────────────────────────────────────────────────
// LEVEL 1 — A1  |  Präsens only  |  Main clauses  |  Prefix at end
//
// Template format (two blanks):
//   "Ich _____ die Tür _____."
//   conjugatedStem fills blank 1 (verb position)
//   correctPrefix  fills blank 2 (end of clause)
// ─────────────────────────────────────────────────────────────────────────────

// ── aufmachen ─────────────────────────────────────────────────────────────────
const aufmachenL1: Sentence[] = [
  {
    id: "s001", verbInfinitive: "aufmachen", tense: "praesens", level: 1, subLevel: 1,
    template: "Ich _____ die Tür weit _____ — es ist sehr heiß drinnen.",
    conjugatedStem: "mache", correctPrefix: "auf", distractors: ["zu", "an", "ab"],
    translation: "I open the door wide — it is very hot inside.",
  },
  {
    id: "s002", verbInfinitive: "aufmachen", tense: "praesens", level: 1, subLevel: 2,
    template: "Er _____ das Fenster _____, weil es so stickig ist.",
    conjugatedStem: "macht", correctPrefix: "auf", distractors: ["zu", "an", "ab"],
    translation: "He opens the window because it is so stuffy.",
  },
  {
    id: "s003", verbInfinitive: "aufmachen", tense: "praesens", level: 1, subLevel: 3,
    template: "Wir _____ die Flasche _____.",
    conjugatedStem: "machen", correctPrefix: "auf", distractors: ["zu", "an", "ab"],
    translation: "We open the bottle.",
  },
  {
    id: "s004", verbInfinitive: "aufmachen", tense: "praesens", level: 1, subLevel: 4,
    template: "Sie _____ den Laden um acht Uhr _____.",
    conjugatedStem: "macht", correctPrefix: "auf", distractors: ["zu", "an", "ab"],
    translation: "She opens the shop at eight o'clock.",
  },
  {
    id: "s005", verbInfinitive: "aufmachen", tense: "praesens", level: 1, subLevel: 5,
    template: "Du _____ immer alle Türen _____.",
    conjugatedStem: "machst", correctPrefix: "auf", distractors: ["zu", "an", "ab"],
    translation: "You always open all the doors.",
  },
];

// ── zumachen ──────────────────────────────────────────────────────────────────
const zumachenL1: Sentence[] = [
  {
    id: "s006", verbInfinitive: "zumachen", tense: "praesens", level: 1, subLevel: 1,
    template: "Ich _____ die Tür _____, damit es ruhig bleibt.",
    conjugatedStem: "mache", correctPrefix: "zu", distractors: ["auf", "an", "ab"],
    translation: "I close the door so that it stays quiet.",
  },
  {
    id: "s007", verbInfinitive: "zumachen", tense: "praesens", level: 1, subLevel: 2,
    template: "Er _____ das Fenster _____, weil es draußen so laut ist.",
    conjugatedStem: "macht", correctPrefix: "zu", distractors: ["auf", "an", "ab"],
    translation: "He closes the window because it is so loud outside.",
  },
  {
    id: "s008", verbInfinitive: "zumachen", tense: "praesens", level: 1, subLevel: 3,
    template: "Sie _____ ihre Tasche _____.",
    conjugatedStem: "macht", correctPrefix: "zu", distractors: ["auf", "an", "ab"],
    translation: "She closes her bag.",
  },
  {
    id: "s009", verbInfinitive: "zumachen", tense: "praesens", level: 1, subLevel: 4,
    template: "Wir _____ den Laden um 18 Uhr _____.",
    conjugatedStem: "machen", correctPrefix: "zu", distractors: ["auf", "an", "ab"],
    translation: "We close the shop at 6 pm.",
  },
  {
    id: "s010", verbInfinitive: "zumachen", tense: "praesens", level: 1, subLevel: 5,
    template: "Du _____ immer alle Fenster _____.",
    conjugatedStem: "machst", correctPrefix: "zu", distractors: ["auf", "an", "ab"],
    translation: "You always close all the windows.",
  },
];

// ── anfangen ──────────────────────────────────────────────────────────────────
const anfangenL1: Sentence[] = [
  {
    id: "s011", verbInfinitive: "anfangen", tense: "praesens", level: 1, subLevel: 1,
    template: "Ich _____ jetzt mit der Arbeit _____.",
    conjugatedStem: "fange", correctPrefix: "an", distractors: ["auf", "ab", "ein"],
    translation: "I start work now.",
  },
  {
    id: "s012", verbInfinitive: "anfangen", tense: "praesens", level: 1, subLevel: 2,
    template: "Der Film _____ um 20 Uhr _____.",
    conjugatedStem: "fängt", correctPrefix: "an", distractors: ["auf", "ab", "ein"],
    translation: "The film starts at 8 pm.",
  },
  {
    id: "s013", verbInfinitive: "anfangen", tense: "praesens", level: 1, subLevel: 3,
    template: "Wir _____ morgen mit dem Kurs _____.",
    conjugatedStem: "fangen", correctPrefix: "an", distractors: ["auf", "ab", "ein"],
    translation: "We start the course tomorrow.",
  },
  {
    id: "s014", verbInfinitive: "anfangen", tense: "praesens", level: 1, subLevel: 4,
    template: "Du _____ immer zu spät _____.",
    conjugatedStem: "fängst", correctPrefix: "an", distractors: ["auf", "ab", "ein"],
    translation: "You always start too late.",
  },
  {
    id: "s015", verbInfinitive: "anfangen", tense: "praesens", level: 1, subLevel: 5,
    template: "Die Schule _____ um acht Uhr _____.",
    conjugatedStem: "fängt", correctPrefix: "an", distractors: ["auf", "ab", "ein"],
    translation: "School starts at eight o'clock.",
  },
];

// ── aufstehen ─────────────────────────────────────────────────────────────────
const aufstehenL1: Sentence[] = [
  {
    id: "s016", verbInfinitive: "aufstehen", tense: "praesens", level: 1, subLevel: 1,
    template: "Ich _____ jeden Morgen um sechs Uhr früh _____.",
    conjugatedStem: "stehe", correctPrefix: "auf", distractors: ["an", "ab", "ein"],
    translation: "I get up early at six o'clock every morning.",
  },
  {
    id: "s017", verbInfinitive: "aufstehen", tense: "praesens", level: 1, subLevel: 2,
    template: "Er _____ um sechs Uhr _____.",
    conjugatedStem: "steht", correctPrefix: "auf", distractors: ["an", "ab", "ein"],
    translation: "He gets up at six o'clock.",
  },
  {
    id: "s018", verbInfinitive: "aufstehen", tense: "praesens", level: 1, subLevel: 3,
    template: "Wir _____ am Wochenende spät _____.",
    conjugatedStem: "stehen", correctPrefix: "auf", distractors: ["an", "ab", "ein"],
    translation: "We get up late at the weekend.",
  },
  {
    id: "s019", verbInfinitive: "aufstehen", tense: "praesens", level: 1, subLevel: 4,
    template: "Du _____ heute zu früh _____.",
    conjugatedStem: "stehst", correctPrefix: "auf", distractors: ["an", "ab", "ein"],
    translation: "You get up too early today.",
  },
  {
    id: "s020", verbInfinitive: "aufstehen", tense: "praesens", level: 1, subLevel: 5,
    template: "Sie _____ immer als Erste _____.",
    conjugatedStem: "steht", correctPrefix: "auf", distractors: ["an", "ab", "ein"],
    translation: "She always gets up first.",
  },
];

// ── einkaufen ─────────────────────────────────────────────────────────────────
const einkaufenL1: Sentence[] = [
  {
    id: "s021", verbInfinitive: "einkaufen", tense: "praesens", level: 1, subLevel: 1,
    template: "Ich _____ heute im Supermarkt _____.",
    conjugatedStem: "kaufe", correctPrefix: "ein", distractors: ["aus", "an", "auf"],
    translation: "I go shopping at the supermarket today.",
  },
  {
    id: "s022", verbInfinitive: "einkaufen", tense: "praesens", level: 1, subLevel: 2,
    template: "Meine Mutter _____ jeden Tag _____.",
    conjugatedStem: "kauft", correctPrefix: "ein", distractors: ["aus", "an", "auf"],
    translation: "My mother goes shopping every day.",
  },
  {
    id: "s023", verbInfinitive: "einkaufen", tense: "praesens", level: 1, subLevel: 3,
    template: "Wir _____ zusammen _____.",
    conjugatedStem: "kaufen", correctPrefix: "ein", distractors: ["aus", "an", "auf"],
    translation: "We go shopping together.",
  },
  {
    id: "s024", verbInfinitive: "einkaufen", tense: "praesens", level: 1, subLevel: 4,
    template: "Du _____ zu viel _____.",
    conjugatedStem: "kaufst", correctPrefix: "ein", distractors: ["aus", "an", "auf"],
    translation: "You buy too much.",
  },
  {
    id: "s025", verbInfinitive: "einkaufen", tense: "praesens", level: 1, subLevel: 5,
    template: "Er _____ für die Party _____.",
    conjugatedStem: "kauft", correctPrefix: "ein", distractors: ["aus", "an", "auf"],
    translation: "He goes shopping for the party.",
  },
];

// ── anrufen ───────────────────────────────────────────────────────────────────
const anrufenL1: Sentence[] = [
  {
    id: "s026", verbInfinitive: "anrufen", tense: "praesens", level: 1, subLevel: 1,
    template: "Ich _____ meine Mutter _____.",
    conjugatedStem: "rufe", correctPrefix: "an", distractors: ["auf", "ab", "ein"],
    translation: "I call my mother.",
  },
  {
    id: "s027", verbInfinitive: "anrufen", tense: "praesens", level: 1, subLevel: 2,
    template: "Er _____ mich jeden Tag _____.",
    conjugatedStem: "ruft", correctPrefix: "an", distractors: ["auf", "ab", "ein"],
    translation: "He calls me every day.",
  },
  {
    id: "s028", verbInfinitive: "anrufen", tense: "praesens", level: 1, subLevel: 3,
    template: "Sie _____ ihre Freundin _____.",
    conjugatedStem: "ruft", correctPrefix: "an", distractors: ["auf", "ab", "ein"],
    translation: "She calls her friend.",
  },
  {
    id: "s029", verbInfinitive: "anrufen", tense: "praesens", level: 1, subLevel: 4,
    template: "Wir _____ das Restaurant _____.",
    conjugatedStem: "rufen", correctPrefix: "an", distractors: ["auf", "ab", "ein"],
    translation: "We call the restaurant.",
  },
  {
    id: "s030", verbInfinitive: "anrufen", tense: "praesens", level: 1, subLevel: 5,
    template: "Du _____ mich heute Abend _____.",
    conjugatedStem: "rufst", correctPrefix: "an", distractors: ["auf", "ab", "ein"],
    translation: "You call me tonight.",
  },
];

// ── aufräumen ─────────────────────────────────────────────────────────────────
const aufraeumenL1: Sentence[] = [
  {
    id: "s031", verbInfinitive: "aufräumen", tense: "praesens", level: 1, subLevel: 1,
    template: "Ich _____ mein Zimmer _____.",
    conjugatedStem: "räume", correctPrefix: "auf", distractors: ["ab", "an", "ein"],
    translation: "I tidy up my room.",
  },
  {
    id: "s032", verbInfinitive: "aufräumen", tense: "praesens", level: 1, subLevel: 2,
    template: "Er _____ die Küche _____.",
    conjugatedStem: "räumt", correctPrefix: "auf", distractors: ["ab", "an", "ein"],
    translation: "He tidies up the kitchen.",
  },
  {
    id: "s033", verbInfinitive: "aufräumen", tense: "praesens", level: 1, subLevel: 3,
    template: "Wir _____ zusammen das Haus _____.",
    conjugatedStem: "räumen", correctPrefix: "auf", distractors: ["ab", "an", "ein"],
    translation: "We tidy up the house together.",
  },
  {
    id: "s034", verbInfinitive: "aufräumen", tense: "praesens", level: 1, subLevel: 4,
    template: "Du _____ dein Zimmer nie _____.",
    conjugatedStem: "räumst", correctPrefix: "auf", distractors: ["ab", "an", "ein"],
    translation: "You never tidy up your room.",
  },
  {
    id: "s035", verbInfinitive: "aufräumen", tense: "praesens", level: 1, subLevel: 5,
    template: "Die Kinder _____ ihre Spielsachen _____.",
    conjugatedStem: "räumen", correctPrefix: "auf", distractors: ["ab", "an", "ein"],
    translation: "The children tidy up their toys.",
  },
];

// ── mitkommen ─────────────────────────────────────────────────────────────────
const mitkommenL1: Sentence[] = [
  {
    id: "s036", verbInfinitive: "mitkommen", tense: "praesens", level: 1, subLevel: 1,
    template: "Ich _____ heute gern _____.",
    conjugatedStem: "komme", correctPrefix: "mit", distractors: ["an", "auf", "ab"],
    translation: "I like coming along today.",
  },
  {
    id: "s037", verbInfinitive: "mitkommen", tense: "praesens", level: 1, subLevel: 2,
    template: "Er _____ auch _____.",
    conjugatedStem: "kommt", correctPrefix: "mit", distractors: ["an", "auf", "ab"],
    translation: "He comes along too.",
  },
  {
    id: "s038", verbInfinitive: "mitkommen", tense: "praesens", level: 1, subLevel: 3,
    template: "Meine Schwester _____ ins Kino _____.",
    conjugatedStem: "kommt", correctPrefix: "mit", distractors: ["an", "auf", "ab"],
    translation: "My sister comes along to the cinema.",
  },
  {
    id: "s039", verbInfinitive: "mitkommen", tense: "praesens", level: 1, subLevel: 4,
    template: "Wir _____ zur Party _____.",
    conjugatedStem: "kommen", correctPrefix: "mit", distractors: ["an", "auf", "ab"],
    translation: "We come along to the party.",
  },
  {
    id: "s040", verbInfinitive: "mitkommen", tense: "praesens", level: 1, subLevel: 5,
    template: "Du _____ morgen zum Sport _____.",
    conjugatedStem: "kommst", correctPrefix: "mit", distractors: ["an", "auf", "ab"],
    translation: "You come along to sports tomorrow.",
  },
];

// ── ausgehen ──────────────────────────────────────────────────────────────────
const ausgehenL1: Sentence[] = [
  {
    id: "s041", verbInfinitive: "ausgehen", tense: "praesens", level: 1, subLevel: 1,
    template: "Ich _____ heute Abend _____.",
    conjugatedStem: "gehe", correctPrefix: "aus", distractors: ["an", "auf", "ein"],
    translation: "I am going out tonight.",
  },
  {
    id: "s042", verbInfinitive: "ausgehen", tense: "praesens", level: 1, subLevel: 2,
    template: "Er _____ oft am Wochenende _____.",
    conjugatedStem: "geht", correctPrefix: "aus", distractors: ["an", "auf", "ein"],
    translation: "He often goes out at the weekend.",
  },
  {
    id: "s043", verbInfinitive: "ausgehen", tense: "praesens", level: 1, subLevel: 3,
    template: "Wir _____ freitags oft _____.",
    conjugatedStem: "gehen", correctPrefix: "aus", distractors: ["an", "auf", "ein"],
    translation: "We often go out on Fridays.",
  },
  {
    id: "s044", verbInfinitive: "ausgehen", tense: "praesens", level: 1, subLevel: 4,
    template: "Du _____ zu oft _____.",
    conjugatedStem: "gehst", correctPrefix: "aus", distractors: ["an", "auf", "ein"],
    translation: "You go out too often.",
  },
  {
    id: "s045", verbInfinitive: "ausgehen", tense: "praesens", level: 1, subLevel: 5,
    template: "Sie _____ jeden Samstag _____.",
    conjugatedStem: "geht", correctPrefix: "aus", distractors: ["an", "auf", "ein"],
    translation: "She goes out every Saturday.",
  },
];

// ── fernsehen ─────────────────────────────────────────────────────────────────
const fernsehenL1: Sentence[] = [
  {
    id: "s046", verbInfinitive: "fernsehen", tense: "praesens", level: 1, subLevel: 1,
    template: "Ich _____ jeden Abend _____.",
    conjugatedStem: "sehe", correctPrefix: "fern", distractors: ["an", "ab", "mit"],
    translation: "I watch TV every evening.",
  },
  {
    id: "s047", verbInfinitive: "fernsehen", tense: "praesens", level: 1, subLevel: 2,
    template: "Er _____ zu viel _____.",
    conjugatedStem: "sieht", correctPrefix: "fern", distractors: ["an", "ab", "mit"],
    translation: "He watches too much TV.",
  },
  {
    id: "s048", verbInfinitive: "fernsehen", tense: "praesens", level: 1, subLevel: 3,
    template: "Wir _____ zusammen _____.",
    conjugatedStem: "sehen", correctPrefix: "fern", distractors: ["an", "ab", "mit"],
    translation: "We watch TV together.",
  },
  {
    id: "s049", verbInfinitive: "fernsehen", tense: "praesens", level: 1, subLevel: 4,
    template: "Du _____ heute Abend _____.",
    conjugatedStem: "siehst", correctPrefix: "fern", distractors: ["an", "ab", "mit"],
    translation: "You watch TV tonight.",
  },
  {
    id: "s050", verbInfinitive: "fernsehen", tense: "praesens", level: 1, subLevel: 5,
    template: "Die Kinder _____ nach der Schule _____.",
    conjugatedStem: "sehen", correctPrefix: "fern", distractors: ["an", "ab", "mit"],
    translation: "The children watch TV after school.",
  },
];

// ─────────────────────────────────────────────────────────────────────────────
// LEVEL 2 — A2  |  Präsens only  |  Main clauses
// ─────────────────────────────────────────────────────────────────────────────

// ── ankommen ──────────────────────────────────────────────────────────────────
const ankommenL2: Sentence[] = [
  {
    id: "s051", verbInfinitive: "ankommen", tense: "praesens", level: 2, subLevel: 1,
    template: "Der Zug aus München _____ um 15 Uhr in Berlin _____.",
    conjugatedStem: "kommt", correctPrefix: "an", distractors: ["ab", "auf", "mit"],
    translation: "The train from Munich arrives in Berlin at 3 pm.",
  },
  {
    id: "s052", verbInfinitive: "ankommen", tense: "praesens", level: 2, subLevel: 2,
    template: "Ich _____ morgen in Berlin _____.",
    conjugatedStem: "komme", correctPrefix: "an", distractors: ["ab", "auf", "mit"],
    translation: "I arrive in Berlin tomorrow.",
  },
  {
    id: "s053", verbInfinitive: "ankommen", tense: "praesens", level: 2, subLevel: 3,
    template: "Wir _____ nach einer langen Reise endlich _____.",
    conjugatedStem: "kommen", correctPrefix: "an", distractors: ["ab", "auf", "mit"],
    translation: "We finally arrive after a long journey.",
  },
  {
    id: "s054", verbInfinitive: "ankommen", tense: "praesens", level: 2, subLevel: 4,
    template: "Das Paket _____ morgen _____.",
    conjugatedStem: "kommt", correctPrefix: "an", distractors: ["ab", "auf", "mit"],
    translation: "The package arrives tomorrow.",
  },
  {
    id: "s055", verbInfinitive: "ankommen", tense: "praesens", level: 2, subLevel: 5,
    template: "Er _____ nach der Reise immer pünktlich _____.",
    conjugatedStem: "kommt", correctPrefix: "an", distractors: ["ab", "auf", "mit"],
    translation: "He always arrives on time after the journey.",
  },
];

// ── abfahren ──────────────────────────────────────────────────────────────────
const abfahrenL2: Sentence[] = [
  {
    id: "s056", verbInfinitive: "abfahren", tense: "praesens", level: 2, subLevel: 1,
    template: "Der Zug _____ um neun Uhr _____.",
    conjugatedStem: "fährt", correctPrefix: "ab", distractors: ["an", "auf", "los"],
    translation: "The train departs at nine o'clock.",
  },
  {
    id: "s057", verbInfinitive: "abfahren", tense: "praesens", level: 2, subLevel: 2,
    template: "Wir _____ morgen früh _____.",
    conjugatedStem: "fahren", correctPrefix: "ab", distractors: ["an", "auf", "los"],
    translation: "We depart early tomorrow.",
  },
  {
    id: "s058", verbInfinitive: "abfahren", tense: "praesens", level: 2, subLevel: 3,
    template: "Der Bus _____ in fünf Minuten _____.",
    conjugatedStem: "fährt", correctPrefix: "ab", distractors: ["an", "auf", "los"],
    translation: "The bus departs in five minutes.",
  },
  {
    id: "s059", verbInfinitive: "abfahren", tense: "praesens", level: 2, subLevel: 4,
    template: "Ich _____ nach dem Frühstück _____.",
    conjugatedStem: "fahre", correctPrefix: "ab", distractors: ["an", "auf", "los"],
    translation: "I depart after breakfast.",
  },
  {
    id: "s060", verbInfinitive: "abfahren", tense: "praesens", level: 2, subLevel: 5,
    template: "Sie _____ heute Nachmittag _____.",
    conjugatedStem: "fährt", correctPrefix: "ab", distractors: ["an", "auf", "los"],
    translation: "She departs this afternoon.",
  },
];

// ── einladen ──────────────────────────────────────────────────────────────────
const einladenL2: Sentence[] = [
  {
    id: "s061", verbInfinitive: "einladen", tense: "praesens", level: 2, subLevel: 1,
    template: "Ich _____ meine Freunde zu meiner Geburtstagsparty _____.",
    conjugatedStem: "lade", correctPrefix: "ein", distractors: ["an", "auf", "vor"],
    translation: "I invite my friends to my birthday party.",
  },
  {
    id: "s062", verbInfinitive: "einladen", tense: "praesens", level: 2, subLevel: 2,
    template: "Er _____ uns zu einem Abendessen bei ihm zu Hause _____.",
    conjugatedStem: "lädt", correctPrefix: "ein", distractors: ["an", "auf", "vor"],
    translation: "He invites us to a dinner at his home.",
  },
  {
    id: "s063", verbInfinitive: "einladen", tense: "praesens", level: 2, subLevel: 3,
    template: "Wir _____ die ganze Familie _____.",
    conjugatedStem: "laden", correctPrefix: "ein", distractors: ["an", "auf", "vor"],
    translation: "We invite the whole family.",
  },
  {
    id: "s064", verbInfinitive: "einladen", tense: "praesens", level: 2, subLevel: 4,
    template: "Sie _____ ihn zur Party _____.",
    conjugatedStem: "lädt", correctPrefix: "ein", distractors: ["an", "auf", "vor"],
    translation: "She invites him to the party.",
  },
  {
    id: "s065", verbInfinitive: "einladen", tense: "praesens", level: 2, subLevel: 5,
    template: "Du _____ zu viele Menschen _____.",
    conjugatedStem: "lädst", correctPrefix: "ein", distractors: ["an", "auf", "vor"],
    translation: "You invite too many people.",
  },
];

// ── vorstellen ────────────────────────────────────────────────────────────────
const vorstellenL2: Sentence[] = [
  {
    id: "s066", verbInfinitive: "vorstellen", tense: "praesens", level: 2, subLevel: 1,
    template: "Ich _____ mich den Kollegen _____.",
    conjugatedStem: "stelle", correctPrefix: "vor", distractors: ["nach", "ein", "an"],
    translation: "I introduce myself to the colleagues.",
  },
  {
    id: "s067", verbInfinitive: "vorstellen", tense: "praesens", level: 2, subLevel: 2,
    template: "Er _____ mir seine Freundin _____.",
    conjugatedStem: "stellt", correctPrefix: "vor", distractors: ["nach", "ein", "an"],
    translation: "He introduces his girlfriend to me.",
  },
  {
    id: "s068", verbInfinitive: "vorstellen", tense: "praesens", level: 2, subLevel: 3,
    template: "Wir _____ uns der Gruppe _____.",
    conjugatedStem: "stellen", correctPrefix: "vor", distractors: ["nach", "ein", "an"],
    translation: "We introduce ourselves to the group.",
  },
  {
    id: "s069", verbInfinitive: "vorstellen", tense: "praesens", level: 2, subLevel: 4,
    template: "Du _____ dir eine neue Wohnung _____.",
    conjugatedStem: "stellst", correctPrefix: "vor", distractors: ["nach", "ein", "an"],
    translation: "You imagine a new apartment.",
  },
  {
    id: "s070", verbInfinitive: "vorstellen", tense: "praesens", level: 2, subLevel: 5,
    template: "Sie _____ sich das Leben in der Stadt _____.",
    conjugatedStem: "stellt", correctPrefix: "vor", distractors: ["nach", "ein", "an"],
    translation: "She imagines life in the city.",
  },
];

// ── aufhören ──────────────────────────────────────────────────────────────────
const aufhoerenL2: Sentence[] = [
  {
    id: "s071", verbInfinitive: "aufhören", tense: "praesens", level: 2, subLevel: 1,
    template: "Ich _____ jetzt mit dem Rauchen _____.",
    conjugatedStem: "höre", correctPrefix: "auf", distractors: ["an", "ab", "zu"],
    translation: "I stop smoking now.",
  },
  {
    id: "s072", verbInfinitive: "aufhören", tense: "praesens", level: 2, subLevel: 2,
    template: "Er _____ nie mit der Arbeit _____.",
    conjugatedStem: "hört", correctPrefix: "auf", distractors: ["an", "ab", "zu"],
    translation: "He never stops working.",
  },
  {
    id: "s073", verbInfinitive: "aufhören", tense: "praesens", level: 2, subLevel: 3,
    template: "Der Regen _____ endlich _____.",
    conjugatedStem: "hört", correctPrefix: "auf", distractors: ["an", "ab", "zu"],
    translation: "The rain finally stops.",
  },
  {
    id: "s074", verbInfinitive: "aufhören", tense: "praesens", level: 2, subLevel: 4,
    template: "Wir _____ um 18 Uhr mit dem Training _____.",
    conjugatedStem: "hören", correctPrefix: "auf", distractors: ["an", "ab", "zu"],
    translation: "We stop training at 6 pm.",
  },
  {
    id: "s075", verbInfinitive: "aufhören", tense: "praesens", level: 2, subLevel: 5,
    template: "Du _____ immer zu früh _____.",
    conjugatedStem: "hörst", correctPrefix: "auf", distractors: ["an", "ab", "zu"],
    translation: "You always stop too early.",
  },
];

// ── zurückkommen ──────────────────────────────────────────────────────────────
const zurueckkommenL2: Sentence[] = [
  {
    id: "s076", verbInfinitive: "zurückkommen", tense: "praesens", level: 2, subLevel: 1,
    template: "Ich _____ morgen aus dem Urlaub _____.",
    conjugatedStem: "komme", correctPrefix: "zurück", distractors: ["an", "mit", "vor"],
    translation: "I come back from holiday tomorrow.",
  },
  {
    id: "s077", verbInfinitive: "zurückkommen", tense: "praesens", level: 2, subLevel: 2,
    template: "Er _____ nächste Woche aus dem Urlaub _____.",
    conjugatedStem: "kommt", correctPrefix: "zurück", distractors: ["an", "mit", "vor"],
    translation: "He comes back from holiday next week.",
  },
  {
    id: "s078", verbInfinitive: "zurückkommen", tense: "praesens", level: 2, subLevel: 3,
    template: "Wir _____ erst um Mitternacht nach Hause _____.",
    conjugatedStem: "kommen", correctPrefix: "zurück", distractors: ["an", "mit", "vor"],
    translation: "We don't come back home until midnight.",
  },
  {
    id: "s079", verbInfinitive: "zurückkommen", tense: "praesens", level: 2, subLevel: 4,
    template: "Sie _____ spät nach Hause _____.",
    conjugatedStem: "kommt", correctPrefix: "zurück", distractors: ["an", "mit", "vor"],
    translation: "She comes back home late.",
  },
  {
    id: "s080", verbInfinitive: "zurückkommen", tense: "praesens", level: 2, subLevel: 5,
    template: "Der Chef _____ um 15 Uhr _____.",
    conjugatedStem: "kommt", correctPrefix: "zurück", distractors: ["an", "mit", "vor"],
    translation: "The boss comes back at 3 pm.",
  },
];

// ── umziehen ──────────────────────────────────────────────────────────────────
const umziehenL2: Sentence[] = [
  {
    id: "s081", verbInfinitive: "umziehen", tense: "praesens", level: 2, subLevel: 1,
    template: "Ich _____ nächsten Monat _____.",
    conjugatedStem: "ziehe", correctPrefix: "um", distractors: ["an", "aus", "ein"],
    translation: "I am moving next month.",
  },
  {
    id: "s082", verbInfinitive: "umziehen", tense: "praesens", level: 2, subLevel: 2,
    template: "Familie Müller _____ nach Berlin _____.",
    conjugatedStem: "zieht", correctPrefix: "um", distractors: ["an", "aus", "ein"],
    translation: "The Müller family is moving to Berlin.",
  },
  {
    id: "s083", verbInfinitive: "umziehen", tense: "praesens", level: 2, subLevel: 3,
    template: "Wir _____ in eine größere Wohnung _____.",
    conjugatedStem: "ziehen", correctPrefix: "um", distractors: ["an", "aus", "ein"],
    translation: "We are moving to a bigger apartment.",
  },
  {
    id: "s084", verbInfinitive: "umziehen", tense: "praesens", level: 2, subLevel: 4,
    template: "Du _____ schon wieder _____.",
    conjugatedStem: "ziehst", correctPrefix: "um", distractors: ["an", "aus", "ein"],
    translation: "You are moving again.",
  },
  {
    id: "s085", verbInfinitive: "umziehen", tense: "praesens", level: 2, subLevel: 5,
    template: "Er _____ wegen des neuen Jobs _____.",
    conjugatedStem: "zieht", correctPrefix: "um", distractors: ["an", "aus", "ein"],
    translation: "He is moving because of the new job.",
  },
];

// ── nachdenken ────────────────────────────────────────────────────────────────
const nachdenkenL2: Sentence[] = [
  {
    id: "s086", verbInfinitive: "nachdenken", tense: "praesens", level: 2, subLevel: 1,
    template: "Ich _____ darüber _____.",
    conjugatedStem: "denke", correctPrefix: "nach", distractors: ["vor", "an", "ab"],
    translation: "I think about it.",
  },
  {
    id: "s087", verbInfinitive: "nachdenken", tense: "praesens", level: 2, subLevel: 2,
    template: "Er _____ lange über das Problem _____.",
    conjugatedStem: "denkt", correctPrefix: "nach", distractors: ["vor", "an", "ab"],
    translation: "He thinks about the problem for a long time.",
  },
  {
    id: "s088", verbInfinitive: "nachdenken", tense: "praesens", level: 2, subLevel: 3,
    template: "Wir _____ gemeinsam über eine Lösung _____.",
    conjugatedStem: "denken", correctPrefix: "nach", distractors: ["vor", "an", "ab"],
    translation: "We think together about a solution.",
  },
  {
    id: "s089", verbInfinitive: "nachdenken", tense: "praesens", level: 2, subLevel: 4,
    template: "Du _____ zu wenig _____.",
    conjugatedStem: "denkst", correctPrefix: "nach", distractors: ["vor", "an", "ab"],
    translation: "You think too little.",
  },
  {
    id: "s090", verbInfinitive: "nachdenken", tense: "praesens", level: 2, subLevel: 5,
    template: "Er _____ immer vor einer Entscheidung _____.",
    conjugatedStem: "denkt", correctPrefix: "nach", distractors: ["vor", "an", "ab"],
    translation: "He always thinks before making a decision.",
  },
];

// ── vorbereiten ───────────────────────────────────────────────────────────────
const vorbereitenL2: Sentence[] = [
  {
    id: "s091", verbInfinitive: "vorbereiten", tense: "praesens", level: 2, subLevel: 1,
    template: "Ich _____ das Essen _____.",
    conjugatedStem: "bereite", correctPrefix: "vor", distractors: ["nach", "an", "auf"],
    translation: "I prepare the food.",
  },
  {
    id: "s092", verbInfinitive: "vorbereiten", tense: "praesens", level: 2, subLevel: 2,
    template: "Sie _____ die Präsentation _____.",
    conjugatedStem: "bereitet", correctPrefix: "vor", distractors: ["nach", "an", "auf"],
    translation: "She prepares the presentation.",
  },
  {
    id: "s093", verbInfinitive: "vorbereiten", tense: "praesens", level: 2, subLevel: 3,
    template: "Wir _____ uns auf das Spiel _____.",
    conjugatedStem: "bereiten", correctPrefix: "vor", distractors: ["nach", "an", "auf"],
    translation: "We prepare for the game.",
  },
  {
    id: "s094", verbInfinitive: "vorbereiten", tense: "praesens", level: 2, subLevel: 4,
    template: "Er _____ die Reise sorgfältig _____.",
    conjugatedStem: "bereitet", correctPrefix: "vor", distractors: ["nach", "an", "auf"],
    translation: "He prepares the trip carefully.",
  },
  {
    id: "s095", verbInfinitive: "vorbereiten", tense: "praesens", level: 2, subLevel: 5,
    template: "Du _____ dich gut auf die Prüfung _____.",
    conjugatedStem: "bereitest", correctPrefix: "vor", distractors: ["nach", "an", "auf"],
    translation: "You prepare well for the exam.",
  },
];

// ── teilnehmen ────────────────────────────────────────────────────────────────
const teilnehmenL2: Sentence[] = [
  {
    id: "s096", verbInfinitive: "teilnehmen", tense: "praesens", level: 2, subLevel: 1,
    template: "Ich _____ am Kurs _____.",
    conjugatedStem: "nehme", correctPrefix: "teil", distractors: ["an", "mit", "ein"],
    translation: "I participate in the course.",
  },
  {
    id: "s097", verbInfinitive: "teilnehmen", tense: "praesens", level: 2, subLevel: 2,
    template: "Er _____ am Wettbewerb _____.",
    conjugatedStem: "nimmt", correctPrefix: "teil", distractors: ["an", "mit", "ein"],
    translation: "He participates in the competition.",
  },
  {
    id: "s098", verbInfinitive: "teilnehmen", tense: "praesens", level: 2, subLevel: 3,
    template: "Wir _____ alle an der Besprechung _____.",
    conjugatedStem: "nehmen", correctPrefix: "teil", distractors: ["an", "mit", "ein"],
    translation: "We all participate in the meeting.",
  },
  {
    id: "s099", verbInfinitive: "teilnehmen", tense: "praesens", level: 2, subLevel: 4,
    template: "Sie _____ gerne an Sportturnieren _____.",
    conjugatedStem: "nimmt", correctPrefix: "teil", distractors: ["an", "mit", "ein"],
    translation: "She likes to participate in sports tournaments.",
  },
  {
    id: "s100", verbInfinitive: "teilnehmen", tense: "praesens", level: 2, subLevel: 5,
    template: "Du _____ dieses Jahr am Marathon _____.",
    conjugatedStem: "nimmst", correctPrefix: "teil", distractors: ["an", "mit", "ein"],
    translation: "You participate in the marathon this year.",
  },
];

// ─────────────────────────────────────────────────────────────────────────────
// LEVEL 3 — B1  |  Mix of Präsens and Perfekt
//
// Perfekt template format (one blank, prefix directly before ge-participle):
//   "Ich habe die Tür _____gemacht."
//   conjugatedStem = the ge-participle root shown after the blank ("gemacht")
//   correctPrefix  = the prefix that goes in the blank ("auf")
//
// sein-Perfekt:  "Er ist früh _____gestanden."  →  conjugatedStem: "gestanden"
// ─────────────────────────────────────────────────────────────────────────────

// ── abholen ───────────────────────────────────────────────────────────────────
const abholenL3: Sentence[] = [
  {
    id: "s101", verbInfinitive: "abholen", tense: "praesens", level: 3, subLevel: 1,
    template: "Ich _____ dich um acht Uhr _____.",
    conjugatedStem: "hole", correctPrefix: "ab", distractors: ["an", "auf", "mit"],
    translation: "I pick you up at eight o'clock.",
  },
  {
    id: "s102", verbInfinitive: "abholen", tense: "praesens", level: 3, subLevel: 2,
    template: "Er _____ sie vom Bahnhof _____.",
    conjugatedStem: "holt", correctPrefix: "ab", distractors: ["an", "auf", "mit"],
    translation: "He picks her up from the station.",
  },
  {
    id: "s103", verbInfinitive: "abholen", tense: "perfekt", level: 3, subLevel: 3,
    template: "Ich habe sie vom Flughafen _____geholt.",
    conjugatedStem: "geholt", correctPrefix: "ab", distractors: ["an", "auf", "mit"],
    translation: "I picked her up from the airport.",
  },
  {
    id: "s104", verbInfinitive: "abholen", tense: "perfekt", level: 3, subLevel: 4,
    template: "Er hat das Paket gestern _____geholt.",
    conjugatedStem: "geholt", correctPrefix: "ab", distractors: ["an", "auf", "mit"],
    translation: "He picked up the package yesterday.",
  },
  {
    id: "s105", verbInfinitive: "abholen", tense: "perfekt", level: 3, subLevel: 5,
    template: "Wir haben die Kinder von der Schule _____geholt.",
    conjugatedStem: "geholt", correctPrefix: "ab", distractors: ["an", "auf", "mit"],
    translation: "We picked up the children from school.",
  },
];

// ── ausfüllen ─────────────────────────────────────────────────────────────────
const ausfuellenL3: Sentence[] = [
  {
    id: "s106", verbInfinitive: "ausfüllen", tense: "praesens", level: 3, subLevel: 1,
    template: "Ich _____ das Formular _____.",
    conjugatedStem: "fülle", correctPrefix: "aus", distractors: ["an", "auf", "ein"],
    translation: "I fill out the form.",
  },
  {
    id: "s107", verbInfinitive: "ausfüllen", tense: "praesens", level: 3, subLevel: 2,
    template: "Sie _____ den Antrag sorgfältig _____.",
    conjugatedStem: "füllt", correctPrefix: "aus", distractors: ["an", "auf", "ein"],
    translation: "She fills out the application carefully.",
  },
  {
    id: "s108", verbInfinitive: "ausfüllen", tense: "perfekt", level: 3, subLevel: 3,
    template: "Er hat das Formular vollständig _____gefüllt.",
    conjugatedStem: "gefüllt", correctPrefix: "aus", distractors: ["an", "auf", "ein"],
    translation: "He filled out the form completely.",
  },
  {
    id: "s109", verbInfinitive: "ausfüllen", tense: "perfekt", level: 3, subLevel: 4,
    template: "Wir haben alle Felder _____gefüllt.",
    conjugatedStem: "gefüllt", correctPrefix: "aus", distractors: ["an", "auf", "ein"],
    translation: "We filled out all the fields.",
  },
  {
    id: "s110", verbInfinitive: "ausfüllen", tense: "perfekt", level: 3, subLevel: 5,
    template: "Ich habe den Fragebogen gestern _____gefüllt.",
    conjugatedStem: "gefüllt", correctPrefix: "aus", distractors: ["an", "auf", "ein"],
    translation: "I filled out the questionnaire yesterday.",
  },
];

// ── festhalten ────────────────────────────────────────────────────────────────
const festhaltenL3: Sentence[] = [
  {
    id: "s111", verbInfinitive: "festhalten", tense: "praesens", level: 3, subLevel: 1,
    template: "Ich _____ die Ergebnisse in einem Dokument _____.",
    conjugatedStem: "halte", correctPrefix: "fest", distractors: ["an", "auf", "ein"],
    translation: "I record the results in a document.",
  },
  {
    id: "s112", verbInfinitive: "festhalten", tense: "praesens", level: 3, subLevel: 2,
    template: "Er _____ sich am Geländer _____.",
    conjugatedStem: "hält", correctPrefix: "fest", distractors: ["an", "auf", "ein"],
    translation: "He holds on to the railing.",
  },
  {
    id: "s113", verbInfinitive: "festhalten", tense: "perfekt", level: 3, subLevel: 3,
    template: "Sie hat alle wichtigen Punkte _____gehalten.",
    conjugatedStem: "gehalten", correctPrefix: "fest", distractors: ["an", "auf", "ein"],
    translation: "She recorded all important points.",
  },
  {
    id: "s114", verbInfinitive: "festhalten", tense: "perfekt", level: 3, subLevel: 4,
    template: "Wir haben die Ergebnisse schriftlich _____gehalten.",
    conjugatedStem: "gehalten", correctPrefix: "fest", distractors: ["an", "auf", "ein"],
    translation: "We recorded the results in writing.",
  },
  {
    id: "s115", verbInfinitive: "festhalten", tense: "perfekt", level: 3, subLevel: 5,
    template: "Er hat die Ideen in einem Notizbuch _____gehalten.",
    conjugatedStem: "gehalten", correctPrefix: "fest", distractors: ["an", "auf", "ein"],
    translation: "He recorded the ideas in a notebook.",
  },
];

// ── herausfinden ──────────────────────────────────────────────────────────────
const herausfindenL3: Sentence[] = [
  {
    id: "s116", verbInfinitive: "herausfinden", tense: "praesens", level: 3, subLevel: 1,
    template: "Ich _____ die Wahrheit _____.",
    conjugatedStem: "finde", correctPrefix: "heraus", distractors: ["herein", "hinaus", "zurück"],
    translation: "I find out the truth.",
  },
  {
    id: "s117", verbInfinitive: "herausfinden", tense: "praesens", level: 3, subLevel: 2,
    template: "Er _____ die Lösung _____.",
    conjugatedStem: "findet", correctPrefix: "heraus", distractors: ["herein", "hinaus", "zurück"],
    translation: "He finds out the solution.",
  },
  {
    id: "s118", verbInfinitive: "herausfinden", tense: "perfekt", level: 3, subLevel: 3,
    template: "Sie hat den Fehler _____gefunden.",
    conjugatedStem: "gefunden", correctPrefix: "heraus", distractors: ["herein", "hinaus", "zurück"],
    translation: "She found out the mistake.",
  },
  {
    id: "s119", verbInfinitive: "herausfinden", tense: "perfekt", level: 3, subLevel: 4,
    template: "Wir haben die Ursache _____gefunden.",
    conjugatedStem: "gefunden", correctPrefix: "heraus", distractors: ["herein", "hinaus", "zurück"],
    translation: "We found out the cause.",
  },
  {
    id: "s120", verbInfinitive: "herausfinden", tense: "perfekt", level: 3, subLevel: 5,
    template: "Ich habe die Antwort schnell _____gefunden.",
    conjugatedStem: "gefunden", correctPrefix: "heraus", distractors: ["herein", "hinaus", "zurück"],
    translation: "I found out the answer quickly.",
  },
];

// ── herstellen ────────────────────────────────────────────────────────────────
const herstellenL3: Sentence[] = [
  {
    id: "s121", verbInfinitive: "herstellen", tense: "praesens", level: 3, subLevel: 1,
    template: "Die Fabrik _____ Autos _____.",
    conjugatedStem: "stellt", correctPrefix: "her", distractors: ["vor", "ein", "an"],
    translation: "The factory produces cars.",
  },
  {
    id: "s122", verbInfinitive: "herstellen", tense: "praesens", level: 3, subLevel: 2,
    template: "Wir _____ das Produkt in Deutschland _____.",
    conjugatedStem: "stellen", correctPrefix: "her", distractors: ["vor", "ein", "an"],
    translation: "We manufacture the product in Germany.",
  },
  {
    id: "s123", verbInfinitive: "herstellen", tense: "perfekt", level: 3, subLevel: 3,
    template: "Das Unternehmen hat viele Produkte _____gestellt.",
    conjugatedStem: "gestellt", correctPrefix: "her", distractors: ["vor", "ein", "an"],
    translation: "The company produced many products.",
  },
  {
    id: "s124", verbInfinitive: "herstellen", tense: "perfekt", level: 3, subLevel: 4,
    template: "Er hat den Kontakt zu den Kollegen _____gestellt.",
    conjugatedStem: "gestellt", correctPrefix: "her", distractors: ["vor", "ein", "an"],
    translation: "He established contact with the colleagues.",
  },
  {
    id: "s125", verbInfinitive: "herstellen", tense: "perfekt", level: 3, subLevel: 5,
    template: "Wir haben das Möbelstück selbst _____gestellt.",
    conjugatedStem: "gestellt", correctPrefix: "her", distractors: ["vor", "ein", "an"],
    translation: "We made the piece of furniture ourselves.",
  },
];

// ── durchführen ───────────────────────────────────────────────────────────────
const durchfuehrenL3: Sentence[] = [
  {
    id: "s126", verbInfinitive: "durchführen", tense: "praesens", level: 3, subLevel: 1,
    template: "Wir _____ das Projekt nächste Woche _____.",
    conjugatedStem: "führen", correctPrefix: "durch", distractors: ["aus", "an", "vor"],
    translation: "We carry out the project next week.",
  },
  {
    id: "s127", verbInfinitive: "durchführen", tense: "praesens", level: 3, subLevel: 2,
    template: "Er _____ die Reparatur selbst _____.",
    conjugatedStem: "führt", correctPrefix: "durch", distractors: ["aus", "an", "vor"],
    translation: "He carries out the repair himself.",
  },
  {
    id: "s128", verbInfinitive: "durchführen", tense: "perfekt", level: 3, subLevel: 3,
    template: "Das Team hat die Studie erfolgreich _____geführt.",
    conjugatedStem: "geführt", correctPrefix: "durch", distractors: ["aus", "an", "vor"],
    translation: "The team successfully carried out the study.",
  },
  {
    id: "s129", verbInfinitive: "durchführen", tense: "perfekt", level: 3, subLevel: 4,
    template: "Wir haben das Experiment im Labor _____geführt.",
    conjugatedStem: "geführt", correctPrefix: "durch", distractors: ["aus", "an", "vor"],
    translation: "We carried out the experiment in the laboratory.",
  },
  {
    id: "s130", verbInfinitive: "durchführen", tense: "perfekt", level: 3, subLevel: 5,
    template: "Sie hat die Kontrolle regelmäßig _____geführt.",
    conjugatedStem: "geführt", correctPrefix: "durch", distractors: ["aus", "an", "vor"],
    translation: "She regularly carried out the inspection.",
  },
];

// ── zusammenarbeiten ──────────────────────────────────────────────────────────
const zusammenarbeitenL3: Sentence[] = [
  {
    id: "s131", verbInfinitive: "zusammenarbeiten", tense: "praesens", level: 3, subLevel: 1,
    template: "Wir _____ gut _____.",
    conjugatedStem: "arbeiten", correctPrefix: "zusammen", distractors: ["mit", "nach", "über"],
    translation: "We work well together.",
  },
  {
    id: "s132", verbInfinitive: "zusammenarbeiten", tense: "praesens", level: 3, subLevel: 2,
    template: "Die Teams _____ an dem Projekt _____.",
    conjugatedStem: "arbeiten", correctPrefix: "zusammen", distractors: ["mit", "nach", "über"],
    translation: "The teams work together on the project.",
  },
  {
    id: "s133", verbInfinitive: "zusammenarbeiten", tense: "perfekt", level: 3, subLevel: 3,
    template: "Wir haben lange _____gearbeitet.",
    conjugatedStem: "gearbeitet", correctPrefix: "zusammen", distractors: ["mit", "nach", "über"],
    translation: "We worked together for a long time.",
  },
  {
    id: "s134", verbInfinitive: "zusammenarbeiten", tense: "perfekt", level: 3, subLevel: 4,
    template: "Die Firmen haben erfolgreich _____gearbeitet.",
    conjugatedStem: "gearbeitet", correctPrefix: "zusammen", distractors: ["mit", "nach", "über"],
    translation: "The companies worked together successfully.",
  },
  {
    id: "s135", verbInfinitive: "zusammenarbeiten", tense: "perfekt", level: 3, subLevel: 5,
    template: "Sie haben an einem gemeinsamen Ziel _____gearbeitet.",
    conjugatedStem: "gearbeitet", correctPrefix: "zusammen", distractors: ["mit", "nach", "über"],
    translation: "They worked together towards a common goal.",
  },
];

// ── aufstehen (revisited at L3 with Perfekt) ──────────────────────────────────
// Perfekt: ist aufgestanden  (sein verb — motion/change of state)
const aufstehenL3: Sentence[] = [
  {
    id: "s136", verbInfinitive: "aufstehen", tense: "praesens", level: 3, subLevel: 1,
    template: "Ich _____ heute sehr früh _____, obwohl ich müde bin.",
    conjugatedStem: "stehe", correctPrefix: "auf", distractors: ["an", "ab", "ein"],
    translation: "I get up very early today, even though I am tired.",
  },
  {
    id: "s137", verbInfinitive: "aufstehen", tense: "praesens", level: 3, subLevel: 2,
    template: "Er _____ nie vor neun Uhr _____.",
    conjugatedStem: "steht", correctPrefix: "auf", distractors: ["an", "ab", "ein"],
    translation: "He never gets up before nine o'clock.",
  },
  {
    id: "s138", verbInfinitive: "aufstehen", tense: "perfekt", level: 3, subLevel: 3,
    // sein auxiliary: "Ich bin ... aufgestanden"
    template: "Ich bin heute sehr früh _____gestanden, weil mein Zug früh fährt.",
    conjugatedStem: "gestanden", correctPrefix: "auf", distractors: ["an", "ab", "ein"],
    translation: "I got up very early today because my train leaves early.",
  },
  {
    id: "s139", verbInfinitive: "aufstehen", tense: "perfekt", level: 3, subLevel: 4,
    template: "Sie ist um fünf Uhr _____gestanden.",
    conjugatedStem: "gestanden", correctPrefix: "auf", distractors: ["an", "ab", "ein"],
    translation: "She got up at five o'clock.",
  },
  {
    id: "s140", verbInfinitive: "aufstehen", tense: "perfekt", level: 3, subLevel: 5,
    template: "Wir sind schon vor dem Frühstück _____gestanden.",
    conjugatedStem: "gestanden", correctPrefix: "auf", distractors: ["an", "ab", "ein"],
    translation: "We got up before breakfast.",
  },
];

// ── ankommen (revisited at L3 with Perfekt) ───────────────────────────────────
// Perfekt: ist angekommen  (sein verb)
const ankommenL3: Sentence[] = [
  {
    id: "s141", verbInfinitive: "ankommen", tense: "praesens", level: 3, subLevel: 1,
    template: "Der Zug _____ nach langer Fahrt immer pünktlich _____.",
    conjugatedStem: "kommt", correctPrefix: "an", distractors: ["ab", "auf", "mit"],
    translation: "The train always arrives on time after a long journey.",
  },
  {
    id: "s142", verbInfinitive: "ankommen", tense: "praesens", level: 3, subLevel: 2,
    template: "Wir _____ nach einer langen Fahrt erschöpft _____.",
    conjugatedStem: "kommen", correctPrefix: "an", distractors: ["ab", "auf", "mit"],
    translation: "We arrive exhausted after a long journey.",
  },
  {
    id: "s143", verbInfinitive: "ankommen", tense: "perfekt", level: 3, subLevel: 3,
    template: "Er ist gestern spät _____gekommen.",
    conjugatedStem: "gekommen", correctPrefix: "an", distractors: ["ab", "auf", "mit"],
    translation: "He arrived late yesterday.",
  },
  {
    id: "s144", verbInfinitive: "ankommen", tense: "perfekt", level: 3, subLevel: 4,
    template: "Das Paket ist endlich _____gekommen.",
    conjugatedStem: "gekommen", correctPrefix: "an", distractors: ["ab", "auf", "mit"],
    translation: "The package finally arrived.",
  },
  {
    id: "s145", verbInfinitive: "ankommen", tense: "perfekt", level: 3, subLevel: 5,
    template: "Wir sind pünktlich am Bahnhof _____gekommen.",
    conjugatedStem: "gekommen", correctPrefix: "an", distractors: ["ab", "auf", "mit"],
    translation: "We arrived at the station on time.",
  },
];

// ── einladen (revisited at L3 with Perfekt) ───────────────────────────────────
// Perfekt: hat eingeladen  (haben verb; strong: geladen)
const einladenL3: Sentence[] = [
  {
    id: "s146", verbInfinitive: "einladen", tense: "praesens", level: 3, subLevel: 1,
    template: "Ich _____ alle Freunde herzlich zur Feier _____.",
    conjugatedStem: "lade", correctPrefix: "ein", distractors: ["an", "vor", "auf"],
    translation: "I warmly invite all friends to the celebration.",
  },
  {
    id: "s147", verbInfinitive: "einladen", tense: "praesens", level: 3, subLevel: 2,
    template: "Er _____ seine neuen Kollegen zum gemeinsamen Mittagessen _____.",
    conjugatedStem: "lädt", correctPrefix: "ein", distractors: ["an", "vor", "auf"],
    translation: "He invites his new colleagues to lunch together.",
  },
  {
    id: "s148", verbInfinitive: "einladen", tense: "perfekt", level: 3, subLevel: 3,
    template: "Sie hat uns zu ihrer Hochzeit _____geladen.",
    conjugatedStem: "geladen", correctPrefix: "ein", distractors: ["an", "vor", "auf"],
    translation: "She invited us to her wedding.",
  },
  {
    id: "s149", verbInfinitive: "einladen", tense: "perfekt", level: 3, subLevel: 4,
    template: "Wir haben alle Nachbarn _____geladen.",
    conjugatedStem: "geladen", correctPrefix: "ein", distractors: ["an", "vor", "auf"],
    translation: "We invited all the neighbours.",
  },
  {
    id: "s150", verbInfinitive: "einladen", tense: "perfekt", level: 3, subLevel: 5,
    template: "Er hat mich gestern zum Abendessen _____geladen.",
    conjugatedStem: "geladen", correctPrefix: "ein", distractors: ["an", "vor", "auf"],
    translation: "He invited me to dinner yesterday.",
  },
];

// ─────────────────────────────────────────────────────────────────────────────
// LEVEL 4 — B2  |  Nebensätze (subordinate clauses)
//
// In Nebensätze, trennbare Verben RECOMBINE at the end of the clause.
// Template format (one blank directly before the recombined verb):
//   "Er sagt, dass er die Tür _____macht."
//   conjugatedStem = recombined verb form (± auxiliary) shown after blank
//   correctPrefix  = the prefix
//
// Perfekt in Nebensatz — haben:  "_____gemacht hat"
//                      — sein:   "_____gegangen ist"
// ─────────────────────────────────────────────────────────────────────────────

// ── anerkennen ────────────────────────────────────────────────────────────────
// Note: participle = anerkannt (NOT angeerkannt — "er-" is inseparable)
const anerkennenL4: Sentence[] = [
  {
    id: "s151", verbInfinitive: "anerkennen", tense: "nebensatz", level: 4, subLevel: 1,
    template: "Es ist wichtig, dass die Gesellschaft ihre Leistung _____erkennt.",
    conjugatedStem: "erkennt", correctPrefix: "an", distractors: ["ab", "auf", "ein"],
    translation: "It is important that society acknowledges her achievement.",
  },
  {
    id: "s152", verbInfinitive: "anerkennen", tense: "nebensatz", level: 4, subLevel: 2,
    template: "Ich finde, dass er die Kritik _____erkennt.",
    conjugatedStem: "erkennt", correctPrefix: "an", distractors: ["ab", "auf", "ein"],
    translation: "I think that he acknowledges the criticism.",
  },
  {
    id: "s153", verbInfinitive: "anerkennen", tense: "nebensatz", level: 4, subLevel: 3,
    template: "Er sagt, dass er seinen Fehler _____erkennt.",
    conjugatedStem: "erkennt", correctPrefix: "an", distractors: ["ab", "auf", "ein"],
    translation: "He says that he acknowledges his mistake.",
  },
  {
    id: "s154", verbInfinitive: "anerkennen", tense: "nebensatz", level: 4, subLevel: 4,
    // Perfekt in Nebensatz: participle = anerkannt (insep. "er-" → no ge-)
    template: "Ich höre, dass das Komitee seine Arbeit _____erkannt hat.",
    conjugatedStem: "erkannt hat", correctPrefix: "an", distractors: ["ab", "auf", "ein"],
    translation: "I hear that the committee acknowledged his work.",
  },
  {
    id: "s155", verbInfinitive: "anerkennen", tense: "nebensatz", level: 4, subLevel: 5,
    template: "Sie weiß, dass man ihn für seine Leistung _____erkannt hat.",
    conjugatedStem: "erkannt hat", correctPrefix: "an", distractors: ["ab", "auf", "ein"],
    translation: "She knows that he has been acknowledged for his achievement.",
  },
];

// ── beitragen ─────────────────────────────────────────────────────────────────
// Perfekt: hat beigetragen (strong: tragen → getragen → beigetragen)
const beitragenL4: Sentence[] = [
  {
    id: "s156", verbInfinitive: "beitragen", tense: "nebensatz", level: 4, subLevel: 1,
    template: "Er hofft, dass er zum Erfolg _____trägt.",
    conjugatedStem: "trägt", correctPrefix: "bei", distractors: ["mit", "an", "vor"],
    translation: "He hopes that he contributes to the success.",
  },
  {
    id: "s157", verbInfinitive: "beitragen", tense: "nebensatz", level: 4, subLevel: 2,
    template: "Wir glauben, dass jeder etwas _____trägt.",
    conjugatedStem: "trägt", correctPrefix: "bei", distractors: ["mit", "an", "vor"],
    translation: "We believe that everyone contributes something.",
  },
  {
    id: "s158", verbInfinitive: "beitragen", tense: "nebensatz", level: 4, subLevel: 3,
    template: "Es ist schön, dass du zur Lösung _____trägst.",
    conjugatedStem: "trägst", correctPrefix: "bei", distractors: ["mit", "an", "vor"],
    translation: "It is nice that you contribute to the solution.",
  },
  {
    id: "s159", verbInfinitive: "beitragen", tense: "nebensatz", level: 4, subLevel: 4,
    template: "Ich bin froh, dass er so viel _____getragen hat.",
    conjugatedStem: "getragen hat", correctPrefix: "bei", distractors: ["mit", "an", "vor"],
    translation: "I am glad that he contributed so much.",
  },
  {
    id: "s160", verbInfinitive: "beitragen", tense: "nebensatz", level: 4, subLevel: 5,
    template: "Sie sagt, dass alle zur Verbesserung _____getragen haben.",
    conjugatedStem: "getragen haben", correctPrefix: "bei", distractors: ["mit", "an", "vor"],
    translation: "She says that everyone contributed to the improvement.",
  },
];

// ── übereinstimmen ────────────────────────────────────────────────────────────
// Perfekt: hat übereingestimmt
const uebereinstimmenL4: Sentence[] = [
  {
    id: "s161", verbInfinitive: "übereinstimmen", tense: "nebensatz", level: 4, subLevel: 1,
    template: "Er sagt, dass unsere Meinungen _____stimmen.",
    conjugatedStem: "stimmen", correctPrefix: "überein", distractors: ["zusammen", "an", "mit"],
    translation: "He says that our opinions agree.",
  },
  {
    id: "s162", verbInfinitive: "übereinstimmen", tense: "nebensatz", level: 4, subLevel: 2,
    template: "Ich finde, dass die Zahlen nicht _____stimmen.",
    conjugatedStem: "stimmen", correctPrefix: "überein", distractors: ["zusammen", "an", "mit"],
    translation: "I find that the numbers do not match.",
  },
  {
    id: "s163", verbInfinitive: "übereinstimmen", tense: "nebensatz", level: 4, subLevel: 3,
    template: "Es ist gut, dass wir in diesem Punkt _____stimmen.",
    conjugatedStem: "stimmen", correctPrefix: "überein", distractors: ["zusammen", "an", "mit"],
    translation: "It is good that we agree on this point.",
  },
  {
    id: "s164", verbInfinitive: "übereinstimmen", tense: "nebensatz", level: 4, subLevel: 4,
    template: "Sie weiß, dass ihre Aussagen nicht _____gestimmt haben.",
    conjugatedStem: "gestimmt haben", correctPrefix: "überein", distractors: ["zusammen", "an", "mit"],
    translation: "She knows that her statements did not agree.",
  },
  {
    id: "s165", verbInfinitive: "übereinstimmen", tense: "nebensatz", level: 4, subLevel: 5,
    template: "Er bemerkt, dass die Berichte nicht _____gestimmt haben.",
    conjugatedStem: "gestimmt haben", correctPrefix: "überein", distractors: ["zusammen", "an", "mit"],
    translation: "He notices that the reports did not agree.",
  },
];

// ── auseinandersetzen ─────────────────────────────────────────────────────────
// Reflexiv: sich auseinandersetzen mit
// Perfekt: hat auseinandergesetzt
const auseinandersetzenL4: Sentence[] = [
  {
    id: "s166", verbInfinitive: "auseinandersetzen", tense: "nebensatz", level: 4, subLevel: 1,
    template: "Er sagt, dass er sich mit dem Thema _____setzt.",
    conjugatedStem: "setzt", correctPrefix: "auseinander", distractors: ["zusammen", "vor", "ein"],
    translation: "He says that he is dealing with the topic.",
  },
  {
    id: "s167", verbInfinitive: "auseinandersetzen", tense: "nebensatz", level: 4, subLevel: 2,
    template: "Ich finde, dass wir uns intensiv mit dem Problem _____setzen.",
    conjugatedStem: "setzen", correctPrefix: "auseinander", distractors: ["zusammen", "vor", "ein"],
    translation: "I think that we deal intensively with the problem.",
  },
  {
    id: "s168", verbInfinitive: "auseinandersetzen", tense: "nebensatz", level: 4, subLevel: 3,
    template: "Sie hofft, dass er sich mit der Kritik _____setzt.",
    conjugatedStem: "setzt", correctPrefix: "auseinander", distractors: ["zusammen", "vor", "ein"],
    translation: "She hopes that he deals with the criticism.",
  },
  {
    id: "s169", verbInfinitive: "auseinandersetzen", tense: "nebensatz", level: 4, subLevel: 4,
    template: "Er weiß, dass sie sich gründlich mit dem Thema _____gesetzt hat.",
    conjugatedStem: "gesetzt hat", correctPrefix: "auseinander", distractors: ["zusammen", "vor", "ein"],
    translation: "He knows that she has dealt thoroughly with the topic.",
  },
  {
    id: "s170", verbInfinitive: "auseinandersetzen", tense: "nebensatz", level: 4, subLevel: 5,
    template: "Wir freuen uns, dass das Team sich mit dem Problem _____gesetzt hat.",
    conjugatedStem: "gesetzt hat", correctPrefix: "auseinander", distractors: ["zusammen", "vor", "ein"],
    translation: "We are glad that the team has dealt with the problem.",
  },
];

// ── entgegenkommen ────────────────────────────────────────────────────────────
// Perfekt: ist entgegengekommen  (sein verb)
const entgegenkommenL4: Sentence[] = [
  {
    id: "s171", verbInfinitive: "entgegenkommen", tense: "nebensatz", level: 4, subLevel: 1,
    template: "Er freut sich, dass die Firma seinen Wünschen _____kommt.",
    conjugatedStem: "kommt", correctPrefix: "entgegen", distractors: ["zurück", "mit", "vor"],
    translation: "He is glad that the company accommodates his wishes.",
  },
  {
    id: "s172", verbInfinitive: "entgegenkommen", tense: "nebensatz", level: 4, subLevel: 2,
    template: "Ich finde, dass er uns in dieser Frage _____kommt.",
    conjugatedStem: "kommt", correctPrefix: "entgegen", distractors: ["zurück", "mit", "vor"],
    translation: "I think that he meets us halfway on this question.",
  },
  {
    id: "s173", verbInfinitive: "entgegenkommen", tense: "nebensatz", level: 4, subLevel: 3,
    template: "Sie hofft, dass der Chef ihr in diesem Punkt _____kommt.",
    conjugatedStem: "kommt", correctPrefix: "entgegen", distractors: ["zurück", "mit", "vor"],
    translation: "She hopes that the boss meets her halfway on this point.",
  },
  {
    id: "s174", verbInfinitive: "entgegenkommen", tense: "nebensatz", level: 4, subLevel: 4,
    // sein auxiliary
    template: "Ich bin froh, dass er uns _____gekommen ist.",
    conjugatedStem: "gekommen ist", correctPrefix: "entgegen", distractors: ["zurück", "mit", "vor"],
    translation: "I am glad that he met us halfway.",
  },
  {
    id: "s175", verbInfinitive: "entgegenkommen", tense: "nebensatz", level: 4, subLevel: 5,
    template: "Er sagt, dass die Bank seinen Forderungen _____gekommen ist.",
    conjugatedStem: "gekommen ist", correctPrefix: "entgegen", distractors: ["zurück", "mit", "vor"],
    translation: "He says that the bank met his demands.",
  },
];

// ── ausgehen (revisited at L4 — Nebensatz) ────────────────────────────────────
// Perfekt: ist ausgegangen  (sein)
const ausgehenL4: Sentence[] = [
  {
    id: "s176", verbInfinitive: "ausgehen", tense: "nebensatz", level: 4, subLevel: 1,
    template: "Er erklärt, dass er heute Abend _____geht.",
    conjugatedStem: "geht", correctPrefix: "aus", distractors: ["an", "ein", "auf"],
    translation: "He explains that he is going out tonight.",
  },
  {
    id: "s177", verbInfinitive: "ausgehen", tense: "nebensatz", level: 4, subLevel: 2,
    template: "Ich weiß, dass sie oft alleine _____geht.",
    conjugatedStem: "geht", correctPrefix: "aus", distractors: ["an", "ein", "auf"],
    translation: "I know that she often goes out alone.",
  },
  {
    id: "s178", verbInfinitive: "ausgehen", tense: "nebensatz", level: 4, subLevel: 3,
    template: "Sie sagt, dass er zu oft _____geht.",
    conjugatedStem: "geht", correctPrefix: "aus", distractors: ["an", "ein", "auf"],
    translation: "She says that he goes out too often.",
  },
  {
    id: "s179", verbInfinitive: "ausgehen", tense: "nebensatz", level: 4, subLevel: 4,
    // ihr-form with sein: "ausgegangen seid"
    template: "Ich höre, dass ihr gestern _____gegangen seid.",
    conjugatedStem: "gegangen seid", correctPrefix: "aus", distractors: ["an", "ein", "auf"],
    translation: "I hear that you (all) went out yesterday.",
  },
  {
    id: "s180", verbInfinitive: "ausgehen", tense: "nebensatz", level: 4, subLevel: 5,
    template: "Er weiß, dass sie am Wochenende _____gegangen ist.",
    conjugatedStem: "gegangen ist", correctPrefix: "aus", distractors: ["an", "ein", "auf"],
    translation: "He knows that she went out at the weekend.",
  },
];

// ── vorbereiten (revisited at L4 — Nebensatz) ─────────────────────────────────
// Perfekt: hat vorbereitet
const vorbereitenL4: Sentence[] = [
  {
    id: "s181", verbInfinitive: "vorbereiten", tense: "nebensatz", level: 4, subLevel: 1,
    template: "Er sagt, dass er die Präsentation sorgfältig _____bereitet.",
    conjugatedStem: "bereitet", correctPrefix: "vor", distractors: ["nach", "an", "auf"],
    translation: "He says that he prepares the presentation carefully.",
  },
  {
    id: "s182", verbInfinitive: "vorbereiten", tense: "nebensatz", level: 4, subLevel: 2,
    template: "Ich finde, dass sie sich gut auf das Interview _____bereitet.",
    conjugatedStem: "bereitet", correctPrefix: "vor", distractors: ["nach", "an", "auf"],
    translation: "I think that she prepares well for the interview.",
  },
  {
    id: "s183", verbInfinitive: "vorbereiten", tense: "nebensatz", level: 4, subLevel: 3,
    template: "Wir wissen, dass er alles rechtzeitig _____bereitet.",
    conjugatedStem: "bereitet", correctPrefix: "vor", distractors: ["nach", "an", "auf"],
    translation: "We know that he prepares everything on time.",
  },
  {
    id: "s184", verbInfinitive: "vorbereiten", tense: "nebensatz", level: 4, subLevel: 4,
    template: "Er berichtet, dass das Team sich gut _____bereitet hat.",
    conjugatedStem: "bereitet hat", correctPrefix: "vor", distractors: ["nach", "an", "auf"],
    translation: "He reports that the team prepared well.",
  },
  {
    id: "s185", verbInfinitive: "vorbereiten", tense: "nebensatz", level: 4, subLevel: 5,
    template: "Sie sagt, dass er den Vortrag gründlich _____bereitet hat.",
    conjugatedStem: "bereitet hat", correctPrefix: "vor", distractors: ["nach", "an", "auf"],
    translation: "She says that he prepared the lecture thoroughly.",
  },
];

// ── nachdenken (revisited at L4 — Nebensatz) ──────────────────────────────────
// Perfekt: hat nachgedacht  (mixed verb: denken → dachte → gedacht)
const nachdenkenL4: Sentence[] = [
  {
    id: "s186", verbInfinitive: "nachdenken", tense: "nebensatz", level: 4, subLevel: 1,
    template: "Er sagt, dass er lange über die Frage _____denkt.",
    conjugatedStem: "denkt", correctPrefix: "nach", distractors: ["vor", "an", "ab"],
    translation: "He says that he thinks about the question for a long time.",
  },
  {
    id: "s187", verbInfinitive: "nachdenken", tense: "nebensatz", level: 4, subLevel: 2,
    template: "Ich finde, dass sie immer zu wenig _____denkt.",
    conjugatedStem: "denkt", correctPrefix: "nach", distractors: ["vor", "an", "ab"],
    translation: "I think that she always reflects too little.",
  },
  {
    id: "s188", verbInfinitive: "nachdenken", tense: "nebensatz", level: 4, subLevel: 3,
    template: "Wir wissen, dass er vor jeder Entscheidung _____denkt.",
    conjugatedStem: "denkt", correctPrefix: "nach", distractors: ["vor", "an", "ab"],
    translation: "We know that he reflects before every decision.",
  },
  {
    id: "s189", verbInfinitive: "nachdenken", tense: "nebensatz", level: 4, subLevel: 4,
    template: "Er sagt, dass er gut _____gedacht hat.",
    conjugatedStem: "gedacht hat", correctPrefix: "nach", distractors: ["vor", "an", "ab"],
    translation: "He says that he thought carefully.",
  },
  {
    id: "s190", verbInfinitive: "nachdenken", tense: "nebensatz", level: 4, subLevel: 5,
    template: "Sie weiß, dass er lange über die Lösung _____gedacht hat.",
    conjugatedStem: "gedacht hat", correctPrefix: "nach", distractors: ["vor", "an", "ab"],
    translation: "She knows that he thought about the solution for a long time.",
  },
];

// ── aufräumen (revisited at L4 — Nebensatz) ───────────────────────────────────
// Perfekt: hat aufgeräumt
const aufraeumenL4: Sentence[] = [
  {
    id: "s191", verbInfinitive: "aufräumen", tense: "nebensatz", level: 4, subLevel: 1,
    template: "Er weiß, dass er sein Zimmer _____räumt.",
    conjugatedStem: "räumt", correctPrefix: "auf", distractors: ["an", "ab", "ein"],
    translation: "He knows that he tidies up his room.",
  },
  {
    id: "s192", verbInfinitive: "aufräumen", tense: "nebensatz", level: 4, subLevel: 2,
    template: "Ich sehe, dass sie die Küche gründlich _____räumt.",
    conjugatedStem: "räumt", correctPrefix: "auf", distractors: ["an", "ab", "ein"],
    translation: "I see that she tidies up the kitchen thoroughly.",
  },
  {
    id: "s193", verbInfinitive: "aufräumen", tense: "nebensatz", level: 4, subLevel: 3,
    template: "Wir finden, dass er nie _____räumt.",
    conjugatedStem: "räumt", correctPrefix: "auf", distractors: ["an", "ab", "ein"],
    translation: "We think that he never tidies up.",
  },
  {
    id: "s194", verbInfinitive: "aufräumen", tense: "nebensatz", level: 4, subLevel: 4,
    template: "Er sagt, dass er schon _____geräumt hat.",
    conjugatedStem: "geräumt hat", correctPrefix: "auf", distractors: ["an", "ab", "ein"],
    translation: "He says that he has already tidied up.",
  },
  {
    id: "s195", verbInfinitive: "aufräumen", tense: "nebensatz", level: 4, subLevel: 5,
    template: "Sie weiß, dass er das Zimmer schnell _____geräumt hat.",
    conjugatedStem: "geräumt hat", correctPrefix: "auf", distractors: ["an", "ab", "ein"],
    translation: "She knows that he tidied up the room quickly.",
  },
];

// ── teilnehmen (revisited at L4 — Nebensatz) ──────────────────────────────────
// Perfekt: hat teilgenommen  (strong: nehmen → genommen → teilgenommen)
const teilnehmenL4: Sentence[] = [
  {
    id: "s196", verbInfinitive: "teilnehmen", tense: "nebensatz", level: 4, subLevel: 1,
    template: "Er erklärt, dass er gerne am Kurs _____nimmt.",
    conjugatedStem: "nimmt", correctPrefix: "teil", distractors: ["an", "mit", "ein"],
    translation: "He explains that he likes to participate in the course.",
  },
  {
    id: "s197", verbInfinitive: "teilnehmen", tense: "nebensatz", level: 4, subLevel: 2,
    template: "Ich weiß, dass sie an dem Wettbewerb _____nimmt.",
    conjugatedStem: "nimmt", correctPrefix: "teil", distractors: ["an", "mit", "ein"],
    translation: "I know that she participates in the competition.",
  },
  {
    id: "s198", verbInfinitive: "teilnehmen", tense: "nebensatz", level: 4, subLevel: 3,
    template: "Wir finden, dass er regelmäßig an Kursen _____nimmt.",
    conjugatedStem: "nimmt", correctPrefix: "teil", distractors: ["an", "mit", "ein"],
    translation: "We think that he regularly participates in courses.",
  },
  {
    id: "s199", verbInfinitive: "teilnehmen", tense: "nebensatz", level: 4, subLevel: 4,
    template: "Er sagt, dass sie letztes Jahr _____genommen hat.",
    conjugatedStem: "genommen hat", correctPrefix: "teil", distractors: ["an", "mit", "ein"],
    translation: "He says that she participated last year.",
  },
  {
    id: "s200", verbInfinitive: "teilnehmen", tense: "nebensatz", level: 4, subLevel: 5,
    template: "Sie weiß, dass er an der Konferenz _____genommen hat.",
    conjugatedStem: "genommen hat", correctPrefix: "teil", distractors: ["an", "mit", "ein"],
    translation: "She knows that he participated in the conference.",
  },
];

// ─────────────────────────────────────────────────────────────────────────────
// Exports
// ─────────────────────────────────────────────────────────────────────────────

export const sentencesLevel1: Sentence[] = [
  ...aufmachenL1, ...zumachenL1, ...anfangenL1, ...aufstehenL1, ...einkaufenL1,
  ...anrufenL1, ...aufraeumenL1, ...mitkommenL1, ...ausgehenL1, ...fernsehenL1,
];

export const sentencesLevel2: Sentence[] = [
  ...ankommenL2, ...abfahrenL2, ...einladenL2, ...vorstellenL2, ...aufhoerenL2,
  ...zurueckkommenL2, ...umziehenL2, ...nachdenkenL2, ...vorbereitenL2, ...teilnehmenL2,
];

export const sentencesLevel3: Sentence[] = [
  ...abholenL3, ...ausfuellenL3, ...festhaltenL3, ...herausfindenL3, ...herstellenL3,
  ...durchfuehrenL3, ...zusammenarbeitenL3, ...aufstehenL3, ...ankommenL3, ...einladenL3,
];

export const sentencesLevel4: Sentence[] = [
  ...anerkennenL4, ...beitragenL4, ...uebereinstimmenL4, ...auseinandersetzenL4,
  ...entgegenkommenL4, ...ausgehenL4, ...vorbereitenL4, ...nachdenkenL4,
  ...aufraeumenL4, ...teilnehmenL4,
];

export const allSentences: Sentence[] = [
  ...sentencesLevel1,
  ...sentencesLevel2,
  ...sentencesLevel3,
  ...sentencesLevel4,
];

/** Look up a sentence by its ID */
export function getSentenceById(id: string): Sentence | undefined {
  return allSentences.find((s) => s.id === id);
}

/** Get all sentences for a specific verb */
export function getSentencesByVerb(infinitive: string): Sentence[] {
  return allSentences.filter((s) => s.verbInfinitive === infinitive);
}

/** Get all sentences for a specific level */
export function getSentencesByLevel(level: 1 | 2 | 3 | 4): Sentence[] {
  return allSentences.filter((s) => s.level === level);
}
