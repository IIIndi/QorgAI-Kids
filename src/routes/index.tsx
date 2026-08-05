import { createFileRoute, Link } from "@tanstack/react-router";
import { lessons } from "@/data/lessons";
import { useI18n } from "@/lib/i18n";
import { useProgress } from "@/lib/progress";
import { QorgauSays } from "@/components/Qorgau";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "QorgAI Kids — уроки безопасности для детей 8–11 лет" },
      {
        name: "description",
        content:
          "14 интерактивных уроков о фишинге, мошенниках и безопасности на улице. Звёзды, монеты и котёнок Qorgau на трёх языках.",
      },
      { property: "og:title", content: "QorgAI Kids — уроки безопасности для детей" },
      {
        property: "og:description",
        content: "Интерактивные истории о безопасности в интернете и в жизни с котёнком Qorgau.",
      },
    ],
  }),
  component: HomePage,
});

function StatCard({ emoji, value, label }: { emoji: string; value: string | number; label: string }) {
  return (
    <div className="card-pop flex items-center gap-3 p-3">
      <span className="text-2xl">{emoji}</span>
      <div className="leading-tight">
        <div className="font-display text-xl">{value}</div>
        <div className="text-xs font-bold text-muted-foreground">{label}</div>
      </div>
    </div>
  );
}

function HomePage() {
  const { t, tr } = useI18n();
  const { totalStars, state, completedCount, safetyScore, level, levelProgress, nextLessonId, questDone, isDone } =
    useProgress();

  const todays = lessons.find((l) => l.id === nextLessonId) ?? lessons[lessons.length - 1]!;
  const badges = lessons.filter((l) => isDone(l.id));

  return (
    <main className="mx-auto max-w-5xl space-y-5 px-4 py-5 pb-16">
      <section className="card-pop animate-slide-up overflow-hidden p-4 sm:p-6">
        <QorgauSays text={t("greeting")} size={130} mood="wave" />
        <p className="mt-3 text-sm font-bold text-muted-foreground">{t("tagline")}</p>
      </section>

      <section className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <StatCard emoji="⭐" value={totalStars} label={t("stars")} />
        <StatCard emoji="🪙" value={state.coins} label={t("coins")} />
        <StatCard emoji="🔥" value={state.streak} label={t("streak")} />
        <StatCard emoji="🛡️" value={`${safetyScore}%`} label={t("safetyScore")} />
      </section>

      <section className="card-pop space-y-3 p-4">
        <div className="flex items-baseline justify-between">
          <h2 className="font-display text-lg">
            {t("level")} {level}
          </h2>
          <span className="text-sm font-bold text-muted-foreground">
            {completedCount} {t("of")} {lessons.length} · {t("progress")}
          </span>
        </div>
        <div className="h-4 overflow-hidden rounded-full bg-muted">
          <div
            className="h-full rounded-full bg-primary transition-all duration-700"
            style={{ width: `${Math.max(6, (completedCount / lessons.length) * 100)}%` }}
          />
        </div>
        <div className="flex items-center justify-between text-xs font-bold text-muted-foreground">
          <span>
            {t("nextLevel")}: {level + 1}
          </span>
          <span>{Math.round(levelProgress)}%</span>
        </div>
      </section>

      <section className="card-pop space-y-4 border-primary/40 p-4 sm:p-6">
        <div className="flex items-center gap-2 text-xs font-extrabold uppercase tracking-wide text-primary-dark">
          <span className="rounded-full bg-secondary px-3 py-1">{t("todayLesson")}</span>
          <span className="rounded-full bg-accent px-3 py-1 text-accent-foreground">
            {todays.track === "online" ? t("online") : t("real")}
          </span>
        </div>
        <div className="flex items-start gap-4">
          <span className="text-5xl">{todays.emoji}</span>
          <div>
            <h2 className="font-display text-2xl leading-tight">{tr(todays.title)}</h2>
            <p className="mt-1 line-clamp-3 text-sm font-semibold text-muted-foreground">{tr(todays.story)}</p>
          </div>
        </div>
        <Link
          to="/lesson/$lessonId"
          params={{ lessonId: String(todays.id) }}
          className="btn-pop inline-flex w-full items-center justify-center bg-primary px-6 py-3 text-lg text-primary-foreground shadow-pop hover:bg-primary-dark sm:w-auto"
        >
          {isDone(todays.id) ? t("replay") : t("start")} →
        </Link>
      </section>

      <section
        className={cn(
          "card-pop flex items-center gap-3 p-4",
          questDone ? "border-primary bg-secondary" : "border-sun bg-accent",
        )}
      >
        <span className="text-3xl">{questDone ? "✅" : "🎯"}</span>
        <div>
          <div className="font-display text-base">{t("dailyQuest")}</div>
          <p className="text-sm font-bold text-muted-foreground">
            {questDone ? t("questDone") : t("questText")}
          </p>
        </div>
      </section>

      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="font-display text-lg">{t("achievements")}</h2>
          <Link to="/lessons" className="text-sm font-extrabold text-primary-dark underline">
            {t("allLessons")}
          </Link>
        </div>
        {badges.length === 0 ? (
          <div className="card-pop p-4 text-sm font-bold text-muted-foreground">{t("noStrong")}</div>
        ) : (
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            {badges.map((l) => (
              <div key={l.id} className="card-pop animate-pop-star flex flex-col items-center gap-1 p-3 text-center">
                <span className="text-3xl">{l.emoji}</span>
                <span className="text-xs font-extrabold">{tr(l.badge)}</span>
                <span className="text-xs">{"⭐".repeat(1)}</span>
              </div>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
