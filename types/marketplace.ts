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
 * LAND DTO
 */
export interface LandDTO {
  id: string
  size: number
  landType: string
  district: string | null
  state: string | null
  irrigationAvailable: boolean
  images?: ListingImageDTO[]
}

/**
 * OWNER DTO
 */
export interface OwnerDTO {
  id: string
  name: string
  imageUrl?: string | null
  landownerProfile?: {
    isVerified: boolean
    verificationLevel?: number
  }
}

/**
 * FEED DTO (API → UI)
 */
export interface MarketplaceFeedItem {
  id: string
  title: string
  basePrice: number
  auctionStatus: "LIVE" | "UPCOMING" | "ENDED"
  endDate: string

  images?: ListingImageDTO[]
  land: LandDTO
  owner?: OwnerDTO

  _count?: {
    bids: number
    savedBy?: number
  }

  marketplaceScore?: number
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