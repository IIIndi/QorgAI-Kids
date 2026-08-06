import { useState } from "react";
import { useI18n } from "@/lib/i18n";
import { useProfile, type AgeGroup } from "@/lib/profile";
import { QorgauSays } from "@/components/Qorgau";
import { cn } from "@/lib/utils";

export function Register({ onDone }: { onDone?: () => void }) {
  const { t } = useI18n();
  const { save } = useProfile();
  const [name, setName] = useState("");
  const [age, setAge] = useState<AgeGroup>("8-9");
  const valid = name.trim().length >= 2;

  return (
    <main className="mx-auto max-w-xl space-y-4 px-4 py-6 pb-16">
      <section className="card-pop animate-slide-up space-y-4 border-primary p-5">
        <QorgauSays text={t("registerHello")} size={120} mood="wave" />
        <h1 className="font-display text-2xl text-primary-dark">{t("registerTitle")}</h1>

        <label className="block space-y-1">
          <span className="text-xs font-extrabold uppercase text-muted-foreground">{t("yourName")}</span>
          <input
            value={name}
            maxLength={24}
            onChange={(e) => setName(e.target.value)}
            placeholder={t("namePlaceholder")}
            className="w-full rounded-2xl border-2 border-border bg-card px-4 py-3 font-bold outline-none focus:border-primary"
          />
        </label>

        <div className="space-y-2">
          <span className="text-xs font-extrabold uppercase text-muted-foreground">{t("chooseAge")}</span>
          <div className="grid grid-cols-2 gap-3">
            {(["8-9", "10-11"] as AgeGroup[]).map((a) => (
              <button
                key={a}
                type="button"
                onClick={() => setAge(a)}
                className={cn(
                  "btn-pop border-2 px-4 py-3 font-extrabold",
                  age === a ? "border-primary bg-secondary" : "border-border bg-card hover:bg-muted",
                )}
              >
                {a === "8-9" ? "🧒 " : "🧑 "}
                {a === "8-9" ? t("age89") : t("age1011")}
              </button>
            ))}
          </div>
        </div>

        <button
          disabled={!valid}
          onClick={() => {
            save({ name, age });
            onDone?.();
          }}
          className="btn-pop w-full bg-primary px-4 py-3 text-lg text-primary-foreground shadow-pop hover:bg-primary-dark disabled:opacity-50"
        >
          {t("saveProfile")} →
        </button>
      </section>
    </main>
  );
}
