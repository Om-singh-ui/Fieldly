// app/(protected)/admin/users/_components/dialogs/BulkActionDialog.tsx
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
import { BULK_ACTIONS } from "../../_constants";

interface BulkActionDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  count: number;
  bulkAction: string;
  onBulkActionChange: (action: string) => void;
  onConfirm: () => void;
}

export function BulkActionDialog({
  open,
  onOpenChange,
  count,
  bulkAction,
  onBulkActionChange,
  onConfirm,
}: BulkActionDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="rounded-2xl">
        <DialogHeader>
          <DialogTitle>Bulk Action</DialogTitle>
          <DialogDescription>
            Apply action to {count} selected users
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <Select value={bulkAction} onValueChange={onBulkActionChange}>
            <SelectTrigger className="rounded-xl">
              <SelectValue placeholder="Select action" />
            </SelectTrigger>
            <SelectContent>
              {BULK_ACTIONS.map((action) => (
                <SelectItem key={action.value} value={action.value}>
                  {action.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)} className="rounded-xl">
            Cancel
          </Button>
          <Button onClick={onConfirm} disabled={!bulkAction} className="rounded-xl">
            Apply
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}