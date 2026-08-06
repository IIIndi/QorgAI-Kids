import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { lessons, getLesson } from "@/data/lessons";
import { useI18n } from "@/lib/i18n";
import { useProgress } from "@/lib/progress";
import { Qorgau, QorgauSays } from "@/components/Qorgau";
import { Confetti } from "@/components/Confetti";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/lesson/$lessonId")({
  head: () => ({
    meta: [
      { title: "Урок безопасности — QorgAI Kids" },
      { name: "description", content: "История, диалог и интерактивная ситуация с объяснением каждого ответа." },
      { property: "og:title", content: "Урок безопасности — QorgAI Kids" },
      { property: "og:description", content: "Проходи ситуацию, выбирай ответ и получай объяснение от котёнка Qorgau." },
    ],
  }),
  component: LessonPage,
});

function LessonPage() {
  const { lessonId } = Route.useParams();
  return <LessonRunner key={lessonId} lessonId={lessonId} />;
}

function LessonRunner({ lessonId }: { lessonId: string }) {
  const { t, tr } = useI18n();
  const { completeLesson } = useProgress();
  const navigate = useNavigate();
  const lesson = useMemo(() => getLesson(Number(lessonId)), [lessonId]);

  const [step, setStep] = useState(0);
  const [picked, setPicked] = useState<number | null>(null);
  const [wrongPicks, setWrongPicks] = useState<number[]>([]);
  const [mistakes, setMistakes] = useState(0);
  const [finished, setFinished] = useState(false);
  const [jump, setJump] = useState(false);

  if (!lesson) {
    return (
      <main className="mx-auto max-w-2xl p-6">
        <Link to="/lessons" className="font-extrabold text-primary-dark underline">
          {t("allLessons")}
        </Link>
      </main>
    );
  }

  const scene = lesson.scenes[step]!;
  const total = lesson.scenes.length;
  const stars = mistakes === 0 ? 3 : mistakes <= 2 ? 2 : 1;
  const isCorrect = picked !== null && scene.options[picked]!.safe;

  const pick = (i: number) => {
    if (isCorrect || wrongPicks.includes(i)) return;
    setPicked(i);
    if (scene.options[i]!.safe) {
      setJump(true);
      setTimeout(() => setJump(false), 800);
    } else {
      setWrongPicks((w) => [...w, i]);
      setMistakes((m) => m + 1);
    }
  };

  const retry = () => setPicked(null);

  const next = () => {
    if (step + 1 < total) {
      setStep(step + 1);
      setPicked(null);
      setWrongPicks([]);
    } else {
      completeLesson({ id: lesson.id, stars, correct: total, total });
      setFinished(true);
    }
  };

  if (finished) {
    const nextL = lessons.find((l) => l.id === lesson.id + 1);
    return (
      <main className="mx-auto max-w-2xl space-y-4 px-4 py-6 pb-16">
        <Confetti />
        <section className="card-pop animate-slide-up space-y-4 border-primary p-5 text-center">
          <QorgauSays text={`${t("lessonDone")} ${tr(lesson.title)} 🎉`} size={130} mood="jump" />
          <h1 className="font-display text-3xl text-primary-dark">{t("lessonDone")}</h1>
          <div className="text-4xl">{"⭐".repeat(stars)}</div>
          <p className="font-bold">
            {t("earned")}: {stars} ⭐ · {20 + stars * 10} 🪙
          </p>
          <div className="rounded-2xl bg-accent px-4 py-3 font-extrabold text-accent-foreground">
            🏅 {t("newBadge")}: {tr(lesson.badge)}
          </div>
          <div className="rounded-2xl border-2 border-primary/40 bg-secondary p-4 text-left">
            <div className="text-xs font-extrabold uppercase text-primary-dark">{t("ruleOfDay")}</div>
            <p className="mt-1 font-bold">{tr(lesson.rule)}</p>
          </div>
          <div className="flex flex-col gap-2 sm:flex-row">
            {nextL && (
              <button
                onClick={() => navigate({ to: "/lesson/$lessonId", params: { lessonId: String(nextL.id) } })}
                className="btn-pop flex-1 bg-primary px-4 py-3 text-primary-foreground shadow-pop hover:bg-primary-dark"
              >
                {t("nextLesson")}: {tr(nextL.title)}
              </button>
            )}
            <Link to="/" className="btn-pop flex-1 border-2 border-border bg-card px-4 py-3 text-center">
              {t("toHome")}
            </Link>
          </div>
        </section>
      </main>
    );
  }


  return (
    <main className="mx-auto max-w-2xl space-y-4 px-4 py-5 pb-16">
      <div className="flex items-center gap-3">
        <Link to="/lessons" className="text-sm font-extrabold text-primary-dark underline">
          ← {t("allLessons")}
        </Link>
        <div className="ml-auto text-sm font-extrabold text-muted-foreground">
          {step + 1} {t("of")} {lesson.scenes.length}
        </div>
      </div>
      <div className="h-3 overflow-hidden rounded-full bg-muted">
        <div
          className="h-full bg-primary transition-all duration-500"
          style={{ width: `${((step + (picked !== null ? 1 : 0)) / lesson.scenes.length) * 100}%` }}
        />
      </div>

      <section className="card-pop animate-slide-up space-y-3 p-4">
        <div className="flex items-center gap-3">
          <span className="text-4xl">{lesson.emoji}</span>
          <div>
            <div className="text-xs font-extrabold uppercase text-muted-foreground">
              {t("lesson")} {lesson.id} · {lesson.track === "online" ? t("online") : t("real")}
            </div>
            <h1 className="font-display text-2xl leading-tight">{tr(lesson.title)}</h1>
          </div>
        </div>
        <p className="rounded-2xl bg-muted p-3 font-semibold">{tr(lesson.story)}</p>
        <div className="space-y-2">
          {lesson.dialogue.map((d, i) => (
            <div
              key={i}
              className={cn(
                "rounded-2xl border-2 p-3 text-sm font-semibold",
                d.hero ? "border-primary/40 bg-secondary" : "border-border bg-card",
              )}
            >
              <span className="mr-1 font-extrabold">{d.hero ? "🐱 " : ""}{tr(d.who)}:</span>
              {tr(d.text)}
            </div>
          ))}
        </div>
      </section>

      <section className="card-pop space-y-3 p-4">
        <div className="text-xs font-extrabold uppercase text-primary-dark">{t("situation")}</div>
        <h2 className="font-display text-xl">{tr(scene.question)}</h2>
        <div className="space-y-2">
          {scene.options.map((op, i) => {
            const active = picked === i;
            return (
              <button
                key={i}
                onClick={() => pick(i)}
                disabled={picked !== null}
                className={cn(
                  "btn-pop w-full border-2 px-4 py-3 text-left font-bold",
                  picked === null && "border-border bg-card hover:border-primary hover:bg-secondary",
                  picked !== null && !active && "border-border bg-muted opacity-60",
                  active && op.safe && "border-primary bg-secondary",
                  active && !op.safe && "border-destructive bg-danger-soft",
                )}
              >
                {tr(op.text)}
              </button>
            );
          })}
        </div>

        {picked !== null && (
          <div className="animate-slide-up space-y-3">
            <QorgauSays
              text={`${scene.options[picked]!.safe ? t("correct") : t("wrong")} — ${tr(scene.options[picked]!.explain)}`}
              size={90}
              mood={jump ? "jump" : "idle"}
              tone={scene.options[picked]!.safe ? "green" : "yellow"}
            />
            <button
              onClick={next}
              className="btn-pop w-full bg-primary px-4 py-3 text-lg text-primary-foreground shadow-pop hover:bg-primary-dark"
            >
              {step + 1 < lesson.scenes.length ? t("next") : t("finish")} →
            </button>
          </div>
        )}
      </section>

      <section className="card-pop border-sun bg-accent p-4">
        <div className="text-xs font-extrabold uppercase text-accent-foreground">{t("ruleOfDay")}</div>
        <p className="mt-1 font-extrabold text-accent-foreground">{tr(lesson.rule)}</p>
      </section>
    </main>
  );
}
