import { createFileRoute } from "@tanstack/react-router";
import { PlaceholderPage } from "@/components/admin/PlaceholderPage";

export const Route = createFileRoute("/admin/moderation/verification")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <PlaceholderPage
      title="Verification Center"
      description="Review submitted content, verify creators, and make approval decisions quickly."
      breadcrumbs={[{ label: "Admin" }, { label: "Moderation" }, { label: "Verification Center" }]}
      badge="Coming Soon"
    />
  );
}
