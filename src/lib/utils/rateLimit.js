/**
 * In-memory rate limiter.
 * In production on Vercel, each serverless invocation has its own memory,
 * so this provides per-instance throttling. For true distributed rate limiting,
 * use Upstash Redis or Vercel KV.
 */

const store = new Map();

// Clean up expired entries every 5 minutes
setInterval(() => {
  const now = Date.now();
  for (const [key, entry] of store) {
    if (now - entry.windowStart > entry.windowMs * 2) {
      store.delete(key);
    }
  }
}, 5 * 60 * 1000);

/**
 * Check if request should be rate limited.
 * @param {string} identifier - IP address or unique key
 * @param {object} opts
 * @param {number} opts.windowMs - Time window in milliseconds (default: 60000)
 * @param {number} opts.max - Max requests in window (default: 30)
 * @returns {{ limited: boolean, remaining: number, resetIn: number }}
 */
export function rateLimit(identifier, { windowMs = 60000, max = 30 } = {}) {
  const now = Date.now();
  const key = identifier;

  let entry = store.get(key);

  if (!entry || now - entry.windowStart > windowMs) {
    entry = { windowStart: now, count: 0, windowMs };
    store.set(key, entry);
  }

  entry.count++;

  const remaining = Math.max(0, max - entry.count);
  const resetIn = Math.max(0, windowMs - (now - entry.windowStart));

  return {
    limited: entry.count > max,
    remaining,
    resetIn,
  };
}

/**
 * Get client IP from request headers (works on Vercel).
 */
export function getClientIP(request) {
  return (
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    request.headers.get("x-real-ip") ||
    "unknown"
  );
}
