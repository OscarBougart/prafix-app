import { useState, useEffect, useCallback, useRef, useMemo } from "react";
import { storage } from "@/utils/storage";

// ─── Types ────────────────────────────────────────────────────────────────────

export interface SubLevelProgress {
  /** Best correct-answer count out of 10 across all attempts. */
  bestScore: number;
  /** Best star rating (0–3) across all attempts. */
  bestStars: number;
  /** Total number of times this subLevel has been played. */
  attempts: number;
  /** True once the player earns ≥ 1 star on any attempt. */
  completed: boolean;
}

/** One entry per subLevel (1–5), always exactly 5 items. */
export interface SubLevelRecord extends SubLevelProgress {
  subLevel: 1 | 2 | 3 | 4 | 5;
}

// Stored in AsyncStorage as a nested object keyed by stringified level/subLevel.
// Using string keys for reliable JSON round-trip serialization.
type LevelData = Partial<Record<string, SubLevelProgress>>;
type ProgressData = Partial<Record<string, LevelData>>;

export interface ProgressReturn {
  /** True while the initial load from AsyncStorage is in progress. */
  isLoading: boolean;
  /**
   * Persist the result of a finished round. Updates local state immediately
   * and writes to AsyncStorage asynchronously.
   */
  saveRoundResult: (
    level: 1 | 2 | 3 | 4,
    subLevel: 1 | 2 | 3 | 4 | 5,
    score: number,
    stars: number,
  ) => Promise<void>;
  /**
   * Returns an array of 5 SubLevelRecords (one per subLevel) for the given
   * level. Missing entries default to zeroed-out progress.
   */
  getLevelProgress: (level: 1 | 2 | 3 | 4) => SubLevelRecord[];
  /**
   * Level 1 is always unlocked. Level N (N > 1) unlocks once every subLevel
   * of level N-1 is completed (bestStars ≥ 1).
   */
  isLevelUnlocked: (level: 1 | 2 | 3 | 4) => boolean;
  /** Sum of bestStars across every subLevel in every level. Max = 4 × 5 × 3 = 60. */
  getTotalStars: () => number;
  /** Wipe all progress. Used for dev resets — prompt the user first. */
  resetProgress: () => Promise<void>;
}

// ─── Constants ────────────────────────────────────────────────────────────────

const PROGRESS_KEY = "prafix:progress";

const SUB_LEVELS = [1, 2, 3, 4, 5] as const;

const DEFAULT_SUB_LEVEL_PROGRESS: SubLevelProgress = {
  bestScore: 0,
  bestStars: 0,
  attempts: 0,
  completed: false,
};

// ─── Helpers ──────────────────────────────────────────────────────────────────

function getSubLevel(data: LevelData | undefined, subLevel: number): SubLevelProgress {
  return data?.[subLevel.toString()] ?? DEFAULT_SUB_LEVEL_PROGRESS;
}

function isLevelFullyCompleted(data: LevelData | undefined): boolean {
  return SUB_LEVELS.every((sl) => getSubLevel(data, sl).completed);
}

// ─── Hook ─────────────────────────────────────────────────────────────────────

/**
 * Reads and writes PräFix progress to AsyncStorage.
 *
 * Usage:
 *   const { isLoading, saveRoundResult, getLevelProgress, isLevelUnlocked, getTotalStars } =
 *     useProgress();
 */
export function useProgress(): ProgressReturn {
  const [isLoading, setIsLoading] = useState(true);
  const [progress, setProgress] = useState<ProgressData>({});

  // Mirror of progress in a ref so callbacks can read the latest value
  // without needing to be re-created on every state change.
  const progressRef = useRef<ProgressData>({});
  useEffect(() => {
    progressRef.current = progress;
  }, [progress]);

  // ── Load from storage on mount ──────────────────────────────────────────────
  useEffect(() => {
    let cancelled = false;
    storage.get<ProgressData>(PROGRESS_KEY).then((stored) => {
      if (cancelled) return;
      if (stored !== null) {
        setProgress(stored);
        progressRef.current = stored;
      }
      setIsLoading(false);
    });
    return () => {
      cancelled = true;
    };
  }, []);

  // ── saveRoundResult ─────────────────────────────────────────────────────────
  const saveRoundResult = useCallback(
    async (
      level: 1 | 2 | 3 | 4,
      subLevel: 1 | 2 | 3 | 4 | 5,
      score: number,
      stars: number,
    ): Promise<void> => {
      const prev = progressRef.current;
      const levelKey = level.toString();
      const subKey = subLevel.toString();
      const levelData: LevelData = { ...(prev[levelKey] ?? {}) };
      const existing = levelData[subKey] ?? DEFAULT_SUB_LEVEL_PROGRESS;

      const updated: SubLevelProgress = {
        bestScore: Math.max(existing.bestScore, score),
        bestStars: Math.max(existing.bestStars, stars),
        attempts: existing.attempts + 1,
        completed: existing.completed || stars >= 1,
      };

      const newProgress: ProgressData = {
        ...prev,
        [levelKey]: { ...levelData, [subKey]: updated },
      };

      // Update local state immediately for responsive UI
      setProgress(newProgress);
      progressRef.current = newProgress;

      // Persist to AsyncStorage (fire-and-wait, errors are swallowed by storage.set)
      await storage.set(PROGRESS_KEY, newProgress);
    },
    [],
  );

  // ── getLevelProgress ────────────────────────────────────────────────────────
  const getLevelProgress = useCallback(
    (level: 1 | 2 | 3 | 4): SubLevelRecord[] => {
      const levelData = progressRef.current[level.toString()];
      return SUB_LEVELS.map((subLevel) => ({
        subLevel,
        ...getSubLevel(levelData, subLevel),
      }));
    },
    // No deps — reads from ref, safe to be stable
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  );

  // ── isLevelUnlocked ─────────────────────────────────────────────────────────
  const isLevelUnlocked = useCallback(
    (level: 1 | 2 | 3 | 4): boolean => {
      if (level === 1) return true;
      const prevLevelKey = (level - 1).toString();
      return isLevelFullyCompleted(progressRef.current[prevLevelKey]);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  );

  // ── getTotalStars ───────────────────────────────────────────────────────────
  const getTotalStars = useCallback((): number => {
    let total = 0;
    for (const levelData of Object.values(progressRef.current)) {
      if (!levelData) continue;
      for (const subData of Object.values(levelData)) {
        if (subData) total += subData.bestStars;
      }
    }
    return total;
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ── resetProgress ───────────────────────────────────────────────────────────
  const resetProgress = useCallback(async (): Promise<void> => {
    const empty: ProgressData = {};
    setProgress(empty);
    progressRef.current = empty;
    await storage.remove(PROGRESS_KEY);
  }, []);

  // ── Reactive wrappers ───────────────────────────────────────────────────────
  // getLevelProgress, isLevelUnlocked, getTotalStars all read from progressRef
  // so they return the latest values without needing re-creation. However, the
  // calling component won't re-render when progress changes unless it reads
  // from the `progress` state. The memoized values below provide reactive
  // alternatives for components that need to re-render on change.

  // (Components can call the stable functions above OR use these reactive memo
  // values — both are exposed. Using both in the same component is fine.)

  return useMemo(
    () => ({
      isLoading,
      saveRoundResult,
      getLevelProgress,
      isLevelUnlocked,
      getTotalStars,
      resetProgress,
    }),
    // Only re-create the object when isLoading changes or after a save
    // (progress state change). The callback refs are stable.
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [isLoading, progress, saveRoundResult, getLevelProgress, isLevelUnlocked, getTotalStars, resetProgress],
  );
}
