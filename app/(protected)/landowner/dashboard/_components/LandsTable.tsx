// app/(protected)/landowner/dashboard/_components/LandsTable.tsx
"use client";

import { useState, useMemo, useCallback } from "react";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { 
  MoreHorizontal, Eye, Edit, FileText, Trash, 
  ArrowUpDown, MapPin, Calendar, ExternalLink,
  AlertCircle, CheckCircle2, Clock, Plus,
  Ruler, Activity, IndianRupee
} from "lucide-react";
import { LandWithDetails } from "@/lib/queries/landowner";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { formatDistanceToNow } from "date-fns";

interface LandsTableProps {
  lands: LandWithDetails[];
}

type SortField = keyof Pick<LandWithDetails, 'title' | 'size' | 'status' | 'createdAt' | 'applicationsCount'>;
type SortDirection = 'asc' | 'desc';

interface StatusConfig {
  color: string;
  icon: React.ElementType;
  label: string;
}

interface SortableHeaderProps {
  field: SortField;
  currentField: SortField;
  onSort: (field: SortField) => void;
  children: React.ReactNode;
  align?: "left" | "center" | "right";
  icon?: React.ReactNode;
}

const statusConfig: Record<string, StatusConfig> = {
  LEASED: { 
    color: "bg-emerald-100 text-emerald-800 border-emerald-200 dark:bg-emerald-950/30 dark:text-emerald-400 dark:border-emerald-800",
    icon: CheckCircle2,
    label: "Leased"
  },
  AVAILABLE: { 
    color: "bg-blue-100 text-blue-800 border-blue-200 dark:bg-blue-950/30 dark:text-blue-400 dark:border-blue-800",
    icon: AlertCircle,
    label: "Available"
  },
  PENDING: { 
    color: "bg-amber-100 text-amber-800 border-amber-200 dark:bg-amber-950/30 dark:text-amber-400 dark:border-amber-800",
    icon: Clock,
    label: "Pending"
  }
};

// Sortable Header Component
function SortableHeader({ 
  field, 
  currentField, 
  onSort, 
  children,
  align = "left",
  icon
}: SortableHeaderProps) {
  const isActive = currentField === field;
  
  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={() => onSort(field)}
      className={cn(
        "h-8 px-2 text-xs font-medium hover:bg-muted w-full",
        isActive && "bg-muted text-primary",
        align === "left" && "justify-start",
        align === "center" && "justify-center",
        align === "right" && "justify-end"
      )}
    >
      <div className="flex items-center gap-1.5">
        {icon && <span className="text-muted-foreground">{icon}</span>}
        <span className={cn(
          "uppercase tracking-wider",
          isActive && "font-semibold"
        )}>
          {children}
        </span>
        <ArrowUpDown className={cn(
          "h-3 w-3 transition-colors",
          isActive ? "text-primary" : "text-muted-foreground/50"
        )} />
      </div>
    </Button>
  );
}

export function LandsTable({ lands }: LandsTableProps) {
  const [sortField, setSortField] = useState<SortField>('createdAt');
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc');
  const [selectedLand, setSelectedLand] = useState<string | null>(null);

  const handleSort = useCallback((field: SortField) => {
    if (field === sortField) {
      setSortDirection(prev => prev === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  }, [sortField]);

  const sortedLands = useMemo(() => {
    return [...lands].sort((a, b) => {
      let aValue: string | number | Date = a[sortField];
      let bValue: string | number | Date = b[sortField];

      if (sortField === 'createdAt') {
        aValue = new Date(aValue as string).getTime();
        bValue = new Date(bValue as string).getTime();
      }

      if (sortField === 'applicationsCount') {
        aValue = a.applicationsCount;
        bValue = b.applicationsCount;
      }

      if (typeof aValue === 'string' && typeof bValue === 'string') {
        aValue = aValue.toLowerCase();
        bValue = bValue.toLowerCase();
      }

      if (aValue == null) return 1;
      if (bValue == null) return -1;

      const comparison = aValue > bValue ? 1 : -1;
      return sortDirection === 'asc' ? comparison : -comparison;
    });
  }, [lands, sortField, sortDirection]);

  const formatRent = (min: number | null | undefined, max: number | null | undefined) => {
    if (min == null && max == null) return 'Negotiable';
    if (min != null && max != null) {
      return `₹${min.toLocaleString()} - ₹${max.toLocaleString()}`;
    }
    if (min != null) return `From ₹${min.toLocaleString()}`;
    if (max != null) return `Up to ₹${max.toLocaleString()}`;
    return 'Negotiable';
  };

  return (
    <div className="rounded-xl border bg-card overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow className="bg-muted/50 hover:bg-muted/50 border-b-2 border-muted">
            {/* Land Name - Left aligned */}
            <TableHead className="w-[250px] pl-6">
              <SortableHeader
                field="title"
                currentField={sortField}
                onSort={handleSort}
                align="left"
              >
                Land Name
              </SortableHeader>
            </TableHead>

            {/* Location - Left aligned */}
            <TableHead className="w-[200px]">
              <div className="flex items-center gap-2 text-xs font-medium text-muted-foreground uppercase tracking-wider">
                <MapPin className="w-3.5 h-3.5" />
                Location
              </div>
            </TableHead>

            {/* Size - Left aligned */}
            <TableHead className="w-[120px]">
              <SortableHeader
                field="size"
                currentField={sortField}
                onSort={handleSort}
                align="left"
                icon={<Ruler className="w-3.5 h-3.5" />}
              >
                Size (acres)
              </SortableHeader>
            </TableHead>

            {/* Status - Left aligned */}
            <TableHead className="w-[120px]">
              <SortableHeader
                field="status"
                currentField={sortField}
                onSort={handleSort}
                align="left"
                icon={<Activity className="w-3.5 h-3.5" />}
              >
                Status
              </SortableHeader>
            </TableHead>

            {/* Expected Rent - Left aligned */}
            <TableHead className="w-[150px]">
              <div className="flex items-center gap-2 text-xs font-medium text-muted-foreground uppercase tracking-wider">
                <IndianRupee className="w-3.5 h-3.5" />
                Expected Rent
              </div>
            </TableHead>

            {/* Applications - Center aligned for badge count */}
            <TableHead className="w-[120px] text-center">
              <SortableHeader
                field="applicationsCount"
                currentField={sortField}
                onSort={handleSort}
                align="center"
                icon={<FileText className="w-3.5 h-3.5" />}
              >
                Applications
              </SortableHeader>
            </TableHead>

            {/* Listed Date - Left aligned */}
            <TableHead className="w-[150px]">
              <SortableHeader
                field="createdAt"
                currentField={sortField}
                onSort={handleSort}
                align="left"
                icon={<Calendar className="w-3.5 h-3.5" />}
              >
                Listed
              </SortableHeader>
            </TableHead>

            {/* Actions - Right aligned */}
            <TableHead className="w-[100px] text-right pr-6">
              <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                Actions
              </span>
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <AnimatePresence mode="wait">
            {sortedLands.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} className="text-center py-12">
                  <div className="flex flex-col items-center gap-3">
                    <div className="p-3 bg-muted rounded-full">
                      <AlertCircle className="w-6 h-6 text-muted-foreground" />
                    </div>
                    <p className="text-muted-foreground font-medium">
                      No lands found
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Add your first land to start listing in the marketplace
                    </p>
                    <Link href="/landowner/lands/new">
                      <Button size="sm" className="mt-2">
                        <Plus className="w-4 h-4 mr-2" />
                        Add Land
                      </Button>
                    </Link>
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              sortedLands.map((land, index) => {
                const statusKey = land.status as keyof typeof statusConfig;
                const StatusIcon = statusConfig[statusKey]?.icon || AlertCircle;
                
                return (
                  <motion.tr
                    key={land.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="group hover:bg-muted/50 cursor-pointer transition-colors"
                    onMouseEnter={() => setSelectedLand(land.id)}
                    onMouseLeave={() => setSelectedLand(null)}
                    onClick={() => window.location.href = `/landowner/lands/${land.id}`}
                  >
                    <TableCell className="font-medium pl-6">
                      <div className="flex items-center gap-2">
                        {land.title}
                        {selectedLand === land.id && (
                          <ExternalLink className="w-3 h-3 text-muted-foreground" />
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1 text-sm">
                        <MapPin className="w-3 h-3 text-muted-foreground" />
                        {land.location}
                      </div>
                    </TableCell>
                    <TableCell>{land.size?.toFixed(1) ?? 'N/A'}</TableCell>
                    <TableCell>
                      <Badge 
                        variant="outline" 
                        className={cn(
                          "gap-1",
                          statusConfig[statusKey]?.color
                        )}
                      >
                        <StatusIcon className="w-3 h-3" />
                        {statusConfig[statusKey]?.label || land.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="font-medium">
                      {formatRent(land.expectedRentMin, land.expectedRentMax)}
                    </TableCell>
                    <TableCell className="text-center">
                      {land.applicationsCount > 0 ? (
                        <Badge variant="secondary" className="gap-1">
                          <FileText className="w-3 h-3" />
                          {land.applicationsCount} pending
                        </Badge>
                      ) : (
                        <span className="text-sm text-muted-foreground">None</span>
                      )}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1 text-sm text-muted-foreground">
                        <Calendar className="w-3 h-3" />
                        {formatDistanceToNow(new Date(land.createdAt), { addSuffix: true })}
                      </div>
                    </TableCell>
                    <TableCell className="text-right pr-6">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                          <Button variant="ghost" className="h-8 w-8 p-0">
                            <span className="sr-only">Open menu</span>
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-48">
                          <DropdownMenuLabel>Actions</DropdownMenuLabel>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem onClick={(e) => e.stopPropagation()}>
                            <Link href={`/landowner/lands/${land.id}`} className="flex items-center w-full">
                              <Eye className="mr-2 h-4 w-4" />
                              View Details
                            </Link>
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={(e) => e.stopPropagation()}>
                            <Link href={`/landowner/lands/${land.id}/edit`} className="flex items-center w-full">
                              <Edit className="mr-2 h-4 w-4" />
                              Edit Land
                            </Link>
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={(e) => e.stopPropagation()}>
                            <Link href={`/landowner/lands/${land.id}/applications`} className="flex items-center w-full">
                              <FileText className="mr-2 h-4 w-4" />
                              View Applications
                            </Link>
                          </DropdownMenuItem>
                          {land.status === 'AVAILABLE' && (
                            <DropdownMenuItem onClick={(e) => e.stopPropagation()}>
                              <Link href={`/landowner/lands/${land.id}/listings/new`} className="flex items-center w-full">
                                <Plus className="mr-2 h-4 w-4" />
                                Create Listing
                              </Link>
                            </DropdownMenuItem>
                          )}
                          <DropdownMenuSeparator />
                          <DropdownMenuItem 
                            className="text-red-600"
                            onClick={(e) => {
                              e.stopPropagation();
                              // Handle delete
                            }}
                          >
                            <Trash className="mr-2 h-4 w-4" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </motion.tr>
                );
              })
            )}
          </AnimatePresence>
        </TableBody>
      </Table>

      {/* Pagination - if needed */}
      {sortedLands.length > 0 && (
        <div className="flex items-center justify-between px-4 py-3 border-t">
          <p className="text-sm text-muted-foreground">
            Showing {sortedLands.length} of {lands.length} lands
          </p>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" disabled>Previous</Button>
            <Button variant="outline" size="sm" disabled>Next</Button>
          </div>
        </div>
      )}
    </div>
  );
}