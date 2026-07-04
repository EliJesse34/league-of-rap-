import { Swords } from "lucide-react";

const battles = [
  { a: "K-SHOT", b: "REM DOG", round: "Round 3", views: "421K" },
  { a: "TAY-100", b: "BIG MAC", round: "Final", views: "298K" },
  { a: "QC PHAT", b: "JAY VEE", round: "Round 2", views: "187K" },
];

export function BattleRap() {
  return (
    <section className="lor-card p-4 md:p-5">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="lor-section-label flex items-center gap-2 text-base">
          <Swords className="h-4 w-4" /> BATTLE RAP
        </h2>
        <button className="text-xs font-bold uppercase tracking-wider text-primary hover:underline">Bracket</button>
      </div>
      <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
        {battles.map((b) => (
          <a key={b.a + b.b} href="#" className="lor-thumb relative block aspect-video overflow-hidden">
            <div className="grid h-full grid-cols-2">
              <div className="flex items-center justify-center bg-gradient-to-br from-red-900 to-red-600">
                <span className="lor-display text-2xl text-white">{b.a}</span>
              </div>
              <div className="flex items-center justify-center bg-gradient-to-br from-zinc-800 to-black">
                <span className="lor-display text-2xl text-white">{b.b}</span>
              </div>
            </div>
            <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-primary bg-background px-3 py-1.5">
              <span className="lor-display text-xs text-primary">VS</span>
            </div>
            <div className="absolute inset-x-0 bottom-0 flex items-center justify-between bg-black/80 px-3 py-1.5 text-[11px]">
              <span className="font-bold uppercase tracking-wider text-primary">{b.round}</span>
              <span className="text-white/80">{b.views} views</span>
            </div>
          </a>
        ))}
      </div>
    </section>
  );
}
