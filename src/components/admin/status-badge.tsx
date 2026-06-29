import type { RedirectStatus } from "@prisma/client";
import { redirectStatusLabels } from "@/lib/labels";
import { cn } from "@/lib/utils";

const tones: Record<RedirectStatus, string> = {
  UNASSIGNED: "border-amber-200 bg-amber-50 text-amber-700",
  ACTIVE: "border-brand-100 bg-brand-50 text-brand-700",
  DISABLED: "border-red-200 bg-red-50 text-red-700",
  ARCHIVED: "border-slate-200 bg-slate-100 text-slate-600"
};

export function StatusBadge({ status }: { status: RedirectStatus }) {
  return (
    <span
      className={cn(
        "inline-flex rounded-full border px-2.5 py-1 text-xs font-semibold",
        tones[status]
      )}
    >
      {redirectStatusLabels[status]}
    </span>
  );
}
