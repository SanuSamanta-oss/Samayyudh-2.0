import { Ratelimit } from '@upstash/ratelimit';
import { redis, isRedisConfigured } from './redis';

// Generate or resolve a unique Node identifier for multi-instance load balancing
export const LOAD_BALANCER_NODE_ID =
  process.env.NODE_ID ||
  process.env.HOSTNAME ||
  `node-${Math.random().toString(36).substring(2, 7)}`;

// In-Memory Token Bucket fallback when Redis credentials are not provided
class MemoryRateLimiter {
  private requests: Map<string, number[]> = new Map();

  limit(identifier: string, maxRequests: number, windowMs: number) {
    const now = Date.now();
    const timestamps = this.requests.get(identifier) || [];
    const valid = timestamps.filter((t) => now - t < windowMs);

    if (valid.length >= maxRequests) {
      return {
        success: false,
        limit: maxRequests,
        remaining: 0,
        reset: Math.ceil((valid[0] + windowMs - now) / 1000),
      };
    }

    valid.push(now);
    this.requests.set(identifier, valid);

    return {
      success: true,
      limit: maxRequests,
      remaining: maxRequests - valid.length,
      reset: Math.ceil(windowMs / 1000),
    };
  }
}

const memoryLimiter = new MemoryRateLimiter();

// Setup Upstash distributed sliding window rate limiters if configured
const upstashGeneralLimiter = isRedisConfigured()
  ? new Ratelimit({
      redis: redis as any,
      limiter: Ratelimit.slidingWindow(60, '10 s'),
      analytics: true,
      prefix: 'samayyudh:lb:general',
    })
  : null;

const upstashAiLimiter = isRedisConfigured()
  ? new Ratelimit({
      redis: redis as any,
      limiter: Ratelimit.slidingWindow(15, '60 s'),
      analytics: true,
      prefix: 'samayyudh:lb:ai',
    })
  : null;

const upstashSyncLimiter = isRedisConfigured()
  ? new Ratelimit({
      redis: redis as any,
      limiter: Ratelimit.slidingWindow(120, '60 s'),
      analytics: true,
      prefix: 'samayyudh:lb:sync',
    })
  : null;

export type RateLimitTier = 'general' | 'ai' | 'sync';

export interface RateLimitResult {
  success: boolean;
  limit: number;
  remaining: number;
  reset: number;
  nodeId: string;
}

/**
 * Apply load-balancing rate-limit policy based on request tier
 */
export async function checkRateLimit(
  identifier: string,
  tier: RateLimitTier = 'general'
): Promise<RateLimitResult> {
  const ipOrUser = identifier || 'anonymous-client';

  try {
    if (tier === 'ai') {
      if (upstashAiLimiter) {
        const res = await upstashAiLimiter.limit(ipOrUser);
        return {
          success: res.success,
          limit: res.limit,
          remaining: res.remaining,
          reset: res.reset,
          nodeId: LOAD_BALANCER_NODE_ID,
        };
      }
      const memRes = memoryLimiter.limit(`ai:${ipOrUser}`, 15, 60_000);
      return { ...memRes, nodeId: LOAD_BALANCER_NODE_ID };
    }

    if (tier === 'sync') {
      if (upstashSyncLimiter) {
        const res = await upstashSyncLimiter.limit(ipOrUser);
        return {
          success: res.success,
          limit: res.limit,
          remaining: res.remaining,
          reset: res.reset,
          nodeId: LOAD_BALANCER_NODE_ID,
        };
      }
      const memRes = memoryLimiter.limit(`sync:${ipOrUser}`, 120, 60_000);
      return { ...memRes, nodeId: LOAD_BALANCER_NODE_ID };
    }

    // Default General Tier
    if (upstashGeneralLimiter) {
      const res = await upstashGeneralLimiter.limit(ipOrUser);
      return {
        success: res.success,
        limit: res.limit,
        remaining: res.remaining,
        reset: res.reset,
        nodeId: LOAD_BALANCER_NODE_ID,
      };
    }

    const memRes = memoryLimiter.limit(`general:${ipOrUser}`, 60, 10_000);
    return { ...memRes, nodeId: LOAD_BALANCER_NODE_ID };
  } catch (error) {
    console.warn('[Load Balancer] Rate limit check exception, allowing request as fail-open:', error);
    return {
      success: true,
      limit: 60,
      remaining: 59,
      reset: 0,
      nodeId: LOAD_BALANCER_NODE_ID,
    };
  }
}
