import { useState, useEffect, useCallback } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

const STORAGE_KEY = "@prafix_favorites";

export function useFavorites() {
  const [favorites, setFavorites] = useState<Set<string>>(new Set());

  useEffect(() => {
    AsyncStorage.getItem(STORAGE_KEY).then((raw) => {
      if (raw) setFavorites(new Set(JSON.parse(raw) as string[]));
    });
  }, []);

  const toggleFavorite = useCallback(async (sentenceId: string) => {
    setFavorites((prev) => {
      const next = new Set(prev);
      if (next.has(sentenceId)) {
        next.delete(sentenceId);
      } else {
        next.add(sentenceId);
      }
      AsyncStorage.setItem(STORAGE_KEY, JSON.stringify([...next]));
      return next;
    });
  }, []);

  const isFavorite = useCallback(
    (sentenceId: string) => favorites.has(sentenceId),
    [favorites],
  );

  return { isFavorite, toggleFavorite, favoriteIds: favorites, favoriteCount: favorites.size };
}
