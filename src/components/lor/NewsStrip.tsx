const news = [
  { tag: "INDUSTRY", title: "Drake announces surprise EP drop this Friday", time: "2h ago" },
  { tag: "BEEF", title: "Studio leak sparks new West Coast vs East rivalry", time: "5h ago" },
  { tag: "CULTURE", title: "How South African hip-hop is taking over global charts", time: "1d ago" },
  { tag: "EXCLUSIVE", title: "Inside the new BX cypher series — full interview", time: "1d ago" },
];

export function NewsStrip() {
  return (
    <section className="lor-card p-4 md:p-5">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="lor-section-label text-base">NEWS & BLOG</h2>
        <button className="text-xs font-bold uppercase tracking-wider text-primary hover:underline">Read More</button>
      </div>
      <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
        {news.map((n) => (
          <a key={n.title} href="#" className="flex items-start gap-3 rounded-md border border-border bg-surface p-3 hover:border-primary/50">
            <div className="grid h-14 w-14 shrink-0 place-items-center rounded-md bg-gradient-to-br from-primary/30 to-background lor-display text-lg text-foreground">
              {n.tag[0]}
            </div>
            <div className="min-w-0 flex-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-primary">{n.tag}</span>
              <p className="lor-display mt-0.5 line-clamp-2 text-[13px] leading-tight">{n.title}</p>
              <p className="mt-1 text-[11px] text-muted-foreground">{n.time}</p>
            </div>
          </a>
        ))}
      </div>
    </section>
  );
}
