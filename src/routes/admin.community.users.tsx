import { createFileRoute } from "@tanstack/react-router";
import { UsersPage } from "@/components/admin/user-management/UsersPage";

export const Route = createFileRoute("/admin/community/users")({
  component: RouteComponent,
});

function RouteComponent() {
  return <UsersPage />;
}
