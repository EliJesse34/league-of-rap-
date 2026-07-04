import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { ShieldAlert, Sparkles, UserCheck, Users2 } from "lucide-react";
import { PageHeader } from "../PageHeader";
import { SearchBar } from "./SearchBar";
import { FilterBar } from "./FilterBar";
import { BulkActionToolbar } from "./BulkActionToolbar";
import { UserTable } from "./UserTable";
import { Pagination } from "./Pagination";
import { StatCard } from "../StatCard";
import { usersMock, type UserRecord } from "./users-mock";

export function UsersPage() {
  const [users, setUsers] = useState<UserRecord[]>(usersMock);
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

    return users.filter((user) => {
      const matchesQuery = !normalizedQuery || [user.username, user.email, user.country, user.role].join(" ").toLowerCase().includes(normalizedQuery);
      const matchesCountry = !filters.country || user.country === filters.country;
      const matchesRole = !filters.role || user.role === filters.role;
      const matchesStatus = !filters.status || user.status === filters.status;
      const matchesVerification = !filters.verification || (filters.verification === "verified" ? user.verified : !user.verified);
      const matchesDate = !filters.dateJoined || (() => {
        const joinedDate = new Date(user.joined);
        const now = new Date();
        const diffDays = (now.getTime() - joinedDate.getTime()) / (1000 * 60 * 60 * 24);
        return diffDays <= Number(filters.dateJoined);
      })();

      return matchesQuery && matchesCountry && matchesRole && matchesStatus && matchesVerification && matchesDate;
    });
  }, [users, q, filters]);

  const pagedUsers = useMemo(() => filtered.slice((page - 1) * pageSize, page * pageSize), [filtered, page]);

  useEffect(() => {
    if (page > Math.max(1, Math.ceil(filtered.length / pageSize))) {
      setPage(1);
    }
  }, [filtered.length, page, pageSize]);

  const updateUsers = (ids: number[], transform: (user: UserRecord) => UserRecord) => {
    setUsers((current) => current.map((user) => (ids.includes(user.id) ? transform(user) : user)));
  };

  const handleSelectAll = (checked: boolean) => {
    setSelectedIds(checked ? pagedUsers.map((user) => user.id) : []);
  };

  const handleToggleSelect = (id: number) => {
    setSelectedIds((current) => (current.includes(id) ? current.filter((value) => value !== id) : [...current, id]));
  };

  const handleBulkBan = () => {
    updateUsers(selectedIds, (user) => ({ ...user, status: "Banned" }));
    setSelectedIds([]);
  };

  const handleBulkSuspend = () => {
    updateUsers(selectedIds, (user) => ({ ...user, status: "Suspended" }));
    setSelectedIds([]);
  };

  const handleBulkDelete = () => {
    setUsers((current) => current.filter((user) => !selectedIds.includes(user.id)));
    setSelectedIds([]);
  };

  const handleBulkExport = () => {
    const selectedUsers = users.filter((user) => selectedIds.includes(user.id));
    const csv = ["id,username,email,country,role,status,joined,followers", ...selectedUsers.map((user) => [user.id, user.username, user.email, user.country, user.role, user.status, user.joined, user.followers].join(","))].join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "selected-users.csv";
    link.click();
    window.URL.revokeObjectURL(url);
  };

  const handleVerifyUser = (user: UserRecord) => {
    updateUsers([user.id], (current) => ({ ...current, verified: !current.verified }));
  };

  const handleResetPassword = (user: UserRecord) => {
    updateUsers([user.id], (current) => ({ ...current, lastActive: "Password reset requested" }));
  };

  const handleDeleteUser = (user: UserRecord) => {
    setUsers((current) => current.filter((item) => item.id !== user.id));
    setSelectedIds((current) => current.filter((id) => id !== user.id));
  };

  const stats = [
    { title: "Total users", value: users.length.toString(), change: "+12% this month", trend: "up" as const, icon: Users2 },
    { title: "Active users", value: users.filter((user) => user.status === "Active").length.toString(), change: "+8% week over week", trend: "up" as const, icon: UserCheck },
    { title: "Verified artists", value: users.filter((user) => user.role === "Artist" && user.verified).length.toString(), change: "4 pending review", trend: "up" as const, icon: Sparkles },
    { title: "Suspended users", value: users.filter((user) => user.status === "Suspended").length.toString(), change: "2 escalated", trend: "down" as const, icon: ShieldAlert },
  ];

  return (
    <div className="space-y-6">
      <PageHeader title="Users" description="Manage platform users, account trust, and role controls from a single workspace." breadcrumbs={[{ label: "Admin" }, { label: "Community" }, { label: "Users" }]} badge="Live" />

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {stats.map((stat) => (
          <StatCard key={stat.title} {...stat} />
        ))}
      </div>

      <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.2 }} className="space-y-5 rounded-[28px] border border-white/10 bg-white/5 p-4 shadow-[0_18px_60px_rgba(6,10,24,0.3)] backdrop-blur-xl md:p-6">
        <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
          <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
            <SearchBar value={q} onChange={setQ} placeholder="Search by username, email, or country" />
            <FilterBar country={filters.country} role={filters.role} status={filters.status} verification={filters.verification} dateJoined={filters.dateJoined} onChange={(patch) => setFilters((current) => ({ ...current, ...patch }))} />
          </div>
          <BulkActionToolbar selectedCount={selectedIds.length} onBan={handleBulkBan} onSuspend={handleBulkSuspend} onVerify={() => undefined} onDelete={handleBulkDelete} onExport={handleBulkExport} verifyLabel="Verify" />
        </div>

        <UserTable
          items={pagedUsers}
          selectedIds={selectedIds}
          onToggleSelect={handleToggleSelect}
          onSelectAll={handleSelectAll}
          onViewUser={(user) => setSelectedIds((current) => (current.includes(user.id) ? current : [...current, user.id]))}
          onEditUser={() => undefined}
          onSuspendUser={(user) => updateUsers([user.id], (current) => ({ ...current, status: "Suspended" }))}
          onBanUser={(user) => updateUsers([user.id], (current) => ({ ...current, status: "Banned" }))}
          onVerifyUser={handleVerifyUser}
          onResetPassword={handleResetPassword}
          onDeleteUser={handleDeleteUser}
        />

        <Pagination page={page} pageSize={pageSize} totalItems={filtered.length} onPageChange={setPage} />
      </motion.div>
    </div>
  );
}
