import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { z } from "zod";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { lovable } from "@/integrations/lovable";
import { Logo } from "@/components/lor/Logo";

const searchSchema = z.object({ mode: z.enum(["signin", "signup"]).optional() });

export const Route = createFileRoute("/login")({
  validateSearch: searchSchema,
  component: LoginPage,
});

function LoginPage() {
  const { mode: initial } = Route.useSearch();
  const [mode, setMode] = useState<"signin" | "signup">(initial ?? "signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [magicLinkSent, setMagicLinkSent] = useState(false);
  const navigate = useNavigate();

  const appOrigin = import.meta.env.VITE_SITE_URL ?? import.meta.env.VITE_PUBLIC_URL ?? window.location.origin;

  const COOLDOWN_MS = 5 * 60 * 1000; // 5 minutes
  const lastSentKey = (purpose: string, addr: string) => `last_auth_sent:${purpose}:${addr}`;
  const canSend = (purpose: string, addr: string) => {
    try {
      const last = localStorage.getItem(lastSentKey(purpose, addr));
      if (!last) return true;
      return Date.now() - Number(last) > COOLDOWN_MS;
    } catch {
      return true;
    }
  };
  const markSent = (purpose: string, addr: string) => {
    try {
      localStorage.setItem(lastSentKey(purpose, addr), String(Date.now()));
    } catch {
      // ignore
    }
  };

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) navigate({ to: "/" });
    });
  }, [navigate]);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    try {
      if (mode === "signup") {
        if (!canSend("signup", email)) {
          toast.error("Please wait before requesting another confirmation email.");
          setBusy(false);
          return;
        }

        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: { emailRedirectTo: appOrigin },
        });
        if (error) {
          throw error;
        }
        markSent("signup", email);
        toast.success("Check your email to confirm your account.");
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        toast.success("Welcome back");
        navigate({ to: "/" });
      }
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setBusy(false);
    }
  };

  const sendMagicLink = async () => {
    if (!email) {
      toast.error("Enter your email to receive a login link.");
      return;
    }
    if (!canSend("magic", email)) {
      toast.error("Please wait before requesting another login link.");
      return;
    }

    setBusy(true);
    try {
      const { error } = await supabase.auth.signInWithOtp({
        email,
        options: { emailRedirectTo: appOrigin },
      });
      if (error) throw error;
      markSent("magic", email);
      setMagicLinkSent(true);
      toast.success("Check your email for a login link.");
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Unable to send login link";
      if (msg.toLowerCase().includes("rate")) {
        toast.error("Email rate limit reached — try again later.");
      } else {
        toast.error(msg);
      }
    } finally {
      setBusy(false);
    }
  };

  const google = async () => {
    setBusy(true);
    const result = await lovable.auth.signInWithOAuth("google", {
      redirect_uri: `${appOrigin}/auth/callback`,
    });
    if (result.error) {
      toast.error("Google sign-in failed");
      setBusy(false);
      return;
    }
    if (result.redirected) return;
    navigate({ to: "/" });
  };

  return (
    <div className="grid min-h-screen place-items-center bg-background px-4">
      <div className="lor-card w-full max-w-md p-8">
        <div className="mb-6 flex justify-center">
          <Link to="/"><Logo /></Link>
        </div>
        <h1 className="lor-display text-center text-2xl">
          {mode === "signup" ? "Join the League" : "Welcome back"}
        </h1>
        <p className="mt-1 text-center text-sm text-muted-foreground">
          {mode === "signup" ? "Create an account to comment, like, and DM." : "Sign in to your account"}
        </p>

        <button
          onClick={google}
          disabled={busy}
          className="mt-6 flex w-full items-center justify-center gap-2 rounded-md border border-border-strong bg-background py-2.5 text-sm font-semibold text-foreground hover:border-primary disabled:opacity-50"
        >
          <svg className="h-4 w-4" viewBox="0 0 24 24"><path fill="#fff" d="M21.35 11.1H12v3.2h5.35c-.23 1.5-1.7 4.4-5.35 4.4-3.22 0-5.85-2.66-5.85-5.95s2.63-5.95 5.85-5.95c1.83 0 3.05.78 3.75 1.45l2.55-2.45C16.7 4.55 14.6 3.6 12 3.6 6.95 3.6 2.85 7.7 2.85 12.75S6.95 21.9 12 21.9c6.9 0 9.45-4.85 9.45-7.45 0-.5-.05-.9-.1-1.35Z"/></svg>
          Continue with Google
        </button>

        <div className="my-5 flex items-center gap-3 text-xs text-muted-foreground">
          <span className="h-px flex-1 bg-border" /> OR <span className="h-px flex-1 bg-border" />
        </div>

        <form onSubmit={submit} className="space-y-3">
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
            className="h-10 w-full rounded-md border border-border bg-background px-3 text-sm focus:border-primary focus:outline-none"
          />
          <input
            type="password"
            required
            minLength={6}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            className="h-10 w-full rounded-md border border-border bg-background px-3 text-sm focus:border-primary focus:outline-none"
          />
          {mode === "signin" ? (
            <div className="mt-2 grid gap-2 sm:flex sm:items-center sm:justify-between">
              <Link to="/reset-password" className="text-primary text-xs hover:underline">Forgot password?</Link>
              <button
                type="button"
                onClick={sendMagicLink}
                disabled={busy}
                className="inline-flex items-center justify-center rounded-md border border-border bg-background px-3 py-2 text-xs font-semibold text-foreground hover:border-primary disabled:opacity-50"
              >
                Email me a login link
              </button>
            </div>
          ) : null}
          {magicLinkSent && (
            <p className="text-xs text-success-foreground mt-2">A login link has been sent to your email.</p>
          )}
          <button
            type="submit"
            disabled={busy}
            className="w-full rounded-md bg-primary py-2.5 text-sm font-bold uppercase tracking-wider text-primary-foreground hover:opacity-90 disabled:opacity-50"
          >
            {mode === "signup" ? "Create account" : "Sign in"}
          </button>
        </form>

        <p className="mt-5 text-center text-xs text-muted-foreground">
          {mode === "signup" ? "Already have an account?" : "New here?"}{" "}
          <button
            onClick={() => setMode(mode === "signup" ? "signin" : "signup")}
            className="font-semibold text-primary hover:underline"
          >
            {mode === "signup" ? "Sign in" : "Create account"}
          </button>
        </p>
      </div>
    </div>
  );
}
