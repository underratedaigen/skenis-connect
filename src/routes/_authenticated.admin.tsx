import { createFileRoute, Outlet } from "@tanstack/react-router";
import { AdminShell } from "@/components/admin/admin-shell";
import { useAdminUser } from "@/lib/admin-user";

export const Route = createFileRoute("/_authenticated/admin")({
  component: AdminLayout
});

function AdminLayout() {
  const user = useAdminUser();

  return (
    <AdminShell user={user}>
      <Outlet />
    </AdminShell>
  );
}
