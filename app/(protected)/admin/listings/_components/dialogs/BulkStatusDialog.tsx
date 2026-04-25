// app/(protected)/admin/listings/_components/dialogs/BulkStatusDialog.tsx
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Loader2 } from "lucide-react";
import { AVAILABLE_STATUSES } from "../../_constants";

interface BulkStatusDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  count: number;
  bulkNewStatus: string;
  setBulkNewStatus: (status: string) => void;
  bulkStatusReason: string;
  setBulkStatusReason: (reason: string) => void;
  onConfirm: () => Promise<void>;
  loading?: boolean;
}

export function BulkStatusDialog({
  open,
  onOpenChange,
  count,
  bulkNewStatus,
  setBulkNewStatus,
  bulkStatusReason,
  setBulkStatusReason,
  onConfirm,
  loading,
}: BulkStatusDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Bulk Status Change</DialogTitle>
          <DialogDescription>
            Change status for {count} selected listings. Only valid transitions will be applied.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label>New Status</Label>
            <Select value={bulkNewStatus} onValueChange={setBulkNewStatus}>
              <SelectTrigger>
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                {AVAILABLE_STATUSES.map((status) => (
                  <SelectItem key={status.value} value={status.value}>
                    <div className="flex items-center gap-2">
                      <status.icon className="h-4 w-4" />
                      <span>{status.label}</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>Reason (Optional)</Label>
            <Textarea
              placeholder="Why are you changing these statuses?"
              value={bulkStatusReason}
              onChange={(e) => setBulkStatusReason(e.target.value)}
              rows={2}
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={loading}>
            Cancel
          </Button>
          <Button onClick={onConfirm} disabled={!bulkNewStatus || loading}>
            {loading && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
            Update {count} Listings
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}