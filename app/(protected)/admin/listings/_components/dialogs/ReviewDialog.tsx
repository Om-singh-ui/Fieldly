// app/(protected)/admin/listings/_components/dialogs/ReviewDialog.tsx
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
import type { AdminListing, ReviewAction } from "../../_types";

interface ReviewDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  selectedListing: AdminListing | null;
  reviewAction: ReviewAction;
  reviewNotes: string;
  setReviewNotes: (notes: string) => void;
  onConfirm: () => Promise<void>;
  loading?: boolean;
}

export function ReviewDialog({
  open,
  onOpenChange,
  selectedListing,
  reviewAction,
  reviewNotes,
  setReviewNotes,
  onConfirm,
  loading,
}: ReviewDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {reviewAction === "APPROVE" ? "Approve & Publish Listing" : "Reject Listing"}
          </DialogTitle>
          <DialogDescription>
            {reviewAction === "APPROVE"
              ? "This listing will be published. You can manage auction status from the actions menu."
              : "This listing will be rejected and hidden from farmers."}
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <div className="p-4 bg-muted rounded-lg">
            <p className="font-medium">{selectedListing?.title}</p>
            <p className="text-sm text-muted-foreground">
              {selectedListing?.land?.size} acres • {selectedListing?.land?.village},{" "}
              {selectedListing?.land?.district}
            </p>
            <p className="text-sm text-muted-foreground mt-1">
              Base: ₹{selectedListing?.basePrice?.toLocaleString()}/acre
            </p>
          </div>
          <div className="space-y-2">
            <Label>Notes (Optional)</Label>
            <Textarea
              placeholder="Add any notes..."
              value={reviewNotes}
              onChange={(e) => setReviewNotes(e.target.value)}
              rows={3}
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={loading}>
            Cancel
          </Button>
          <Button
            variant={reviewAction === "APPROVE" ? "default" : "destructive"}
            onClick={onConfirm}
            disabled={loading}
          >
            {loading && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
            {reviewAction === "APPROVE" ? "Approve & Publish" : "Reject Listing"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}