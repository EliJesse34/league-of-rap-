import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { Radio, Video as VideoIcon, AlertCircle } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/use-auth";
import { extractYouTubeId } from "@/lib/youtube-parse";
import { Header } from "@/components/lor/Header";
import { SecondaryNav } from "@/components/lor/SecondaryNav";
import { Footer } from "@/components/lor/Footer";
import { MobileBottomNav } from "@/components/lor/MobileBottomNav";

export const Route = createFileRoute("/go-live")({
  component: GoLivePage,
});

const CATS = ["music", "freestyles", "interviews", "vlogs", "battle", "live"];

function GoLivePage() {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const videoRef = useRef<HTMLVideoElement>(null);
  const [previewActive, setPreviewActive] = useState(false);
  const [previewErr, setPreviewErr] = useState<string | null>(null);
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("music");
  const [ytUrl, setYtUrl] = useState("");
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  useEffect(() => {
    return () => {
      const stream = videoRef.current?.srcObject as MediaStream | null;
      stream?.getTracks().forEach((t) => t.stop());
    };
  }, []);

  async function startPreview() {
    setPreviewErr(null);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
      }
      setPreviewActive(true);
    } catch (e: any) {
      setPreviewErr(e?.message ?? "Could not access camera/mic.");
    }
  }

  async function goLive() {
    setErr(null);
    if (!user) { navigate({ to: "/login" }); return; }
    if (!title.trim()) { setErr("Add a title for your stream."); return; }
    const ytId = ytUrl.trim() ? extractYouTubeId(ytUrl) : null;
    if (ytUrl.trim() && !ytId) { setErr("That doesn't look like a valid YouTube URL."); return; }

    setBusy(true);
    const { data, error } = await supabase
      .from("livestreams")
      .insert({
        host_id: user.id,
        title: title.trim(),
        category,
        youtube_id: ytId,
      })
      .select("id")
      .single();
    setBusy(false);
    if (error || !data) { setErr(error?.message ?? "Failed to start stream."); return; }
    navigate({ to: "/live/$id", params: { id: data.id } });
  }

  if (loading) return null;

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <SecondaryNav />
      <main className="mx-auto max-w-[1100px] px-4 pb-24 pt-6 md:px-6 md:pb-10">
        <div className="mb-6">
          <p className="flex items-center gap-2 text-xs uppercase tracking-wider text-primary">
            <Radio className="h-3 w-3" /> Broadcast Studio
          </p>
          <h1 className="lor-display text-3xl uppercase">Go Live</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Preview your camera, then start your room. Paste a YouTube Live URL to broadcast to viewers.
          </p>
        </div>

        {!user && (
          <div className="lor-card mb-5 flex items-center gap-3 p-4">
            <AlertCircle className="h-5 w-5 text-primary" />
            <p className="text-sm">
              You need to{" "}
              <Link to="/login" className="font-semibold text-primary hover:underline">sign in</Link>{" "}
              to start a stream.
            </p>
          </div>
        )}

        <div className="grid w-full min-w-0 grid-cols-1 gap-6 lg:grid-cols-[minmax(0,1.4fr)_1fr]">
          <div className="lor-card overflow-hidden min-w-0">
            <div className="relative aspect-video bg-black">
              <video ref={videoRef} muted playsInline className="h-full w-full object-cover" />
              {!previewActive && (
                <div className="absolute inset-0 grid place-items-center">
                  <button
                    onClick={startPreview}
                    className="inline-flex items-center gap-2 rounded-md bg-primary px-4 py-2.5 text-sm font-bold uppercase tracking-wider text-primary-foreground hover:opacity-90"
                  >
                    <VideoIcon className="h-4 w-4" /> Enable Camera
                  </button>
                </div>
              )}
              {previewActive && (
                <span className="absolute left-3 top-3 rounded-sm bg-primary px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-primary-foreground">
                  ● PREVIEW
                </span>
              )}
            </div>
            {previewErr && (
              <p className="border-t border-border p-3 text-xs text-primary">{previewErr}</p>
            )}
          </div>

          <div className="lor-card p-4 md:p-5">
            <h2 className="lor-section-label text-sm">Stream Details</h2>
            <div className="mt-4 space-y-3">
              <div>
                <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Title</label>
                <input
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Sunday Night Cypher"
                  className="mt-1 h-10 w-full rounded-md border border-border bg-card px-3 text-sm focus:border-primary focus:outline-none"
                />
              </div>
              <div>
                <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Category</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="mt-1 h-10 w-full rounded-md border border-border bg-card px-3 text-sm focus:border-primary focus:outline-none"
                >
                  {CATS.map((c) => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <div>
                <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  YouTube Live URL <span className="normal-case text-muted-foreground/70">(optional)</span>
                </label>
                <input
                  value={ytUrl}
                  onChange={(e) => setYtUrl(e.target.value)}
                  placeholder="https://youtube.com/watch?v=..."
                  className="mt-1 h-10 w-full rounded-md border border-border bg-card px-3 text-sm focus:border-primary focus:outline-none"
                />
                <p className="mt-1 text-[11px] text-muted-foreground">
                  Stream from OBS/YouTube Live and paste the watch URL so viewers can watch in real time.
                </p>
              </div>
              {err && <p className="text-xs text-primary">{err}</p>}
              <button
                onClick={goLive}
                disabled={busy || !user}
                className="w-full rounded-md bg-primary py-3 text-sm font-bold uppercase tracking-wider text-primary-foreground hover:opacity-90 disabled:opacity-50"
              >
                {busy ? "Starting…" : "Start Broadcast"}
              </button>
            </div>
          </div>
        </div>
      </main>
      <Footer />
      <MobileBottomNav />
    </div>
  );
}
