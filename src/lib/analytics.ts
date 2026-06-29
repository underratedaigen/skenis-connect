export type ScanInput = {
  redirectLinkId: string;
  userAgent?: string | null;
  ip?: string | null;
  referrer?: string | null;
};

export function getDeviceType(userAgent?: string | null) {
  const value = userAgent?.toLowerCase() || "";

  if (!value) return "unknown";
  if (/(bot|crawler|spider|crawling)/i.test(value)) return "bot";
  if (/ipad|tablet|kindle|silk/.test(value)) return "tablet";
  if (/mobile|iphone|android/.test(value)) return "mobile";

  return "desktop";
}

export function hashIp(ip?: string | null, secret = "skenis-privacy-salt") {
  if (!ip) return null;

  let hash = 0;
  const input = `${secret}:${ip}`;

  for (let i = 0; i < input.length; i += 1) {
    hash = (hash << 5) - hash + input.charCodeAt(i);
    hash |= 0;
  }

  return Math.abs(hash).toString(16).padStart(8, "0");
}
