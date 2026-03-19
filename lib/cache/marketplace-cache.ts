import { Redis } from "@upstash/redis"
import { prisma } from "@/lib/prisma"
import {
  listingDetailQuery,
  marketplaceFeedQuery,
} from "@/lib/prisma/marketplace-queries"
import { MarketplaceFilters } from "@/lib/types/marketplace"
import crypto from "crypto"

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_URL!,
  token: process.env.UPSTASH_REDIS_TOKEN!,
})

/**
 * Safe JSON parse
 */
function safeParse<T>(value: string | null): T | null {
  try {
    if (!value) return null
    return JSON.parse(value) as T
  } catch {
    return null
  }
}

/**
 * Stable hash key generator (production safe)
 */
function hashKey(input: unknown) {
  return crypto.createHash("sha1").update(JSON.stringify(input)).digest("hex")
}

/**
 * Get single listing with cache
 */
export async function getCachedListing(id: string) {
  const cacheKey = `listing:${id}`

  try {
    const cached = await redis.get<string>(cacheKey)
    const parsed = safeParse<typeof cached>(cached)

    if (parsed) return parsed

    const listing = await prisma.landListing.findUnique(
      listingDetailQuery(id)
    )

    if (listing) {
      await redis.set(cacheKey, JSON.stringify(listing), { ex: 300 })
    }

    return listing
  } catch (error) {
    console.error("Listing cache error:", error)
    return prisma.landListing.findUnique(listingDetailQuery(id))
  }
}

/**
 * Get marketplace feed with cache
 */
export async function getCachedFeed(filters: MarketplaceFilters) {
  const pagination = { page: 1, limit: 20 }
  const cacheKey = `feed:${hashKey({ filters, pagination })}`

  try {
    const cached = await redis.get<string>(cacheKey)
    const parsed = safeParse<typeof cached>(cached)

    if (parsed) return parsed

    const query = marketplaceFeedQuery(filters, pagination)
    const feed = await prisma.landListing.findMany(query)

    await redis.set(cacheKey, JSON.stringify(feed), { ex: 60 })

    return feed
  } catch (error) {
    console.error("Feed cache error:", error)

    const query = marketplaceFeedQuery(filters, pagination)
    return prisma.landListing.findMany(query)
  }
}