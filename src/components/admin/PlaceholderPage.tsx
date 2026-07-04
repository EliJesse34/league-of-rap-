import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { PageHeader } from "./PageHeader";

interface PlaceholderPageProps {
  title: string;
  description: string;
  breadcrumbs: Array<{ label: string; href?: string }>;
  badge?: string;
}

export function PlaceholderPage({ title, description, breadcrumbs, badge }: PlaceholderPageProps) {
  return (
    <div className="space-y-6">
      <PageHeader title={title} description={description} breadcrumbs={breadcrumbs} badge={badge} />
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.25 }}
      >
        <Card className="border border-white/10 bg-gradient-to-br from-white/10 to-white/5 shadow-[0_18px_60px_rgba(6,10,24,0.3)] backdrop-blur-xl">
          <CardContent className="flex flex-col items-center justify-center gap-4 px-8 py-16 text-center">
            <div className="grid h-14 w-14 place-items-center rounded-2xl bg-[#D4AF37]/15 text-[#f6db84]">
              <Sparkles className="h-7 w-7" />
            </div>
            <div className="space-y-2">
              <h2 className="text-2xl font-semibold text-white">Coming Soon</h2>
              <p className="max-w-xl text-sm text-muted-foreground">
                This admin section is being prepared for the next phase of the platform. The shell, navigation, and routing are ready for rapid expansion.
              </p>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
