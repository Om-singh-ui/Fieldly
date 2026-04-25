// app/(protected)/admin/applications/_types.ts
export interface AdminApplication {
  id: string;
  status: string;
  proposedRent: number | null;
  duration: number;
  cropPlan: string | null;
  message: string | null;
  createdAt: string;
  reviewedAt: string | null;
  reviewNotes: string | null;
  land: {
    id: string;
    title: string;
    size: number;
    landType: string;
    village: string | null;
    district: string | null;
    state: string | null;
    landowner: {
      id: string;
      name: string;
      email: string;
    };
  };
  farmer: {
    id: string;
    name: string;
    email: string;
    farmerProfile?: {
      primaryCrops: string[];
      farmingExperience: number;
      isVerified: boolean;
    };
  };
  listing?: {
    id: string;
    title: string;
  } | null;
}

export interface PaginationState {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
}

export interface ApplicationStats {
  total: number;
  byStatus: Record<string, number>;
  totalValue: number;
  pendingReview: number;
  approvedToday: number;
  avgResponseTime: number;
}

export interface ApplicationsFilters {
  search: string;
  status: string;
  sortBy: string;
  sortOrder: "asc" | "desc";
}

export type ReviewAction = "APPROVE" | "REJECT";