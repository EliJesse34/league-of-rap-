import { Bell, Search, Upload, Menu, Instagram, Twitter, Youtube } from "lucide-react";
import { useState } from "react";
import { useNavigate, Link } from "@tanstack/react-router";
import { Logo } from "./Logo";
import { AuthMenu } from "./AuthMenu";

export function Header() {
  const navigate = useNavigate();
  const [searchText, setSearchText] = useState("");

  const submitSearch = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const trimmed = searchText.trim();
    if (!trimmed) return;
    navigate({ to: "/search", search: { q: trimmed } });
  };

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80">
      <div className="mx-auto flex h-16 max-w-[1440px] items-center gap-4 px-4 md:px-6">
        <Link to="/">
          <Logo className="shrink-0" />
        </Link>

        <div className="hidden flex-1 md:flex">
          <form onSubmit={submitSearch} className="relative mx-auto w-full max-w-2xl">
            <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input
              value={searchText}
              onChange={(event) => setSearchText(event.target.value)}
              type="search"
              placeholder="Search videos, artists, and more..."
              className="h-11 w-full rounded-full border border-border bg-card pl-11 pr-12 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
            />
          </form>
        </div>

        <div className="ml-auto flex items-center gap-1.5 md:gap-2">
          <div className="hidden items-center gap-1 md:flex">
            <a
              href="https://instagram.com"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Instagram"
              className="grid h-9 w-9 place-items-center rounded-md text-foreground hover:bg-card"
            >
              <Instagram className="h-5 w-5" />
            </a>
            <a
              href="https://twitter.com"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Twitter"
              className="grid h-9 w-9 place-items-center rounded-md text-foreground hover:bg-card"
            >
              <Twitter className="h-5 w-5" />
            </a>
            <a
              href="https://youtube.com"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="YouTube"
              className="grid h-9 w-9 place-items-center rounded-md text-foreground hover:bg-card"
            >
              <Youtube className="h-5 w-5" />
            </a>
          </div>
          <Link
            to="/upload"
            className="hidden items-center gap-2 rounded-md bg-primary px-3 py-2 text-sm font-bold uppercase tracking-wide text-primary-foreground hover:opacity-90 md:flex"
          >
            <Upload className="h-4 w-4" />
            Upload
          </Link>
          <button aria-label="Notifications" className="grid h-9 w-9 place-items-center rounded-md text-foreground hover:bg-card">
            <Bell className="h-5 w-5" />
          </button>
          <AuthMenu />
          <button aria-label="Menu" className="grid h-9 w-9 place-items-center rounded-md text-foreground hover:bg-card md:hidden">
            <Menu className="h-5 w-5" />
          </button>
        </div>
      </div>

      <div className="border-t border-border px-4 pb-3 pt-2 md:hidden">
        <form onSubmit={submitSearch} className="relative">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            value={searchText}
            onChange={(event) => setSearchText(event.target.value)}
            type="search"
            placeholder="Search..."
            className="h-10 w-full rounded-full border border-border bg-card pl-10 pr-4 text-sm placeholder:text-muted-foreground focus:border-primary focus:outline-none"
          />
        </form>
      </div>
    </header>
  );
}
