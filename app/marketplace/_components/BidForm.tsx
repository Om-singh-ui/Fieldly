// app/(marketplace)/_components/BidForm.tsx
"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { formatCurrency } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";

// EXPORT this interface
export interface BidFormProps {
  minBid: number;
  bidIncrement: number;
  isLive: boolean;
  loading: boolean;
  onSubmit: (amount: number, isAutoBid: boolean) => Promise<void>;
}

export function BidForm({
  minBid,
  bidIncrement,
  isLive,
  loading,
  onSubmit,
}: BidFormProps) {
  const [bidAmount, setBidAmount] = useState("");
  const [isAutoBid, setIsAutoBid] = useState(false);
  const { toast } = useToast();

  const quickBidOptions = [
    minBid,
    minBid + bidIncrement * 2,
    minBid + bidIncrement * 5,
    minBid + bidIncrement * 10,
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const amount = parseFloat(bidAmount);
    if (isNaN(amount) || amount < minBid) {
      toast({
        title: "Invalid bid amount",
        description: `Minimum bid is ${formatCurrency(minBid)}`,
        variant: "destructive",
      });
      return;
    }

    try {
      await onSubmit(amount, isAutoBid);
      setBidAmount("");
      toast({
        title: "Bid placed successfully!",
        description: "Your bid has been registered.",
      });
    } catch (err) {
      toast({
        title: "Failed to place bid",
        description: err instanceof Error ? err.message : "Please try again",
        variant: "destructive",
      });
    }
  };

  const handleQuickBid = (amount: number) => {
    setBidAmount(amount.toString());
  };

  if (!isLive) {
    return (
      <div className="text-center p-4 bg-muted/50 rounded-lg">
        <p className="text-muted-foreground">This auction has ended</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="bid-amount">Your Bid Amount</Label>
        <div className="flex gap-2">
          <Input
            id="bid-amount"
            type="number"
            placeholder={`Min ${formatCurrency(minBid)}`}
            value={bidAmount}
            onChange={(e) => setBidAmount(e.target.value)}
            min={minBid}
            step={bidIncrement}
            disabled={loading}
            className="flex-1"
          />
          <Button
            type="submit"
            disabled={loading}
            size="lg"
            className="min-w-[120px]"
          >
            {loading ? "Placing..." : "Place Bid"}
          </Button>
        </div>
      </div>

      {/* Quick bid options */}
      <div className="space-y-2">
        <Label>Quick Bid</Label>
        <div className="flex flex-wrap gap-2">
          {quickBidOptions.map((amount) => (
            <Button
              key={amount}
              type="button"
              variant="outline"
              size="sm"
              onClick={() => handleQuickBid(amount)}
              disabled={loading}
            >
              {formatCurrency(amount)}
            </Button>
          ))}
        </div>
      </div>

      {/* Auto-bid toggle */}
      <div className="flex items-center gap-2">
        <Switch
          id="auto-bid"
          checked={isAutoBid}
          onCheckedChange={setIsAutoBid}
          disabled={loading}
        />
        <Label htmlFor="auto-bid" className="cursor-pointer">
          Enable auto-bidding (automatically bid up to your maximum)
        </Label>
      </div>

      <p className="text-xs text-muted-foreground">
        Minimum bid: {formatCurrency(minBid)} | Bid increment:{" "}
        {formatCurrency(bidIncrement)}
      </p>
    </form>
  );
}
