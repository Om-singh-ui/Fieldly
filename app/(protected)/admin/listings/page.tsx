// app/(protected)/admin/listings/page.tsx
"use client";

import { useEffect, useState, useCallback } from "react";
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
} from "lucide-react";
import { toast } from "sonner";
import { format } from "date-fns";

// Local type definitions (or import from @/types/admin.types)
interface AdminListing {
  id: string;
  title: string;
  description?: string;
  listingType: string;
  status: string;
  basePrice: number;
  reservePrice?: number | null;
  buyNowPrice?: number | null;
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

interface PaginationState {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
}

const STATUS_OPTIONS = [
  { value: "all", label: "All Status" },
  { value: "DRAFT", label: "Draft" },
  { value: "ACTIVE", label: "Active" },
  { value: "PENDING_APPROVAL", label: "Pending Approval" },
  { value: "CLOSED", label: "Closed" },
  { value: "CANCELLED", label: "Cancelled" },
  { value: "EXPIRED", label: "Expired" },
];

const LISTING_TYPE_OPTIONS = [
  { value: "all", label: "All Types" },
  { value: "OPEN_BIDDING", label: "Open Bidding" },
  { value: "FIXED_PRICE", label: "Fixed Price" },
  { value: "NEGOTIABLE", label: "Negotiable" },
];

interface ListingStats {
  total: number;
  byStatus: Record<string, number>;
  totalValue: number;
}

interface ListingsFilters {
  search: string;
  status: string;
  type: string;
  sortBy: string;
  sortOrder: string;
}

export default function AdminListingsPage() {
  const router = useRouter();
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
  const [selectedListings, setSelectedListings] = useState<string[]>([]);
  const [showReviewDialog, setShowReviewDialog] = useState(false);
  const [selectedListing, setSelectedListing] = useState<AdminListing | null>(null);
  const [reviewAction, setReviewAction] = useState<"APPROVE" | "REJECT">("APPROVE");
  const [reviewNotes, setReviewNotes] = useState("");

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

      setListings(data.listings || []);
      setStats(data.stats);
      setPagination({
        ...data.pagination,
        hasNext: data.pagination.page < data.pagination.totalPages,
        hasPrev: data.pagination.page > 1,
      });
    } catch {
      toast.error("Failed to load listings");
    } finally {
      setLoading(false);
    }
  }, [filters, pagination.page, pagination.limit]);

  useEffect(() => {
    fetchListings();
  }, [fetchListings]);

  async function handleReviewListing() {
    if (!selectedListing) return;

    try {
      const res = await fetch("/api/admin/listings", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          listingId: selectedListing.id,
          status: reviewAction === "APPROVE" ? "ACTIVE" : "REJECTED",
          reason: reviewNotes,
        }),
      });

      if (res.ok) {
        toast.success(`Listing ${reviewAction === "APPROVE" ? "approved" : "rejected"} successfully`);
        setShowReviewDialog(false);
        setSelectedListing(null);
        setReviewNotes("");
        fetchListings();
      }
    } catch {
      toast.error("Failed to review listing");
    }
  }

  async function handleBulkAction(action: string) {
    if (selectedListings.length === 0) return;

    try {
      const res = await fetch("/api/admin/listings/bulk", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          listingIds: selectedListings,
          action,
        }),
      });

      if (res.ok) {
        toast.success(`Successfully ${action}ed ${selectedListings.length} listings`);
        setSelectedListings([]);
        fetchListings();
      }
    } catch {
      toast.error("Failed to perform bulk action");
    }
  }

  const getStatusBadge = (status: string) => {
    const config: Record<string, { variant: "default" | "secondary" | "destructive" | "outline"; label: string; icon: React.ElementType }> = {
      DRAFT: { variant: "secondary", label: "Draft", icon: FileText },
      ACTIVE: { variant: "default", label: "Active", icon: CheckCircle },
      PENDING_APPROVAL: { variant: "outline", label: "Pending", icon: Clock },
      CLOSED: { variant: "secondary", label: "Closed", icon: XCircle },
      CANCELLED: { variant: "destructive", label: "Cancelled", icon: XCircle },
      EXPIRED: { variant: "secondary", label: "Expired", icon: Calendar },
    };

    const statusConfig = config[status] || { variant: "outline" as const, label: status, icon: FileText };
    const Icon = statusConfig.icon;

    return (
      <Badge variant={statusConfig.variant} className="gap-1">
        <Icon className="h-3 w-3" />
        {statusConfig.label}
      </Badge>
    );
  };

  const getListingTypeBadge = (type: string) => {
    const config: Record<string, { label: string; color: string }> = {
      OPEN_BIDDING: { label: "Bidding", color: "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400" },
      FIXED_PRICE: { label: "Fixed", color: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400" },
      NEGOTIABLE: { label: "Negotiable", color: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400" },
    };

    return config[type] || { label: type, color: "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300" };
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold">Listings</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">Manage and review land listings</p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      {/* Stats */}
      {stats && (
        <div className="grid gap-4 md:grid-cols-5">
          <Card>
            <CardContent className="p-4">
              <p className="text-sm text-gray-500 dark:text-gray-400">Total Listings</p>
              <p className="text-2xl font-bold">{stats.total}</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <p className="text-sm text-gray-500 dark:text-gray-400">Active</p>
              <p className="text-2xl font-bold text-green-600">{stats.byStatus?.ACTIVE || 0}</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <p className="text-sm text-gray-500 dark:text-gray-400">Pending Approval</p>
              <p className="text-2xl font-bold text-amber-600">{stats.byStatus?.PENDING_APPROVAL || 0}</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <p className="text-sm text-gray-500 dark:text-gray-400">Closed</p>
              <p className="text-2xl font-bold">{stats.byStatus?.CLOSED || 0}</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <p className="text-sm text-gray-500 dark:text-gray-400">Total Value</p>
              <p className="text-2xl font-bold">₹{((stats.totalValue || 0) / 100000).toFixed(1)}L</p>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex-1 min-w-[200px]">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search listings..."
                  value={filters.search}
                  onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                  className="pl-9"
                />
              </div>
            </div>
            <Select
              value={filters.status}
              onValueChange={(value) => setFilters({ ...filters, status: value })}
            >
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                {STATUS_OPTIONS.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select
              value={filters.type}
              onValueChange={(value) => setFilters({ ...filters, type: value })}
            >
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="Type" />
              </SelectTrigger>
              <SelectContent>
                {LISTING_TYPE_OPTIONS.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button variant="outline" onClick={fetchListings}>
              <Filter className="h-4 w-4 mr-2" />
              Filter
            </Button>
            {selectedListings.length > 0 && (
              <>
                <Button variant="outline" onClick={() => handleBulkAction("approve")}>
                  <CheckCircle className="h-4 w-4 mr-2 text-green-600" />
                  Approve ({selectedListings.length})
                </Button>
                <Button variant="outline" onClick={() => handleBulkAction("reject")}>
                  <XCircle className="h-4 w-4 mr-2 text-red-600" />
                  Reject ({selectedListings.length})
                </Button>
              </>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Listings Table */}
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-12">
                  <Checkbox
                    checked={selectedListings.length === listings.length && listings.length > 0}
                    onCheckedChange={(checked) => {
                      if (checked) {
                        setSelectedListings(listings.map((l) => l.id));
                      } else {
                        setSelectedListings([]);
                      }
                    }}
                  />
                </TableHead>
                <TableHead>Listing</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Owner</TableHead>
                <TableHead>Location</TableHead>
                <TableHead>Price</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Applications</TableHead>
                <TableHead>Listed</TableHead>
                <TableHead className="w-12"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                Array.from({ length: 10 }).map((_, i) => (
                  <TableRow key={i}>
                    <TableCell colSpan={10}>
                      <div className="h-12 bg-gray-100 dark:bg-gray-800 animate-pulse rounded" />
                    </TableCell>
                  </TableRow>
                ))
              ) : listings.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={10} className="text-center py-8 text-gray-500">
                    No listings found
                  </TableCell>
                </TableRow>
              ) : (
                listings.map((listing) => {
                  const typeBadge = getListingTypeBadge(listing.listingType);
                  return (
                    <TableRow key={listing.id}>
                      <TableCell>
                        <Checkbox
                          checked={selectedListings.includes(listing.id)}
                          onCheckedChange={(checked) => {
                            if (checked) {
                              setSelectedListings([...selectedListings, listing.id]);
                            } else {
                              setSelectedListings(selectedListings.filter((id) => id !== listing.id));
                            }
                          }}
                        />
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <div className="h-10 w-10 rounded-lg bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
                            <Home className="h-5 w-5 text-gray-500" />
                          </div>
                          <div>
                            <p className="font-medium">{listing.title}</p>
                            <p className="text-xs text-gray-500">
                              {listing.land?.size} acres • {listing.land?.landType}
                            </p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge className={typeBadge.color}>{typeBadge.label}</Badge>
                      </TableCell>
                      <TableCell>
                        <p className="text-sm">{listing.owner?.name}</p>
                        <p className="text-xs text-gray-500">{listing.owner?.email}</p>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <MapPin className="h-3 w-3 text-gray-400" />
                          <span className="text-sm">{listing.land?.village}, {listing.land?.district}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <IndianRupee className="h-3 w-3 text-gray-400" />
                          <span className="text-sm font-medium">
                            ₹{listing.basePrice?.toLocaleString()}/acre
                          </span>
                        </div>
                        {listing.reservePrice && (
                          <p className="text-xs text-gray-500">
                            Reserve: ₹{listing.reservePrice.toLocaleString()}
                          </p>
                        )}
                        {listing.buyNowPrice && (
                          <p className="text-xs text-gray-500">
                            Buy Now: ₹{listing.buyNowPrice.toLocaleString()}
                          </p>
                        )}
                      </TableCell>
                      <TableCell>{getStatusBadge(listing.status)}</TableCell>
                      <TableCell>
                        <Badge variant="outline">{listing._count?.applications || 0}</Badge>
                      </TableCell>
                      <TableCell>
                        <p className="text-sm">{format(new Date(listing.createdAt), "MMM d, yyyy")}</p>
                      </TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <MoreVertical className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                            <DropdownMenuItem onClick={() => router.push(`/admin/listings/${listing.id}`)}>
                              <Eye className="h-4 w-4 mr-2" />
                              View Details
                            </DropdownMenuItem>
                            {listing.status === "PENDING_APPROVAL" && (
                              <>
                                <DropdownMenuItem
                                  onClick={() => {
                                    setSelectedListing(listing);
                                    setReviewAction("APPROVE");
                                    setShowReviewDialog(true);
                                  }}
                                >
                                  <CheckCircle className="h-4 w-4 mr-2 text-green-600" />
                                  Approve
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                  onClick={() => {
                                    setSelectedListing(listing);
                                    setReviewAction("REJECT");
                                    setShowReviewDialog(true);
                                  }}
                                >
                                  <XCircle className="h-4 w-4 mr-2 text-red-600" />
                                  Reject
                                </DropdownMenuItem>
                              </>
                            )}
                            <DropdownMenuSeparator />
                            <DropdownMenuItem>
                              <Flag className="h-4 w-4 mr-2" />
                              Report
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Star className="h-4 w-4 mr-2" />
                              Feature
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Pagination */}
      {pagination.totalPages > 1 && (
        <div className="flex items-center justify-between">
          <p className="text-sm text-gray-500">
            Showing {((pagination.page - 1) * pagination.limit) + 1} to{" "}
            {Math.min(pagination.page * pagination.limit, pagination.total)} of {pagination.total} listings
          </p>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="icon"
              disabled={!pagination.hasPrev}
              onClick={() => setPagination({ ...pagination, page: pagination.page - 1 })}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <span className="text-sm">
              Page {pagination.page} of {pagination.totalPages}
            </span>
            <Button
              variant="outline"
              size="icon"
              disabled={!pagination.hasNext}
              onClick={() => setPagination({ ...pagination, page: pagination.page + 1 })}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}

      {/* Review Dialog */}
      <Dialog open={showReviewDialog} onOpenChange={setShowReviewDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {reviewAction === "APPROVE" ? "Approve" : "Reject"} Listing
            </DialogTitle>
            <DialogDescription>
              {reviewAction === "APPROVE"
                ? "This listing will be published and visible to farmers."
                : "This listing will be rejected and hidden from farmers."}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <p className="font-medium">{selectedListing?.title}</p>
              <p className="text-sm text-gray-500">{selectedListing?.land?.size} acres • {selectedListing?.land?.village}</p>
            </div>
            <div className="space-y-2">
              <Label>Review Notes (Optional)</Label>
              <Textarea
                placeholder="Add any notes about this decision..."
                value={reviewNotes}
                onChange={(e) => setReviewNotes(e.target.value)}
                rows={3}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowReviewDialog(false)}>
              Cancel
            </Button>
            <Button
              variant={reviewAction === "APPROVE" ? "default" : "destructive"}
              onClick={handleReviewListing}
            >
              {reviewAction === "APPROVE" ? "Approve Listing" : "Reject Listing"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}