// app/(protected)/admin/applications/_components/ApplicationRow.tsx
"use client";

import Link from "next/link";
import { TableCell, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  MoreVertical,
  Eye,
  CheckCircle,
  XCircle,
  Ban,
  User,
  Home,
  MapPin,
  IndianRupee,
  Award,
} from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import type { AdminApplication } from "../_types";
import type { ReactNode } from "react";

interface ApplicationRowProps {
  application: AdminApplication;
  selected: boolean;
  onSelect: (id: string, checked: boolean) => void;
  onView: () => void;
  onApprove: () => void;
  onReject: () => void;
  onDelete: () => void;
  getStatusBadge: (status: string) => ReactNode;
}

export function ApplicationRow({
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
            <p className="text-xs text-muted-foreground truncate max-w-[120px]">
              {application.farmer.email}
            </p>
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
        <p className="text-xs text-muted-foreground truncate max-w-[120px]">
          {application.land.landowner.email}
        </p>
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
                <DropdownMenuLabel className="text-xs text-muted-foreground">
                  Review Actions
                </DropdownMenuLabel>
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