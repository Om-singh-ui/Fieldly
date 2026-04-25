// app/(protected)/admin/listings/_components/ListingFilters.tsx
"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search, Filter, CheckCircle, XCircle, Edit } from "lucide-react";
import { STATUS_OPTIONS, LISTING_TYPE_OPTIONS, SORT_OPTIONS } from "../_constants";
import type { ListingsFilters } from "../_types";

interface ListingFiltersProps {
  filters: ListingsFilters;
  selectedCount: number;
  onFiltersChange: (filters: ListingsFilters) => void;
  onFetch: () => void;
  onBulkApprove: () => void;
  onBulkReject: () => void;
  onBulkStatusChange: () => void;
}

export function ListingFilters({
  filters,
  selectedCount,
  onFiltersChange,
  onFetch,
  onBulkApprove,
  onBulkReject,
  onBulkStatusChange,
}: ListingFiltersProps) {
  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex-1 min-w-[200px]">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search listings..."
                value={filters.search}
                onChange={(e) => onFiltersChange({ ...filters, search: e.target.value })}
                className="pl-9"
                onKeyDown={(e) => e.key === "Enter" && onFetch()}
              />
            </div>
          </div>

          <Select
            value={filters.status}
            onValueChange={(value) => onFiltersChange({ ...filters, status: value })}
          >
            <SelectTrigger className="w-[140px]">
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
            onValueChange={(value) => onFiltersChange({ ...filters, type: value })}
          >
            <SelectTrigger className="w-[140px]">
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

          <Select
            value={filters.sortBy}
            onValueChange={(value) => onFiltersChange({ ...filters, sortBy: value })}
          >
            <SelectTrigger className="w-[130px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {SORT_OPTIONS.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Button
            variant="ghost"
            size="icon"
            onClick={() =>
              onFiltersChange({
                ...filters,
                sortOrder: filters.sortOrder === "asc" ? "desc" : "asc",
              })
            }
          >
            {filters.sortOrder === "asc" ? "↑" : "↓"}
          </Button>

          <Button variant="outline" onClick={onFetch}>
            <Filter className="h-4 w-4 mr-2" />
            Filter
          </Button>

          {selectedCount > 0 && (
            <div className="flex items-center gap-2 ml-auto">
              <span className="text-sm text-muted-foreground">
                {selectedCount} selected
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={onBulkApprove}
                className="border-green-500 text-green-600 hover:bg-green-50"
              >
                <CheckCircle className="h-4 w-4 mr-1" />
                Approve
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={onBulkReject}
                className="border-red-500 text-red-600 hover:bg-red-50"
              >
                <XCircle className="h-4 w-4 mr-1" />
                Reject
              </Button>
              <Button variant="outline" size="sm" onClick={onBulkStatusChange}>
                <Edit className="h-4 w-4 mr-1" />
                Status
              </Button>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}