// types/profile.ts
export interface ProfileUser {
  id: string;
  name: string | null;
  imageUrl: string | null;
  bio: string | null;
  location: string | null;
  joinedAt: Date;
  isVerified: boolean;
  avgRating?: number;
  totalReviews?: number;
}

export interface ProfileStats {
  totalListings: number;
  activeListings?: number;
  activeLeases: number;
  completedLeases?: number;
  totalRevenue: number;
  avgRating: number | null;
  totalReviews?: number;
  responseRate?: number;
  // Trends
  listingsTrend?: number;
  leasesTrend?: number;
  revenueTrend?: number;
  responseTrend?: number;
  totalBids?: number;
  bidsTrend?: number;
}

export interface ProfileListing {
  id: string;
  title: string;
  basePrice: number;
  totalBids: number;
  viewCount: number;
  createdAt: Date;
  endDate: Date | string;
  isUrgent?: boolean;
  hotnessScore?: number | null;
  maxBids?: number;
  listingType?: string;
  auctionStatus?: string;
  images?: Array<{ url: string; isPrimary: boolean }>;
  land?: {
    size?: number;
    village?: string | null;
    landType?: string;
  };
}

// Re-export all types as a namespace for convenience
export type Profile = {
  user: ProfileUser;
  stats: ProfileStats;
  listings: ProfileListing[];
};