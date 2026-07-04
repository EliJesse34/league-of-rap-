import { motion } from "framer-motion";
import { RefreshCw, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PageHeader } from "./PageHeader";
import { StatCard } from "./StatCard";
import { QuickActionCard } from "./QuickActionCard";
import { ChartCard } from "./ChartCard";
import { ActivityTimeline } from "./ActivityTimeline";
import { VerificationCard } from "./VerificationCard";
import { TrendingTable } from "./TrendingTable";
import { HealthStatusCard } from "./HealthStatusCard";
import {
  summaryStats,
  quickActions,
  streamsData,
  growthData,
  revenueData,
  uploadsData,
  recentActivity,
  verificationItems,
  trendingSongs,
  trendingBeats,
  healthStatus,
} from "./mock-data";

export function OverviewDashboard() {
  const today = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  });

  return (
    <div className="space-y-6">
      <PageHeader
        title="Welcome back, Admin"
        description={`Here is your platform snapshot for ${today}. Monitor growth, content flow, and performance from one premium control center.`}
        breadcrumbs={[{ label: "Admin" }, { label: "Overview" }]}
        badge="Live Dashboard"
        actions={
          <Button className="border-[#D4AF37]/30 bg-[#D4AF37]/10 text-[#f6db84] hover:bg-[#D4AF37]/20">
            <RefreshCw className="mr-2 h-4 w-4" />
            Refresh Dashboard
          </Button>
        }
      />

      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.25 }} className="grid gap-4 lg:grid-cols-[1.2fr_0.8fr]">
        <Card className="border border-white/10 bg-gradient-to-br from-white/10 to-white/5 p-6 shadow-[0_18px_60px_rgba(6,10,24,0.3)] backdrop-blur-xl">
          <div className="flex items-center gap-3">
            <div className="grid h-11 w-11 place-items-center rounded-2xl bg-[#D4AF37]/15 text-[#f6db84]">
              <Sparkles className="h-5 w-5" />
            </div>
            <div>
              <p className="text-sm font-medium text-[#f6db84]">Platform Summary</p>
              <h2 className="text-xl font-semibold text-white">Everything is performing smoothly</h2>
            </div>
          </div>
          <p className="mt-4 max-w-2xl text-sm text-muted-foreground">
            New uploads, audience growth, and moderation workflows are staying ahead of pace. Focus on the next high-impact content approvals and monetization opportunities.
          </p>
        </Card>

        <Card className="border border-white/10 bg-white/5 p-6 shadow-[0_10px_30px_rgba(6,10,24,0.2)] backdrop-blur-xl">
          <p className="text-sm font-medium text-[#f6db84]">Operational Pulse</p>
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            <div className="rounded-2xl border border-emerald-500/20 bg-emerald-500/10 p-3">
              <p className="text-xs uppercase tracking-[0.2em] text-emerald-300">Uptime</p>
              <p className="mt-1 text-2xl font-semibold text-white">99.98%</p>
            </div>
            <div className="rounded-2xl border border-[#D4AF37]/20 bg-[#D4AF37]/10 p-3">
              <p className="text-xs uppercase tracking-[0.2em] text-[#f6db84]">Pending Review</p>
              <p className="mt-1 text-2xl font-semibold text-white">84</p>
            </div>
          </div>
        </Card>
      </motion.div>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {summaryStats.map((stat) => (
          <StatCard key={stat.title} {...stat} />
        ))}
      </section>

      <section>
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-white">Quick Actions</h2>
          <p className="text-sm text-muted-foreground">Jump into the most frequent operations.</p>
        </div>
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {quickActions.map((action) => (
            <QuickActionCard key={action.title} {...action} />
          ))}
        </div>
      </section>

      <section className="grid gap-4 xl:grid-cols-2">
        <ChartCard title="Daily Streams" description="Audience reach over the last 7 days" type="line" data={streamsData} dataKey="streams" xAxisKey="day" />
        <ChartCard title="User Growth" description="New user acquisition by month" type="bar" data={growthData} dataKey="users" xAxisKey="month" color="#4f46e5" />
      </section>

      <section className="grid gap-4 xl:grid-cols-2">
        <ChartCard title="Revenue" description="Monthly revenue trend" type="area" data={revenueData} dataKey="revenue" xAxisKey="month" />
        <ChartCard title="Content Uploads" description="Songs, beats, and videos published monthly" type="bar" data={uploadsData} dataKey="songs" xAxisKey="month" secondaryDataKey="beats" secondaryColor="#4ade80" />
      </section>

      <section className="grid gap-4 xl:grid-cols-[1.1fr_0.9fr]">
        <ActivityTimeline items={recentActivity} />
        <div className="space-y-4">
          <Card className="border border-white/10 bg-white/5 shadow-[0_10px_30px_rgba(6,10,24,0.2)] backdrop-blur-xl">
            <CardContent className="p-5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-[#f6db84]">Moderation Queue</p>
                  <h3 className="text-lg font-semibold text-white">Pending Verification</h3>
                </div>
                <div className="rounded-full border border-[#D4AF37]/20 bg-[#D4AF37]/10 px-3 py-1 text-sm text-[#f6db84]">84 in queue</div>
              </div>
            </CardContent>
          </Card>
          <Tabs defaultValue="songs" className="w-full">
            <TabsList className="grid w-full grid-cols-3 rounded-2xl border border-white/10 bg-white/5 p-1">
              <TabsTrigger value="songs" className="rounded-xl">Songs</TabsTrigger>
              <TabsTrigger value="beats" className="rounded-xl">Beats</TabsTrigger>
              <TabsTrigger value="videos" className="rounded-xl">Videos</TabsTrigger>
            </TabsList>
            <TabsContent value="songs" className="mt-4 space-y-3">
              {verificationItems.filter((item) => item.type === "songs").map((item) => (
                <VerificationCard key={item.title} {...item} />
              ))}
            </TabsContent>
            <TabsContent value="beats" className="mt-4 space-y-3">
              {verificationItems.filter((item) => item.type === "beats").map((item) => (
                <VerificationCard key={item.title} {...item} />
              ))}
            </TabsContent>
            <TabsContent value="videos" className="mt-4 space-y-3">
              {verificationItems.filter((item) => item.type === "videos").map((item) => (
                <VerificationCard key={item.title} {...item} />
              ))}
            </TabsContent>
          </Tabs>
        </div>
      </section>

      <section className="grid gap-4 xl:grid-cols-[1fr_1fr_0.9fr]">
        <TrendingTable title="Trending Songs" items={trendingSongs} />
        <TrendingTable title="Trending Beats" items={trendingBeats} />
        <div className="space-y-3">
          <h2 className="text-lg font-semibold text-white">Platform Health</h2>
          {healthStatus.map((service) => (
            <HealthStatusCard key={service.name} {...service} />
          ))}
        </div>
      </section>
    </div>
  );
}
