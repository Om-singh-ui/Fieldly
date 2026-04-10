// types/admin.types.ts
export interface PaginationState {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
}

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
  banReason?: string; // Add this line
  _count?: {
    applications: number;
    listingsOwned: number;
  };
}


export interface AdminListing {
  id: string;
  title: string;
  description?: string;
  listingType: string;
  status: string;
  basePrice: number;
  createdAt: string;
  land?: {
    size: number;
    landType: string;
    village: string;
    district: string;
  };
  owner?: {
    name: string;
    email: string;
  };
  _count?: {
    applications: number;
    bids: number;
  };
}

export interface AdminApplication {
  id: string;
  status: string;
  proposedRent?: number;
  createdAt: string;
  farmer: {
    id: string;
    name: string;
    email: string;
  };
  land: {
    id: string;
    title: string;
    size: number;
    village: string;
    district: string;
  };
}

export interface AdminDispute {
  id: string;
  type: string;
  reason: string;
  status: string;
  priority: string;
  createdAt: string;
  filedBy: {
    name: string;
  };
  filedByRole: string;
  assigned?: {
    name: string;
  };
}

export interface AuditLog {
  id: string;
  action: string;
  entity: string;
  entityId?: string;
  ipAddress: string;
  createdAt: string;
  admin: {
    name: string;
    email: string;
  };
  changes?: Record<string, unknown>;
}

export interface AdminStats {
  users: { total: number; trend?: number; byRole?: Record<string, number> };
  listings: { total: number; active: number; trend?: number; byStatus?: Record<string, number> };
  applications: { pending: number; trend?: number };
  payments: { total: number; successful: number; trend?: number };
  disputes: { open: number; trend?: number };
  conversion: { rate: number; trend?: number };
}