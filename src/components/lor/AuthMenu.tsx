import { Link, useNavigate } from "@tanstack/react-router";
import { LogOut, MessageCircle, User as UserIcon } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import { supabase } from "@/integrations/supabase/client";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export function AuthMenu() {
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  if (loading) return <div className="h-9 w-20 animate-pulse rounded-md bg-card" />;

  if (!user) {
    return (
      <div className="flex items-center gap-2">
        <Link
          to="/login"
          className="hidden rounded-md border border-border-strong px-4 py-2 text-sm font-semibold text-foreground hover:border-primary hover:text-primary md:inline-flex"
        >
          Login
        </Link>
        <Link
          to="/login?mode=signup"
          className="rounded-md bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground hover:opacity-90"
        >
          Sign Up
        </Link>
      </div>
    );
  }

  const initial = (user.user_metadata?.username || user.email || "U")[0]?.toUpperCase();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className="grid h-9 w-9 place-items-center rounded-full bg-primary text-sm font-bold text-primary-foreground">
          {initial}
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <div className="px-2 py-1.5 text-xs text-muted-foreground">{user.email}</div>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <Link to="/messages" className="flex items-center gap-2">
            <MessageCircle className="h-4 w-4" /> Messages
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem disabled>
          <UserIcon className="h-4 w-4" /> Profile
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onClick={async () => {
            await supabase.auth.signOut();
            navigate({ to: "/" });
          }}
        >
          <LogOut className="h-4 w-4" /> Sign out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
