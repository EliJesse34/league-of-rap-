import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface FilterBarProps {
  country: string;
  role: string;
  status: string;
  verification: string;
  dateJoined: string;
  onChange: (patch: Record<string, string>) => void;
}

export function FilterBar({ country, role, status, verification, dateJoined, onChange }: FilterBarProps) {
  return (
    <div className="flex flex-wrap items-center gap-3">
      <Select value={country || "all"} onValueChange={(value) => onChange({ country: value === "all" ? "" : value })}>
        <SelectTrigger className="w-36 border-white/10 bg-white/5 text-white">
          <SelectValue placeholder="Country" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All</SelectItem>
          <SelectItem value="US">US</SelectItem>
          <SelectItem value="GB">GB</SelectItem>
          <SelectItem value="CA">CA</SelectItem>
          <SelectItem value="AU">AU</SelectItem>
        </SelectContent>
      </Select>

      <Select value={role || "all"} onValueChange={(value) => onChange({ role: value === "all" ? "" : value })}>
        <SelectTrigger className="w-32 border-white/10 bg-white/5 text-white">
          <SelectValue placeholder="Role" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All</SelectItem>
          <SelectItem value="Admin">Admin</SelectItem>
          <SelectItem value="Artist">Artist</SelectItem>
          <SelectItem value="User">User</SelectItem>
          <SelectItem value="Moderator">Moderator</SelectItem>
        </SelectContent>
      </Select>

      <Select value={status || "all"} onValueChange={(value) => onChange({ status: value === "all" ? "" : value })}>
        <SelectTrigger className="w-36 border-white/10 bg-white/5 text-white">
          <SelectValue placeholder="Status" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All</SelectItem>
          <SelectItem value="Active">Active</SelectItem>
          <SelectItem value="Suspended">Suspended</SelectItem>
          <SelectItem value="Banned">Banned</SelectItem>
        </SelectContent>
      </Select>

      <Select value={verification || "all"} onValueChange={(value) => onChange({ verification: value === "all" ? "" : value })}>
        <SelectTrigger className="w-40 border-white/10 bg-white/5 text-white">
          <SelectValue placeholder="Verification" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All</SelectItem>
          <SelectItem value="verified">Verified</SelectItem>
          <SelectItem value="pending">Pending</SelectItem>
        </SelectContent>
      </Select>

      <Select value={dateJoined || "all"} onValueChange={(value) => onChange({ dateJoined: value === "all" ? "" : value })}>
        <SelectTrigger className="w-44 border-white/10 bg-white/5 text-white">
          <SelectValue placeholder="Date joined" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All time</SelectItem>
          <SelectItem value="30">Last 30 days</SelectItem>
          <SelectItem value="90">Last 90 days</SelectItem>
          <SelectItem value="365">Last 365 days</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}
