import { createFileRoute, Outlet, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { AdminUserContext } from "@/lib/admin-user";
import type { AdminSession } from "@/lib/types";

export const Route = createFileRoute("/_authenticated")({
  component: AuthenticatedLayout
});

function AuthenticatedLayout() {
  const navigate = useNavigate();
  const [user, setUser] = useState<AdminSession | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    supabase.auth.getUser().then(({ data, error }) => {
      if (!mounted) return;

      if (error || !data.user) {
        navigate({ to: "/admin/login" });
        return;
      }

      setUser({
        id: data.user.id,
        email: data.user.email || "",
        name: data.user.user_metadata?.name || null
      });
      setLoading(false);
    });

    return () => {
      mounted = false;
    };
  }, [navigate]);

  if (loading || !user) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-mist px-5">
        <p className="rounded-lg border border-line bg-white px-5 py-4 text-sm text-slate-600 shadow-sm">
          Tikrinama admin sesija...
        </p>
      </main>
    );
  }

  return (
    <AdminUserContext.Provider value={user}>
      <Outlet />
    </AdminUserContext.Provider>
  );
}
