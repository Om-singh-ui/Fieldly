// app/(protected)/admin/applications/_components/ApplicationsTable.tsx
"use client";

import { Card, CardContent } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";
import { Skeleton } from "@/components/ui/skeleton";
import { FileText } from "lucide-react";
import { ApplicationRow } from "./ApplicationRow";
import type { AdminApplication } from "../_types";
import type { ReactNode } from "react";

interface ApplicationsTableProps {
  applications: AdminApplication[];
  selectedApplications: Set<string>;
  loading: boolean;
  onSelectAll: (checked: boolean) => void;
  onSelectOne: (id: string, checked: boolean) => void;
  onView: (id: string) => void;
  onApprove: (application: AdminApplication) => void;
  onReject: (application: AdminApplication) => void;
  onDelete: (application: AdminApplication) => void;
  getStatusBadge: (status: string) => ReactNode;
}

export function ApplicationsTable({
  applications,
  selectedApplications,
  loading,
  onSelectAll,
  onSelectOne,
  onView,
  onApprove,
  onReject,
  onDelete,
  getStatusBadge,
}: ApplicationsTableProps) {
  const isAllSelected = applications.length > 0 && selectedApplications.size === applications.length;

  return (
    <Card className="rounded-3xl border border-white/40 dark:border-white/10
      bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl shadow-lg overflow-hidden">
      <CardContent className="p-0">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/50 hover:bg-muted/50">
              <TableHead className="w-12">
                <Checkbox checked={isAllSelected} onCheckedChange={onSelectAll} />
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
              Array.from({ length: 8 }).map((_, i) => (
                <TableRow key={i}>
                  <TableCell colSpan={10}>
                    <Skeleton className="h-12 w-full" />
                  </TableCell>
                </TableRow>
              ))
            ) : applications.length === 0 ? (
              <TableRow>
                <TableCell colSpan={10} className="text-center py-12">
                  <div className="flex flex-col items-center gap-2">
                    <FileText className="h-12 w-12 text-muted-foreground/50" />
                    <p className="text-muted-foreground">No applications found</p>
                    <p className="text-sm text-muted-foreground/70">
                      Try adjusting your filters
                    </p>
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              applications.map((application) => (
                <ApplicationRow
                  key={application.id}
                  application={application}
                  selected={selectedApplications.has(application.id)}
                  onSelect={onSelectOne}
                  onView={() => onView(application.id)}
                  onApprove={() => onApprove(application)}
                  onReject={() => onReject(application)}
                  onDelete={() => onDelete(application)}
                  getStatusBadge={getStatusBadge}
                />
              ))
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}