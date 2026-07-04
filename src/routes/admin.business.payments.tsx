import { createFileRoute } from "@tanstack/react-router";
import { PlaceholderPage } from "@/components/admin/PlaceholderPage";

export const Route = createFileRoute("/admin/business/payments")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <PlaceholderPage
      title="Payments"
      description="Prepare billing views, transaction monitoring, and finance operations."
      breadcrumbs={[{ label: "Admin" }, { label: "Business" }, { label: "Payments" }]}
      badge="Coming Soon"
    />
  );
}
