// app/(marketplace)/page.tsx
"use client";

import { useState, useEffect } from "react";
import { ListingGrid } from "./_components/ListingGrid";
import { ListingFilters } from "./_components/ListingFilters";
import { useMarketplace } from "@/hooks/useMarketplace";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Search, SlidersHorizontal, X } from "lucide-react";
import { SORT_OPTIONS } from "@/lib/constants";
import { formatNumber } from "@/lib/utils";
import { MarketplaceFilters } from "@/types/marketplace";

// Hydration-safe wrapper component with fixed setState issue
function HydrationSafe({
  children,
  fallback,
}: {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // Use setTimeout to avoid synchronous setState warning
    const timer = setTimeout(() => {
      setMounted(true);
    }, 0);

    // Clean up browser extension attributes after mount
    const cleanupFdProcessedIds = () => {
      const elements = document.querySelectorAll("[fdprocessedid]");
      elements.forEach((el) => {
        el.removeAttribute("fdprocessedid");
      });
    };

    cleanupFdProcessedIds();

    const observer = new MutationObserver((mutations) => {
      let needsCleanup = false;
      mutations.forEach((mutation) => {
        if (
          mutation.type === "attributes" &&
          mutation.attributeName === "fdprocessedid"
        ) {
          needsCleanup = true;
        }
        if (mutation.type === "childList") {
          mutation.addedNodes.forEach((node) => {
            if (node instanceof Element && node.hasAttribute("fdprocessedid")) {
              needsCleanup = true;
            }
          });
        }
      });
      if (needsCleanup) cleanupFdProcessedIds();
    });

    observer.observe(document.body, {
      attributes: true,
      childList: true,
      subtree: true,
      attributeFilter: ["fdprocessedid"],
    });

    return () => {
      clearTimeout(timer);
      observer.disconnect();
    };
  }, []);

  if (!mounted) {
    return fallback || <div className="animate-pulse bg-gray-100 rounded-md" />;
  }

  return <>{children}</>;
}

// Skeleton component for loading state
function MarketplaceSkeleton() {
  return (
    <div className="space-y-6 mt-18">
      {/* Header Skeleton */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <div className="h-9 w-48 bg-gray-200 rounded-md animate-pulse" />
          <div className="h-5 w-80 bg-gray-200 rounded-md mt-2 animate-pulse" />
        </div>
        <div className="flex items-center gap-2">
          <div className="h-10 w-80 bg-gray-200 rounded-md animate-pulse" />
          <div className="h-10 w-[180px] bg-gray-200 rounded-md animate-pulse" />
          <div className="h-10 w-10 bg-gray-200 rounded-md animate-pulse lg:hidden" />
        </div>
      </div>

      {/* Active Filters Skeleton */}
      <div className="flex flex-wrap gap-2">
        <div className="h-6 w-24 bg-gray-200 rounded-full animate-pulse" />
        <div className="h-6 w-24 bg-gray-200 rounded-full animate-pulse" />
      </div>

      {/* Main Content Grid Skeleton */}
      <div className="flex gap-8">
        {/* Sidebar Skeleton */}
        <div className="hidden lg:block w-72 flex-shrink-0">
          <div className="sticky top-24 space-y-6">
            <div className="space-y-4">
              <div className="h-6 w-24 bg-gray-200 rounded-md animate-pulse" />
              <div className="h-10 w-full bg-gray-200 rounded-md animate-pulse" />
              <div className="h-10 w-full bg-gray-200 rounded-md animate-pulse" />
              <div className="h-10 w-full bg-gray-200 rounded-md animate-pulse" />
            </div>
          </div>
        </div>

        {/* Grid Skeleton */}
        <div className="flex-1">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div
                key={i}
                className="h-[400px] bg-gray-200 rounded-lg animate-pulse"
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function MarketplacePage() {
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
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

  // Initialize mounted state with lazy initialization to avoid effect
  const [mounted, setMounted] = useState(false);

  // Use setTimeout to avoid synchronous setState warning
  useEffect(() => {
    const timer = setTimeout(() => {
      setMounted(true);
    }, 0);
    return () => clearTimeout(timer);
  }, []);

  // Count active filters properly
  const activeFilterCount = Object.entries(filters).filter(([key, value]) => {
    if (key === "sortBy") return false; // Don't count sortBy as a filter
    return value !== undefined && value !== "" && value !== null;
  }).length;

  // Handle sortBy change with proper typing
  const handleSortChange = (value: string) => {
    setFilters({
      ...filters,
      sortBy: value as MarketplaceFilters["sortBy"],
    });
  };

  // Clear all filters
  const clearAllFilters = () => {
    setFilters({ sortBy: filters.sortBy }); // Preserve sort order
  };

  // Remove a specific filter
  const removeFilter = (key: keyof MarketplaceFilters) => {
    const newFilters = { ...filters };
    delete newFilters[key];
    setFilters(newFilters);
  };

  // Don't render anything during SSR to prevent hydration mismatch
  if (!mounted) {
    return <MarketplaceSkeleton />;
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px]">
        <p className="text-destructive mb-4">{error}</p>
        <Button onClick={() => window.location.reload()}>Try Again</Button>
      </div>
    );
  }

  return (
    <HydrationSafe fallback={<MarketplaceSkeleton />}>
      <div className="space-y-6 mt-18">
        {/* Header with Search and Filters */}
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          {/* Header with Search and Filters */}
          <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
            {/* Left Content */}
            <div className="space-y-1">
              <h1
                className="
      text-3xl md:text-4xl 
      font-bold tracking-tight 
      text-gray-900
    "
              >
                Marketplace
              </h1>

              <p className="text-sm md:text-base text-gray-500 mt-2">
                Discover and bid on agricultural land listings!
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Search Input - Hydration Safe */}
            <div className="relative flex-1 md:w-80">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search listings..."
                value={filters.search || ""}
                onChange={(e) =>
                  setFilters({
                    ...filters,
                    search: e.target.value || undefined,
                  })
                }
                className="pl-9"
                suppressHydrationWarning
              />
            </div>

            {/* Sort Select */}
            <Select
              value={filters.sortBy || "hotnessScore"}
              onValueChange={handleSortChange}
            >
              <SelectTrigger className="w-[180px]" suppressHydrationWarning>
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                {SORT_OPTIONS.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Mobile Filters Button */}
            <Sheet open={mobileFiltersOpen} onOpenChange={setMobileFiltersOpen}>
              <SheetTrigger asChild>
                <Button variant="outline" className="lg:hidden relative">
                  <SlidersHorizontal className="h-4 w-4" />
                  {activeFilterCount > 0 && (
                    <Badge
                      variant="secondary"
                      className="absolute -top-2 -right-2 h-5 w-5 p-0 flex items-center justify-center text-xs"
                    >
                      {activeFilterCount}
                    </Badge>
                  )}
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-full sm:max-w-lg">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-lg font-semibold">Filters</h2>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setMobileFiltersOpen(false)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
                <ListingFilters filters={filters} onChange={setFilters} />
              </SheetContent>
            </Sheet>
          </div>
        </div>

        {/* Active Filters */}
        {activeFilterCount > 0 && (
          <div className="flex flex-wrap gap-2">
            {filters.search && (
              <Badge variant="secondary" className="gap-1">
                Search: {filters.search}
                <button
                  onClick={() => removeFilter("search")}
                  className="ml-1 hover:text-destructive"
                >
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            )}
            {filters.landType && (
              <Badge variant="secondary" className="gap-1">
                Type: {filters.landType}
                <button
                  onClick={() => removeFilter("landType")}
                  className="ml-1 hover:text-destructive"
                >
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            )}
            {filters.state && (
              <Badge variant="secondary" className="gap-1">
                State: {filters.state}
                <button
                  onClick={() => removeFilter("state")}
                  className="ml-1 hover:text-destructive"
                >
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            )}
            {filters.district && (
              <Badge variant="secondary" className="gap-1">
                District: {filters.district}
                <button
                  onClick={() => removeFilter("district")}
                  className="ml-1 hover:text-destructive"
                >
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            )}
            {filters.minPrice !== undefined && filters.minPrice !== null && (
              <Badge variant="secondary" className="gap-1">
                Min: ₹{formatNumber(filters.minPrice)}
                <button
                  onClick={() => removeFilter("minPrice")}
                  className="ml-1 hover:text-destructive"
                >
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            )}
            {filters.maxPrice !== undefined && filters.maxPrice !== null && (
              <Badge variant="secondary" className="gap-1">
                Max: ₹{formatNumber(filters.maxPrice)}
                <button
                  onClick={() => removeFilter("maxPrice")}
                  className="ml-1 hover:text-destructive"
                >
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            )}
            {filters.minSize !== undefined && filters.minSize !== null && (
              <Badge variant="secondary" className="gap-1">
                Min Size: {filters.minSize} acres
                <button
                  onClick={() => removeFilter("minSize")}
                  className="ml-1 hover:text-destructive"
                >
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            )}
            {filters.maxSize !== undefined && filters.maxSize !== null && (
              <Badge variant="secondary" className="gap-1">
                Max Size: {filters.maxSize} acres
                <button
                  onClick={() => removeFilter("maxSize")}
                  className="ml-1 hover:text-destructive"
                >
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            )}
            <Button
              variant="ghost"
              size="sm"
              onClick={clearAllFilters}
              className="h-7 px-2 text-xs"
            >
              Clear all
            </Button>
          </div>
        )}

        {/* Main Content Grid */}
        <div className="flex gap-8">
          {/* Desktop Filters Sidebar */}
          <aside className="hidden lg:block w-72 flex-shrink-0">
            <div className="sticky top-24 space-y-6">
              <ListingFilters filters={filters} onChange={setFilters} />
            </div>
          </aside>

          {/* Listings Grid */}
          <div className="flex-1">
            {listings.length === 0 && !loading ? (
              <div className="text-center py-12">
                <p className="text-muted-foreground">No listings found</p>
                <Button
                  variant="link"
                  onClick={clearAllFilters}
                  className="mt-2"
                >
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
    </HydrationSafe>
  );
}
