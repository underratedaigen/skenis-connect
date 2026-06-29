import type { LucideIcon } from "lucide-react";
import { formatNumber } from "@/lib/utils";

export function StatCard({
  label,
  value,
  icon: Icon,
  tone = "default"
}: {
  label: string;
  value: number;
  icon: LucideIcon;
  tone?: "default" | "accent";
}) {
  return (
    <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex items-center justify-between gap-4">
        <p className="text-sm font-medium text-slate-500">{label}</p>
        <span
          className={
            tone === "accent"
              ? "flex h-10 w-10 items-center justify-center rounded-md bg-brand-50 text-brand-700"
              : "flex h-10 w-10 items-center justify-center rounded-md bg-slate-100 text-slate-700"
          }
        >
          <Icon aria-hidden className="h-5 w-5" />
        </span>
      </div>
      <p className="mt-4 text-3xl font-bold tracking-normal text-ink">{formatNumber(value)}</p>
    </div>
  );
}
