// app/(protected)/admin/listings/_components/dialogs/AuctionStatusDialog.tsx
"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Loader2 } from "lucide-react";
import { AUCTION_ACTION_CONFIG } from "../../_constants";
import type { AdminListing, AuctionAction } from "../../_types";
import type { ReactNode } from "react";

interface AuctionStatusDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  selectedListing: AdminListing | null;
  auctionAction: AuctionAction;
  auctionReason: string;
  setAuctionReason: (reason: string) => void;
  onConfirm: () => Promise<void>;
  getAuctionStatusBadge: (status?: string) => ReactNode;
  loading?: boolean;
}

export function AuctionStatusDialog({
  open,
  onOpenChange,
  selectedListing,
  auctionAction,
  auctionReason,
  setAuctionReason,
  onConfirm,
  getAuctionStatusBadge,
  loading,
}: AuctionStatusDialogProps) {
  const config = AUCTION_ACTION_CONFIG[auctionAction];
  const Icon = config.icon;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Icon className={`h-5 w-5 ${config.color}`} />
            {config.title}
          </DialogTitle>
          <DialogDescription>{config.description}</DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <div className="p-4 bg-muted rounded-lg">
            <p className="font-medium">{selectedListing?.title}</p>
            <div className="flex items-center gap-2 mt-1">
              <p className="text-sm text-muted-foreground">Current:</p>
              {getAuctionStatusBadge(selectedListing?.auctionStatus)}
            </div>
            <p className="text-sm text-muted-foreground mt-1">
              Base: ₹{selectedListing?.basePrice?.toLocaleString()}/acre
            </p>
          </div>
          <div className="space-y-2">
            <Label>Reason (Optional)</Label>
            <Textarea
              placeholder={`Why ${auctionAction.toLowerCase()} this auction?`}
              value={auctionReason}
              onChange={(e) => setAuctionReason(e.target.value)}
              rows={2}
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={loading}>
            Cancel
          </Button>
          <Button variant={config.variant} onClick={onConfirm} disabled={loading}>
            {loading && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
            {config.title}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}