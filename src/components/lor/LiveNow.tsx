import { Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { Radio, Video } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { ytThumb } from "@/lib/youtube";

type Stream = {
  id: string;
  title: string;
  category: string;
  youtube_id: string | null;
  viewer_count: number;
};

export function LiveNow() {
  const { data: lives = [] } = useQuery({
    queryKey: ["live-now"],
    queryFn: async () => {
      const { data } = await supabase
        .from("livestreams")
        .select("id,title,category,youtube_id,viewer_count")
        .eq("is_live", true)
        .order("started_at", { ascending: false })
        .limit(4);
      return (data ?? []) as Stream[];
    },
    refetchInterval: 20000,
  });

  return (
    <section className="lor-card p-4 md:p-5">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="lor-section-label flex items-center gap-2 text-base">
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-75" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-primary" />
          </span>
          LIVE NOW
        </h2>
        <div className="flex items-center gap-2">
          <Link to="/live" className="text-xs font-semibold uppercase tracking-wider text-muted-foreground hover:text-primary">
            View all
          </Link>
          <Link
            to="/go-live"
            className="inline-flex items-center gap-1.5 rounded-md bg-primary px-2.5 py-1 text-[11px] font-bold uppercase tracking-wider text-primary-foreground hover:opacity-90"
          >
            <Video className="h-3 w-3" /> Go Live
          </Link>
        </div>
      </div>

      {lives.length === 0 ? (
        <div className="rounded-md border border-dashed border-border p-6 text-center">
          <Radio className="mx-auto mb-2 h-6 w-6 text-muted-foreground" />
          <p className="text-xs text-muted-foreground">No live streams right now.</p>
          <Link to="/go-live" className="mt-2 inline-block text-xs font-semibold uppercase tracking-wider text-primary hover:underline">
            Start the first one →
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
          {lives.map((l) => (
            <Link key={l.id} to="/live/$id" params={{ id: l.id }} className="lor-thumb group relative block aspect-video overflow-hidden">
              {l.youtube_id ? (
                <img src={ytThumb(l.youtube_id)} alt={l.title} className="h-full w-full object-cover" />
              ) : (
                <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-primary/30 to-background">
                  <Radio className="h-8 w-8 text-foreground/60 transition-transform group-hover:scale-110" />
                </div>
              )}
              <span className="absolute left-2 top-2 rounded-sm bg-primary px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-primary-foreground">
                ● LIVE
              </span>
              <span className="absolute bottom-2 right-2 rounded-sm bg-background/85 px-1.5 py-0.5 text-[11px] font-semibold">
                {l.viewer_count.toLocaleString()}
              </span>
              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/85 to-transparent p-2.5">
                <p className="lor-display line-clamp-1 text-[12px] text-white">{l.title}</p>
                <p className="text-[10px] uppercase tracking-wider text-white/70">{l.category}</p>
              </div>
            </Link>
          ))}
        </div>
      )}
    </section>
  );
}
