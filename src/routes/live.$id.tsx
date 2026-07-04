import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";
import { Radio } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/use-auth";
import { Header } from "@/components/lor/Header";
import { SecondaryNav } from "@/components/lor/SecondaryNav";
import { Footer } from "@/components/lor/Footer";
import { MobileBottomNav } from "@/components/lor/MobileBottomNav";

export const Route = createFileRoute("/live/$id")({
  component: LiveWatch,
});

function LiveWatch() {
  const { id } = Route.useParams();
  const { user } = useAuth();
  const navigate = useNavigate();

  const { data: stream, refetch } = useQuery({
    queryKey: ["live", id],
    queryFn: async () => {
      const { data } = await supabase.from("livestreams").select("*").eq("id", id).maybeSingle();
      return data as null | {
        id: string; title: string; category: string; youtube_id: string | null;
        viewer_count: number; is_live: boolean; host_id: string;
      };
    },
    refetchInterval: 10000,
  });

  useEffect(() => {
    const ch = supabase
      .channel(`live-${id}`)
      .on("postgres_changes", { event: "UPDATE", schema: "public", table: "livestreams", filter: `id=eq.${id}` }, () => refetch())
      .subscribe();
    return () => { supabase.removeChannel(ch); };
  }, [id, refetch]);

  const isHost = user?.id === stream?.host_id;

  async function endStream() {
    if (!stream) return;
    await supabase.from("livestreams").update({ is_live: false, ended_at: new Date().toISOString() }).eq("id", stream.id);
    navigate({ to: "/live" });
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <SecondaryNav />
      <main className="mx-auto w-full max-w-[1440px] px-4 pb-24 pt-6 md:px-6 md:pb-10">
        {!stream ? (
          <p className="text-sm text-muted-foreground">Loading stream…</p>
        ) : (
          <div className="grid w-full min-w-0 grid-cols-1 gap-6 lg:grid-cols-[minmax(0,1fr)_320px]">
            <div className="min-w-0">
              <div className="lor-thumb relative aspect-video overflow-hidden bg-black">
                {stream.youtube_id ? (
                  <iframe
                    title={stream.title}
                    src={`https://www.youtube.com/embed/${stream.youtube_id}?autoplay=1`}
                    allow="autoplay; encrypted-media; picture-in-picture"
                    allowFullScreen
                    className="h-full w-full"
                  />
                ) : (
                  <div className="grid h-full w-full place-items-center text-muted-foreground">
                    <div className="text-center">
                      <Radio className="mx-auto mb-3 h-10 w-10" />
                      <p>Stream is preparing…</p>
                    </div>
                  </div>
                )}
                {stream.is_live && (
                  <span className="absolute left-3 top-3 rounded-sm bg-primary px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-primary-foreground">
                    ● LIVE
                  </span>
                )}
              </div>
              <div className="mt-4 flex items-start justify-between gap-4">
                <div>
                  <h1 className="lor-display text-2xl uppercase">{stream.title}</h1>
                  <p className="mt-1 text-xs uppercase tracking-wider text-muted-foreground">
                    {stream.category} • {stream.viewer_count.toLocaleString()} watching
                  </p>
                </div>
                {isHost && stream.is_live && (
                  <button
                    onClick={endStream}
                    className="rounded-md border border-primary px-3 py-2 text-xs font-bold uppercase tracking-wider text-primary hover:bg-primary hover:text-primary-foreground"
                  >
                    End Stream
                  </button>
                )}
              </div>
            </div>
            <aside className="lor-card p-4">
              <h3 className="lor-section-label text-sm">More Live</h3>
              <p className="mt-3 text-xs text-muted-foreground">
                Discover more rooms or start your own.
              </p>
              <Link
                to="/live"
                className="mt-3 block w-full rounded-md border border-border-strong px-3 py-2 text-center text-xs font-bold uppercase tracking-wider hover:border-primary hover:text-primary"
              >
                Browse Live
              </Link>
              <Link
                to="/go-live"
                className="mt-2 block w-full rounded-md bg-primary py-2 text-center text-xs font-bold uppercase tracking-wider text-primary-foreground hover:opacity-90"
              >
                Go Live
              </Link>
            </aside>
          </div>
        )}
      </main>
      <Footer />
      <MobileBottomNav />
    </div>
  );
}
