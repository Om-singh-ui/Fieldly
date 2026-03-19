// app/(marketplace)/_components/BidHistory.tsx
"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { ChevronDown, ChevronUp, Gavel } from "lucide-react";
import { formatCurrency, formatDistanceToNow, getInitials } from "@/lib/utils";

export interface Bid {
  id: string;
  amount: number;
  farmerId: string;
  createdAt: string | Date;
  isAutoBid?: boolean;
  farmer?: {
    id: string;
    name: string;
    imageUrl?: string | null;
  };
}

// EXPORT this interface
export interface BidHistoryProps {
  bids: Bid[];
  showLimit?: number;
}

// Helper function to safely format date
const formatBidDate = (date: string | Date): string => {
  const dateObj = typeof date === "string" ? new Date(date) : date;
  return formatDistanceToNow(dateObj);
};

export function BidHistory({ bids, showLimit = 10 }: BidHistoryProps) {
  const [showAll, setShowAll] = useState(false);

  const displayedBids = showAll ? bids : bids.slice(0, showLimit);
  const hasMore = bids.length > showLimit;

  if (bids.length === 0) {
    return (
      <Card className="p-6">
        <div className="flex items-center gap-2 mb-4">
          <Gavel className="h-5 w-5 text-muted-foreground" />
          <h2 className="text-xl font-semibold">Bid History</h2>
        </div>
        <p className="text-center text-muted-foreground py-8">
          No bids yet. Be the first to bid!
        </p>
      </Card>
    );
  }

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Gavel className="h-5 w-5 text-muted-foreground" />
          <h2 className="text-xl font-semibold">Bid History</h2>
          <Badge variant="secondary">{bids.length} total</Badge>
        </div>
      </div>

      <div className="space-y-3 max-h-96 overflow-y-auto pr-2">
        {displayedBids.map((bid, index) => (
          <div
            key={bid.id}
            className="flex items-center justify-between p-3 bg-muted/50 rounded-lg hover:bg-muted/70 transition-colors"
          >
            <div className="flex items-center gap-3">
              {index === 0 && <Badge className="bg-yellow-500">Leader</Badge>}
              <Avatar className="h-8 w-8">
                <AvatarImage src={bid.farmer?.imageUrl || ""} />
                <AvatarFallback className="text-xs">
                  {getInitials(bid.farmer?.name || "Bidder")}
                </AvatarFallback>
              </Avatar>
              <div>
                <p className="font-medium">{bid.farmer?.name || "Anonymous"}</p>
                <p className="text-xs text-muted-foreground">
                  {formatBidDate(bid.createdAt)} ago
                </p>
              </div>
            </div>
            <div className="text-right">
              <p className="font-bold text-lg">{formatCurrency(bid.amount)}</p>
              {bid.isAutoBid && (
                <Badge variant="outline" className="text-xs">
                  Auto
                </Badge>
              )}
            </div>
          </div>
        ))}
      </div>

      {hasMore && (
        <div className="mt-4 text-center">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowAll(!showAll)}
            className="gap-2"
          >
            {showAll ? (
              <>
                <ChevronUp className="h-4 w-4" />
                Show Less
              </>
            ) : (
              <>
                <ChevronDown className="h-4 w-4" />
                Show {bids.length - showLimit} More
              </>
            )}
          </Button>
        </div>
      )}
    </Card>
  );
}
