import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { z } from "zod";
import { Header } from "@/components/lor/Header";
import { SecondaryNav } from "@/components/lor/SecondaryNav";
import { Footer } from "@/components/lor/Footer";
import { MobileBottomNav } from "@/components/lor/MobileBottomNav";
import { VideoCard, type VideoRow } from "@/components/lor/VideoCard";
import { BeatCard, type BeatCardData } from "@/components/lor/BeatCard";
import { supabase } from "@/integrations/supabase/client";
import { Search as SearchIcon } from "lucide-react";

const searchSchema = z.object({ q: z.string().optional() });

export const Route = createFileRoute("/search")({
  validateSearch: searchSchema,
  component: SearchPage,
});

type SearchResults = {
  videos: VideoRow[];
  beats: BeatCardData[];
};

function SearchPage() {
  const { q } = Route.useSearch();
  const query = q?.trim() ?? "";

  const { data, isLoading } = useQuery({
    queryKey: ["search", query],
    queryFn: async () => {
      if (!query) return { videos: [], beats: [] };

      const term = `%${query}%`;
      const [{ data: videoData }, { data: beatData }] = await Promise.all([
        supabase
          .from("videos")
          .select("*")
          .or(`title.ilike.${term},creator.ilike.${term},category.ilike.${term}`)
          .order("views_count", { ascending: false })
          .limit(60),
        supabase
          .from("beats")
          .select("id, title, cover_url, preview_url, bpm, music_key, genre, mood, base_price, plays_count, likes_count, producer_id, created_at")
          .or(`title.ilike.${term},description.ilike.${term},genre.ilike.${term},mood.ilike.${term}`)
          .order("plays_count", { ascending: false })
          .limit(60),
      ]);

      return {
        videos: (videoData ?? []) as VideoRow[],
        beats: (beatData ?? []).map((beat) => ({
          ...beat,
          base_price: Number(beat.base_price),
          producer: null,
        })) as BeatCardData[],
      };
    },
    enabled: query.length > 0,
  });

  const results = data ?? { videos: [], beats: [] };
  const hasResults = results.videos.length > 0 || results.beats.length > 0;

  const headline = useMemo(() => {
    if (!query) return "Search the League";
    if (isLoading) return `Searching for “${query}”…`;
    if (hasResults) return `${results.videos.length + results.beats.length} results for “${query}”`;
    return `No matches found for “${query}”`;
  }, [query, isLoading, hasResults, results.beats.length, results.videos.length]);

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <SecondaryNav />
      <main className="mx-auto max-w-[1440px] px-4 pb-24 pt-6 md:px-6">
        <div className="space-y-6">
          <div className="lor-card p-6">
            <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
              <div>
                <p className="text-xs uppercase tracking-widest text-muted-foreground">Search</p>
                <h1 className="lor-display mt-2 text-3xl md:text-4xl">{headline}</h1>
              </div>
              <div className="relative w-full max-w-xl md:w-[560px]">
                <SearchIcon className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <input
                  type="search"
                  value={query}
                  readOnly
                  placeholder="Search videos, artists, playlists, and beats"
                  className="h-12 w-full rounded-full border border-border bg-card pl-11 pr-4 text-sm text-foreground"
                />
              </div>
            </div>

            {!query && (
              <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {[
                  "Drake",
                  "Battle Rap",
                  "Studio Sessions",
                  "Nicki Minaj",
                  "New Releases",
                  "Trap Beats",
                ].map((term) => (
                  <Link
                    key={term}
                    to="/search"
                    search={{ q: term }}
                    className="rounded-2xl border border-border bg-card/80 px-4 py-3 text-sm font-semibold text-foreground transition hover:border-primary"
                  >
                    {term}
                  </Link>
                ))}
              </div>
            )}
          </div>

          {query ? (
            <div className="space-y-6">
              {!hasResults && !isLoading ? (
                <div className="lor-card p-8 text-center text-sm text-muted-foreground">
                  Try searching for artist names, song titles, categories, or beat descriptions.
                </div>
              ) : null}

              {results.videos.length > 0 && (
                <section className="space-y-4">
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <p className="text-xs uppercase tracking-widest text-muted-foreground">Videos</p>
                      <h2 className="text-xl font-black">Video results</h2>
                    </div>
                    <span className="text-xs text-muted-foreground">{results.videos.length} videos</span>
                  </div>
                  <div className="grid grid-cols-2 gap-4 md:grid-cols-3 xl:grid-cols-4">
                    {results.videos.map((video) => (
                      <VideoCard key={video.id} v={video} />
                    ))}
                  </div>
                </section>
              )}

              {results.beats.length > 0 && (
                <section className="space-y-4">
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <p className="text-xs uppercase tracking-widest text-muted-foreground">Beats</p>
                      <h2 className="text-xl font-black">Beat matches</h2>
                    </div>
                    <span className="text-xs text-muted-foreground">{results.beats.length} beats</span>
                  </div>
                  <div className="grid grid-cols-2 gap-4 md:grid-cols-3 xl:grid-cols-4">
                    {results.beats.map((beat) => (
                      <BeatCard key={beat.id} beat={beat} disableLink />
                    ))}
                  </div>
                </section>
              )}
            </div>
          ) : null}
        </div>
      </main>
      <Footer />
      <MobileBottomNav />
    </div>
  );
}
