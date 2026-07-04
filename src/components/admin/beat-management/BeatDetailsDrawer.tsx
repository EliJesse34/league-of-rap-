import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { CalendarDays, Headphones, Music2, Sparkles, TrendingUp } from "lucide-react";
import { AudioPlayer } from "./AudioPlayer";
import { LicenseBadge } from "./LicenseBadge";
import { PriceBadge } from "./PriceBadge";
import type { BeatRecord } from "./beats-mock";

interface BeatDetailsDrawerProps {
  open: boolean;
  onClose: () => void;
  beat: BeatRecord | null;
}

export function BeatDetailsDrawer({ open, onClose, beat }: BeatDetailsDrawerProps) {
  if (!beat) return null;

  return (
    <Sheet open={open} onOpenChange={(isOpen) => !isOpen && onClose()}>
      <SheetContent side="right" className="w-full max-w-md border-white/10 bg-[#050816]/95 p-0 text-white backdrop-blur-xl">
        <div className="h-full overflow-y-auto">
          <SheetHeader className="border-b border-white/10 p-6">
            <div className="flex items-center gap-3">
              <Avatar className="h-14 w-14 border border-white/10">
                <AvatarFallback>{beat.coverArt}</AvatarFallback>
              </Avatar>
              <div>
                <SheetTitle className="text-left text-lg text-white">{beat.title}</SheetTitle>
                <SheetDescription className="text-left text-sm text-muted-foreground">{beat.producer}</SheetDescription>
              </div>
            </div>
          </SheetHeader>

          <div className="space-y-4 p-6">
            <Card className="border border-white/10 bg-white/5">
              <CardContent className="space-y-3 p-4">
                <div className="flex flex-wrap items-center gap-2">
                  <PriceBadge priceType={beat.priceType} price={beat.price} />
                  <LicenseBadge license={beat.license} />
                  {beat.featured ? <Badge className="border-[#D4AF37]/20 bg-[#D4AF37]/10 text-[#f6db84]">Featured</Badge> : null}
                </div>
                <p className="text-sm text-muted-foreground">{beat.description}</p>
              </CardContent>
            </Card>

            <Card className="border border-white/10 bg-white/5">
              <CardContent className="space-y-3 p-4">
                <div className="flex items-center gap-2 text-[#f6db84]"><Music2 className="h-4 w-4" /> Beat info</div>
                <div className="grid grid-cols-2 gap-3 text-sm text-muted-foreground">
                  <div>
                    <p className="text-xs uppercase tracking-[0.2em]">Genre</p>
                    <p className="mt-1 font-medium text-white">{beat.genre}</p>
                  </div>
                  <div>
                    <p className="text-xs uppercase tracking-[0.2em]">Mood</p>
                    <p className="mt-1 font-medium text-white">{beat.mood}</p>
                  </div>
                  <div>
                    <p className="text-xs uppercase tracking-[0.2em]">BPM</p>
                    <p className="mt-1 font-medium text-white">{beat.bpm}</p>
                  </div>
                  <div>
                    <p className="text-xs uppercase tracking-[0.2em]">Key</p>
                    <p className="mt-1 font-medium text-white">{beat.key}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border border-white/10 bg-white/5">
              <CardContent className="space-y-3 p-4">
                <div className="flex items-center gap-2 text-[#f6db84]"><Headphones className="h-4 w-4" /> Audio preview</div>
                <AudioPlayer src={beat.previewUrl} />
              </CardContent>
            </Card>

            <Card className="border border-white/10 bg-white/5">
              <CardContent className="space-y-3 p-4">
                <div className="flex items-center gap-2 text-[#f6db84]"><TrendingUp className="h-4 w-4" /> Performance</div>
                <div className="grid grid-cols-2 gap-3 text-sm text-muted-foreground">
                  <div>
                    <p className="text-xs uppercase tracking-[0.2em]">Streams</p>
                    <p className="mt-1 font-medium text-white">{beat.streams}</p>
                  </div>
                  <div>
                    <p className="text-xs uppercase tracking-[0.2em]">Downloads</p>
                    <p className="mt-1 font-medium text-white">{beat.downloads}</p>
                  </div>
                  <div>
                    <p className="text-xs uppercase tracking-[0.2em]">Sales</p>
                    <p className="mt-1 font-medium text-white">{beat.sales}</p>
                  </div>
                  <div>
                    <p className="text-xs uppercase tracking-[0.2em]">Revenue</p>
                    <p className="mt-1 font-medium text-white">${beat.revenue}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border border-white/10 bg-white/5">
              <CardContent className="space-y-3 p-4">
                <div className="flex items-center gap-2 text-[#f6db84]"><CalendarDays className="h-4 w-4" /> Timeline</div>
                <div className="text-sm text-muted-foreground">
                  <p>Created: {beat.uploadDate}</p>
                  <p className="mt-1">Status: {beat.status}</p>
                </div>
              </CardContent>
            </Card>

            <Card className="border border-white/10 bg-white/5">
              <CardContent className="space-y-3 p-4">
                <div className="flex items-center gap-2 text-[#f6db84]"><Sparkles className="h-4 w-4" /> Tags</div>
                <div className="flex flex-wrap gap-2">
                  {beat.tags.map((tag) => (
                    <Badge key={tag} variant="outline">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
