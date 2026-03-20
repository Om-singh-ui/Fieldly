// app/(marketplace)/_components/ListingCardSkeleton.tsx
import { Card, CardContent } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'

export function ListingCardSkeleton() {
  return (
    <Card className="overflow-hidden border border-border/50">
      {/* Image area */}
      <div className="relative h-52 w-full bg-muted">
        <Skeleton className="h-full w-full" />
        
        {/* Mock status badge */}
        <div className="absolute top-2 left-2 z-10">
          <Skeleton className="h-6 w-20 rounded-full" />
        </div>
        
        {/* Mock image counter */}
        <div className="absolute bottom-2 left-2 z-10">
          <Skeleton className="h-6 w-12 rounded-full" />
        </div>
        
        {/* Mock price tag */}
        <div className="absolute bottom-2 right-2 z-10">
          <Skeleton className="h-8 w-24 rounded-full" />
        </div>
        
        {/* Mock save button */}
        <div className="absolute top-2 right-2 z-10">
          <Skeleton className="h-8 w-8 rounded-full" />
        </div>
      </div>

      <CardContent className="p-4 space-y-3">
        {/* Title skeleton */}
        <Skeleton className="h-6 w-3/4" />
        
        {/* Location skeleton with map button placeholder */}
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-1 flex-1 min-w-0">
            <Skeleton className="h-3.5 w-3.5 rounded-full flex-shrink-0" />
            <Skeleton className="h-4 w-2/3" />
          </div>
          <div className="flex gap-1">
            <Skeleton className="h-6 w-16 rounded-md" />
            <Skeleton className="h-6 w-20 rounded-md" />
          </div>
        </div>
        
        {/* Badges skeleton */}
        <div className="flex gap-2">
          <Skeleton className="h-6 w-20 rounded-full" />
          <Skeleton className="h-6 w-24 rounded-full" />
        </div>
        
        {/* Owner and bid count skeleton */}
        <div className="flex items-center justify-between pt-2">
          <div className="flex items-center gap-2">
            <Skeleton className="h-6 w-6 rounded-full" />
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-3.5 w-3.5 rounded-full" />
          </div>
          <div className="flex items-center gap-1">
            <Skeleton className="h-3.5 w-3.5 rounded-full" />
            <Skeleton className="h-4 w-12" />
          </div>
        </div>
        
        {/* Stats bar skeleton */}
        <div className="flex items-center justify-between pt-2 border-t">
          <div className="flex-1">
            <Skeleton className="h-3 w-16 mb-1" />
            <Skeleton className="h-5 w-20" />
          </div>
          <div className="flex-1 text-right">
            <Skeleton className="h-3 w-12 ml-auto mb-1" />
            <div className="flex justify-end gap-1">
              <Skeleton className="h-3.5 w-3.5 rounded-full" />
              <Skeleton className="h-4 w-16" />
            </div>
          </div>
          <div className="flex-1 text-right">
            <Skeleton className="h-3 w-12 ml-auto mb-1" />
            <div className="flex justify-end gap-1">
              <Skeleton className="h-3.5 w-3.5 rounded-full" />
              <Skeleton className="h-4 w-8" />
            </div>
          </div>
        </div>
        
        {/* Marketplace score skeleton */}
        <Skeleton className="h-8 w-full rounded-md" />
      </CardContent>
    </Card>
  )
}

export function ListingCardGridSkeleton({ count = 6 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {Array.from({ length: count }).map((_, i) => (
        <ListingCardSkeleton key={i} />
      ))}
    </div>
  )
}

// Optional: Skeleton for location view with map button
export function LocationSkeleton() {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <Skeleton className="h-6 w-32" />
        <div className="flex gap-2">
          <Skeleton className="h-8 w-24 rounded-md" />
          <Skeleton className="h-8 w-24 rounded-md" />
        </div>
      </div>
      <Skeleton className="h-[300px] w-full rounded-xl" />
      <div className="grid grid-cols-2 gap-4">
        <Skeleton className="h-20 w-full rounded-lg" />
        <Skeleton className="h-20 w-full rounded-lg" />
      </div>
    </div>
  )
}