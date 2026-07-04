import { createFileRoute } from "@tanstack/react-router";
import { PlaceholderPage } from "@/components/admin/PlaceholderPage";

export const Route = createFileRoute("/admin/moderation/reports")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <PlaceholderPage
      title="Reports"
      description="Track abuse reports, copyright issues, and enforcement actions in a structured queue."
      breadcrumbs={[{ label: "Admin" }, { label: "Moderation" }, { label: "Reports" }]}
      badge="Coming Soon"
    />
  );
}
