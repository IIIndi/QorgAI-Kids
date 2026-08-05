import { useEffect, useState } from "react";
import qorgauImg from "@/assets/qorgau.png";
import { cn } from "@/lib/utils";

type Mood = "idle" | "wave" | "jump";

export function Qorgau({
  size = 140,
  mood = "idle",
  className,
}: {
  size?: number;
  mood?: Mood;
  className?: string;
}) {
  const [key, setKey] = useState(0);
  useEffect(() => setKey((k) => k + 1), [mood]);

  return (
    <div className={cn("relative shrink-0 select-none", className)} style={{ width: size }}>
      <img
        key={key}
        src={qorgauImg}
        alt="Qorgau"
        width={1024}
        height={1024}
        className={cn(
          "w-full drop-shadow-[0_10px_18px_rgba(0,0,0,0.12)]",
          mood === "idle" && "animate-float",
          mood === "wave" && "animate-wave",
          mood === "jump" && "animate-jump",
        )}
      />
      <span className="animate-blink-eyes pointer-events-none absolute left-[27%] top-[27%] h-[7%] w-[46%] rounded-full bg-transparent" />
    </div>
  );
}

export function QorgauSays({
  text,
  size = 120,
  mood = "idle",
  tone = "green",
}: {
  text: string;
  size?: number;
  mood?: Mood;
  tone?: "green" | "yellow";
}) {
  return (
    <div className="flex items-center gap-3">
      <Qorgau size={size} mood={mood} />
      <div
        className={cn(
          "animate-slide-up relative rounded-3xl border-2 px-4 py-3 text-sm font-bold leading-snug sm:text-base",
          tone === "green"
            ? "border-primary/30 bg-secondary text-secondary-foreground"
            : "border-sun/50 bg-accent text-accent-foreground",
        )}
      >
        {text}
      </div>
    </div>
  );
}
