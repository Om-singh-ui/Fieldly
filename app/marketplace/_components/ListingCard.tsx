"use client"

import { useEffect, useMemo, useRef, useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  MapPin,
  Droplets,
  Timer,
  ChevronLeft,
  ChevronRight,
  Heart,
  Zap,
  Users,
  Clock,
} from "lucide-react"
import { SavedButton } from "./SavedButton"
import { VerifiedBadge } from "./VerifiedBadge"
import { formatCurrency, formatTimeLeft, cn, getInitials } from "@/lib/utils"
import { MarketplaceFeedItem } from "@/types/marketplace"

const LAND_PLACEHOLDER = "/images/placeholder-land.jpg"

export interface ListingCardProps {
  listing: MarketplaceFeedItem
  isSaved?: boolean
  onSaveAction?: () => void
  className?: string
}

export function ListingCard({
  listing,
  isSaved,
  onSaveAction,
  className,
}: ListingCardProps) {
  const [timeLeft, setTimeLeft] = useState(0)
  const [index, setIndex] = useState(0)
  const [manual, setManual] = useState(false)
  const [isHovered, setIsHovered] = useState(false)
  const [imageError, setImageError] = useState<Record<number, boolean>>({})

  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const touchStart = useRef<number | null>(null)

  // ✅ stable images list
  const images = useMemo(() => {
    // Use images from land first, then from listing if available
    const landImgs = listing.land?.images?.map(i => i.url) ?? []
    const listingImgs = listing.images?.map(i => i.url) ?? []
    const merged = [...landImgs, ...listingImgs].filter(Boolean)
    return merged.length ? merged : [LAND_PLACEHOLDER]
  }, [listing.land?.images, listing.images])

  // ✅ timer
  useEffect(() => {
    const update = () => {
      const remaining =
        new Date(listing.endDate).getTime() - new Date().getTime()
      setTimeLeft(Math.max(0, remaining))
    }

    update()
    const timer = setInterval(update, 1000)

    return () => clearInterval(timer)
  }, [listing.endDate])

  // ✅ auto slider
  useEffect(() => {
    if (manual || images.length <= 1 || !isHovered) return

    intervalRef.current = setInterval(() => {
      setIndex(i => (i + 1) % images.length)
    }, 4000)

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current)
    }
  }, [manual, images.length, isHovered])

  const prev = (e?: React.MouseEvent) => {
    e?.preventDefault()
    e?.stopPropagation()
    setManual(true)
    setIndex(i => (i === 0 ? images.length - 1 : i - 1))
  }

  const next = (e?: React.MouseEvent) => {
    e?.preventDefault()
    e?.stopPropagation()
    setManual(true)
    setIndex(i => (i + 1) % images.length)
  }

  // ✅ swipe support
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStart.current = e.touches[0].clientX
  }

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStart.current === null) return

    const diff = touchStart.current - e.changedTouches[0].clientX

    if (Math.abs(diff) > 50) {
      setManual(true)
      if (diff > 0) {
        next()
      } else {
        prev()
      }
    }

    touchStart.current = null
  }

  const handleImageError = (imageIndex: number) => {
    setImageError(prev => ({ ...prev, [imageIndex]: true }))
  }

  const getImageSrc = (imageIndex: number) => {
    if (imageError[imageIndex]) {
      return LAND_PLACEHOLDER
    }
    return images[imageIndex]
  }

  const isLive = listing.auctionStatus === "LIVE" && timeLeft > 0
  const isEndingSoon = timeLeft > 0 && timeLeft < 24 * 60 * 60 * 1000 // Less than 24 hours
  const bidCount = listing._count?.bids || 0
  const savedCount = listing._count?.savedBy || 0

  return (
    <Card
      className={cn(
        "group overflow-hidden hover:shadow-xl transition-all duration-300",
        "border border-border/50 hover:border-primary/20",
        className
      )}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => {
        setIsHovered(false)
        setManual(false)
      }}
    >
      <Link href={`/marketplace/listings/${listing.id}`} className="block">
        {/* Image Container */}
        <div
          className="relative h-52 w-full overflow-hidden bg-muted/20"
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
        >
          <Image
            src={getImageSrc(index)}
            alt={listing.title}
            fill
            className={cn(
              "object-cover transition-all duration-700",
              isHovered ? "scale-110" : "scale-100"
            )}
            onError={() => handleImageError(index)}
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            priority={index === 0}
          />

          {/* Image Counter */}
          {images.length > 1 && (
            <div className="absolute bottom-2 left-2 z-10">
              <Badge variant="secondary" className="bg-black/50 text-white border-0 backdrop-blur-sm">
                {index + 1}/{images.length}
              </Badge>
            </div>
          )}

          {/* Navigation Arrows - Only show on hover */}
          {images.length > 1 && isHovered && (
            <>
              <button
                onClick={prev}
                className="absolute left-2 top-1/2 -translate-y-1/2 z-20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                aria-label="Previous image"
              >
                <ChevronLeft className="text-white bg-black/60 hover:bg-black/80 rounded-full p-1.5 w-8 h-8 backdrop-blur-sm transition-colors" />
              </button>

              <button
                onClick={next}
                className="absolute right-2 top-1/2 -translate-y-1/2 z-20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                aria-label="Next image"
              >
                <ChevronRight className="text-white bg-black/60 hover:bg-black/80 rounded-full p-1.5 w-8 h-8 backdrop-blur-sm transition-colors" />
              </button>
            </>
          )}

          {/* Status Badges */}
          <div className="absolute top-2 left-2 flex flex-col gap-1 z-10">
            {isLive && (
              <Badge className="bg-green-500 hover:bg-green-600 text-white border-0 animate-pulse shadow-lg">
                <Zap className="w-3 h-3 mr-1 fill-current" />
                LIVE NOW
              </Badge>
            )}
            {isEndingSoon && !isLive && (
              <Badge variant="destructive" className="shadow-lg">
                <Clock className="w-3 h-3 mr-1" />
                Ending Soon
              </Badge>
            )}
            {listing.auctionStatus === "UPCOMING" && (
              <Badge variant="secondary" className="bg-blue-500 text-white border-0 shadow-lg">
                UPCOMING
              </Badge>
            )}
            {listing.land?.irrigationAvailable && (
              <Badge variant="secondary" className="bg-blue-100 text-blue-700 border-0 shadow-sm">
                <Droplets className="w-3 h-3 mr-1" />
                Irrigated
              </Badge>
            )}
          </div>

          {/* Save Button */}
          <SavedButton
            listingId={listing.id}
            initialSaved={isSaved}
            onToggle={onSaveAction}
            className="absolute top-2 right-2 z-10"
          />

          {/* Price Tag - Overlay on image */}
          <div className="absolute bottom-2 right-2 z-10">
            <Badge variant="secondary" className="bg-black/70 text-white border-0 backdrop-blur-sm py-1.5">
              <span className="font-bold text-lg">{formatCurrency(listing.basePrice)}</span>
              <span className="ml-1 text-xs opacity-80">start</span>
            </Badge>
          </div>
        </div>

        <CardContent className="p-4 space-y-3">
          {/* Title and Quick Stats */}
          <div className="space-y-1">
            <h3 className="font-semibold text-lg line-clamp-1 group-hover:text-primary transition-colors">
              {listing.title}
            </h3>
            
            <div className="flex items-center text-sm text-muted-foreground">
              <MapPin className="w-3.5 h-3.5 mr-1 flex-shrink-0" />
              <span className="truncate">
                {listing.land?.district}, {listing.land?.state}
              </span>
            </div>
          </div>

          {/* Land Details Chips */}
          <div className="flex flex-wrap gap-2">
            <Badge variant="outline" className="text-xs font-normal">
              {listing.land?.size} acres
            </Badge>
            <Badge variant="outline" className="text-xs font-normal capitalize">
              {listing.land?.landType?.toLowerCase()}
            </Badge>
          </div>

          {/* Owner Info */}
          <div className="flex items-center justify-between pt-2">
            <div className="flex items-center gap-2">
              <Avatar className="h-6 w-6 border border-border">
                <AvatarImage src={listing.owner?.imageUrl || ''} />
                <AvatarFallback className="text-xs bg-primary/10">
                  {getInitials(listing.owner?.name || 'U')}
                </AvatarFallback>
              </Avatar>
              <span className="text-sm font-medium line-clamp-1">
                {listing.owner?.name || 'Unknown'}
              </span>
              {listing.owner?.landownerProfile?.isVerified && (
                <VerifiedBadge size="sm" />
              )}
            </div>
            
            {/* Bid Count */}
            <div className="flex items-center gap-1 text-sm text-muted-foreground">
              <Users className="w-3.5 h-3.5" />
              <span>{bidCount} {bidCount === 1 ? 'bid' : 'bids'}</span>
            </div>
          </div>

          {/* Stats Bar */}
          <div className="flex items-center justify-between pt-2 border-t border-border/50">
            {/* Starting Price */}
            <div className="flex-1">
              <p className="text-xs text-muted-foreground">Starting Price</p>
              <p className="font-semibold text-primary">
                {formatCurrency(listing.basePrice)}
              </p>
            </div>

            {/* Time Left */}
            {timeLeft > 0 && (
              <div className="flex-1 text-right">
                <p className="text-xs text-muted-foreground">Time Left</p>
                <p className={cn(
                  "font-semibold flex items-center justify-end gap-1",
                  isLive ? "text-green-600" : isEndingSoon ? "text-orange-600" : "text-muted-foreground"
                )}>
                  <Timer className="w-3.5 h-3.5" />
                  {formatTimeLeft(timeLeft)}
                </p>
              </div>
            )}

            {/* Saved Count */}
            {savedCount > 0 && (
              <div className="flex-1 text-right">
                <p className="text-xs text-muted-foreground">Saved</p>
                <p className="font-semibold flex items-center justify-end gap-1">
                  <Heart className="w-3.5 h-3.5 fill-red-500 text-red-500" />
                  {savedCount}
                </p>
              </div>
            )}
          </div>

          {/* Marketplace Score (if available) - REPLACED WITH bg-[#b7cf8a] */}
          {listing.marketplaceScore && (
            <div className="flex items-center gap-1 text-xs text-gray-700 bg-[#b7cf8a] px-2 py-1 rounded-md">
              <span>Popular</span>
              <span className="ml-auto">Score: {Math.round(listing.marketplaceScore)}</span>
            </div>
          )}
        </CardContent>
      </Link>
    </Card>
  )
}