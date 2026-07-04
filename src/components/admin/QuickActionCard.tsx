import type { LucideIcon } from "lucide-react";
import { motion } from "framer-motion";
import { Link } from "@tanstack/react-router";
import { Card, CardContent } from "@/components/ui/card";

interface QuickActionCardProps {
  title: string;
  description: string;
  href: string;
  icon: LucideIcon;
}

export function QuickActionCard({ title, description, href, icon: Icon }: QuickActionCardProps) {
  return (
    <motion.div whileHover={{ y: -4, scale: 1.01 }} transition={{ duration: 0.2 }}>
      <Link to={href} className="block">
        <Card className="h-full border border-white/10 bg-gradient-to-br from-white/10 to-white/5 shadow-[0_10px_30px_rgba(6,10,24,0.2)] transition-all hover:border-[#D4AF37]/35 hover:shadow-[0_16px_40px_rgba(212,175,55,0.16)]">
          <CardContent className="flex items-start gap-3 p-5">
            <div className="rounded-2xl bg-[#D4AF37]/15 p-2.5 text-[#f6db84]">
              <Icon className="h-5 w-5" />
            </div>
            <div>
              <h3 className="font-semibold text-white">{title}</h3>
              <p className="mt-1 text-sm text-muted-foreground">{description}</p>
            </div>
          </CardContent>
        </Card>
      </Link>
    </motion.div>
  );
}
