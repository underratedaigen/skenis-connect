import Link from "next/link";
import { BarChart3, ClipboardList, LogOut, PackagePlus, QrCode, Settings } from "lucide-react";
import { logoutAction } from "@/app/admin/(protected)/actions";
import type { AdminSession } from "@/lib/auth";
import { cn } from "@/lib/utils";

const navItems = [
  { href: "/admin", label: "Apžvalga", icon: BarChart3 },
  { href: "/admin/batches/new", label: "Generuoti partiją", icon: PackagePlus },
  { href: "/admin/links", label: "QR nuorodos", icon: QrCode },
  { href: "/admin/leads", label: "Užklausos", icon: ClipboardList }
];

export function AdminShell({
  user,
  children
}: {
  user: AdminSession;
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-slate-50">
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-72 border-r border-slate-200 bg-white p-5 lg:block">
        <Link href="/admin" className="block text-xl font-bold tracking-normal text-ink">
          Skenis.lt
        </Link>
        <p className="mt-1 text-xs uppercase tracking-wide text-slate-500">Admin sistema</p>

        <nav className="mt-8 grid gap-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium text-slate-700 transition hover:bg-brand-50 hover:text-brand-700"
                )}
              >
                <Icon aria-hidden className="h-4 w-4" />
                {item.label}
              </Link>
            );
          })}
        </nav>
      </aside>

      <div className="lg:pl-72">
        <header className="sticky top-0 z-20 border-b border-slate-200 bg-white/95 backdrop-blur">
          <div className="flex min-h-16 items-center justify-between gap-4 px-5 sm:px-8">
            <div>
              <p className="text-sm font-semibold text-ink">Skenis.lt administravimas</p>
              <p className="text-xs text-slate-500">{user.email}</p>
            </div>
            <div className="flex items-center gap-2">
              <Link
                href="/"
                className="hidden rounded-md border border-slate-300 bg-white px-3 py-2 text-sm font-semibold text-slate-700 transition hover:border-brand-500 hover:text-brand-700 sm:inline-flex"
              >
                Viešas puslapis
              </Link>
              <form action={logoutAction}>
                <button
                  className="inline-flex h-10 w-10 items-center justify-center rounded-md border border-slate-300 bg-white text-slate-700 transition hover:border-brand-500 hover:text-brand-700 focus-ring"
                  title="Atsijungti"
                >
                  <LogOut aria-hidden className="h-4 w-4" />
                </button>
              </form>
            </div>
          </div>
          <nav className="flex gap-1 overflow-x-auto border-t border-slate-100 px-5 py-2 lg:hidden">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className="flex shrink-0 items-center gap-2 rounded-md px-3 py-2 text-sm font-medium text-slate-700 hover:bg-brand-50 hover:text-brand-700"
                >
                  <Icon aria-hidden className="h-4 w-4" />
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </header>
        <div className="px-5 py-8 sm:px-8">{children}</div>
      </div>
    </div>
  );
}
