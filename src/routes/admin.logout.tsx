import { createFileRoute } from "@tanstack/react-router";
import { PlaceholderPage } from "@/components/admin/PlaceholderPage";

export const Route = createFileRoute("/admin/logout")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <PlaceholderPage
      title="Logout"
      description="This entry point will eventually handle session teardown and redirect flow."
      breadcrumbs={[{ label: "Admin" }, { label: "Logout" }]}
      badge="Coming Soon"
    />
  );
}
