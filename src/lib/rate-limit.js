export const MAX_RESI_PER_USER = 100;
export const MAX_MARKETPLACE_RESI_PER_USER = 100;

export const AUTH_RATE_LIMIT = { limit: 10, windowMs: 60_000 };
export const CREATE_RESI_RATE_LIMIT = { limit: 60, windowMs: 60_000 };
export const CREATE_MARKETPLACE_RESI_RATE_LIMIT = { limit: 60, windowMs: 60_000 };

export const RATE_LIMIT_MESSAGE = "Terlalu banyak permintaan. Coba lagi sebentar lagi.";
export const RESI_LIMIT_MESSAGE = "Batas maksimal 100 resi per akun sudah tercapai.";
export const MARKETPLACE_RESI_LIMIT_MESSAGE =
  "Batas maksimal 100 resi marketplace per akun sudah tercapai.";

const rateLimitStore = globalThis.__rekapresiRateLimitStore ?? new Map();

if (!globalThis.__rekapresiRateLimitStore) {
  globalThis.__rekapresiRateLimitStore = rateLimitStore;
}

export function getClientIp(headers) {
  const forwardedFor = headers?.get?.("x-forwarded-for")?.split(",")[0]?.trim();
  return forwardedFor || headers?.get?.("x-real-ip") || "unknown";
}

export function checkRateLimit(key, { limit, windowMs }) {
  const now = Date.now();
  const bucket = rateLimitStore.get(key);

  if (!bucket || bucket.resetAt <= now) {
    rateLimitStore.set(key, { count: 1, resetAt: now + windowMs });
    return { ok: true, remaining: limit - 1, retryAfter: 0 };
  }

  if (bucket.count >= limit) {
    return {
      ok: false,
      remaining: 0,
      retryAfter: Math.ceil((bucket.resetAt - now) / 1000),
    };
  }

  bucket.count += 1;
  return { ok: true, remaining: limit - bucket.count, retryAfter: 0 };
}
