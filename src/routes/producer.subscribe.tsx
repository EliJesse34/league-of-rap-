import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";
import { Header } from "@/components/lor/Header";
import { SecondaryNav } from "@/components/lor/SecondaryNav";
import { Footer } from "@/components/lor/Footer";
import { MobileBottomNav } from "@/components/lor/MobileBottomNav";
import { Crown, Check } from "lucide-react";
import { toast } from "sonner";
import { useServerFn } from "@tanstack/react-start";
import { subscribeProducer } from "@/lib/beats.functions";
import { createPaypalSubscriptionOrder, capturePaypalSubscription } from "@/lib/paypal.functions";
import { z } from "zod";

const searchSchema = z.object({ paypal: z.enum(["success", "canceled"]).optional(), token: z.string().optional() });
import { useAuth } from "@/hooks/use-auth";

export const Route = createFileRoute("/producer/subscribe")({
  head: () => ({ meta: [{ title: "Become a Producer · League of Rap" }] }),
  validateSearch: searchSchema,
  component: SubscribePage,
});

const FEATURES = [
  "Unlimited beat uploads",
  "Verified producer badge",
  "Sales analytics & revenue tracking",
  "Multiple license tiers (MP3, WAV, Exclusive)",
  "Featured placement in marketplace",
  "Secure signed-URL downloads for buyers",
  "Watermarked previews",
  "Direct payouts",
];

function SubscribePage() {
  const { user } = useAuth();
  const nav = useNavigate();
  const sub = useServerFn(subscribeProducer);
  const createPaySub = useServerFn(createPaypalSubscriptionOrder);
  const capturePaySub = useServerFn(capturePaypalSubscription);
  const { paypal, token } = Route.useSearch();

  useEffect(() => {
    if (paypal === "success" && token && user) {
      capturePaySub({ data: { orderId: token } })
        .then(() => {
          toast.success("Subscription active! You can now upload beats.");
          nav({ to: "/producer/upload" });
        })
        .catch((e: any) => {
          toast.error(e?.message ?? "Could not confirm PayPal subscription.");
        });
    } else if (paypal === "canceled") {
      toast.error("PayPal subscription canceled");
    }
  }, [paypal, token, user]);

  const onSubscribe = async () => {
    if (!user) return nav({ to: "/login" });
    try {
      const res: any = await createPaySub({ data: {} });
      if (res?.approveUrl) {
        window.location.href = res.approveUrl;
        return;
      }
      // fallback to stub
      await sub({});
      toast.success("You're a verified producer! Upload your first beat.");
      nav({ to: "/producer/upload" });
    } catch (e: any) {
      toast.error(e?.message ?? "Failed");
    }
  };

  return (
    <div className="min-h-screen bg-background pb-24 md:pb-20">
      <Header />
      <SecondaryNav />
      <main className="mx-auto max-w-3xl px-4 pt-10 md:px-6">
        <div className="rounded-3xl border border-border bg-gradient-to-br from-primary/20 via-card to-background p-8 md:p-12 text-center">
          <Crown className="mx-auto h-12 w-12 text-primary" />
          <p className="mt-3 text-xs font-bold uppercase tracking-widest text-primary">Producer Pro</p>
          <h1 className="mt-2 text-4xl font-black text-foreground md:text-5xl">Sell your sound</h1>
          <p className="mt-3 text-sm text-muted-foreground md:text-base">
            One subscription unlocks unlimited beat uploads and the full creator dashboard.
          </p>
          <div className="mt-6 flex items-baseline justify-center gap-2">
            <span className="text-5xl font-black text-foreground">$9.99</span>
            <span className="text-sm font-bold uppercase tracking-widest text-muted-foreground">/ month</span>
          </div>

          <button
            onClick={onSubscribe}
            className="mt-6 inline-flex items-center gap-2 rounded-md bg-primary px-8 py-3 text-sm font-bold uppercase tracking-widest text-primary-foreground hover:opacity-90"
          >
            <Crown className="h-4 w-4" />
            Start producing
          </button>
          <p className="mt-2 text-[11px] text-muted-foreground">Test mode · payments activate once Stripe is enabled</p>
        </div>

        <div className="mt-8 grid gap-3 sm:grid-cols-2">
          {FEATURES.map((f) => (
            <div key={f} className="flex items-center gap-3 rounded-xl border border-border bg-card/40 p-3">
              <span className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-primary/20 text-primary">
                <Check className="h-4 w-4" />
              </span>
              <span className="text-sm">{f}</span>
            </div>
          ))}
        </div>

        <p className="mt-6 text-center text-sm text-muted-foreground">
          Already a producer? <Link to="/producer/dashboard" className="font-bold text-primary hover:underline">Open dashboard</Link>
        </p>
      </main>
      <Footer />
      <MobileBottomNav />
    </div>
  );
}
