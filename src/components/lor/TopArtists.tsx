const artists = [
  { name: "Jay Frost", followers: "1.2M", color: "from-red-600 to-orange-500" },
  { name: "Rich Real", followers: "890K", color: "from-purple-600 to-pink-500" },
  { name: "Lil Ace", followers: "650K", color: "from-blue-600 to-cyan-500" },
  { name: "Young King", followers: "540K", color: "from-emerald-600 to-lime-500" },
  { name: "Fast Life", followers: "410K", color: "from-amber-600 to-yellow-500" },
  { name: "King Slim", followers: "380K", color: "from-rose-600 to-red-500" },
  { name: "Big Mac", followers: "290K", color: "from-indigo-600 to-violet-500" },
  { name: "QC Tay", followers: "260K", color: "from-fuchsia-600 to-pink-500" },
];

export function TopArtists() {
  return (
    <section className="lor-card p-4 md:p-5">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="lor-section-label text-base">TOP ARTISTS</h2>
        <button className="text-xs font-bold uppercase tracking-wider text-primary hover:underline">See All</button>
      </div>
      <div className="flex gap-4 overflow-x-auto pb-2 lor-scroll">
        {artists.map((a) => (
          <a key={a.name} href="#" className="group flex w-[90px] shrink-0 flex-col items-center text-center">
            <div
              className={`h-[78px] w-[78px] rounded-full bg-gradient-to-br ${a.color} p-[3px] transition-transform group-hover:scale-105`}
            >
              <div className="flex h-full w-full items-center justify-center rounded-full bg-card lor-display text-2xl text-foreground">
                {a.name[0]}
              </div>
            </div>
            <p className="lor-display mt-2 text-[12px] leading-tight">{a.name}</p>
            <p className="text-[10px] text-muted-foreground">{a.followers}</p>
          </a>
        ))}
      </div>
    </section>
  );
}
