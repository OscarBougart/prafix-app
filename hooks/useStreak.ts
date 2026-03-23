import { useState, useEffect, useCallback } from "react";
import { storage } from "@/utils/storage";

// ─── Types ────────────────────────────────────────────────────────────────────

interface StreakStore {
  currentStreak: number;
  longestStreak: number;
  lastPlayedDate: string; // "YYYY-MM-DD"
}

export interface StreakReturn {
  currentStreak: number;
  longestStreak: number;
  isLoading: boolean;
  /**
   * Call once after a successful round (stars ≥ 1).
   * - Same day  → no-op (already counted)
   * - Yesterday → increment currentStreak
   * - Older     → reset currentStreak to 1
   * Always updates longestStreak and lastPlayedDate.
   */
  bumpStreak: () => Promise<void>;
}

// ─── Constants ────────────────────────────────────────────────────────────────

const STREAK_KEY = "prafix:streak";

// ─── Helpers ──────────────────────────────────────────────────────────────────

function todayISO(): string {
  return new Date().toISOString().slice(0, 10);
}

function yesterdayISO(): string {
  const d = new Date();
  d.setDate(d.getDate() - 1);
  return d.toISOString().slice(0, 10);
}

/**
 * Reads stored data tolerantly — handles both the current shape and a legacy
 * shape from an earlier version that used `{ count, lastPlayedDate }`.
 */
function parseStored(raw: unknown): StreakStore | null {
  if (!raw || typeof raw !== "object") return null;
  const r = raw as Record<string, unknown>;
  // Current shape
  if (typeof r.currentStreak === "number") {
    return {
      currentStreak: r.currentStreak,
      longestStreak: typeof r.longestStreak === "number" ? r.longestStreak : r.currentStreak,
      lastPlayedDate: typeof r.lastPlayedDate === "string" ? r.lastPlayedDate : "",
    };
  }
  // Legacy shape: { count, lastPlayedDate }
  if (typeof r.count === "number") {
    return {
      currentStreak: r.count,
      longestStreak: r.count,
      lastPlayedDate: typeof r.lastPlayedDate === "string" ? r.lastPlayedDate : "",
    };
  }
  return null;
}

// ─── Hook ─────────────────────────────────────────────────────────────────────

export function useStreak(): StreakReturn {
  const [isLoading, setIsLoading]         = useState(true);
  const [currentStreak, setCurrentStreak] = useState(0);
  const [longestStreak, setLongestStreak] = useState(0);

  // ── Load on mount ────────────────────────────────────────────────────────────
  useEffect(() => {
    let cancelled = false;
    storage.get<unknown>(STREAK_KEY).then((raw) => {
      if (cancelled) return;
      const stored = parseStored(raw);
      if (stored) {
        setCurrentStreak(stored.currentStreak);
        setLongestStreak(stored.longestStreak);
      }
      setIsLoading(false);
    });
    return () => { cancelled = true; };
  }, []);

  // ── bumpStreak ───────────────────────────────────────────────────────────────
  const bumpStreak = useCallback(async (): Promise<void> => {
    const today     = todayISO();
    const yesterday = yesterdayISO();

    const raw    = await storage.get<unknown>(STREAK_KEY);
    const stored = parseStored(raw);

    // Idempotent: already played today
    if (stored?.lastPlayedDate === today) return;

    let newCurrent: number;
    if (!stored) {
      newCurrent = 1;
    } else if (stored.lastPlayedDate === yesterday) {
      newCurrent = stored.currentStreak + 1;
    } else {
      newCurrent = 1; // streak broken — reset
    }

    const newLongest = Math.max(stored?.longestStreak ?? 0, newCurrent);

    const updated: StreakStore = {
      currentStreak: newCurrent,
      longestStreak: newLongest,
      lastPlayedDate: today,
    };

    setCurrentStreak(newCurrent);
    setLongestStreak(newLongest);
    await storage.set(STREAK_KEY, updated);
  }, []);

  return { currentStreak, longestStreak, isLoading, bumpStreak };
}
