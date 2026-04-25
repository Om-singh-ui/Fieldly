// app/(protected)/admin/applications/_components/dialogs/BulkReviewDialog.tsx
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
import type { AdminApplication, ReviewAction } from "../../_types";

interface BulkReviewDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  count: number;
  reviewAction: ReviewAction;
  reviewNotes: string;
  setReviewNotes: (notes: string) => void;
  onConfirm: () => Promise<void>;
  loading?: boolean;
  isSingle?: boolean;
  application?: AdminApplication | null;
}

export function BulkReviewDialog({
  open,
  onOpenChange,
  count,
  reviewAction,
  reviewNotes,
  setReviewNotes,
  onConfirm,
  loading,
  isSingle,
  application,
}: BulkReviewDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="rounded-2xl">
        <DialogHeader>
          <DialogTitle>
            {isSingle
              ? reviewAction === "APPROVE"
                ? "Approve Application"
                : "Reject Application"
              : `Bulk ${reviewAction === "APPROVE" ? "Approve" : "Reject"} Applications`}
          </DialogTitle>
          <DialogDescription>
            {isSingle
              ? reviewAction === "APPROVE"
                ? "This will create a lease and notify the farmer."
                : "This application will be rejected and the farmer will be notified."
              : `This will ${reviewAction === "APPROVE" ? "approve" : "reject"} ${count} selected applications.`}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {isSingle && application && (
            <div className="p-4 bg-muted rounded-xl">
              <p className="font-medium">{application.land.title}</p>
              <div className="flex items-center gap-2 mt-1 text-sm text-muted-foreground">
                <span>{application.farmer.name}</span>
                <span>•</span>
                <span>{application.duration} months</span>
                {application.proposedRent && (
                  <>
                    <span>•</span>
                    <span>₹{application.proposedRent.toLocaleString()}/mo</span>
                  </>
                )}
              </div>
            </div>
          )}

          <div className="space-y-2">
            <Label>
              {reviewAction === "APPROVE" ? "Notes (Optional)" : "Reason for Rejection"}
            </Label>
            <Textarea
              placeholder={
                reviewAction === "APPROVE"
                  ? "Add any notes..."
                  : "Explain why this application is being rejected..."
              }
              value={reviewNotes}
              onChange={(e) => setReviewNotes(e.target.value)}
              rows={4}
              className="rounded-xl"
            />
            {reviewAction === "REJECT" && !reviewNotes.trim() && (
              <p className="text-xs text-destructive">
                Please provide a reason for rejection
              </p>
            )}
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={loading} className="rounded-xl">
            Cancel
          </Button>
          <Button
            variant={reviewAction === "APPROVE" ? "default" : "destructive"}
            onClick={onConfirm}
            disabled={loading || (reviewAction === "REJECT" && !reviewNotes.trim())}
            className="rounded-xl"
          >
            {loading && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
            {reviewAction === "APPROVE" ? "Approve" : "Reject"}
            {!isSingle && ` ${count} Applications`}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}