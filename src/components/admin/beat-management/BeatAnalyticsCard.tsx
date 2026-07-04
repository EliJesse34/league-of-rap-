import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartCard } from "@/components/admin/ChartCard";
import { geoListeners } from "./beats-mock";

interface BeatAnalyticsCardProps {
  title: string;
  description: string;
  type: "line" | "bar" | "area";
  data: Array<Record<string, number | string>>;
  dataKey: string;
  xAxisKey?: string;
  secondaryDataKey?: string;
}

export function BeatAnalyticsCard({ title, description, type, data, dataKey, xAxisKey = "label", secondaryDataKey }: BeatAnalyticsCardProps) {
  return (
    <Card className="border border-white/10 bg-white/5 shadow-[0_10px_30px_rgba(6,10,24,0.2)] backdrop-blur-xl">
      <CardHeader>
        <CardTitle className="text-lg text-white">{title}</CardTitle>
        <p className="text-sm text-muted-foreground">{description}</p>
      </CardHeader>
      <CardContent>
        {type === "bar" && dataKey === "value" ? (
          <div className="space-y-3">
            {geoListeners.map((item) => (
              <div key={item.country} className="space-y-1">
                <div className="flex items-center justify-between text-sm text-muted-foreground">
                  <span>{item.country}</span>
                  <span className="text-white">{item.value}%</span>
                </div>
                <div className="h-2 rounded-full bg-white/10">
                  <div className="h-2 rounded-full bg-[#D4AF37]" style={{ width: `${item.value}%` }} />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <ChartCard title={title} description={description} type={type} data={data} dataKey={dataKey} xAxisKey={xAxisKey} secondaryDataKey={secondaryDataKey} />
        )}
      </CardContent>
    </Card>
  );
}
