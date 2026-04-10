// lib/redis.ts
import { Redis } from "@upstash/redis";

// Check if Redis environment variables are set
const redisUrl = process.env.UPSTASH_REDIS_REST_URL;
const redisToken = process.env.UPSTASH_REDIS_REST_TOKEN;

// Helper to validate URL format
function isValidRedisUrl(url: string): boolean {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
}

// Only initialize Redis if credentials are available AND valid
let redisInstance: Redis | null = null;

if (redisUrl && redisToken) {
  // Check if URL is valid
  if (!isValidRedisUrl(redisUrl)) {
    console.warn(`[Redis] Invalid UPSTASH_REDIS_REST_URL: "${redisUrl}". Redis caching disabled.`);
  } else {
    try {
      redisInstance = new Redis({
        url: redisUrl,
        token: redisToken,
      });
      console.log(`[Redis] Successfully initialized with Upstash Redis`);
    } catch (error) {
      console.warn(`[Redis] Failed to initialize:`, error);
    }
  }
} else {
  console.log(`[Redis] Environment variables missing. Running without Redis cache.`);
}

export const redis = redisInstance;

// Cache keys
export const CACHE_KEYS = {
  LISTING: (id: string, userId: string) => `listing:${id}:${userId}`,
  AUCTION: (id: string) => `auction:${id}`,
  USER: (id: string) => `user:${id}`,
} as const;

// Cache TTL in seconds
export const CACHE_TTL = {
  LISTING: 300, // 5 minutes
  AUCTION: 2,   // 2 seconds
  USER: 3600,   // 1 hour
} as const;

// Helper to check if Redis is available
export const isRedisAvailable = (): boolean => redis !== null;

// Safe Redis operations with fallbacks
export const safeRedis = {
  async get<T>(key: string): Promise<T | null> {
    if (!redis) return null;
    try {
      return await redis.get<T>(key);
    } catch (error) {
      console.warn(`[Redis] GET failed for key "${key}":`, error);
      return null;
    }
  },

  async setex<T>(key: string, ttl: number, value: T): Promise<void> {
    if (!redis) return;
    try {
      await redis.setex(key, ttl, value);
    } catch (error) {
      console.warn(`[Redis] SETEX failed for key "${key}":`, error);
    }
  },

  async del(key: string): Promise<void> {
    if (!redis) return;
    try {
      await redis.del(key);
    } catch (error) {
      console.warn(`[Redis] DEL failed for key "${key}":`, error);
    }
  },

  async delMany(keys: string[]): Promise<void> {
    if (!redis || keys.length === 0) return;
    try {
      await redis.del(...keys);
    } catch (error) {
      console.warn(`[Redis] DEL failed for keys:`, error);
    }
  },
};