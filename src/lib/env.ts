export function getPublicBaseUrl() {
  const configured =
    process.env.NEXT_PUBLIC_APP_URL || process.env.APP_URL || "https://skenis.lt";

  return configured.replace(/\/+$/, "");
}

export function getSessionSecret() {
  const secret = process.env.SESSION_SECRET;

  if (!secret || secret.length < 32) {
    if (process.env.NODE_ENV === "production") {
      throw new Error("SESSION_SECRET must be set to at least 32 characters.");
    }

    return "dev-only-skenis-session-secret-change-before-production";
  }

  return secret;
}

export function getIpHashSecret() {
  const secret = process.env.IP_HASH_SECRET || process.env.SESSION_SECRET;

  if (!secret && process.env.NODE_ENV === "production") {
    throw new Error("IP_HASH_SECRET or SESSION_SECRET must be set in production.");
  }

  return secret || "dev-only-skenis-ip-hash-secret-change-before-production";
}
