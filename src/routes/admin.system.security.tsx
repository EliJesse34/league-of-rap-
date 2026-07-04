import { createFileRoute } from "@tanstack/react-router";
import { PlaceholderPage } from "@/components/admin/PlaceholderPage";

export const Route = createFileRoute("/admin/system/security")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <PlaceholderPage
      title="Security"
      description="Prepare access controls, permissions, and protected settings for the platform."
      breadcrumbs={[{ label: "Admin" }, { label: "System" }, { label: "Security" }]}
      badge="Coming Soon"
    />
  );
}
