import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface VerificationCardProps {
  title: string;
  artist: string;
  uploaded: string;
  status: string;
  thumbnail: string;
}

export function VerificationCard({ title, artist, uploaded, status, thumbnail }: VerificationCardProps) {
  return (
    <Card className="border border-white/10 bg-white/5 shadow-[0_10px_30px_rgba(6,10,24,0.2)] backdrop-blur-xl">
      <CardContent className="flex flex-col gap-4 p-4 md:flex-row md:items-center md:justify-between">
        <div className="flex items-center gap-3">
          <div className="grid h-12 w-12 place-items-center rounded-2xl bg-gradient-to-br from-[#D4AF37]/30 to-[#f6db84]/10 text-sm font-semibold text-[#f6db84]">
            {thumbnail}
          </div>
          <div>
            <p className="font-semibold text-white">{title}</p>
            <p className="text-sm text-muted-foreground">{artist}</p>
            <p className="mt-1 text-xs text-muted-foreground">Uploaded {uploaded}</p>
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-2 md:justify-end">
          <Badge variant="secondary" className="border-[#D4AF37]/20 bg-[#D4AF37]/10 text-[#f6db84]">
            {status}
          </Badge>
          <Button size="sm" variant="outline" className="border-emerald-500/20 bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20">
            Approve
          </Button>
          <Button size="sm" variant="outline" className="border-rose-500/20 bg-rose-500/10 text-rose-400 hover:bg-rose-500/20">
            Reject
          </Button>
          <Button size="sm" variant="ghost" className="text-muted-foreground hover:text-white">
            View
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
