import { createFileRoute, Link } from "@tanstack/react-router";
import { lessons } from "@/data/lessons";
import { useI18n } from "@/lib/i18n";
import { useProgress } from "@/lib/progress";
import { Qorgau } from "@/components/Qorgau";

export const Route = createFileRoute("/lessons")({
  head: () => ({
    meta: [
      { title: "Все уроки безопасности — QorgAI Kids" },
      {
        name: "description",
        content: "14 готовых уроков: фишинг, мошенники, соцсети, AI-обман, незнакомцы, экстренные службы.",
      },
      { property: "og:title", content: "Все уроки безопасности — QorgAI Kids" },
      { property: "og:description", content: "Путь героя из 14 интерактивных уроков безопасности." },
    ],
  }),
  component: LessonsPage,
});

function LessonsPage() {
  const { t, tr } = useI18n();
  const { isDone, state } = useProgress();

  const tracks = [
    { key: "online" as const, title: t("online") },
    { key: "real" as const, title: t("real") },
  ];

  return (
    <main className="mx-auto max-w-5xl space-y-6 px-4 py-5 pb-16">
      <div className="card-pop flex items-center gap-3 p-4">
        <Qorgau size={80} />
        <h1 className="font-display text-2xl">{t("allLessons")}</h1>
      </div>

      {tracks.map((track) => (
        <section key={track.key} className="space-y-3">
          <h2 className="font-display text-lg text-primary-dark">{track.title}</h2>
          <div className="grid gap-3 sm:grid-cols-2">
            {lessons
              .filter((l) => l.track === track.key)
              .map((l) => {
                const done = isDone(l.id);
                const stars = state.results[l.id]?.stars ?? 0;
                return (
                  <Link
                    key={l.id}
                    to="/lesson/$lessonId"
                    params={{ lessonId: String(l.id) }}
                    className="card-pop btn-pop flex items-center gap-3 p-4 hover:border-primary"
                  >
                    <span className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-secondary text-2xl">
                      {l.emoji}
                    </span>
                    <div className="min-w-0 flex-1">
                      <div className="text-xs font-extrabold text-muted-foreground">
                        {t("lesson")} {l.id}
                      </div>
                      <div className="truncate font-display text-base">{tr(l.title)}</div>
                    </div>
                    <span className="shrink-0 text-sm font-extrabold">
                      {done ? "⭐".repeat(Math.max(1, stars)) : "▶"}
                    </span>
                  </Link>
                );
              })}
          </div>
        </section>
      ))}
    </main>
  );
}
