import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/auth/callback")({
  component: AuthCallbackPage,
});

function AuthCallbackPage() {
  const navigate = useNavigate();
  const [href, setHref] = useState<string>(typeof window !== "undefined" ? window.location.href : "");
  const [search, setSearch] = useState<string>(typeof window !== "undefined" ? window.location.search : "");
  const [hash, setHash] = useState<string>(typeof window !== "undefined" ? window.location.hash : "");
  const [status, setStatus] = useState<string>("Checking authentication callback...");

  useEffect(() => {
    if (typeof window === "undefined") return;

    const currentHref = window.location.href;
    const currentSearch = window.location.search;
    const currentHash = window.location.hash;
    setHref(currentHref);
    setSearch(currentSearch);
    setHash(currentHash);

    const searchParams = new URLSearchParams(currentSearch);
    const hashParams = new URLSearchParams(currentHash.startsWith("#") ? currentHash.slice(1) : currentHash);
    const params = new URLSearchParams();
    searchParams.forEach((value, key) => params.set(key, value));
    hashParams.forEach((value, key) => params.set(key, value));

    const error = params.get("error");
    const errorDescription = params.get("error_description");
    const accessToken = params.get("access_token");
    const refreshToken = params.get("refresh_token");

    if (error) {
      setStatus(`OAuth error: ${errorDescription ?? error}`);
      return;
    }

    if (!accessToken || !refreshToken) {
      setStatus("No OAuth tokens were returned. If you see a 404, register /auth/callback as your redirect URI.");
      return;
    }

    setStatus("Signing you in...");
    supabase.auth
      .setSession({ access_token: accessToken, refresh_token: refreshToken })
      .then(({ error }) => {
        if (error) {
          setStatus(`Failed to complete sign in: ${error.message}`);
          return;
        }
        navigate({ to: "/", replace: true });
      })
      .catch((err) => {
        setStatus(`Failed to complete sign in: ${err instanceof Error ? err.message : String(err)}`);
      });
  }, [navigate]);

  return (
    <div className="min-h-screen bg-background px-4 py-10">
      <div className="mx-auto lor-card max-w-2xl p-6">
        <h1 className="lor-display text-xl mb-4">Auth Callback</h1>
        <p className="text-sm text-muted-foreground mb-4">This page processes the OAuth callback and signs you in if tokens are present.</p>
        <div className="mb-4 rounded border border-border bg-background p-4 text-sm">
          <p className="font-medium">Status</p>
          <p className="mt-2 text-foreground">{status}</p>
        </div>
        <div className="mb-3">
          <strong>Full URL</strong>
          <pre className="mt-1 overflow-auto rounded bg-card p-3 text-sm">{href}</pre>
        </div>
        <div className="mb-3">
          <strong>Search</strong>
          <pre className="mt-1 overflow-auto rounded bg-card p-3 text-sm">{search}</pre>
        </div>
        <div className="mb-3">
          <strong>Hash</strong>
          <pre className="mt-1 overflow-auto rounded bg-card p-3 text-sm">{hash}</pre>
        </div>

        <div className="mt-4 flex gap-2">
          <Link to="/" className="rounded-md bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground">Home</Link>
        </div>
      </div>
    </div>
  );
}
