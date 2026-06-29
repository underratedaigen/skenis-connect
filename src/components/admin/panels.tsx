import type React from "react";

export function AdminPanel({
  title,
  action,
  children
}: {
  title: string;
  action?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <div className="overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm">
      <div className="flex items-center justify-between gap-4 border-b border-slate-100 px-5 py-4">
        <h2 className="font-bold tracking-normal text-ink">{title}</h2>
        <div className="text-sm font-semibold text-brand-700">{action}</div>
      </div>
      {children}
    </div>
  );
}

export function AdminTablePanel({
  title,
  subtitle,
  children
}: {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
}) {
  return (
    <section className="overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm">
      <div className="border-b border-slate-100 px-5 py-4">
        <h2 className="font-bold tracking-normal text-ink">{title}</h2>
        {subtitle ? <p className="mt-1 text-xs text-slate-500">{subtitle}</p> : null}
      </div>
      <div className="overflow-x-auto">{children}</div>
    </section>
  );
}

export function EmptyAdminText({ children }: { children: React.ReactNode }) {
  return <p className="px-5 py-8 text-sm text-slate-500">{children}</p>;
}

export function MiniStat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
      <p className="text-sm text-slate-500">{label}</p>
      <p className="mt-2 text-lg font-bold text-ink">{value}</p>
    </div>
  );
}

export function AdminLoading() {
  return (
    <p className="rounded-lg border border-slate-200 bg-white p-5 text-sm text-slate-600">
      Įkeliama...
    </p>
  );
}

export function AdminError({ message }: { message: string }) {
  return (
    <p className="rounded-lg border border-red-200 bg-red-50 p-5 text-sm text-red-700">
      {message}
    </p>
  );
}
