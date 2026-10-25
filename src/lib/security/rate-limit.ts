import { NextRequest } from 'next/server';

interface RateLimitEntry {
  count: number;
  resetAt: number;
}

const MAX_BUCKETS = 10_000;
let lastPruneTime = Date.now();
const buckets = new Map<string, RateLimitEntry>();

/**
 * Periodically purge expired entries and ensure the in-memory map doesn't
 * exceed MAX_BUCKETS under heavy multi-IP scanning or DDoS conditions.
 */
function pruneExpiredBuckets(now: number): void {
  if (now - lastPruneTime < 60_000 && buckets.size < MAX_BUCKETS) {
    return;
  }
  lastPruneTime = now;

  for (const [key, entry] of buckets.entries()) {
    if (entry.resetAt <= now) {
      buckets.delete(key);
    }
  }

  // If still above maximum capacity, delete the oldest entries
  if (buckets.size > MAX_BUCKETS) {
    let excess = buckets.size - MAX_BUCKETS;
    for (const key of buckets.keys()) {
      if (excess <= 0) break;
      buckets.delete(key);
      excess--;
    }
  }
}

export function getRequestIdentity(req: NextRequest): string {
  const forwarded = req.headers.get('x-forwarded-for');
  if (forwarded) {
    // Pick the client IP (first address in X-Forwarded-For chain)
    const clientIp = forwarded.split(',')[0]?.trim();
    if (clientIp) return clientIp;
  }
  return req.headers.get('x-real-ip') || 'unknown';
}

/**
 * In-memory rate limiting with automated LRU cleanup and bound capacity.
 */
export function checkRateLimit(
  req: NextRequest,
  scope: string,
  limit: number,
  windowMs: number
): { allowed: boolean; retryAfterSeconds: number } {
  const now = Date.now();
  pruneExpiredBuckets(now);

  const key = `${scope}:${getRequestIdentity(req)}`;
  const current = buckets.get(key);

  if (!current || current.resetAt <= now) {
    buckets.set(key, { count: 1, resetAt: now + windowMs });
    return { allowed: true, retryAfterSeconds: 0 };
  }

  if (current.count >= limit) {
    return {
      allowed: false,
      retryAfterSeconds: Math.max(1, Math.ceil((current.resetAt - now) / 1000)),
    };
  }

  current.count += 1;
  return { allowed: true, retryAfterSeconds: 0 };
}

/**
 * Optional distributed rate limiter for serverless deployments.
 * If UPSTASH_REDIS_REST_URL and UPSTASH_REDIS_REST_TOKEN (or KV_REST_API_*)
 * are present, checks distributed Redis atomically. Falls back to in-memory.
 */
export async function checkRateLimitDistributed(
  req: NextRequest,
  scope: string,
  limit: number,
  windowMs: number
): Promise<{ allowed: boolean; retryAfterSeconds: number }> {
  const redisUrl = process.env.UPSTASH_REDIS_REST_URL || process.env.KV_REST_API_URL;
  const redisToken = process.env.UPSTASH_REDIS_REST_TOKEN || process.env.KV_REST_API_TOKEN;

  if (!redisUrl || !redisToken) {
    return checkRateLimit(req, scope, limit, windowMs);
  }

  try {
    const key = `ratelimit:${scope}:${getRequestIdentity(req)}`;
    const ttlSeconds = Math.max(1, Math.ceil(windowMs / 1000));

    // Atomic pipeline: INCR key, EXPIRE key ttl NX
    const res = await fetch(`${redisUrl}/pipeline`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${redisToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify([
        ['INCR', key],
        ['EXPIRE', key, ttlSeconds, 'NX'],
      ]),
      cache: 'no-store',
    });

    if (res.ok) {
      const data = await res.json();
      const count = Number(data?.[0]?.result ?? 1);
      if (count > limit) {
        return { allowed: false, retryAfterSeconds: ttlSeconds };
      }
      return { allowed: true, retryAfterSeconds: 0 };
    }
  } catch (err) {
    console.warn('Distributed rate limit check failed, falling back to local memory:', err);
  }

  return checkRateLimit(req, scope, limit, windowMs);
}
