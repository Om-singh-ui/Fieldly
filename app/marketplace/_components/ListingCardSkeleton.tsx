// app/(marketplace)/_components/ListingCardSkeleton.tsx
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export function ListingCardSkeleton() {
  return (
    <Card className="group overflow-hidden hover:shadow-xl transition-all duration-300 border border-border/50 hover:border-primary/20">
      {/* Image area - matches actual card height */}
      <div className="relative h-52 w-full overflow-hidden bg-muted/20">
        <Skeleton className="h-full w-full" />
        
        {/* Image counter - bottom left */}
        <div className="absolute bottom-2 left-2 z-10">
          <Skeleton className="h-6 w-12 rounded-full" />
        </div>
        
        {/* Status badges - top left */}
        <div className="absolute top-2 left-2 flex flex-col gap-1 z-10">
          <Skeleton className="h-6 w-20 rounded-full" />
          <Skeleton className="h-6 w-16 rounded-full" />
        </div>
        
        {/* Save button - top right */}
        <div className="absolute top-2 right-2 z-10">
          <Skeleton className="h-8 w-8 rounded-full" />
        </div>
        
        {/* Price tag - bottom right */}
        <div className="absolute bottom-2 right-2 z-10">
          <Skeleton className="h-8 w-24 rounded-full" />
        </div>
      </div>

      <CardContent className="p-4 space-y-3">
        {/* Title */}
        <Skeleton className="h-6 w-3/4" />
        
        {/* Location with map actions */}
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center text-sm min-w-0 flex-1">
            <Skeleton className="h-3.5 w-3.5 mr-1 flex-shrink-0 rounded-full" />
            <Skeleton className="h-4 w-2/3" />
          </div>
          <div className="flex gap-1 flex-shrink-0">
            <Skeleton className="h-6 w-6 rounded-md" />
            <Skeleton className="h-6 w-6 rounded-md" />
          </div>
        </div>
        
        {/* Land Details Chips */}
        <div className="flex flex-wrap gap-2">
          <Skeleton className="h-6 w-16 rounded-full" />
          <Skeleton className="h-6 w-20 rounded-full" />
        </div>
        
        {/* Owner Info + Bid Count */}
        <div className="flex items-center justify-between pt-2">
          <div className="flex items-center gap-2">
            <Skeleton className="h-6 w-6 rounded-full" />
            <Skeleton className="h-4 w-20" />
            <Skeleton className="h-3.5 w-3.5 rounded-full" />
          </div>
          <div className="flex items-center gap-1">
            <Skeleton className="h-3.5 w-3.5 rounded-full" />
            <Skeleton className="h-4 w-10" />
          </div>
        </div>
        
        {/* Stats Bar */}
        <div className="flex items-center justify-between pt-2 border-t border-border/50">
          <div className="flex-1">
            <Skeleton className="h-3 w-12 mb-1" />
            <Skeleton className="h-5 w-16" />
          </div>
          <div className="flex-1 text-right">
            <Skeleton className="h-3 w-12 ml-auto mb-1" />
            <div className="flex items-center justify-end gap-1">
              <Skeleton className="h-3.5 w-3.5 rounded-full" />
              <Skeleton className="h-4 w-14" />
            </div>
          </div>
          <div className="flex-1 text-right">
            <Skeleton className="h-3 w-10 ml-auto mb-1" />
            <div className="flex items-center justify-end gap-1">
              <Skeleton className="h-3.5 w-3.5 rounded-full" />
              <Skeleton className="h-4 w-8" />
            </div>
          </div>
        </div>
        
        {/* Marketplace Score */}
        <Skeleton className="h-7 w-full rounded-md" />
      </CardContent>
    </Card>
  );
}

export function ListingCardGridSkeleton({ count = 6 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {Array.from({ length: count }).map((_, i) => (
        <ListingCardSkeleton key={i} />
      ))}
    </div>
  );
}