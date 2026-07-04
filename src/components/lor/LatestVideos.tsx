import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { VideoCard, type VideoRow } from "./VideoCard";

async function fetchLatest() {
  const { data } = await supabase
    .from("videos")
    .select("*")
    .eq("is_short", false)
    .order("created_at", { ascending: false })
    .limit(8);
  return (data ?? []) as VideoRow[];
}

export function LatestVideos() {
  const { data: videos = [] } = useQuery({ queryKey: ["latest"], queryFn: fetchLatest });
  return (
    <section className="lor-card p-4 md:p-5">
      <div className="mb-5 flex items-center justify-between">
        <h2 className="lor-section-label text-base">LATEST VIDEOS</h2>
        <button className="rounded-md border border-border-strong px-3 py-1.5 text-xs font-bold uppercase tracking-wider text-foreground hover:border-primary hover:text-primary">
          View All
        </button>
      </div>
      <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
        {videos.map((v) => (
          <VideoCard key={v.id} v={v} />
        ))}
      </div>
    </section>
  );
}
