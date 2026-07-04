import { useEffect } from "react";
import { QueryClient, QueryClientProvider, useQueryClient } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouter,
  HeadContent,
  Scripts,
} from "@tanstack/react-router";
import { Toaster } from "@/components/ui/sonner";
import { supabase } from "@/integrations/supabase/client";
import { BeatPlayerProvider } from "@/hooks/use-beat-player";
import { GlobalBeatPlayer } from "@/components/lor/GlobalBeatPlayer";
import { ADSENSE_CLIENT_ID, ADSENSE_ENABLED } from "@/lib/adsense";

import appCss from "../styles.css?url";
import logoImageUrl from "@/assets/logo.png?url";

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-7xl font-bold text-foreground">404</h1>
        <h2 className="mt-4 text-xl font-semibold text-foreground">Page not found</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <div className="mt-6">
          <Link
            to="/"
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Go home
          </Link>
        </div>
      </div>
    </div>
  );
}

function ErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  console.error(error);
  const router = useRouter();

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-xl font-semibold tracking-tight text-foreground">
          This page didn't load
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Something went wrong on our end. You can try refreshing or head back home.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          <button
            onClick={() => {
              router.invalidate();
              reset();
            }}
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Try again
          </button>
          <a
            href="/"
            className="inline-flex items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-accent"
          >
            Go home
          </a>
        </div>
      </div>
    </div>
  );
}

const SITE_URL = (import.meta.env.VITE_SITE_URL ?? import.meta.env.VITE_PUBLIC_URL ?? "https://tanstack-start-app.codescode81.workers.dev").replace(/\/$/, "");

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => {
    const absoluteLogoUrl = `${SITE_URL}${logoImageUrl}`;

    return {
      meta: [
        { charSet: "utf-8" },
        { name: "viewport", content: "width=device-width, initial-scale=1" },
        { title: "League of Rap — Premium Hip-Hop Media Platform" },
        { name: "description", content: "Watch the latest rap videos, freestyles, interviews, and battles. The #1 platform for hip-hop culture." },
        { name: "author", content: "League of Rap" },
        { property: "og:title", content: "League of Rap — Premium Hip-Hop Media Platform" },
        { property: "og:description", content: "Watch the latest rap videos, freestyles, interviews, and battles. The #1 platform for hip-hop culture." },
        { property: "og:type", content: "website" },
        { property: "og:image", content: absoluteLogoUrl },
        { property: "og:image:secure_url", content: absoluteLogoUrl },
        { name: "twitter:card", content: "summary_large_image" },
        { name: "twitter:title", content: "League of Rap — Premium Hip-Hop Media Platform" },
        { name: "twitter:description", content: "Watch the latest rap videos, freestyles, interviews, and battles. The #1 platform for hip-hop culture." },
        { name: "twitter:image", content: absoluteLogoUrl },
      ],
      links: [
        { rel: "icon", type: "image/png", href: logoImageUrl, sizes: "32x32" },
        { rel: "stylesheet", href: appCss },
        { rel: "preconnect", href: "https://fonts.googleapis.com" },
        { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
        {
          rel: "stylesheet",
          href: "https://fonts.googleapis.com/css2?family=Oswald:wght@500;600;700&family=Inter:wght@400;500;600;700&display=swap",
        },
      ],
    };
  },
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark" style={{ overflowX: "hidden" }}>
      <head>
        <HeadContent />
        {ADSENSE_ENABLED ? (
          <script
            async
            src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${ADSENSE_CLIENT_ID}`}
            crossOrigin="anonymous"
          />
        ) : null}
      </head>
      <body
        className="bg-background text-foreground overflow-x-hidden"
        style={{ minHeight: "100vh", width: "100%" }}
      >
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();

  return (
    <QueryClientProvider client={queryClient}>
      <BeatPlayerProvider>
        <AuthSync />
        <Outlet />
        <GlobalBeatPlayer />
        <Toaster />
      </BeatPlayerProvider>
    </QueryClientProvider>
  );
}

function AuthSync() {
  const router = useRouter();
  const qc = useQueryClient();
  useEffect(() => {
    const { data } = supabase.auth.onAuthStateChange(() => {
      router.invalidate();
      qc.invalidateQueries();
    });
    return () => data.subscription.unsubscribe();
  }, [router, qc]);
  return null;
}
