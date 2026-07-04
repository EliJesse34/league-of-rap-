import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface TrendingTableProps {
  title: string;
  items: Array<{ title: string; artist: string; streams: string; downloads: string }>;
}

export function TrendingTable({ title, items }: TrendingTableProps) {
  return (
    <Card className="border border-white/10 bg-white/5 shadow-[0_10px_30px_rgba(6,10,24,0.2)] backdrop-blur-xl">
      <CardHeader>
        <CardTitle className="text-lg text-white">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {items.map((item, index) => (
            <div key={`${item.title}-${index}`} className="flex items-center justify-between rounded-2xl border border-white/10 bg-black/10 px-3 py-3">
              <div>
                <p className="font-medium text-white">{item.title}</p>
                <p className="text-sm text-muted-foreground">{item.artist}</p>
              </div>
              <div className="text-right text-sm text-muted-foreground">
                <p>{item.streams} streams</p>
                <p>{item.downloads} downloads</p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
