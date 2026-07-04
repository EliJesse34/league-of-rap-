import { Badge } from "@/components/ui/badge";

interface LicenseBadgeProps {
  license: string;
}

export function LicenseBadge({ license }: LicenseBadgeProps) {
  return <Badge variant="outline">{license}</Badge>;
}
