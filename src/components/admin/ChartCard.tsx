import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ResponsiveContainer, LineChart, Line, BarChart, Bar, CartesianGrid, XAxis, YAxis, Tooltip, AreaChart, Area, Legend } from "recharts";

interface ChartCardProps {
  title: string;
  description: string;
  type: "line" | "bar" | "area";
  data: Array<Record<string, number | string>>;
  dataKey: string;
  color?: string;
  xAxisKey?: string;
  secondaryDataKey?: string;
  secondaryColor?: string;
}

export function ChartCard({ title, description, type, data, dataKey, color = "#D4AF37", xAxisKey = "day", secondaryDataKey, secondaryColor = "#4ade80" }: ChartCardProps) {
  const renderChart = () => {
    if (type === "line") {
      return (
        <ResponsiveContainer width="100%" height={240}>
          <LineChart data={data}>
            <CartesianGrid stroke="rgba(255,255,255,0.08)" vertical={false} />
            <XAxis dataKey={xAxisKey} tickLine={false} axisLine={false} tick={{ fill: "#94a3b8", fontSize: 12 }} />
            <YAxis tickLine={false} axisLine={false} tick={{ fill: "#94a3b8", fontSize: 12 }} />
            <Tooltip />
            <Line type="monotone" dataKey={dataKey} stroke={color} strokeWidth={3} dot={{ r: 4, fill: color }} />
          </LineChart>
        </ResponsiveContainer>
      );
    }

    if (type === "area") {
      return (
        <ResponsiveContainer width="100%" height={240}>
          <AreaChart data={data}>
            <defs>
              <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={color} stopOpacity={0.4} />
                <stop offset="95%" stopColor={color} stopOpacity={0.02} />
              </linearGradient>
            </defs>
            <CartesianGrid stroke="rgba(255,255,255,0.08)" vertical={false} />
            <XAxis dataKey={xAxisKey} tickLine={false} axisLine={false} tick={{ fill: "#94a3b8", fontSize: 12 }} />
            <YAxis tickLine={false} axisLine={false} tick={{ fill: "#94a3b8", fontSize: 12 }} />
            <Tooltip />
            <Area type="monotone" dataKey={dataKey} stroke={color} fill="url(#revenueGradient)" strokeWidth={3} />
          </AreaChart>
        </ResponsiveContainer>
      );
    }

    return (
      <ResponsiveContainer width="100%" height={240}>
        <BarChart data={data}>
          <CartesianGrid stroke="rgba(255,255,255,0.08)" vertical={false} />
          <XAxis dataKey={xAxisKey} tickLine={false} axisLine={false} tick={{ fill: "#94a3b8", fontSize: 12 }} />
          <YAxis tickLine={false} axisLine={false} tick={{ fill: "#94a3b8", fontSize: 12 }} />
          <Tooltip />
          <Legend />
          <Bar dataKey={dataKey} radius={[8, 8, 0, 0]} fill={color} />
          {secondaryDataKey ? <Bar dataKey={secondaryDataKey} radius={[8, 8, 0, 0]} fill={secondaryColor} /> : null}
        </BarChart>
      </ResponsiveContainer>
    );
  };

  return (
    <Card className="border border-white/10 bg-white/5 shadow-[0_10px_30px_rgba(6,10,24,0.2)] backdrop-blur-xl">
      <CardHeader>
        <CardTitle className="text-lg text-white">{title}</CardTitle>
        <p className="text-sm text-muted-foreground">{description}</p>
      </CardHeader>
      <CardContent>{renderChart()}</CardContent>
    </Card>
  );
}
