import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { lessons } from "@/data/lessons";

export type LessonResult = { id: number; stars: number; correct: number; total: number; date: string };

export type ProgressState = {
  results: Record<number, LessonResult>;
  coins: number;
  streak: number;
  lastDay: string | null;
};

const empty: ProgressState = { results: {}, coins: 0, streak: 0, lastDay: null };
const KEY = "qorgai-progress-v1";
const today = () => new Date().toISOString().slice(0, 10);

type Ctx = {
  state: ProgressState;
  completeLesson: (r: Omit<LessonResult, "date">) => void;
  reset: () => void;
  totalStars: number;
  completedCount: number;
  safetyScore: number;
  level: number;
  levelProgress: number;
  nextLessonId: number;
  percent: number;
  maxUnlockedId: number;
  isUnlocked: (id: number) => boolean;
  finalLessonId: number;
  finalDone: boolean;
  isDone: (id: number) => boolean;
  questDone: boolean;
  ready: boolean;
};

const ProgressContext = createContext<Ctx | null>(null);

export function ProgressProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<ProgressState>(empty);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(KEY);
      if (raw) setState({ ...empty, ...JSON.parse(raw) });
    } catch {
      /* ignore */
    }
    setReady(true);
  }, []);

  const persist = (next: ProgressState) => {
    setState(next);
    localStorage.setItem(KEY, JSON.stringify(next));
  };

  const completeLesson = (r: Omit<LessonResult, "date">) => {
    const prev = state.results[r.id];
    const day = today();
    let streak = state.streak;
    if (state.lastDay !== day) {
      const yesterday = new Date(Date.now() - 86400000).toISOString().slice(0, 10);
      streak = state.lastDay === yesterday ? state.streak + 1 : 1;
    }
    const coinsEarned = prev ? 10 : 20 + r.stars * 10;
    persist({
      results: { ...state.results, [r.id]: { ...r, date: day, stars: Math.max(r.stars, prev?.stars ?? 0) } },
      coins: state.coins + coinsEarned,
      streak,
      lastDay: day,
    });
  };

  const results = Object.values(state.results);
  const totalStars = results.reduce((s, r) => s + r.stars, 0);
  const completedCount = results.length;
  const answered = results.reduce((s, r) => s + r.total, 0);
  const right = results.reduce((s, r) => s + r.correct, 0);
  const accuracy = answered ? right / answered : 0;
  const safetyScore = Math.round((completedCount / lessons.length) * 60 + accuracy * 40);
  const level = Math.floor(totalStars / 5) + 1;
  const levelProgress = ((totalStars % 5) / 5) * 100;
  const nextLessonId = lessons.find((l) => !state.results[l.id])?.id ?? lessons.length;
  const percent = Math.round((completedCount / lessons.length) * 100);
  const finalLessonId = lessons[lessons.length - 1]!.id;
  // Уроки открываются последовательно: доступен следующий после последнего пройденного.
  const highestDone = results.length ? Math.max(...results.map((r) => r.id)) : 0;
  const maxUnlockedId = Math.min(finalLessonId, Math.max(nextLessonId, highestDone + 1));
  const finalDone = Boolean(state.results[finalLessonId]);

  const value: Ctx = {
    state,
    completeLesson,
    reset: () => persist(empty),
    totalStars,
    completedCount,
    safetyScore,
    level,
    levelProgress,
    nextLessonId,
    percent,
    maxUnlockedId,
    isUnlocked: (id) => id <= maxUnlockedId || Boolean(state.results[id]),
    finalLessonId,
    finalDone,
    isDone: (id) => Boolean(state.results[id]),
    questDone: state.lastDay === today(),
    ready,
  };

  return <ProgressContext.Provider value={value}>{children}</ProgressContext.Provider>;
}

export function useProgress() {
  const ctx = useContext(ProgressContext);
  if (!ctx) throw new Error("useProgress must be used inside ProgressProvider");
  return ctx;
}
