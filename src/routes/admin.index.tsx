import { createFileRoute } from "@tanstack/react-router";
import { OverviewDashboard } from "@/components/admin/OverviewDashboard";

export const Route = createFileRoute("/admin/")({
  component: RouteComponent,
});

function RouteComponent() {
  return <OverviewDashboard />;
}
