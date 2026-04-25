// app/(protected)/admin/applications/_components/dialogs/DeleteDialog.tsx
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
import { Loader2 } from "lucide-react";

interface DeleteDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  count: number;
  isBulk: boolean;
  onConfirm: () => Promise<void>;
  loading?: boolean;
}

export function DeleteDialog({
  open,
  onOpenChange,
  count,
  isBulk,
  onConfirm,
  loading,
}: DeleteDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="rounded-2xl">
        <DialogHeader>
          <DialogTitle>Delete {isBulk ? "Applications" : "Application"}</DialogTitle>
          <DialogDescription>
            Are you sure you want to delete{" "}
            {isBulk ? `these ${count} applications` : "this application"}? This action cannot be
            undone.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={loading} className="rounded-xl">
            Cancel
          </Button>
          <Button variant="destructive" onClick={onConfirm} disabled={loading} className="rounded-xl">
            {loading && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
            Delete {isBulk ? `${count} Applications` : "Application"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}