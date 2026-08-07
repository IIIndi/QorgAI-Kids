import { createFileRoute } from "@tanstack/react-router";
import { lessons } from "@/data/lessons";
import { useI18n } from "@/lib/i18n";
import { useProgress } from "@/lib/progress";
import { useProfile } from "@/lib/profile";
import { Qorgau } from "@/components/Qorgau";
import { useQorgai } from "@/components/QorgaiAssistant";

export const Route = createFileRoute("/parents")({
  head: () => ({
    meta: [
      { title: "Кабинет родителя — QorgAI Kids" },
      {
        name: "description",
        content: "Прогресс ребёнка, уровень безопасности, сильные и слабые темы, рекомендации для повторения.",
      },
      { property: "og:title", content: "Кабинет родителя — QorgAI Kids" },
      { property: "og:description", content: "Смотрите прогресс ребёнка и темы, которые стоит повторить." },
    ],
  }),
  component: ParentsPage,
});

function ParentsPage() {
  const { t, tr } = useI18n();
  const { state, completedCount, safetyScore, totalStars, reset, percent } = useProgress();
  const { profile, signOut } = useProfile();
  const { ask } = useQorgai();

  const results = Object.values(state.results);
  const answered = results.reduce((s, r) => s + r.total, 0);
  const right = results.reduce((s, r) => s + r.correct, 0);
  const accuracy = answered ? Math.round((right / answered) * 100) : 0;

  const strong = results.filter((r) => r.correct === r.total).map((r) => lessons.find((l) => l.id === r.id)!);
  const weak = results.filter((r) => r.correct < r.total).map((r) => lessons.find((l) => l.id === r.id)!);
  const notStarted = lessons.filter((l) => !state.results[l.id]).slice(0, 3);

  return (
    <main className="mx-auto max-w-3xl space-y-4 px-4 py-5 pb-16">
      <div className="card-pop flex items-center gap-3 p-4">
        <Qorgau size={80} />
        <h1 className="font-display text-2xl">{t("parentTitle")}</h1>
      </div>

      {profile && (
        <section className="card-pop flex flex-wrap items-center gap-3 border-primary/40 p-4">
          <div>
            <div className="text-xs font-extrabold uppercase text-muted-foreground">{t("childProfile")}</div>
            <div className="font-display text-xl">{profile.name}</div>
          </div>
          <div className="rounded-full bg-secondary px-3 py-1 text-sm font-extrabold text-secondary-foreground">
            {profile.age === "8-9" ? t("age89") : t("age1011")}
          </div>
          <div className="rounded-full bg-accent px-3 py-1 text-sm font-extrabold text-accent-foreground">
            {t("completion")}: {percent}%
          </div>
        </section>
      )}

      <section className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {[
          { e: "📚", v: `${completedCount}/${lessons.length}`, l: t("lessonsDone") },
          { e: "🛡️", v: `${safetyScore}%`, l: t("safetyScore") },
          { e: "🎯", v: `${accuracy}%`, l: t("accuracy") },
          { e: "⭐", v: totalStars, l: t("stars") },
        ].map((s) => (
          <div key={s.l} className="card-pop p-3">
            <div className="text-2xl">{s.e}</div>
            <div className="font-display text-xl">{s.v}</div>
            <div className="text-xs font-bold text-muted-foreground">{s.l}</div>
          </div>
        ))}
      </section>

      <section className="card-pop space-y-2 border-primary/40 p-4">
        <h2 className="font-display text-lg text-primary-dark">{t("strengths")}</h2>
        {strong.length ? (
          <ul className="space-y-1 text-sm font-bold">
            {strong.map((l) => (
              <li key={l.id}>✅ {tr(l.title)}</li>
            ))}
          </ul>
        ) : (
          <p className="text-sm font-bold text-muted-foreground">{t("noStrong")}</p>
        )}
      </section>

      <section className="card-pop space-y-2 border-sun p-4">
        <h2 className="font-display text-lg">{t("weaknesses")}</h2>
        {weak.length ? (
          <ul className="space-y-1 text-sm font-bold">
            {weak.map((l) => (
              <li key={l.id}>⚠️ {tr(l.title)}</li>
            ))}
          </ul>
        ) : (
          <p className="text-sm font-bold text-muted-foreground">{t("noWeak")}</p>
        )}
      </section>

      <section className="card-pop space-y-2 bg-secondary p-4">
        <h2 className="font-display text-lg">{t("recommendations")}</h2>
        <p className="text-sm font-bold">{t("recommendText")}</p>
        <ul className="space-y-1 text-sm font-bold">
          {[...weak, ...notStarted].slice(0, 4).map((l) => (
            <li key={l.id}>
              {l.emoji} {tr(l.title)} — «{tr(l.rule)}»
            </li>
          ))}
        </ul>
      </section>

      <button
        onClick={() =>
          ask(
            `Ты помощник для родителя. Ребёнок${profile ? ` ${profile.name}, возраст ${profile.age}` : ""} прошёл ${completedCount} из ${lessons.length} уроков безопасности, индекс безопасности ${safetyScore}%, точность ответов ${accuracy}%. Сильные темы: ${strong.map((l) => tr(l.title)).join(", ") || "пока нет"}. Слабые темы: ${weak.map((l) => tr(l.title)).join(", ") || "пока нет"}. Не пройдены: ${notStarted.map((l) => tr(l.title)).join(", ") || "нет"}. Дай родителю 3-4 коротких персональных совета, какие темы повторить и как обсудить их с ребёнком.`,
            t("aiParentTips"),
          )
        }
        className="btn-pop w-full border-2 border-primary bg-secondary px-4 py-3 font-extrabold text-primary-dark"
      >
        {t("aiParentTips")}
      </button>

      <button onClick={signOut} className="btn-pop w-full border-2 border-border bg-card px-4 py-3 text-sm">
        {t("changeProfile")}
      </button>

      <button onClick={reset} className="btn-pop w-full border-2 border-border bg-card px-4 py-3 text-sm">
        {t("reset")}
      </button>
    </main>
  );
}
