// app/(protected)/admin/applications/page.tsx
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
  MapPin,
  IndianRupee,
  Calendar,
  Clock,
  FileText,
  Ban,
  RefreshCw,
  Loader2,
  AlertCircle,
  User,
  Home,
  Award,
} from "lucide-react";
import { toast } from "sonner";
import { formatDistanceToNow } from "date-fns";
import Link from "next/link";

// ============================================
// TYPE DEFINITIONS
// ============================================
interface AdminApplication {
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

interface PaginationState {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
}

interface ApplicationStats {
  total: number;
  byStatus: Record<string, number>;
  totalValue: number;
  pendingReview: number;
  approvedToday: number;
  avgResponseTime: number;
}

interface ApplicationsFilters {
  search: string;
  status: string;
  sortBy: string;
  sortOrder: "asc" | "desc";
}

type ReviewAction = "APPROVE" | "REJECT";

// ============================================
// CONSTANTS
// ============================================
const ITEMS_PER_PAGE_OPTIONS = [10, 20, 50, 100];

const STATUS_OPTIONS = [
  { value: "all", label: "All Status" },
  { value: "PENDING", label: "Pending" },
  { value: "UNDER_REVIEW", label: "Under Review" },
  { value: "APPROVED", label: "Approved" },
  { value: "REJECTED", label: "Rejected" },
  { value: "WITHDRAWN", label: "Withdrawn" },
  { value: "EXPIRED", label: "Expired" },
] as const;

const SORT_OPTIONS = [
  { value: "createdAt", label: "Date Applied" },
  { value: "proposedRent", label: "Proposed Rent" },
  { value: "duration", label: "Duration" },
  { value: "status", label: "Status" },
] as const;

const STATUS_BADGE_CONFIG: Record<string, { variant: "default" | "secondary" | "destructive" | "outline"; label: string; icon: React.ElementType }> = {
  PENDING: { variant: "secondary", label: "Pending", icon: Clock },
  UNDER_REVIEW: { variant: "outline", label: "Under Review", icon: AlertCircle },
  APPROVED: { variant: "default", label: "Approved", icon: CheckCircle },
  REJECTED: { variant: "destructive", label: "Rejected", icon: XCircle },
  WITHDRAWN: { variant: "outline", label: "Withdrawn", icon: Ban },
  EXPIRED: { variant: "secondary", label: "Expired", icon: Calendar },
};

// ============================================
// MAIN COMPONENT
// ============================================
export default function AdminApplicationsPage() {
  const router = useRouter();
  
  // State
  const [loading, setLoading] = useState(true);
  const [applications, setApplications] = useState<AdminApplication[]>([]);
  const [stats, setStats] = useState<ApplicationStats | null>(null);
  const [pagination, setPagination] = useState<PaginationState>({
    page: 1,
    limit: 20,
    total: 0,
    totalPages: 0,
    hasNext: false,
    hasPrev: false,
  });
  const [filters, setFilters] = useState<ApplicationsFilters>({
    search: "",
    status: "all",
    sortBy: "createdAt",
    sortOrder: "desc",
  });
  const [selectedApplications, setSelectedApplications] = useState<Set<string>>(new Set());
  
  // Dialog states
  const [dialogState, setDialogState] = useState<{
    type: "review" | "bulkReview" | "delete" | "view" | null;
    open: boolean;
  }>({ type: null, open: false });
  
  // Selected item state
  const [selectedApplication, setSelectedApplication] = useState<AdminApplication | null>(null);
  const [reviewAction, setReviewAction] = useState<ReviewAction>("APPROVE");
  const [reviewNotes, setReviewNotes] = useState("");
  
  // Action loading states
  const [actionLoading, setActionLoading] = useState(false);

  // ============================================
  // DATA FETCHING
  // ============================================
  const fetchApplications = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        page: pagination.page.toString(),
        limit: pagination.limit.toString(),
        ...(filters.search && { search: filters.search }),
        ...(filters.status !== "all" && { status: filters.status }),
        sortBy: filters.sortBy,
        sortOrder: filters.sortOrder,
        admin: "true",
      });

      const res = await fetch(`/api/admin/applications?${params}`);
      const data = await res.json();

      if (!res.ok) throw new Error(data.error || "Failed to fetch applications");

      setApplications(data.applications || []);
      setStats(data.stats);
      setPagination({
        ...data.pagination,
        hasNext: data.pagination.page < data.pagination.totalPages,
        hasPrev: data.pagination.page > 1,
      });
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to load applications");
    } finally {
      setLoading(false);
    }
  }, [filters, pagination.page, pagination.limit]);

  useEffect(() => {
    fetchApplications();
  }, [fetchApplications]);

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
      setSelectedApplications(new Set());
      await fetchApplications();
      return true;
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Action failed");
      return false;
    } finally {
      setActionLoading(false);
    }
  };

  async function handleReviewApplication() {
    if (!selectedApplication) return;
    await handleApiAction(
      `/api/applications/${selectedApplication.id}/review`,
      { status: reviewAction, reviewNotes },
      `Application ${reviewAction === "APPROVE" ? "approved" : "rejected"} successfully`
    );
  }

  async function handleBulkReview() {
    if (selectedApplications.size === 0) return;
    await handleApiAction(
      "/api/admin/applications/bulk-review",
      { applicationIds: Array.from(selectedApplications), action: reviewAction, notes: reviewNotes },
      `Successfully ${reviewAction === "APPROVE" ? "approved" : "rejected"} applications`
    );
  }

  async function handleBulkDelete() {
    if (selectedApplications.size === 0) return;
    await handleApiAction(
      "/api/admin/applications/bulk-delete",
      { applicationIds: Array.from(selectedApplications) },
      `Successfully deleted applications`,
      { method: "DELETE" }
    );
  }

  async function handleDeleteApplication() {
    if (!selectedApplication) return;
    await handleApiAction(
      `/api/applications/${selectedApplication.id}`,
      {},
      "Application deleted successfully",
      { method: "DELETE" }
    );
  }

  // ============================================
  // HELPER FUNCTIONS
  // ============================================
  const resetDialogs = () => {
    setDialogState({ type: null, open: false });
    setSelectedApplication(null);
    setReviewNotes("");
    setReviewAction("APPROVE");
  };

  const openDialog = (type: "review" | "bulkReview" | "delete" | "view", application?: AdminApplication) => {
    if (application) setSelectedApplication(application);
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

  const isAllSelected = applications.length > 0 && selectedApplications.size === applications.length;

  const handleSelectAll = (checked: boolean) => {
    setSelectedApplications(checked ? new Set(applications.map(a => a.id)) : new Set());
  };

  const handleSelectOne = (id: string, checked: boolean) => {
    setSelectedApplications(prev => {
      const next = new Set(prev);
      if (checked) {
        next.add(id);
      } else {
        next.delete(id);
      }
      return next;
    });
  };

  const selectedCount = selectedApplications.size;

  // ============================================
  // RENDER
  // ============================================
  return (
    <div className="space-y-6 p-6 mt-12">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold tracking-tight">Applications Management</h1>
          <p className="text-muted-foreground mt-1">Manage and review lease applications</p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" size="sm" onClick={fetchApplications} disabled={loading}>
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
          <StatsCard label="Total Applications" value={stats.total} />
          <StatsCard label="Pending Review" value={stats.pendingReview} color="text-amber-600" />
          <StatsCard label="Approved" value={stats.byStatus?.APPROVED || 0} color="text-green-600" />
          <StatsCard label="Rejected" value={stats.byStatus?.REJECTED || 0} color="text-red-600" />
          <StatsCard label="Approved Today" value={stats.approvedToday || 0} color="text-blue-600" />
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
                  placeholder="Search by land, farmer, or location..."
                  value={filters.search}
                  onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                  className="pl-9"
                  onKeyDown={(e) => e.key === "Enter" && fetchApplications()}
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

            <Select value={filters.sortBy} onValueChange={(value) => setFilters({ ...filters, sortBy: value })}>
              <SelectTrigger className="w-[140px]">
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
            
            <Button variant="outline" onClick={fetchApplications}>
              <Filter className="h-4 w-4 mr-2" />
              Filter
            </Button>
            
            {selectedCount > 0 && (
              <div className="flex items-center gap-2 ml-auto">
                <span className="text-sm text-muted-foreground">{selectedCount} selected</span>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => {
                    setReviewAction("APPROVE");
                    openDialog("bulkReview");
                  }}
                  className="border-green-500 text-green-600 hover:bg-green-50"
                >
                  <CheckCircle className="h-4 w-4 mr-1" />
                  Approve
                </Button>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => {
                    setReviewAction("REJECT");
                    openDialog("bulkReview");
                  }}
                  className="border-red-500 text-red-600 hover:bg-red-50"
                >
                  <XCircle className="h-4 w-4 mr-1" />
                  Reject
                </Button>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => openDialog("delete")}
                  className="border-red-500 text-red-600 hover:bg-red-50"
                >
                  <Ban className="h-4 w-4 mr-1" />
                  Delete
                </Button>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Applications Table */}
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/50">
                <TableHead className="w-12">
                  <Checkbox checked={isAllSelected} onCheckedChange={handleSelectAll} />
                </TableHead>
                <TableHead>Land</TableHead>
                <TableHead>Farmer</TableHead>
                <TableHead>Landowner</TableHead>
                <TableHead>Location</TableHead>
                <TableHead>Proposed Rent</TableHead>
                <TableHead>Duration</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Applied</TableHead>
                <TableHead className="w-12"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <LoadingSkeleton />
              ) : applications.length === 0 ? (
                <EmptyState />
              ) : (
                applications.map((application) => (
                  <ApplicationRow
                    key={application.id}
                    application={application}
                    selected={selectedApplications.has(application.id)}
                    onSelect={handleSelectOne}
                    onView={() => router.push(`/admin/applications/${application.id}`)}
                    onApprove={() => {
                      setSelectedApplication(application);
                      setReviewAction("APPROVE");
                      openDialog("review", application);
                    }}
                    onReject={() => {
                      setSelectedApplication(application);
                      setReviewAction("REJECT");
                      openDialog("review", application);
                    }}
                    onDelete={() => openDialog("delete", application)}
                    getStatusBadge={getStatusBadge}
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
        selectedApplication={selectedApplication}
        reviewAction={reviewAction}
        reviewNotes={reviewNotes}
        setReviewNotes={setReviewNotes}
        onConfirm={handleReviewApplication}
        loading={actionLoading}
      />

      <BulkReviewDialog
        open={dialogState.type === "bulkReview" && dialogState.open}
        onOpenChange={(open) => !open && resetDialogs()}
        count={selectedCount}
        reviewAction={reviewAction}
        reviewNotes={reviewNotes}
        setReviewNotes={setReviewNotes}
        onConfirm={handleBulkReview}
        loading={actionLoading}
      />

      <DeleteDialog
        open={dialogState.type === "delete" && dialogState.open}
        onOpenChange={(open) => !open && resetDialogs()}
        count={selectedApplication ? 1 : selectedCount}
        isBulk={!selectedApplication}
        onConfirm={selectedApplication ? handleDeleteApplication : handleBulkDelete}
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
      <TableCell colSpan={10}>
        <Skeleton className="h-12 w-full" />
      </TableCell>
    </TableRow>
  ));
}

function EmptyState() {
  return (
    <TableRow>
      <TableCell colSpan={10} className="text-center py-12">
        <div className="flex flex-col items-center gap-2">
          <FileText className="h-12 w-12 text-muted-foreground/50" />
          <p className="text-muted-foreground">No applications found</p>
          <p className="text-sm text-muted-foreground/70">Try adjusting your filters</p>
        </div>
      </TableCell>
    </TableRow>
  );
}

interface ApplicationRowProps {
  application: AdminApplication;
  selected: boolean;
  onSelect: (id: string, checked: boolean) => void;
  onView: () => void;
  onApprove: () => void;
  onReject: () => void;
  onDelete: () => void;
  getStatusBadge: (status: string) => React.ReactNode;
}

function ApplicationRow({
  application,
  selected,
  onSelect,
  onView,
  onApprove,
  onReject,
  onDelete,
  getStatusBadge,
}: ApplicationRowProps) {
  const canReview = application.status === "PENDING" || application.status === "UNDER_REVIEW";
  
  return (
    <TableRow className="hover:bg-muted/50">
      <TableCell>
        <Checkbox checked={selected} onCheckedChange={(c) => onSelect(application.id, !!c)} />
      </TableCell>
      <TableCell>
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-lg bg-muted flex items-center justify-center">
            <Home className="h-5 w-5 text-muted-foreground" />
          </div>
          <div>
            <p className="font-medium truncate max-w-[180px]">{application.land.title}</p>
            <p className="text-xs text-muted-foreground">
              {application.land.size} acres • {application.land.landType}
            </p>
          </div>
        </div>
      </TableCell>
      <TableCell>
        <div className="flex items-center gap-2">
          <div>
            <p className="text-sm truncate max-w-[120px]">{application.farmer.name}</p>
            <p className="text-xs text-muted-foreground truncate max-w-[120px]">{application.farmer.email}</p>
            {application.farmer.farmerProfile?.isVerified && (
              <Badge variant="outline" className="gap-1 mt-1 text-xs">
                <Award className="h-3 w-3" />
                Verified
              </Badge>
            )}
          </div>
        </div>
      </TableCell>
      <TableCell>
        <p className="text-sm truncate max-w-[120px]">{application.land.landowner.name}</p>
        <p className="text-xs text-muted-foreground truncate max-w-[120px]">{application.land.landowner.email}</p>
      </TableCell>
      <TableCell>
        <div className="flex items-center gap-1">
          <MapPin className="h-3 w-3 text-muted-foreground shrink-0" />
          <span className="text-sm truncate max-w-[100px]">
            {[application.land.village, application.land.district].filter(Boolean).join(", ") || "N/A"}
          </span>
        </div>
      </TableCell>
      <TableCell>
        {application.proposedRent ? (
          <div className="flex items-center gap-1">
            <IndianRupee className="h-3 w-3 text-muted-foreground shrink-0" />
            <span className="text-sm font-medium">
              ₹{application.proposedRent.toLocaleString()}/mo
            </span>
          </div>
        ) : (
          <span className="text-sm text-muted-foreground">Not specified</span>
        )}
      </TableCell>
      <TableCell>
        <span className="text-sm">{application.duration} months</span>
      </TableCell>
      <TableCell>{getStatusBadge(application.status)}</TableCell>
      <TableCell>
        <p className="text-sm whitespace-nowrap">
          {formatDistanceToNow(new Date(application.createdAt), { addSuffix: true })}
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
            
            {canReview && (
              <>
                <DropdownMenuSeparator />
                <DropdownMenuLabel className="text-xs text-muted-foreground">Review Actions</DropdownMenuLabel>
                <DropdownMenuItem onClick={onApprove}>
                  <CheckCircle className="h-4 w-4 mr-2 text-green-600" />
                  Approve Application
                </DropdownMenuItem>
                <DropdownMenuItem onClick={onReject}>
                  <XCircle className="h-4 w-4 mr-2 text-red-600" />
                  Reject Application
                </DropdownMenuItem>
              </>
            )}
            
            <DropdownMenuSeparator />
            
            <DropdownMenuItem asChild>
              <Link href={`/profile/${application.farmer.id}`}>
                <User className="h-4 w-4 mr-2" />
                View Farmer Profile
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href={`/profile/${application.land.landowner.id}`}>
                <User className="h-4 w-4 mr-2" />
                View Landowner Profile
              </Link>
            </DropdownMenuItem>
            
            <DropdownMenuSeparator />
            
            <DropdownMenuItem onClick={onDelete} className="text-red-600">
              <Ban className="h-4 w-4 mr-2" />
              Delete Application
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
  selectedApplication: AdminApplication | null;
  reviewAction: ReviewAction;
  reviewNotes: string;
  setReviewNotes: (notes: string) => void;
  onConfirm: () => Promise<void>;
}

function ReviewDialog({ 
  open, onOpenChange, selectedApplication, reviewAction, reviewNotes, setReviewNotes, onConfirm, loading 
}: ReviewDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>
            {reviewAction === "APPROVE" ? "Approve Application" : "Reject Application"}
          </DialogTitle>
          <DialogDescription>
            {reviewAction === "APPROVE"
              ? "This will create a lease and notify the farmer."
              : "This application will be rejected and the farmer will be notified."}
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <div className="p-4 bg-muted rounded-lg">
            <p className="font-medium">{selectedApplication?.land.title}</p>
            <div className="flex items-center gap-2 mt-1 text-sm text-muted-foreground">
              <span>{selectedApplication?.farmer.name}</span>
              <span>•</span>
              <span>{selectedApplication?.duration} months</span>
              {selectedApplication?.proposedRent && (
                <>
                  <span>•</span>
                  <span>₹{selectedApplication.proposedRent.toLocaleString()}/mo</span>
                </>
              )}
            </div>
          </div>
          <div className="space-y-2">
            <Label>{reviewAction === "APPROVE" ? "Notes (Optional)" : "Reason for Rejection"}</Label>
            <Textarea
              placeholder={reviewAction === "APPROVE" ? "Add any notes..." : "Explain why this application is being rejected..."}
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
            disabled={loading || (reviewAction === "REJECT" && !reviewNotes)}
          >
            {loading && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
            {reviewAction === "APPROVE" ? "Approve" : "Reject"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

interface BulkReviewDialogProps extends DialogBaseProps {
  count: number;
  reviewAction: ReviewAction;
  reviewNotes: string;
  setReviewNotes: (notes: string) => void;
  onConfirm: () => Promise<void>;
}

function BulkReviewDialog({
  open, onOpenChange, count, reviewAction, reviewNotes, setReviewNotes, onConfirm, loading,
}: BulkReviewDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            Bulk {reviewAction === "APPROVE" ? "Approve" : "Reject"} Applications
          </DialogTitle>
          <DialogDescription>
            This will {reviewAction === "APPROVE" ? "approve" : "reject"} {count} selected applications.
            {reviewAction === "APPROVE" && " Leases will be created for each approved application."}
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label>{reviewAction === "APPROVE" ? "Notes (Optional)" : "Reason for Rejection"}</Label>
            <Textarea
              placeholder={reviewAction === "APPROVE" ? "Add any notes..." : "Explain why these applications are being rejected..."}
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
            disabled={loading || (reviewAction === "REJECT" && !reviewNotes)}
          >
            {loading && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
            {reviewAction === "APPROVE" ? "Approve" : "Reject"} {count} Applications
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

interface DeleteDialogProps extends DialogBaseProps {
  count: number;
  isBulk: boolean;
  onConfirm: () => Promise<void>;
}

function DeleteDialog({ open, onOpenChange, count, isBulk, onConfirm, loading }: DeleteDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Delete {isBulk ? "Applications" : "Application"}</DialogTitle>
          <DialogDescription>
            Are you sure you want to delete {isBulk ? `these ${count} applications` : "this application"}? 
            This action cannot be undone.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={loading}>
            Cancel
          </Button>
          <Button variant="destructive" onClick={onConfirm} disabled={loading}>
            {loading && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
            Delete {isBulk ? `${count} Applications` : "Application"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}