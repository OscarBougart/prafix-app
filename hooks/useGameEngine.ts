import { useState, useCallback, useMemo } from "react";
import { allSentences } from "@/data/sentences";
import type { Sentence } from "@/data/types";

// ─── Types ────────────────────────────────────────────────────────────────────

export interface SentenceResult {
  sentence: Sentence;
  answeredPrefix: string;
  correct: boolean;
}

export interface SubmitResult {
  correct: boolean;
  correctAnswer: string;
}

export type GameState = "playing" | "finished";

export interface GameEngineReturn {
  /** The sentence the player must answer right now. Null when finished. */
  currentSentence: Sentence | null;
  /** 0-based index of the current sentence (0–9). Equals totalSentences when done. */
  sentenceIndex: number;
  /** Number of correct answers so far. */
  score: number;
  /** Always 10. */
  totalSentences: number;
  /** "playing" until all 10 sentences are answered. */
  gameState: GameState;
  /** Submit a prefix guess. Returns { correct, correctAnswer } and advances to next sentence. */
  submitAnswer: (prefix: string) => SubmitResult;
  /** 0–3 stars. Only meaningful when gameState === "finished". */
  stars: number;
  /** Full answer record. Only complete when gameState === "finished". */
  results: SentenceResult[];
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

/** Fisher-Yates shuffle — uniform random order. */
function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

/**
 * Pick 10 sentences for the given level+subLevel combination.
 * There is exactly one sentence per verb at each subLevel, so filtering
 * level + subLevel yields precisely 10 sentences which we then shuffle.
 */
function pickSentences(level: 1 | 2 | 3 | 4, subLevel: 1 | 2 | 3 | 4 | 5): Sentence[] {
  const pool = allSentences.filter(
    (s) => s.level === level && s.subLevel === subLevel,
  );
  return shuffle(pool);
}

/** Star rating: 7–8 correct = 1 ⭐, 9 = 2 ⭐⭐, 10 = 3 ⭐⭐⭐ */
function calculateStars(score: number): number {
  if (score === 10) return 3;
  if (score === 9) return 2;
  if (score === 8) return 2;
  if (score >= 7) return 1;
  return 0;
}

// ─── Hook ─────────────────────────────────────────────────────────────────────

/**
 * Core game loop for a single PräFix round.
 *
 * Usage:
 *   const { currentSentence, submitAnswer, score, gameState, stars, results } =
 *     useGameEngine({ level: 1, subLevel: 1 });
 */
export function useGameEngine({
  level,
  subLevel,
  customSentences,
}: {
  level: 1 | 2 | 3 | 4;
  subLevel: 1 | 2 | 3 | 4 | 5;
  customSentences?: Sentence[];
}): GameEngineReturn {
  // Sentences are picked once at mount. Changing level/subLevel requires
  // remounting the component (or adding a key prop on the parent).
  const [sentences] = useState<Sentence[]>(() =>
    customSentences && customSentences.length > 0
      ? shuffle(customSentences)
      : pickSentences(level, subLevel),
  );

  const [index, setIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [results, setResults] = useState<SentenceResult[]>([]);
  const [gameState, setGameState] = useState<GameState>("playing");

  const totalSentences = sentences.length; // always 10

  const currentSentence: Sentence | null =
    gameState === "playing" ? (sentences[index] ?? null) : null;

  const submitAnswer = useCallback(
    (prefix: string): SubmitResult => {
      // Guard: ignore calls after the game has ended
      if (gameState === "finished" || index >= totalSentences) {
        return { correct: false, correctAnswer: "" };
      }

      const sentence = sentences[index];
      const correct = prefix === sentence.correctPrefix;
      const result: SentenceResult = { sentence, answeredPrefix: prefix, correct };

      // Batch all state updates in one render
      const nextIndex = index + 1;
      const isFinished = nextIndex >= totalSentences;

      setResults((prev) => [...prev, result]);
      if (correct) setScore((prev) => prev + 1);
      setIndex(nextIndex);
      if (isFinished) setGameState("finished");

      return { correct, correctAnswer: sentence.correctPrefix };
    },
    [gameState, index, sentences, totalSentences],
  );

  const stars = useMemo(
    () => (gameState === "finished" ? calculateStars(score) : 0),
    [gameState, score],
  );

  return {
    currentSentence,
    sentenceIndex: index,
    score,
    totalSentences,
    gameState,
    submitAnswer,
    stars,
    results,
  };
}
