import { createFileRoute } from "@tanstack/react-router";
import { PlaceholderPage } from "@/components/admin/PlaceholderPage";

export const Route = createFileRoute("/admin/help")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <PlaceholderPage
      title="Help Center"
      description="Centralize documentation, support notes, and admin guidance for the team."
      breadcrumbs={[{ label: "Admin" }, { label: "Help" }]}
      badge="Coming Soon"
    />
  );
}
