import { createFileRoute } from "@tanstack/react-router";
import { PlaceholderPage } from "@/components/admin/PlaceholderPage";

export const Route = createFileRoute("/admin/system/settings")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <PlaceholderPage
      title="Settings"
      description="Create a home for platform configuration, defaults, and future system controls."
      breadcrumbs={[{ label: "Admin" }, { label: "System" }, { label: "Settings" }]}
      badge="Coming Soon"
    />
  );
}
