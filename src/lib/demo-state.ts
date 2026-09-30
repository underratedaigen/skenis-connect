import { demoOptions } from "@/data/public-content";

export type DemoId = (typeof demoOptions)[number]["id"];
export const defaultDemo: DemoId = "registracija";
export const legacyDemoHashes: Record<string, DemoId> = {
  "#demo-website": "svetaine", "#demo-booking": "registracija", "#demo-calculator": "skaiciuokle",
};
export function resolveDemo(value: string | null, hash = "") {
  return demoOptions.find(item => item.id === (value || legacyDemoHashes[hash]))
    || demoOptions.find(item => item.id === defaultDemo)!;
}
export function estimateArea(area: number, preparation: boolean) {
  const base = area * 15, extra = preparation ? area * 7 : 0;
  return { base, extra, total: base + extra };
}
export function normalizeQuantity(value: string | number) {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? Math.max(1, Math.min(20, Math.trunc(parsed))) : 1;
}
export const formatDemoMoney = (value: number) =>
  new Intl.NumberFormat("lt-LT", { style: "currency", currency: "EUR" }).format(value);
