import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/reset-password")({
  component: ResetPasswordPage,
});

function ResetPasswordPage() {
  const [email, setEmail] = useState("");
  const [busy, setBusy] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    try {
      const appOrigin = import.meta.env.VITE_SITE_URL ?? import.meta.env.VITE_PUBLIC_URL ?? window.location.origin;
      const redirectTo = `${appOrigin}/login?mode=signin`;
      const { error } = await supabase.auth.resetPasswordForEmail(email, { redirectTo });
      if (error) throw error;
      toast.success("Check your email for password reset instructions.");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Unable to send reset email");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="grid min-h-screen place-items-center bg-background px-4">
      <div className="lor-card w-full max-w-md p-8">
        <h1 className="lor-display text-center text-2xl mb-2">Reset your password</h1>
        <p className="text-center text-sm text-muted-foreground mb-6">Enter your account email and we’ll send instructions to reset your password.</p>

        <form onSubmit={submit} className="space-y-3">
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
            className="h-10 w-full rounded-md border border-border bg-background px-3 text-sm focus:border-primary focus:outline-none"
          />
          <button
            type="submit"
            disabled={busy}
            className="w-full rounded-md bg-primary py-2.5 text-sm font-bold uppercase tracking-wider text-primary-foreground hover:opacity-90 disabled:opacity-50"
          >
            Send reset email
          </button>
        </form>

        <p className="mt-5 text-center text-xs text-muted-foreground">
          Return to <Link to="/login" className="text-primary hover:underline">Sign in</Link>
        </p>
      </div>
    </div>
  );
}
