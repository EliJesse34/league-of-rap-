import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Header } from "@/components/lor/Header";
import { SecondaryNav } from "@/components/lor/SecondaryNav";
import { Footer } from "@/components/lor/Footer";
import { MobileBottomNav } from "@/components/lor/MobileBottomNav";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/use-auth";
import { Download, Library as LibraryIcon, Heart, Clock, ListMusic, Plus } from "lucide-react";
import { useServerFn } from "@tanstack/react-start";
import { getBeatDownloadUrl } from "@/lib/beats.functions";
import { toast } from "sonner";

export const Route = createFileRoute("/library")({
  component: LibraryPage,
});

type Tab = "purchases" | "liked" | "playlists" | "watch-later";

function LibraryPage() {
  const { user, loading } = useAuth();
  const nav = useNavigate();
  const [tab, setTab] = useState<Tab>("purchases");
  const [data, setData] = useState<any[]>([]);
  const getDl = useServerFn(getBeatDownloadUrl);

  useEffect(() => {
    if (loading) return;
    if (!user) { nav({ to: "/login" }); return; }
    (async () => {
      if (tab === "purchases") {
        const { data: p } = await supabase
          .from("beat_purchases")
          .select("id, amount, license_type, completed_at, beats(id, title, cover_url, producer_id)")
          .eq("buyer_id", user.id).eq("status", "completed")
          .order("completed_at", { ascending: false });
        setData(p ?? []);
      } else if (tab === "liked") {
        const { data: l } = await supabase
          .from("beat_likes").select("beats(id, title, cover_url, base_price)").eq("user_id", user.id);
        setData((l ?? []).map((x: any) => x.beats).filter(Boolean));
      } else if (tab === "playlists") {
        const { data: pl } = await supabase.from("playlists").select("*").eq("user_id", user.id).order("created_at", { ascending: false });
        setData(pl ?? []);
      } else {
        const { data: wl } = await supabase.from("watch_later").select("added_at, videos(id, title, youtube_id, creator)").eq("user_id", user.id).order("added_at", { ascending: false });
        setData(wl ?? []);
      }
    })();
  }, [user, loading, tab, nav]);

  const download = async (beatId: string) => {
    try {
      const { url } = await getDl({ data: { beatId } });
      window.open(url, "_blank");
    } catch (e: any) {
      toast.error(e?.message ?? "Failed");
    }
  };

  const createPlaylist = async () => {
    if (!user) return;
    const name = prompt("Playlist name?");
    const trimmed = name?.trim();
    if (!trimmed) return;
    const { error } = await supabase.from("playlists").insert({ user_id: user.id, name: trimmed });
    if (error) {
      toast.error(error.message);
      return;
    }
    toast.success("Playlist created");
    setTab("playlists");
  };

  return (
    <div className="min-h-screen bg-background pb-24 md:pb-20">
      <Header />
      <SecondaryNav />
      <main className="mx-auto max-w-[1280px] space-y-6 px-4 pt-6 md:px-6">
        <div>
          <p className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-primary"><LibraryIcon className="h-4 w-4" /> Your library</p>
          <h1 className="mt-1 text-3xl font-black">Library</h1>
        </div>

        <div className="flex flex-wrap gap-1 rounded-full bg-card p-1 w-fit">
          <TabBtn active={tab === "purchases"} onClick={() => setTab("purchases")} icon={<Download className="h-3.5 w-3.5" />}>Purchases</TabBtn>
          <TabBtn active={tab === "liked"} onClick={() => setTab("liked")} icon={<Heart className="h-3.5 w-3.5" />}>Liked beats</TabBtn>
          <TabBtn active={tab === "playlists"} onClick={() => setTab("playlists")} icon={<ListMusic className="h-3.5 w-3.5" />}>Playlists</TabBtn>
          <TabBtn active={tab === "watch-later"} onClick={() => setTab("watch-later")} icon={<Clock className="h-3.5 w-3.5" />}>Watch later</TabBtn>
        </div>

        {tab === "playlists" && (
          <button onClick={createPlaylist} className="flex items-center gap-2 rounded-md bg-primary px-4 py-2 text-xs font-bold uppercase tracking-wider text-primary-foreground hover:opacity-90">
            <Plus className="h-4 w-4" /> New playlist
          </button>
        )}

        {data.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-border bg-card/30 p-10 text-center text-sm text-muted-foreground">
            Nothing here yet.
          </div>
        ) : tab === "purchases" ? (
          <div className="grid gap-3">
            {data.map((p: any) => (
              <div key={p.id} className="flex items-center gap-4 rounded-xl border border-border bg-card/40 p-3">
                {p.beats?.cover_url ? <img src={p.beats.cover_url} className="h-14 w-14 rounded-md object-cover" /> : <div className="h-14 w-14 rounded-md bg-primary/20" />}
                <div className="flex-1 min-w-0">
                  <Link to="/beats/$id" params={{ id: p.beats?.id }} className="block truncate font-bold hover:text-primary">{p.beats?.title}</Link>
                  <p className="text-xs text-muted-foreground">{p.license_type} · ${Number(p.amount).toFixed(2)}</p>
                </div>
                <button onClick={() => download(p.beats?.id)} className="flex items-center gap-1.5 rounded-md bg-primary px-3 py-2 text-xs font-bold uppercase text-primary-foreground hover:opacity-90">
                  <Download className="h-3.5 w-3.5" /> Download
                </button>
              </div>
            ))}
          </div>
        ) : tab === "liked" ? (
          <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
            {data.map((b: any) => (
              <Link key={b.id} to="/beats/$id" params={{ id: b.id }} className="rounded-xl border border-border bg-card/40 p-3 hover:border-primary/50">
                {b.cover_url ? <img src={b.cover_url} className="aspect-square w-full rounded-md object-cover" /> : <div className="aspect-square rounded-md bg-primary/20" />}
                <p className="mt-2 truncate text-sm font-bold">{b.title}</p>
                <p className="text-xs text-muted-foreground">${Number(b.base_price).toFixed(2)}</p>
              </Link>
            ))}
          </div>
        ) : tab === "playlists" ? (
          <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
            {data.map((p: any) => (
              <Link
                key={p.id}
                to="/playlists/$id"
                params={{ id: p.id }}
                className="rounded-xl border border-border bg-card/40 p-4 transition hover:border-primary"
              >
                <div className="aspect-square rounded-md bg-gradient-to-br from-primary/40 to-card" />
                <p className="mt-2 truncate font-bold">{p.name}</p>
                <p className="text-xs text-muted-foreground">{p.is_public ? "Public" : "Private"}</p>
              </Link>
            ))}
          </div>
        ) : (
          <div className="grid gap-3">
            {data.map((w: any) => (
              <Link key={w.videos?.id} to="/watch/$id" params={{ id: w.videos?.id }} className="flex items-center gap-3 rounded-xl border border-border bg-card/40 p-3 hover:border-primary/50">
                <img src={`https://img.youtube.com/vi/${w.videos?.youtube_id}/mqdefault.jpg`} className="h-16 w-28 rounded-md object-cover" />
                <div className="min-w-0">
                  <p className="truncate font-bold">{w.videos?.title}</p>
                  <p className="text-xs text-muted-foreground">{w.videos?.creator}</p>
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

function TabBtn({ active, onClick, icon, children }: { active: boolean; onClick: () => void; icon?: React.ReactNode; children: React.ReactNode }) {
  return (
    <button onClick={onClick} className={`flex items-center gap-1.5 rounded-full px-4 py-1.5 text-xs font-bold uppercase tracking-wider ${active ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"}`}>
      {icon}{children}
    </button>
  );
}
