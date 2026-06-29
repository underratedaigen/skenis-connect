import { randomInt } from "crypto";

const TOKEN_ALPHABET =
  "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz23456789";

export function sanitizeTokenPrefix(prefix: string | null | undefined) {
  if (!prefix) return "";

  return prefix.replace(/[^A-Za-z0-9_-]/g, "").slice(0, 12);
}

export function generateSecureToken(length = 10, prefix?: string | null) {
  const safePrefix = sanitizeTokenPrefix(prefix);
  let token = "";

  for (let i = 0; i < length; i += 1) {
    token += TOKEN_ALPHABET[randomInt(0, TOKEN_ALPHABET.length)];
  }

  return `${safePrefix}${token}`;
}

export function isValidToken(token: string) {
  return /^[A-Za-z0-9_-]{6,40}$/.test(token);
}
