import { createFileRoute } from "@tanstack/react-router";
import { PlaceholderPage } from "@/components/admin/PlaceholderPage";

export const Route = createFileRoute("/admin/content-management/blog")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <PlaceholderPage
      title="Blog"
      description="Prep editorial publishing flows and content calendars for future campaigns."
      breadcrumbs={[{ label: "Admin" }, { label: "Content Management" }, { label: "Blog" }]}
      badge="Coming Soon"
    />
  );
}
