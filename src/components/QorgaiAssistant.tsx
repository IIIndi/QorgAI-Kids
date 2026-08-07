import { createContext, useCallback, useContext, useEffect, useRef, useState, type ReactNode } from "react";
import { X, Send, Sparkles } from "lucide-react";
import { Qorgau } from "@/components/Qorgau";
import { useI18n } from "@/lib/i18n";
import { useProfile } from "@/lib/profile";
import { askQorgai } from "@/lib/ai.functions";
import { cn } from "@/lib/utils";

type Msg = { role: "user" | "assistant"; content: string };

type Ctx = {
  open: boolean;
  setOpen: (v: boolean) => void;
  ask: (prompt: string, visibleLabel?: string) => void;
};

const AssistantContext = createContext<Ctx | null>(null);

export function useQorgai() {
  const ctx = useContext(AssistantContext);
  if (!ctx) throw new Error("useQorgai must be used inside QorgaiAssistant");
  return ctx;
}

export function QorgaiAssistant({ children }: { children: ReactNode }) {
  const { t, lang } = useI18n();
  const { profile } = useProfile();
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Msg[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const listRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    listRef.current?.scrollTo({ top: listRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, loading]);

  useEffect(() => {
    if (open) inputRef.current?.focus();
  }, [open, loading]);

  const send = useCallback(
    async (prompt: string, visibleLabel?: string) => {
      const history: Msg[] = [...messages, { role: "user", content: visibleLabel ?? prompt }];
      setMessages(history);
      setLoading(true);
      try {
        const res = await askQorgai({
          data: {
            messages: [...messages, { role: "user" as const, content: prompt }].slice(-10),
            lang,
            age: profile?.age ?? "8-9",
            name: profile?.name,
          },
        });
        const reply =
          res.error === "rate_limited"
            ? t("aiBusy")
            : res.error === "no_credits"
              ? t("aiNoCredits")
              : res.text || t("aiError");
        setMessages([...history, { role: "assistant", content: reply }]);
      } catch {
        setMessages([...history, { role: "assistant", content: t("aiError") }]);
      } finally {
        setLoading(false);
      }
    },
    [messages, lang, profile, t],
  );

  const ask = useCallback(
    (prompt: string, visibleLabel?: string) => {
      setOpen(true);
      void send(prompt, visibleLabel);
    },
    [send],
  );

  const quick = [t("aiQuick1"), t("aiQuick2"), t("aiQuick3")];

  return (
    <AssistantContext.Provider value={{ open, setOpen, ask }}>
      {children}

      {!open && (
        <button
          onClick={() => setOpen(true)}
          aria-label={t("aiTitle")}
          className="fixed bottom-4 right-4 z-50 flex items-center gap-1 rounded-full border-2 border-primary bg-card py-1 pl-1 pr-3 shadow-pop transition-transform hover:scale-105"
        >
          <Qorgau size={48} mood="wave" />
          <span className="font-display text-sm text-primary-dark">QorgAI</span>
        </button>
      )}

      {open && (
        <div className="fixed inset-x-2 bottom-2 z-50 flex max-h-[80vh] flex-col overflow-hidden rounded-3xl border-2 border-primary bg-card shadow-pop sm:inset-x-auto sm:right-4 sm:w-[380px]">
          <div className="flex items-center gap-2 border-b-2 border-border bg-secondary px-3 py-2">
            <Qorgau size={40} mood="idle" />
            <div className="mr-auto">
              <div className="font-display text-base leading-none text-primary-dark">{t("aiTitle")}</div>
              <div className="text-xs font-bold text-muted-foreground">{t("aiSubtitle")}</div>
            </div>
            <button onClick={() => setOpen(false)} aria-label="close" className="rounded-full p-1 hover:bg-muted">
              <X className="h-5 w-5" />
            </button>
          </div>

          <div ref={listRef} className="flex-1 space-y-2 overflow-y-auto p-3">
            {messages.length === 0 && (
              <div className="space-y-2">
                <div className="rounded-2xl border-2 border-primary/30 bg-secondary p-3 text-sm font-bold">
                  {t("aiHello")}
                </div>
                <div className="flex flex-wrap gap-2">
                  {quick.map((q) => (
                    <button
                      key={q}
                      onClick={() => void send(q)}
                      className="rounded-full border-2 border-border bg-card px-3 py-1 text-xs font-extrabold hover:bg-muted"
                    >
                      <Sparkles className="mr-1 inline h-3 w-3" />
                      {q}
                    </button>
                  ))}
                </div>
              </div>
            )}
            {messages.map((m, i) => (
              <div
                key={i}
                className={cn(
                  "animate-slide-up max-w-[90%] whitespace-pre-wrap rounded-2xl border-2 p-3 text-sm font-semibold",
                  m.role === "user"
                    ? "ml-auto border-border bg-muted"
                    : "border-primary/30 bg-secondary text-secondary-foreground",
                )}
              >
                {m.content}
              </div>
            ))}
            {loading && (
              <div className="flex items-center gap-2 text-sm font-bold text-muted-foreground">
                <Qorgau size={36} mood="idle" /> {t("aiThinking")}
              </div>
            )}
          </div>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              const v = input.trim();
              if (!v || loading) return;
              setInput("");
              void send(v);
            }}
            className="flex items-end gap-2 border-t-2 border-border p-2"
          >
            <textarea
              ref={inputRef}
              value={input}
              rows={2}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  (e.currentTarget.form as HTMLFormElement).requestSubmit();
                }
              }}
              placeholder={t("aiPlaceholder")}
              className="max-h-28 flex-1 resize-none rounded-2xl border-2 border-border bg-card px-3 py-2 text-sm font-semibold outline-none focus:border-primary"
            />
            <button
              type="submit"
              disabled={loading || !input.trim()}
              className="btn-pop bg-primary p-3 text-primary-foreground disabled:opacity-50"
              aria-label={t("aiSend")}
            >
              <Send className="h-4 w-4" />
            </button>
          </form>
        </div>
      )}
    </AssistantContext.Provider>
  );
}
