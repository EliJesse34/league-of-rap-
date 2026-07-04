import { createFileRoute } from "@tanstack/react-router";
import { PlaceholderPage } from "@/components/admin/PlaceholderPage";

export const Route = createFileRoute("/admin/content/videos")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <PlaceholderPage
      title="Videos"
      description="Prepare video moderation, publishing controls, and media verification workflows."
      breadcrumbs={[{ label: "Admin" }, { label: "Content" }, { label: "Videos" }]}
      badge="Coming Soon"
    />
  );
}
