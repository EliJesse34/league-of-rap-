import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Header } from "@/components/lor/Header";
import { SecondaryNav } from "@/components/lor/SecondaryNav";
import { Footer } from "@/components/lor/Footer";
import { MobileBottomNav } from "@/components/lor/MobileBottomNav";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/use-auth";
import { Upload, DollarSign, Play, BarChart3, Plus, Crown, Mail, Settings } from "lucide-react";

export const Route = createFileRoute("/producer/dashboard")({
  component: ProducerDashboard,
});

function ProducerDashboard() {
  const { user, loading } = useAuth();
  const nav = useNavigate();
  const [sub, setSub] = useState<any>(null);
  const [profile, setProfile] = useState<any>(null);
  const [beats, setBeats] = useState<any[]>([]);
  const [stats, setStats] = useState({ revenue: 0, sales: 0, plays: 0 });

  useEffect(() => {
    if (loading) return;
    if (!user) {
      nav({ to: "/login" });
      return;
    }
    (async () => {
      const [{ data: s }, { data: p }, { data: bs }, { data: purchases }] = await Promise.all([
        supabase.from("producer_subscriptions").select("*").eq("producer_id", user.id).maybeSingle(),
        supabase.from("producer_profiles").select("*").eq("id", user.id).maybeSingle(),
        supabase.from("beats").select("*").eq("producer_id", user.id).order("created_at", { ascending: false }),
        supabase.from("beat_purchases").select("amount, beat_id, beats!inner(producer_id)").eq("beats.producer_id", user.id).eq("status", "completed"),
      ]);
      setSub(s);
      setProfile(p);
      setBeats(bs ?? []);
      const revenue = (purchases ?? []).reduce((a: number, b: any) => a + Number(b.amount), 0);
      const plays = (bs ?? []).reduce((a: number, b: any) => a + (b.plays_count ?? 0), 0);
      setStats({ revenue, sales: purchases?.length ?? 0, plays });
    })();
  }, [user, loading, nav]);

  if (loading || !user) return null;

  const isActive = sub?.status === "active";

  return (
    <div className="min-h-screen bg-background pb-24 md:pb-20">
      <Header />
      <SecondaryNav />

      <main className="mx-auto max-w-[1280px] space-y-6 px-4 pt-6 md:px-6">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-primary">Producer Dashboard</p>
            <h1 className="text-3xl font-black text-foreground">{profile?.display_name ?? "Your studio"}</h1>
          </div>
          {isActive ? (
            <Link to="/producer/upload" className="flex items-center gap-2 rounded-md bg-primary px-4 py-2.5 text-sm font-bold uppercase tracking-wider text-primary-foreground hover:opacity-90">
              <Plus className="h-4 w-4" /> Upload beat
            </Link>
          ) : (
            <Link to="/producer/subscribe" className="flex items-center gap-2 rounded-md bg-primary px-4 py-2.5 text-sm font-bold uppercase tracking-wider text-primary-foreground hover:opacity-90">
              <Crown className="h-4 w-4" /> Activate subscription
            </Link>
          )}
        </div>

        {!isActive && (
          <div className="rounded-xl border border-primary/40 bg-primary/10 p-4 text-sm">
            You need an active Producer Pro subscription to upload beats. <Link to="/producer/subscribe" className="font-bold text-primary underline">Subscribe now</Link>
          </div>
        )}

        <div className="grid gap-4 md:grid-cols-3">
          <StatCard icon={<DollarSign />} label="Revenue" value={`$${stats.revenue.toFixed(2)}`} />
          <StatCard icon={<BarChart3 />} label="Sales" value={stats.sales.toString()} />
          <StatCard icon={<Play />} label="Total plays" value={stats.plays.toString()} />
        </div>

        <section>
          <h2 className="mb-3 text-lg font-black">Your beats</h2>
          {beats.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-border bg-card/30 p-10 text-center">
              <Upload className="mx-auto h-8 w-8 text-muted-foreground" />
              <p className="mt-2 font-bold">No beats yet</p>
              <p className="text-sm text-muted-foreground">Upload your first one to start earning.</p>
            </div>
          ) : (
            <div className="overflow-hidden rounded-2xl border border-border bg-card/40">
              <table className="w-full text-sm">
                <thead className="bg-muted/30 text-xs uppercase tracking-wider text-muted-foreground">
                  <tr>
                    <th className="px-4 py-2 text-left">Beat</th>
                    <th className="px-4 py-2 text-right">Price</th>
                    <th className="px-4 py-2 text-right">Plays</th>
                    <th className="px-4 py-2 text-right">Sales</th>
                    <th className="px-4 py-2 text-right">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {beats.map((b) => (
                    <tr key={b.id} className="border-t border-border">
                      <td className="px-4 py-2">
                        <Link to="/beats/$id" params={{ id: b.id }} className="font-bold hover:text-primary">{b.title}</Link>
                        <span className="ml-2 text-xs text-muted-foreground">{b.genre} · {b.bpm ?? "-"} BPM</span>
                      </td>
                      <td className="px-4 py-2 text-right">${Number(b.base_price).toFixed(2)}</td>
                      <td className="px-4 py-2 text-right">{b.plays_count}</td>
                      <td className="px-4 py-2 text-right">{b.purchases_count}</td>
                      <td className="px-4 py-2 text-right">
                        <span className={`rounded-full px-2 py-0.5 text-[10px] font-bold uppercase ${b.status === "published" ? "bg-primary/20 text-primary" : "bg-muted text-muted-foreground"}`}>
                          {b.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>

        {/* Admin Management Section */}
        <section className="pt-6 border-t border-border">
          <h2 className="mb-3 text-lg font-black">Admin Management</h2>
          <div className="grid gap-4 md:grid-cols-2">
            <Link 
              to="/producer/contact-settings" 
              className="lor-card p-4 hover:border-primary transition-colors"
            >
              <div className="flex items-start gap-3">
                <div className="grid h-10 w-10 place-items-center rounded-md bg-primary/20 text-primary">
                  <Settings className="h-5 w-5" />
                </div>
                <div className="min-w-0">
                  <h3 className="font-bold text-foreground">Contact Settings</h3>
                  <p className="text-xs text-muted-foreground">Manage contact info and social links</p>
                </div>
              </div>
            </Link>

            <Link 
              to="/producer/contact-submissions" 
              className="lor-card p-4 hover:border-primary transition-colors"
            >
              <div className="flex items-start gap-3">
                <div className="grid h-10 w-10 place-items-center rounded-md bg-primary/20 text-primary">
                  <Mail className="h-5 w-5" />
                </div>
                <div className="min-w-0">
                  <h3 className="font-bold text-foreground">Contact Submissions</h3>
                  <p className="text-xs text-muted-foreground">View and manage form submissions</p>
                </div>
              </div>
            </Link>
          </div>
        </section>
      </main>

      <Footer />
      <MobileBottomNav />
    </div>
  );
}

function StatCard({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-border bg-card/40 p-5">
      <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-muted-foreground">
        <span className="grid h-7 w-7 place-items-center rounded-md bg-primary/20 text-primary">{icon}</span>
        {label}
      </div>
      <p className="mt-2 text-3xl font-black text-foreground">{value}</p>
    </div>
  );
}
