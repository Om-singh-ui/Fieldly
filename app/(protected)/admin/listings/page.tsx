// app/(protected)/admin/listings/page.tsx
"use client";

import { useEffect, useState, useCallback, useMemo } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Search,
  Filter,
  MoreVertical,
  Download,
  ChevronLeft,
  ChevronRight,
  Eye,
  CheckCircle,
  XCircle,
  Home,
  MapPin,
  IndianRupee,
  Calendar,
  Flag,
  Star,
  Clock,
  FileText,
  Edit,
  Ban,
  RefreshCw,
  Archive,
  PlayCircle,
  PauseCircle,
  StopCircle,
  TrendingUp,
  Loader2,
  AlertCircle,
} from "lucide-react";
import { toast } from "sonner";
import { formatDistanceToNow } from "date-fns";

// ============================================
// TYPE DEFINITIONS
// ============================================
interface AdminListing {
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

interface PaginationState {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
}

interface ListingStats {
  total: number;
  byStatus: Record<string, number>;
  totalValue: number;
  activeBids: number;
  pendingReviews: number;
  liveAuctions: number;
}

interface ListingsFilters {
  search: string;
  status: string;
  type: string;
  sortBy: string;
  sortOrder: "asc" | "desc";
}

type BulkAction = "approve" | "reject" | "close" | "activate" | "cancel";
type ReviewAction = "APPROVE" | "REJECT";
type AuctionAction = "UPCOMING" | "LIVE" | "PAUSED" | "CLOSED";

// ============================================
// CONSTANTS
// ============================================
const ITEMS_PER_PAGE_OPTIONS = [10, 20, 50, 100];

const STATUS_OPTIONS = [
  { value: "all", label: "All Status" },
  { value: "DRAFT", label: "Draft" },
  { value: "ACTIVE", label: "Active" },
  { value: "PENDING_APPROVAL", label: "Pending Approval" },
  { value: "CLOSED", label: "Closed" },
  { value: "CANCELLED", label: "Cancelled" },
  { value: "EXPIRED", label: "Expired" },
] as const;

const LISTING_TYPE_OPTIONS = [
  { value: "all", label: "All Types" },
  { value: "OPEN_BIDDING", label: "Open Bidding" },
  { value: "FIXED_PRICE", label: "Fixed Price" },
  { value: "NEGOTIABLE", label: "Negotiable" },
] as const;

const SORT_OPTIONS = [
  { value: "createdAt", label: "Date Listed" },
  { value: "title", label: "Title" },
  { value: "basePrice", label: "Price" },
  { value: "status", label: "Status" },
] as const;

const AVAILABLE_STATUSES = [
  { value: "DRAFT", label: "Draft", icon: FileText, description: "Listing being prepared" },
  { value: "PENDING_APPROVAL", label: "Pending Approval", icon: Clock, description: "Awaiting admin review" },
  { value: "ACTIVE", label: "Active", icon: CheckCircle, description: "Published and visible" },
  { value: "CLOSED", label: "Closed", icon: Archive, description: "No longer accepting bids" },
  { value: "CANCELLED", label: "Cancelled", icon: Ban, description: "Listing cancelled" },
  { value: "EXPIRED", label: "Expired", icon: Calendar, description: "End date passed" },
] as const;


const VALID_TRANSITIONS: Record<string, readonly string[]> = {
  DRAFT: ["PENDING_APPROVAL", "CANCELLED"],
  PENDING_APPROVAL: ["ACTIVE", "DRAFT", "CANCELLED"],
  ACTIVE: ["CLOSED", "CANCELLED", "EXPIRED"],
  CLOSED: ["ACTIVE"],
  CANCELLED: [],
  EXPIRED: ["ACTIVE"],
} as const;

const STATUS_BADGE_CONFIG: Record<string, { variant: "default" | "secondary" | "destructive" | "outline"; label: string; icon: React.ElementType }> = {
  DRAFT: { variant: "secondary", label: "Draft", icon: FileText },
  ACTIVE: { variant: "default", label: "Active", icon: CheckCircle },
  PENDING_APPROVAL: { variant: "outline", label: "Pending", icon: Clock },
  CLOSED: { variant: "secondary", label: "Closed", icon: Archive },
  CANCELLED: { variant: "destructive", label: "Cancelled", icon: Ban },
  EXPIRED: { variant: "secondary", label: "Expired", icon: Calendar },
};

const AUCTION_STATUS_BADGE_CONFIG: Record<string, { variant: "default" | "secondary" | "destructive" | "outline"; label: string }> = {
  UPCOMING: { variant: "secondary", label: "Upcoming" },
  LIVE: { variant: "default", label: "LIVE" },
  PAUSED: { variant: "outline", label: "Paused" },
  CLOSED: { variant: "secondary", label: "Closed" },
  SETTLED: { variant: "default", label: "Settled" },
  FAILED: { variant: "destructive", label: "Failed" },
};

const LISTING_TYPE_BADGE_CONFIG: Record<string, { label: string; color: string }> = {
  OPEN_BIDDING: { label: "Bidding", color: "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400" },
  FIXED_PRICE: { label: "Fixed", color: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400" },
  NEGOTIABLE: { label: "Negotiable", color: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400" },
};

const AUCTION_ACTION_CONFIG: Record<AuctionAction, { title: string; description: string; variant: "default" | "outline" | "destructive"; icon: React.ElementType; color: string }> = {
  UPCOMING: {
    title: "Set as Upcoming",
    description: "Listing will be visible in marketplace but bidding is not yet open.",
    variant: "outline",
    icon: Calendar,
    color: "text-blue-600",
  },
  LIVE: {
    title: "Make LIVE for Bidding",
    description: "Listing will be visible and farmers can place bids immediately.",
    variant: "default",
    icon: PlayCircle,
    color: "text-green-600",
  },
  PAUSED: {
    title: "Pause Auction",
    description: "Listing will be hidden from marketplace temporarily. You can resume later.",
    variant: "outline",
    icon: PauseCircle,
    color: "text-amber-600",
  },
  CLOSED: {
    title: "Close Auction",
    description: "Auction will end. Listing will be hidden from marketplace.",
    variant: "destructive",
    icon: StopCircle,
    color: "text-red-600",
  },
};

// ============================================
// MAIN COMPONENT
// ============================================
export default function AdminListingsPage() {
  const router = useRouter();
  
  // State
  const [loading, setLoading] = useState(true);
  const [listings, setListings] = useState<AdminListing[]>([]);
  const [stats, setStats] = useState<ListingStats | null>(null);
  const [pagination, setPagination] = useState<PaginationState>({
    page: 1,
    limit: 20,
    total: 0,
    totalPages: 0,
    hasNext: false,
    hasPrev: false,
  });
  const [filters, setFilters] = useState<ListingsFilters>({
    search: "",
    status: "all",
    type: "all",
    sortBy: "createdAt",
    sortOrder: "desc",
  });
  const [selectedListings, setSelectedListings] = useState<Set<string>>(new Set());
  
  // Dialog states
  const [dialogState, setDialogState] = useState<{
    type: "status" | "review" | "bulkStatus" | "auction" | null;
    open: boolean;
  }>({ type: null, open: false });
  
  // Selected item state
  const [selectedListing, setSelectedListing] = useState<AdminListing | null>(null);
  const [reviewAction, setReviewAction] = useState<ReviewAction>("APPROVE");
  const [reviewNotes, setReviewNotes] = useState("");
  const [newStatus, setNewStatus] = useState("");
  const [statusChangeReason, setStatusChangeReason] = useState("");
  const [bulkNewStatus, setBulkNewStatus] = useState("");
  const [bulkStatusReason, setBulkStatusReason] = useState("");
  const [auctionAction, setAuctionAction] = useState<AuctionAction>("LIVE");
  const [auctionReason, setAuctionReason] = useState("");
  
  // Action loading states
  const [actionLoading, setActionLoading] = useState(false);

  // ============================================
  // DATA FETCHING
  // ============================================
  const fetchListings = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        page: pagination.page.toString(),
        limit: pagination.limit.toString(),
        ...(filters.search && { search: filters.search }),
        ...(filters.status !== "all" && { status: filters.status }),
        ...(filters.type !== "all" && { listingType: filters.type }),
        sortBy: filters.sortBy,
        sortOrder: filters.sortOrder,
      });

      const res = await fetch(`/api/admin/listings?${params}`);
      const data = await res.json();

      if (!res.ok) throw new Error(data.error || "Failed to fetch listings");

      setListings(data.listings || []);
      setStats(data.stats);
      setPagination({
        ...data.pagination,
        hasNext: data.pagination.page < data.pagination.totalPages,
        hasPrev: data.pagination.page > 1,
      });
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to load listings");
    } finally {
      setLoading(false);
    }
  }, [filters, pagination.page, pagination.limit]);

  useEffect(() => {
    fetchListings();
  }, [fetchListings]);

  // ============================================
  // API ACTIONS
  // ============================================
  const handleApiAction = async <T,>(
    endpoint: string,
    body: object,
    successMessage: string,
    options?: { method?: string; onSuccess?: (data: T) => void }
  ): Promise<boolean> => {
    setActionLoading(true);
    try {
      const res = await fetch(endpoint, {
        method: options?.method || "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Action failed");

      toast.success(successMessage);
      options?.onSuccess?.(data);
      resetDialogs();
      setSelectedListings(new Set());
      await fetchListings();
      return true;
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Action failed");
      return false;
    } finally {
      setActionLoading(false);
    }
  };

  async function handleStatusChange() {
    if (!selectedListing || !newStatus) return;
    await handleApiAction(
      "/api/admin/listings/status",
      { listingId: selectedListing.id, status: newStatus, reason: statusChangeReason },
      `Listing status changed to ${newStatus}`,
      { method: "PUT" }
    );
  }

  async function handleReviewListing() {
    if (!selectedListing) return;
    await handleApiAction(
      "/api/admin/listings/review",
      { listingId: selectedListing.id, action: reviewAction, notes: reviewNotes },
      `Listing ${reviewAction === "APPROVE" ? "approved" : "rejected"} successfully`
    );
  }

  async function handleAuctionStatusChange() {
    if (!selectedListing) return;
    const messages: Record<AuctionAction, string> = {
      UPCOMING: "Auction set to Upcoming",
      LIVE: "Auction is now LIVE!",
      PAUSED: "Auction paused",
      CLOSED: "Auction closed",
    };
    await handleApiAction(
      "/api/admin/listings/auction-status",
      { listingId: selectedListing.id, auctionStatus: auctionAction, reason: auctionReason },
      messages[auctionAction],
      { method: "PUT" }
    );
  }

  async function handleBulkStatusChange() {
    if (selectedListings.size === 0 || !bulkNewStatus) return;
    await handleApiAction(
      "/api/admin/listings/bulk-status",
      { listingIds: Array.from(selectedListings), status: bulkNewStatus, reason: bulkStatusReason },
      `Changed status for listings to ${bulkNewStatus}`,
      { method: "PUT" }
    );
  }

  async function handleBulkAction(action: BulkAction) {
    if (selectedListings.size === 0) return;
    await handleApiAction(
      "/api/admin/listings/bulk",
      { listingIds: Array.from(selectedListings), action },
      `Successfully ${action}ed listings`
    );
  }

  // ============================================
  // HELPER FUNCTIONS
  // ============================================
  const resetDialogs = () => {
    setDialogState({ type: null, open: false });
    setSelectedListing(null);
    setNewStatus("");
    setStatusChangeReason("");
    setReviewNotes("");
    setBulkNewStatus("");
    setBulkStatusReason("");
    setAuctionReason("");
    setAuctionAction("LIVE");
  };

  const openDialog = (type: "status" | "review" | "bulkStatus" | "auction", listing?: AdminListing) => {
    if (listing) setSelectedListing(listing);
    setDialogState({ type, open: true });
  };

  const getStatusBadge = (status: string) => {
    const config = STATUS_BADGE_CONFIG[status] || { variant: "outline" as const, label: status, icon: FileText };
    const Icon = config.icon;
    return (
      <Badge variant={config.variant} className="gap-1">
        <Icon className="h-3 w-3" />
        {config.label}
      </Badge>
    );
  };

  const getAuctionStatusBadge = (status?: string) => {
    if (!status) return null;
    const config = AUCTION_STATUS_BADGE_CONFIG[status] || { variant: "outline" as const, label: status };
    return (
      <Badge variant={config.variant} className="gap-1 text-xs">
        <TrendingUp className="h-3 w-3" />
        {config.label}
      </Badge>
    );
  };

  const getListingTypeBadge = (type: string) => {
    const config = LISTING_TYPE_BADGE_CONFIG[type] || { label: type, color: "bg-gray-100 text-gray-800" };
    return <Badge className={config.color}>{config.label}</Badge>;
  };

  const getAvailableStatuses = (currentStatus: string) => {
    const allowedTransitions = VALID_TRANSITIONS[currentStatus] || [];
    return AVAILABLE_STATUSES.filter(s => allowedTransitions.includes(s.value));
  };

  const getAvailableAuctionActions = (listing: AdminListing): AuctionAction[] => {
    if (listing.status !== "ACTIVE" || listing.listingType !== "OPEN_BIDDING") return [];
    
    const actions: AuctionAction[] = [];
    const current = listing.auctionStatus;
    
    // Always allow UPCOMING if not already
    if (current !== "UPCOMING") actions.push("UPCOMING");
    // Allow LIVE if not already LIVE
    if (current !== "LIVE") actions.push("LIVE");
    // Allow PAUSE if currently LIVE
    if (current === "LIVE") actions.push("PAUSED");
    // Allow CLOSE if LIVE or PAUSED
    if (current === "LIVE" || current === "PAUSED") actions.push("CLOSED");
    
    return actions;
  };

  const isAllSelected = listings.length > 0 && selectedListings.size === listings.length;

  const handleSelectAll = (checked: boolean) => {
    setSelectedListings(checked ? new Set(listings.map(l => l.id)) : new Set());
  };

  const handleSelectOne = (id: string, checked: boolean) => {
    setSelectedListings(prev => {
      const next = new Set(prev);
      if (checked) {
        next.add(id);
      } else {
        next.delete(id);
      }
      return next;
    });
  };

  const selectedCount = selectedListings.size;

  // ============================================
  // RENDER
  // ============================================
  return (
    <div className="space-y-6 p-6 mt-12">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold tracking-tight">Listings Management</h1>
          <p className="text-muted-foreground mt-1">Manage and review land listings</p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" size="sm" onClick={fetchListings} disabled={loading}>
            <RefreshCw className={`h-4 w-4 mr-2 ${loading ? "animate-spin" : ""}`} />
            Refresh
          </Button>
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      {stats && (
        <div className="grid gap-4 md:grid-cols-6">
          <StatsCard label="Total Listings" value={stats.total} />
          <StatsCard label="Active" value={stats.byStatus?.ACTIVE || 0} color="text-green-600" />
          <StatsCard label="Pending" value={stats.byStatus?.PENDING_APPROVAL || 0} color="text-amber-600" />
          <StatsCard label="Live Auctions" value={stats.liveAuctions || 0} color="text-purple-600" />
          <StatsCard label="Active Bids" value={stats.activeBids || 0} color="text-blue-600" />
          <StatsCard label="Total Value" value={`₹${((stats.totalValue || 0) / 100000).toFixed(1)}L`} />
        </div>
      )}

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex-1 min-w-[200px]">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search listings..."
                  value={filters.search}
                  onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                  className="pl-9"
                  onKeyDown={(e) => e.key === "Enter" && fetchListings()}
                />
              </div>
            </div>
            
            <Select value={filters.status} onValueChange={(value) => setFilters({ ...filters, status: value })}>
              <SelectTrigger className="w-[140px]">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                {STATUS_OPTIONS.map((option) => (
                  <SelectItem key={option.value} value={option.value}>{option.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            
            <Select value={filters.type} onValueChange={(value) => setFilters({ ...filters, type: value })}>
              <SelectTrigger className="w-[140px]">
                <SelectValue placeholder="Type" />
              </SelectTrigger>
              <SelectContent>
                {LISTING_TYPE_OPTIONS.map((option) => (
                  <SelectItem key={option.value} value={option.value}>{option.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={filters.sortBy} onValueChange={(value) => setFilters({ ...filters, sortBy: value })}>
              <SelectTrigger className="w-[130px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {SORT_OPTIONS.map((option) => (
                  <SelectItem key={option.value} value={option.value}>{option.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Button
              variant="ghost"
              size="icon"
              onClick={() => setFilters({ ...filters, sortOrder: filters.sortOrder === "asc" ? "desc" : "asc" })}
            >
              {filters.sortOrder === "asc" ? "↑" : "↓"}
            </Button>
            
            <Button variant="outline" onClick={fetchListings}>
              <Filter className="h-4 w-4 mr-2" />
              Filter
            </Button>
            
            {selectedCount > 0 && (
              <div className="flex items-center gap-2 ml-auto">
                <span className="text-sm text-muted-foreground">{selectedCount} selected</span>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => handleBulkAction("approve")}
                  className="border-green-500 text-green-600 hover:bg-green-50"
                >
                  <CheckCircle className="h-4 w-4 mr-1" />
                  Approve
                </Button>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => handleBulkAction("reject")}
                  className="border-red-500 text-red-600 hover:bg-red-50"
                >
                  <XCircle className="h-4 w-4 mr-1" />
                  Reject
                </Button>
                <Button variant="outline" size="sm" onClick={() => openDialog("bulkStatus")}>
                  <Edit className="h-4 w-4 mr-1" />
                  Status
                </Button>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Listings Table */}
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/50">
                <TableHead className="w-12">
                  <Checkbox checked={isAllSelected} onCheckedChange={handleSelectAll} />
                </TableHead>
                <TableHead>Listing</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Owner</TableHead>
                <TableHead>Location</TableHead>
                <TableHead>Price</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Auction</TableHead>
                <TableHead>Stats</TableHead>
                <TableHead>Listed</TableHead>
                <TableHead className="w-12"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <LoadingSkeleton />
              ) : listings.length === 0 ? (
                <EmptyState />
              ) : (
                listings.map((listing) => (
                  <ListingRow
                    key={listing.id}
                    listing={listing}
                    selected={selectedListings.has(listing.id)}
                    onSelect={handleSelectOne}
                    onView={() => router.push(`/admin/listings/${listing.id}`)}
                    onApprove={() => {
                      setSelectedListing(listing);
                      setReviewAction("APPROVE");
                      openDialog("review", listing);
                    }}
                    onReject={() => {
                      setSelectedListing(listing);
                      setReviewAction("REJECT");
                      openDialog("review", listing);
                    }}
                    onClose={() => {
                      setSelectedListing(listing);
                      setNewStatus("CLOSED");
                      openDialog("status", listing);
                    }}
                    onChangeStatus={() => openDialog("status", listing)}
                    onAuctionAction={(action) => {
                      setSelectedListing(listing);
                      setAuctionAction(action);
                      openDialog("auction", listing);
                    }}
                    getStatusBadge={getStatusBadge}
                    getAuctionStatusBadge={getAuctionStatusBadge}
                    getListingTypeBadge={getListingTypeBadge}
                    getAvailableAuctionActions={getAvailableAuctionActions}
                  />
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Pagination */}
      {pagination.totalPages > 1 && (
        <PaginationControls 
          pagination={pagination} 
          onPageChange={(page) => setPagination({ ...pagination, page })}
          onLimitChange={(limit) => setPagination({ ...pagination, limit, page: 1 })}
        />
      )}

      {/* Dialogs */}
      <ReviewDialog
        open={dialogState.type === "review" && dialogState.open}
        onOpenChange={(open) => !open && resetDialogs()}
        selectedListing={selectedListing}
        reviewAction={reviewAction}
        reviewNotes={reviewNotes}
        setReviewNotes={setReviewNotes}
        onConfirm={handleReviewListing}
        loading={actionLoading}
      />

      <StatusChangeDialog
        open={dialogState.type === "status" && dialogState.open}
        onOpenChange={(open) => !open && resetDialogs()}
        selectedListing={selectedListing}
        newStatus={newStatus}
        setNewStatus={setNewStatus}
        statusChangeReason={statusChangeReason}
        setStatusChangeReason={setStatusChangeReason}
        onConfirm={handleStatusChange}
        getStatusBadge={getStatusBadge}
        getAvailableStatuses={getAvailableStatuses}
        loading={actionLoading}
      />

      <BulkStatusDialog
        open={dialogState.type === "bulkStatus" && dialogState.open}
        onOpenChange={(open) => !open && resetDialogs()}
        count={selectedCount}
        bulkNewStatus={bulkNewStatus}
        setBulkNewStatus={setBulkNewStatus}
        bulkStatusReason={bulkStatusReason}
        setBulkStatusReason={setBulkStatusReason}
        onConfirm={handleBulkStatusChange}
        loading={actionLoading}
      />

      <AuctionStatusDialog
        open={dialogState.type === "auction" && dialogState.open}
        onOpenChange={(open) => !open && resetDialogs()}
        selectedListing={selectedListing}
        auctionAction={auctionAction}
        auctionReason={auctionReason}
        setAuctionReason={setAuctionReason}
        onConfirm={handleAuctionStatusChange}
        getAuctionStatusBadge={getAuctionStatusBadge}
        loading={actionLoading}
      />
    </div>
  );
}

// ============================================
// SUB-COMPONENTS
// ============================================

function StatsCard({ label, value, color = "text-foreground" }: { label: string; value: string | number; color?: string }) {
  return (
    <Card>
      <CardContent className="p-4">
        <p className="text-sm text-muted-foreground">{label}</p>
        <p className={`text-2xl font-bold ${color}`}>{value}</p>
      </CardContent>
    </Card>
  );
}

function LoadingSkeleton() {
  return Array.from({ length: 8 }).map((_, i) => (
    <TableRow key={i}>
      <TableCell colSpan={11}>
        <Skeleton className="h-12 w-full" />
      </TableCell>
    </TableRow>
  ));
}

function EmptyState() {
  return (
    <TableRow>
      <TableCell colSpan={11} className="text-center py-12">
        <div className="flex flex-col items-center gap-2">
          <Home className="h-12 w-12 text-muted-foreground/50" />
          <p className="text-muted-foreground">No listings found</p>
          <p className="text-sm text-muted-foreground/70">Try adjusting your filters</p>
        </div>
      </TableCell>
    </TableRow>
  );
}

interface ListingRowProps {
  listing: AdminListing;
  selected: boolean;
  onSelect: (id: string, checked: boolean) => void;
  onView: () => void;
  onApprove: () => void;
  onReject: () => void;
  onClose: () => void;
  onChangeStatus: () => void;
  onAuctionAction: (action: AuctionAction) => void;
  getStatusBadge: (status: string) => React.ReactNode;
  getAuctionStatusBadge: (status?: string) => React.ReactNode;
  getListingTypeBadge: (type: string) => React.ReactNode;
  getAvailableAuctionActions: (listing: AdminListing) => AuctionAction[];
}

function ListingRow({
  listing,
  selected,
  onSelect,
  onView,
  onApprove,
  onReject,
  onClose,
  onChangeStatus,
  onAuctionAction,
  getStatusBadge,
  getAuctionStatusBadge,
  getListingTypeBadge,
  getAvailableAuctionActions,
}: ListingRowProps) {
  const auctionActions = getAvailableAuctionActions(listing);
  const hasAuctionActions = auctionActions.length > 0;
  const hasStatusActions = listing.status === "PENDING_APPROVAL" || listing.status === "ACTIVE";
  
  return (
    <TableRow className="hover:bg-muted/50">
      <TableCell>
        <Checkbox checked={selected} onCheckedChange={(c) => onSelect(listing.id, !!c)} />
      </TableCell>
      <TableCell>
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-lg bg-muted flex items-center justify-center">
            <Home className="h-5 w-5 text-muted-foreground" />
          </div>
          <div>
            <p className="font-medium truncate max-w-[200px]">{listing.title}</p>
            <p className="text-xs text-muted-foreground">
              {listing.land?.size} acres • {listing.land?.landType}
            </p>
          </div>
        </div>
      </TableCell>
      <TableCell>{getListingTypeBadge(listing.listingType)}</TableCell>
      <TableCell>
        <p className="text-sm truncate max-w-[120px]">{listing.owner?.name || "N/A"}</p>
        <p className="text-xs text-muted-foreground truncate max-w-[120px]">{listing.owner?.email || ""}</p>
      </TableCell>
      <TableCell>
        <div className="flex items-center gap-1">
          <MapPin className="h-3 w-3 text-muted-foreground shrink-0" />
          <span className="text-sm truncate max-w-[120px]">
            {[listing.land?.village, listing.land?.district].filter(Boolean).join(", ") || "N/A"}
          </span>
        </div>
      </TableCell>
      <TableCell>
        <div className="flex items-center gap-1">
          <IndianRupee className="h-3 w-3 text-muted-foreground shrink-0" />
          <span className="text-sm font-medium">
            ₹{listing.basePrice?.toLocaleString()}/acre
          </span>
        </div>
      </TableCell>
      <TableCell>{getStatusBadge(listing.status)}</TableCell>
      <TableCell>{getAuctionStatusBadge(listing.auctionStatus)}</TableCell>
      <TableCell>
        <div className="flex items-center gap-1.5">
          <Badge variant="outline" className="text-xs px-1.5">
            {listing._count?.bids || 0}
          </Badge>
          <Badge variant="outline" className="text-xs px-1.5">
            {listing._count?.applications || 0}
          </Badge>
        </div>
      </TableCell>
      <TableCell>
        <p className="text-sm whitespace-nowrap">
          {formatDistanceToNow(new Date(listing.createdAt), { addSuffix: true })}
        </p>
      </TableCell>
      <TableCell>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <MoreVertical className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuItem onClick={onView}>
              <Eye className="h-4 w-4 mr-2" />
              View Details
            </DropdownMenuItem>
            
            {hasAuctionActions && (
              <>
                <DropdownMenuSeparator />
                <DropdownMenuLabel className="text-xs text-muted-foreground">Auction Actions</DropdownMenuLabel>
                {auctionActions.map((action) => {
                  const config = AUCTION_ACTION_CONFIG[action];
                  const Icon = config.icon;
                  return (
                    <DropdownMenuItem key={action} onClick={() => onAuctionAction(action)}>
                      <Icon className={`h-4 w-4 mr-2 ${config.color}`} />
                      {config.title}
                    </DropdownMenuItem>
                  );
                })}
              </>
            )}
            
            {hasStatusActions && (
              <>
                <DropdownMenuSeparator />
                <DropdownMenuLabel className="text-xs text-muted-foreground">Status Actions</DropdownMenuLabel>
                {listing.status === "PENDING_APPROVAL" && (
                  <>
                    <DropdownMenuItem onClick={onApprove}>
                      <CheckCircle className="h-4 w-4 mr-2 text-green-600" />
                      Approve & Publish
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={onReject}>
                      <XCircle className="h-4 w-4 mr-2 text-red-600" />
                      Reject
                    </DropdownMenuItem>
                  </>
                )}
                {listing.status === "ACTIVE" && (
                  <DropdownMenuItem onClick={onClose}>
                    <Archive className="h-4 w-4 mr-2" />
                    Close Listing
                  </DropdownMenuItem>
                )}
              </>
            )}
            
            <DropdownMenuItem onClick={onChangeStatus}>
              <Edit className="h-4 w-4 mr-2" />
              Change Status
            </DropdownMenuItem>
            
            <DropdownMenuSeparator />
            
            <DropdownMenuItem onClick={() => toast.info("Report feature coming soon")}>
              <Flag className="h-4 w-4 mr-2" />
              Report
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => toast.info("Feature feature coming soon")}>
              <Star className="h-4 w-4 mr-2" />
              Feature
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </TableCell>
    </TableRow>
  );
}

function PaginationControls({ 
  pagination, 
  onPageChange,
  onLimitChange,
}: { 
  pagination: PaginationState; 
  onPageChange: (page: number) => void;
  onLimitChange: (limit: number) => void;
}) {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-2">
        <p className="text-sm text-muted-foreground">
          Showing {((pagination.page - 1) * pagination.limit) + 1} to{" "}
          {Math.min(pagination.page * pagination.limit, pagination.total)} of {pagination.total}
        </p>
        <Select value={pagination.limit.toString()} onValueChange={(v) => onLimitChange(parseInt(v))}>
          <SelectTrigger className="w-[70px] h-8">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {ITEMS_PER_PAGE_OPTIONS.map((opt) => (
              <SelectItem key={opt} value={opt.toString()}>{opt}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div className="flex items-center gap-1">
        <Button
          variant="outline"
          size="icon"
          className="h-8 w-8"
          disabled={!pagination.hasPrev}
          onClick={() => onPageChange(pagination.page - 1)}
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>
        <span className="text-sm px-2">
          Page {pagination.page} of {pagination.totalPages}
        </span>
        <Button
          variant="outline"
          size="icon"
          className="h-8 w-8"
          disabled={!pagination.hasNext}
          onClick={() => onPageChange(pagination.page + 1)}
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}

// ============================================
// DIALOG COMPONENTS
// ============================================

interface DialogBaseProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  loading?: boolean;
}

interface ReviewDialogProps extends DialogBaseProps {
  selectedListing: AdminListing | null;
  reviewAction: ReviewAction;
  reviewNotes: string;
  setReviewNotes: (notes: string) => void;
  onConfirm: () => Promise<void>;
}

function ReviewDialog({ 
  open, onOpenChange, selectedListing, reviewAction, reviewNotes, setReviewNotes, onConfirm, loading 
}: ReviewDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {reviewAction === "APPROVE" ? "Approve & Publish Listing" : "Reject Listing"}
          </DialogTitle>
          <DialogDescription>
            {reviewAction === "APPROVE"
              ? "This listing will be published. You can manage auction status from the actions menu."
              : "This listing will be rejected and hidden from farmers."}
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <div className="p-4 bg-muted rounded-lg">
            <p className="font-medium">{selectedListing?.title}</p>
            <p className="text-sm text-muted-foreground">
              {selectedListing?.land?.size} acres • {selectedListing?.land?.village}, {selectedListing?.land?.district}
            </p>
            <p className="text-sm text-muted-foreground mt-1">
              Base: ₹{selectedListing?.basePrice?.toLocaleString()}/acre
            </p>
          </div>
          <div className="space-y-2">
            <Label>Notes (Optional)</Label>
            <Textarea
              placeholder="Add any notes..."
              value={reviewNotes}
              onChange={(e) => setReviewNotes(e.target.value)}
              rows={3}
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={loading}>
            Cancel
          </Button>
          <Button 
            variant={reviewAction === "APPROVE" ? "default" : "destructive"} 
            onClick={onConfirm}
            disabled={loading}
          >
            {loading && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
            {reviewAction === "APPROVE" ? "Approve & Publish" : "Reject Listing"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

interface StatusChangeDialogProps extends DialogBaseProps {
  selectedListing: AdminListing | null;
  newStatus: string;
  setNewStatus: (status: string) => void;
  statusChangeReason: string;
  setStatusChangeReason: (reason: string) => void;
  onConfirm: () => Promise<void>;
  getStatusBadge: (status: string) => React.ReactNode;
  getAvailableStatuses: (currentStatus: string) => typeof AVAILABLE_STATUSES[number][];
}

function StatusChangeDialog({
  open, onOpenChange, selectedListing, newStatus, setNewStatus,
  statusChangeReason, setStatusChangeReason, onConfirm, getStatusBadge,
  getAvailableStatuses, loading,
}: StatusChangeDialogProps) {
  const availableStatuses = useMemo(() => 
    selectedListing ? getAvailableStatuses(selectedListing.status) : [], 
    [selectedListing, getAvailableStatuses]
  );
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Change Listing Status</DialogTitle>
          <DialogDescription>
            Update status for &quot;{selectedListing?.title}&quot;
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <div className="p-4 bg-muted rounded-lg">
            <p className="text-sm text-muted-foreground">Current:</p>
            <div className="mt-1">{selectedListing && getStatusBadge(selectedListing.status)}</div>
            {selectedListing?.status === "ACTIVE" && (
              <p className="text-xs text-amber-600 mt-2 flex items-center gap-1">
                <AlertCircle className="h-3 w-3" />
                Note: Changing listing status does NOT affect auction status.
              </p>
            )}
          </div>
          <div className="space-y-2">
            <Label>New Status</Label>
            <Select value={newStatus} onValueChange={setNewStatus}>
              <SelectTrigger>
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                {availableStatuses.map((status) => (
                  <SelectItem key={status.value} value={status.value}>
                    <div className="flex items-center gap-2">
                      <status.icon className="h-4 w-4" />
                      <span>{status.label}</span>
                      <span className="text-xs text-muted-foreground ml-2">({status.description})</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {availableStatuses.length === 0 && (
              <p className="text-sm text-amber-600">No valid transitions available</p>
            )}
          </div>
          <div className="space-y-2">
            <Label>Reason (Optional)</Label>
            <Textarea
              placeholder="Why are you changing the status?"
              value={statusChangeReason}
              onChange={(e) => setStatusChangeReason(e.target.value)}
              rows={2}
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={loading}>
            Cancel
          </Button>
          <Button onClick={onConfirm} disabled={!newStatus || loading}>
            {loading && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
            Update Status
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

interface BulkStatusDialogProps extends DialogBaseProps {
  count: number;
  bulkNewStatus: string;
  setBulkNewStatus: (status: string) => void;
  bulkStatusReason: string;
  setBulkStatusReason: (reason: string) => void;
  onConfirm: () => Promise<void>;
}

function BulkStatusDialog({
  open, onOpenChange, count, bulkNewStatus, setBulkNewStatus,
  bulkStatusReason, setBulkStatusReason, onConfirm, loading,
}: BulkStatusDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Bulk Status Change</DialogTitle>
          <DialogDescription>
            Change status for {count} selected listings. Only valid transitions will be applied.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label>New Status</Label>
            <Select value={bulkNewStatus} onValueChange={setBulkNewStatus}>
              <SelectTrigger>
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                {AVAILABLE_STATUSES.map((status) => (
                  <SelectItem key={status.value} value={status.value}>
                    <div className="flex items-center gap-2">
                      <status.icon className="h-4 w-4" />
                      <span>{status.label}</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>Reason (Optional)</Label>
            <Textarea
              placeholder="Why are you changing these statuses?"
              value={bulkStatusReason}
              onChange={(e) => setBulkStatusReason(e.target.value)}
              rows={2}
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={loading}>
            Cancel
          </Button>
          <Button onClick={onConfirm} disabled={!bulkNewStatus || loading}>
            {loading && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
            Update {count} Listings
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

interface AuctionStatusDialogProps extends DialogBaseProps {
  selectedListing: AdminListing | null;
  auctionAction: AuctionAction;
  auctionReason: string;
  setAuctionReason: (reason: string) => void;
  onConfirm: () => Promise<void>;
  getAuctionStatusBadge: (status?: string) => React.ReactNode;
}

function AuctionStatusDialog({
  open, onOpenChange, selectedListing, auctionAction, auctionReason,
  setAuctionReason, onConfirm, getAuctionStatusBadge, loading,
}: AuctionStatusDialogProps) {
  const config = AUCTION_ACTION_CONFIG[auctionAction];
  const Icon = config.icon;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Icon className={`h-5 w-5 ${config.color}`} />
            {config.title}
          </DialogTitle>
          <DialogDescription>{config.description}</DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <div className="p-4 bg-muted rounded-lg">
            <p className="font-medium">{selectedListing?.title}</p>
            <div className="flex items-center gap-2 mt-1">
              <p className="text-sm text-muted-foreground">Current:</p>
              {getAuctionStatusBadge(selectedListing?.auctionStatus)}
            </div>
            <p className="text-sm text-muted-foreground mt-1">
              Base: ₹{selectedListing?.basePrice?.toLocaleString()}/acre
            </p>
          </div>
          <div className="space-y-2">
            <Label>Reason (Optional)</Label>
            <Textarea
              placeholder={`Why ${auctionAction.toLowerCase()} this auction?`}
              value={auctionReason}
              onChange={(e) => setAuctionReason(e.target.value)}
              rows={2}
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={loading}>
            Cancel
          </Button>
          <Button variant={config.variant} onClick={onConfirm} disabled={loading}>
            {loading && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
            {config.title}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}