import { createFileRoute } from "@tanstack/react-router";
import { PlaceholderPage } from "@/components/admin/PlaceholderPage";

export const Route = createFileRoute("/admin/business/advertisements")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <PlaceholderPage
      title="Advertisements"
      description="Plan ad inventory, booking workflows, and campaign oversight from the dashboard."
      breadcrumbs={[{ label: "Admin" }, { label: "Business" }, { label: "Advertisements" }]}
      badge="Coming Soon"
    />
  );
}
