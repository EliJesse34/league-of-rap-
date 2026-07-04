import { Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { getDemoVideosForCategory } from "@/lib/demo-videos";
import { VideoCard, type VideoRow } from "./VideoCard";

const categories = [
  { slug: "freestyles", label: "Freestyles", description: "Fresh bars, raw sessions, and top freestyle bangers." },
  { slug: "battle", label: "Battle Rap", description: "Competitive matchups with heavyweight punchlines." },
  { slug: "live", label: "Live Performances", description: "Stage energy from the biggest shows and festival sets." },
  { slug: "music", label: "Music Videos", description: "Trending hip-hop visuals and official music premieres." },
] as const;

type CategoryResult = {
  slug: string;
  label: string;
  description: string;
  videos: VideoRow[];
};

async function fetchFeaturedCategoryVideos() {
  const slugs = categories.map((category) => category.slug);
  const { data } = await supabase
    .from("videos")
    .select("*")
    .in("category", slugs)
    .order("created_at", { ascending: false })
    .limit(24);

  const rows = (data ?? []) as VideoRow[];

  return categories.map((category) => {
    const matches = rows.filter((video) => video.category === category.slug).slice(0, 4);
    return {
      ...category,
      videos: matches.length > 0 ? matches : getDemoVideosForCategory(category.slug, 4).slice(0, 4),
    };
  });
}

export function FeaturedVideoCategories() {
  const { data: categoryBlocks = [] } = useQuery({ queryKey: ["featured-video-categories"], queryFn: fetchFeaturedCategoryVideos });

  return (
    <section className="lor-card p-4 md:p-5">
      <div className="mb-6 flex items-center justify-between gap-4">
        <div>
          <h2 className="lor-section-label text-base">HOT VIDEO CATEGORIES</h2>
          <p className="text-sm text-muted-foreground">Browse the freshest categories and jump straight into the hottest drops.</p>
        </div>
        <Link to="/category/$slug" params={{ slug: "music" }} className="text-xs font-semibold uppercase tracking-wider text-primary hover:underline">
          Browse all
        </Link>
      </div>

      <div className="grid gap-5 lg:grid-cols-2">
        {categoryBlocks.map((category) => (
          <div key={category.slug} className="rounded-[20px] border border-border bg-card p-4">
            <div className="mb-4 flex items-start justify-between gap-4">
              <div>
                <h3 className="lor-display text-lg">{category.label}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{category.description}</p>
              </div>
              <Link to="/category/$slug" params={{ slug: category.slug }} className="rounded-md border border-border-strong px-3 py-1.5 text-xs font-bold uppercase tracking-wider text-foreground hover:border-primary hover:text-primary">
                View All
              </Link>
            </div>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
              {category.videos.map((video) => (
                <VideoCard key={video.id} v={video} />
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
