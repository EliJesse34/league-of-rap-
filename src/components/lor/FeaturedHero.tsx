import { Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { Play, MoreVertical } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { ytThumb, formatViews, timeAgo } from "@/lib/youtube";
import { Verified } from "./Verified";
import type { VideoRow } from "./VideoCard";

async function fetchHero() {
  const { data: featured } = await supabase
    .from("videos")
    .select("*")
    .eq("is_short", false)
    .eq("is_featured", true)
    .limit(1)
    .maybeSingle();
  const { data: trending } = await supabase
    .from("videos")
    .select("*")
    .eq("is_short", false)
    .order("views_count", { ascending: false })
    .limit(5);
  return {
    featured: featured as VideoRow | null,
    trending: ((trending ?? []) as VideoRow[]).filter((v) => v.id !== featured?.id).slice(0, 4),
  };
}

export function FeaturedHero() {
  const { data } = useQuery({ queryKey: ["hero"], queryFn: fetchHero });
  const featured = data?.featured;
  const trending = data?.trending ?? [];

  return (
    <div className="grid w-full min-w-0 grid-cols-1 gap-5 lg:grid-cols-[minmax(0,1.45fr)_1fr]">
      {featured && (
        <Link to="/watch/$id" params={{ id: featured.id }} className="lor-card overflow-hidden block">
          <div className="lor-thumb relative aspect-video">
            <img
              src={ytThumb(featured.youtube_id, "max")}
              alt={featured.title}
              className="h-full w-full object-cover"
            />
            <span className="lor-display absolute left-3 top-3 rounded-sm bg-primary px-2.5 py-1 text-[11px] tracking-wider text-primary-foreground">
              FEATURED
            </span>
            <span className="absolute inset-0 grid place-items-center">
              <span className="grid h-16 w-16 place-items-center rounded-full bg-background/70 ring-1 ring-foreground/20 backdrop-blur transition group-hover:scale-105">
                <Play className="ml-0.5 h-6 w-6 fill-foreground text-foreground" />
              </span>
            </span>
            {featured.duration && (
              <span className="absolute bottom-3 right-3 rounded-sm bg-background/85 px-2 py-0.5 text-xs font-semibold text-foreground">
                {featured.duration}
              </span>
            )}
          </div>
          <div className="p-4 md:p-5">
            <h2 className="lor-display text-lg leading-tight md:text-xl">{featured.title}</h2>
            <div className="mt-2 flex items-center gap-1.5 text-sm text-foreground">
              {featured.creator} <Verified />
            </div>
            <div className="mt-1 text-xs text-muted-foreground">
              {formatViews(featured.views_count)} • {timeAgo(featured.created_at)}
            </div>
          </div>
        </Link>
      )}

      <div className="space-y-3 min-w-0">
        {trending.map((v) => (
          <Link
            to="/watch/$id"
            params={{ id: v.id }}
            key={v.id}
            className="group flex gap-3 rounded-md border border-transparent p-2 transition-colors hover:border-primary hover:bg-card"
          >
            <div className="lor-thumb relative h-[88px] w-[156px] shrink-0 md:h-[92px] md:w-[164px]">
              <img src={ytThumb(v.youtube_id)} alt={v.title} loading="lazy" className="h-full w-full object-cover" />
              {v.duration && (
                <span className="absolute bottom-1.5 right-1.5 rounded-sm bg-background/85 px-1.5 py-0.5 text-[10px] font-semibold">
                  {v.duration}
                </span>
              )}
            </div>
            <div className="flex min-w-0 flex-1 flex-col">
              <h3 className="lor-display line-clamp-2 text-[13px] leading-snug">{v.title}</h3>
              <div className="mt-1 flex items-center gap-1 text-xs text-muted-foreground">
                {v.creator} <Verified className="h-3 w-3" />
              </div>
              <div className="mt-auto pt-1 text-[11px] text-muted-foreground">
                {formatViews(v.views_count)} • {timeAgo(v.created_at)}
              </div>
            </div>
            <MoreVertical className="h-4 w-4 self-start text-muted-foreground" />
          </Link>
        ))}
      </div>
    </div>
  );
}
