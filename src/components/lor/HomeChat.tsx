import { Link } from "@tanstack/react-router";
import { MessageCircle, Send } from "lucide-react";

const live = [
  { user: "DJ Kold", avatar: "K", color: "bg-red-600", text: "Yo who heard the new Jay Frost drop? 🔥🔥", time: "now" },
  { user: "BX Bars", avatar: "B", color: "bg-purple-600", text: "Cypher tonight 9pm EST, pull up.", time: "2m" },
  { user: "Tasha", avatar: "T", color: "bg-emerald-600", text: "Top 5 of the year, no debate.", time: "4m" },
  { user: "Marcus", avatar: "M", color: "bg-blue-600", text: "CPT scene is crazy right now 🇿🇦", time: "7m" },
];

export function HomeChat() {
  return (
    <section className="lor-card p-4 md:p-5">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="lor-section-label flex items-center gap-2 text-base">
          <MessageCircle className="h-4 w-4" /> COMMUNITY CHAT
        </h2>
        <Link to="/messages" className="text-xs font-bold uppercase tracking-wider text-primary hover:underline">
          Open Chat →
        </Link>
      </div>

      <div className="space-y-2.5">
        {live.map((m, i) => (
          <div key={i} className="flex items-start gap-3 rounded-md border border-border bg-surface p-2.5">
            <div className={`grid h-9 w-9 shrink-0 place-items-center rounded-full ${m.color} text-sm font-bold text-white`}>
              {m.avatar}
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-baseline gap-2">
                <span className="lor-display text-[13px]">{m.user}</span>
                <span className="text-[10px] text-muted-foreground">{m.time}</span>
              </div>
              <p className="text-sm text-foreground">{m.text}</p>
            </div>
          </div>
        ))}
      </div>

      <Link
        to="/messages"
        className="mt-3 flex items-center gap-2 rounded-full border border-border bg-background px-4 py-2.5 text-sm text-muted-foreground hover:border-primary"
      >
        <span className="flex-1">Join the conversation…</span>
        <Send className="h-4 w-4 text-primary" />
      </Link>
    </section>
  );
}
