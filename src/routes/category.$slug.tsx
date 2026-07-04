import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Header } from "@/components/lor/Header";
import { SecondaryNav } from "@/components/lor/SecondaryNav";
import { Footer } from "@/components/lor/Footer";
import { MobileBottomNav } from "@/components/lor/MobileBottomNav";
import { VideoCard, type VideoRow } from "@/components/lor/VideoCard";
import { AdSense } from "@/components/lor/AdSense";
import { getDemoVideosForCategory } from "@/lib/demo-videos";

export const Route = createFileRoute("/category/$slug")({
  component: CategoryPage,
});

const LABELS: Record<string, string> = {
  music: "Music Videos",
  freestyles: "Freestyles",
  interviews: "Interviews",
  bts: "Behind The Scenes",
  vlogs: "Vlogs",
  battle: "Battle Rap",
  live: "Live Performances",
  trending: "Trending",
  shorts: "Shorts",
};

function CategoryPage() {
  const { slug } = Route.useParams();
  const label = LABELS[slug] ?? slug.replace(/-/g, " ");

  const { data: videos = [], isLoading } = useQuery({
    queryKey: ["category", slug],
    queryFn: async () => {
      let q = supabase.from("videos").select("*").order("created_at", { ascending: false }).limit(100);
      if (slug === "shorts") {
        q = q.eq("is_short", true);
      } else if (slug === "trending") {
        q = q.order("views_count", { ascending: false });
      } else if (slug === "music") {
        q = q.in("category", ["music", "hiphop"]);
      } else {
        q = q.eq("category", slug);
      }
      const { data } = await q;
      const dbVideos = (data ?? []) as VideoRow[];
      if (dbVideos.length >= 50) return dbVideos;
      const fallback = getDemoVideosForCategory(slug, 50);
      return [...dbVideos, ...fallback].slice(0, Math.max(50, dbVideos.length));
    },
  });

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <SecondaryNav />
      <main className="mx-auto max-w-[1440px] px-4 pb-24 pt-6 md:px-6 md:pb-10">
        <div className="mb-5 flex items-end justify-between">
          <div>
            <p className="text-xs uppercase tracking-wider text-muted-foreground">Category</p>
            <h1 className="lor-display text-3xl uppercase">{label}</h1>
          </div>
          <Link to="/" className="text-xs font-semibold uppercase tracking-wider text-primary hover:underline">
            ← Back home
          </Link>
        </div>
        <AdSense className="lor-card mb-6 p-4" />
        {isLoading ? (
          <p className="text-sm text-muted-foreground">Loading…</p>
        ) : videos.length === 0 ? (
          <div className="lor-card p-10 text-center">
            <p className="text-sm text-muted-foreground">No videos in this category yet.</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
            {videos.map((v) => (
              <VideoCard key={v.id} v={v} />
            ))}
          </div>
        )}
      </main>
      <Footer />
      <MobileBottomNav />
    </div>
  );
}
