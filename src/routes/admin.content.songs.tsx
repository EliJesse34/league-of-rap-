import { createFileRoute } from "@tanstack/react-router";
import { PlaceholderPage } from "@/components/admin/PlaceholderPage";

export const Route = createFileRoute("/admin/content/songs")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <PlaceholderPage
      title="Songs"
      description="Review uploaded songs, approve submissions, and prepare moderation workflows for release management."
      breadcrumbs={[{ label: "Admin" }, { label: "Content" }, { label: "Songs" }]}
      badge="Coming Soon"
    />
  );
}
