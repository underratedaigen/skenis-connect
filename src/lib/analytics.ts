import { createHash } from "crypto";
import { prisma } from "@/lib/prisma";
import { getIpHashSecret } from "@/lib/env";

type ScanInput = {
  redirectLinkId: string;
  userAgent?: string | null;
  ip?: string | null;
  referrer?: string | null;
};

function getDeviceType(userAgent?: string | null) {
  const value = userAgent?.toLowerCase() || "";

  if (!value) return "unknown";
  if (/(bot|crawler|spider|crawling)/i.test(value)) return "bot";
  if (/ipad|tablet|kindle|silk/.test(value)) return "tablet";
  if (/mobile|iphone|android/.test(value)) return "mobile";

  return "desktop";
}

export function hashIp(ip?: string | null) {
  if (!ip) return null;

  return createHash("sha256")
    .update(`${getIpHashSecret()}:${ip}`)
    .digest("hex");
}

export async function recordScan(input: ScanInput) {
  const now = new Date();

  await prisma.$transaction([
    prisma.scanEvent.create({
      data: {
        redirectLinkId: input.redirectLinkId,
        userAgent: input.userAgent?.slice(0, 1000),
        ipHash: hashIp(input.ip),
        referrer: input.referrer?.slice(0, 1000),
        deviceType: getDeviceType(input.userAgent)
      }
    }),
    prisma.redirectLink.update({
      where: { id: input.redirectLinkId },
      data: {
        scanCount: { increment: 1 },
        lastScannedAt: now
      }
    })
  ]);
}
