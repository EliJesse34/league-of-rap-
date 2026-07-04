import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Crown, ShieldAlert, Sparkles, Users2 } from "lucide-react";
import { PageHeader } from "../PageHeader";
import { SearchBar } from "./SearchBar";
import { FilterBar } from "./FilterBar";
import { BulkActionToolbar } from "./BulkActionToolbar";
import { ArtistTable } from "./ArtistTable";
import { Pagination } from "./Pagination";
import { StatCard } from "../StatCard";
import { artistsMock, type ArtistRecord } from "./users-mock";

export function ArtistsPage() {
  const [artists, setArtists] = useState<ArtistRecord[]>(artistsMock);
  const [q, setQ] = useState("");
  const [filters, setFilters] = useState({ country: "", role: "", status: "", verification: "", dateJoined: "" });
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const [page, setPage] = useState(1);
  const pageSize = 8;

  useEffect(() => {
    setPage(1);
  }, [q, filters.country, filters.role, filters.status, filters.verification, filters.dateJoined]);

  const filtered = useMemo(() => {
    const normalizedQuery = q.trim().toLowerCase();
    return artists.filter((artist) => {
      const matchesQuery = !normalizedQuery || [artist.stageName, artist.realName, artist.country].join(" ").toLowerCase().includes(normalizedQuery);
      const matchesCountry = !filters.country || artist.country === filters.country;
      const matchesRole = !filters.role || filters.role === "Artist";
      const matchesStatus = !filters.status || artist.status === filters.status;
      const matchesVerification = !filters.verification || (filters.verification === "verified" ? artist.verified : !artist.verified);
      return matchesQuery && matchesCountry && matchesRole && matchesStatus && matchesVerification;
    });
  }, [artists, q, filters]);

  const pagedArtists = useMemo(() => filtered.slice((page - 1) * pageSize, page * pageSize), [filtered, page]);

  useEffect(() => {
    if (page > Math.max(1, Math.ceil(filtered.length / pageSize))) {
      setPage(1);
    }
  }, [filtered.length, page, pageSize]);

  const updateArtists = (ids: number[], transform: (artist: ArtistRecord) => ArtistRecord) => {
    setArtists((current) => current.map((artist) => (ids.includes(artist.id) ? transform(artist) : artist)));
  };

  const handleSelectAll = (checked: boolean) => {
    setSelectedIds(checked ? pagedArtists.map((artist) => artist.id) : []);
  };

  const handleToggleSelect = (id: number) => {
    setSelectedIds((current) => (current.includes(id) ? current.filter((value) => value !== id) : [...current, id]));
  };

  const handleVerifyArtist = (artist: ArtistRecord) => {
    updateArtists([artist.id], (current) => ({ ...current, verified: !current.verified }));
  };

  const handleFeatureArtist = (artist: ArtistRecord) => {
    updateArtists([artist.id], (current) => ({ ...current, featured: !current.featured }));
  };

  const handleBulkVerify = () => {
    updateArtists(selectedIds, (artist) => ({ ...artist, verified: true }));
    setSelectedIds([]);
  };

  const handleBulkDelete = () => {
    setArtists((current) => current.filter((artist) => !selectedIds.includes(artist.id)));
    setSelectedIds([]);
  };

  const handleBulkExport = () => {
    const selectedArtists = artists.filter((artist) => selectedIds.includes(artist.id));
    const csv = ["id,stageName,realName,country,followers,monthlyListeners,earnings,verified,status", ...selectedArtists.map((artist) => [artist.id, artist.stageName, artist.realName, artist.country, artist.followers, artist.monthlyListeners, artist.earnings, artist.verified, artist.status].join(","))].join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "selected-artists.csv";
    link.click();
    window.URL.revokeObjectURL(url);
  };

  const stats = [
    { title: "Artist roster", value: artists.length.toString(), change: "+6 new this week", trend: "up" as const, icon: Users2 },
    { title: "Verified artists", value: artists.filter((artist) => artist.verified).length.toString(), change: "+5 this month", trend: "up" as const, icon: Sparkles },
    { title: "Featured artists", value: artists.filter((artist) => artist.featured).length.toString(), change: "3 boosted", trend: "up" as const, icon: Crown },
    { title: "Suspended artists", value: artists.filter((artist) => artist.status === "Suspended").length.toString(), change: "1 escalated", trend: "down" as const, icon: ShieldAlert },
  ];

  return (
    <div className="space-y-6">
      <PageHeader title="Artists" description="Inspect artist profiles, verify identities, and feature priority creators." breadcrumbs={[{ label: "Admin" }, { label: "Community" }, { label: "Artists" }]} badge="Live" />

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {stats.map((stat) => (
          <StatCard key={stat.title} {...stat} />
        ))}
      </div>

      <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.2 }} className="space-y-5 rounded-[28px] border border-white/10 bg-white/5 p-4 shadow-[0_18px_60px_rgba(6,10,24,0.3)] backdrop-blur-xl md:p-6">
        <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
          <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
            <SearchBar value={q} onChange={setQ} placeholder="Search artists or real names" />
            <FilterBar country={filters.country} role={filters.role} status={filters.status} verification={filters.verification} dateJoined={filters.dateJoined} onChange={(patch) => setFilters((current) => ({ ...current, ...patch }))} />
          </div>
          <BulkActionToolbar selectedCount={selectedIds.length} onBan={() => undefined} onSuspend={() => undefined} onVerify={handleBulkVerify} onDelete={handleBulkDelete} onExport={handleBulkExport} verifyLabel="Verify" />
        </div>

        <ArtistTable
          items={pagedArtists}
          selectedIds={selectedIds}
          onToggleSelect={handleToggleSelect}
          onSelectAll={handleSelectAll}
          onVerifyArtist={handleVerifyArtist}
          onFeatureArtist={handleFeatureArtist}
          onSuspendArtist={(artist) => updateArtists([artist.id], (current) => ({ ...current, status: "Suspended" }))}
          onDeleteArtist={(artist) => {
            setArtists((current) => current.filter((item) => item.id !== artist.id));
            setSelectedIds((current) => current.filter((id) => id !== artist.id));
          }}
        />

        <Pagination page={page} pageSize={pageSize} totalItems={filtered.length} onPageChange={setPage} />
      </motion.div>
    </div>
  );
}
