import { Link } from "@tanstack/react-router";
import { Home, BookOpen, Users } from "lucide-react";
import { languages, useI18n } from "@/lib/i18n";
import { useProgress } from "@/lib/progress";
import { cn } from "@/lib/utils";

export function AppHeader() {
  const { t, lang, setLang } = useI18n();
  const { totalStars, state } = useProgress();

  const nav = [
    { to: "/", label: t("home"), icon: Home },
    { to: "/lessons", label: t("lessons"), icon: BookOpen },
    { to: "/parents", label: t("parents"), icon: Users },
  ] as const;

  return (
    <header className="sticky top-0 z-40 border-b-2 border-border bg-card/95 backdrop-blur">
      <div className="mx-auto flex max-w-5xl flex-wrap items-center gap-2 px-4 py-3">
        <Link to="/" className="mr-auto flex items-center gap-2">
          <span className="grid h-9 w-9 place-items-center rounded-2xl bg-primary text-lg text-primary-foreground">
            🛡️
          </span>
          <span className="font-display text-xl leading-none text-primary-dark">QorgAI Kids</span>
        </Link>

        <div className="flex items-center gap-1 rounded-full bg-accent px-3 py-1.5 text-sm font-extrabold text-accent-foreground">
          ⭐ {totalStars}
        </div>
        <div className="flex items-center gap-1 rounded-full bg-secondary px-3 py-1.5 text-sm font-extrabold text-secondary-foreground">
          🪙 {state.coins}
        </div>

        <div className="flex overflow-hidden rounded-full border-2 border-border">
          {languages.map((l) => (
            <button
              key={l.code}
              onClick={() => setLang(l.code)}
              aria-label={l.label}
              className={cn(
                "px-2.5 py-1 text-sm transition-colors",
                lang === l.code ? "bg-primary text-primary-foreground" : "hover:bg-muted",
              )}
            >
              {l.flag}
            </button>
          ))}
        </div>
      </div>

      <nav className="mx-auto flex max-w-5xl gap-2 px-4 pb-3">
        {nav.map((n) => (
          <Link
            key={n.to}
            to={n.to}
            activeOptions={{ exact: n.to === "/" }}
            activeProps={{ className: "bg-primary text-primary-foreground border-primary" }}
            inactiveProps={{ className: "bg-card text-muted-foreground border-border hover:bg-muted" }}
            className="btn-pop flex flex-1 items-center justify-center gap-2 border-2 px-3 py-2 text-sm"
          >
            <n.icon className="h-4 w-4" />
            {n.label}
          </Link>
        ))}
      </nav>
    </header>
  );
}
