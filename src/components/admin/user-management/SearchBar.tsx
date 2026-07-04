import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export function SearchBar({ value, onChange, placeholder = "Search users or artists" }: SearchBarProps) {
  return (
    <div className="relative min-w-[240px] flex-1 md:min-w-[320px]">
      <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
        <Search className="h-4 w-4" />
      </span>
      <Input
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="h-10 border-white/10 bg-white/5 pl-10 text-white placeholder:text-muted-foreground"
        placeholder={placeholder}
      />
    </div>
  );
}
