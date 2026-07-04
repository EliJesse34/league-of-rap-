import { createFileRoute } from "@tanstack/react-router";
import { PlaceholderPage } from "@/components/admin/PlaceholderPage";

export const Route = createFileRoute("/admin/content-management/announcements")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <PlaceholderPage
      title="Announcements"
      description="Manage platform-wide communications and launch notices with a polished admin experience."
      breadcrumbs={[{ label: "Admin" }, { label: "Content Management" }, { label: "Announcements" }]}
      badge="Coming Soon"
    />
  );
}
