import { createFileRoute } from "@tanstack/react-router";
import { Header } from "@/components/lor/Header";
import { SecondaryNav } from "@/components/lor/SecondaryNav";
import { FeaturedHero } from "@/components/lor/FeaturedHero";
import { RightSidebar } from "@/components/lor/RightSidebar";
import { LatestVideos } from "@/components/lor/LatestVideos";
import { Shorts } from "@/components/lor/Shorts";
import { FeaturedVideoCategories } from "@/components/lor/FeaturedVideoCategories";
import { CtaBand } from "@/components/lor/CtaBand";
import { Footer } from "@/components/lor/Footer";
import { MobileBottomNav } from "@/components/lor/MobileBottomNav";
import { TopArtists } from "@/components/lor/TopArtists";
import { LiveNow } from "@/components/lor/LiveNow";
import { BattleRap } from "@/components/lor/BattleRap";
import { NewsStrip } from "@/components/lor/NewsStrip";
import { BillboardChart } from "@/components/lor/BillboardChart";
import { HomeChat } from "@/components/lor/HomeChat";
import { NetworkStrip } from "@/components/lor/NetworkStrip";
import { BeatMarketplace } from "@/components/lor/BeatMarketplace";
import { AdSense } from "@/components/lor/AdSense";

export const Route = createFileRoute("/")({
  component: HomePage,
});

function HomePage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <SecondaryNav />

      <main className="mx-auto w-full max-w-[1440px] px-4 pb-24 pt-5 md:px-6 md:pb-10">
        <div className="grid w-full min-w-0 grid-cols-1 gap-6 lg:grid-cols-[minmax(0,1fr)_300px]">
          <div className="space-y-6 min-w-0">
            <FeaturedHero />
            <HomeChat />
            <LiveNow />
            <AdSense className="lor-card p-4" />
            <Shorts />
            <FeaturedVideoCategories />
            <BeatMarketplace />
            <TopArtists />
            <LatestVideos />
            <BillboardChart />
            <BattleRap />
            <NewsStrip />
            <NetworkStrip />
            <CtaBand />
          </div>
          <RightSidebar />
        </div>
      </main>

      <Footer />
      <MobileBottomNav />
    </div>
  );
}
