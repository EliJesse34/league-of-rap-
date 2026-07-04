import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { ArrowDownUp, ArrowUpDown, Crown, RadioTower, Sparkles, TrendingUp, UploadCloud, Users2 } from "lucide-react";
import { PageHeader } from "@/components/admin/PageHeader";
import { BeatFilterBar } from "./BeatFilterBar";
import { BeatStatsCard } from "./BeatStatsCard";
import { BeatUploadModal } from "./BeatUploadModal";
import { BeatDetailsDrawer } from "./BeatDetailsDrawer";
import { BeatAnalyticsCard } from "./BeatAnalyticsCard";
import { BulkActionToolbar } from "./BulkActionToolbar";
import { BeatsTable } from "./BeatsTable";
import { Pagination } from "@/components/admin/user-management/Pagination";
import { SearchBar } from "@/components/admin/user-management/SearchBar";
import { beatsMock, beatAnalyticsSeries, type BeatRecord } from "./beats-mock";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export function BeatsPage() {
  const [beats, setBeats] = useState<BeatRecord[]>(beatsMock);
  const [search, setSearch] = useState("");
  const [filters, setFilters] = useState({ genre: "", mood: "", visibility: "", sortBy: "newest" });
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const [uploadOpen, setUploadOpen] = useState(false);
  const [detailsBeat, setDetailsBeat] = useState<BeatRecord | null>(null);
  const [page, setPage] = useState(1);
  const [featuredOrder, setFeaturedOrder] = useState<number[]>(beatsMock.filter((beat) => beat.featured).map((beat) => beat.id));
  const pageSize = 6;

  useEffect(() => {
    setPage(1);
  }, [search, filters.genre, filters.mood, filters.visibility, filters.sortBy]);

  const filtered = useMemo(() => {
    const query = search.trim().toLowerCase();
    const next = beats.filter((beat) => {
      const matchesQuery = !query || [beat.title, beat.producer, beat.genre, beat.mood, beat.key].join(" ").toLowerCase().includes(query);
      const matchesGenre = !filters.genre || beat.genre === filters.genre;
      const matchesMood = !filters.mood || beat.mood === filters.mood;
      const matchesVisibility = !filters.visibility || beat.status === filters.visibility;
      return matchesQuery && matchesGenre && matchesMood && matchesVisibility;
    });

    return next.sort((a, b) => {
      if (filters.sortBy === "downloads") return b.downloads - a.downloads;
      if (filters.sortBy === "sales") return b.sales - a.sales;
      return Number(new Date(b.uploadDate)) - Number(new Date(a.uploadDate));
    });
  }, [beats, search, filters]);

  const pagedBeats = useMemo(() => filtered.slice((page - 1) * pageSize, page * pageSize), [filtered, page]);

  useEffect(() => {
    if (page > Math.max(1, Math.ceil(filtered.length / pageSize))) {
      setPage(1);
    }
  }, [filtered.length, page, pageSize]);

  const featuredBeats = useMemo(() => featuredOrder.map((id) => beats.find((beat) => beat.id === id)).filter(Boolean) as BeatRecord[], [featuredOrder, beats]);

  const updateBeats = (ids: number[], transform: (beat: BeatRecord) => BeatRecord) => {
    setBeats((current) => current.map((beat) => (ids.includes(beat.id) ? transform(beat) : beat)));
  };

  const handleToggleFeature = (beat: BeatRecord) => {
    updateBeats([beat.id], (current) => ({ ...current, featured: !current.featured }));
    setFeaturedOrder((current) => (current.includes(beat.id) ? current.filter((id) => id !== beat.id) : [...current, beat.id]));
  };

  const handleTogglePin = (beat: BeatRecord) => {
    updateBeats([beat.id], (current) => ({ ...current, pinned: !current.pinned }));
  };

  const handleToggleVisibility = (beat: BeatRecord) => {
    updateBeats([beat.id], (current) => ({ ...current, status: current.status === "Hidden" ? "Published" : "Hidden" }));
  };

  const handleDeleteBeat = (beat: BeatRecord) => {
    setBeats((current) => current.filter((item) => item.id !== beat.id));
    setSelectedIds((current) => current.filter((id) => id !== beat.id));
  };

  const handleBulkFeature = () => {
    updateBeats(selectedIds, (current) => ({ ...current, featured: true }));
    setFeaturedOrder((current) => Array.from(new Set([...current, ...selectedIds])));
    setSelectedIds([]);
  };

  const handleBulkHide = () => {
    updateBeats(selectedIds, (current) => ({ ...current, status: "Hidden" }));
    setSelectedIds([]);
  };

  const handleBulkArchive = () => {
    updateBeats(selectedIds, (current) => ({ ...current, status: "Archived" }));
    setSelectedIds([]);
  };

  const handleBulkExport = () => {
    const csv = ["id,title,producer,genre,priceType,price,streams,downloads,sales,revenue,status", ...beats.filter((beat) => selectedIds.includes(beat.id)).map((beat) => [beat.id, beat.title, beat.producer, beat.genre, beat.priceType, beat.price, beat.streams, beat.downloads, beat.sales, beat.revenue, beat.status].join(","))].join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "selected-beats.csv";
    link.click();
    window.URL.revokeObjectURL(url);
  };

  const handleUpload = (payload: Record<string, string>) => {
    const newBeat: BeatRecord = {
      id: beats.length + 1,
      title: payload.title || "Untitled beat",
      producer: payload.producer || "LeagueOfRap",
      description: payload.description || "Newly uploaded beat",
      genre: payload.genre || "Boom Bap",
      mood: payload.mood || "Energetic",
      bpm: Number(payload.bpm || 95),
      key: payload.key || "Am",
      duration: "3:20",
      priceType: payload.priceType === "Free" ? "Free" : "Premium",
      price: Number(payload.price || 24),
      license: payload.license || "Exclusive",
      coverArt: "NB",
      streams: 0,
      downloads: 0,
      sales: 0,
      revenue: 0,
      featured: false,
      pinned: false,
      status: "Published",
      uploadDate: new Date().toISOString().slice(0, 10),
      tags: payload.tags.split(",").map((tag) => tag.trim()).filter(Boolean),
      previewUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3",
    };
    setBeats((current) => [newBeat, ...current]);
    setFeaturedOrder((current) => current);
  };

  const handleMoveFeatured = (direction: 1 | -1, beatId: number) => {
    setFeaturedOrder((current) => {
      const index = current.indexOf(beatId);
      if (index < 0) return current;
      const next = [...current];
      const target = index + direction;
      if (target < 0 || target >= next.length) return current;
      [next[index], next[target]] = [next[target], next[index]];
      return next;
    });
  };

  const stats = [
    { title: "Total beats", value: beats.length.toString(), detail: "All approved catalog entries", icon: RadioTower },
    { title: "Free beats", value: beats.filter((beat) => beat.priceType === "Free").length.toString(), detail: "Available without purchase", icon: Sparkles },
    { title: "Premium beats", value: beats.filter((beat) => beat.priceType === "Premium").length.toString(), detail: "Monetized catalog entries", icon: Crown },
    { title: "Featured beats", value: beats.filter((beat) => beat.featured).length.toString(), detail: "Highlighted for discovery", icon: TrendingUp },
    { title: "Beat downloads", value: beats.reduce((sum, beat) => sum + beat.downloads, 0).toLocaleString(), detail: "Recent download volume", icon: Sparkles },
    { title: "Beat sales", value: beats.reduce((sum, beat) => sum + beat.sales, 0).toString(), detail: "Paid purchases this cycle", icon: Users2 },
    { title: "Revenue", value: `$${beats.reduce((sum, beat) => sum + beat.revenue, 0).toLocaleString()}`, detail: "Catalog revenue generated", icon: TrendingUp },
    { title: "New beats this week", value: beats.filter((beat) => Number(new Date().getDate() - new Date(beat.uploadDate).getDate()) <= 7).length.toString(), detail: "Freshly uploaded catalog", icon: UploadCloud },
  ];

  return (
    <div className="space-y-6">
      <PageHeader title="Beat management" description="Manage approved beats, pricing, licensing, featured placement, and performance insights from a single premium console." breadcrumbs={[{ label: "Admin" }, { label: "Content" }, { label: "Beats" }]} badge="Live" />

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {stats.map((stat) => (
          <BeatStatsCard key={stat.title} {...stat} />
        ))}
      </div>

      <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.2 }} className="space-y-5 rounded-[28px] border border-white/10 bg-white/5 p-4 shadow-[0_18px_60px_rgba(6,10,24,0.3)] backdrop-blur-xl md:p-6">
        <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
          <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
            <SearchBar value={search} onChange={setSearch} placeholder="Search beat title or producer" />
            <BeatFilterBar genre={filters.genre} mood={filters.mood} visibility={filters.visibility} sortBy={filters.sortBy} onChange={(patch) => setFilters((current) => ({ ...current, ...patch }))} />
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <Button onClick={() => setUploadOpen(true)}>
              <UploadCloud className="mr-2 h-4 w-4" /> Upload beat
            </Button>
            <BulkActionToolbar selectedCount={selectedIds.length} onFeature={handleBulkFeature} onHide={handleBulkHide} onArchive={handleBulkArchive} onExport={handleBulkExport} />
          </div>
        </div>

        <Card className="border border-white/10 bg-white/5">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-lg font-semibold text-white">Featured beats</p>
                <p className="text-sm text-muted-foreground">Pin and reorder beats for homepage discovery.</p>
              </div>
              <Badge className="border-[#D4AF37]/20 bg-[#D4AF37]/10 text-[#f6db84]">{featuredBeats.length} active</Badge>
            </div>
            <div className="mt-4 grid gap-3 md:grid-cols-2 xl:grid-cols-3">
              {featuredBeats.map((beat) => (
                <div key={beat.id} className="rounded-2xl border border-white/10 bg-[#050816]/60 p-3">
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <p className="font-medium text-white">{beat.title}</p>
                      <p className="text-sm text-muted-foreground">{beat.producer}</p>
                    </div>
                    <Badge variant="outline">{beat.priceType}</Badge>
                  </div>
                  <div className="mt-3 flex gap-2">
                    <Button size="sm" variant="outline" onClick={() => handleMoveFeatured(-1, beat.id)}>
                      <ArrowUpDown className="mr-1 h-3.5 w-3.5" /> Up
                    </Button>
                    <Button size="sm" variant="outline" onClick={() => handleMoveFeatured(1, beat.id)}>
                      <ArrowDownUp className="mr-1 h-3.5 w-3.5" /> Down
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <BeatsTable
          items={pagedBeats}
          selectedIds={selectedIds}
          onToggleSelect={(id) => setSelectedIds((current) => (current.includes(id) ? current.filter((value) => value !== id) : [...current, id]))}
          onSelectAll={(checked) => setSelectedIds(checked ? pagedBeats.map((beat) => beat.id) : [])}
          onViewBeat={setDetailsBeat}
          onToggleFeature={handleToggleFeature}
          onTogglePin={handleTogglePin}
          onToggleVisibility={handleToggleVisibility}
          onDeleteBeat={handleDeleteBeat}
        />

        <Pagination page={page} pageSize={pageSize} totalItems={filtered.length} onPageChange={setPage} />
      </motion.div>

      <div className="grid gap-4 xl:grid-cols-2">
        <BeatAnalyticsCard title="Streams & Downloads" description="Rolling performance by day" type="line" data={beatAnalyticsSeries} dataKey="streams" xAxisKey="label" secondaryDataKey="downloads" />
        <BeatAnalyticsCard title="Revenue & Sales" description="Daily monetization signals" type="area" data={beatAnalyticsSeries} dataKey="revenue" xAxisKey="label" />
      </div>

      <BeatUploadModal open={uploadOpen} onOpenChange={setUploadOpen} onSubmit={handleUpload} />
      <BeatDetailsDrawer open={Boolean(detailsBeat)} onClose={() => setDetailsBeat(null)} beat={detailsBeat} />
    </div>
  );
}
