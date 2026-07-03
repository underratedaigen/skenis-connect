import { lazy, Suspense } from "react";

const LeadForm = lazy(() =>
  import("@/components/lead-form").then((module) => ({ default: module.LeadForm }))
);

export function LeadFormShell({
  initialProductType,
  initialQuantity
}: {
  initialProductType?: string;
  initialQuantity?: number;
}) {
  return (
    <Suspense
      fallback={
        <div className="rounded-xl border border-line bg-slate-50 p-5 text-sm text-slate-600">
          Forma įkeliama...
        </div>
      }
    >
      <LeadForm initialProductType={initialProductType} initialQuantity={initialQuantity} />
    </Suspense>
  );
}
