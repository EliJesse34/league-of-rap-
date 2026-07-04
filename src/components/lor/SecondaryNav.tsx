import { Link } from "@tanstack/react-router";
import { Home, Music2, Flame, Mic, Swords, Radio, Crown, MessageCircle, Camera, Disc3, Library, Mail } from "lucide-react";

type Item =
  | { label: string; icon: any; to: "/"; params?: undefined }
  | { label: string; icon: any; to: "/contact"; params?: undefined }
  | { label: string; icon: any; to: "/messages"; params?: undefined }
  | { label: string; icon: any; to: "/upload"; params?: undefined }
  | { label: string; icon: any; to: "/live"; params?: undefined }
  | { label: string; icon: any; to: "/beats"; params?: undefined }
  | { label: string; icon: any; to: "/library"; params?: undefined }
  | { label: string; icon: any; to: "/producer/dashboard"; params?: undefined }
  | { label: string; icon: any; to: "/category/$slug"; params: { slug: string } };

const items: ReadonlyArray<Item> = [
  { label: "Home", icon: Home, to: "/" },
  { label: "Contact Us", icon: Mail, to: "/contact" },
  { label: "Beats", icon: Disc3, to: "/beats" },
  { label: "Music", icon: Music2, to: "/category/$slug", params: { slug: "music" } },
  { label: "Trending", icon: Flame, to: "/category/$slug", params: { slug: "trending" } },
  { label: "Freestyles", icon: Mic, to: "/category/$slug", params: { slug: "freestyles" } },
  { label: "Battle", icon: Swords, to: "/category/$slug", params: { slug: "battle" } },
  { label: "BTS", icon: Camera, to: "/category/$slug", params: { slug: "bts" } },
  { label: "Live", icon: Radio, to: "/live" },
  { label: "Library", icon: Library, to: "/library" },
  { label: "Producer", icon: Crown, to: "/producer/dashboard" },
  { label: "Messages", icon: MessageCircle, to: "/messages" },
];

export function SecondaryNav() {
  return (
    <nav className="border-b border-border bg-background">
      <div className="mx-auto flex max-w-[1440px] items-center gap-1 overflow-x-auto px-4 py-3 md:px-6 lor-scroll">
        {items.map(({ label, icon: Icon, to, params }) => (
          <Link
            key={label}
            to={to as any}
            params={params as any}
            activeOptions={{ exact: true }}
            className="flex shrink-0 items-center gap-2 rounded-md px-4 py-2 text-xs font-bold uppercase tracking-wider text-foreground transition-colors hover:bg-card hover:text-primary"
            activeProps={{ className: "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground" }}
          >
            <Icon className="h-4 w-4" />
            {label}
          </Link>
        ))}
      </div>
    </nav>
  );
}
