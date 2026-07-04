interface AudioPlayerProps {
  src?: string;
}

export function AudioPlayer({ src }: AudioPlayerProps) {
  if (!src) {
    return <div className="rounded-2xl border border-white/10 bg-white/5 p-3 text-sm text-muted-foreground">No preview audio uploaded.</div>;
  }

  return <audio controls className="w-full" src={src} />;
}
