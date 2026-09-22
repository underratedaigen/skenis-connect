/** First-party event hooks. No trackers, cookies or personal form data are added. */
export function trackConversion(
  name: string,
  details: Record<string, string> = {},
) {
  if (typeof window === "undefined") return;
  window.dispatchEvent(
    new CustomEvent("skenis:conversion", { detail: { name, ...details } }),
  );
}
