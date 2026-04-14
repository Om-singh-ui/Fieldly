// types/profile.ts
export interface ProfileUser {
  id: string;
  clerkId?: string;
  name: string | null;
  email?: string | null;
  imageUrl: string | null;
  bio: string | null;
  location: string | null;
  joinedAt: Date;
  isVerified: boolean;
  role?: 'FARMER' | 'LANDOWNER' | 'ADMIN' | 'SUPER_ADMIN' | null;  
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

export type Profile = {
  user: ProfileUser;
  stats: ProfileStats;
  listings: ProfileListing[];
};

export interface AvailableLand {
  id: string;
  title: string;
  size: number;
  landType: string;
  village: string | null;
  district: string | null;
  state: string | null;
  minLeaseDuration: number;
  maxLeaseDuration: number;
  expectedRentMin: number | null;
  expectedRentMax: number | null;
}

export interface ExistingApplication {
  id: string;
  status: string;
  createdAt: Date;
}