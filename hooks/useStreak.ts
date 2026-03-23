import { useState, useEffect, useCallback } from "react";
import { storage } from "@/utils/storage";

// ─── Types ────────────────────────────────────────────────────────────────────

interface StreakStore {
  count: number;
  lastPlayedDate: string; // "YYYY-MM-DD"
}

export interface StreakReturn {
  streakCount: number;
  isLoading: boolean;
  /** Call once after a successful round (stars ≥ 1). Idempotent within a day. */
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

// ─── Hook ─────────────────────────────────────────────────────────────────────

export function useStreak(): StreakReturn {
  const [isLoading, setIsLoading] = useState(true);
  const [streakCount, setStreakCount] = useState(0);

  useEffect(() => {
    let cancelled = false;
    storage.get<StreakStore>(STREAK_KEY).then((stored) => {
      if (cancelled) return;
      if (stored !== null) setStreakCount(stored.count);
      setIsLoading(false);
    });
    return () => {
      cancelled = true;
    };
  }, []);

  const bumpStreak = useCallback(async (): Promise<void> => {
    const today = todayISO();
    const yesterday = yesterdayISO();
    const stored = await storage.get<StreakStore>(STREAK_KEY);

    let newCount: number;
    if (!stored) {
      newCount = 1;
    } else if (stored.lastPlayedDate === today) {
      return; // already bumped today — no change
    } else if (stored.lastPlayedDate === yesterday) {
      newCount = stored.count + 1; // extending streak
    } else {
      newCount = 1; // streak broken — reset
    }

    const updated: StreakStore = { count: newCount, lastPlayedDate: today };
    setStreakCount(newCount);
    await storage.set(STREAK_KEY, updated);
  }, []);

  return { streakCount, isLoading, bumpStreak };
}
