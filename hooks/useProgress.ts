import { useState, useEffect, useCallback, useRef, useMemo } from "react";
import { storage } from "@/utils/storage";
import { allSentences } from "@/data/sentences";
import type { Sentence, VerbMastery } from "@/data/types";

// ─── Constants ────────────────────────────────────────────────────────────────

const MASTERY_KEY   = "prafix:verb_mastery";
const UNLOCKED_KEY  = "prafix:unlocked_levels";
const MASTERY_THRESHOLD = 3;       // correctCount needed to master a verb
const UNLOCK_THRESHOLD  = 0.8;     // 80% mastered to unlock next level
const ROUND_SIZE        = 10;
const REVIEW_SLOTS      = 2;       // mastered verbs sprinkled in per round

// ─── Types ────────────────────────────────────────────────────────────────────

/** Keyed by verbInfinitive */
type MasteryStore = Record<string, VerbMastery>;

export interface LevelProgress {
  totalVerbs: number;
  masteredVerbs: number;
  percentage: number; // 0–1
}

export interface ProgressReturn {
  isLoading: boolean;
  /** Update mastery for a verb after an answer. */
  updateVerbMastery: (verbInfinitive: string, correct: boolean) => Promise<void>;
  /** Get mastery record for one verb, or null if never seen. */
  getVerbMastery: (verbInfinitive: string) => VerbMastery | null;
  /** correctCount (capped at 3) for each verb in the level, for rendering segmented progress. */
  getVerbCounts: (level: 1 | 2 | 3 | 4) => number[];
  /** Mastery stats for a whole level. */
  getLevelProgress: (level: 1 | 2 | 3 | 4) => LevelProgress;
  /** Level 1 always unlocked; others need prev level >= 80% mastered. */
  isLevelUnlocked: (level: 1 | 2 | 3 | 4) => boolean;
  /** All VerbMastery records where incorrectCount > 0 (for Fehler üben). */
  getMistakes: () => VerbMastery[];
  /** Total mastered verbs across all levels. */
  getTotalMastered: () => number;
  /** Star rating for a level: 1★ = 33%, 2★ = 66%, 3★ = 100% mastered. */
  getLevelStars: (level: 1 | 2 | 3 | 4) => number;
  /**
   * Smart sentence selection for a round.
   * Returns exactly ROUND_SIZE sentences using priority:
   *   1. Wrong & unmastered verbs
   *   2. Never-seen verbs
   *   3. Stale (longest unseen) verbs
   *   4. Mastered verbs as review (REVIEW_SLOTS)
   */
  selectSentencesForRound: (level: 1 | 2 | 3 | 4) => Sentence[];
  resetProgress: () => Promise<void>;
  reloadProgress: () => Promise<void>;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

/** Pick one random sentence from a verb's pool for this level. */
function pickOneSentence(verbInfinitive: string, level: 1 | 2 | 3 | 4): Sentence | null {
  const pool = allSentences.filter(
    (s) => s.verbInfinitive === verbInfinitive && s.level === level,
  );
  if (pool.length === 0) return null;
  return pool[Math.floor(Math.random() * pool.length)]!;
}

/** All unique verb infinitives for a given level. */
function verbsForLevel(level: 1 | 2 | 3 | 4): string[] {
  return [...new Set(allSentences.filter((s) => s.level === level).map((s) => s.verbInfinitive))];
}

// ─── Hook ─────────────────────────────────────────────────────────────────────

export function useProgress(): ProgressReturn {
  const [mastery, setMastery] = useState<MasteryStore>({});
  const [isLoading, setIsLoading] = useState(true);
  const masteryRef = useRef<MasteryStore>({});
  const unlockedLevelsRef = useRef<Set<number>>(new Set([1]));

  // Keep ref in sync
  useEffect(() => {
    masteryRef.current = mastery;
  }, [mastery]);

  // ── Load on mount ────────────────────────────────────────────────────────────
  useEffect(() => {
    let cancelled = false;
    Promise.all([
      storage.get<MasteryStore>(MASTERY_KEY),
      storage.get<number[]>(UNLOCKED_KEY),
    ]).then(([storedMastery, storedUnlocked]) => {
      if (cancelled) return;
      if (storedMastery !== null) {
        setMastery(storedMastery);
        masteryRef.current = storedMastery;
      }
      if (storedUnlocked !== null) {
        unlockedLevelsRef.current = new Set(storedUnlocked);
      }
      setIsLoading(false);
    });
    return () => { cancelled = true; };
  }, []);

  // ── updateVerbMastery ────────────────────────────────────────────────────────
  const updateVerbMastery = useCallback(async (
    verbInfinitive: string,
    correct: boolean,
  ): Promise<void> => {
    const prev = masteryRef.current;

    // Infer the verb's level from sentence data
    const levelInferred = allSentences.find((s) => s.verbInfinitive === verbInfinitive)?.level ?? 1;

    const existing: VerbMastery = prev[verbInfinitive] ?? {
      verbInfinitive,
      level: levelInferred as 1 | 2 | 3 | 4,
      correctCount: 0,
      incorrectCount: 0,
      lastSeen: new Date().toISOString(),
      mastered: false,
    };

    let { correctCount, incorrectCount, mastered } = existing;

    if (correct) {
      correctCount += 1;
      if (correctCount >= MASTERY_THRESHOLD) mastered = true;
    } else {
      incorrectCount += 1;
      // If already mastered, knock back to 2 (needs one more correct to re-master)
      if (mastered) {
        mastered = false;
        correctCount = MASTERY_THRESHOLD - 1;
      }
    }

    const updated: VerbMastery = {
      ...existing,
      correctCount,
      incorrectCount,
      mastered,
      lastSeen: new Date().toISOString(),
    };

    const next: MasteryStore = { ...prev, [verbInfinitive]: updated };
    setMastery(next);
    masteryRef.current = next;
    await storage.set(MASTERY_KEY, next);

    // Check if any new level should be permanently unlocked
    const prevUnlocked = unlockedLevelsRef.current;
    let changed = false;
    for (const lvl of [2, 3, 4] as const) {
      if (!prevUnlocked.has(lvl)) {
        const verbs = verbsForLevel((lvl - 1) as 1 | 2 | 3 | 4);
        const mastered = verbs.filter((v) => next[v]?.mastered === true).length;
        if (verbs.length > 0 && mastered / verbs.length >= UNLOCK_THRESHOLD) {
          prevUnlocked.add(lvl);
          changed = true;
        }
      }
    }
    if (changed) {
      await storage.set(UNLOCKED_KEY, [...prevUnlocked]);
    }
  }, []);

  // ── getVerbMastery ───────────────────────────────────────────────────────────
  const getVerbMastery = useCallback((verbInfinitive: string): VerbMastery | null => {
    return masteryRef.current[verbInfinitive] ?? null;
  }, []);

  // ── getVerbCounts ────────────────────────────────────────────────────────────
  /** Returns correctCount (capped at 3) for each verb in the level, in stable order. */
  const getVerbCounts = useCallback((level: 1 | 2 | 3 | 4): number[] => {
    return verbsForLevel(level).map((v) =>
      Math.min(masteryRef.current[v]?.correctCount ?? 0, MASTERY_THRESHOLD),
    );
  }, []);

  // ── getLevelProgress ─────────────────────────────────────────────────────────
  const getLevelProgress = useCallback((level: 1 | 2 | 3 | 4): LevelProgress => {
    const verbs = verbsForLevel(level);
    const totalVerbs = verbs.length;
    const masteredVerbs = verbs.filter((v) => masteryRef.current[v]?.mastered === true).length;
    return {
      totalVerbs,
      masteredVerbs,
      percentage: totalVerbs === 0 ? 0 : masteredVerbs / totalVerbs,
    };
  }, []);

  // ── isLevelUnlocked ──────────────────────────────────────────────────────────
  const isLevelUnlocked = useCallback((level: 1 | 2 | 3 | 4): boolean => {
    return unlockedLevelsRef.current.has(level);
  }, []);

  // ── getMistakes ──────────────────────────────────────────────────────────────
  const getMistakes = useCallback((): VerbMastery[] => {
    return Object.values(masteryRef.current).filter((m) => m.incorrectCount > 0);
  }, []);

  // ── getTotalMastered ─────────────────────────────────────────────────────────
  const getTotalMastered = useCallback((): number => {
    return Object.values(masteryRef.current).filter((m) => m.mastered).length;
  }, []);

  // ── getLevelStars ────────────────────────────────────────────────────────────
  const getLevelStars = useCallback((level: 1 | 2 | 3 | 4): number => {
    const { percentage } = getLevelProgress(level);
    if (percentage >= 1.0) return 3;
    if (percentage >= 0.66) return 2;
    if (percentage >= 0.33) return 1;
    return 0;
  }, [getLevelProgress]);

  // ── selectSentencesForRound ──────────────────────────────────────────────────
  const selectSentencesForRound = useCallback((level: 1 | 2 | 3 | 4): Sentence[] => {
    const store = masteryRef.current;
    const verbs = verbsForLevel(level);

    // Bucket verbs into priority groups
    const wrongUnmastered: string[] = [];
    const neverSeen:       string[] = [];
    const stale:           string[] = [];
    const mastered:        string[] = [];

    for (const verb of verbs) {
      const m = store[verb];
      if (!m) {
        neverSeen.push(verb);
      } else if (m.mastered) {
        mastered.push(verb);
      } else if (m.incorrectCount > 0) {
        wrongUnmastered.push(verb);
      } else {
        stale.push(verb);
      }
    }

    // Sort stale by lastSeen ascending (oldest first)
    stale.sort((a, b) => {
      const da = store[a]?.lastSeen ?? "";
      const db = store[b]?.lastSeen ?? "";
      return da < db ? -1 : 1;
    });

    // Build selection: fill up to ROUND_SIZE, reserve REVIEW_SLOTS for mastered
    const practiceSlots = ROUND_SIZE - REVIEW_SLOTS;
    const practicePool  = [
      ...shuffle(wrongUnmastered),
      ...shuffle(neverSeen),
      ...stale,
    ];

    const selected: string[] = [];
    for (const verb of practicePool) {
      if (selected.length >= practiceSlots) break;
      selected.push(verb);
    }

    // Fill remaining practice slots with mastered verbs if not enough practice verbs
    const reviewPool = shuffle(mastered);
    while (selected.length < practiceSlots && reviewPool.length > 0) {
      selected.push(reviewPool.pop()!);
    }

    // Add review slots from mastered (up to REVIEW_SLOTS)
    let reviewAdded = 0;
    for (const verb of reviewPool) {
      if (reviewAdded >= REVIEW_SLOTS) break;
      if (!selected.includes(verb)) {
        selected.push(verb);
        reviewAdded++;
      }
    }

    // If still under ROUND_SIZE (small level), pad with any remaining verbs
    const allVerbs = shuffle(verbs);
    for (const verb of allVerbs) {
      if (selected.length >= ROUND_SIZE) break;
      if (!selected.includes(verb)) selected.push(verb);
    }

    // Pick one random sentence per selected verb, shuffle final list
    const sentences: Sentence[] = [];
    for (const verb of selected) {
      const s = pickOneSentence(verb, level);
      if (s) sentences.push(s);
    }

    return shuffle(sentences);
  }, []);

  // ── resetProgress ────────────────────────────────────────────────────────────
  const resetProgress = useCallback(async (): Promise<void> => {
    const empty: MasteryStore = {};
    setMastery(empty);
    masteryRef.current = empty;
    unlockedLevelsRef.current = new Set([1]);
    await Promise.all([storage.remove(MASTERY_KEY), storage.remove(UNLOCKED_KEY)]);
  }, []);

  // ── reloadProgress ───────────────────────────────────────────────────────────
  const reloadProgress = useCallback(async (): Promise<void> => {
    const [stored, storedUnlocked] = await Promise.all([
      storage.get<MasteryStore>(MASTERY_KEY),
      storage.get<number[]>(UNLOCKED_KEY),
    ]);
    const data = stored ?? {};
    setMastery(data);
    masteryRef.current = data;
    unlockedLevelsRef.current = storedUnlocked ? new Set(storedUnlocked) : new Set([1]);
  }, []);

  return useMemo(() => ({
    isLoading,
    updateVerbMastery,
    getVerbMastery,
    getVerbCounts,
    getLevelProgress,
    isLevelUnlocked,
    getMistakes,
    getTotalMastered,
    getLevelStars,
    selectSentencesForRound,
    resetProgress,
    reloadProgress,
  }), [isLoading, mastery]); // eslint-disable-line react-hooks/exhaustive-deps
}
