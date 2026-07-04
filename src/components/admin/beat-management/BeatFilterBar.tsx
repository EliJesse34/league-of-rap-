import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface BeatFilterBarProps {
  genre: string;
  mood: string;
  visibility: string;
  sortBy: string;
  onChange: (patch: Record<string, string>) => void;
}

export function BeatFilterBar({ genre, mood, visibility, sortBy, onChange }: BeatFilterBarProps) {
  return (
    <div className="flex flex-wrap items-center gap-3">
      <Select value={genre || "all"} onValueChange={(value) => onChange({ genre: value === "all" ? "" : value })}>
        <SelectTrigger className="w-32 border-white/10 bg-white/5 text-white">
          <SelectValue placeholder="Genre" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All</SelectItem>
          <SelectItem value="Boom Bap">Boom Bap</SelectItem>
          <SelectItem value="Trap">Trap</SelectItem>
          <SelectItem value="Plugg">Plugg</SelectItem>
          <SelectItem value="Lofi">Lofi</SelectItem>
          <SelectItem value="Afro">Afro</SelectItem>
        </SelectContent>
      </Select>

      <Select value={mood || "all"} onValueChange={(value) => onChange({ mood: value === "all" ? "" : value })}>
        <SelectTrigger className="w-32 border-white/10 bg-white/5 text-white">
          <SelectValue placeholder="Mood" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All</SelectItem>
          <SelectItem value="Dark">Dark</SelectItem>
          <SelectItem value="Confident">Confident</SelectItem>
          <SelectItem value="Melancholic">Melancholic</SelectItem>
          <SelectItem value="Chill">Chill</SelectItem>
          <SelectItem value="Energetic">Energetic</SelectItem>
        </SelectContent>
      </Select>

      <Select value={visibility || "all"} onValueChange={(value) => onChange({ visibility: value === "all" ? "" : value })}>
        <SelectTrigger className="w-36 border-white/10 bg-white/5 text-white">
          <SelectValue placeholder="Visibility" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All</SelectItem>
          <SelectItem value="Published">Published</SelectItem>
          <SelectItem value="Hidden">Hidden</SelectItem>
          <SelectItem value="Archived">Archived</SelectItem>
        </SelectContent>
      </Select>

      <Select value={sortBy || "newest"} onValueChange={(value) => onChange({ sortBy: value })}>
        <SelectTrigger className="w-40 border-white/10 bg-white/5 text-white">
          <SelectValue placeholder="Sort" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="newest">Newest</SelectItem>
          <SelectItem value="downloads">Most Downloaded</SelectItem>
          <SelectItem value="sales">Highest Selling</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}
