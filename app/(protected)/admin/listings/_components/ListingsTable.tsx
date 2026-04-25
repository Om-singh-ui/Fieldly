// app/(protected)/admin/listings/_components/ListingsTable.tsx
"use client";

import { Card, CardContent } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";
import { ListingRow } from "./ListingRow";
import type { AdminListing, AuctionAction } from "../_types";
import type { ReactNode } from "react";

interface ListingsTableProps {
  listings: AdminListing[];
  selectedListings: Set<string>;
  loading: boolean;
  onSelectAll: (checked: boolean) => void;
  onSelectOne: (id: string, checked: boolean) => void;
  onView: (id: string) => void;
  onApprove: (listing: AdminListing) => void;
  onReject: (listing: AdminListing) => void;
  onClose: (listing: AdminListing) => void;
  onChangeStatus: (listing: AdminListing) => void;
  onAuctionAction: (listing: AdminListing, action: AuctionAction) => void;
  getStatusBadge: (status: string) => ReactNode;
  getAuctionStatusBadge: (status?: string) => ReactNode;
  getListingTypeBadge: (type: string) => ReactNode;
  getAvailableAuctionActions: (listing: AdminListing) => AuctionAction[];
}

export function ListingsTable({
  listings,
  selectedListings,
  loading,
  onSelectAll,
  onSelectOne,
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
}: ListingsTableProps) {
  const isAllSelected = listings.length > 0 && selectedListings.size === listings.length;

  return (
    <Card>
      <CardContent className="p-0">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/50">
              <TableHead className="w-12">
                <Checkbox checked={isAllSelected} onCheckedChange={onSelectAll} />
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
                  onSelect={onSelectOne}
                  onView={() => onView(listing.id)}
                  onApprove={() => onApprove(listing)}
                  onReject={() => onReject(listing)}
                  onClose={() => onClose(listing)}
                  onChangeStatus={() => onChangeStatus(listing)}
                  onAuctionAction={(action) => onAuctionAction(listing, action)}
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
  );
}

// These can remain here or be extracted to separate files if preferred
import { Skeleton } from "@/components/ui/skeleton";
import { Home } from "lucide-react";

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

import { TableCell } from "@/components/ui/table";