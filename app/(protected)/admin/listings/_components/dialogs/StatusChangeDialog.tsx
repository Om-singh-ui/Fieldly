// app/(protected)/admin/listings/_components/dialogs/StatusChangeDialog.tsx
"use client";

import { useMemo } from "react";
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
import { Loader2, AlertCircle } from "lucide-react";
import { AVAILABLE_STATUSES } from "../../_constants";
import type { AdminListing } from "../../_types";
import type { ReactNode } from "react";

interface StatusChangeDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  selectedListing: AdminListing | null;
  newStatus: string;
  setNewStatus: (status: string) => void;
  statusChangeReason: string;
  setStatusChangeReason: (reason: string) => void;
  onConfirm: () => Promise<void>;
  getStatusBadge: (status: string) => ReactNode;
  getAvailableStatuses: (currentStatus: string) => typeof AVAILABLE_STATUSES[number][];
  loading?: boolean;
}

export function StatusChangeDialog({
  open,
  onOpenChange,
  selectedListing,
  newStatus,
  setNewStatus,
  statusChangeReason,
  setStatusChangeReason,
  onConfirm,
  getStatusBadge,
  getAvailableStatuses,
  loading,
}: StatusChangeDialogProps) {
  const availableStatuses = useMemo(
    () => (selectedListing ? getAvailableStatuses(selectedListing.status) : []),
    [selectedListing, getAvailableStatuses]
  );

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Change Listing Status</DialogTitle>
          <DialogDescription>
            Update status for &quot;{selectedListing?.title}&quot;
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <div className="p-4 bg-muted rounded-lg">
            <p className="text-sm text-muted-foreground">Current:</p>
            <div className="mt-1">{selectedListing && getStatusBadge(selectedListing.status)}</div>
            {selectedListing?.status === "ACTIVE" && (
              <p className="text-xs text-amber-600 mt-2 flex items-center gap-1">
                <AlertCircle className="h-3 w-3" />
                Note: Changing listing status does NOT affect auction status.
              </p>
            )}
          </div>
          <div className="space-y-2">
            <Label>New Status</Label>
            <Select value={newStatus} onValueChange={setNewStatus}>
              <SelectTrigger>
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                {availableStatuses.map((status) => (
                  <SelectItem key={status.value} value={status.value}>
                    <div className="flex items-center gap-2">
                      <status.icon className="h-4 w-4" />
                      <span>{status.label}</span>
                      <span className="text-xs text-muted-foreground ml-2">
                        ({status.description})
                      </span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {availableStatuses.length === 0 && (
              <p className="text-sm text-amber-600">No valid transitions available</p>
            )}
          </div>
          <div className="space-y-2">
            <Label>Reason (Optional)</Label>
            <Textarea
              placeholder="Why are you changing the status?"
              value={statusChangeReason}
              onChange={(e) => setStatusChangeReason(e.target.value)}
              rows={2}
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={loading}>
            Cancel
          </Button>
          <Button onClick={onConfirm} disabled={!newStatus || loading}>
            {loading && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
            Update Status
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}