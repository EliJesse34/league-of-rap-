import { useQuery } from "@tanstack/react-query";
import { TrendingUp, TrendingDown, Minus, Music2, ExternalLink } from "lucide-react";

type Track = {
  name: string;
  artist: string;
  image: string;
  rank: number;
  last_week_rank: number | null;
  peak_rank: number;
  weeks_on_chart: number;
};

type BillboardResponse = { date: string; data: Track[] };

async function fetchChart(): Promise<BillboardResponse> {
  const res = await fetch(
    "https://raw.githubusercontent.com/KoreanThinker/billboard-json/main/hot-rap-tracks/recent.json",
    { cache: "no-store" },
  );
  if (!res.ok) throw new Error("Chart unavailable");
  return res.json();
}

function Movement({ rank, last }: { rank: number; last: number | null }) {
  if (last === null || last === 0) {
    return <span className="inline-flex items-center gap-0.5 text-[10px] font-bold text-amber-400">NEW</span>;
  }
  const diff = last - rank;
  if (diff > 0) return <span className="inline-flex items-center gap-0.5 text-[11px] font-bold text-emerald-400"><TrendingUp className="h-3 w-3" />{diff}</span>;
  if (diff < 0) return <span className="inline-flex items-center gap-0.5 text-[11px] font-bold text-red-400"><TrendingDown className="h-3 w-3" />{Math.abs(diff)}</span>;
  return <span className="inline-flex items-center gap-0.5 text-[11px] font-bold text-muted-foreground"><Minus className="h-3 w-3" /></span>;
}

export function BillboardChart() {
  const { data, isLoading, isError } = useQuery({
    queryKey: ["billboard-rap"],
    queryFn: fetchChart,
    staleTime: 1000 * 60 * 60, // 1h
    refetchInterval: 1000 * 60 * 60 * 6, // 6h
  });

  const tracks = data?.data.slice(0, 10) ?? [];

  return (
    <section className="lor-card p-4 md:p-5">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h2 className="lor-section-label flex items-center gap-2 text-base">
            <Music2 className="h-4 w-4" /> BILLBOARD — HOT RAP TRACKS
          </h2>
          {data?.date && (
            <p className="mt-0.5 text-[11px] text-muted-foreground">
              Live • Week of {new Date(data.date).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}
            </p>
          )}
        </div>
        <a
          href="https://www.billboard.com/charts/rap-song/"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1 text-xs font-bold uppercase tracking-wider text-primary hover:underline"
        >
          Full Chart <ExternalLink className="h-3 w-3" />
        </a>
      </div>

      {isLoading && <p className="py-6 text-center text-sm text-muted-foreground">Loading chart…</p>}
      {isError && <p className="py-6 text-center text-sm text-muted-foreground">Chart unavailable right now.</p>}

      {!!tracks.length && (
        <ol className="divide-y divide-border">
          {tracks.map((t) => (
            <li key={t.rank} className="flex items-center gap-3 py-2.5">
              <span className={`lor-display w-8 shrink-0 text-center text-2xl leading-none ${t.rank <= 3 ? "text-primary" : "text-foreground"}`}>
                {t.rank}
              </span>
              {t.image ? (
                <img src={t.image} alt={t.name} loading="lazy" className="h-12 w-12 shrink-0 rounded-sm object-cover" />
              ) : (
                <div className="grid h-12 w-12 shrink-0 place-items-center rounded-sm bg-gradient-to-br from-primary/30 to-background">
                  <Music2 className="h-5 w-5 text-foreground/60" />
                </div>
              )}
              <div className="min-w-0 flex-1">
                <p className="lor-display line-clamp-1 text-[14px] leading-tight">{t.name}</p>
                <p className="line-clamp-1 text-xs text-muted-foreground">{t.artist}</p>
              </div>
              <div className="flex flex-col items-end gap-0.5 text-right">
                <Movement rank={t.rank} last={t.last_week_rank} />
                <span className="text-[10px] text-muted-foreground">{t.weeks_on_chart}w</span>
              </div>
            </li>
          ))}
        </ol>
      )}
    </section>
  );
}
