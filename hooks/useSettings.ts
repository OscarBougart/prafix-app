import { useState, useEffect, useCallback, useRef } from "react";
import { storage } from "@/utils/storage";

// ─── Types ────────────────────────────────────────────────────────────────────

export type TranslationLanguage = "en" | "es" | "tr" | "ar" | "uk" | "fr";

export interface AppSettings {
  /** Show the English translation in the sentence card during gameplay. */
  showTranslation: boolean;
  /** Language to use for translations. */
  translationLanguage: TranslationLanguage;
}

export interface SettingsReturn {
  settings: AppSettings;
  isLoading: boolean;
  updateSettings: (patch: Partial<AppSettings>) => Promise<void>;
}

// ─── Constants ────────────────────────────────────────────────────────────────

const SETTINGS_KEY = "prafix:settings";

const DEFAULTS: AppSettings = {
  showTranslation: true,
  translationLanguage: "en",
};

// ─── Hook ─────────────────────────────────────────────────────────────────────

export function useSettings(): SettingsReturn {
  const [settings, setSettings] = useState<AppSettings>(DEFAULTS);
  const [isLoading, setIsLoading]  = useState(true);
  const settingsRef = useRef<AppSettings>(DEFAULTS);

  // Keep ref in sync so updateSettings is always stable
  useEffect(() => {
    settingsRef.current = settings;
  }, [settings]);

  // ── Load on mount ────────────────────────────────────────────────────────────
  useEffect(() => {
    let cancelled = false;
    storage.get<AppSettings>(SETTINGS_KEY).then((stored) => {
      if (cancelled) return;
      if (stored !== null) {
        const merged = { ...DEFAULTS, ...stored };
        setSettings(merged);
        settingsRef.current = merged;
      }
      setIsLoading(false);
    });
    return () => { cancelled = true; };
  }, []);

  // ── Update ───────────────────────────────────────────────────────────────────
  const updateSettings = useCallback(async (patch: Partial<AppSettings>): Promise<void> => {
    const next = { ...settingsRef.current, ...patch };
    setSettings(next);
    settingsRef.current = next;
    await storage.set(SETTINGS_KEY, next);
  }, []);

  return { settings, isLoading, updateSettings };
}
