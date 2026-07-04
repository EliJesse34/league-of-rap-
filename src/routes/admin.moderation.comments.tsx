import { createFileRoute } from "@tanstack/react-router";
import { PlaceholderPage } from "@/components/admin/PlaceholderPage";

export const Route = createFileRoute("/admin/moderation/comments")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <PlaceholderPage
      title="Comments"
      description="Moderate conversations, manage flagged threads, and protect the community experience."
      breadcrumbs={[{ label: "Admin" }, { label: "Moderation" }, { label: "Comments" }]}
      badge="Coming Soon"
    />
  );
}
