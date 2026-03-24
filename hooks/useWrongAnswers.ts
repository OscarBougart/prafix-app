import { useState, useEffect, useCallback } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

const STORAGE_KEY = "@prafix_wrong_answers";

export function useWrongAnswers() {
  const [wrongIds, setWrongIds] = useState<Set<string>>(new Set());

  useEffect(() => {
    AsyncStorage.getItem(STORAGE_KEY).then((raw) => {
      if (raw) setWrongIds(new Set(JSON.parse(raw) as string[]));
    });
  }, []);

  const addWrongAnswer = useCallback(async (sentenceId: string) => {
    setWrongIds((prev) => {
      if (prev.has(sentenceId)) return prev;
      const next = new Set(prev);
      next.add(sentenceId);
      AsyncStorage.setItem(STORAGE_KEY, JSON.stringify([...next]));
      return next;
    });
  }, []);

  const wrongAnswerIds = wrongIds;
  const wrongCount = wrongIds.size;

  return { wrongAnswerIds, wrongCount, addWrongAnswer };
}
