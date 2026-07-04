import { Link } from "@tanstack/react-router";
import { ytThumb, formatViews, timeAgo } from "@/lib/youtube";
import { Verified } from "./Verified";

export type VideoRow = {
  id: string;
  youtube_id: string;
  title: string;
  creator: string;
  duration: string | null;
  views_count: number;
  created_at: string;
  is_short?: boolean;
  is_featured?: boolean;
  cover_url?: string;
  category?: string;
};

export function VideoCard({ v }: { v: VideoRow }) {
  return (
    <Link to="/watch/$id" params={{ id: v.id }} className="group block">
      <div className="lor-thumb relative aspect-video">
        <img
          src={v.cover_url ?? ytThumb(v.youtube_id)}
          alt={v.title}
          loading="lazy"
          className="h-full w-full object-cover"
        />
        {v.duration && (
          <span className="absolute bottom-1.5 right-1.5 rounded-sm bg-background/85 px-1.5 py-0.5 text-[11px] font-semibold">
            {v.duration}
          </span>
        )}
      </div>
      <h3 className="lor-display mt-2.5 line-clamp-2 text-[13px] leading-tight">{v.title}</h3>
      <div className="mt-1 flex items-center gap-1 text-xs text-foreground">
        {v.creator} <Verified className="h-3 w-3" />
      </div>
      <div className="text-[11px] text-muted-foreground">
        {formatViews(v.views_count)} • {timeAgo(v.created_at)}
      </div>
    </Link>
  );
}
