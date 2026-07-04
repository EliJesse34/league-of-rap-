import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Header } from "@/components/lor/Header";
import { SecondaryNav } from "@/components/lor/SecondaryNav";
import { Footer } from "@/components/lor/Footer";
import { MobileBottomNav } from "@/components/lor/MobileBottomNav";
import { Waveform } from "@/components/lor/Waveform";
import { useBeatPlayer } from "@/hooks/use-beat-player";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/use-auth";
import { Play, Pause, Heart, Download, ShoppingBag, BadgeCheck } from "lucide-react";
import { toast } from "sonner";
import { useServerFn } from "@tanstack/react-start";
import { purchaseBeat, getBeatDownloadUrl, finalizeBeatPurchase } from "@/lib/beats.functions";
import { createPaypalOrder, capturePaypalOrder } from "@/lib/paypal.functions";
import { z } from "zod";

const searchSchema = z.object({
  checkout: z.enum(["success", "canceled"]).optional(),
  session_id: z.string().optional(),
  paypal: z.enum(["success", "canceled"]).optional(),
  token: z.string().optional(),
});

export const Route = createFileRoute("/beats/$id")({
  validateSearch: searchSchema,
  component: BeatDetailPage,
});

function BeatDetailPage() {
  const { id } = Route.useParams();
  const { checkout, session_id, paypal, token } = Route.useSearch();
  const { user } = useAuth();
  const [beat, setBeat] = useState<any>(null);
  const [checkoutFinalized, setCheckoutFinalized] = useState(false);
  const [licenses, setLicenses] = useState<any[]>([]);
  const [producer, setProducer] = useState<any>(null);
  const [selectedLic, setSelectedLic] = useState<string | null>(null);
  const [hasPurchased, setHasPurchased] = useState(false);
  const [liked, setLiked] = useState(false);
  const { current, isPlaying, play, toggle, progress, seek } = useBeatPlayer();
  const buy = useServerFn(purchaseBeat);
  const finalizePurchase = useServerFn(finalizeBeatPurchase);
  const createPay = useServerFn(createPaypalOrder);
  const capturePay = useServerFn(capturePaypalOrder);
  const getDl = useServerFn(getBeatDownloadUrl);

  useEffect(() => {
    if (!checkout || checkoutFinalized) return;
    if (checkout === "canceled") {
      toast.error("Checkout was canceled.");
      setCheckoutFinalized(true);
      return;
    }
    if (checkout === "success" && session_id && user) {
      finalizePurchase({ data: { sessionId: session_id } })
        .then(() => {
          toast.success("Payment confirmed! You can now download your beat.");
          setHasPurchased(true);
          setCheckoutFinalized(true);
        })
        .catch((e: any) => {
          toast.error(e?.message ?? "Could not confirm payment.");
          setCheckoutFinalized(true);
        });
      return;
    }

    if (paypal === "success" && token && user) {
      capturePay({ data: { orderId: token } })
        .then(() => {
          toast.success("Payment confirmed! You can now download your beat.");
          setHasPurchased(true);
          setCheckoutFinalized(true);
        })
        .catch((e: any) => {
          toast.error(e?.message ?? "Could not confirm PayPal payment.");
          setCheckoutFinalized(true);
        });
      return;
    }
  }, [checkout, checkoutFinalized, finalizePurchase, session_id, user]);

  useEffect(() => {
    supabase.from("beats").select("*").eq("id", id).maybeSingle().then(async ({ data }) => {
      setBeat(data);
      if (data) {
        const [{ data: lics }, { data: prof }] = await Promise.all([
          supabase.from("beat_licenses").select("*").eq("beat_id", id).order("price"),
          supabase.from("producer_profiles").select("id, display_name, bio, is_verified").eq("id", data.producer_id).maybeSingle(),
        ]);
        setLicenses(lics ?? []);
        setProducer(prof);
        if (lics && lics.length > 0) setSelectedLic(lics[0].id);
        if (user) {
          const [{ data: pur }, { data: lk }] = await Promise.all([
            supabase.from("beat_purchases").select("id").eq("beat_id", id).eq("buyer_id", user.id).eq("status", "completed").maybeSingle(),
            supabase.from("beat_likes").select("user_id").eq("beat_id", id).eq("user_id", user.id).maybeSingle(),
          ]);
          setHasPurchased(!!pur);
          setLiked(!!lk);
        }
      }
    });
  }, [id, user]);

  if (!beat) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <SecondaryNav />
        <main className="mx-auto max-w-[1440px] px-4 py-10 md:px-6">
          <p className="text-muted-foreground">Loading beat...</p>
        </main>
      </div>
    );
  }

  const active = current?.id === beat.id;
  const playing = active && isPlaying;
  const onPlay = () => {
    if (!beat.preview_url) return;
    if (active) toggle();
    else play({ id: beat.id, title: beat.title, producer: producer?.display_name ?? "Unknown", coverUrl: beat.cover_url, previewUrl: beat.preview_url });
  };

  const onBuy = async () => {
    if (!user) return toast.error("Sign in to buy");
    try {
      const result: any = await buy({ data: { beatId: beat.id, licenseId: selectedLic ?? undefined } });
      if (result?.checkoutUrl) {
        window.location.href = result.checkoutUrl;
        return;
      }
      toast.success("Purchase complete!");
      setHasPurchased(true);
    } catch (e: any) {
      toast.error(e?.message ?? "Failed");
    }
  };

  const onPayPalBuy = async () => {
    if (!user) return toast.error("Sign in to buy");
    try {
      const res: any = await createPay({ data: { beatId: beat.id, licenseId: selectedLic ?? undefined } });
      if (res?.approveUrl) {
        window.location.href = res.approveUrl;
        return;
      }
      toast.success("Purchase started");
    } catch (e: any) {
      toast.error(e?.message ?? "Failed to start PayPal checkout");
    }
  };

  const onDownload = async () => {
    try {
      const { url } = await getDl({ data: { beatId: beat.id } });
      window.open(url, "_blank");
    } catch (e: any) {
      toast.error(e?.message ?? "Download failed");
    }
  };

  const onLike = async () => {
    if (!user) return toast.error("Sign in to like");
    if (liked) {
      await supabase.from("beat_likes").delete().eq("beat_id", beat.id).eq("user_id", user.id);
      setLiked(false);
    } else {
      await supabase.from("beat_likes").insert({ beat_id: beat.id, user_id: user.id });
      setLiked(true);
    }
  };

  const price = licenses.find((l) => l.id === selectedLic)?.price ?? beat.base_price;

  return (
    <div className="min-h-screen bg-background pb-24 md:pb-20">
      <Header />
      <SecondaryNav />

      <main className="mx-auto max-w-6xl px-4 pt-6 md:px-6">
        <div className="grid gap-8 md:grid-cols-[360px_1fr]">
          <div>
            <div className="relative aspect-square overflow-hidden rounded-2xl border border-border">
              {beat.cover_url ? (
                <img src={beat.cover_url} alt={beat.title} className="h-full w-full object-cover" />
              ) : (
                <div className="grid h-full w-full place-items-center bg-gradient-to-br from-primary/40 to-card text-5xl font-black text-foreground/40">
                  {beat.title.slice(0, 2).toUpperCase()}
                </div>
              )}
              <button onClick={onPlay} className="absolute inset-0 grid place-items-center bg-black/0 hover:bg-black/40">
                <span className="grid h-20 w-20 place-items-center rounded-full bg-primary text-primary-foreground shadow-2xl">
                  {playing ? <Pause className="h-8 w-8" /> : <Play className="h-8 w-8 translate-x-0.5" />}
                </span>
              </button>
            </div>
          </div>

          <div className="space-y-5">
            <div>
              <p className="text-xs font-bold uppercase tracking-widest text-primary">{beat.genre} {beat.mood ? `· ${beat.mood}` : ""}</p>
              <h1 className="mt-1 text-4xl font-black text-foreground">{beat.title}</h1>
              {producer && (
                <Link to="/beats" className="mt-2 inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground">
                  by <span className="font-bold text-foreground">{producer.display_name}</span>
                  {producer.is_verified && <BadgeCheck className="h-4 w-4 fill-primary text-background" />}
                </Link>
              )}
              <div className="mt-3 flex flex-wrap gap-3 text-xs font-bold uppercase tracking-wider text-muted-foreground">
                {beat.bpm && <span>{beat.bpm} BPM</span>}
                {beat.music_key && <span>Key: {beat.music_key}</span>}
                <span>{beat.plays_count} plays</span>
              </div>
            </div>

            <Waveform seed={beat.id} progress={active ? progress : 0} onSeek={active ? seek : undefined} bars={80} className="h-16" />

            <div className="space-y-3">
              <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Choose a license</p>
              {licenses.length === 0 ? (
                <button onClick={() => setSelectedLic(null)} className="w-full rounded-xl border border-primary bg-primary/10 p-4 text-left">
                  <div className="flex justify-between">
                    <div>
                      <p className="font-bold">MP3 Lease</p>
                      <p className="text-xs text-muted-foreground">Non-exclusive, up to 5000 streams</p>
                    </div>
                    <p className="font-black">${Number(beat.base_price).toFixed(2)}</p>
                  </div>
                </button>
              ) : licenses.map((l) => (
                <button
                  key={l.id}
                  onClick={() => setSelectedLic(l.id)}
                  className={`w-full rounded-xl border p-4 text-left transition-colors ${
                    selectedLic === l.id ? "border-primary bg-primary/10" : "border-border bg-card hover:border-primary/50"
                  }`}
                >
                  <div className="flex justify-between">
                    <div>
                      <p className="font-bold">{l.name}</p>
                      <p className="text-xs text-muted-foreground">{l.terms ?? l.license_type.replace("_", " ")}</p>
                    </div>
                    <p className="font-black">${Number(l.price).toFixed(2)}</p>
                  </div>
                </button>
              ))}
            </div>

            <div className="flex flex-wrap gap-3">
              {hasPurchased ? (
                <button onClick={onDownload} className="flex items-center gap-2 rounded-md bg-primary px-6 py-3 text-sm font-bold uppercase tracking-wider text-primary-foreground hover:opacity-90">
                  <Download className="h-4 w-4" /> Download
                </button>
              ) : (
                <div className="flex items-center gap-2">
                  <button onClick={onBuy} className="flex items-center gap-2 rounded-md bg-primary px-6 py-3 text-sm font-bold uppercase tracking-wider text-primary-foreground hover:opacity-90">
                    <ShoppingBag className="h-4 w-4" /> Buy · ${Number(price).toFixed(2)}
                  </button>
                  <button onClick={onPayPalBuy} className="flex items-center gap-2 rounded-md border border-border bg-card px-4 py-3 text-sm font-bold uppercase tracking-wider hover:bg-muted">
                    PayPal
                  </button>
                </div>
              )}
              <button onClick={onLike} className="flex items-center gap-2 rounded-md border border-border bg-card px-4 py-3 text-sm font-bold uppercase tracking-wider hover:bg-muted">
                <Heart className={`h-4 w-4 ${liked ? "fill-primary text-primary" : ""}`} /> {liked ? "Liked" : "Like"}
              </button>
            </div>

            {beat.description && (
              <div className="rounded-xl border border-border bg-card/40 p-4">
                <p className="text-sm text-muted-foreground whitespace-pre-wrap">{beat.description}</p>
              </div>
            )}

            {beat.tags?.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {beat.tags.map((t: string) => (
                  <span key={t} className="rounded-full bg-card px-3 py-1 text-xs text-muted-foreground">#{t}</span>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>

      <Footer />
      <MobileBottomNav />
    </div>
  );
}
