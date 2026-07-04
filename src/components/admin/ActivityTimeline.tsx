import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";

interface ActivityTimelineProps {
  items: Array<{
    id: number;
    title: string;
    actor: string;
    time: string;
    status: string;
    accent: string;
  }>;
}

export function ActivityTimeline({ items }: ActivityTimelineProps) {
  return (
    <Card className="border border-white/10 bg-white/5 shadow-[0_10px_30px_rgba(6,10,24,0.2)] backdrop-blur-xl">
      <CardHeader>
        <CardTitle className="text-lg text-white">Recent Activity</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {items.map((item) => (
          <div key={item.id} className="flex items-start gap-3 rounded-2xl border border-white/10 bg-black/10 p-3">
            <div className={`mt-0.5 h-2.5 w-2.5 rounded-full ${item.accent}`} />
            <div className="flex-1">
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <Avatar className="h-8 w-8 border border-white/10">
                    <AvatarFallback className="bg-[#D4AF37]/15 text-xs text-[#f6db84]">
                      {item.actor
                        .split(" ")
                        .map((part) => part[0])
                        .join("")
                        .slice(0, 2)}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="text-sm font-medium text-white">{item.title}</p>
                    <p className="text-xs text-muted-foreground">{item.actor}</p>
                  </div>
                </div>
                <Badge variant="secondary" className="border-white/10 bg-white/5 text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
                  {item.status}
                </Badge>
              </div>
              <p className="mt-2 text-xs text-muted-foreground">{item.time}</p>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
