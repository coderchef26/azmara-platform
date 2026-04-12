export interface RateLimitOptions {
  /** Maximum number of requests allowed per window. */
  maxRequests: number;
  /** Window duration in milliseconds. */
  windowMs: number;
}

export interface RateLimitResult {
  allowed: boolean;
  remaining: number;
  resetAt: Date;
}

/**
 * In-memory sliding-window rate limiter.
 *
 * Each key (e.g. IP address, user ID) is tracked independently.
 * Timestamps outside the current window are pruned on every check,
 * so memory usage stays bounded to active keys × maxRequests.
 *
 * Not suitable for multi-process/distributed use — use Redis-backed
 * limiting (e.g. @upstash/ratelimit) when horizontal scaling is needed.
 */
export function createRateLimiter(options: RateLimitOptions) {
  const { maxRequests, windowMs } = options;
  const store = new Map<string, number[]>();

  return {
    check(key: string): RateLimitResult {
      const now = Date.now();
      const windowStart = now - windowMs;

      const timestamps = (store.get(key) ?? []).filter((t) => t > windowStart);

      if (timestamps.length >= maxRequests) {
        return {
          allowed: false,
          remaining: 0,
          // biome-ignore lint/style/noNonNullAssertion: timestamps.length >= maxRequests > 0
          resetAt: new Date(timestamps[0]! + windowMs),
        };
      }

      timestamps.push(now);
      store.set(key, timestamps);

      return {
        allowed: true,
        remaining: maxRequests - timestamps.length,
        resetAt: new Date(now + windowMs),
      };
    },

    reset(key: string): void {
      store.delete(key);
    },

    resetAll(): void {
      store.clear();
    },
  };
}

export type RateLimiter = ReturnType<typeof createRateLimiter>;
