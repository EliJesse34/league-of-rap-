import { Link } from "@tanstack/react-router";
import { Music2, Mic, MessageSquare, Camera, Film, Swords, Radio, Check } from "lucide-react";
import { ContactSection } from "./ContactSection";

const trending = [
  { title: "JAY FROST — COLD WORLD", views: "325K views" },
  { title: "RICH REAL — NO LOVE", views: "214K views" },
  { title: "LIL ACE — OUT THE MUD", views: "189K views" },
  { title: "YOUNG KING — 100 BARS", views: "152K views" },
  { title: "FAST LIFE — STREET DREAMS", views: "98K views" },
];

const cats = [
  { label: "Music Videos", icon: Music2, slug: "music" },
  { label: "Freestyles", icon: Mic, slug: "freestyles" },
  { label: "Interviews", icon: MessageSquare, slug: "interviews" },
  { label: "Behind The Scenes", icon: Camera, slug: "bts" },
  { label: "Vlogs", icon: Film, slug: "vlogs" },
  { label: "Battle Rap", icon: Swords, slug: "battle" },
  { label: "Live Performances", icon: Radio, slug: "live" },
] as const;

export function RightSidebar() {
  return (
    <aside className="space-y-5">
      <section className="lor-card p-4">
        <h3 className="lor-section-label text-sm">TRENDING VIDEOS</h3>
        <ol className="mt-4 space-y-3">
          {trending.map((v, i) => (
            <li key={v.title} className="flex items-start gap-3">
              <span className="lor-display w-5 shrink-0 text-lg leading-none text-muted-foreground">{i + 1}</span>
              <div className="min-w-0">
                <p className="lor-display line-clamp-2 text-[12px] leading-tight">{v.title}</p>
                <p className="mt-0.5 text-[11px] text-muted-foreground">{v.views}</p>
              </div>
            </li>
          ))}
        </ol>
      </section>

      <section className="lor-card p-4">
        <h3 className="lor-section-label text-sm">CATEGORIES</h3>
        <ul className="mt-4 space-y-2.5">
          {cats.map(({ label, icon: Icon, slug }) => (
            <li key={slug}>
              <Link
                to="/category/$slug"
                params={{ slug }}
                className="flex items-center gap-2.5 text-sm text-foreground hover:text-primary"
              >
                <Icon className="h-4 w-4 text-muted-foreground" />
                {label}
              </Link>
            </li>
          ))}
          <li className="pt-1">
            <Link to="/category/$slug" params={{ slug: "music" }} className="text-sm font-semibold text-primary hover:underline">
              View All Categories
            </Link>
          </li>
        </ul>
      </section>

      <section className="lor-card p-4">
        <h3 className="lor-section-label text-sm">SUBSCRIPTION</h3>
        <p className="mt-3 text-sm text-foreground">Upload your videos and grow your audience</p>
        <ul className="mt-3 space-y-2 text-sm">
          {["Upload Videos", "Custom Channel", "Monetize Your Content", "Priority Support"].map((f) => (
            <li key={f} className="flex items-center gap-2 text-foreground">
              <Check className="h-4 w-4 text-primary" />
              {f}
            </li>
          ))}
        </ul>
        <Link to="/upload" className="mt-4 block w-full rounded-md bg-primary py-2.5 text-center text-sm font-bold uppercase tracking-wider text-primary-foreground hover:opacity-90">
          Get Started
        </Link>
      </section>

      <ContactSection />
    </aside>
  );
}
