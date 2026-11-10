import { Redis } from '@upstash/redis';

// In-memory fallback cache for development or when Upstash credentials are not configured
class MemoryRedisFallback {
  private store: Map<string, { value: any; expiresAt: number | null }> = new Map();

  async get<T = any>(key: string): Promise<T | null> {
    const entry = this.store.get(key);
    if (!entry) return null;

    if (entry.expiresAt && Date.now() > entry.expiresAt) {
      this.store.delete(key);
      return null;
    }

    try {
      return typeof entry.value === 'string' ? JSON.parse(entry.value) : entry.value;
    } catch {
      return entry.value as T;
    }
  }

  async set(key: string, value: any, options?: { ex?: number }): Promise<'OK'> {
    const serialized = typeof value === 'object' ? JSON.stringify(value) : value;
    const expiresAt = options?.ex ? Date.now() + options.ex * 1000 : null;
    this.store.set(key, { value: serialized, expiresAt });
    return 'OK';
  }

  async del(...keys: string[]): Promise<number> {
    let deleted = 0;
    for (const key of keys) {
      if (this.store.delete(key)) deleted++;
    }
    return deleted;
  }

  async keys(pattern: string): Promise<string[]> {
    const regex = new RegExp('^' + pattern.replace(/\*/g, '.*') + '$');
    const now = Date.now();
    const matched: string[] = [];

    for (const [key, entry] of this.store.entries()) {
      if (entry.expiresAt && now > entry.expiresAt) {
        this.store.delete(key);
        continue;
      }
      if (regex.test(key)) {
        matched.push(key);
      }
    }
    return matched;
  }

  async ping(): Promise<string> {
    return 'PONG (Memory Fallback)';
  }
}

// Check if Upstash credentials are provided
const hasUpstashCredentials = Boolean(
  process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN
);

export const isRedisConfigured = (): boolean => hasUpstashCredentials;

// Singleton Redis client (Upstash or Memory Fallback)
export const redis: Redis | MemoryRedisFallback = hasUpstashCredentials
  ? new Redis({
      url: process.env.UPSTASH_REDIS_REST_URL!,
      token: process.env.UPSTASH_REDIS_REST_TOKEN!,
    })
  : new MemoryRedisFallback();

/**
 * Safe get with typed return
 */
export async function redisGet<T>(key: string): Promise<T | null> {
  try {
    const data = await redis.get<T>(key);
    return data ?? null;
  } catch (error) {
    console.warn(`[Redis Cache] Failed to get key "${key}":`, error);
    return null;
  }
}

/**
 * Safe set with TTL in seconds
 */
export async function redisSet(
  key: string,
  value: any,
  ttlSeconds: number = 300
): Promise<boolean> {
  try {
    await redis.set(key, value, { ex: ttlSeconds });
    return true;
  } catch (error) {
    console.warn(`[Redis Cache] Failed to set key "${key}":`, error);
    return false;
  }
}

/**
 * Invalidate all keys matching a prefix pattern (e.g. "samayyudh:questions:*")
 */
export async function redisFlushPrefix(prefix: string): Promise<number> {
  try {
    const pattern = prefix.endsWith('*') ? prefix : `${prefix}*`;
    const keys = await redis.keys(pattern);
    if (keys.length > 0) {
      return await redis.del(...keys);
    }
    return 0;
  } catch (error) {
    console.warn(`[Redis Cache] Failed to flush prefix "${prefix}":`, error);
    return 0;
  }
}

