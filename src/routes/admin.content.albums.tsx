import { createFileRoute } from "@tanstack/react-router";
import { PlaceholderPage } from "@/components/admin/PlaceholderPage";

export const Route = createFileRoute("/admin/content/albums")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <PlaceholderPage
      title="Albums"
      description="Centralize new releases, artist collaborations, and catalog management."
      breadcrumbs={[{ label: "Admin" }, { label: "Content" }, { label: "Albums" }]}
      badge="Coming Soon"
    />
  );
}
