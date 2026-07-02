import { BarChart3, ClipboardList, LogOut, PackagePlus, Package, QrCode } from "lucide-react";
import type React from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import type { AdminSession } from "@/lib/types";
import { cn } from "@/lib/utils";
import logoAsset from "@/assets/skenis-logo.png.asset.json";

const navItems = [
  { href: "/admin", label: "Apžvalga", icon: BarChart3, end: true },
  { href: "/admin/batches/new", label: "Generuoti partiją", icon: PackagePlus, end: false },
  { href: "/admin/batches", label: "Partijos", icon: Package, end: false },
  { href: "/admin/links", label: "QR nuorodos", icon: QrCode, end: false },
  { href: "/admin/leads", label: "Užklausos", icon: ClipboardList, end: false }
] as const;

export function AdminShell({
  user,
  children
}: {
  user: AdminSession;
  children: React.ReactNode;
}) {
  const navigate = useNavigate();

  async function logout() {
    await supabase.auth.signOut();
    navigate("/admin/login", { replace: true });
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-72 border-r border-slate-200 bg-white p-5 lg:block">
        <Link to="/admin" className="block">
          <img src={logoAsset.url} alt="Skenis" className="h-7 w-auto" />
        </Link>
        <p className="mt-1 text-xs uppercase tracking-wide text-slate-500">Admin sistema</p>

        <nav className="mt-8 grid gap-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.href}
                to={item.href}
                end={item.end}
                className={({ isActive }) =>
                  cn(
                    "flex items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium transition",
                    isActive
                      ? "bg-brand-50 text-brand-700"
                      : "text-slate-700 hover:bg-slate-50 hover:text-ink"
                  )
                }
              >
                <Icon aria-hidden className="h-4 w-4" />
                {item.label}
              </NavLink>
            );
          })}
        </nav>

        <div className="absolute bottom-5 left-5 right-5 rounded-lg border border-slate-200 bg-slate-50 p-4">
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
            Prisijungta kaip
          </p>
          <p className="mt-1 truncate text-sm font-semibold text-ink">{user.email}</p>
        </div>
      </aside>

      <div className="lg:pl-72">
        <header className="sticky top-0 z-20 border-b border-slate-200 bg-white/95 backdrop-blur">
          <div className="flex min-h-16 items-center justify-between gap-4 px-5 sm:px-8">
            <div>
              <p className="text-sm font-semibold text-ink">Skenis.lt administravimas</p>
              <p className="text-xs text-slate-500 lg:hidden">{user.email}</p>
            </div>
            <div className="flex items-center gap-2">
              <Link
                to="/"
                className="hidden rounded-md border border-slate-300 bg-white px-3 py-2 text-sm font-semibold text-slate-700 transition hover:border-brand-500 hover:text-brand-700 sm:inline-flex"
              >
                Viešas puslapis
              </Link>
              <button
                onClick={logout}
                className="inline-flex h-10 w-10 items-center justify-center rounded-md border border-slate-300 bg-white text-slate-700 transition hover:border-brand-500 hover:text-brand-700 focus-ring"
                title="Atsijungti"
              >
                <LogOut aria-hidden className="h-4 w-4" />
              </button>
            </div>
          </div>
          <nav className="flex gap-1 overflow-x-auto border-t border-slate-100 px-5 py-2 lg:hidden">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.href}
                  to={item.href}
                  end={item.end}
                  className={({ isActive }) =>
                    cn(
                      "flex shrink-0 items-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition",
                      isActive
                        ? "bg-brand-50 text-brand-700"
                        : "text-slate-700 hover:bg-slate-50 hover:text-ink"
                    )
                  }
                >
                  <Icon aria-hidden className="h-4 w-4" />
                  {item.label}
                </NavLink>
              );
            })}
          </nav>
        </header>
        <div className="px-5 py-8 sm:px-8">{children}</div>
      </div>
    </div>
  );
}
