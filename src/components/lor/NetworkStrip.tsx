import { ExternalLink } from "lucide-react";

const sites = [
  {
    name: "HipHopLA",
    url: "https://hiphopla.com",
    tag: "LOS ANGELES",
    desc: "West Coast culture, beats & beef.",
    gradient: "from-amber-600 via-orange-600 to-red-700",
  },
  {
    name: "HipHopBX",
    url: "https://hiphopbx.com",
    tag: "THE BRONX",
    desc: "Where hip-hop was born. Cyphers, battles & street tapes.",
    gradient: "from-zinc-700 via-zinc-900 to-black",
  },
  {
    name: "CapeTownHipHop",
    url: "https://capetownhiphop.com",
    tag: "SOUTH AFRICA",
    desc: "The African sound taking over the global charts.",
    gradient: "from-emerald-700 via-teal-700 to-cyan-700",
  },
  {
    name: "HipHopBrazil",
    url: "https://hiphopbrazil.com",
    tag: "BRAZIL",
    desc: "Funk carioca, trap paulista & the Brazilian beat movement.",
    gradient: "from-green-600 via-yellow-500 to-blue-600",
  },
  {
    name: "BogotaHipHop",
    url: "https://bogotahiphop.com",
    tag: "COLOMBIA",
    desc: "Colombian urban flow, graffiti walls & street cyphers.",
    gradient: "from-yellow-500 via-amber-600 to-red-700",
  },
  {
    name: "HipHopLondon",
    url: "https://hiphoplondon.com",
    tag: "UNITED KINGDOM",
    desc: "UK grime, drill & the sound of the London underground.",
    gradient: "from-indigo-600 via-purple-700 to-rose-700",
  },
  {
    name: "HipHopTokyo",
    url: "https://hiphoptokyo.com",
    tag: "JAPAN",
    desc: "Japanese hip-hop, city pop blends & Tokyo street culture.",
    gradient: "from-rose-600 via-pink-600 to-violet-700",
  },
];

export function NetworkStrip() {
  return (
    <section className="lor-card p-4 md:p-5">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="lor-section-label text-base">THE NETWORK</h2>
        <span className="text-xs text-muted-foreground">Our sister sites</span>
      </div>
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {sites.map((s) => (
          <a
            key={s.name}
            href={s.url}
            target="_blank"
            rel="noopener noreferrer"
            className={`group relative block overflow-hidden rounded-md bg-gradient-to-br ${s.gradient} p-5 transition-transform hover:scale-[1.02]`}
          >
            <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/80">{s.tag}</span>
            <h3 className="lor-display mt-1 flex items-center gap-1.5 text-2xl text-white">
              {s.name} <ExternalLink className="h-4 w-4 opacity-60 group-hover:opacity-100" />
            </h3>
            <p className="mt-2 text-xs text-white/85">{s.desc}</p>
            <span className="mt-3 inline-block text-[11px] font-bold uppercase tracking-wider text-white underline-offset-4 group-hover:underline">
              Visit site →
            </span>
          </a>
        ))}
      </div>
    </section>
  );
}
