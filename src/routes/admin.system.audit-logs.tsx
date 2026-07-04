import { createFileRoute } from "@tanstack/react-router";
import { PlaceholderPage } from "@/components/admin/PlaceholderPage";

export const Route = createFileRoute("/admin/system/audit-logs")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <PlaceholderPage
      title="Audit Logs"
      description="Track system changes, operator actions, and administrative history in a future-ready view."
      breadcrumbs={[{ label: "Admin" }, { label: "System" }, { label: "Audit Logs" }]}
      badge="Coming Soon"
    />
  );
}
