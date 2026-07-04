import { createFileRoute } from "@tanstack/react-router";
import { PlaceholderPage } from "@/components/admin/PlaceholderPage";

export const Route = createFileRoute("/admin/analytics")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <PlaceholderPage
      title="Analytics"
      description="Surface performance metrics and reporting views for the platform in a future-ready layout."
      breadcrumbs={[{ label: "Admin" }, { label: "Analytics" }]}
      badge="Coming Soon"
    />
  );
}
