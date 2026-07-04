import { Badge } from "@/components/ui/badge";

interface PriceBadgeProps {
  priceType: "Free" | "Premium";
  price: number;
}

export function PriceBadge({ priceType, price }: PriceBadgeProps) {
  if (priceType === "Free") {
    return <Badge className="border-emerald-500/20 bg-emerald-500/10 text-emerald-300">Free</Badge>;
  }

  return <Badge className="border-[#D4AF37]/20 bg-[#D4AF37]/10 text-[#f6db84]">${price}</Badge>;
}
