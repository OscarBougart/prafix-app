/**
 * hooks/useSound.ts
 *
 * Drop these four files into assets/sounds/ and this hook plays them:
 *   correct.wav   — correct answer chime
 *   wrong.wav     — wrong answer buzz
 *   complete.wav  — level complete fanfare
 *   unlock.mp3    — new level unlocked ding  (mp3 works too — just update the require below)
 *
 * Sound toggle is persisted to AsyncStorage.
 */

import { useCallback, useEffect, useRef, useState } from "react";
import { useAudioPlayer } from "expo-audio";
import { storage } from "@/utils/storage";

// ─── Types ────────────────────────────────────────────────────────────────────

export interface SoundReturn {
  soundEnabled: boolean;
  toggleSound: () => Promise<void>;
  playCorrect: () => void;
  playWrong: () => void;
  playLevelComplete: () => void;
  playUnlock: () => void;
}

// ─── Constants ────────────────────────────────────────────────────────────────

const SOUND_ENABLED_KEY = "prafix:soundEnabled";

// ─── Hook ─────────────────────────────────────────────────────────────────────

export function useSound(): SoundReturn {
  const [soundEnabled, setSoundEnabled] = useState(true);
  const enabledRef = useRef(true); // ref mirror — stable across renders

  // ── Load persisted preference ──────────────────────────────────────────────
  useEffect(() => {
    let cancelled = false;
    storage.get<boolean>(SOUND_ENABLED_KEY).then((val) => {
      if (cancelled) return;
      const enabled = val ?? true;
      setSoundEnabled(enabled);
      enabledRef.current = enabled;
    });
    return () => { cancelled = true; };
  }, []);

  // ── Players — preloaded on mount via expo-audio ────────────────────────────
  const correctPlayer  = useAudioPlayer(require("@/assets/sounds/correct.wav"));
  const wrongPlayer    = useAudioPlayer(require("@/assets/sounds/wrong.wav"));
  const completePlayer = useAudioPlayer(require("@/assets/sounds/complete.wav"));
  const unlockPlayer   = useAudioPlayer(require("@/assets/sounds/unlock.wav"));

  // ── Toggle ─────────────────────────────────────────────────────────────────
  const toggleSound = useCallback(async (): Promise<void> => {
    const next = !enabledRef.current;
    enabledRef.current = next;
    setSoundEnabled(next);
    await storage.set(SOUND_ENABLED_KEY, next);
  }, []);

  // ── Play helpers ───────────────────────────────────────────────────────────
  const playCorrect = useCallback((): void => {
    if (!enabledRef.current) return;
    try { correctPlayer.play(); } catch (e) { console.warn("[useSound] correct:", e); }
  }, [correctPlayer]);

  const playWrong = useCallback((): void => {
    if (!enabledRef.current) return;
    try { wrongPlayer.play(); } catch (e) { console.warn("[useSound] wrong:", e); }
  }, [wrongPlayer]);

  const playLevelComplete = useCallback((): void => {
    if (!enabledRef.current) return;
    try { completePlayer.play(); } catch (e) { console.warn("[useSound] complete:", e); }
  }, [completePlayer]);

  const playUnlock = useCallback((): void => {
    if (!enabledRef.current) return;
    try { unlockPlayer.play(); } catch (e) { console.warn("[useSound] unlock:", e); }
  }, [unlockPlayer]);

  return { soundEnabled, toggleSound, playCorrect, playWrong, playLevelComplete, playUnlock };
}
