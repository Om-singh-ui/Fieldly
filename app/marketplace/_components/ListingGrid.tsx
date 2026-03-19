'use client'

import { useRef, useCallback } from 'react'
import { ListingCard } from './ListingCard'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { MarketplaceFeedItem } from '@/types/marketplace'
import { Loader2 } from 'lucide-react'

interface ListingGridProps {
  listings: MarketplaceFeedItem[]
  savedListings: Set<string>
  onSave: (id: string) => void
  onLoadMore: () => void
  hasMore: boolean
  loading: boolean
}

export function ListingGrid({
  listings,
  savedListings,
  onSave,
  onLoadMore,
  hasMore,
  loading
}: ListingGridProps) {

  const observer = useRef<IntersectionObserver | null>(null)

  const lastListingRef = useCallback((node: HTMLDivElement | null) => {
    if (loading) return

    if (observer.current) observer.current.disconnect()

    observer.current = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting && hasMore) {
          onLoadMore()
        }
      },
      {
        rootMargin: '200px' // smoother infinite scroll
      }
    )

    if (node) observer.current.observe(node)
  }, [loading, hasMore, onLoadMore])

  // Skeleton State
  if (listings.length === 0 && loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="space-y-3">
            <Skeleton className="h-48 w-full rounded-lg" />
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-4 w-1/2" />
            <Skeleton className="h-4 w-full" />
          </div>
        ))}
      </div>
    )
  }

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {listings.map((listing, index) => {

          const isLast = index === listings.length - 1

          return (
            <div
              key={listing.id}
              ref={isLast ? lastListingRef : undefined}
            >
              <ListingCard
                listing={listing}
                isSaved={savedListings.has(listing.id)}
                onSaveAction={() => onSave(listing.id)}
              />
            </div>
          )
        })}
      </div>

      {/* Loading More Indicator */}
      {loading && listings.length > 0 && (
        <div className="flex justify-center mt-8">
          <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
        </div>
      )}

      {/* End of Results */}
      {!hasMore && listings.length > 0 && (
        <p className="text-center text-muted-foreground mt-8">
          You&apos;ve reached the end of the listings
        </p>
      )}

      {/* Load More Button (fallback) */}
      {hasMore && !loading && (
        <div className="flex justify-center mt-8">
          <Button onClick={onLoadMore} variant="outline">
            Load More
          </Button>
        </div>
      )}
    </>
  )
}