import { Outlet, useLocation } from "@tanstack/react-router";
import { motion } from "framer-motion";
import type { ReactNode } from "react";
import { useState } from "react";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { AdminSidebar } from "./AdminSidebar";
import { AdminTopbar } from "./AdminTopbar";
import { cn } from "@/lib/utils";

interface AdminLayoutProps {
  children?: ReactNode;
}

export function AdminLayout({ children }: AdminLayoutProps) {
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top,_rgba(212,175,55,0.16),_transparent_40%),linear-gradient(135deg,_#030711_0%,_#0d1427_45%,_#050816_100%)] text-foreground">
      <div className="mx-auto flex min-h-screen max-w-7xl">
        <aside className={cn("hidden border-r border-white/10 lg:block", collapsed ? "w-[88px]" : "w-[280px]")}>
          <div className="h-full">
            <AdminSidebar collapsed={collapsed} />
          </div>
        </aside>

        <div className="flex min-h-screen flex-1 flex-col">
          <AdminTopbar onOpenSidebar={() => setMobileOpen(true)} onToggleCollapse={() => setCollapsed((value) => !value)} collapsed={collapsed} />

          <main className="flex-1 overflow-auto px-4 py-4 md:px-6 lg:px-8">
            <motion.div
              key={location.pathname}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2 }}
              className="mx-auto max-w-6xl"
            >
              {children ?? <Outlet />}
            </motion.div>
          </main>
        </div>
      </div>

      <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
        <SheetContent side="left" className="w-[280px] border-r border-white/10 bg-[#050816]/95 p-0 backdrop-blur-xl">
          <AdminSidebar collapsed={false} onNavigate={() => setMobileOpen(false)} />
        </SheetContent>
      </Sheet>
    </div>
  );
}
