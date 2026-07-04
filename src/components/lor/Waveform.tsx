import { useMemo } from "react";

/** Deterministic fake waveform bars driven by string seed (beat id). */
export function Waveform({
  seed,
  progress = 0,
  bars = 48,
  className = "",
  onSeek,
}: {
  seed: string;
  progress?: number;
  bars?: number;
  className?: string;
  onSeek?: (ratio: number) => void;
}) {
  const heights = useMemo(() => {
    let h = 0;
    for (let i = 0; i < seed.length; i++) h = (h * 31 + seed.charCodeAt(i)) | 0;
    const arr: number[] = [];
    let s = Math.abs(h) || 1;
    for (let i = 0; i < bars; i++) {
      s = (s * 1664525 + 1013904223) >>> 0;
      arr.push(20 + (s % 80));
    }
    return arr;
  }, [seed, bars]);

  return (
    <div
      className={`flex h-12 items-center gap-[2px] ${onSeek ? "cursor-pointer" : ""} ${className}`}
      onClick={(e) => {
        if (!onSeek) return;
        const rect = (e.currentTarget as HTMLDivElement).getBoundingClientRect();
        onSeek((e.clientX - rect.left) / rect.width);
      }}
    >
      {heights.map((h, i) => {
        const active = i / bars <= progress;
        return (
          <div
            key={i}
            className="flex-1 rounded-full transition-colors"
            style={{
              height: `${h}%`,
              background: active ? "hsl(var(--primary))" : "hsl(var(--muted-foreground) / 0.35)",
            }}
          />
        );
      })}
    </div>
  );
}
