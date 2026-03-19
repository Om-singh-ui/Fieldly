// lib/redis.ts
import { Redis } from '@upstash/redis'

export const redis = new Redis({
  url: process.env.UPSTASH_REDIS_URL!,
  token: process.env.UPSTASH_REDIS_TOKEN!,
})

export const CACHE_KEYS = {
  LISTING: (id: string, userId: string) => `listing:${id}:${userId}`,
  AUCTION: (id: string) => `auction:${id}`,
  USER_BIDS: (userId: string) => `user:bids:${userId}`,
}

export const CACHE_TTL = {
  LISTING: 300, // 5 minutes
  AUCTION: 2,   // 2 seconds
  USER_BIDS: 60, // 1 minute
}