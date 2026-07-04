import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Crown, Sparkles, Trash2 } from "lucide-react";
import { ArtistCard } from "./ArtistCard";
import { StatusBadge } from "./StatusBadge";
import type { ArtistRecord } from "./users-mock";

interface ArtistTableProps {
  items: ArtistRecord[];
  selectedIds: number[];
  onToggleSelect: (id: number) => void;
  onSelectAll: (checked: boolean) => void;
  onVerifyArtist: (artist: ArtistRecord) => void;
  onFeatureArtist: (artist: ArtistRecord) => void;
  onSuspendArtist: (artist: ArtistRecord) => void;
  onDeleteArtist: (artist: ArtistRecord) => void;
}

export function ArtistTable({ items, selectedIds, onToggleSelect, onSelectAll, onVerifyArtist, onFeatureArtist, onSuspendArtist, onDeleteArtist }: ArtistTableProps) {
  return (
    <>
      <div className="hidden lg:block">
        <Card className="border border-white/10 bg-white/5 shadow-[0_10px_30px_rgba(6,10,24,0.2)] backdrop-blur-xl">
          <CardContent className="overflow-auto p-0">
            <table className="w-full min-w-[1100px] table-auto">
              <thead className="sticky top-0 bg-[#050816]/90 backdrop-blur-xl">
                <tr className="text-left text-sm text-muted-foreground">
                  <th className="p-3">
                    <Checkbox checked={items.length > 0 && items.every((item) => selectedIds.includes(item.id))} onCheckedChange={(checked) => onSelectAll(Boolean(checked))} />
                  </th>
                  <th className="p-3">Artist</th>
                  <th className="p-3">Country</th>
                  <th className="p-3">Followers</th>
                  <th className="p-3">Monthly Listeners</th>
                  <th className="p-3">Songs</th>
                  <th className="p-3">Beats</th>
                  <th className="p-3">Videos</th>
                  <th className="p-3">Albums</th>
                  <th className="p-3">Earnings</th>
                  <th className="p-3">Verified</th>
                  <th className="p-3">Status</th>
                  <th className="p-3">Actions</th>
                </tr>
              </thead>
              <tbody>
                {items.map((artist) => (
                  <tr key={artist.id} className="border-t border-white/10 bg-white/[0.01]">
                    <td className="p-3">
                      <Checkbox checked={selectedIds.includes(artist.id)} onCheckedChange={() => onToggleSelect(artist.id)} />
                    </td>
                    <td className="p-3">
                      <div className="font-semibold text-white">{artist.stageName}</div>
                      <div className="text-sm text-muted-foreground">{artist.realName}</div>
                    </td>
                    <td className="p-3 text-sm">{artist.country}</td>
                    <td className="p-3 text-sm">{artist.followers}</td>
                    <td className="p-3 text-sm">{artist.monthlyListeners.toLocaleString()}</td>
                    <td className="p-3 text-sm">{artist.songs}</td>
                    <td className="p-3 text-sm">{artist.beats}</td>
                    <td className="p-3 text-sm">{artist.videos}</td>
                    <td className="p-3 text-sm">{artist.albums}</td>
                    <td className="p-3 text-sm">${artist.earnings}</td>
                    <td className="p-3">
                      {artist.verified ? <Badge className="border-emerald-500/20 bg-emerald-500/10 text-emerald-300">Yes</Badge> : <Badge variant="secondary">No</Badge>}
                    </td>
                    <td className="p-3"><StatusBadge status={artist.status} /></td>
                    <td className="p-3">
                      <div className="flex flex-wrap gap-2">
                        <Button size="sm" variant="outline" onClick={() => onVerifyArtist(artist)}>
                          {artist.verified ? "Remove" : "Verify"}
                        </Button>
                        <Button size="sm" variant="outline" onClick={() => onFeatureArtist(artist)}>
                          <Crown className="mr-1 h-3.5 w-3.5" /> {artist.featured ? "Unfeature" : "Feature"}
                        </Button>
                        <Button size="sm" variant="ghost" onClick={() => onSuspendArtist(artist)}>
                          <Sparkles className="mr-1 h-3.5 w-3.5" /> Suspend
                        </Button>
                        <Button size="sm" variant="destructive" onClick={() => onDeleteArtist(artist)}>
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
        {items.map((artist) => (
          <ArtistCard key={artist.id} artist={artist} onVerify={onVerifyArtist} onFeature={onFeatureArtist} onSuspend={onSuspendArtist} onDelete={onDeleteArtist} />
        ))}
      </div>
    </>
  );
}
