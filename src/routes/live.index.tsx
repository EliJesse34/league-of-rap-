import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { Radio, Video } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Header } from "@/components/lor/Header";
import { SecondaryNav } from "@/components/lor/SecondaryNav";
import { Footer } from "@/components/lor/Footer";
import { MobileBottomNav } from "@/components/lor/MobileBottomNav";
import { ytThumb } from "@/lib/youtube";

export const Route = createFileRoute("/live/")({
  component: LiveIndex,
});

type Stream = {
  id: string;
  title: string;
  category: string;
  youtube_id: string | null;
  thumbnail_url: string | null;
  viewer_count: number;
  is_live: boolean;
  started_at: string;
  host_id: string;
};

function LiveIndex() {
  const { data: streams = [], isLoading } = useQuery({
    queryKey: ["live-streams"],
    queryFn: async () => {
      const { data } = await supabase
        .from("livestreams")
        .select("*")
        .eq("is_live", true)
        .order("started_at", { ascending: false });
      return (data ?? []) as Stream[];
    },
    refetchInterval: 15000,
  });

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <SecondaryNav />
      <main className="mx-auto max-w-[1440px] px-4 pb-24 pt-6 md:px-6 md:pb-10">
        <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
          <div>
            <p className="flex items-center gap-2 text-xs uppercase tracking-wider text-primary">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-75" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-primary" />
              </span>
              On Air
            </p>
            <h1 className="lor-display text-3xl uppercase">Live Now</h1>
          </div>
          <Link
            to="/go-live"
            className="inline-flex items-center gap-2 rounded-md bg-primary px-4 py-2.5 text-sm font-bold uppercase tracking-wider text-primary-foreground hover:opacity-90"
          >
            <Video className="h-4 w-4" /> Go Live
          </Link>
        </div>

        {isLoading ? (
          <p className="text-sm text-muted-foreground">Loading streams…</p>
        ) : streams.length === 0 ? (
          <div className="lor-card p-10 text-center">
            <Radio className="mx-auto mb-3 h-8 w-8 text-muted-foreground" />
            <p className="text-sm text-muted-foreground">No one is live right now. Be the first.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {streams.map((s) => (
              <Link
                key={s.id}
                to="/live/$id"
                params={{ id: s.id }}
                className="lor-card group overflow-hidden"
              >
                <div className="lor-thumb relative aspect-video">
                  {s.youtube_id ? (
                    <img src={ytThumb(s.youtube_id)} alt={s.title} className="h-full w-full object-cover" />
                  ) : (
                    <div className="grid h-full w-full place-items-center bg-gradient-to-br from-primary/30 to-background">
                      <Radio className="h-10 w-10 text-foreground/60" />
                    </div>
                  )}
                  <span className="absolute left-2 top-2 rounded-sm bg-primary px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-primary-foreground">
                    ● LIVE
                  </span>
                  <span className="absolute bottom-2 right-2 rounded-sm bg-background/85 px-1.5 py-0.5 text-[11px] font-semibold">
                    {s.viewer_count.toLocaleString()} watching
                  </span>
                </div>
                <div className="p-3">
                  <h3 className="lor-display line-clamp-2 text-sm">{s.title}</h3>
                  <p className="mt-1 text-[11px] uppercase tracking-wider text-muted-foreground">{s.category}</p>
                </div>
              </Link>
            ))}
          </div>
        )}
      </main>
      <Footer />
      <MobileBottomNav />
    </div>
  );
}
