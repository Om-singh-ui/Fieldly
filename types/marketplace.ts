// types/marketplace.ts

import type {
  ListingDetail as Detail,
  AuctionRoomData as AuctionData,
  Bid as BidType,
  Document as DocumentType,
  ScoreableListing,
} from "@/lib/prisma/marketplace-queries"

/**
 * IMAGE DTO
 */
export interface ListingImageDTO {
  id?: string
  url: string
  caption?: string | null
  isPrimary?: boolean
  sortOrder?: number
}

/**
 * LAND DTO - Complete with geo fields
 */
export interface LandDTO {
  id: string
  size: number
  landType: string
  district: string | null
  state: string | null
  soilType?: string | null
  irrigationAvailable: boolean
  electricityAvailable?: boolean | null
  roadAccess?: boolean | null
  fencingAvailable?: boolean | null
  waterSource?: string | null
  title?: string | null
  description?: string | null
  images?: ListingImageDTO[]
  
  // GEO FIELDS - Required for map functionality
  latitude?: number | null
  longitude?: number | null
  village?: string | null
  pincode?: string | null
  address?: string | null
  mapUrl?: string | null
  location?: string | null
}

/**
 * OWNER DTO
 */
export interface OwnerDTO {
  id: string
  name: string
  imageUrl?: string | null
  createdAt?: string
  updatedAt?: string
  landownerProfile?: {
    isVerified: boolean
    verificationLevel?: number
  } | null
}

/**
 * FEED DTO (API → UI) - Complete with all fields
 */
export interface MarketplaceFeedItem {
  id: string
  title: string
  description?: string | null
  basePrice: number
  highestBid?: number | null
  endDate: string
  startDate?: string
  auctionStatus: "LIVE" | "UPCOMING" | "ENDED"
  minimumLeaseDuration?: number
  maximumLeaseDuration?: number
  createdAt?: string
  updatedAt?: string
  publishedAt?: string | null
  lastBidAt?: string | null
  viewCount?: number
  totalBids?: number
  hotnessScore?: number | null
  engagementScore?: number | null
  marketplaceScore?: number

  images?: ListingImageDTO[]
  land: LandDTO
  owner?: OwnerDTO

  _count?: {
    bids: number
    savedBy?: number
    applications?: number
  }
}

/**
 * FILTERS
 */
export interface MarketplaceFilters {
  search?: string | null
  minPrice?: number
  maxPrice?: number
  landType?: string | null
  state?: string | null
  district?: string | null
  minSize?: number
  maxSize?: number
  irrigation?: boolean
  verifiedOnly?: boolean
  sortBy?:
    | "hotnessScore"
    | "newest"
    | "endingSoon"
    | "priceLowToHigh"
    | "priceHighToLow"
    | "mostBids"
}

export interface PaginationParams {
  page: number
  limit: number
}

/**
 * DETAIL / AUCTION TYPES (Prisma domain)
 */
export type ListingDetail = Detail
export type AuctionRoomData = AuctionData
export type Bid = BidType
export type Document = DocumentType
export type { ScoreableListing }

/**
 * EVENTS
 */
export interface NewBidEvent {
  bid: Bid
  timestamp: string
}

export interface AuctionExtendedEvent {
  message: string
  extendedByMinutes: number
  newEndTime: string
}

export interface SavedListing {
  id: string
  listingId: string
  userId: string
  createdAt: Date
  listing?: MarketplaceFeedItem
}

// Helper function to format location from land data
export function formatLocation(land: LandDTO | null | undefined): string {
  if (!land) return "Location not specified"
  
  // Use pre-formatted location if available
  if (land.location) return land.location
  
  // Build from components
  const parts: string[] = []
  if (land.village) parts.push(land.village)
  if (land.district) parts.push(land.district)
  if (land.state) parts.push(land.state)
  
  return parts.length > 0 ? parts.join(", ") : "Location not specified"
}

// Helper function to get map URL
export function getMapUrl(land: LandDTO | null | undefined): string | null {
  if (!land) return null
  
  // Use pre-generated mapUrl if available
  if (land.mapUrl) return land.mapUrl
  
  // Generate from coordinates
  if (land.latitude && land.longitude) {
    return `https://www.google.com/maps?q=${land.latitude},${land.longitude}`
  }
  
  // Generate from location name
  const location = formatLocation(land)
  if (location !== "Location not specified") {
    return `https://www.google.com/maps/search/${encodeURIComponent(location)}`
  }
  
  return null
}

// Helper function to check if location data is available
export function hasLocationData(land: LandDTO | null | undefined): boolean {
  if (!land) return false
  return !!(land.latitude && land.longitude) || 
    (!!land.location && land.location !== "Location not specified") ||
    !!(land.district && land.state)
}