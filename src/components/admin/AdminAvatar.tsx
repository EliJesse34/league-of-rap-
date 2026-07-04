import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export function AdminAvatar() {
  return (
    <div className="flex items-center gap-3 rounded-full border border-white/10 bg-white/5 px-2 py-2">
      <Avatar className="h-9 w-9 border border-[#D4AF37]/30">
        <AvatarImage src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80" alt="Admin" />
        <AvatarFallback className="bg-[#D4AF37]/20 text-[#f6db84]">AR</AvatarFallback>
      </Avatar>
      <div className="hidden text-left sm:block">
        <p className="text-sm font-semibold text-white">Ari Reyes</p>
        <p className="text-[11px] uppercase tracking-[0.2em] text-muted-foreground">Super Admin</p>
      </div>
    </div>
  );
}
