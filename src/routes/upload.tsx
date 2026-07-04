import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { Check, Upload as UploadIcon, Crown, Zap, Star } from "lucide-react";
import { Header } from "@/components/lor/Header";
import { SecondaryNav } from "@/components/lor/SecondaryNav";
import { Footer } from "@/components/lor/Footer";
import { MobileBottomNav } from "@/components/lor/MobileBottomNav";

export const Route = createFileRoute("/upload")({
  component: UploadPage,
});

const plans = [
  {
    id: "starter",
    name: "Starter",
    price: 9,
    icon: Zap,
    badge: null,
    uploads: "5 uploads / month",
    features: ["HD 1080p uploads", "Basic analytics", "Standard placement", "Comment moderation"],
  },
  {
    id: "creator",
    name: "Creator",
    price: 29,
    icon: Star,
    badge: "MOST POPULAR",
    uploads: "Unlimited uploads",
    features: [
      "4K uploads",
      "Advanced analytics",
      "Homepage rotation eligibility",
      "Monetization unlocked",
      "Verified badge",
      "Priority support",
    ],
  },
  {
    id: "label",
    name: "Label / Pro",
    price: 99,
    icon: Crown,
    badge: "TEAMS",
    uploads: "Unlimited + 10 sub-accounts",
    features: [
      "Everything in Creator",
      "Guaranteed featured slot weekly",
      "Dedicated A&R contact",
      "Cross-network promo (HipHopLA / BX / CPT)",
      "Custom artist landing pages",
    ],
  },
];

function UploadPage() {
  const [selected, setSelected] = useState("creator");
  const [url, setUrl] = useState("");

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <SecondaryNav />

      <main className="mx-auto max-w-[1200px] px-4 pb-24 pt-8 md:px-6 md:pb-12">
        {/* Hero */}
        <div className="lor-card p-6 md:p-10 text-center">
          <div className="mx-auto mb-3 inline-flex items-center gap-2 rounded-full border border-primary/40 bg-primary/10 px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-primary">
            <Crown className="h-3.5 w-3.5" /> Pay-To-Upload Platform
          </div>
          <h1 className="lor-display text-3xl md:text-5xl">UPLOAD YOUR HEAT</h1>
          <p className="mx-auto mt-3 max-w-2xl text-sm md:text-base text-muted-foreground">
            League of Rap is a <span className="font-bold text-foreground">paid creator platform</span>. To keep the
            culture premium and bot-free, every uploader carries an active subscription. Pick your tier, drop your
            video, and get placed in front of a real hip-hop audience.
          </p>
        </div>

        {/* Plans */}
        <section className="mt-8">
          <h2 className="lor-section-label mb-4 text-sm">CHOOSE YOUR PLAN</h2>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            {plans.map((p) => {
              const Icon = p.icon;
              const active = selected === p.id;
              return (
                <button
                  key={p.id}
                  onClick={() => setSelected(p.id)}
                  className={`lor-card relative p-5 text-left transition-all ${
                    active ? "border-primary ring-2 ring-primary" : "hover:border-border-strong"
                  }`}
                >
                  {p.badge && (
                    <span className="absolute -top-2.5 left-5 rounded-sm bg-primary px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-primary-foreground">
                      {p.badge}
                    </span>
                  )}
                  <div className="flex items-center gap-2">
                    <Icon className="h-5 w-5 text-primary" />
                    <h3 className="lor-display text-xl">{p.name}</h3>
                  </div>
                  <div className="mt-3 flex items-end gap-1">
                    <span className="lor-display text-4xl">${p.price}</span>
                    <span className="pb-1 text-xs text-muted-foreground">/ month</span>
                  </div>
                  <p className="mt-1 text-xs font-semibold text-primary">{p.uploads}</p>
                  <ul className="mt-4 space-y-2 text-sm">
                    {p.features.map((f) => (
                      <li key={f} className="flex items-start gap-2 text-foreground">
                        <Check className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                        {f}
                      </li>
                    ))}
                  </ul>
                </button>
              );
            })}
          </div>
        </section>

        {/* Upload form (locked until subscribe) */}
        <section className="mt-8 lor-card p-5 md:p-8">
          <div className="flex items-center gap-2">
            <UploadIcon className="h-5 w-5 text-primary" />
            <h2 className="lor-display text-2xl">SUBMIT A VIDEO</h2>
          </div>
          <p className="mt-1 text-sm text-muted-foreground">
            Paste a YouTube URL — we'll auto-pull thumbnail, duration and metadata.
          </p>

          <div className="mt-5 space-y-4">
            <div>
              <label className="lor-section-label text-xs">YouTube URL</label>
              <input
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="https://youtube.com/watch?v=..."
                className="mt-2 h-11 w-full rounded-md border border-border bg-card px-3 text-sm focus:border-primary focus:outline-none"
              />
            </div>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div>
                <label className="lor-section-label text-xs">Title</label>
                <input
                  placeholder="JAY FROST — COLD WORLD"
                  className="mt-2 h-11 w-full rounded-md border border-border bg-card px-3 text-sm focus:border-primary focus:outline-none"
                />
              </div>
              <div>
                <label className="lor-section-label text-xs">Category</label>
                <select className="mt-2 h-11 w-full rounded-md border border-border bg-card px-3 text-sm focus:border-primary focus:outline-none">
                  <option>Music Video</option>
                  <option>Freestyle</option>
                  <option>Interview</option>
                  <option>Battle Rap</option>
                  <option>Live Performance</option>
                </select>
              </div>
            </div>

            <div className="rounded-md border border-border-strong bg-surface p-4 text-sm">
              <p className="font-semibold text-foreground">
                Selected: <span className="text-primary">{plans.find((p) => p.id === selected)?.name}</span> — $
                {plans.find((p) => p.id === selected)?.price}/mo
              </p>
              <p className="mt-1 text-xs text-muted-foreground">
                You will be charged today and your video enters review within 24 hours.
              </p>
            </div>

            <button className="w-full rounded-md bg-primary py-3 text-sm font-bold uppercase tracking-wider text-primary-foreground hover:opacity-90">
              Subscribe & Upload →
            </button>
            <p className="text-center text-[11px] text-muted-foreground">
              Cancel anytime. Refunds within 7 days if your video has not been published.
            </p>
          </div>
        </section>

        <div className="mt-6 text-center text-xs text-muted-foreground">
          Already subscribed?{" "}
          <Link to="/login" className="text-primary hover:underline">
            Log in to upload
          </Link>
        </div>
      </main>

      <Footer />
      <MobileBottomNav />
    </div>
  );
}
