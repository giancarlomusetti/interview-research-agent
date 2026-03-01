const WINDOW_MS = 24 * 60 * 60 * 1000; // 24 hours
const MAX_REQUESTS = 10;
const GLOBAL_MAX_REQUESTS = 25;
const GLOBAL_KEY = "__global__";

interface RateLimitEntry {
  count: number;
  resetAt: number;
}

const store = new Map<string, RateLimitEntry>();

// Cleanup stale entries every 10 minutes
setInterval(() => {
  const now = Date.now();
  for (const [key, entry] of store) {
    if (now > entry.resetAt) store.delete(key);
  }
}, 10 * 60 * 1000);

function check(key: string, max: number): {
  allowed: boolean;
  remaining: number;
  resetAt: number;
} {
  const now = Date.now();
  const entry = store.get(key);

  if (!entry || now > entry.resetAt) {
    store.set(key, { count: 1, resetAt: now + WINDOW_MS });
    return { allowed: true, remaining: max - 1, resetAt: now + WINDOW_MS };
  }

  if (entry.count >= max) {
    return { allowed: false, remaining: 0, resetAt: entry.resetAt };
  }

  entry.count++;
  return { allowed: true, remaining: max - entry.count, resetAt: entry.resetAt };
}

export function checkGlobalRateLimit(): {
  allowed: boolean;
  remaining: number;
  resetAt: number;
} {
  if (process.env.NODE_ENV === "development") {
    return { allowed: true, remaining: GLOBAL_MAX_REQUESTS, resetAt: Date.now() + WINDOW_MS };
  }
  return check(GLOBAL_KEY, GLOBAL_MAX_REQUESTS);
}

export function checkRateLimit(ip: string): {
  allowed: boolean;
  remaining: number;
  resetAt: number;
} {
  // Skip rate limiting in development
  if (process.env.NODE_ENV === "development") {
    return { allowed: true, remaining: MAX_REQUESTS, resetAt: Date.now() + WINDOW_MS };
  }
  return check(ip, MAX_REQUESTS);
}
