import { createFileRoute } from "@tanstack/react-router";
import { PlaceholderPage } from "@/components/admin/PlaceholderPage";

export const Route = createFileRoute("/admin/content/genres")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <PlaceholderPage
      title="Genres"
      description="Organize taxonomy, tags, and music categories for better discovery."
      breadcrumbs={[{ label: "Admin" }, { label: "Content" }, { label: "Genres" }]}
      badge="Coming Soon"
    />
  );
}
