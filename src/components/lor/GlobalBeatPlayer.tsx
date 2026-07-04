import { Play, Pause, X, Volume2 } from "lucide-react";
import { useBeatPlayer } from "@/hooks/use-beat-player";
import { Waveform } from "./Waveform";

export function GlobalBeatPlayer() {
  const { current, isPlaying, toggle, stop, progress, seek } = useBeatPlayer();
  if (!current) return null;
  return (
    <div className="fixed bottom-16 left-0 right-0 z-40 border-t border-border bg-background/95 backdrop-blur md:bottom-0">
      <div className="mx-auto flex max-w-[1440px] items-center gap-3 px-4 py-2 md:px-6">
        {current.coverUrl ? (
          <img src={current.coverUrl} alt="" className="h-12 w-12 rounded-md object-cover" />
        ) : (
          <div className="grid h-12 w-12 place-items-center rounded-md bg-primary/20 text-xs font-black">
            {current.title.slice(0, 2).toUpperCase()}
          </div>
        )}
        <div className="hidden min-w-0 flex-shrink md:block">
          <p className="truncate text-sm font-bold text-foreground">{current.title}</p>
          <p className="truncate text-xs text-muted-foreground">{current.producer}</p>
        </div>
        <button
          onClick={toggle}
          aria-label={isPlaying ? "Pause" : "Play"}
          className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-primary text-primary-foreground hover:opacity-90"
        >
          {isPlaying ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5 translate-x-0.5" />}
        </button>
        <div className="flex-1">
          <Waveform seed={current.id} progress={progress} onSeek={seek} bars={64} className="h-8" />
        </div>
        <Volume2 className="hidden h-4 w-4 text-muted-foreground sm:block" />
        <button onClick={stop} aria-label="Close player" className="grid h-9 w-9 place-items-center rounded-md text-muted-foreground hover:bg-card hover:text-foreground">
          <X className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
