import { useEffect, useState } from "react";
import { Link } from "@tanstack/react-router";
import { Music2, TrendingUp, Sparkles, ArrowRight } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { BeatCard, type BeatCardData } from "./BeatCard";
import { toast } from "sonner";
import { useServerFn } from "@tanstack/react-start";
import { purchaseBeat } from "@/lib/beats.functions";
import { useAuth } from "@/hooks/use-auth";
import { demoBeats } from "@/lib/demo-beats";

type Tab = "trending" | "new" | "recommended";

export function BeatMarketplace() {
  const [tab, setTab] = useState<Tab>("trending");
  const [beats, setBeats] = useState<BeatCardData[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const buy = useServerFn(purchaseBeat);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    const q = supabase
      .from("beats")
      .select("id, title, cover_url, preview_url, bpm, music_key, genre, mood, base_price, plays_count, likes_count, producer_id")
      .eq("status", "published")
      .limit(8);
    const ordered =
      tab === "trending"
        ? q.order("plays_count", { ascending: false })
        : tab === "new"
        ? q.order("created_at", { ascending: false })
        : q.order("likes_count", { ascending: false });
    ordered.then(async ({ data }) => {
      if (cancelled || !data) {
        setLoading(false);
        return;
      }
      const producerIds = Array.from(new Set(data.map((b) => b.producer_id)));
      const { data: profs } = producerIds.length
        ? await supabase.from("producer_profiles").select("id, display_name, is_verified").in("id", producerIds)
        : { data: [] };
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
  }, [tab]);

  const onBuy = async (id: string) => {
    if (!user) {
      toast.error("Sign in to buy beats");
      return;
    }
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
    <section className="space-y-4">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-primary">
            <Music2 className="h-4 w-4" />
            Beat Marketplace
          </div>
          <h2 className="mt-1 text-2xl font-black tracking-tight text-foreground">Producer beats, ready to license</h2>
        </div>
        <Link to="/beats" className="flex items-center gap-1 text-xs font-bold uppercase tracking-wider text-primary hover:underline">
          Browse all beats <ArrowRight className="h-3.5 w-3.5" />
        </Link>
      </div>

      <div className="flex gap-1 rounded-full bg-card p-1 w-fit">
        <TabBtn active={tab === "trending"} onClick={() => setTab("trending")} icon={<TrendingUp className="h-3.5 w-3.5" />}>Trending</TabBtn>
        <TabBtn active={tab === "new"} onClick={() => setTab("new")} icon={<Sparkles className="h-3.5 w-3.5" />}>Newest</TabBtn>
        <TabBtn active={tab === "recommended"} onClick={() => setTab("recommended")}>Recommended</TabBtn>
      </div>

      {loading ? (
        <div className="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="aspect-[3/4] animate-pulse rounded-2xl bg-card" />
          ))}
        </div>
      ) : beats.length === 0 ? (
        <div className="space-y-4">
          <EmptyState />
          <div className="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-4">
            {demoBeats.map((b) => (
              <BeatCard key={b.id} beat={b} disableLink />
            ))}
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-4">
          {beats.map((b) => (
            <BeatCard key={b.id} beat={b} onBuy={onBuy} />
          ))}
        </div>
      )}
    </section>
  );
}

function TabBtn({ active, onClick, icon, children }: { active: boolean; onClick: () => void; icon?: React.ReactNode; children: React.ReactNode }) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-1.5 rounded-full px-4 py-1.5 text-xs font-bold uppercase tracking-wider transition-colors ${
        active ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"
      }`}
    >
      {icon}
      {children}
    </button>
  );
}

function EmptyState() {
  return (
    <div className="rounded-3xl border border-dashed border-border bg-card/30 p-10 text-center">
      <div className="mx-auto mb-4 h-16 w-16 rounded-full bg-primary/10 text-primary grid place-items-center text-2xl font-black">!</div>
      <h3 className="text-xl font-black text-foreground">No beats are available right now</h3>
      <p className="mt-2 text-sm text-muted-foreground">
        The marketplace is waiting for producers to upload beats. Sign in to add your own or seed the database with sample beats.
      </p>
      <div className="mt-6 flex flex-col items-center justify-center gap-3 sm:flex-row">
        <Link to="/beats" className="rounded-full bg-primary px-5 py-2 text-xs font-bold uppercase tracking-wider text-primary-foreground hover:opacity-90">
          Browse all beats
        </Link>
        <Link to="/login" className="rounded-full border border-border bg-card px-5 py-2 text-xs font-bold uppercase tracking-wider text-foreground hover:bg-card/80">
          Sign in
        </Link>
      </div>
    </div>
  );
}
