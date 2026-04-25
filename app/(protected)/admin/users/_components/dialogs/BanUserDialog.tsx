// app/(protected)/admin/users/_components/dialogs/BanUserDialog.tsx
"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import type { AdminUser } from "../../_types";

interface BanUserDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  selectedUser: AdminUser | null;
  banReason: string;
  onBanReasonChange: (reason: string) => void;
  onConfirm: () => void;
}

export function BanUserDialog({
  open,
  onOpenChange,
  selectedUser,
  banReason,
  onBanReasonChange,
  onConfirm,
}: BanUserDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="rounded-2xl">
        <DialogHeader>
          <DialogTitle>Ban User</DialogTitle>
          <DialogDescription>
            Are you sure you want to ban {selectedUser?.name}? This action can be reversed later.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <div className="p-4 bg-muted rounded-xl">
            <p className="font-medium">{selectedUser?.name}</p>
            <p className="text-sm text-muted-foreground">{selectedUser?.email}</p>
          </div>
          <Input
            placeholder="Reason for ban..."
            value={banReason}
            onChange={(e) => onBanReasonChange(e.target.value)}
            className="rounded-xl"
          />
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)} className="rounded-xl">
            Cancel
          </Button>
          <Button
            variant="destructive"
            onClick={onConfirm}
            disabled={!banReason.trim()}
            className="rounded-xl"
          >
            Ban User
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}