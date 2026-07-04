export function StatusBadge({ status }: { status: string }) {
  const base = "inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium";
  if (status === "Active") return <span className={`${base} border border-emerald-500/20 bg-emerald-500/10 text-emerald-300`}>{status}</span>;
  if (status === "Suspended") return <span className={`${base} border border-amber-500/20 bg-amber-500/10 text-amber-300`}>{status}</span>;
  if (status === "Banned") return <span className={`${base} border border-rose-500/20 bg-rose-500/10 text-rose-300`}>{status}</span>;
  return <span className={`${base} border border-white/10 bg-white/5 text-muted-foreground`}>{status}</span>;
}
