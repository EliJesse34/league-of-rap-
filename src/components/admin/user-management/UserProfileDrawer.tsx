import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { CalendarDays, Flag, MapPin, Music2, RadioTower, Sparkles, UserRound, Video } from "lucide-react";
import { StatusBadge } from "./StatusBadge";
import type { UserRecord } from "./users-mock";

interface UserProfileDrawerProps {
  open: boolean;
  onClose: () => void;
  user: UserRecord | null;
}

export function UserProfileDrawer({ open, onClose, user }: UserProfileDrawerProps) {
  if (!user) return null;

  return (
    <Sheet open={open} onOpenChange={(isOpen) => !isOpen && onClose()}>
      <SheetContent side="right" className="w-full max-w-md border-white/10 bg-[#050816]/95 p-0 text-white backdrop-blur-xl">
        <div className="h-full overflow-y-auto">
          <SheetHeader className="border-b border-white/10 p-6">
            <div className="flex items-center gap-3">
              <Avatar className="h-14 w-14 border border-white/10">
                <AvatarFallback>{user.username.slice(0, 2).toUpperCase()}</AvatarFallback>
              </Avatar>
              <div>
                <SheetTitle className="text-left text-lg text-white">{user.username}</SheetTitle>
                <SheetDescription className="text-left text-sm text-muted-foreground">{user.email}</SheetDescription>
              </div>
            </div>
          </SheetHeader>

          <div className="space-y-4 p-6">
            <Card className="border border-white/10 bg-white/5">
              <CardContent className="space-y-4 p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Account overview</p>
                    <p className="font-semibold text-white">{user.role}</p>
                  </div>
                  <StatusBadge status={user.status} />
                </div>

                <p className="text-sm text-muted-foreground">{user.bio}</p>

                <div className="flex flex-wrap gap-2">
                  {user.verified ? <Badge className="border-emerald-500/20 bg-emerald-500/10 text-emerald-300">Verified creator</Badge> : <Badge variant="secondary">Pending verification</Badge>}
                  <Badge variant="outline">{user.country}</Badge>
                </div>
              </CardContent>
            </Card>

            <div className="grid grid-cols-2 gap-3">
              <Card className="border border-white/10 bg-white/5">
                <CardContent className="p-4">
                  <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Followers</p>
                  <p className="mt-2 text-xl font-semibold text-white">{user.followers}</p>
                </CardContent>
              </Card>
              <Card className="border border-white/10 bg-white/5">
                <CardContent className="p-4">
                  <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Following</p>
                  <p className="mt-2 text-xl font-semibold text-white">{user.following}</p>
                </CardContent>
              </Card>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <Card className="border border-white/10 bg-white/5">
                <CardContent className="p-4">
                  <div className="flex items-center gap-2 text-[#f6db84]"><Music2 className="h-4 w-4" /><span className="text-sm">Songs</span></div>
                  <p className="mt-2 text-xl font-semibold text-white">{user.songsUploaded}</p>
                </CardContent>
              </Card>
              <Card className="border border-white/10 bg-white/5">
                <CardContent className="p-4">
                  <div className="flex items-center gap-2 text-[#f6db84]"><RadioTower className="h-4 w-4" /><span className="text-sm">Beats</span></div>
                  <p className="mt-2 text-xl font-semibold text-white">{user.beatsUploaded}</p>
                </CardContent>
              </Card>
            </div>

            <Card className="border border-white/10 bg-white/5">
              <CardContent className="space-y-3 p-4">
                <div className="flex items-center gap-2 text-sm text-muted-foreground"><Video className="h-4 w-4" /> Videos uploaded</div>
                <p className="text-xl font-semibold text-white">{user.videosUploaded}</p>
                <div className="flex items-center gap-2 text-sm text-muted-foreground"><Sparkles className="h-4 w-4" /> Albums published</div>
                <p className="text-xl font-semibold text-white">{user.albums}</p>
              </CardContent>
            </Card>

            <Card className="border border-white/10 bg-white/5">
              <CardContent className="space-y-3 p-4">
                <div className="flex items-center gap-2 text-sm text-muted-foreground"><CalendarDays className="h-4 w-4" /> Joined</div>
                <p className="text-white">{user.joined}</p>
                <div className="flex items-center gap-2 text-sm text-muted-foreground"><MapPin className="h-4 w-4" /> Country</div>
                <p className="text-white">{user.country}</p>
              </CardContent>
            </Card>

            <Card className="border border-white/10 bg-white/5">
              <CardContent className="space-y-3 p-4">
                <div className="flex items-center gap-2 text-sm text-muted-foreground"><UserRound className="h-4 w-4" /> Recent activity</div>
                <div className="space-y-2">
                  {user.recentActivity.map((item) => (
                    <div key={item.id} className="flex items-center justify-between rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm">
                      <span className="text-white">{item.action}</span>
                      <span className="text-muted-foreground">{item.time}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className="border border-white/10 bg-white/5">
              <CardContent className="p-4">
                <div className="flex items-center gap-2 text-sm text-muted-foreground"><Flag className="h-4 w-4" /> Reports against account</div>
                <p className="mt-2 text-xl font-semibold text-white">{user.reports}</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
