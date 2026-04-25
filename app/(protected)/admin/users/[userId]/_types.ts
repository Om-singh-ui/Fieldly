// app/(protected)/admin/users/[userId]/_types.ts
export interface UserDetails {
  id: string;
  name: string;
  email: string;
  phone?: string | null;
  state?: string | null;
  district?: string | null;
  imageUrl?: string | null;
  role: string | null;
  isOnboarded: boolean;
  createdAt: string;
  _count?: {
    applications: number;
    listingsOwned: number;
    leasesAsFarmer: number;
    leasesAsOwner: number;
    payments: number;
  };
}

export interface ActivityItem {
  id: string;
  action: string;
  createdAt: string;
}