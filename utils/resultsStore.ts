/**
 * utils/resultsStore.ts
 *
 * Module-level store that carries the full SentenceResult array from the
 * game screen to the results screen. Route params can only hold strings, so
 * we use a lightweight singleton instead of JSON-encoding 10 sentence objects.
 *
 * Pattern: game screen calls setPendingResult() immediately before router.replace(),
 * results screen calls consumePendingResult() on mount (reads and clears).
 */

import type { SentenceResult } from "@/hooks/useGameEngine";

export interface PendingRoundResult {
  level: 1 | 2 | 3 | 4;
  subLevel: 1 | 2 | 3 | 4 | 5;
  score: number;
  stars: number;
  results: SentenceResult[];
}

let _pending: PendingRoundResult | null = null;

export function setPendingResult(r: PendingRoundResult): void {
  _pending = r;
}

/** Read and clear the pending result. Returns null if navigated to directly. */
export function consumePendingResult(): PendingRoundResult | null {
  const r = _pending;
  _pending = null;
  return r;
}
