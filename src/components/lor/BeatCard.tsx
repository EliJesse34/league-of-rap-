import { Play, Pause, Heart, ShoppingBag } from "lucide-react";
import { Link } from "@tanstack/react-router";
import { useBeatPlayer } from "@/hooks/use-beat-player";
import { Waveform } from "./Waveform";

export type BeatCardData = {
  id: string;
  title: string;
  cover_url: string | null;
  preview_url: string | null;
  bpm: number | null;
  music_key: string | null;
  genre: string;
  mood: string | null;
  base_price: number;
  plays_count: number;
  likes_count: number;
  producer: { id: string; display_name: string; is_verified: boolean } | null;
};

export function BeatCard({ beat, disableLink, onBuy, onLike, liked }: {
  beat: BeatCardData;
  disableLink?: boolean;
  onBuy?: (id: string) => void;
  onLike?: (id: string) => void;
  liked?: boolean;
}) {
  const { current, isPlaying, play, toggle, progress, seek } = useBeatPlayer();
  const active = current?.id === beat.id;
  const playing = active && isPlaying;

  const handlePlay = () => {
    if (!beat.preview_url) return;
    if (active) toggle();
    else
      play({
        id: beat.id,
        title: beat.title,
        producer: beat.producer?.display_name ?? "Unknown",
        coverUrl: beat.cover_url,
        previewUrl: beat.preview_url,
      });
  };

  return (
    <div className="group overflow-hidden rounded-2xl border border-border bg-card/60 backdrop-blur transition-all hover:border-primary/50 hover:shadow-lg hover:shadow-primary/10">
      <div className="relative aspect-square overflow-hidden">
        {beat.cover_url ? (
          <img src={beat.cover_url} alt={beat.title} className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" />
        ) : (
          <div className="grid h-full w-full place-items-center bg-gradient-to-br from-primary/30 via-card to-background text-3xl font-black text-foreground/40">
            {beat.title.slice(0, 2).toUpperCase()}
          </div>
        )}
        <button
          aria-label={playing ? "Pause" : "Play"}
          onClick={handlePlay}
          className="absolute inset-0 grid place-items-center bg-black/0 transition-colors hover:bg-black/40"
        >
          <span className="grid h-14 w-14 place-items-center rounded-full bg-primary text-primary-foreground shadow-xl opacity-0 transition-opacity group-hover:opacity-100 data-[active=true]:opacity-100" data-active={active}>
            {playing ? <Pause className="h-6 w-6" /> : <Play className="h-6 w-6 translate-x-0.5" />}
          </span>
        </button>
        <div className="absolute right-2 top-2 rounded-full bg-background/80 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-foreground backdrop-blur">
          {beat.genre}
        </div>
      </div>

      <div className="space-y-2 p-3">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
              {disableLink ? (
                <span className="block truncate text-sm font-bold text-foreground">{beat.title}</span>
              ) : (
                <Link to="/beats/$id" params={{ id: beat.id }} className="block truncate text-sm font-bold text-foreground hover:text-primary">
                  {beat.title}
                </Link>
              )}
            <p className="truncate text-xs text-muted-foreground">
              {beat.producer?.display_name ?? "Unknown"}
              {beat.bpm ? ` · ${beat.bpm} BPM` : ""}
              {beat.music_key ? ` · ${beat.music_key}` : ""}
            </p>
          </div>
          <button
            onClick={() => onLike?.(beat.id)}
            aria-label="Like beat"
            className="rounded-full p-1.5 text-muted-foreground hover:bg-muted hover:text-primary"
          >
            <Heart className={`h-4 w-4 ${liked ? "fill-primary text-primary" : ""}`} />
          </button>
        </div>

        <Waveform seed={beat.id} progress={active ? progress : 0} onSeek={active ? seek : undefined} bars={36} />

        <div className="flex items-center justify-between gap-2 pt-1">
          <span className="text-base font-black text-foreground">${beat.base_price.toFixed(2)}</span>
          <div className="flex items-center gap-2">
            <button
              onClick={() => onBuy?.(beat.id)}
              disabled={!onBuy}
              className={`flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-bold uppercase tracking-wider text-primary-foreground ${
                onBuy ? "bg-primary hover:opacity-90" : "bg-muted text-muted-foreground cursor-not-allowed"
              }`}
            >
              <ShoppingBag className="h-3.5 w-3.5" />
              Buy
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
