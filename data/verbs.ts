import type { SeparableVerb } from "./types";

// ─── Level 1 — A1 ─────────────────────────────────────────────────────────────

export const verbsLevel1: SeparableVerb[] = [
  { infinitive: "aufmachen",  prefix: "auf",  stem: "machen",  meaning: "to open",           level: 1 },
  { infinitive: "zumachen",   prefix: "zu",   stem: "machen",  meaning: "to close",          level: 1 },
  { infinitive: "anfangen",   prefix: "an",   stem: "fangen",  meaning: "to start / begin",  level: 1 },
  { infinitive: "aufstehen",  prefix: "auf",  stem: "stehen",  meaning: "to get up",         level: 1 },
  { infinitive: "einkaufen",  prefix: "ein",  stem: "kaufen",  meaning: "to go shopping",    level: 1 },
  { infinitive: "anrufen",    prefix: "an",   stem: "rufen",   meaning: "to call / phone",   level: 1 },
  { infinitive: "aufräumen",  prefix: "auf",  stem: "räumen",  meaning: "to tidy up",        level: 1 },
  { infinitive: "mitkommen",  prefix: "mit",  stem: "kommen",  meaning: "to come along",     level: 1 },
  { infinitive: "ausgehen",   prefix: "aus",  stem: "gehen",   meaning: "to go out",         level: 1 },
  { infinitive: "fernsehen",  prefix: "fern", stem: "sehen",   meaning: "to watch TV",       level: 1 },
];

// ─── Level 2 — A2 ─────────────────────────────────────────────────────────────

export const verbsLevel2: SeparableVerb[] = [
  { infinitive: "ankommen",     prefix: "an",     stem: "kommen",  meaning: "to arrive",            level: 2 },
  { infinitive: "abfahren",     prefix: "ab",     stem: "fahren",  meaning: "to depart / leave",    level: 2 },
  { infinitive: "einladen",     prefix: "ein",    stem: "laden",   meaning: "to invite",            level: 2 },
  { infinitive: "vorstellen",   prefix: "vor",    stem: "stellen", meaning: "to introduce / imagine", level: 2 },
  { infinitive: "aufhören",     prefix: "auf",    stem: "hören",   meaning: "to stop / quit",       level: 2 },
  { infinitive: "zurückkommen", prefix: "zurück", stem: "kommen",  meaning: "to come back",         level: 2 },
  { infinitive: "umziehen",     prefix: "um",     stem: "ziehen",  meaning: "to move (house)",      level: 2 },
  { infinitive: "nachdenken",   prefix: "nach",   stem: "denken",  meaning: "to think / reflect",   level: 2 },
  { infinitive: "vorbereiten",  prefix: "vor",    stem: "bereiten", meaning: "to prepare",          level: 2 },
  { infinitive: "teilnehmen",   prefix: "teil",   stem: "nehmen",  meaning: "to participate",       level: 2 },
];

// ─── Level 3 — B1 (new verbs introduced at this level) ────────────────────────

export const verbsLevel3: SeparableVerb[] = [
  { infinitive: "abholen",          prefix: "ab",       stem: "holen",   meaning: "to pick up",             level: 3 },
  { infinitive: "ausfüllen",        prefix: "aus",      stem: "füllen",  meaning: "to fill out",            level: 3 },
  { infinitive: "festhalten",       prefix: "fest",     stem: "halten",  meaning: "to hold on / record",    level: 3 },
  { infinitive: "herausfinden",     prefix: "heraus",   stem: "finden",  meaning: "to find out",            level: 3 },
  { infinitive: "herstellen",       prefix: "her",      stem: "stellen", meaning: "to produce / make",      level: 3 },
  { infinitive: "durchführen",      prefix: "durch",    stem: "führen",  meaning: "to carry out",           level: 3 },
  { infinitive: "zusammenarbeiten", prefix: "zusammen", stem: "arbeiten", meaning: "to work together",      level: 3 },
];

// ─── Level 4 — B2 (new verbs introduced at this level) ────────────────────────

export const verbsLevel4: SeparableVerb[] = [
  { infinitive: "anerkennen",        prefix: "an",          stem: "erkennen", meaning: "to acknowledge / recognise", level: 4 },
  { infinitive: "beitragen",         prefix: "bei",         stem: "tragen",   meaning: "to contribute",              level: 4 },
  { infinitive: "übereinstimmen",    prefix: "überein",     stem: "stimmen",  meaning: "to agree / match",           level: 4 },
  { infinitive: "auseinandersetzen", prefix: "auseinander", stem: "setzen",   meaning: "to deal with / confront",    level: 4 },
  { infinitive: "entgegenkommen",    prefix: "entgegen",    stem: "kommen",   meaning: "to meet halfway / accommodate", level: 4 },
];

// ─── Cumulative lists (all verbs available at each level) ─────────────────────

export const allVerbs: SeparableVerb[] = [
  ...verbsLevel1,
  ...verbsLevel2,
  ...verbsLevel3,
  ...verbsLevel4,
];

export const verbsByLevel: Record<1 | 2 | 3 | 4, SeparableVerb[]> = {
  1: verbsLevel1,
  2: [...verbsLevel1, ...verbsLevel2],
  3: [...verbsLevel1, ...verbsLevel2, ...verbsLevel3],
  4: [...verbsLevel1, ...verbsLevel2, ...verbsLevel3, ...verbsLevel4],
};
