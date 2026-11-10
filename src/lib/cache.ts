import { redisGet, redisSet, redisFlushPrefix, isRedisConfigured } from './redis';

// L1 In-Memory Cache (0ms latency for ultra-hot items)
interface L1CacheEntry<T> {
  data: T;
  expiresAt: number;
}
const l1Cache = new Map<string, L1CacheEntry<any>>();

// Cache Key Namespaces for SamayYudh 2.0
export const CACHE_KEYS = {
  // Questions cache: samayyudh:questions:<exam>:<subject>:<chapter>
  questions: (exam: string, subject?: string, chapter?: string) =>
    `samayyudh:questions:${exam.toLowerCase()}${subject ? `:${subject.toLowerCase()}` : ''}${chapter ? `:${chapter.toLowerCase()}` : ''}`,

  // Syllabus structure cache: samayyudh:syllabus:<exam>
  syllabus: (exam: string) => `samayyudh:syllabus:${exam.toLowerCase()}`,

  // Leaderboard cache: samayyudh:leaderboard:<exam>:<timeframe>
  leaderboard: (exam: string, timeframe: 'all' | 'weekly' | 'daily' = 'all') =>
    `samayyudh:leaderboard:${exam.toLowerCase()}:${timeframe}`,

  // User stats & analytics: samayyudh:stats:<userId>
  userStats: (userId: string) => `samayyudh:stats:${userId}`,

  // System health & metrics: samayyudh:system:metrics
  systemMetrics: () => 'samayyudh:system:metrics',
} as const;

export interface CacheOptions {
  /** TTL in seconds (default: 300 seconds / 5 mins) */
  ttlSeconds?: number;
  /** Whether to enable L1 fast in-memory cache (default: true) */
  enableL1?: boolean;
  /** Force refresh and bypass cache */
  forceRefresh?: boolean;
}

/**
 * Universal Cache Fetcher:
 * 1. Checks L1 In-Memory Cache (0ms hit)
 * 2. Checks L2 Redis Distributed Cache (~10-25ms hit across all cluster nodes)
 * 3. On cache miss: runs `fetcher()`, populates L1 and L2, and returns fresh data
 */
export async function getOrSetCache<T>(
  key: string,
  fetcher: () => Promise<T>,
  options: CacheOptions = {}
): Promise<{ data: T; source: 'l1' | 'redis' | 'fetcher' }> {
  const { ttlSeconds = 300, enableL1 = true, forceRefresh = false } = options;

  if (!forceRefresh) {
    // 1. Check L1 Memory Cache
    if (enableL1) {
      const l1Entry = l1Cache.get(key);
      if (l1Entry && l1Entry.expiresAt > Date.now()) {
        return { data: l1Entry.data, source: 'l1' };
      } else if (l1Entry) {
        l1Cache.delete(key);
      }
    }

    // 2. Check L2 Redis Cache
    const cachedData = await redisGet<T>(key);
    if (cachedData !== null) {
      // Re-populate L1 for subsequent hot requests
      if (enableL1) {
        l1Cache.set(key, {
          data: cachedData,
          expiresAt: Date.now() + Math.min(ttlSeconds, 60) * 1000,
        });
      }
      return { data: cachedData, source: 'redis' };
    }
  }

  // 3. Cache Miss: Execute fresh fetch
  const freshData = await fetcher();

  // Populate L1
  if (enableL1) {
    l1Cache.set(key, {
      data: freshData,
      expiresAt: Date.now() + Math.min(ttlSeconds, 60) * 1000,
    });
  }

  // Populate L2 (Redis)
  if (freshData !== undefined && freshData !== null) {
    await redisSet(key, freshData, ttlSeconds);
  }

  return { data: freshData, source: 'fetcher' };
}

/**
 * Invalidate cache by key or prefix
 */
export async function invalidateCache(keyOrPrefix: string): Promise<void> {
  // Clear from L1
  for (const k of l1Cache.keys()) {
    if (k.startsWith(keyOrPrefix.replace('*', ''))) {
      l1Cache.delete(k);
    }
  }

  // Clear from L2 (Redis)
  await redisFlushPrefix(keyOrPrefix);
}

/**
 * Health information on the cache subsystem
 */
export function getCacheHealthInfo() {
  return {
    isRedisConfigured: isRedisConfigured(),
    l1CacheEntries: l1Cache.size,
    type: isRedisConfigured() ? 'Upstash Redis (Distributed Cloud)' : 'In-Memory Cluster Fallback',
  };
}

