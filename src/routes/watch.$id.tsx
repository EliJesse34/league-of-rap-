import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Heart, Send, ListMusic } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/use-auth";
import { Header } from "@/components/lor/Header";
import { SecondaryNav } from "@/components/lor/SecondaryNav";
import { Footer } from "@/components/lor/Footer";
import { MobileBottomNav } from "@/components/lor/MobileBottomNav";
import { VideoCard, type VideoRow } from "@/components/lor/VideoCard";
import { Verified } from "@/components/lor/Verified";
import { formatViews, timeAgo, ytThumb } from "@/lib/youtube";
import { getDemoVideoById } from "@/lib/demo-videos";

export const Route = createFileRoute("/watch/$id")({
  component: WatchPage,
});

type Comment = {
  id: string;
  user_id: string;
  content: string;
  created_at: string;
  profiles?: { username: string; display_name: string | null; avatar_url: string | null } | null;
};

function WatchPage() {
  const { id } = Route.useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const qc = useQueryClient();

  const { data: video } = useQuery({
    queryKey: ["video", id],
    queryFn: async () => {
      const { data } = await supabase.from("videos").select("*").eq("id", id).maybeSingle();
      if (data) return data as VideoRow;
      return getDemoVideoById(id);
    },
  });

  const { data: related = [] } = useQuery({
    queryKey: ["related", id, video?.creator, video?.category],
    queryFn: async () => {
      if (!video) return [] as VideoRow[];

      const { data: creatorData } = await supabase
        .from("videos")
        .select("*")
        .neq("id", id)
        .eq("creator", video.creator)
        .order("views_count", { ascending: false })
        .limit(8);

      const relatedVideos = Array.from(new Set((creatorData ?? []) as VideoRow[]));
      if (relatedVideos.length < 8) {
        const { data: categoryData } = await supabase
          .from("videos")
          .select("*")
          .neq("id", id)
          .neq("creator", video.creator)
          .eq("category", video.category)
          .order("views_count", { ascending: false })
          .limit(8 - relatedVideos.length);
        relatedVideos.push(...((categoryData ?? []) as VideoRow[]));
      }

      if (relatedVideos.length < 8) {
        const excludeIds = relatedVideos.map((v) => v.id).concat(id);
        const { data: fallback } = await supabase
          .from("videos")
          .select("*")
          .neq("is_short", true)
          .not("id", "in", `(${excludeIds.map((id) => `'${id}'`).join(",")})`)
          .order("views_count", { ascending: false })
          .limit(8 - relatedVideos.length);
        relatedVideos.push(...((fallback ?? []) as VideoRow[]));
      }

      return relatedVideos.slice(0, 8);
    },
    enabled: !!video,
  });

  const { data: playlists = [] } = useQuery({
    queryKey: ["playlists", user?.id],
    queryFn: async () => {
      if (!user) return [] as { id: string; name: string }[];
      const { data } = await supabase
        .from("playlists")
        .select("id, name")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });
      return (data ?? []) as { id: string; name: string }[];
    },
    enabled: !!user,
  });

  const addToPlaylist = async () => {
    if (!user) return navigate({ to: "/login" });
    if (!video) return;

    let playlistId: string | null = null;

    if (playlists.length === 0) {
      const name = prompt("No playlists found. Create one: ");
      if (!name?.trim()) return;
      const { data, error } = await supabase
        .from("playlists")
        .insert({ user_id: user.id, name: name.trim() })
        .select("id")
        .maybeSingle();
      if (error) {
        toast.error(error.message);
        return;
      }
      playlistId = data?.id ?? null;
      qc.invalidateQueries({ queryKey: ["playlists", user.id] });
    } else if (playlists.length === 1) {
      playlistId = playlists[0].id;
    } else {
      const choice = prompt(
        `Add “${video.title}” to which playlist?\n${playlists.map((playlist, index) => `${index + 1}. ${playlist.name}`).join("\n")}`,
      );
      if (!choice?.trim()) return;
      const matched = playlists.find((playlist) => playlist.name.toLowerCase() === choice.trim().toLowerCase());
      if (matched) {
        playlistId = matched.id;
      } else {
        const createNew = confirm("Playlist not found. Create a new playlist with that name?");
        if (!createNew) return;
        const { data, error } = await supabase
          .from("playlists")
          .insert({ user_id: user.id, name: choice.trim() })
          .select("id")
          .maybeSingle();
        if (error) {
          toast.error(error.message);
          return;
        }
        playlistId = data?.id ?? null;
        qc.invalidateQueries({ queryKey: ["playlists", user.id] });
      }
    }

    if (!playlistId) return;

    const { error } = await supabase.from("playlist_items").insert({
      playlist_id: playlistId,
      item_type: "video",
      video_id: video.id,
    });

    if (error) {
      toast.error(error.message);
    } else {
      toast.success("Added to playlist");
      qc.invalidateQueries({ queryKey: ["playlists", user.id] });
    }
  };

  const { data: comments = [] } = useQuery({
    queryKey: ["comments", id],
    queryFn: async () => {
      const { data: rows } = await supabase
        .from("comments")
        .select("id, user_id, content, created_at")
        .eq("video_id", id)
        .order("created_at", { ascending: false });
      const list = (rows ?? []) as Omit<Comment, "profiles">[];
      const ids = Array.from(new Set(list.map((c) => c.user_id)));
      let profMap = new Map<string, Comment["profiles"]>();
      if (ids.length) {
        const { data: profs } = await supabase
          .from("profiles")
          .select("id, username, display_name, avatar_url")
          .in("id", ids);
        (profs ?? []).forEach((p) => profMap.set(p.id, p));
      }
      return list.map((c) => ({ ...c, profiles: profMap.get(c.user_id) ?? null })) as Comment[];
    },
  });

  const { data: likeData } = useQuery({
    queryKey: ["likes", id, user?.id ?? "anon"],
    queryFn: async () => {
      const { count } = await supabase
        .from("likes")
        .select("*", { count: "exact", head: true })
        .eq("video_id", id);
      let liked = false;
      if (user) {
        const { data } = await supabase
          .from("likes")
          .select("video_id")
          .eq("video_id", id)
          .eq("user_id", user.id)
          .maybeSingle();
        liked = !!data;
      }
      return { count: count ?? 0, liked };
    },
  });

  // Realtime new comments
  useEffect(() => {
    const ch = supabase
      .channel(`comments:${id}`)
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "comments", filter: `video_id=eq.${id}` },
        () => qc.invalidateQueries({ queryKey: ["comments", id] }),
      )
      .subscribe();
    return () => {
      supabase.removeChannel(ch);
    };
  }, [id, qc]);

  const [text, setText] = useState("");
  const submitComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return navigate({ to: "/login" });
    const t = text.trim();
    if (!t) return;
    setText("");
    const { error } = await supabase.from("comments").insert({ video_id: id, user_id: user.id, content: t });
    if (error) toast.error(error.message);
  };

  const toggleLike = async () => {
    if (!user) return navigate({ to: "/login" });
    if (likeData?.liked) {
      await supabase.from("likes").delete().eq("video_id", id).eq("user_id", user.id);
    } else {
      await supabase.from("likes").insert({ video_id: id, user_id: user.id });
    }
    qc.invalidateQueries({ queryKey: ["likes", id] });
  };

  if (!video) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <SecondaryNav />
        <div className="grid min-h-[40vh] place-items-center text-muted-foreground">Loading…</div>
      </div>
    );
  }

  const isShort = video.is_short ?? false;

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <SecondaryNav />

      <main className="mx-auto w-full max-w-[1440px] px-4 pb-24 pt-5 md:px-6 md:pb-10">
        <div className="grid w-full min-w-0 grid-cols-1 gap-6 lg:grid-cols-[minmax(0,1fr)_360px]">
          <div className="space-y-5 min-w-0">
            {/* Player */}
            <div className={`lor-card overflow-hidden ${isShort ? "mx-auto w-full max-w-sm" : ""}`}>
              <div className={`relative w-full ${isShort ? "aspect-[9/16]" : "aspect-video"} bg-black`}>
                <iframe
                  className="absolute inset-0 h-full w-full"
                  src={`https://www.youtube.com/embed/${video.youtube_id}?autoplay=1&rel=0&modestbranding=1`}
                  title={video.title}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                />
              </div>
            </div>

            {/* Title + actions */}
            <div className="lor-card p-4 md:p-5">
              <h1 className="lor-display text-xl leading-tight md:text-2xl">{video.title}</h1>
              <div className="mt-3 flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="grid h-10 w-10 place-items-center rounded-full bg-primary text-sm font-bold text-primary-foreground">
                    {video.creator[0]}
                  </div>
                  <div>
                    <div className="flex items-center gap-1 text-sm font-semibold">
                      {video.creator} <Verified className="h-3.5 w-3.5" />
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {formatViews(video.views_count)} • {timeAgo(video.created_at)}
                    </div>
                  </div>
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  <button
                    onClick={toggleLike}
                    className={`flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-semibold transition-colors ${
                      likeData?.liked
                        ? "border-primary bg-primary text-primary-foreground"
                        : "border-border-strong text-foreground hover:border-primary"
                    }`}
                  >
                    <Heart className={`h-4 w-4 ${likeData?.liked ? "fill-current" : ""}`} />
                    {likeData?.count ?? 0}
                  </button>
                  <button
                    onClick={addToPlaylist}
                    className="flex items-center gap-2 rounded-full border border-border-strong bg-card px-4 py-2 text-sm font-semibold text-foreground transition hover:border-primary hover:bg-card/90"
                  >
                    <ListMusic className="h-4 w-4" />
                    Add to playlist
                  </button>
                </div>
              </div>
            </div>

            {/* Comments */}
            <section className="lor-card p-4 md:p-5">
              <h2 className="lor-section-label text-base">{comments.length} COMMENTS</h2>

              <form onSubmit={submitComment} className="mt-5 flex gap-3">
                <div className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-card text-xs font-bold text-foreground">
                  {(user?.email?.[0] ?? "?").toUpperCase()}
                </div>
                <div className="flex flex-1 items-center gap-2">
                  <input
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    placeholder={user ? "Add a comment…" : "Sign in to comment"}
                    onFocus={() => !user && navigate({ to: "/login" })}
                    className="h-10 w-full rounded-full border border-border bg-background px-4 text-sm focus:border-primary focus:outline-none"
                  />
                  <button
                    type="submit"
                    disabled={!text.trim()}
                    className="rounded-full bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground disabled:opacity-50"
                  >
                    Post
                  </button>
                </div>
              </form>

              <ul className="mt-6 space-y-5">
                {comments.map((c) => (
                  <li key={c.id} className="flex gap-3">
                    <div className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-card text-xs font-bold">
                      {(c.profiles?.display_name ?? c.profiles?.username ?? "U")[0]?.toUpperCase()}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 text-xs">
                        <span className="font-semibold text-foreground">
                          @{c.profiles?.username ?? "user"}
                        </span>
                        <span className="text-muted-foreground">{timeAgo(c.created_at)}</span>
                      </div>
                      <p className="mt-1 whitespace-pre-wrap text-sm text-foreground">{c.content}</p>
                    </div>
                  </li>
                ))}
                {!comments.length && (
                  <p className="text-sm text-muted-foreground">Be the first to drop a comment.</p>
                )}
              </ul>
            </section>
          </div>

          {/* Related */}
          <aside className="space-y-3 min-w-0">
            <h3 className="lor-section-label text-sm">UP NEXT</h3>
            {related.map((v) => (
              <Link
                key={v.id}
                to="/watch/$id"
                params={{ id: v.id }}
                className="group flex gap-3 rounded-md border border-transparent p-2 transition-colors hover:border-primary hover:bg-card"
              >
                <div className="lor-thumb relative h-[78px] w-[140px] shrink-0">
                  <img src={ytThumb(v.youtube_id)} alt={v.title} className="h-full w-full object-cover" />
                </div>
                <div className="min-w-0 flex-1">
                  <h4 className="lor-display line-clamp-2 text-[12px] leading-snug">{v.title}</h4>
                  <p className="mt-1 text-[11px] text-muted-foreground">{v.creator}</p>
                  <p className="text-[10px] text-muted-foreground">{formatViews(v.views_count)}</p>
                </div>
              </Link>
            ))}
          </aside>
        </div>

        <div className="mt-10">
          <h3 className="lor-section-label mb-4 text-base">MORE FROM THE LEAGUE</h3>
          <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
            {related.slice(0, 4).map((v) => (
              <VideoCard key={v.id} v={v} />
            ))}
          </div>
        </div>
      </main>

      <Footer />
      <MobileBottomNav />
    </div>
  );
}
