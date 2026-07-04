import { useCallback, useState } from "react";

const STORAGE_KEY = "ob-practice-streak";

interface StreakState {
  count: number;
  lastDay: string; // local date, YYYY-MM-DD
}

function localDay(offsetDays = 0): string {
  const d = new Date();
  d.setDate(d.getDate() + offsetDays);
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${d.getFullYear()}-${m}-${day}`;
}

function load(): StreakState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (typeof parsed.count === "number" && typeof parsed.lastDay === "string") {
        return parsed;
      }
    }
  } catch {
    // corrupted or unavailable storage — start fresh
  }
  return { count: 0, lastDay: "" };
}

/**
 * Consecutive-day practice streak, stored in the browser (no accounts).
 * A day counts when the routine is completed. Missing a day resets to 1
 * on the next completion.
 */
export function useStreak() {
  const [state, setState] = useState<StreakState>(load);

  const today = localDay();
  const yesterday = localDay(-1);

  // The streak a student sees: still alive if they practiced today or
  // yesterday; a longer gap means it's broken and shows as 0 until they
  // practice again.
  const streak = state.lastDay === today || state.lastDay === yesterday ? state.count : 0;
  const practicedToday = state.lastDay === today;

  const recordPractice = useCallback(() => {
    setState((prev) => {
      const now = localDay();
      if (prev.lastDay === now) return prev;
      const next: StreakState = {
        count: prev.lastDay === localDay(-1) ? prev.count + 1 : 1,
        lastDay: now,
      };
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      } catch {
        // storage full/blocked — streak just won't persist
      }
      return next;
    });
  }, []);

  return { streak, practicedToday, recordPractice };
}
