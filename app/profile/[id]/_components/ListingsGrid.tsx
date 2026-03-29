// app/profile/[id]/_components/ListingsGrid.tsx
"use client";

import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { MapPin, Gavel, TrendingUp, Clock, ChevronRight, Package } from "lucide-react";
import { ProfileListing } from "@/types/profile";
import { useState, useMemo } from "react";

interface Props {
  listings: ProfileListing[];
}

type SortOption = "latest" | "price_asc" | "price_desc" | "most_bids" | "ending_soon";

export function ListingsGrid({ listings }: Props) {
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<SortOption>("latest");

  const sortedListings = useMemo(() => {
    const sorted = [...listings];
    switch (sortBy) {
      case "price_asc":
        return sorted.sort((a, b) => a.basePrice - b.basePrice);
      case "price_desc":
        return sorted.sort((a, b) => b.basePrice - a.basePrice);
      case "most_bids":
        return sorted.sort((a, b) => b.totalBids - a.totalBids);
      case "ending_soon":
        return sorted.sort((a, b) => {
          const dateA = a.endDate instanceof Date ? a.endDate : new Date(a.endDate);
          const dateB = b.endDate instanceof Date ? b.endDate : new Date(b.endDate);
          return dateA.getTime() - dateB.getTime();
        });
      case "latest":
      default:
        return sorted.sort((a, b) => {
          const dateA = a.createdAt instanceof Date ? a.createdAt : new Date(a.createdAt);
          const dateB = b.createdAt instanceof Date ? b.createdAt : new Date(b.createdAt);
          return dateB.getTime() - dateA.getTime();
        });
    }
  }, [listings, sortBy]);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  const sortOptions = [
    { value: "latest", label: "Latest" },
    { value: "price_asc", label: "Price: Low to High" },
    { value: "price_desc", label: "Price: High to Low" },
    { value: "most_bids", label: "Most Bids" },
    { value: "ending_soon", label: "Ending Soon" },
  ];

  const getTimeRemaining = (endDate: Date | string) => {
    const end = endDate instanceof Date ? endDate : new Date(endDate);
    const now = new Date();
    const diff = end.getTime() - now.getTime();
    
    if (diff <= 0) return "Ended";
    
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    
    if (days > 0) return `${days}d ${hours}h left`;
    if (hours > 0) return `${hours}h left`;
    return "Ending soon";
  };

  return (
    <div className="space-y-6">
      {/* Header with stats and sorting */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-semibold tracking-tight">
            Active Listings
          </h2>
          <p className="text-sm text-muted-foreground mt-1">
            {listings.length} {listings.length === 1 ? 'listing' : 'listings'} available
          </p>
        </div>
        
        {listings.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {sortOptions.map((option) => (
              <button
                key={option.value}
                onClick={() => setSortBy(option.value as SortOption)}
                className={`px-3 py-1.5 text-xs font-medium rounded-lg border transition-all duration-200 ${
                  sortBy === option.value
                    ? "bg-primary text-primary-foreground border-primary"
                    : "hover:bg-accent"
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>
        )}
      </div>

      <AnimatePresence mode="wait">
        {listings.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="text-center py-16 rounded-2xl border-2 border-dashed bg-muted/20"
          >
            <Package className="w-12 h-12 mx-auto text-muted-foreground/40 mb-3" />
            <p className="text-muted-foreground font-medium">
              No active listings yet
            </p>
            <p className="text-sm text-muted-foreground/60 mt-1">
              Listings will appear here once published
            </p>
          </motion.div>
        ) : (
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="grid md:grid-cols-2 lg:grid-cols-3 gap-5"
          >
            {sortedListings.map((listing) => (
              <motion.div
                key={listing.id}
                variants={itemVariants}
                layout
                onHoverStart={() => setHoveredId(listing.id)}
                onHoverEnd={() => setHoveredId(null)}
              >
                <Link href={`/marketplace/listings/${listing.id}`}>
                  <div className="group relative rounded-2xl border bg-card overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                    {/* Image Section */}
                    <div className="relative h-48 bg-gradient-to-br from-primary/5 to-primary/10 overflow-hidden">
                      {listing.images?.[0]?.url ? (
                        <Image
                          src={listing.images[0].url}
                          alt={listing.title}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <Package className="w-12 h-12 text-muted-foreground/30" />
                        </div>
                      )}
                      
                      {/* Badges */}
                      <div className="absolute top-3 left-3 flex gap-2">
                        {listing.isUrgent && (
                          <span className="px-2 py-1 text-xs font-medium bg-red-500 text-white rounded-lg shadow-sm">
                            Urgent
                          </span>
                        )}
                        {listing.hotnessScore && listing.hotnessScore > 70 && (
                          <span className="px-2 py-1 text-xs font-medium bg-orange-500 text-white rounded-lg shadow-sm flex items-center gap-1">
                            <TrendingUp className="w-3 h-3" />
                            Hot
                          </span>
                        )}
                      </div>
                      
                      {/* Time remaining badge */}
                      <div className="absolute bottom-3 right-3">
                        <span className="px-2 py-1 text-xs font-medium bg-black/50 backdrop-blur-sm text-white rounded-lg flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {getTimeRemaining(listing.endDate)}
                        </span>
                      </div>
                    </div>

                    {/* Content */}
                    <div className="p-4 space-y-3">
                      <h3 className="font-semibold line-clamp-1 group-hover:text-primary transition-colors">
                        {listing.title}
                      </h3>
                      
                      <div className="flex items-center gap-4 text-sm">
                        <div className="flex items-center gap-1 text-muted-foreground">
                          <MapPin className="w-3.5 h-3.5" />
                          <span className="text-xs">{listing.land?.village ?? "Location not specified"}</span>
                        </div>
                        <div className="flex items-center gap-1 text-muted-foreground">
                          <Gavel className="w-3.5 h-3.5" />
                          <span className="text-xs">{listing.totalBids} bids</span>
                        </div>
                      </div>

                      {/* Land details */}
                      {listing.land?.size && (
                        <div className="text-xs text-muted-foreground">
                          {listing.land.size} acres · {listing.land.landType?.toLowerCase()}
                        </div>
                      )}

                      <div className="flex items-center justify-between pt-2 border-t">
                        <div>
                          <p className="text-xs text-muted-foreground">Base Price</p>
                          <p className="text-lg font-bold text-primary">
                            ₹{listing.basePrice.toLocaleString()}
                            <span className="text-xs font-normal text-muted-foreground">/year</span>
                          </p>
                        </div>
                        
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: hoveredId === listing.id ? 1 : 0 }}
                          className="text-primary"
                        >
                          <ChevronRight className="w-5 h-5" />
                        </motion.div>
                      </div>

                      {/* Bid progress */}
                      {listing.maxBids && listing.totalBids > 0 && (
                        <div className="mt-2">
                          <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                            <motion.div
                              initial={{ width: 0 }}
                              animate={{ width: `${Math.min((listing.totalBids / listing.maxBids) * 100, 100)}%` }}
                              className="h-full bg-primary rounded-full"
                            />
                          </div>
                          <p className="text-xs text-muted-foreground mt-1">
                            {listing.totalBids} of {listing.maxBids} bids
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}