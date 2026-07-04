import type { VideoRow } from "@/components/lor/VideoCard";

const demoBaseVideos: Array<Omit<VideoRow, "id">> = [
  { youtube_id: "xpVfcZ0ZcFM", title: "God's Plan", creator: "Drake", duration: "3:18", views_count: 1500000000, created_at: "2026-01-01T00:00:00Z", is_featured: true },
  { youtube_id: "7UjG9uUcNMo", title: "In My Feelings", creator: "Drake", duration: "3:37", views_count: 1800000000, created_at: "2026-01-01T00:00:00Z", is_featured: false },
  { youtube_id: "6ONRf7h3Mdk", title: "SICKO MODE", creator: "Travis Scott", duration: "5:12", views_count: 1700000000, created_at: "2026-01-01T00:00:00Z", is_featured: false },
  { youtube_id: "WILNQrQ6Ccg", title: "goosebumps", creator: "Travis Scott", duration: "4:03", views_count: 1000000000, created_at: "2026-01-01T00:00:00Z", is_featured: false },
  { youtube_id: "tvTRZJ-4EyI", title: "HUMBLE.", creator: "Kendrick Lamar", duration: "2:57", views_count: 1400000000, created_at: "2026-01-01T00:00:00Z", is_featured: false },
  { youtube_id: "NLZRYQMLDW4", title: "DNA.", creator: "Kendrick Lamar", duration: "3:05", views_count: 1250000000, created_at: "2026-01-01T00:00:00Z", is_featured: false },
  { youtube_id: "Z-48u_uWMHY", title: "Alright", creator: "Kendrick Lamar", duration: "3:40", views_count: 600000000, created_at: "2026-01-01T00:00:00Z", is_featured: false },
  { youtube_id: "J8f6R1C2u8A", title: "Middle Child", creator: "J. Cole", duration: "3:33", views_count: 500000000, created_at: "2026-01-01T00:00:00Z", is_featured: false },
  { youtube_id: "r51XJY2bUZI", title: "No Role Modelz", creator: "J. Cole", duration: "4:53", views_count: 500000000, created_at: "2026-01-01T00:00:00Z", is_featured: false },
  { youtube_id: "4w7raFCTjKE", title: "Wet Dreamz", creator: "J. Cole", duration: "3:37", views_count: 400000000, created_at: "2026-01-01T00:00:00Z", is_featured: false },
  { youtube_id: "uelHwf8o7_U", title: "Love The Way You Lie", creator: "Eminem ft. Rihanna", duration: "4:23", views_count: 2147000000, created_at: "2026-01-01T00:00:00Z", is_featured: false },
  { youtube_id: "xFYQQ_nhK1U", title: "Lose Yourself", creator: "Eminem", duration: "5:26", views_count: 2100000000, created_at: "2026-01-01T00:00:00Z", is_featured: false },
  { youtube_id: "eJO5HU_7_1w", title: "The Real Slim Shady", creator: "Eminem", duration: "4:44", views_count: 1200000000, created_at: "2026-01-01T00:00:00Z", is_featured: false },
  { youtube_id: "gOMhN-hfMtY", title: "Stan", creator: "Eminem ft. Dido", duration: "6:44", views_count: 1500000000, created_at: "2026-01-01T00:00:00Z", is_featured: false },
  { youtube_id: "4kK1F7bo1cs", title: "Bodak Yellow", creator: "Cardi B", duration: "3:44", views_count: 1500000000, created_at: "2026-01-01T00:00:00Z", is_featured: false },
  { youtube_id: "hsm4poTWjMs", title: "WAP", creator: "Cardi B ft. Megan Thee Stallion", duration: "3:07", views_count: 1800000000, created_at: "2026-01-01T00:00:00Z", is_featured: false },
  { youtube_id: "xTlNMmZKwpA", title: "I Like It", creator: "Cardi B ft. Bad Bunny & J Balvin", duration: "4:54", views_count: 1400000000, created_at: "2026-01-01T00:00:00Z", is_featured: false },
  { youtube_id: "4JHf60u-nw0", title: "Super Bass", creator: "Nicki Minaj", duration: "3:20", views_count: 1400000000, created_at: "2026-01-01T00:00:00Z", is_featured: false },
  { youtube_id: "LDZX4ooRsWs", title: "Anaconda", creator: "Nicki Minaj", duration: "4:20", views_count: 1200000000, created_at: "2026-01-01T00:00:00Z", is_featured: false },
  { youtube_id: "UceaB4D0jpo", title: "rockstar", creator: "Post Malone ft. 21 Savage", duration: "3:38", views_count: 2147000000, created_at: "2026-01-01T00:00:00Z", is_featured: false },
  { youtube_id: "SC4xMk98Pdc", title: "Congratulations", creator: "Post Malone ft. Quavo", duration: "3:40", views_count: 1700000000, created_at: "2026-01-01T00:00:00Z", is_featured: false },
  { youtube_id: "0UjsXo9l6I8", title: "Empire State of Mind", creator: "Jay-Z ft. Alicia Keys", duration: "4:37", views_count: 600000000, created_at: "2026-01-01T00:00:00Z", is_featured: false },
  { youtube_id: "Gd9OhYroLN0", title: "N****s In Paris", creator: "Jay-Z & Kanye West", duration: "5:25", views_count: 1400000000, created_at: "2026-01-01T00:00:00Z", is_featured: false },
  { youtube_id: "PsO6ZnUZI0g", title: "Stronger", creator: "Kanye West", duration: "5:12", views_count: 1400000000, created_at: "2026-01-01T00:00:00Z", is_featured: false },
  { youtube_id: "6vwNcNOTVzY", title: "Gold Digger", creator: "Kanye West ft. Jamie Foxx", duration: "4:05", views_count: 1500000000, created_at: "2026-01-01T00:00:00Z", is_featured: false },
  { youtube_id: "vS0FB7C6PO0", title: "Love Lockdown", creator: "Kanye West", duration: "4:29", views_count: 900000000, created_at: "2026-01-01T00:00:00Z", is_featured: false },
  { youtube_id: "yMI8v9l7ZYE", title: "Lollipop", creator: "Lil Wayne ft. Static Major", duration: "5:02", views_count: 550000000, created_at: "2026-01-01T00:00:00Z", is_featured: false },
  { youtube_id: "cSohjlYQI2A", title: "A Milli", creator: "Lil Wayne", duration: "5:11", views_count: 480000000, created_at: "2026-01-01T00:00:00Z", is_featured: false },
  { youtube_id: "xvZqHgFz51I", title: "Hotline Bling", creator: "Drake", duration: "4:18", views_count: 1800000000, created_at: "2026-01-01T00:00:00Z", is_featured: false },
  { youtube_id: "dhK9tG7npjg", title: "Drop It Like It's Hot", creator: "Snoop Dogg ft. Pharrell", duration: "4:27", views_count: 800000000, created_at: "2026-01-01T00:00:00Z", is_featured: false },
  { youtube_id: "3UOy6f5oVtg", title: "Still D.R.E.", creator: "Dr. Dre ft. Snoop Dogg", duration: "4:35", views_count: 500000000, created_at: "2026-01-01T00:00:00Z", is_featured: false },
  { youtube_id: "cUYWzJb64mQ", title: "The Next Episode", creator: "Dr. Dre ft. Snoop Dogg", duration: "2:41", views_count: 900000000, created_at: "2026-01-01T00:00:00Z", is_featured: false },
  { youtube_id: "5wBTdfAkqGU", title: "California Love", creator: "2Pac ft. Dr. Dre", duration: "4:02", views_count: 400000000, created_at: "2026-01-01T00:00:00Z", is_featured: false },
  { youtube_id: "_JZom_gVfuw", title: "Juicy", creator: "The Notorious B.I.G.", duration: "5:02", views_count: 300000000, created_at: "2026-01-01T00:00:00Z", is_featured: false },
  { youtube_id: "XUpUVH5r3po", title: "If I Ruled The World (Imagine That)", creator: "Nas ft. Lauryn Hill", duration: "4:53", views_count: 240000000, created_at: "2026-01-01T00:00:00Z", is_featured: false },
  { youtube_id: "S-sJp1FfG7Q", title: "Bad and Boujee", creator: "Migos ft. Lil Uzi Vert", duration: "5:37", views_count: 1500000000, created_at: "2026-01-01T00:00:00Z", is_featured: false },
  { youtube_id: "quA0_X5o5U0", title: "Stir Fry", creator: "Migos", duration: "5:15", views_count: 700000000, created_at: "2026-01-01T00:00:00Z", is_featured: false },
  { youtube_id: "YVkUvmDQ3HY", title: "Without Me", creator: "Eminem", duration: "4:50", views_count: 1900000000, created_at: "2026-01-01T00:00:00Z", is_featured: false },
  { youtube_id: "m7Bc3pLyij0", title: "Swimming Pools (Drank)", creator: "Kendrick Lamar", duration: "4:12", views_count: 700000000, created_at: "2026-01-01T00:00:00Z", is_featured: false },
  { youtube_id: "5A8zrAedLw4", title: "Started From The Bottom", creator: "Drake", duration: "3:58", views_count: 700000000, created_at: "2026-01-01T00:00:00Z", is_featured: false },
  { youtube_id: "mFYHkGMRaKU", title: "Nice For What", creator: "Drake", duration: "3:31", views_count: 1200000000, created_at: "2026-01-01T00:00:00Z", is_featured: false },
  { youtube_id: "c68tbB64S0U", title: "Flashing Lights", creator: "Kanye West", duration: "3:58", views_count: 500000000, created_at: "2026-01-01T00:00:00Z", is_featured: false },
  { youtube_id: "0KSOMA3QBU0", title: "Heartless", creator: "Kanye West", duration: "3:31", views_count: 820000000, created_at: "2026-01-01T00:00:00Z", is_featured: false },
  { youtube_id: "sAxxv7D8X9U", title: "Run This Town", creator: "Jay-Z ft. Rihanna & Kanye West", duration: "4:28", views_count: 400000000, created_at: "2026-01-01T00:00:00Z", is_featured: false },
  { youtube_id: "cq09G0E4B_0", title: "In Da Club", creator: "50 Cent", duration: "3:13", views_count: 900000000, created_at: "2026-01-01T00:00:00Z", is_featured: false },
  { youtube_id: "OgN-96aQ6oE", title: "How to Love", creator: "Lil Wayne", duration: "4:08", views_count: 550000000, created_at: "2026-01-01T00:00:00Z", is_featured: false },
  { youtube_id: "TgOu00Mf3kI", title: "Starships", creator: "Nicki Minaj", duration: "3:30", views_count: 1500000000, created_at: "2026-01-01T00:00:00Z", is_featured: false },
  { youtube_id: "BK8dEpp0n8M", title: "Life Is Good", creator: "Future ft. Drake", duration: "4:11", views_count: 1000000000, created_at: "2026-01-01T00:00:00Z", is_featured: false },
  { youtube_id: "u4dIctJ7rLg", title: "Nonstop", creator: "Drake", duration: "3:59", views_count: 600000000, created_at: "2026-01-01T00:00:00Z", is_featured: false },
  { youtube_id: "D3cb7hD6yXI", title: "STARGAZING", creator: "Travis Scott", duration: "4:38", views_count: 700000000, created_at: "2026-01-01T00:00:00Z", is_featured: false },
];

const knownSlugs = ["music", "freestyles", "battle", "live", "interviews", "bts", "vlogs", "shorts", "trending"] as const;

type CategorySlug = (typeof knownSlugs)[number];

const demoCache = new Map<string, VideoRow[]>();
const videoByIdCache = new Map<string, VideoRow>();

function buildDemoVideosForSlug(slug: CategorySlug): VideoRow[] {
  const source = slug === "trending"
    ? [...demoBaseVideos].sort((a, b) => b.views_count - a.views_count)
    : demoBaseVideos;

  return source.map((template, index) => {
    const id = `demo-${slug}-${String(index + 1).padStart(3, "0")}`;
    const is_short = slug === "shorts" ? true : template.is_short ?? false;

    return {
      ...template,
      id,
      category: slug,
      is_short,
    };
  });
}

function ensureDemoCache(slug: CategorySlug) {
  if (!demoCache.has(slug)) {
    demoCache.set(slug, buildDemoVideosForSlug(slug));
  }
  return demoCache.get(slug)!;
}

function ensureVideoByIdCache() {
  if (videoByIdCache.size === 0) {
    knownSlugs.forEach((slug) => {
      ensureDemoCache(slug).forEach((video) => videoByIdCache.set(video.id, video));
    });
  }
  return videoByIdCache;
}

export function getDemoVideosForCategory(slug: string, minCount = 50): VideoRow[] {
  const normalized = knownSlugs.includes(slug as CategorySlug) ? (slug as CategorySlug) : "music";
  const list = ensureDemoCache(normalized);
  return list.slice(0, Math.max(minCount, list.length));
}

export function getDemoVideoById(id: string): VideoRow | null {
  return ensureVideoByIdCache().get(id) ?? null;
}
