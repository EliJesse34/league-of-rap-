import { useState } from "react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Eye, Pin, Sparkles, Trash2 } from "lucide-react";
import { LicenseBadge } from "./LicenseBadge";
import { PriceBadge } from "./PriceBadge";
import type { BeatRecord } from "./beats-mock";

interface BeatsTableProps {
  items: BeatRecord[];
  selectedIds: number[];
  onToggleSelect: (id: number) => void;
  onSelectAll: (checked: boolean) => void;
  onViewBeat: (beat: BeatRecord) => void;
  onToggleFeature: (beat: BeatRecord) => void;
  onTogglePin: (beat: BeatRecord) => void;
  onToggleVisibility: (beat: BeatRecord) => void;
  onDeleteBeat: (beat: BeatRecord) => void;
}

export function BeatsTable({ items, selectedIds, onToggleSelect, onSelectAll, onViewBeat, onToggleFeature, onTogglePin, onToggleVisibility, onDeleteBeat }: BeatsTableProps) {
  const [hoveredId, setHoveredId] = useState<number | null>(null);

  return (
    <>
      <div className="hidden lg:block">
        <Card className="border border-white/10 bg-white/5 shadow-[0_10px_30px_rgba(6,10,24,0.2)] backdrop-blur-xl">
          <CardContent className="overflow-auto p-0">
            <table className="w-full min-w-[1300px] table-auto">
              <thead className="sticky top-0 bg-[#050816]/90 backdrop-blur-xl">
                <tr className="text-left text-sm text-muted-foreground">
                  <th className="p-3">
                    <Checkbox checked={items.length > 0 && items.every((item) => selectedIds.includes(item.id))} onCheckedChange={(checked) => onSelectAll(Boolean(checked))} />
                  </th>
                  <th className="p-3">Cover</th>
                  <th className="p-3">Beat</th>
                  <th className="p-3">Producer</th>
                  <th className="p-3">Genre</th>
                  <th className="p-3">BPM</th>
                  <th className="p-3">Key</th>
                  <th className="p-3">Duration</th>
                  <th className="p-3">Price</th>
                  <th className="p-3">License</th>
                  <th className="p-3">Streams</th>
                  <th className="p-3">Downloads</th>
                  <th className="p-3">Sales</th>
                  <th className="p-3">Revenue</th>
                  <th className="p-3">Status</th>
                  <th className="p-3">Featured</th>
                  <th className="p-3">Actions</th>
                </tr>
              </thead>
              <tbody>
                {items.map((beat) => (
                  <tr key={beat.id} className="border-t border-white/10 bg-white/[0.01]" onMouseEnter={() => setHoveredId(beat.id)} onMouseLeave={() => setHoveredId(null)}>
                    <td className="p-3">
                      <Checkbox checked={selectedIds.includes(beat.id)} onCheckedChange={() => onToggleSelect(beat.id)} />
                    </td>
                    <td className="p-3">
                      <Avatar className="h-10 w-10 border border-white/10">
                        <AvatarFallback>{beat.coverArt}</AvatarFallback>
                      </Avatar>
                    </td>
                    <td className="p-3">
                      <div className="font-semibold text-white">{beat.title}</div>
                      <div className="text-sm text-muted-foreground">{beat.mood}</div>
                    </td>
                    <td className="p-3 text-sm">{beat.producer}</td>
                    <td className="p-3 text-sm">{beat.genre}</td>
                    <td className="p-3 text-sm">{beat.bpm}</td>
                    <td className="p-3 text-sm">{beat.key}</td>
                    <td className="p-3 text-sm">{beat.duration}</td>
                    <td className="p-3"><PriceBadge priceType={beat.priceType} price={beat.price} /></td>
                    <td className="p-3"><LicenseBadge license={beat.license} /></td>
                    <td className="p-3 text-sm">{beat.streams}</td>
                    <td className="p-3 text-sm">{beat.downloads}</td>
                    <td className="p-3 text-sm">{beat.sales}</td>
                    <td className="p-3 text-sm">${beat.revenue}</td>
                    <td className="p-3"><Badge variant="outline">{beat.status}</Badge></td>
                    <td className="p-3">{beat.featured ? <Badge className="border-[#D4AF37]/20 bg-[#D4AF37]/10 text-[#f6db84]">Yes</Badge> : <span className="text-muted-foreground">No</span>}</td>
                    <td className="p-3">
                      <div className="flex flex-wrap gap-2">
                        <Button size="sm" variant="ghost" onClick={() => onViewBeat(beat)}>
                          <Eye className="mr-1 h-3.5 w-3.5" /> View
                        </Button>
                        <Button size="sm" variant="outline" onClick={() => onToggleFeature(beat)}>
                          <Sparkles className="mr-1 h-3.5 w-3.5" /> {beat.featured ? "Unfeature" : "Feature"}
                        </Button>
                        <Button size="sm" variant="outline" onClick={() => onTogglePin(beat)}>
                          <Pin className="mr-1 h-3.5 w-3.5" /> {beat.pinned ? "Unpin" : "Pin"}
                        </Button>
                        <Button size="sm" variant="outline" onClick={() => onToggleVisibility(beat)}>
                          {beat.status === "Hidden" ? "Publish" : "Hide"}
                        </Button>
                        <Button size="sm" variant="destructive" onClick={() => onDeleteBeat(beat)}>
                          <Trash2 className="mr-1 h-3.5 w-3.5" /> Delete
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </CardContent>
        </Card>
      </div>

      <div className="space-y-3 lg:hidden">
        {items.map((beat) => (
          <Card key={beat.id} className="border border-white/10 bg-white/5 backdrop-blur-xl">
            <CardContent className="space-y-3 p-4">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="font-semibold text-white">{beat.title}</p>
                  <p className="text-sm text-muted-foreground">{beat.producer}</p>
                </div>
                <Badge variant="outline">{beat.status}</Badge>
              </div>
              <div className="flex flex-wrap gap-2">
                <PriceBadge priceType={beat.priceType} price={beat.price} />
                <LicenseBadge license={beat.license} />
              </div>
              <div className="flex flex-wrap gap-2">
                <Button size="sm" variant="ghost" onClick={() => onViewBeat(beat)}>
                  View
                </Button>
                <Button size="sm" variant="outline" onClick={() => onToggleFeature(beat)}>
                  {beat.featured ? "Unfeature" : "Feature"}
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </>
  );
}
