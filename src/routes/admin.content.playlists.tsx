import { createFileRoute } from "@tanstack/react-router";
import { PlaceholderPage } from "@/components/admin/PlaceholderPage";

export const Route = createFileRoute("/admin/content/playlists")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <PlaceholderPage
      title="Playlists"
      description="Create and curate editorial playlists and audience experiences."
      breadcrumbs={[{ label: "Admin" }, { label: "Content" }, { label: "Playlists" }]}
      badge="Coming Soon"
    />
  );
}
