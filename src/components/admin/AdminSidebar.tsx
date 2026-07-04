import type { LucideIcon } from "lucide-react";
import { BarChart3, BellDot, BookOpen, Boxes, Crown, FileText, Flag, Gavel, HelpCircle, LayoutGrid, LogOut, MessageSquareText, Music2, PlayCircle, RadioTower, Settings2, ShieldCheck, Sparkles, Users2, Video, WandSparkles } from "lucide-react";
import { Link, useLocation } from "@tanstack/react-router";
import { cn } from "@/lib/utils";
import { AppLogo } from "./AppLogo";

interface NavItem {
  label: string;
  href: string;
  icon: LucideIcon;
}

interface NavGroup {
  title: string;
  items: NavItem[];
}

const NAV_GROUPS: NavGroup[] = [
  {
    title: "Overview",
    items: [{ label: "Dashboard", href: "/admin", icon: LayoutGrid }],
  },
  {
    title: "Content",
    items: [
      { label: "Songs", href: "/admin/content/songs", icon: Music2 },
      { label: "Beats", href: "/admin/content/beats", icon: RadioTower },
      { label: "Videos", href: "/admin/content/videos", icon: Video },
      { label: "Albums", href: "/admin/content/albums", icon: Boxes },
      { label: "Playlists", href: "/admin/content/playlists", icon: PlayCircle },
      { label: "Genres", href: "/admin/content/genres", icon: WandSparkles },
    ],
  },
  {
    title: "Moderation",
    items: [
      { label: "Verification Center", href: "/admin/moderation/verification", icon: ShieldCheck },
      { label: "Reports", href: "/admin/moderation/reports", icon: Flag },
      { label: "Comments", href: "/admin/moderation/comments", icon: MessageSquareText },
    ],
  },
  {
    title: "Community",
    items: [
      { label: "Users", href: "/admin/community/users", icon: Users2 },
      { label: "Artists", href: "/admin/community/artists", icon: Sparkles },
    ],
  },
  {
    title: "Business",
    items: [
      { label: "Payments", href: "/admin/business/payments", icon: Crown },
      { label: "Advertisements", href: "/admin/business/advertisements", icon: BellDot },
    ],
  },
  {
    title: "Management",
    items: [
      { label: "Analytics", href: "/admin/analytics", icon: BarChart3 },
      { label: "Blog", href: "/admin/content-management/blog", icon: FileText },
      { label: "Announcements", href: "/admin/content-management/announcements", icon: BookOpen },
    ],
  },
  {
    title: "System",
    items: [
      { label: "Settings", href: "/admin/system/settings", icon: Settings2 },
      { label: "Security", href: "/admin/system/security", icon: ShieldCheck },
      { label: "Audit Logs", href: "/admin/system/audit-logs", icon: Gavel },
    ],
  },
];

interface AdminSidebarProps {
  collapsed?: boolean;
  onNavigate?: () => void;
}

export function AdminSidebar({ collapsed = false, onNavigate }: AdminSidebarProps) {
  const location = useLocation();

  const isActive = (href: string) => {
    if (href === "/admin") {
      return location.pathname === "/admin" || location.pathname === "/admin/";
    }
    return location.pathname === href || location.pathname.startsWith(`${href}/`);
  };

  return (
    <div className="flex h-full flex-col bg-[#050816]/95 px-4 py-5 text-sm text-muted-foreground backdrop-blur-xl">
      <div className="mb-6 px-2">
        <AppLogo compact={collapsed} />
      </div>

      <div className="flex-1 space-y-5 overflow-y-auto pr-1">
        {NAV_GROUPS.map((group) => (
          <div key={group.title}>
            <p className={cn("mb-2 px-3 text-[10px] font-semibold uppercase tracking-[0.28em] text-white/35", collapsed && "sr-only")}>{group.title}</p>
            <div className="space-y-1">
              {group.items.map((item) => {
                const Icon = item.icon;
                const active = isActive(item.href);

                return (
                  <Link
                    key={item.href}
                    to={item.href}
                    onClick={onNavigate}
                    className={cn(
                      "flex items-center gap-3 rounded-2xl border px-3 py-2.5 transition-all duration-200",
                      active
                        ? "border-[#D4AF37]/30 bg-[#D4AF37]/15 text-[#f6db84] shadow-[0_8px_20px_rgba(212,175,55,0.14)]"
                        : "border-transparent text-muted-foreground hover:border-white/10 hover:bg-white/5 hover:text-white",
                      collapsed && "justify-center px-2",
                    )}
                  >
                    <Icon className="h-4 w-4 shrink-0" />
                    {!collapsed && <span className="truncate text-sm font-medium">{item.label}</span>}
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6 space-y-2 border-t border-white/10 pt-4">
        <Link to="/admin/help" onClick={onNavigate} className={cn("flex items-center gap-3 rounded-2xl px-3 py-2.5 text-muted-foreground transition-colors hover:bg-white/5 hover:text-white", collapsed && "justify-center px-2")}> 
          <HelpCircle className="h-4 w-4" />
          {!collapsed && <span className="text-sm font-medium">Help</span>}
        </Link>
        <Link to="/admin/logout" onClick={onNavigate} className={cn("flex items-center gap-3 rounded-2xl px-3 py-2.5 text-muted-foreground transition-colors hover:bg-white/5 hover:text-white", collapsed && "justify-center px-2")}> 
          <LogOut className="h-4 w-4" />
          {!collapsed && <span className="text-sm font-medium">Logout</span>}
        </Link>
      </div>
    </div>
  );
}
