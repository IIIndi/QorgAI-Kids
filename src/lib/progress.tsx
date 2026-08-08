import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { lessons } from "@/data/lessons";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth";

export type LessonResult = { id: number; stars: number; correct: number; total: number; date: string };
export type LessonStatus = "not_started" | "in_progress" | "completed";

export type ProgressState = {
  results: Record<number, LessonResult>;
  /** Уроки, начатые но не завершённые: id -> шаг, на котором ребёнок остановился. */
  inProgress: Record<number, number>;
  coins: number;
  streak: number;
  lastDay: string | null;
};

const empty: ProgressState = { results: {}, inProgress: {}, coins: 0, streak: 0, lastDay: null };
const KEY = "qorgai-progress-v1";
const today = () => new Date().toISOString().slice(0, 10);

type Ctx = {
  state: ProgressState;
  completeLesson: (r: Omit<LessonResult, "date">) => void;
  startLesson: (id: number, step: number) => void;
  statusOf: (id: number) => LessonStatus;
  resumeStep: (id: number) => number;
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

function derive(state: ProgressState) {
  const results = Object.values(state.results);
  const totalStars = results.reduce((s, r) => s + r.stars, 0);
  const completedCount = results.length;
  const answered = results.reduce((s, r) => s + r.total, 0);
  const right = results.reduce((s, r) => s + r.correct, 0);
  const accuracy = answered ? right / answered : 0;
  const safetyScore = Math.round((completedCount / lessons.length) * 60 + accuracy * 40);
  const nextLessonId = lessons.find((l) => !state.results[l.id])?.id ?? lessons.length;
  const percent = Math.round((completedCount / lessons.length) * 100);
  return { totalStars, completedCount, safetyScore, nextLessonId, percent };
}

export function ProgressProvider({ children }: { children: ReactNode }) {
  const { userId, ready: authReady } = useAuth();
  const [state, setState] = useState<ProgressState>(empty);
  const [ready, setReady] = useState(false);

  // Загрузка сохранённого прогресса из базы (с переносом старых локальных данных).
  useEffect(() => {
    if (!authReady) return;
    let active = true;

    void (async () => {
      let local: ProgressState = empty;
      try {
        const raw = localStorage.getItem(KEY);
        if (raw) local = { ...empty, ...(JSON.parse(raw) as ProgressState) };
      } catch {
        /* ignore */
      }

      if (!userId) {
        if (active) {
          setState(local);
          setReady(true);
        }
        return;
      }

      const [{ data: rows }, { data: stats }] = await Promise.all([
        supabase
          .from("lesson_progress")
          .select("lesson_id, status, stars, correct, total, last_step, completed_at")
          .eq("user_id", userId),
        supabase.from("user_stats").select("coins, streak, last_day").eq("user_id", userId).maybeSingle(),
      ]);

      if (!active) return;

      if (rows && rows.length > 0) {
        const results: Record<number, LessonResult> = {};
        const inProgress: Record<number, number> = {};
        for (const r of rows) {
          if (r.status === "completed") {
            results[r.lesson_id] = {
              id: r.lesson_id,
              stars: r.stars,
              correct: r.correct,
              total: r.total,
              date: (r.completed_at ?? new Date().toISOString()).slice(0, 10),
            };
          } else {
            inProgress[r.lesson_id] = r.last_step;
          }
        }
        const loaded: ProgressState = {
          results,
          inProgress,
          coins: stats?.coins ?? 0,
          streak: stats?.streak ?? 0,
          lastDay: stats?.last_day ?? null,
        };
        setState(loaded);
        localStorage.setItem(KEY, JSON.stringify(loaded));
      } else {
        setState(local);
        if (Object.keys(local.results).length > 0) await pushAll(userId, local);
      }
      setReady(true);
    })();

    return () => {
      active = false;
    };
  }, [authReady, userId]);

  const persist = (next: ProgressState) => {
    setState(next);
    localStorage.setItem(KEY, JSON.stringify(next));
  };

  const syncStats = (userIdValue: string, next: ProgressState) => {
    const d = derive(next);
    return supabase.from("user_stats").upsert({
      user_id: userIdValue,
      coins: next.coins,
      total_stars: d.totalStars,
      streak: next.streak,
      last_day: next.lastDay,
      safety_score: d.safetyScore,
      percent: d.percent,
      current_lesson_id: d.nextLessonId,
      achievements: Object.keys(next.results).map((id) => `lesson-${id}`),
    });
  };

  async function pushAll(userIdValue: string, snapshot: ProgressState) {
    const rows = Object.values(snapshot.results).map((r) => ({
      user_id: userIdValue,
      lesson_id: r.id,
      status: "completed",
      stars: r.stars,
      correct: r.correct,
      total: r.total,
      last_step: r.total,
      completed_at: new Date(`${r.date}T12:00:00Z`).toISOString(),
    }));
    if (rows.length) await supabase.from("lesson_progress").upsert(rows);
    await syncStats(userIdValue, snapshot);
  }

  const startLesson = (id: number, step: number) => {
    if (state.results[id] || state.inProgress[id] === step) return;
    const next: ProgressState = { ...state, inProgress: { ...state.inProgress, [id]: step } };
    persist(next);
    if (!userId) return;
    void supabase.from("lesson_progress").upsert({
      user_id: userId,
      lesson_id: id,
      status: "in_progress",
      last_step: step,
    });
  };

  const completeLesson = (r: Omit<LessonResult, "date">) => {
    const prev = state.results[r.id];
    const day = today();
    let streak = state.streak;
    if (state.lastDay !== day) {
      const yesterday = new Date(Date.now() - 86400000).toISOString().slice(0, 10);
      streak = state.lastDay === yesterday ? state.streak + 1 : 1;
    }
    const isFinal = r.id === lessons[lessons.length - 1]!.id;
    const coinsEarned = prev ? 10 : 20 + r.stars * 10 + (isFinal ? 100 : 0);
    const stars = Math.max(r.stars, prev?.stars ?? 0);
    const rest = { ...state.inProgress };
    delete rest[r.id];

    const next: ProgressState = {
      results: { ...state.results, [r.id]: { ...r, date: day, stars } },
      inProgress: rest,
      coins: state.coins + coinsEarned,
      streak,
      lastDay: day,
    };
    persist(next);

    if (!userId) return;
    void (async () => {
      await supabase.from("lesson_progress").upsert({
        user_id: userId,
        lesson_id: r.id,
        status: "completed",
        stars,
        correct: r.correct,
        total: r.total,
        last_step: r.total,
        completed_at: new Date().toISOString(),
      });
      await syncStats(userId, next);
    })();
  };

  const reset = () => {
    persist(empty);
    if (!userId) return;
    void (async () => {
      await supabase.from("lesson_progress").delete().eq("user_id", userId);
      await syncStats(userId, empty);
    })();
  };

  const d = derive(state);
  const level = Math.floor(d.totalStars / 5) + 1;
  const levelProgress = ((d.totalStars % 5) / 5) * 100;
  const finalLessonId = lessons[lessons.length - 1]!.id;
  // Уроки открываются последовательно: доступен следующий после последнего пройденного.
  const doneIds = Object.values(state.results).map((r) => r.id);
  const highestDone = doneIds.length ? Math.max(...doneIds) : 0;
  const maxUnlockedId = Math.min(finalLessonId, Math.max(d.nextLessonId, highestDone + 1));

  const value: Ctx = {
    state,
    completeLesson,
    startLesson,
    statusOf: (id) => (state.results[id] ? "completed" : state.inProgress[id] !== undefined ? "in_progress" : "not_started"),
    resumeStep: (id) => state.inProgress[id] ?? 0,
    reset,
    totalStars: d.totalStars,
    completedCount: d.completedCount,
    safetyScore: d.safetyScore,
    level,
    levelProgress,
    nextLessonId: d.nextLessonId,
    percent: d.percent,
    maxUnlockedId,
    isUnlocked: (id) => id <= maxUnlockedId || Boolean(state.results[id]),
    finalLessonId,
    finalDone: Boolean(state.results[finalLessonId]),
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
