// app/(protected)/admin/applications/_components/ApplicationFilters.tsx
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
import { Search, Filter, CheckCircle, XCircle, Ban } from "lucide-react";
import { STATUS_OPTIONS, SORT_OPTIONS } from "../_constants";
import type { ApplicationsFilters } from "../_types";

interface ApplicationFiltersProps {
  filters: ApplicationsFilters;
  selectedCount: number;
  onFiltersChange: (filters: ApplicationsFilters) => void;
  onFetch: () => void;
  onBulkApprove: () => void;
  onBulkReject: () => void;
  onBulkDelete: () => void;
}

export function ApplicationFilters({
  filters,
  selectedCount,
  onFiltersChange,
  onFetch,
  onBulkApprove,
  onBulkReject,
  onBulkDelete,
}: ApplicationFiltersProps) {
  return (
    <Card className="rounded-3xl border border-white/40 dark:border-white/10
      bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl shadow-lg">
      <CardContent className="p-4">
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex-1 min-w-[200px]">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search by land, farmer, or location..."
                value={filters.search}
                onChange={(e) => onFiltersChange({ ...filters, search: e.target.value })}
                className="pl-11 h-11 rounded-2xl bg-gray-50/50 dark:bg-gray-800/50
                  border-gray-200 dark:border-gray-700 focus:border-[#b7cf8a]"
                onKeyDown={(e) => e.key === "Enter" && onFetch()}
              />
            </div>
          </div>

          <Select
            value={filters.status}
            onValueChange={(value) => onFiltersChange({ ...filters, status: value })}
          >
            <SelectTrigger className="w-[150px] h-11 rounded-2xl bg-gray-50/50 dark:bg-gray-800/50">
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
            value={filters.sortBy}
            onValueChange={(value) => onFiltersChange({ ...filters, sortBy: value })}
          >
            <SelectTrigger className="w-[150px] h-11 rounded-2xl bg-gray-50/50 dark:bg-gray-800/50">
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
            className="h-11 w-11 rounded-2xl"
            onClick={() =>
              onFiltersChange({
                ...filters,
                sortOrder: filters.sortOrder === "asc" ? "desc" : "asc",
              })
            }
          >
            {filters.sortOrder === "asc" ? "↑" : "↓"}
          </Button>

          <Button
            variant="outline"
            onClick={onFetch}
            className="h-11 rounded-2xl border-[#b7cf8a]/30 hover:border-[#b7cf8a]
              hover:bg-[#b7cf8a]/5 text-[#b7cf8a]"
          >
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
                className="rounded-xl border-green-500/30 text-green-600 hover:bg-green-50"
              >
                <CheckCircle className="h-4 w-4 mr-1" />
                Approve
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={onBulkReject}
                className="rounded-xl border-red-500/30 text-red-600 hover:bg-red-50"
              >
                <XCircle className="h-4 w-4 mr-1" />
                Reject
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={onBulkDelete}
                className="rounded-xl border-red-500/30 text-red-600 hover:bg-red-50"
              >
                <Ban className="h-4 w-4 mr-1" />
                Delete
              </Button>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}