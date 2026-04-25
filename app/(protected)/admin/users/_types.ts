// app/(protected)/admin/users/_types.ts
export interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: string | null;
  isOnboarded: boolean;
  state?: string | null;
  district?: string | null;
  imageUrl?: string | null;
  createdAt: string;
  _count?: {
    applications: number;
    listingsOwned: number;
  };
}

export interface UserStats {
  total: number;
  byRole: Record<string, number>;
}

export interface PaginationState {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
}

export interface UserFilters {
  search: string;
  role: string;
  status: string;
  sortBy: string;
  sortOrder: string;
}