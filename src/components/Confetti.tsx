const COLORS = ["#22c55e", "#facc15", "#ffffff", "#4ade80", "#fde047", "#38bdf8"];

export function Confetti({ count = 60 }: { count?: number }) {
  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 z-50 overflow-hidden">
      {Array.from({ length: count }).map((_, i) => (
        <span
          key={i}
          className="absolute top-0 block"
          style={{
            left: `${(i * 97) % 100}%`,
            width: i % 3 === 0 ? 8 : 12,
            height: i % 3 === 0 ? 14 : 8,
            borderRadius: i % 2 ? 4 : 1,
            background: COLORS[i % COLORS.length],
            animation: `confetti-fall ${2 + ((i % 7) * 0.28)}s linear ${(i % 11) * 0.14}s forwards`,
          }}
        />
      ))}
    </div>
  );
}
