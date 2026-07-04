import { Link } from "@tanstack/react-router";
import { Home, Disc3, MessageCircle, Library, User } from "lucide-react";

const items = [
  { label: "Home", icon: Home, to: "/" },
  { label: "Beats", icon: Disc3, to: "/beats" },
  { label: "Library", icon: Library, to: "/library" },
  { label: "DMs", icon: MessageCircle, to: "/messages" },
  { label: "Me", icon: User, to: "/login" },
] as const;

export function MobileBottomNav() {
  return (
    <nav className="fixed inset-x-0 bottom-0 z-40 border-t border-border bg-background/95 backdrop-blur md:hidden">
      <ul className="grid grid-cols-5">
        {items.map(({ label, icon: Icon, to }) => (
          <li key={label}>
            <Link
              to={to}
              className="flex w-full flex-col items-center gap-1 py-2.5 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground"
              activeProps={{ className: "text-primary" }}
              activeOptions={{ exact: true }}
            >
              <Icon className="h-5 w-5" />
              {label}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}
