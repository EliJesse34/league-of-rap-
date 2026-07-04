import { createFileRoute } from "@tanstack/react-router";
import { BeatsPage } from "@/components/admin/beat-management/BeatsPage";

export const Route = createFileRoute("/admin/content/beats")({
  component: RouteComponent,
});

function RouteComponent() {
  return <BeatsPage />;
}
