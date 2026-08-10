import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

const Input = z.object({
  messages: z.array(z.object({ role: z.enum(["user", "assistant"]), content: z.string().min(1).max(4000) })).min(1),
  lang: z.enum(["ru", "kk", "en"]).default("ru"),
  age: z.enum(["8-9", "10-11", "other"]).default("8-9"),
  name: z.string().max(40).optional(),
});

const langName = { ru: "русском", kk: "казахском (қазақша)", en: "английском (English)" } as const;

function systemPrompt(lang: "ru" | "kk" | "en", age: string, name?: string) {
  return [
    `Ты — QorgAI, добрый белый котёнок-супергерой Qorgau в жёлтом плаще с зелёным щитом.`,
    `Ты помогаешь ребёнку ${name ? `по имени ${name} ` : ""}${age === "other" ? "8–11 лет" : `возраста ${age} лет`} учиться безопасности в интернете и в жизни.`,
    `Отвечай ТОЛЬКО на ${langName[lang]} языке.`,
    `Правила: очень простые короткие предложения, дружелюбно, тепло, с 1–3 эмодзи, без страшилок и без взрослой лексики.`,
    `Максимум 120 слов. Хвали ребёнка. Всегда заканчивай понятным советом, что делать.`,
    `Если ребёнок присылает подозрительное сообщение или ссылку — разбери признаки обмана по пунктам и скажи, безопасно это или нет.`,
    `Если вопрос не про безопасность, мягко верни разговор к безопасности.`,
    `Всегда напоминай при опасности: расскажи взрослому, которому доверяешь.`,
  ].join(" ");
}

type Attempt =
  | { ok: true; text: string }
  | { ok: false; error: "rate_limited" | "no_credits" | "failed"; retryable: boolean };

async function callModel(
  key: string,
  data: z.infer<typeof Input>,
): Promise<Attempt> {
  let res: Response;
  try {
    res = await fetch("https://ai.gateway.lovable.dev/v1/responses", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Lovable-API-Key": key,
        "X-Lovable-AIG-SDK": "fetch",
      },
      body: JSON.stringify({
        model: "openai/gpt-5.6-luna",
        stream: true,
        store: false,
        // Низкий reasoning + лимит вывода: модель не «съедает» бюджет на размышления
        // и всегда успевает вернуть текст ответа ребёнку.
        reasoning: { effort: "low" },
        max_output_tokens: 900,
        instructions: systemPrompt(data.lang, data.age, data.name),
        input: data.messages.map((m) => ({
          role: m.role,
          content: [{ type: m.role === "assistant" ? "output_text" : "input_text", text: m.content }],
        })),
      }),
    });
  } catch (e) {
    console.error("[askQorgai] network error", e);
    return { ok: false, error: "failed", retryable: true };
  }

  if (!res.ok || !res.body) {
    const body = await res.text().catch(() => "");
    console.error("[askQorgai] gateway error", res.status, body.slice(0, 500));
    if (res.status === 429) return { ok: false, error: "rate_limited", retryable: false };
    if (res.status === 402) return { ok: false, error: "no_credits", retryable: false };
    return { ok: false, error: "failed", retryable: res.status >= 500 };
  }

  const reader = res.body.getReader();
  const decoder = new TextDecoder();
  let buffer = "";
  let text = "";
  let failed = false;

  const collectFromResponse = (r: unknown) => {
    const out = (r as { output?: Array<{ type?: string; content?: Array<{ type?: string; text?: string }> }> })?.output;
    if (!Array.isArray(out)) return "";
    return out
      .filter((i) => i.type === "message")
      .flatMap((i) => i.content ?? [])
      .filter((c) => c.type === "output_text" && typeof c.text === "string")
      .map((c) => c.text as string)
      .join("");
  };

  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      buffer += decoder.decode(value, { stream: true });
      const lines = buffer.split("\n");
      buffer = lines.pop() ?? "";
      for (const line of lines) {
        if (!line.startsWith("data:")) continue;
        const payload = line.slice(5).trim();
        if (!payload || payload === "[DONE]") continue;
        let evt: { type?: string; delta?: string; response?: unknown };
        try {
          evt = JSON.parse(payload);
        } catch {
          continue;
        }
        if (evt.type === "response.output_text.delta" && typeof evt.delta === "string") {
          text += evt.delta;
        } else if (evt.type === "response.completed" || evt.type === "response.incomplete") {
          if (!text) text = collectFromResponse(evt.response);
        } else if (evt.type === "response.failed" || evt.type === "error") {
          failed = true;
          console.error("[askQorgai] stream error event", payload.slice(0, 500));
        }
      }
    }
  } catch (e) {
    console.error("[askQorgai] stream read error", e);
    if (!text) return { ok: false, error: "failed", retryable: true };
  }

  const finalText = text.trim();
  if (!finalText) return { ok: false, error: "failed", retryable: !failed ? true : true };
  return { ok: true, text: finalText };
}

export const askQorgai = createServerFn({ method: "POST" })
  .inputValidator((data: unknown) => Input.parse(data))
  .handler(async ({ data }) => {
    const key = process.env["LOVABLE_API_KEY"];
    if (!key) return { text: "", error: "no_key" as const };

    let last: Attempt = { ok: false, error: "failed", retryable: true };
    for (let attempt = 0; attempt < 3; attempt++) {
      if (attempt > 0) await new Promise((r) => setTimeout(r, 600 * attempt));
      last = await callModel(key, data);
      if (last.ok) return { text: last.text, error: null };
      if (!last.retryable) break;
    }
    return { text: "", error: last.ok ? null : last.error };
  });

