// app/(protected)/admin/users/_components/UserPagination.tsx
"use client";

import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import type { PaginationState } from "../_types";

interface UserPaginationProps {
  pagination: PaginationState;
  onPageChange: (page: number) => void;
}

export function UserPagination({ pagination, onPageChange }: UserPaginationProps) {
  if (pagination.totalPages <= 1) return null;

  return (
    <div className="flex items-center justify-between">
      <p className="text-sm text-gray-500">
        Showing {(pagination.page - 1) * pagination.limit + 1} to{" "}
        {Math.min(pagination.page * pagination.limit, pagination.total)} of{" "}
        {pagination.total} users
      </p>
      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="icon"
          className="h-9 w-9 rounded-xl"
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
          className="h-9 w-9 rounded-xl"
          disabled={!pagination.hasNext}
          onClick={() => onPageChange(pagination.page + 1)}
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}