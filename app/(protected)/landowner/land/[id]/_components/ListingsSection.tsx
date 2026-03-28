// app/(protected)/landowner/land/[id]/_components/ListingsSection.tsx

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Plus,
  ExternalLink,
  Calendar,
  Users,
  TrendingUp,
} from "lucide-react";
import { formatCurrency, formatDate } from "@/lib/utils";
import { EmptyState } from "./EmptyState";
import { cn } from "@/lib/utils";

/* =========================
   LISTING CARD (UPGRADED)
========================= */

function ListingCard({ listing }: { listing: Listing }) {
  const isLive = listing.status === "LIVE";
  const isUpcoming = listing.status === "UPCOMING";
  const bidCount = listing._count?.bids || 0;
  const savedCount = listing._count?.savedBy || 0;

  return (
    <Link href={`/marketplace/listings/${listing.id}`}>
      <div
        className={cn(
          "group p-5 rounded-2xl border transition-all duration-300 cursor-pointer",
          "bg-white/40 dark:bg-white/5 backdrop-blur-md border-white/20",
          "hover:shadow-xl hover:-translate-y-[3px] hover:border-primary/30"
        )}
      >
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">

          {/* LEFT */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className="font-semibold group-hover:text-primary transition-colors truncate">
                {listing.title}
              </h3>

              {isLive && (
                <Badge className="bg-green-500 text-white border-0 animate-pulse">
                  LIVE
                </Badge>
              )}
              {isUpcoming && (
                <Badge className="bg-blue-500 text-white border-0">
                  UPCOMING
                </Badge>
              )}
              {!isLive && !isUpcoming && (
                <Badge variant="outline">ENDED</Badge>
              )}
            </div>

            <div className="flex flex-wrap items-center gap-4 mt-2 text-sm text-muted-foreground">
              <div className="flex items-center gap-1">
                <Calendar className="h-3.5 w-3.5" />
                <span>
                  {formatDate(listing.startDate)} →{" "}
                  {formatDate(listing.endDate)}
                </span>
              </div>

              {bidCount > 0 && (
                <div className="flex items-center gap-1">
                  <Users className="h-3.5 w-3.5" />
                  <span>{bidCount} bids</span>
                </div>
              )}

              {savedCount > 0 && (
                <div className="flex items-center gap-1">
                  <TrendingUp className="h-3.5 w-3.5" />
                  <span>{savedCount} saved</span>
                </div>
              )}
            </div>
          </div>

          {/* RIGHT */}
          <div className="flex items-center gap-4">
            <div className="text-right">
              <p className="text-xs text-muted-foreground">Base Price</p>
              <p className="font-bold text-primary">
                {listing.basePrice
                  ? formatCurrency(listing.basePrice)
                  : "N/A"}
              </p>

              {listing.highestBid && (
                <>
                  <p className="text-xs text-muted-foreground mt-1">
                    Highest Bid
                  </p>
                  <p className="font-semibold text-sm text-green-600">
                    {formatCurrency(listing.highestBid)}
                  </p>
                </>
              )}
            </div>

            <ExternalLink className="h-4 w-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
          </div>
        </div>
      </div>
    </Link>
  );
}

/* =========================
   TYPES
========================= */

interface Listing {
  id: string;
  title: string;
  status: string;
  basePrice: number | null;
  highestBid: number | null;
  endDate: Date | string | null;
  startDate: Date | string | null;
  _count?: {
    bids: number;
    savedBy: number;
  };
}

interface ListingsSectionProps {
  listings: Listing[];
  landId: string;
}

/* =========================
   MAIN COMPONENT
========================= */

export function ListingsSection({
  listings,
  landId,
}: ListingsSectionProps) {
  return (
    <div className="relative mt-6">

      {/* 🔥 CAPSULE CONTAINER */}
      <div
        className="
          absolute inset-0 rounded-[70px]
          border border-[#b7cf8a]/20
          shadow-[0_18px_48px_rgba(0,0,0,0.10),0_6px_16px_rgba(0,0,0,0.06)]
          backdrop-blur-2xl
          bg-white/30 dark:bg-white/5
        "
      />

      {/* CONTENT */}
      <div className="relative z-10 px-6 md:px-10 py-10 md:py-12 space-y-6">

        {/* HEADER */}
        <div className="flex items-center justify-between">
          <h2 className="font-semibold text-xl tracking-tight">
            Listings
          </h2>

          <Button
            asChild
            size="sm"
            className="rounded-full px-4"
          >
            <Link href={`/landowner/land/new`}>
              <Plus className="h-4 w-4 mr-1" />
              Create Listing
            </Link>
          </Button>
        </div>

        {/* CONTENT */}
        {listings.length === 0 ? (
          <EmptyState
            title="No listings yet"
            description="Create your first listing to start renting out your land"
            action={{
              label: "Create Listing",
              href: `/landowner/land/${landId}/create-listing`,
            }}
          />
        ) : (
          <div className="space-y-4">
            {listings.map((listing) => (
              <ListingCard key={listing.id} listing={listing} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}