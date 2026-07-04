import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import {
  Plus, Send, Search, MoreVertical, ArrowLeft, Paperclip, Smile, Check, CheckCheck,
  Users, MessageCircle, UserPlus, Shield, X,
} from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/use-auth";
import { Header } from "@/components/lor/Header";
import { MobileBottomNav } from "@/components/lor/MobileBottomNav";

export const Route = createFileRoute("/messages")({
  component: MessagesPage,
});

const WA = {
  sidebar: "#111B21",
  sidebarHeader: "#202C33",
  sidebarHover: "#202C33",
  sidebarActive: "#2A3942",
  border: "#222D34",
  chatBg: "#0B141A",
  chatHeader: "#202C33",
  bubbleOut: "#005C4B",
  bubbleIn: "#202C33",
  textPrimary: "#E9EDEF",
  textMuted: "#8696A0",
  green: "#00A884",
  unread: "#25D366",
};

type Profile = { id: string; username: string; display_name: string | null; avatar_url: string | null };
type Message = { id: string; conversation_id: string; sender_id: string; content: string; created_at: string };
type Conv = {
  id: string;
  last_message_at: string;
  is_group: boolean;
  name: string | null;
  owner_id: string | null;
  other: Profile | null;
};
type GroupRow = { id: string; name: string | null; description: string | null; owner_id: string | null; last_message_at: string };
type JoinRequest = { id: string; conversation_id: string; user_id: string; status: string; created_at: string };

function timeShort(iso: string) {
  return new Date(iso).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

function MessagesPage() {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const qc = useQueryClient();
  const [tab, setTab] = useState<"chats" | "people" | "groups">("chats");
  const [active, setActive] = useState<string | null>(null);
  const [text, setText] = useState("");
  const [search, setSearch] = useState("");
  const [showCreateGroup, setShowCreateGroup] = useState(false);
  const [showManage, setShowManage] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => { if (!loading && !user) navigate({ to: "/login" }); }, [loading, user, navigate]);

  // === Conversations (DMs + groups I'm a member of) ===
  const { data: convos = [] } = useQuery({
    enabled: !!user,
    queryKey: ["convos", user?.id],
    queryFn: async (): Promise<Conv[]> => {
      const { data: parts } = await supabase
        .from("conversation_participants")
        .select("conversation_id")
        .eq("user_id", user!.id);
      const ids = (parts ?? []).map((p: any) => p.conversation_id);
      if (!ids.length) return [];
      const { data: convs } = await supabase
        .from("conversations")
        .select("id, last_message_at, is_group, name, owner_id")
        .in("id", ids);
      // For DMs, find the other user
      const dmIds = (convs ?? []).filter((c: any) => !c.is_group).map((c: any) => c.id);
      const otherMap = new Map<string, Profile>();
      if (dmIds.length) {
        const { data: others } = await supabase
          .from("conversation_participants")
          .select("conversation_id, user_id")
          .in("conversation_id", dmIds)
          .neq("user_id", user!.id);
        const uids = Array.from(new Set((others ?? []).map((o: any) => o.user_id)));
        if (uids.length) {
          const { data: profs } = await supabase
            .from("profiles").select("id, username, display_name, avatar_url").in("id", uids);
          const pm = new Map<string, Profile>();
          (profs ?? []).forEach((p: any) => pm.set(p.id, p as Profile));
          (others ?? []).forEach((o: any) => {
            const p = pm.get(o.user_id);
            if (p) otherMap.set(o.conversation_id, p);
          });
        }
      }
      return (convs ?? [])
        .map((c: any) => ({
          id: c.id,
          last_message_at: c.last_message_at,
          is_group: c.is_group,
          name: c.name,
          owner_id: c.owner_id,
          other: otherMap.get(c.id) ?? null,
        }))
        .sort((a, b) => +new Date(b.last_message_at) - +new Date(a.last_message_at));
    },
  });

  // === Messages of active conversation ===
  const { data: messages = [] } = useQuery({
    enabled: !!active,
    queryKey: ["messages", active],
    queryFn: async () => {
      const { data } = await supabase
        .from("messages").select("*")
        .eq("conversation_id", active!).order("created_at", { ascending: true });
      return (data ?? []) as Message[];
    },
  });

  useEffect(() => {
    if (!active) return;
    const ch = supabase
      .channel(`msg:${active}`)
      .on("postgres_changes",
        { event: "INSERT", schema: "public", table: "messages", filter: `conversation_id=eq.${active}` },
        () => qc.invalidateQueries({ queryKey: ["messages", active] }))
      .subscribe();
    return () => { supabase.removeChannel(ch); };
  }, [active, qc]);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight });
  }, [messages.length, active]);

  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!active || !user) return;
    const t = text.trim();
    if (!t) return;
    setText("");
    const { error } = await supabase.from("messages").insert({ conversation_id: active, sender_id: user.id, content: t });
    if (error) return toast.error(error.message);
    await supabase.from("conversations").update({ last_message_at: new Date().toISOString() }).eq("id", active);
    qc.invalidateQueries({ queryKey: ["convos"] });
  };

  // === People search / browse ===
  const { data: people = [] } = useQuery({
    enabled: !!user && tab === "people",
    queryKey: ["people", search, user?.id],
    queryFn: async () => {
      let q = supabase.from("profiles")
        .select("id, username, display_name, avatar_url")
        .neq("id", user!.id).limit(30);
      if (search.trim()) q = q.or(`username.ilike.%${search.trim()}%,display_name.ilike.%${search.trim()}%`);
      const { data } = await q;
      return (data ?? []) as Profile[];
    },
  });

  // === Groups (discover) ===
  const { data: groups = [] } = useQuery({
    enabled: !!user && tab === "groups",
    queryKey: ["groups", search],
    queryFn: async () => {
      let q = supabase.from("conversations")
        .select("id, name, description, owner_id, last_message_at")
        .eq("is_group", true).order("last_message_at", { ascending: false }).limit(50);
      if (search.trim()) q = q.ilike("name", `%${search.trim()}%`);
      const { data } = await q;
      return (data ?? []) as GroupRow[];
    },
  });

  // My pending join requests
  const { data: myRequests = [] } = useQuery({
    enabled: !!user,
    queryKey: ["myRequests", user?.id],
    queryFn: async () => {
      const { data } = await supabase
        .from("group_join_requests").select("*").eq("user_id", user!.id);
      return (data ?? []) as JoinRequest[];
    },
  });

  // Active group's pending requests (if I'm owner)
  const activeConv = convos.find((c) => c.id === active);
  const amOwner = !!activeConv && activeConv.is_group && activeConv.owner_id === user?.id;

  const { data: pendingReqs = [], refetch: refetchPending } = useQuery({
    enabled: !!active && amOwner,
    queryKey: ["pending", active],
    queryFn: async () => {
      const { data } = await supabase
        .from("group_join_requests").select("*")
        .eq("conversation_id", active!).eq("status", "pending");
      const uids = (data ?? []).map((r: any) => r.user_id);
      const profs = new Map<string, Profile>();
      if (uids.length) {
        const { data: ps } = await supabase
          .from("profiles").select("id, username, display_name, avatar_url").in("id", uids);
        (ps ?? []).forEach((p: any) => profs.set(p.id, p as Profile));
      }
      return ((data ?? []) as JoinRequest[]).map((r) => ({ ...r, profile: profs.get(r.user_id) ?? null }));
    },
  });

  const startDM = async (other: Profile) => {
    if (!user) return;
    const { data: mine } = await supabase.from("conversation_participants").select("conversation_id").eq("user_id", user.id);
    const myIds = (mine ?? []).map((m: any) => m.conversation_id);
    if (myIds.length) {
      const { data: theirs } = await supabase
        .from("conversation_participants").select("conversation_id")
        .eq("user_id", other.id).in("conversation_id", myIds);
      if (theirs && theirs.length) {
        // make sure not a group
        const { data: cs } = await supabase.from("conversations")
          .select("id, is_group").in("id", theirs.map((t: any) => t.conversation_id));
        const dm = (cs ?? []).find((c: any) => !c.is_group);
        if (dm) { setTab("chats"); setActive(dm.id); return; }
      }
    }
    const { data: conv, error } = await supabase
      .from("conversations").insert({ is_group: false }).select().single();
    if (error || !conv) return toast.error(error?.message ?? "Failed");
    const { error: pErr } = await supabase.from("conversation_participants").insert([
      { conversation_id: conv.id, user_id: user.id },
      { conversation_id: conv.id, user_id: other.id },
    ]);
    if (pErr) return toast.error(pErr.message);
    qc.invalidateQueries({ queryKey: ["convos"] });
    setTab("chats");
    setActive(conv.id);
  };

  const requestStatusFor = (gid: string) =>
    myRequests.find((r) => r.conversation_id === gid)?.status as ("pending" | "approved" | "rejected" | undefined);

  const isMember = (gid: string) => convos.some((c) => c.id === gid);

  const requestJoin = async (g: GroupRow) => {
    if (!user) return;
    if (g.owner_id === user.id) return; // already owner
    const { error } = await supabase
      .from("group_join_requests").insert({ conversation_id: g.id, user_id: user.id, status: "pending" });
    if (error) return toast.error(error.message);
    toast.success("Request sent to group admin");
    qc.invalidateQueries({ queryKey: ["myRequests"] });
  };

  const decideRequest = async (reqId: string, approve: boolean) => {
    const fn = approve ? "approve_group_request" : "reject_group_request";
    const { error } = await supabase.rpc(fn as any, { _request_id: reqId });
    if (error) return toast.error(error.message);
    toast.success(approve ? "Member added" : "Request rejected");
    refetchPending();
    qc.invalidateQueries({ queryKey: ["convos"] });
  };

  if (!user) return null;

  const chatPattern = "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='120' height='120' viewBox='0 0 120 120'><g fill='%23ffffff' fill-opacity='0.025'><circle cx='20' cy='20' r='2'/><circle cx='60' cy='40' r='1.5'/><circle cx='100' cy='80' r='2'/><circle cx='40' cy='100' r='1.5'/></g></svg>\")";

  return (
    <div className="min-h-screen" style={{ background: WA.chatBg }}>
      <Header />
      <main className="mx-auto max-w-[1440px] px-0 pb-24 md:px-6 md:py-5">
        <div className="grid h-[calc(100vh-160px)] grid-cols-1 overflow-hidden md:grid-cols-[380px_1fr] md:rounded-md" style={{ border: `1px solid ${WA.border}` }}>
          {/* Sidebar */}
          <aside className={`flex flex-col ${active ? "hidden md:flex" : "flex"}`} style={{ background: WA.sidebar, borderRight: `1px solid ${WA.border}`, color: WA.textPrimary }}>
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3" style={{ background: WA.sidebarHeader }}>
              <div className="flex items-center gap-3">
                <div className="grid h-10 w-10 place-items-center rounded-full text-sm font-bold text-white" style={{ background: WA.green }}>
                  {(user.email ?? "?")[0]?.toUpperCase()}
                </div>
                <span className="font-semibold">Messages</span>
              </div>
              <div className="flex items-center gap-1">
                {tab === "groups" && (
                  <button onClick={() => setShowCreateGroup(true)} className="grid h-9 w-9 place-items-center rounded-full hover:bg-white/5" style={{ color: WA.textMuted }} aria-label="Create group">
                    <Plus className="h-5 w-5" />
                  </button>
                )}
                <button className="grid h-9 w-9 place-items-center rounded-full hover:bg-white/5" style={{ color: WA.textMuted }}>
                  <MoreVertical className="h-5 w-5" />
                </button>
              </div>
            </div>

            {/* Tabs */}
            <div className="flex border-b" style={{ borderColor: WA.border, background: WA.sidebar }}>
              {([
                { k: "chats", label: "Chats", icon: MessageCircle },
                { k: "people", label: "People", icon: UserPlus },
                { k: "groups", label: "Groups", icon: Users },
              ] as const).map((t) => {
                const Icon = t.icon;
                const sel = tab === t.k;
                return (
                  <button key={t.k} onClick={() => { setTab(t.k); setSearch(""); }}
                    className="flex flex-1 items-center justify-center gap-1.5 py-2.5 text-xs font-semibold transition"
                    style={{ color: sel ? WA.green : WA.textMuted, borderBottom: sel ? `2px solid ${WA.green}` : "2px solid transparent" }}>
                    <Icon className="h-4 w-4" /> {t.label}
                  </button>
                );
              })}
            </div>

            {/* Search */}
            {(tab === "people" || tab === "groups") && (
              <div className="px-3 py-2" style={{ background: WA.sidebar }}>
                <div className="relative">
                  <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2" style={{ color: WA.textMuted }} />
                  <input value={search} onChange={(e) => setSearch(e.target.value)}
                    placeholder={tab === "people" ? "Find users by name or @handle" : "Search groups"}
                    className="h-9 w-full rounded-lg pl-10 pr-3 text-sm outline-none"
                    style={{ background: WA.sidebarHeader, color: WA.textPrimary }} />
                </div>
              </div>
            )}

            {/* Lists */}
            <div className="flex-1 overflow-y-auto">
              {tab === "chats" && (
                <ul>
                  {convos.map((c) => {
                    const sel = active === c.id;
                    const title = c.is_group ? (c.name ?? "Group") : (c.other?.display_name ?? c.other?.username ?? "Unknown");
                    const initial = (title[0] ?? "?").toUpperCase();
                    return (
                      <li key={c.id}>
                        <button onClick={() => setActive(c.id)} className="flex w-full items-center gap-3 px-3 py-3 text-left transition-colors" style={{ background: sel ? WA.sidebarActive : "transparent" }}>
                          <div className="grid h-12 w-12 shrink-0 place-items-center rounded-full text-base font-bold text-white" style={{ background: c.is_group ? "#6B4FBB" : WA.green }}>
                            {c.is_group ? <Users className="h-5 w-5" /> : initial}
                          </div>
                          <div className="min-w-0 flex-1 border-b pb-3" style={{ borderColor: WA.border }}>
                            <div className="flex items-center justify-between gap-2">
                              <span className="truncate text-[15px] font-semibold">{title}</span>
                              <span className="shrink-0 text-[11px]" style={{ color: WA.textMuted }}>{timeShort(c.last_message_at)}</span>
                            </div>
                            <div className="truncate text-xs" style={{ color: WA.textMuted }}>
                              {c.is_group ? "Group chat" : "Tap to view conversation"}
                            </div>
                          </div>
                        </button>
                      </li>
                    );
                  })}
                  {!convos.length && (
                    <li className="p-4 text-sm" style={{ color: WA.textMuted }}>
                      No chats yet. Find people or join groups to get started.
                    </li>
                  )}
                </ul>
              )}

              {tab === "people" && (
                <ul>
                  {people.map((p) => (
                    <li key={p.id}>
                      <button onClick={() => startDM(p)} className="flex w-full items-center gap-3 px-3 py-2.5 text-left hover:bg-white/5">
                        <div className="grid h-11 w-11 place-items-center rounded-full text-sm font-bold text-white" style={{ background: WA.green }}>
                          {p.username[0]?.toUpperCase()}
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="truncate text-sm font-semibold">{p.display_name ?? p.username}</div>
                          <div className="truncate text-xs" style={{ color: WA.textMuted }}>@{p.username}</div>
                        </div>
                        <MessageCircle className="h-4 w-4 shrink-0" style={{ color: WA.green }} />
                      </button>
                    </li>
                  ))}
                  {!people.length && (
                    <li className="p-4 text-sm" style={{ color: WA.textMuted }}>No users found.</li>
                  )}
                </ul>
              )}

              {tab === "groups" && (
                <ul>
                  {groups.map((g) => {
                    const status = requestStatusFor(g.id);
                    const member = isMember(g.id);
                    return (
                      <li key={g.id} className="border-b" style={{ borderColor: WA.border }}>
                        <div className="flex items-start gap-3 px-3 py-3">
                          <div className="grid h-11 w-11 shrink-0 place-items-center rounded-full text-white" style={{ background: "#6B4FBB" }}>
                            <Users className="h-5 w-5" />
                          </div>
                          <div className="min-w-0 flex-1">
                            <div className="truncate text-sm font-semibold">{g.name ?? "Untitled group"}</div>
                            <div className="line-clamp-2 text-xs" style={{ color: WA.textMuted }}>
                              {g.description ?? "No description"}
                            </div>
                            <div className="mt-2">
                              {member ? (
                                <button onClick={() => { setTab("chats"); setActive(g.id); }}
                                  className="rounded-full px-3 py-1 text-[11px] font-semibold" style={{ background: WA.green, color: "#0B141A" }}>
                                  Open chat
                                </button>
                              ) : status === "pending" ? (
                                <span className="rounded-full px-3 py-1 text-[11px] font-semibold" style={{ background: WA.sidebarActive, color: WA.textMuted }}>
                                  Request pending
                                </span>
                              ) : status === "rejected" ? (
                                <span className="rounded-full px-3 py-1 text-[11px] font-semibold" style={{ background: "#3a1f1f", color: "#ff8a8a" }}>
                                  Rejected
                                </span>
                              ) : (
                                <button onClick={() => requestJoin(g)}
                                  className="rounded-full px-3 py-1 text-[11px] font-semibold" style={{ background: WA.green, color: "#0B141A" }}>
                                  Request to join
                                </button>
                              )}
                            </div>
                          </div>
                        </div>
                      </li>
                    );
                  })}
                  {!groups.length && (
                    <li className="p-4 text-sm" style={{ color: WA.textMuted }}>
                      No groups yet. Tap + to create one.
                    </li>
                  )}
                </ul>
              )}
            </div>
          </aside>

          {/* Thread */}
          <section className={`flex flex-col ${active ? "flex" : "hidden md:flex"}`}
            style={{ background: WA.chatBg, backgroundImage: chatPattern, color: WA.textPrimary }}>
            {!active ? (
              <div className="grid flex-1 place-items-center px-8 text-center">
                <div>
                  <div className="mx-auto grid h-24 w-24 place-items-center rounded-full" style={{ background: WA.sidebarHeader }}>
                    <Send className="h-10 w-10" style={{ color: WA.green }} />
                  </div>
                  <h2 className="mt-6 text-2xl font-light">League of Rap Chat</h2>
                  <p className="mt-2 text-sm" style={{ color: WA.textMuted }}>
                    DM other fans, browse people, or join community groups.
                  </p>
                </div>
              </div>
            ) : (
              <>
                {/* Chat header */}
                <div className="flex items-center gap-3 px-4 py-2.5" style={{ background: WA.chatHeader, borderBottom: `1px solid ${WA.border}` }}>
                  <button onClick={() => setActive(null)} className="md:hidden"><ArrowLeft className="h-5 w-5" /></button>
                  <div className="grid h-10 w-10 shrink-0 place-items-center rounded-full text-sm font-bold text-white" style={{ background: activeConv?.is_group ? "#6B4FBB" : WA.green }}>
                    {activeConv?.is_group ? <Users className="h-5 w-5" /> : (activeConv?.other?.username ?? "?")[0]?.toUpperCase()}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="truncate text-[15px] font-semibold">
                      {activeConv?.is_group ? (activeConv.name ?? "Group") : (activeConv?.other?.display_name ?? activeConv?.other?.username ?? "Conversation")}
                    </div>
                    <div className="text-[11px]" style={{ color: WA.textMuted }}>
                      {activeConv?.is_group ? "Group chat" : "online"}
                    </div>
                  </div>
                  {amOwner && (
                    <button onClick={() => setShowManage(true)} className="flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold" style={{ background: WA.sidebarActive, color: WA.textPrimary }}>
                      <Shield className="h-3.5 w-3.5" /> Manage
                      {pendingReqs.length > 0 && (
                        <span className="rounded-full px-1.5 text-[10px]" style={{ background: WA.unread, color: "#0B141A" }}>{pendingReqs.length}</span>
                      )}
                    </button>
                  )}
                </div>

                {/* Messages */}
                <div ref={scrollRef} className="flex-1 space-y-1.5 overflow-y-auto px-4 py-4 md:px-12">
                  {messages.map((m, idx) => {
                    const mine = m.sender_id === user.id;
                    const prev = messages[idx - 1];
                    const grouped = prev && prev.sender_id === m.sender_id;
                    return (
                      <div key={m.id} className={`flex ${mine ? "justify-end" : "justify-start"}`}>
                        <div className={`relative max-w-[72%] px-2.5 pb-1.5 pt-1.5 text-sm shadow-sm ${mine ? (grouped ? "rounded-lg" : "rounded-lg rounded-tr-sm") : (grouped ? "rounded-lg" : "rounded-lg rounded-tl-sm")}`}
                          style={{ background: mine ? WA.bubbleOut : WA.bubbleIn, color: WA.textPrimary }}>
                          <p className="whitespace-pre-wrap break-words pr-12 leading-snug">{m.content}</p>
                          <span className="absolute bottom-1 right-2 flex items-center gap-0.5 text-[10px]" style={{ color: mine ? "rgba(233,237,239,0.6)" : WA.textMuted }}>
                            {timeShort(m.created_at)}
                            {mine && <CheckCheck className="h-3 w-3" style={{ color: "#53BDEB" }} />}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                  {!messages.length && (
                    <div className="mx-auto w-fit rounded-md px-3 py-1.5 text-[11px]" style={{ background: WA.sidebarHeader, color: WA.textMuted }}>
                      Say what's up 👋
                    </div>
                  )}
                </div>

                {/* Composer */}
                <form onSubmit={sendMessage} className="flex items-center gap-2 px-3 py-2.5" style={{ background: WA.chatHeader }}>
                  <button type="button" className="grid h-10 w-10 place-items-center rounded-full hover:bg-white/5" style={{ color: WA.textMuted }}><Smile className="h-5 w-5" /></button>
                  <button type="button" className="grid h-10 w-10 place-items-center rounded-full hover:bg-white/5" style={{ color: WA.textMuted }}><Paperclip className="h-5 w-5" /></button>
                  <input value={text} onChange={(e) => setText(e.target.value)} placeholder="Type a message"
                    className="h-10 flex-1 rounded-lg px-4 text-sm outline-none" style={{ background: WA.bubbleIn, color: WA.textPrimary }} />
                  <button type="submit" disabled={!text.trim()}
                    className="grid h-10 w-10 place-items-center rounded-full text-white disabled:opacity-50" style={{ background: WA.green }}>
                    {text.trim() ? <Send className="h-4 w-4" /> : <Check className="h-4 w-4" />}
                  </button>
                </form>
              </>
            )}
          </section>
        </div>
      </main>
      <MobileBottomNav />

      {/* Create group modal */}
      {showCreateGroup && (
        <CreateGroupModal
          onClose={() => setShowCreateGroup(false)}
          onCreated={(id) => {
            setShowCreateGroup(false);
            qc.invalidateQueries({ queryKey: ["convos"] });
            qc.invalidateQueries({ queryKey: ["groups"] });
            setTab("chats");
            setActive(id);
          }}
          userId={user.id}
        />
      )}

      {/* Manage requests modal */}
      {showManage && amOwner && (
        <div className="fixed inset-0 z-50 grid place-items-center bg-black/60 p-4" onClick={() => setShowManage(false)}>
          <div className="w-full max-w-md rounded-lg p-5" style={{ background: WA.sidebarHeader, color: WA.textPrimary }} onClick={(e) => e.stopPropagation()}>
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-lg font-semibold">Join requests</h3>
              <button onClick={() => setShowManage(false)}><X className="h-5 w-5" /></button>
            </div>
            <div className="max-h-[60vh] space-y-2 overflow-y-auto">
              {pendingReqs.length === 0 && (
                <p className="text-sm" style={{ color: WA.textMuted }}>No pending requests.</p>
              )}
              {pendingReqs.map((r: any) => (
                <div key={r.id} className="flex items-center gap-3 rounded-md p-2" style={{ background: WA.sidebar }}>
                  <div className="grid h-10 w-10 place-items-center rounded-full text-sm font-bold text-white" style={{ background: WA.green }}>
                    {(r.profile?.username ?? "?")[0]?.toUpperCase()}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="truncate text-sm font-semibold">{r.profile?.display_name ?? r.profile?.username ?? "User"}</div>
                    <div className="truncate text-xs" style={{ color: WA.textMuted }}>@{r.profile?.username}</div>
                  </div>
                  <button onClick={() => decideRequest(r.id, true)} className="rounded-md px-3 py-1.5 text-xs font-semibold text-black" style={{ background: WA.green }}>Approve</button>
                  <button onClick={() => decideRequest(r.id, false)} className="rounded-md px-3 py-1.5 text-xs font-semibold" style={{ background: "#3a1f1f", color: "#ff8a8a" }}>Reject</button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function CreateGroupModal({ onClose, onCreated, userId }: { onClose: () => void; onCreated: (id: string) => void; userId: string }) {
  const [name, setName] = useState("");
  const [desc, setDesc] = useState("");
  const [busy, setBusy] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    const n = name.trim();
    if (!n) return toast.error("Name required");
    setBusy(true);
    const { data: conv, error } = await supabase
      .from("conversations")
      .insert({ is_group: true, name: n, description: desc.trim() || null, owner_id: userId } as any)
      .select().single();
    if (error || !conv) { setBusy(false); return toast.error(error?.message ?? "Failed"); }
    const { error: pErr } = await supabase.from("conversation_participants")
      .insert({ conversation_id: conv.id, user_id: userId });
    setBusy(false);
    if (pErr) return toast.error(pErr.message);
    toast.success("Group created");
    onCreated(conv.id);
  };

  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-black/60 p-4" onClick={onClose}>
      <form onSubmit={submit} className="w-full max-w-md rounded-lg p-5" style={{ background: WA.sidebarHeader, color: WA.textPrimary }} onClick={(e) => e.stopPropagation()}>
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-lg font-semibold">Create group</h3>
          <button type="button" onClick={onClose}><X className="h-5 w-5" /></button>
        </div>
        <label className="mb-2 block text-xs font-semibold" style={{ color: WA.textMuted }}>Group name</label>
        <input value={name} onChange={(e) => setName(e.target.value)} maxLength={80}
          className="mb-3 h-10 w-full rounded-md px-3 text-sm outline-none" style={{ background: WA.sidebar }} />
        <label className="mb-2 block text-xs font-semibold" style={{ color: WA.textMuted }}>Description (optional)</label>
        <textarea value={desc} onChange={(e) => setDesc(e.target.value)} maxLength={300} rows={3}
          className="mb-4 w-full rounded-md px-3 py-2 text-sm outline-none" style={{ background: WA.sidebar }} />
        <button disabled={busy} className="h-10 w-full rounded-md text-sm font-semibold text-black disabled:opacity-50" style={{ background: WA.green }}>
          {busy ? "Creating…" : "Create group"}
        </button>
      </form>
    </div>
  );
}
