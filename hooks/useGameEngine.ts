import { useState, useCallback, useMemo, useRef } from "react";
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
  /** 0-based index of the current sentence (0–9). */
  sentenceIndex: number;
  /** Number of correct answers so far. */
  score: number;
  /** Always ROUND_SIZE (10). */
  totalSentences: number;
  /** "playing" until all sentences are answered. */
  gameState: GameState;
  /**
   * Submit a prefix guess.
   * - Records the answer.
   * - Accumulates the per-verb tally for this round.
   * - On the LAST sentence, flushes all verb tallies to mastery storage
   *   (only when trackMastery is true).
   * Returns { correct, correctAnswer }.
   */
  submitAnswer: (prefix: string) => SubmitResult;
  /** 0–3 stars based on score. */
  stars: number;
  /** Full answer record. Complete when gameState === "finished". */
  results: SentenceResult[];
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

/** Star rating: ≥9 = 2★, 10 = 3★, ≥7 = 1★, else 0 */
function calculateStars(score: number): number {
  if (score === 10) return 3;
  if (score >= 9)   return 2;
  if (score >= 7)   return 1;
  return 0;
}

// ─── Per-verb round tally ─────────────────────────────────────────────────────
//
// Within a single round, we accumulate correct/wrong counts per verb.
// At round end we apply the net-result rule:
//   correct > wrong  → +1 correctCount
//   wrong > correct  → +1 incorrectCount
//   tie (equal)      → no change

interface VerbTally {
  correct: number;
  wrong: number;
}

// ─── Hook ─────────────────────────────────────────────────────────────────────

/**
 * Core game loop for a single PräFix round.
 *
 * @param sentences  Pre-selected sentences to play (from selectSentencesForRound
 *                   or customSentences for Favoriten/Fehler üben).
 * @param trackMastery  When true, flushes verb tallies to mastery storage at
 *                      round end. False for Favoriten / Fehler üben modes.
 * @param onMasteryFlush  Called once at end with the net tally map so the
 *                        caller (game screen) can call updateVerbMastery.
 */
export function useGameEngine({
  sentences,
  trackMastery = true,
  onMasteryFlush,
}: {
  sentences: Sentence[];
  trackMastery?: boolean;
  onMasteryFlush?: (tally: Record<string, "correct" | "wrong" | "tie">) => void;
}): GameEngineReturn {
  const [index, setIndex]         = useState(0);
  const [score, setScore]         = useState(0);
  const [results, setResults]     = useState<SentenceResult[]>([]);
  const [gameState, setGameState] = useState<GameState>("playing");

  // Per-verb tally for this round — stored in a ref so submitAnswer callback
  // doesn't need to re-create on every answer.
  const tallyRef = useRef<Record<string, VerbTally>>({});

  const totalSentences = sentences.length;

  const currentSentence: Sentence | null =
    gameState === "playing" ? (sentences[index] ?? null) : null;

  const submitAnswer = useCallback(
    (prefix: string): SubmitResult => {
      if (gameState === "finished" || index >= totalSentences) {
        return { correct: false, correctAnswer: "" };
      }

      const sentence = sentences[index];
      const correct  = prefix === sentence.correctPrefix;
      const result: SentenceResult = { sentence, answeredPrefix: prefix, correct };

      // ── Accumulate verb tally ──────────────────────────────────────────────
      const verb = sentence.verbInfinitive;
      const prev = tallyRef.current[verb] ?? { correct: 0, wrong: 0 };
      tallyRef.current[verb] = {
        correct: prev.correct + (correct ? 1 : 0),
        wrong:   prev.wrong   + (correct ? 0 : 1),
      };

      const nextIndex  = index + 1;
      const isFinished = nextIndex >= totalSentences;

      setResults((r) => [...r, result]);
      if (correct) setScore((s) => s + 1);
      setIndex(nextIndex);

      if (isFinished) {
        setGameState("finished");

        // ── Flush mastery on last answer ───────────────────────────────────
        if (trackMastery && onMasteryFlush) {
          const net: Record<string, "correct" | "wrong" | "tie"> = {};
          for (const [v, t] of Object.entries(tallyRef.current)) {
            if (t.correct > t.wrong)       net[v] = "correct";
            else if (t.wrong > t.correct)  net[v] = "wrong";
            else                           net[v] = "tie";
          }
          onMasteryFlush(net);
        }
      }

      return { correct, correctAnswer: sentence.correctPrefix };
    },
    [gameState, index, sentences, totalSentences, trackMastery, onMasteryFlush],
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
