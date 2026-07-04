import type { ReactNode } from "react";
import { Badge } from "@/components/ui/badge";
import { Breadcrumb } from "./Breadcrumb";

interface PageHeaderProps {
  title: string;
  description: string;
  breadcrumbs?: Array<{ label: string; href?: string }>;
  badge?: string;
  actions?: ReactNode;
}

export function PageHeader({ title, description, breadcrumbs, badge, actions }: PageHeaderProps) {
  return (
    <div className="flex flex-col gap-4 rounded-3xl border border-white/10 bg-white/5 p-6 shadow-[0_12px_40px_rgba(6,10,24,0.25)] backdrop-blur-xl">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div className="space-y-3">
          {badge && (
            <Badge variant="secondary" className="border-[#D4AF37]/30 bg-[#D4AF37]/10 text-[#f6db84]">
              {badge}
            </Badge>
          )}
          <div className="space-y-2">
            <h1 className="text-3xl font-semibold tracking-tight text-white">{title}</h1>
            <p className="max-w-2xl text-sm text-muted-foreground">{description}</p>
          </div>
          {breadcrumbs && <Breadcrumb items={breadcrumbs} />}
        </div>
        {actions}
      </div>
    </div>
  );
}
