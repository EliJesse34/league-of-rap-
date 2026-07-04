import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import type { LucideIcon } from "lucide-react";

interface BeatStatsCardProps {
  title: string;
  value: string;
  detail: string;
  icon: LucideIcon;
}

export function BeatStatsCard({ title, value, detail, icon: Icon }: BeatStatsCardProps) {
  return (
    <motion.div whileHover={{ y: -3, scale: 1.01 }} transition={{ duration: 0.2 }}>
      <Card className="border border-white/10 bg-white/5 shadow-[0_10px_30px_rgba(6,10,24,0.2)] backdrop-blur-xl">
        <CardContent className="p-5">
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="text-sm text-muted-foreground">{title}</p>
              <p className="mt-2 text-2xl font-semibold text-white">{value}</p>
            </div>
            <div className="rounded-2xl bg-[#D4AF37]/15 p-2.5 text-[#f6db84]">
              <Icon className="h-5 w-5" />
            </div>
          </div>
          <p className="mt-4 text-sm text-muted-foreground">{detail}</p>
        </CardContent>
      </Card>
    </motion.div>
  );
}
