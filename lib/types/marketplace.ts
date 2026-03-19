// lib/types/marketplace.ts
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
  sortBy?: 'hotnessScore' | 'newest' | 'endingSoon' | 'priceLowToHigh' | 'priceHighToLow' | 'mostBids'
}

export interface PaginationParams {
  page: number
  limit: number
}

// Export types from marketplace-queries
export type { 
  MarketplaceFeedItem, 
  ListingDetail, 
  AuctionRoomData,
  ScoreableListing 
} from '../prisma/marketplace-queries'