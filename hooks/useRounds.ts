import { useState, useEffect, useCallback } from "react";
import { storage } from "@/utils/storage";

const ROUNDS_KEY = "prafix:rounds_played";

export interface RoundsReturn {
  roundsPlayed: number;
  isLoading: boolean;
  incrementRounds: () => Promise<void>;
}

export function useRounds(): RoundsReturn {
  const [roundsPlayed, setRoundsPlayed] = useState(0);
  const [isLoading, setIsLoading]       = useState(true);

  useEffect(() => {
    let cancelled = false;
    storage.get<number>(ROUNDS_KEY).then((val) => {
      if (cancelled) return;
      if (typeof val === "number") setRoundsPlayed(val);
      setIsLoading(false);
    });
    return () => { cancelled = true; };
  }, []);

  const incrementRounds = useCallback(async (): Promise<void> => {
    const current = (await storage.get<number>(ROUNDS_KEY)) ?? 0;
    const next    = current + 1;
    setRoundsPlayed(next);
    await storage.set(ROUNDS_KEY, next);
  }, []);

  return { roundsPlayed, isLoading, incrementRounds };
}
