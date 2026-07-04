import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { Header } from "@/components/lor/Header";
import { SecondaryNav } from "@/components/lor/SecondaryNav";
import { Footer } from "@/components/lor/Footer";
import { MobileBottomNav } from "@/components/lor/MobileBottomNav";
import { BeatCard, type BeatCardData } from "@/components/lor/BeatCard";
import { supabase } from "@/integrations/supabase/client";
import { Search, SlidersHorizontal, Crown } from "lucide-react";
import { toast } from "sonner";
import { useServerFn } from "@tanstack/react-start";
import { purchaseBeat } from "@/lib/beats.functions";
import { useAuth } from "@/hooks/use-auth";
import { demoBeats } from "@/lib/demo-beats";

export const Route = createFileRoute("/beats/")({
  head: () => ({
    meta: [
      { title: "Beats Marketplace · League of Rap" },
      { name: "description", content: "License rap and hip-hop beats from verified producers. Preview, license, and download instantly." },
    ],
  }),
  component: BeatsPage,
});

const GENRES = ["all", "hip-hop", "trap", "drill", "boom-bap", "afrobeats", "r&b", "lo-fi"];
const SORTS = [
  { v: "trending", label: "Trending" },
  { v: "new", label: "Newest" },
  { v: "price-low", label: "Price: Low" },
  { v: "price-high", label: "Price: High" },
];

function BeatsPage() {
  const { user } = useAuth();
  const [search, setSearch] = useState("");
  const [genre, setGenre] = useState("all");
  const [bpmMin, setBpmMin] = useState("");
  const [bpmMax, setBpmMax] = useState("");
  const [sort, setSort] = useState("trending");
  const [beats, setBeats] = useState<BeatCardData[]>([]);
  const [featured, setFeatured] = useState<{ id: string; display_name: string; banner_url: string | null }[]>([]);
  const [loading, setLoading] = useState(true);
  const buy = useServerFn(purchaseBeat);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    let q = supabase
      .from("beats")
      .select("id, title, cover_url, preview_url, bpm, music_key, genre, mood, base_price, plays_count, likes_count, producer_id, created_at")
      .eq("status", "published")
      .limit(60);
    if (genre !== "all") q = q.eq("genre", genre);
    if (search.trim()) {
      const term = `%${search.trim()}%`;
      q = q.or(`title.ilike.${term},description.ilike.${term},genre.ilike.${term},mood.ilike.${term}`);
    }
    if (bpmMin) q = q.gte("bpm", Number(bpmMin));
    if (bpmMax) q = q.lte("bpm", Number(bpmMax));
    if (sort === "trending") q = q.order("plays_count", { ascending: false });
    else if (sort === "new") q = q.order("created_at", { ascending: false });
    else if (sort === "price-low") q = q.order("base_price", { ascending: true });
    else q = q.order("base_price", { ascending: false });

    q.then(async ({ data, error }) => {
      if (cancelled) return;
      if (error) {
        console.error("Failed to load beats", error);
        toast.error("Could not load beats from Supabase");
        setBeats([]);
        return setLoading(false);
      }
      if (!data) {
        setBeats([]);
        return setLoading(false);
      }
      const ids = Array.from(new Set(data.map((b) => b.producer_id)));
      const { data: profs, error: profsError } = ids.length
        ? await supabase.from("producer_profiles").select("id, display_name, is_verified").in("id", ids)
        : { data: [] };
      if (profsError) {
        console.error("Failed to load producer profiles", profsError);
      }
      const map = new Map((profs ?? []).map((p) => [p.id, p]));
      setBeats(
        data.map((b) => ({
          ...b,
          base_price: Number(b.base_price),
          producer: map.get(b.producer_id) ?? null,
        })),
      );
      setLoading(false);
    });
    return () => {
      cancelled = true;
    };
  }, [search, genre, bpmMin, bpmMax, sort]);

  useEffect(() => {
    supabase
      .from("producer_profiles")
      .select("id, display_name, banner_url")
      .eq("is_verified", true)
      .limit(6)
      .then(({ data }) => setFeatured(data ?? []));
  }, []);

  const onBuy = async (id: string) => {
    if (!user) return toast.error("Sign in to buy beats");
    try {
      const result: any = await buy({ data: { beatId: id } });
      if (result?.checkoutUrl) {
        window.location.href = result.checkoutUrl;
        return;
      }
      toast.success("Purchase complete! Find it in your Library.");
    } catch (e: any) {
      toast.error(e?.message ?? "Could not complete purchase");
    }
  };

  return (
    <div className="min-h-screen bg-background pb-24 md:pb-20">
      <Header />
      <SecondaryNav />

      <main className="mx-auto max-w-[1440px] space-y-8 px-4 pt-6 md:px-6">
        {/* Hero */}
        <div className="relative overflow-hidden rounded-3xl border border-border bg-gradient-to-br from-primary/20 via-card to-background p-8 md:p-12">
          <div className="relative z-10 max-w-2xl">
            <p className="text-xs font-bold uppercase tracking-widest text-primary">Beat Marketplace</p>
            <h1 className="mt-2 text-3xl font-black tracking-tight text-foreground md:text-5xl">
              License the sound of the streets
            </h1>
            <p className="mt-3 text-sm text-muted-foreground md:text-base">
              Stream watermarked previews, buy a lease, and download the full WAV instantly. Verified producers only.
            </p>
            <div className="mt-5 flex flex-wrap gap-3">
              <Link to="/producer/subscribe" className="inline-flex items-center gap-2 rounded-md bg-primary px-4 py-2.5 text-sm font-bold uppercase tracking-wider text-primary-foreground hover:opacity-90">
                <Crown className="h-4 w-4" />
                Become a producer
              </Link>
              <Link to="/library" className="inline-flex items-center gap-2 rounded-md border border-border bg-card/60 px-4 py-2.5 text-sm font-bold uppercase tracking-wider text-foreground backdrop-blur hover:bg-card">
                My library
              </Link>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="space-y-3">
          <div className="flex flex-wrap items-center gap-3">
            <div className="relative flex-1 min-w-[200px]">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search beats, producers, tags..."
                className="h-11 w-full rounded-full border border-border bg-card pl-10 pr-4 text-sm placeholder:text-muted-foreground focus:border-primary focus:outline-none"
              />
            </div>
            <div className="flex items-center gap-2">
              <input value={bpmMin} onChange={(e) => setBpmMin(e.target.value)} placeholder="BPM min" className="h-11 w-24 rounded-md border border-border bg-card px-3 text-sm" />
              <input value={bpmMax} onChange={(e) => setBpmMax(e.target.value)} placeholder="BPM max" className="h-11 w-24 rounded-md border border-border bg-card px-3 text-sm" />
              <select value={sort} onChange={(e) => setSort(e.target.value)} className="h-11 rounded-md border border-border bg-card px-3 text-sm">
                {SORTS.map((s) => <option key={s.v} value={s.v}>{s.label}</option>)}
              </select>
            </div>
          </div>
          <div className="flex flex-wrap gap-2">
            {GENRES.map((g) => (
              <button
                key={g}
                onClick={() => setGenre(g)}
                className={`rounded-full border px-3 py-1.5 text-xs font-bold uppercase tracking-wider transition-colors ${
                  genre === g ? "border-primary bg-primary text-primary-foreground" : "border-border bg-card text-muted-foreground hover:text-foreground"
                }`}
              >
                {g === "all" ? "All genres" : g}
              </button>
            ))}
          </div>
        </div>

        {/* Featured producers */}
        {featured.length > 0 && (
          <section className="space-y-3">
            <h2 className="text-lg font-black text-foreground">Featured producers</h2>
            <div className="flex gap-3 overflow-x-auto pb-2 lor-scroll">
              {featured.map((p) => (
                <div key={p.id} className="shrink-0 rounded-2xl border border-border bg-card p-4 w-44 text-center">
                  <div className="mx-auto h-16 w-16 rounded-full bg-gradient-to-br from-primary to-primary/40" />
                  <p className="mt-2 truncate text-sm font-bold">{p.display_name}</p>
                  <p className="text-[10px] uppercase tracking-widest text-primary">Verified</p>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Grid */}
        <section>
          {loading ? (
            <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
              {Array.from({ length: 10 }).map((_, i) => (
                <div key={i} className="aspect-[3/4] animate-pulse rounded-2xl bg-card" />
              ))}
            </div>
          ) : beats.length === 0 ? (
            <div className="space-y-6">
              <div className="rounded-2xl border border-dashed border-border bg-card/30 p-12 text-center">
                <SlidersHorizontal className="mx-auto h-8 w-8 text-muted-foreground" />
                <p className="mt-2 font-bold">No beats match your filters</p>
                <p className="mt-2 text-sm text-muted-foreground">Try changing the filters, or explore these demo beats below.</p>
              </div>
              <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
                {demoBeats.map((b) => (
                  <BeatCard key={b.id} beat={b} disableLink />
                ))}
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
              {beats.map((b) => <BeatCard key={b.id} beat={b} onBuy={onBuy} />)}
            </div>
          )}
        </section>
      </main>

      <Footer />
      <MobileBottomNav />
    </div>
  );
}
