import { Sparkles } from "lucide-react";
import { Link } from "@tanstack/react-router";

interface AppLogoProps {
  compact?: boolean;
}

export function AppLogo({ compact = false }: AppLogoProps) {
  return (
    <Link to="/admin" className="flex items-center gap-3 rounded-xl px-2 py-2 transition-colors hover:bg-white/5">
      <div className="grid h-10 w-10 place-items-center rounded-xl bg-gradient-to-br from-[#D4AF37] to-[#f6db84] text-sm font-black text-slate-950 shadow-lg shadow-[#D4AF37]/20">
        <Sparkles className="h-5 w-5" />
      </div>
      {!compact && (
        <div className="min-w-0">
          <p className="text-sm font-semibold tracking-[0.2em] text-white/90">LEAGUEOF</p>
          <p className="text-[11px] font-medium uppercase tracking-[0.25em] text-[#D4AF37]">ADMIN</p>
        </div>
      )}
    </Link>
  );
}
