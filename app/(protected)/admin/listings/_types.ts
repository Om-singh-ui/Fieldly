// app/(protected)/admin/listings/_types.ts

export interface AdminListing {
  id: string;
  title: string;
  description?: string;
  listingType: string;
  status: string;
  auctionStatus?: string;
  basePrice: number;
  reservePrice?: number | null;
  buyNowPrice?: number | null;
  createdAt: string;
  publishedAt?: string | null;
  startDate?: string;
  endDate?: string;
  land?: {
    size: number;
    landType: string;
    village: string;
    district: string;
    state?: string;
  };
  owner?: {
    id: string;
    name: string;
    email: string;
  };
  _count?: {
    applications: number;
    bids: number;
  };
}

export interface PaginationState {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
}

export interface ListingStats {
  total: number;
  byStatus: Record<string, number>;
  totalValue: number;
  activeBids: number;
  pendingReviews: number;
  liveAuctions: number;
}

export interface ListingsFilters {
  search: string;
  status: string;
  type: string;
  sortBy: string;
  sortOrder: "asc" | "desc";
}

export type BulkAction = "approve" | "reject" | "close" | "activate" | "cancel";
export type ReviewAction = "APPROVE" | "REJECT";
export type AuctionAction = "UPCOMING" | "LIVE" | "PAUSED" | "CLOSED";