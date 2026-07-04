import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

interface HealthStatusCardProps {
  name: string;
  status: string;
  responseTime: string;
  progress: number;
  tone: string;
}

export function HealthStatusCard({ name, status, responseTime, progress, tone }: HealthStatusCardProps) {
  return (
    <Card className="border border-white/10 bg-white/5 shadow-[0_10px_30px_rgba(6,10,24,0.2)] backdrop-blur-xl">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base text-white">{name}</CardTitle>
          <span className={`text-sm font-medium ${tone}`}>{status}</span>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex items-center justify-between text-sm text-muted-foreground">
          <span>Response</span>
          <span>{responseTime}</span>
        </div>
        <Progress value={progress} className="h-2" />
      </CardContent>
    </Card>
  );
}
