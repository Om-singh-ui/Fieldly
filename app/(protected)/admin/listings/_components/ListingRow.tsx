// app/(protected)/admin/listings/_components/ListingRow.tsx
"use client";

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
  Archive,
  Edit,
  Flag,
  Star,
  CheckCircle,
  XCircle,
  Home,
  MapPin,
  IndianRupee,
} from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { toast } from "sonner";
import { AUCTION_ACTION_CONFIG } from "../_constants";
import type { AdminListing, AuctionAction } from "../_types";
import type { ReactNode } from "react";

interface ListingRowProps {
  listing: AdminListing;
  selected: boolean;
  onSelect: (id: string, checked: boolean) => void;
  onView: () => void;
  onApprove: () => void;
  onReject: () => void;
  onClose: () => void;
  onChangeStatus: () => void;
  onAuctionAction: (action: AuctionAction) => void;
  getStatusBadge: (status: string) => ReactNode;
  getAuctionStatusBadge: (status?: string) => ReactNode;
  getListingTypeBadge: (type: string) => ReactNode;
  getAvailableAuctionActions: (listing: AdminListing) => AuctionAction[];
}

export function ListingRow({
  listing,
  selected,
  onSelect,
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
}: ListingRowProps) {
  const auctionActions = getAvailableAuctionActions(listing);
  const hasAuctionActions = auctionActions.length > 0;
  const hasStatusActions = listing.status === "PENDING_APPROVAL" || listing.status === "ACTIVE";

  const handleReport = () => toast.info("Report feature coming soon");
  const handleFeature = () => toast.info("Feature feature coming soon");

  return (
    <TableRow className="hover:bg-muted/50">
      <TableCell>
        <Checkbox checked={selected} onCheckedChange={(c) => onSelect(listing.id, !!c)} />
      </TableCell>
      <TableCell>
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-lg bg-muted flex items-center justify-center">
            <Home className="h-5 w-5 text-muted-foreground" />
          </div>
          <div>
            <p className="font-medium truncate max-w-[200px]">{listing.title}</p>
            <p className="text-xs text-muted-foreground">
              {listing.land?.size} acres • {listing.land?.landType}
            </p>
          </div>
        </div>
      </TableCell>
      <TableCell>{getListingTypeBadge(listing.listingType)}</TableCell>
      <TableCell>
        <p className="text-sm truncate max-w-[120px]">{listing.owner?.name || "N/A"}</p>
        <p className="text-xs text-muted-foreground truncate max-w-[120px]">
          {listing.owner?.email || ""}
        </p>
      </TableCell>
      <TableCell>
        <div className="flex items-center gap-1">
          <MapPin className="h-3 w-3 text-muted-foreground shrink-0" />
          <span className="text-sm truncate max-w-[120px]">
            {[listing.land?.village, listing.land?.district].filter(Boolean).join(", ") || "N/A"}
          </span>
        </div>
      </TableCell>
      <TableCell>
        <div className="flex items-center gap-1">
          <IndianRupee className="h-3 w-3 text-muted-foreground shrink-0" />
          <span className="text-sm font-medium">
            ₹{listing.basePrice?.toLocaleString()}/acre
          </span>
        </div>
      </TableCell>
      <TableCell>{getStatusBadge(listing.status)}</TableCell>
      <TableCell>{getAuctionStatusBadge(listing.auctionStatus)}</TableCell>
      <TableCell>
        <div className="flex items-center gap-1.5">
          <Badge variant="outline" className="text-xs px-1.5">
            {listing._count?.bids || 0}
          </Badge>
          <Badge variant="outline" className="text-xs px-1.5">
            {listing._count?.applications || 0}
          </Badge>
        </div>
      </TableCell>
      <TableCell>
        <p className="text-sm whitespace-nowrap">
          {formatDistanceToNow(new Date(listing.createdAt), { addSuffix: true })}
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

            {hasAuctionActions && (
              <>
                <DropdownMenuSeparator />
                <DropdownMenuLabel className="text-xs text-muted-foreground">
                  Auction Actions
                </DropdownMenuLabel>
                {auctionActions.map((action) => {
                  const config = AUCTION_ACTION_CONFIG[action];
                  const Icon = config.icon;
                  return (
                    <DropdownMenuItem key={action} onClick={() => onAuctionAction(action)}>
                      <Icon className={`h-4 w-4 mr-2 ${config.color}`} />
                      {config.title}
                    </DropdownMenuItem>
                  );
                })}
              </>
            )}

            {hasStatusActions && (
              <>
                <DropdownMenuSeparator />
                <DropdownMenuLabel className="text-xs text-muted-foreground">
                  Status Actions
                </DropdownMenuLabel>
                {listing.status === "PENDING_APPROVAL" && (
                  <>
                    <DropdownMenuItem onClick={onApprove}>
                      <CheckCircle className="h-4 w-4 mr-2 text-green-600" />
                      Approve & Publish
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={onReject}>
                      <XCircle className="h-4 w-4 mr-2 text-red-600" />
                      Reject
                    </DropdownMenuItem>
                  </>
                )}
                {listing.status === "ACTIVE" && (
                  <DropdownMenuItem onClick={onClose}>
                    <Archive className="h-4 w-4 mr-2" />
                    Close Listing
                  </DropdownMenuItem>
                )}
              </>
            )}

            <DropdownMenuItem onClick={onChangeStatus}>
              <Edit className="h-4 w-4 mr-2" />
              Change Status
            </DropdownMenuItem>

            <DropdownMenuSeparator />

            <DropdownMenuItem onClick={handleReport}>
              <Flag className="h-4 w-4 mr-2" />
              Report
            </DropdownMenuItem>
            <DropdownMenuItem onClick={handleFeature}>
              <Star className="h-4 w-4 mr-2" />
              Feature
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </TableCell>
    </TableRow>
  );
}