import { BadgeCheck } from "lucide-react";

export function Verified({ className = "" }: { className?: string }) {
  return <BadgeCheck className={`h-3.5 w-3.5 fill-primary text-background ${className}`} />;
}
