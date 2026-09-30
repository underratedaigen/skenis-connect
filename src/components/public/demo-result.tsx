import { demoOptions } from "@/data/public-content";
import type { DemoId } from "@/lib/demo-state";
import type { ReactNode } from "react";

export function DemoBenefits({ id }: { id: DemoId }) {
  const demo = demoOptions.find(item => item.id === id)!;
  return <dl className="demo-benefits">
    <div><dt>KLIENTAS GAUNA</dt><dd>{demo.customer}</dd></div>
    <div><dt>KOMANDA MATYTŲ</dt><dd>{demo.team}</dd></div>
  </dl>;
}
export function DemoResult({ id, title, children }: { id: DemoId; title: string; children?: ReactNode }) {
  return <div className="demo-result" role="status" aria-live="polite" aria-atomic="true">
    <strong>{title}</strong>{children}<DemoBenefits id={id} />
  </div>;
}
