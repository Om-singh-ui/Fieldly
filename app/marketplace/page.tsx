// app/(marketplace)/page.tsx
'use client'

import { useState } from 'react'
import { ListingGrid } from './_components/ListingGrid'
import { ListingFilters } from './_components/ListingFilters'
import { useMarketplace } from '@/hooks/useMarketplace'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet'
import { Search, SlidersHorizontal, X } from 'lucide-react'
import { SORT_OPTIONS } from '@/lib/constants'
import { formatNumber } from '@/lib/utils'
import { MarketplaceFilters } from '@/types/marketplace'

export default function MarketplacePage() {
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false)
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
  } = useMarketplace()

  // FIXED: Count active filters properly - using proper parameter name
  const activeFilterCount = Object.entries(filters).filter(([value]) => 
    value !== undefined && value !== '' && value !== null
  ).length

  // FIXED: Handle sortBy change with proper typing
  const handleSortChange = (value: string) => {
    setFilters({ 
      ...filters, 
      sortBy: value as MarketplaceFilters['sortBy'] 
    })
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px]">
        <p className="text-destructive mb-4">{error}</p>
        <Button onClick={() => window.location.reload()}>Try Again</Button>
      </div>
    )
  }

  return (
    <div className="space-y-6 mt-18">
      {/* Header with Search and Filters */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Marketplace</h1>
          <p className="text-muted-foreground">
            Discover and bid on agricultural land listings
          </p>
        </div>

        <div className="flex items-center gap-2">
          {/* Search Input */}
          <div className="relative flex-1 md:w-80">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search listings..."
              value={filters.search || ''}
              onChange={(e) => setFilters({ ...filters, search: e.target.value || null })}
              className="pl-9"
            />
          </div>

          {/* Sort Select - FIXED: Removed any type */}
          <Select
            value={filters.sortBy || 'hotnessScore'}
            onValueChange={handleSortChange}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              {SORT_OPTIONS.map(option => (
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
                    className="absolute -top-2 -right-2 h-5 w-5 p-0 flex items-center justify-center"
                  >
                    {activeFilterCount}
                  </Badge>
                )}
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-full sm:max-w-lg">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-semibold">Filters</h2>
                <Button variant="ghost" size="icon" onClick={() => setMobileFiltersOpen(false)}>
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
              <button onClick={() => setFilters({ ...filters, search: null })}>
                <X className="h-3 w-3" />
              </button>
            </Badge>
          )}
          {filters.landType && (
            <Badge variant="secondary" className="gap-1">
              Type: {filters.landType}
              <button onClick={() => setFilters({ ...filters, landType: null })}>
                <X className="h-3 w-3" />
              </button>
            </Badge>
          )}
          {filters.state && (
            <Badge variant="secondary" className="gap-1">
              State: {filters.state}
              <button onClick={() => setFilters({ ...filters, state: null })}>
                <X className="h-3 w-3" />
              </button>
            </Badge>
          )}
          {filters.minPrice && (
            <Badge variant="secondary" className="gap-1">
              Min: ₹{formatNumber(filters.minPrice)}
              <button onClick={() => setFilters({ ...filters, minPrice: undefined })}>
                <X className="h-3 w-3" />
              </button>
            </Badge>
          )}
          {filters.maxPrice && (
            <Badge variant="secondary" className="gap-1">
              Max: ₹{formatNumber(filters.maxPrice)}
              <button onClick={() => setFilters({ ...filters, maxPrice: undefined })}>
                <X className="h-3 w-3" />
              </button>
            </Badge>
          )}
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => setFilters({})}
            className="h-7 px-2"
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
                onClick={() => setFilters({})}
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
  )
}