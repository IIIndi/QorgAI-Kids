import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

const Input = z.object({
  messages: z.array(z.object({ role: z.enum(["user", "assistant"]), content: z.string().min(1).max(4000) })).min(1),
  lang: z.enum(["ru", "kk", "en"]).default("ru"),
  age: z.enum(["8-9", "10-11"]).default("8-9"),
  name: z.string().max(40).optional(),
});

const langName = { ru: "русском", kk: "казахском (қазақша)", en: "английском (English)" } as const;

function systemPrompt(lang: "ru" | "kk" | "en", age: string, name?: string) {
  return [
    `Ты — QorgAI, добрый белый котёнок-супергерой Qorgau в жёлтом плаще с зелёным щитом.`,
    `Ты помогаешь ребёнку ${name ? `по имени ${name} ` : ""}возраста ${age} лет учиться безопасности в интернете и в жизни.`,
    `Отвечай ТОЛЬКО на ${langName[lang]} языке.`,
    `Правила: очень простые короткие предложения, дружелюбно, тепло, с 1–3 эмодзи, без страшилок и без взрослой лексики.`,
    `Максимум 120 слов. Хвали ребёнка. Всегда заканчивай понятным советом, что делать.`,
    `Если ребёнок присылает подозрительное сообщение или ссылку — разбери признаки обмана по пунктам и скажи, безопасно это или нет.`,
    `Если вопрос не про безопасность, мягко верни разговор к безопасности.`,
    `Всегда напоминай при опасности: расскажи взрослому, которому доверяешь.`,
  ].join(" ");
}

export const askQorgai = createServerFn({ method: "POST" })
  .inputValidator((data: unknown) => Input.parse(data))
  .handler(async ({ data }) => {
    const key = process.env["LOVABLE_API_KEY"];
    if (!key) return { text: "", error: "no_key" as const };

    const res = await fetch("https://ai.gateway.lovable.dev/v1/responses", {
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
        instructions: systemPrompt(data.lang, data.age, data.name),
        input: data.messages.map((m) => ({
          role: m.role,
          content: [{ type: m.role === "assistant" ? "output_text" : "input_text", text: m.content }],
        })),
      }),
    });

    if (!res.ok || !res.body) {
      if (res.status === 429) return { text: "", error: "rate_limited" as const };
      if (res.status === 402) return { text: "", error: "no_credits" as const };
      return { text: "", error: "failed" as const };
    }

    const reader = res.body.getReader();
    const decoder = new TextDecoder();
    let buffer = "";
    let text = "";
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
        try {
          const evt = JSON.parse(payload) as { type?: string; delta?: string; response?: { output_text?: string } };
          if (evt.type === "response.output_text.delta" && typeof evt.delta === "string") text += evt.delta;
          if (!text && evt.type === "response.completed" && evt.response?.output_text) {
            text = evt.response.output_text;
          }
        } catch {
          /* ignore keepalives */
        }
      }
    }

    return { text: text.trim(), error: null };
  });
