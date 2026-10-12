// ============================================================
// SamayYudh 2.0 — SOKHA Rate Limiter & Abuse Protection
// Memory-based sliding window rate limiter to prevent abuse,
// protect free-tier Gemini API quotas, and ensure fair availability.
// ============================================================

interface RateLimitRecord {
  count: number;
  resetAt: number;
  dailyCount: number;
  dailyResetAt: number;
}

const ipStore = new Map<string, RateLimitRecord>();

// Configurable constants
const WINDOW_MS = 60 * 1000; // 1 minute window
const MAX_REQUESTS_PER_MINUTE = parseInt(process.env.SOKHA_RPM_LIMIT || '12', 10);
const DAILY_LIMIT = parseInt(process.env.SOKHA_DAILY_LIMIT || '100', 10);

/**
 * Cleanup expired entries periodically (every 5 minutes)
 */
setInterval(() => {
  const now = Date.now();
  for (const [key, record] of ipStore.entries()) {
    if (now > record.dailyResetAt) {
      ipStore.delete(key);
    }
  }
}, 5 * 60 * 1000);

export interface RateLimitStatus {
  allowed: boolean;
  remaining: number;
  resetSeconds: number;
  isDailyLimitExceeded: boolean;
}

/**
 * Checks and updates rate limits for a given client identifier (IP or user ID).
 */
export function checkRateLimit(clientId: string): RateLimitStatus {
  const now = Date.now();
  let record = ipStore.get(clientId);

  if (!record) {
    record = {
      count: 0,
      resetAt: now + WINDOW_MS,
      dailyCount: 0,
      dailyResetAt: now + 24 * 60 * 60 * 1000,
    };
    ipStore.set(clientId, record);
  }

  // Reset 1-minute window
  if (now > record.resetAt) {
    record.count = 0;
    record.resetAt = now + WINDOW_MS;
  }

  // Reset 24-hour window
  if (now > record.dailyResetAt) {
    record.dailyCount = 0;
    record.dailyResetAt = now + 24 * 60 * 60 * 1000;
  }

  // Check daily limit
  if (record.dailyCount >= DAILY_LIMIT) {
    const resetSeconds = Math.ceil((record.dailyResetAt - now) / 1000);
    return {
      allowed: false,
      remaining: 0,
      resetSeconds,
      isDailyLimitExceeded: true,
    };
  }

  // Check per-minute burst limit
  if (record.count >= MAX_REQUESTS_PER_MINUTE) {
    const resetSeconds = Math.ceil((record.resetAt - now) / 1000);
    return {
      allowed: false,
      remaining: 0,
      resetSeconds,
      isDailyLimitExceeded: false,
    };
  }

  // Increment counters
  record.count += 1;
  record.dailyCount += 1;

  const remaining = Math.max(0, MAX_REQUESTS_PER_MINUTE - record.count);
  const resetSeconds = Math.ceil((record.resetAt - now) / 1000);

  return {
    allowed: true,
    remaining,
    resetSeconds,
    isDailyLimitExceeded: false,
  };
}
