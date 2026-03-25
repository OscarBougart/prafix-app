// ─── Core domain types for PräFix ────────────────────────────────────────────

export interface VerbMastery {
  verbInfinitive: string;
  level: 1 | 2 | 3 | 4;
  correctCount: number;
  incorrectCount: number;
  lastSeen: string; // ISO date string
  mastered: boolean; // true when correctCount >= 3
}

export interface SeparableVerb {
  /** Full infinitive, e.g. "aufmachen" */
  infinitive: string;
  /** Separable prefix, e.g. "auf" */
  prefix: string;
  /** Verb stem without prefix, e.g. "machen" */
  stem: string;
  /** English gloss */
  meaning: string;
  /** CEFR level at which the verb is introduced */
  level: 1 | 2 | 3 | 4;
}

export interface Sentence {
  /** Unique ID, e.g. "s001" */
  id: string;
  /** Full infinitive of the target verb */
  verbInfinitive: string;
  /**
   * Sentence with _____ as placeholder(s).
   *
   * Präsens  – two blanks:  first = conjugatedStem, second = correctPrefix
   *   e.g. "Ich _____ die Tür _____."
   *
   * Perfekt  – one blank directly before the ge-participle root:
   *   e.g. "Ich habe die Tür _____gemacht."
   *
   * Nebensatz – one blank directly before the recombined verb (end of clause):
   *   e.g. "Er sagt, dass er die Tür _____macht."
   */
  template: string;
  /**
   * Präsens : conjugated verb form that fills the FIRST blank  (e.g. "mache")
   * Perfekt : ge-participle root shown AFTER the prefix blank  (e.g. "gemacht")
   * Nebensatz: conjugated verb (± auxiliary) shown AFTER the prefix blank
   *            (e.g. "macht" | "gemacht hat" | "gegangen ist")
   */
  conjugatedStem: string;
  /** The correct prefix that fills the prefix blank */
  correctPrefix: string;
  /** Exactly 3 wrong but real German prefixes */
  distractors: [string, string, string];
  tense: "praesens" | "perfekt" | "nebensatz";
  /** English translation of the full sentence */
  translation: string;
  /** CEFR difficulty level of the sentence */
  level: 1 | 2 | 3 | 4;
  /** 1–5: relative difficulty within this verb's sentence set */
  subLevel: 1 | 2 | 3 | 4 | 5;
}
