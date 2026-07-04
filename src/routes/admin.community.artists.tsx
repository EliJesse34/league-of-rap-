import { createFileRoute } from "@tanstack/react-router";
import { ArtistsPage } from "@/components/admin/user-management/ArtistsPage";

export const Route = createFileRoute("/admin/community/artists")({
  component: RouteComponent,
});

function RouteComponent() {
  return <ArtistsPage />;
}
