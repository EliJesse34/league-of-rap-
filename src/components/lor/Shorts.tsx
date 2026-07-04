import { Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { Play } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { ytThumb, formatViews } from "@/lib/youtube";
import type { VideoRow } from "./VideoCard";

async function fetchShorts() {
  const { data } = await supabase
    .from("videos")
    .select("*")
    .eq("is_short", true)
    .order("created_at", { ascending: false })
    .limit(12);
  return (data ?? []) as VideoRow[];
}

export function Shorts() {
  const { data: shorts = [] } = useQuery({ queryKey: ["shorts"], queryFn: fetchShorts });
  if (!shorts.length) return null;
  return (
    <section className="lor-card p-4 md:p-5">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="lor-section-label flex items-center gap-2 text-base">
          <span className="grid h-6 w-6 place-items-center rounded-sm bg-primary text-primary-foreground">
            <Play className="h-3 w-3 fill-current" />
          </span>
          SHORTS
        </h2>
        <button className="rounded-md border border-border-strong px-3 py-1.5 text-xs font-bold uppercase tracking-wider text-foreground hover:border-primary hover:text-primary">
          View All
        </button>
      </div>
      <div className="lor-scroll flex gap-3 overflow-x-auto pb-2">
        {shorts.map((v) => (
          <Link
            key={v.id}
            to="/watch/$id"
            params={{ id: v.id }}
            className="group relative aspect-[9/16] w-[160px] shrink-0 overflow-hidden rounded-md md:w-[180px]"
          >
            <img src={ytThumb(v.youtube_id)} alt={v.title} className="h-full w-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-background via-background/30 to-transparent" />
            <div className="absolute inset-x-2 bottom-2">
              <p className="lor-display line-clamp-2 text-[12px] leading-tight text-foreground">{v.title}</p>
              <p className="mt-1 text-[10px] text-muted-foreground">{formatViews(v.views_count)}</p>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
