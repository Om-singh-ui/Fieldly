// app/(protected)/landowner/dashboard/_components/LandsTable.tsx
"use client";

import { useState } from "react";
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
import { MoreHorizontal, Eye, Edit, FileText, Trash, ArrowUpDown } from "lucide-react";
import { LandWithDetails } from "@/lib/queries/landowner";

interface LandsTableProps {
  lands: LandWithDetails[];
}

type SortField = keyof Pick<LandWithDetails, 'title' | 'size' | 'status' | 'createdAt'>;
type SortDirection = 'asc' | 'desc';

// Helper function for sorting outside component
function sortLands(lands: LandWithDetails[], field: SortField, direction: SortDirection): LandWithDetails[] {
  return [...lands].sort((a, b) => {
    let aValue: string | number | Date = a[field];
    let bValue: string | number | Date = b[field];
    
    // Handle dates
    if (field === 'createdAt') {
      aValue = new Date(aValue as string).getTime();
      bValue = new Date(bValue as string).getTime();
    }
    
    // Handle strings (case-insensitive)
    if (typeof aValue === 'string' && typeof bValue === 'string') {
      aValue = aValue.toLowerCase();
      bValue = bValue.toLowerCase();
    }
    
    // Handle null/undefined
    if (aValue == null && bValue == null) return 0;
    if (aValue == null) return 1;
    if (bValue == null) return -1;
    
    // Compare based on type
    if (typeof aValue === 'number' && typeof bValue === 'number') {
      return direction === 'asc' ? aValue - bValue : bValue - aValue;
    }
    
    // For strings and other types
    if (direction === 'asc') {
      return aValue > bValue ? 1 : -1;
    }
    return aValue < bValue ? 1 : -1;
  });
}

// SortHeader component moved outside to prevent recreation
interface SortHeaderProps {
  field: SortField;
  currentField: SortField;
  direction: SortDirection;
  onSort: (field: SortField) => void;
  children: React.ReactNode;
}

const SortHeader = ({ field, currentField, onSort, children }: SortHeaderProps) => {
  const isActive = currentField === field;
  
  return (
    <TableHead>
      <Button
        variant="ghost"
        size="sm"
        onClick={() => onSort(field)}
        className={`h-8 px-2 text-xs font-medium ${
          isActive ? 'bg-muted' : ''
        }`}
      >
        {children}
        <ArrowUpDown className={`ml-2 h-3 w-3 ${
          isActive ? 'text-primary' : 'text-muted-foreground'
        }`} />
      </Button>
    </TableHead>
  );
};

export function LandsTable({ lands }: LandsTableProps) {
  const [sortField, setSortField] = useState<SortField>('createdAt');
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc');

  const handleSort = (field: SortField) => {
    if (field === sortField) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const sortedLands = sortLands(lands, sortField, sortDirection);

  const getStatusBadge = (status: string) => {
    const variants: Record<string, string> = {
      LEASED: "bg-green-100 text-green-800 border-green-200",
      AVAILABLE: "bg-blue-100 text-blue-800 border-blue-200",
      PENDING: "bg-yellow-100 text-yellow-800 border-yellow-200"
    };
    return variants[status] || "bg-gray-100 text-gray-800 border-gray-200";
  };

  const formatRent = (min: number | null | undefined, max: number | null | undefined) => {
    if (min == null && max == null) return 'Not specified';
    if (min != null && max != null) {
      return `₹${min.toLocaleString()} - ₹${max.toLocaleString()}`;
    }
    if (min != null) return `From ₹${min.toLocaleString()}`;
    if (max != null) return `Up to ₹${max.toLocaleString()}`;
    return 'Not specified';
  };

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <SortHeader
              field="title"
              currentField={sortField}
              direction={sortDirection}
              onSort={handleSort}
            >
              Land Name
            </SortHeader>
            <TableHead>Location</TableHead>
            <SortHeader
              field="size"
              currentField={sortField}
              direction={sortDirection}
              onSort={handleSort}
            >
              Size (acres)
            </SortHeader>
            <SortHeader
              field="status"
              currentField={sortField}
              direction={sortDirection}
              onSort={handleSort}
            >
              Status
            </SortHeader>
            <TableHead>Expected Rent</TableHead>
            <TableHead>Applications</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {sortedLands.length === 0 ? (
            <TableRow>
              <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                No lands found. Add your first land to get started.
              </TableCell>
            </TableRow>
          ) : (
            sortedLands.map((land) => (
              <TableRow key={land.id} className="hover:bg-muted/50">
                <TableCell className="font-medium">{land.title}</TableCell>
                <TableCell>{land.location}</TableCell>
                <TableCell>{land.size?.toFixed(1) ?? 'N/A'}</TableCell>
                <TableCell>
                  <Badge variant="outline" className={getStatusBadge(land.status)}>
                    {land.status}
                  </Badge>
                </TableCell>
                <TableCell>
                  {formatRent(land.expectedRentMin, land.expectedRentMax)}
                </TableCell>
                <TableCell>
                  {land.applicationsCount > 0 ? (
                    <Badge variant="secondary">
                      {land.applicationsCount} pending
                    </Badge>
                  ) : (
                    <span className="text-xs text-muted-foreground">None</span>
                  )}
                </TableCell>
                <TableCell className="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="h-8 w-8 p-0">
                        <span className="sr-only">Open menu</span>
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuLabel>Actions</DropdownMenuLabel>
                      <DropdownMenuItem>
                        <Eye className="mr-2 h-4 w-4" /> View Details
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <Edit className="mr-2 h-4 w-4" /> Edit Land
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <FileText className="mr-2 h-4 w-4" /> View Applications
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem className="text-red-600">
                        <Trash className="mr-2 h-4 w-4" /> Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}