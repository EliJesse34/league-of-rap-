import { Logo } from "./Logo";

const cols = [
  { title: "QUICK LINKS", items: [
    { label: "Home", href: "/" },
    { label: "Upload", href: "/upload" },
    { label: "Trending", href: "#" },
    { label: "Artists", href: "#" },
    { label: "Blog", href: "#" },
  ] },
  { title: "SUPPORT", items: [
    { label: "Help Center", href: "#" },
    { label: "Contact Us", href: "#" },
    { label: "Terms of Service", href: "#" },
    { label: "Privacy Policy", href: "#" },
    { label: "DMCA", href: "#" },
  ] },
  { title: "OUR NETWORK", items: [
    { label: "HipHopLA →", href: "https://hiphopla.com" },
    { label: "HipHopBX →", href: "https://hiphopbx.com" },
    { label: "CapeTownHipHop →", href: "https://capetownhiphop.com" },
    { label: "Instagram", href: "#" },
    { label: "Twitter / X", href: "#" },
  ] },
];

const pay = ["VISA", "MC", "AMEX", "PAYPAL", "BTC", "PATREON"];

export function Footer() {
  return (
    <footer className="border-t border-border bg-surface">
      <div className="mx-auto grid max-w-[1440px] grid-cols-1 gap-8 px-4 py-10 md:grid-cols-12 md:px-6">
        <div className="md:col-span-3">
          <Logo />
          <p className="mt-4 max-w-xs text-sm text-muted-foreground">
            The #1 platform for hip hop culture. Watch the latest videos, discover new artists, and join the movement.
          </p>
        </div>
        {cols.map((c) => (
          <div key={c.title} className="md:col-span-2">
            <h4 className="lor-section-label text-xs">{c.title}</h4>
            <ul className="mt-4 space-y-2 text-sm text-foreground">
              {c.items.map((i) => (
                <li key={i.label}>
                  <a href={i.href} className="hover:text-primary" target={i.href.startsWith("http") ? "_blank" : undefined} rel={i.href.startsWith("http") ? "noopener noreferrer" : undefined}>{i.label}</a>
                </li>
              ))}
            </ul>
          </div>
        ))}
        <div className="md:col-span-3">
          <h4 className="lor-section-label text-xs">NEWSLETTER</h4>
          <p className="mt-4 text-sm text-muted-foreground">Subscribe to get the latest updates</p>
          <form className="mt-3 flex gap-2">
            <input
              type="email"
              placeholder="Enter your email"
              className="h-10 flex-1 rounded-md border border-border bg-card px-3 text-sm placeholder:text-muted-foreground focus:border-primary focus:outline-none"
            />
            <button className="rounded-md bg-primary px-4 text-sm font-bold uppercase text-primary-foreground hover:opacity-90">
              Subscribe
            </button>
          </form>
        </div>
      </div>
      <div className="border-t border-border">
        <div className="mx-auto flex max-w-[1440px] flex-col items-center justify-between gap-4 px-4 py-5 md:flex-row md:px-6">
          <p className="text-xs text-muted-foreground">© 2026 League of Rap. All rights reserved.</p>
          <div className="flex flex-wrap items-center gap-2">
            {pay.map((p) => (
              <span key={p} className="rounded-sm border border-border bg-background px-2.5 py-1 text-[10px] font-bold tracking-wider text-muted-foreground">
                {p}
              </span>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
