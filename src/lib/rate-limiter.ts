import crypto from "crypto";

/**
 * In-memory sliding window rate limiter for public forms.
 * Protects contact and membership submissions from flooding and automated spam.
 */

interface RateLimitRecord {
  timestamps: number[];
}

const memoryStore = new Map<string, RateLimitRecord>();

// Cleanup stale records periodically
const CLEANUP_INTERVAL_MS = 10 * 60 * 1000; // 10 minutes
let lastCleanup = Date.now();

function purgeStale(windowMs: number) {
  const now = Date.now();
  if (now - lastCleanup < CLEANUP_INTERVAL_MS) return;
  lastCleanup = now;

  const threshold = now - windowMs;
  for (const [key, record] of memoryStore.entries()) {
    record.timestamps = record.timestamps.filter((t) => t > threshold);
    if (record.timestamps.length === 0) {
      memoryStore.delete(key);
    }
  }
}

/**
 * Checks if a given key has exceeded the maximum allowed requests in the sliding window.
 *
 * @param key Unique identifier (e.g. hashed IP + form type)
 * @param limit Max allowed requests within window (default: 5)
 * @param windowMs Window duration in milliseconds (default: 10 minutes)
 */
export function checkRateLimit(
  key: string,
  limit: number = 5,
  windowMs: number = 10 * 60 * 1000
): {
  allowed: boolean;
  remaining: number;
  resetSeconds: number;
} {
  purgeStale(windowMs);

  const now = Date.now();
  const threshold = now - windowMs;

  const record = memoryStore.get(key) || { timestamps: [] };
  // Keep only timestamps within window
  record.timestamps = record.timestamps.filter((t) => t > threshold);

  if (record.timestamps.length >= limit) {
    const oldest = record.timestamps[0];
    const resetSeconds = Math.max(1, Math.ceil((oldest + windowMs - now) / 1000));
    return {
      allowed: false,
      remaining: 0,
      resetSeconds,
    };
  }

  record.timestamps.push(now);
  memoryStore.set(key, record);

  return {
    allowed: true,
    remaining: limit - record.timestamps.length,
    resetSeconds: Math.ceil(windowMs / 1000),
  };
}

/**
 * Hashes client IP or identification string using SHA-256 with a server salt
 * to protect personal privacy in accordance with data minimization principles.
 */
export function hashClientIdentifier(identifier: string): string {
  const salt = process.env.NEXT_SERVER_ACTIONS_ENCRYPTION_KEY || "nasi-india-privacy-salt";
  return crypto
    .createHash("sha256")
    .update(`${salt}:${identifier.trim().toLowerCase()}`)
    .digest("hex")
    .substring(0, 24);
}

