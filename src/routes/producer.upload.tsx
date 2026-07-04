import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Header } from "@/components/lor/Header";
import { SecondaryNav } from "@/components/lor/SecondaryNav";
import { Footer } from "@/components/lor/Footer";
import { MobileBottomNav } from "@/components/lor/MobileBottomNav";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/use-auth";
import { Upload as UploadIcon, Music } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/producer/upload")({
  component: UploadBeatPage,
});

const GENRES = ["hip-hop", "trap", "drill", "boom-bap", "afrobeats", "r&b", "lo-fi"];

function UploadBeatPage() {
  const { user, loading } = useAuth();
  const nav = useNavigate();
  const [active, setActive] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({
    title: "",
    description: "",
    genre: "hip-hop",
    mood: "",
    bpm: "",
    music_key: "",
    base_price: "19.99",
    tags: "",
  });
  const [audio, setAudio] = useState<File | null>(null);
  const [cover, setCover] = useState<File | null>(null);

  useEffect(() => {
    if (loading) return;
    if (!user) {
      nav({ to: "/login" });
      return;
    }
    supabase
      .from("producer_subscriptions")
      .select("status")
      .eq("producer_id", user.id)
      .maybeSingle()
      .then(({ data }) => setActive(data?.status === "active"));
  }, [user, loading, nav]);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    if (!audio) return toast.error("Audio file is required");
    setSubmitting(true);
    try {
      const audioPath = `${user.id}/${crypto.randomUUID()}-${audio.name}`;
      const { error: aerr } = await supabase.storage.from("beat-audio").upload(audioPath, audio);
      if (aerr) throw aerr;

      // Preview = same file for now (watermarking can be added later server-side)
      const previewPath = `${user.id}/${crypto.randomUUID()}-preview-${audio.name}`;
      await supabase.storage.from("beat-previews").upload(previewPath, audio);
      const { data: prevUrl } = supabase.storage.from("beat-previews").getPublicUrl(previewPath);

      let coverUrl: string | null = null;
      if (cover) {
        const coverPath = `${user.id}/${crypto.randomUUID()}-${cover.name}`;
        const { error: cerr } = await supabase.storage.from("beat-covers").upload(coverPath, cover);
        if (!cerr) {
          const { data } = supabase.storage.from("beat-covers").getPublicUrl(coverPath);
          coverUrl = data.publicUrl;
        }
      }

      const { error: ierr } = await supabase.from("beats").insert({
        producer_id: user.id,
        title: form.title,
        description: form.description || null,
        cover_url: coverUrl,
        preview_url: prevUrl.publicUrl,
        audio_path: audioPath,
        bpm: form.bpm ? Number(form.bpm) : null,
        music_key: form.music_key || null,
        genre: form.genre,
        mood: form.mood || null,
        tags: form.tags ? form.tags.split(",").map((t) => t.trim()).filter(Boolean) : [],
        base_price: Number(form.base_price),
        status: "published",
      });
      if (ierr) throw ierr;

      toast.success("Beat uploaded!");
      nav({ to: "/producer/dashboard" });
    } catch (e: any) {
      toast.error(e?.message ?? "Upload failed");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-background pb-24 md:pb-20">
      <Header />
      <SecondaryNav />
      <main className="mx-auto max-w-2xl px-4 pt-6 md:px-6">
        <h1 className="text-3xl font-black">Upload a beat</h1>
        {!active ? (
          <p className="mt-4 rounded-xl border border-primary/40 bg-primary/10 p-4 text-sm">
            Activate Producer Pro to upload. <a href="/producer/subscribe" className="font-bold text-primary underline">Subscribe</a>
          </p>
        ) : (
          <form onSubmit={submit} className="mt-6 space-y-4">
            <Field label="Title" required>
              <input required value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} className={input} />
            </Field>
            <Field label="Description">
              <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} className={`${input} min-h-24`} />
            </Field>
            <div className="grid grid-cols-2 gap-3">
              <Field label="Genre">
                <select value={form.genre} onChange={(e) => setForm({ ...form, genre: e.target.value })} className={input}>
                  {GENRES.map((g) => <option key={g}>{g}</option>)}
                </select>
              </Field>
              <Field label="Mood"><input value={form.mood} onChange={(e) => setForm({ ...form, mood: e.target.value })} placeholder="dark, chill, hype..." className={input} /></Field>
              <Field label="BPM"><input type="number" value={form.bpm} onChange={(e) => setForm({ ...form, bpm: e.target.value })} className={input} /></Field>
              <Field label="Key"><input value={form.music_key} onChange={(e) => setForm({ ...form, music_key: e.target.value })} placeholder="A minor" className={input} /></Field>
              <Field label="Price (USD)"><input type="number" step="0.01" value={form.base_price} onChange={(e) => setForm({ ...form, base_price: e.target.value })} className={input} /></Field>
              <Field label="Tags (comma)"><input value={form.tags} onChange={(e) => setForm({ ...form, tags: e.target.value })} className={input} /></Field>
            </div>
            <Field label="Audio file (MP3/WAV)" required>
              <input required type="file" accept="audio/*" onChange={(e) => setAudio(e.target.files?.[0] ?? null)} className="text-sm" />
            </Field>
            <Field label="Cover art (optional)">
              <input type="file" accept="image/*" onChange={(e) => setCover(e.target.files?.[0] ?? null)} className="text-sm" />
            </Field>
            <button disabled={submitting} className="flex items-center gap-2 rounded-md bg-primary px-6 py-3 text-sm font-bold uppercase tracking-wider text-primary-foreground hover:opacity-90 disabled:opacity-50">
              <UploadIcon className="h-4 w-4" /> {submitting ? "Uploading..." : "Publish beat"}
            </button>
          </form>
        )}
      </main>
      <Footer />
      <MobileBottomNav />
    </div>
  );
}

const input = "h-11 w-full rounded-md border border-border bg-card px-3 text-sm focus:border-primary focus:outline-none";
function Field({ label, required, children }: { label: string; required?: boolean; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="mb-1 block text-xs font-bold uppercase tracking-wider text-muted-foreground">{label}{required && <span className="text-primary"> *</span>}</span>
      {children}
    </label>
  );
}
