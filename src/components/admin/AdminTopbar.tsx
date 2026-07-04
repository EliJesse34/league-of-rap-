import { Bell, Menu, MessageSquareText, MoonStar, Search, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { AdminAvatar } from "./AdminAvatar";

interface AdminTopbarProps {
  onOpenSidebar: () => void;
  onToggleCollapse: () => void;
  collapsed: boolean;
}

export function AdminTopbar({ onOpenSidebar, onToggleCollapse, collapsed }: AdminTopbarProps) {
  return (
    <header className="sticky top-0 z-20 border-b border-white/10 bg-[#060916]/80 px-4 py-3 backdrop-blur-xl md:px-6">
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <Button variant="outline" size="icon" className="border-white/10 bg-white/5 text-white lg:hidden" onClick={onOpenSidebar}>
            <Menu className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="icon" className="hidden border-white/10 bg-white/5 text-white lg:inline-flex" onClick={onToggleCollapse}>
            {collapsed ? <Sparkles className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
          </Button>
          <div className="relative hidden min-w-[260px] md:block">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input placeholder="Search dashboards, users, content" className="border-white/10 bg-white/5 pl-9 text-sm text-white placeholder:text-muted-foreground" />
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="outline" size="icon" className="border-white/10 bg-white/5 text-white">
            <Bell className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="icon" className="border-white/10 bg-white/5 text-white">
            <MessageSquareText className="h-4 w-4" />
          </Button>
          <Button variant="outline" className="hidden border-white/10 bg-white/5 text-sm text-white md:inline-flex">
            <Sparkles className="mr-2 h-4 w-4 text-[#D4AF37]" />
            Quick Actions
          </Button>
          <Button variant="outline" size="icon" className="border-white/10 bg-white/5 text-white">
            <MoonStar className="h-4 w-4" />
          </Button>
          <AdminAvatar />
        </div>
      </div>
    </header>
  );
}
