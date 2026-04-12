// app/(marketplace)/page.tsx
"use client";

import { useState } from "react";
import { ListingGrid } from "./_components/ListingGrid";
import { 
  ListingFiltersSidebar, 
  ActiveFilters, 
  MarketplaceHeader 
} from "./_components/ListingFiltersSidebar";
import { useMarketplace } from "@/hooks/useMarketplace";
import { Button } from "@/components/ui/button";
import { formatNumber } from "@/lib/utils";
import { MarketplaceFilters } from "@/types/marketplace";

function MarketplaceSkeleton() {
  return (
    <div className="space-y-6 mt-18 px-4 sm:px-6 lg:px-8">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <div className="h-9 w-48 bg-gray-200 rounded-md animate-pulse" />
          <div className="h-5 w-80 bg-gray-200 rounded-md mt-2 animate-pulse" />
        </div>
        <div className="flex items-center gap-2">
          <div className="h-10 w-full md:w-80 bg-gray-200 rounded-md animate-pulse" />
          <div className="h-10 w-[140px] sm:w-[180px] bg-gray-200 rounded-md animate-pulse" />
          <div className="h-10 w-10 bg-gray-200 rounded-md animate-pulse lg:hidden" />
        </div>
      </div>
      <div className="flex gap-6 lg:gap-8">
        <div className="hidden lg:block w-64 xl:w-72 flex-shrink-0">
          <div className="sticky top-24 space-y-6">
            <div className="h-6 w-24 bg-gray-200 rounded-md animate-pulse" />
            <div className="space-y-4">
              <div className="h-10 w-full bg-gray-200 rounded-md animate-pulse" />
              <div className="h-20 w-full bg-gray-200 rounded-md animate-pulse" />
            </div>
          </div>
        </div>
        <div className="flex-1 min-w-0">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="h-[400px] bg-gray-200 rounded-lg animate-pulse" />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function MarketplacePage() {
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  
  // ✅ FIXED: Use lazy initial state instead of useEffect
  const [mounted] = useState(() => {
    if (typeof window !== "undefined") {
      return true;
    }
    return false;
  });

  const {
    listings,
    loading,
    error,
    hasMore,
    filters,
    setFilters,
    loadMore,
    toggleSave,
    savedListings,
  } = useMarketplace();

  const clearAllFilters = () => {
    setFilters({ sortBy: filters.sortBy });
  };

  const removeFilter = (key: keyof MarketplaceFilters) => {
    const newFilters = { ...filters };
    delete newFilters[key];
    setFilters(newFilters);
  };

  if (!mounted) {
    return <MarketplaceSkeleton />;
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] mt-18">
        <p className="text-destructive mb-4">{error}</p>
        <Button onClick={() => window.location.reload()}>Try Again</Button>
      </div>
    );
  }

  return (
    <div className="space-y-6 mt-18 px-4 sm:px-6 lg:px-8">
      <MarketplaceHeader
        filters={filters}
        onFiltersChange={setFilters}
        mobileFiltersOpen={mobileFiltersOpen}
        onMobileFiltersOpenChange={setMobileFiltersOpen}
      />

      <ActiveFilters
        filters={filters}
        onRemoveFilter={removeFilter}
        onClearAll={clearAllFilters}
        formatNumber={formatNumber}
      />

      <div className="flex gap-6 lg:gap-8">
        <ListingFiltersSidebar filters={filters} onChange={setFilters} />

        <div className="flex-1 min-w-0">
          {listings.length === 0 && !loading ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground">No listings found</p>
              <Button variant="link" onClick={clearAllFilters} className="mt-2">
                Clear filters
              </Button>
            </div>
          ) : (
            <ListingGrid
              listings={listings}
              savedListings={savedListings}
              onSave={toggleSave}
              onLoadMore={loadMore}
              hasMore={hasMore}
              loading={loading}
            />
          )}
        </div>
      </div>  
    </div>
  );
}