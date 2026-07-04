import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { ListMusic } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/use-auth";
import { Header } from "@/components/lor/Header";
import { SecondaryNav } from "@/components/lor/SecondaryNav";
import { Footer } from "@/components/lor/Footer";
import { MobileBottomNav } from "@/components/lor/MobileBottomNav";
import { VideoCard, type VideoRow } from "@/components/lor/VideoCard";
import { BeatCard, type BeatCardData } from "@/components/lor/BeatCard";
import { ytThumb, formatViews, timeAgo } from "@/lib/youtube";

export const Route = createFileRoute("/playlists/$id")({
  component: PlaylistPage,
});

type PlaylistItem = {
  id: string;
  item_type: string;
  added_at: string;
  videos?: VideoRow | null;
  beats?: Omit<BeatCardData, "producer"> | null;
};

type PlaylistDetail = {
  id: string;
  user_id: string;
  name: string;
  description: string | null;
  is_public: boolean;
  cover_url: string | null;
  created_at: string;
  updated_at: string;
  playlist_items: PlaylistItem[];
};

function PlaylistPage() {
  const { id } = Route.useParams();
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  const { data: playlist, isLoading, error } = useQuery({
    queryKey: ["playlist", id, user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("playlists")
        .select(
          `id,user_id,name,description,is_public,cover_url,created_at,updated_at,playlist_items(item_type,added_at,video_id,beat_id,videos(id,youtube_id,title,creator,duration,views_count,created_at),beats(id,title,cover_url,preview_url,bpm,music_key,genre,mood,base_price,plays_count,likes_count,producer_id,created_at)))`,
        )
        .eq("id", id)
        .maybeSingle();
      if (error) throw error;
      return data as PlaylistDetail | null;
    },
    enabled: !!id,
  });

  const videoItems = useMemo(
    () => playlist?.playlist_items.filter((item) => item.item_type === "video" && item.videos) ?? [],
    [playlist],
  );

  const beatItems = useMemo(
    () => playlist?.playlist_items.filter((item) => item.item_type === "beat" && item.beats) ?? [],
    [playlist],
  );

  if (loading || isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <SecondaryNav />
        <div className="grid min-h-[40vh] place-items-center text-muted-foreground">Loading playlist…</div>
      </div>
    );
  }

  if (!playlist) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <SecondaryNav />
        <main className="mx-auto max-w-[1440px] px-4 pb-24 pt-10 md:px-6">
          <div className="lor-card p-10 text-center">
            <p className="text-sm text-muted-foreground">Playlist not found or it is private.</p>
            <button
              onClick={() => navigate({ to: "/library" })}
              className="mt-6 rounded-full bg-primary px-5 py-2.5 text-sm font-bold text-primary-foreground hover:opacity-90"
            >
              Back to library
            </button>
          </div>
        </main>
        <Footer />
        <MobileBottomNav />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pb-24">
      <Header />
      <SecondaryNav />
      <main className="mx-auto max-w-[1440px] px-4 pt-6 md:px-6">
        <div className="space-y-6">
          <div className="lor-card overflow-hidden md:flex md:items-end md:justify-between md:gap-6 p-6">
            <div className="flex-1 min-w-0">
              <div className="flex flex-wrap items-center gap-3">
                <div className="grid h-14 w-14 shrink-0 place-items-center rounded-3xl bg-primary text-xl font-black text-primary-foreground">
                  <ListMusic className="h-6 w-6" />
                </div>
                <div className="min-w-0">
                  <p className="text-xs uppercase tracking-widest text-muted-foreground">Playlist</p>
                  <h1 className="lor-display mt-1 text-3xl font-black truncate">{playlist.name}</h1>
                  {playlist.description ? <p className="mt-2 text-sm text-muted-foreground">{playlist.description}</p> : null}
                </div>
              </div>
            </div>
            <div className="grid gap-2 rounded-3xl border border-border bg-card/80 p-4 text-sm">
              <div>
                <div className="text-xs uppercase tracking-widest text-muted-foreground">Items</div>
                <div className="font-semibold">{playlist.playlist_items.length}</div>
              </div>
              <div>
                <div className="text-xs uppercase tracking-widest text-muted-foreground">Visibility</div>
                <div className="font-semibold">{playlist.is_public ? "Public" : "Private"}</div>
              </div>
              <div className="text-xs uppercase tracking-widest text-muted-foreground">Updated</div>
              <div className="font-semibold">{timeAgo(playlist.updated_at)}</div>
            </div>
          </div>

          {playlist.cover_url ? (
            <div className="lor-card overflow-hidden rounded-3xl">
              <img src={playlist.cover_url} alt={playlist.name} className="h-72 w-full object-cover" />
            </div>
          ) : null}

          {playlist.playlist_items.length === 0 ? (
            <div className="lor-card p-10 text-center">
              <p className="text-sm text-muted-foreground">This playlist is empty. Add videos from the watch page or beats from the marketplace.</p>
            </div>
          ) : null}

          {videoItems.length > 0 && (
            <section className="space-y-4">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="text-xs uppercase tracking-widest text-muted-foreground">Videos</p>
                  <h2 className="text-xl font-black">Saved videos</h2>
                </div>
                <span className="text-xs text-muted-foreground">{videoItems.length} video(s)</span>
              </div>
              <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
                {videoItems.map((item) => (
                  <VideoCard key={item.id} v={item.videos!} />
                ))}
              </div>
            </section>
          )}

          {beatItems.length > 0 && (
            <section className="space-y-4">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="text-xs uppercase tracking-widest text-muted-foreground">Beats</p>
                  <h2 className="text-xl font-black">Saved beats</h2>
                </div>
                <span className="text-xs text-muted-foreground">{beatItems.length} beat(s)</span>
              </div>
              <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
                {beatItems.map((item) => (
                  <BeatCard
                    key={item.id}
                    beat={{
                      ...item.beats!,
                      base_price: Number(item.beats!.base_price),
                      producer: null,
                    }}
                    disableLink
                  />
                ))}
              </div>
            </section>
          )}

          {error ? (
            <div className="lor-card rounded-3xl border border-red-500 bg-red-50 p-6 text-sm text-red-700">
              Failed to load playlist details.
            </div>
          ) : null}
        </div>
      </main>
      <Footer />
      <MobileBottomNav />
    </div>
  );
}
