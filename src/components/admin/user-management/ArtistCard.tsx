import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Sparkles } from "lucide-react";
import { StatusBadge } from "./StatusBadge";
import type { ArtistRecord } from "./users-mock";

interface ArtistCardProps {
  artist: ArtistRecord;
  onVerify: (artist: ArtistRecord) => void;
  onFeature: (artist: ArtistRecord) => void;
  onSuspend: (artist: ArtistRecord) => void;
  onDelete: (artist: ArtistRecord) => void;
}

export function ArtistCard({ artist, onVerify, onFeature, onSuspend, onDelete }: ArtistCardProps) {
  return (
    <motion.div whileHover={{ y: -3, scale: 1.01 }} transition={{ duration: 0.2 }}>
      <Card className="border border-white/10 bg-white/5 shadow-[0_10px_30px_rgba(6,10,24,0.2)] backdrop-blur-xl">
        <CardContent className="space-y-4 p-4">
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#D4AF37]/15 text-[#f6db84]">
                <Sparkles className="h-5 w-5" />
              </div>
              <div>
                <p className="font-semibold text-white">{artist.stageName}</p>
                <p className="text-sm text-muted-foreground">{artist.realName}</p>
              </div>
            </div>
            <StatusBadge status={artist.status} />
          </div>

          <div className="flex flex-wrap gap-2">
            {artist.verified ? <Badge className="border-emerald-500/20 bg-emerald-500/10 text-emerald-300">Verified</Badge> : <Badge variant="secondary">Unverified</Badge>}
            {artist.featured ? <Badge className="border-[#D4AF37]/20 bg-[#D4AF37]/10 text-[#f6db84]">Featured</Badge> : null}
          </div>

          <div className="grid grid-cols-2 gap-3 text-sm text-muted-foreground">
            <div>
              <p className="text-xs uppercase tracking-[0.2em]">Followers</p>
              <p className="mt-1 font-medium text-white">{artist.followers}</p>
            </div>
            <div>
              <p className="text-xs uppercase tracking-[0.2em]">Listeners</p>
              <p className="mt-1 font-medium text-white">{artist.monthlyListeners.toLocaleString()}</p>
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            <Button size="sm" variant="outline" onClick={() => onVerify(artist)}>
              {artist.verified ? "Remove" : "Verify"}
            </Button>
            <Button size="sm" variant="ghost" onClick={() => onFeature(artist)}>
              {artist.featured ? "Unfeature" : "Feature"}
            </Button>
            <Button size="sm" variant="outline" onClick={() => onSuspend(artist)}>
              Suspend
            </Button>
          </div>

          <Button size="sm" variant="destructive" className="w-full" onClick={() => onDelete(artist)}>
            Delete
          </Button>
        </CardContent>
      </Card>
    </motion.div>
  );
}
