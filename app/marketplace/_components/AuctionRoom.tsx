// app/(marketplace)/_components/AuctionRoom.tsx
'use client'

import { useState } from 'react'
import { useAuction } from '@/hooks/useAuction'
import { BidForm } from './BidForm'
import { BidHistory } from './BidHistory'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { 
  Timer, 
  Users, 
  TrendingUp, 
  Award,
  Zap,
  Clock,
  AlertCircle,
  RefreshCw
} from 'lucide-react'
import { formatCurrency, formatTimeLeft } from '@/lib/utils'
import { useToast } from '@/hooks/use-toast'

export interface Bid {
  id: string
  amount: number
  farmerId: string
  createdAt: string | Date
  isAutoBid?: boolean
  farmer?: {
    id: string
    name: string
    imageUrl?: string | null
  }
}

// EXPORT this interface
export interface AuctionRoomProps {
  listingId: string
  initialData: {
    id: string
    title: string
    description?: string | null
    basePrice: number
    reservePrice?: number | null
    bidIncrement?: number | null
    endDate: string
    auctionStatus: string
    autoExtendMinutes?: number | null
    winningBidId?: string | null
    currentLeaderId?: string | null
    highestBid?: number | null
    winningBid?: {
      id: string
      amount: number
      farmer: {
        id: string
        name: string
      }
    } | null
    _count?: {
      bids: number
    }
    bids?: Bid[]
  }
}

export function AuctionRoom({ listingId, initialData }: AuctionRoomProps) {
  const [, setRefreshKey] = useState(0)
  const { toast } = useToast()
  
  const {
    auction,
    bids,
    loading,
    placeBid,
    timeRemaining,
    isLive,
    error
  } = useAuction(listingId)

  // Use initial data or real-time data
  const currentAuction = auction || initialData
  const currentBids = bids.length > 0 ? bids : (currentAuction?.bids || [])
  const highestBid = currentBids[0]?.amount || currentAuction?.basePrice || 0
  const minNextBid = highestBid + (currentAuction?.bidIncrement || 1000)

  const handleRefresh = () => {
    setRefreshKey(prev => prev + 1)
    toast({
      title: 'Refreshed',
      description: 'Auction data has been refreshed',
    })
  }

  if (!currentAuction) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <p className="text-muted-foreground">Auction not found</p>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Error Banner */}
      {error && (
        <div className="mb-4 p-4 bg-destructive/10 border border-destructive rounded-lg flex items-center gap-2 text-destructive">
          <AlertCircle className="h-4 w-4" />
          <p className="text-sm">{error}</p>
        </div>
      )}

      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold mb-2">{currentAuction.title}</h1>
          <div className="flex items-center gap-4">
            <Badge variant={isLive ? 'default' : 'secondary'} className="gap-1">
              {isLive ? (
                <>
                  <Zap className="h-3 w-3" />
                  LIVE AUCTION
                </>
              ) : (
                'AUCTION ENDED'
              )}
            </Badge>
            <span className="text-sm text-muted-foreground">
              Listing ID: {listingId}
            </span>
          </div>
        </div>
        <Button variant="outline" size="sm" onClick={handleRefresh} className="gap-2">
          <RefreshCw className="h-4 w-4" />
          Refresh
        </Button>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Bidding Area */}
        <div className="lg:col-span-2 space-y-6">
          {/* Current Status Card */}
          <Card className="p-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              <div>
                <p className="text-sm text-muted-foreground">Current Bid</p>
                <p className="text-2xl font-bold text-primary">
                  {formatCurrency(highestBid)}
                </p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Your Bid</p>
                <p className="text-2xl font-bold">
                  {formatCurrency(0)}
                </p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Time Left</p>
                <p className="text-2xl font-bold flex items-center gap-1">
                  <Timer className="h-5 w-5 text-muted-foreground" />
                  {formatTimeLeft(timeRemaining)}
                </p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Bids</p>
                <p className="text-2xl font-bold">
                  {currentAuction._count?.bids || 0}
                </p>
              </div>
            </div>

            {/* Bid Form */}
            <BidForm
              minBid={minNextBid}
              bidIncrement={currentAuction.bidIncrement || 1000}
              isLive={isLive}
              loading={loading}
              onSubmit={placeBid}
            />
          </Card>

          {/* Bid History */}
          <BidHistory bids={currentBids} />
        </div>

        {/* Right Column - Auction Info */}
        <div className="space-y-6">
          {/* Auction Details */}
          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4">Auction Details</h2>
            <dl className="space-y-3">
              <div className="flex justify-between">
                <dt className="text-muted-foreground">Starting Price</dt>
                <dd className="font-medium">{formatCurrency(currentAuction.basePrice)}</dd>
              </div>
              {currentAuction.reservePrice && (
                <div className="flex justify-between">
                  <dt className="text-muted-foreground">Reserve Price</dt>
                  <dd className="font-medium">{formatCurrency(currentAuction.reservePrice)}</dd>
                </div>
              )}
              <div className="flex justify-between">
                <dt className="text-muted-foreground">Bid Increment</dt>
                <dd className="font-medium">{formatCurrency(currentAuction.bidIncrement || 1000)}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-muted-foreground">Ends At</dt>
                <dd className="font-medium">
                  {new Date(currentAuction.endDate).toLocaleString()}
                </dd>
              </div>
              {currentAuction.autoExtendMinutes && (
                <div className="flex justify-between">
                  <dt className="text-muted-foreground">Auto-extend</dt>
                  <dd className="font-medium">Yes ({currentAuction.autoExtendMinutes} min)</dd>
                </div>
              )}
            </dl>
          </Card>

          {/* Statistics */}
          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4">Statistics</h2>
            <dl className="space-y-3">
              <div className="flex justify-between">
                <dt className="text-muted-foreground flex items-center gap-1">
                  <Users className="h-4 w-4" />
                  Unique Bidders
                </dt>
                <dd className="font-medium">
                  {new Set(currentBids.map((b) => b.farmerId)).size}
                </dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-muted-foreground flex items-center gap-1">
                  <TrendingUp className="h-4 w-4" />
                  Bid Activity
                </dt>
                <dd className="font-medium">
                  {currentBids.length} total bids
                </dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-muted-foreground flex items-center gap-1">
                  <Award className="h-4 w-4" />
                  Winning Bid
                </dt>
                <dd className="font-medium">
                  {currentAuction.winningBid 
                    ? formatCurrency(currentAuction.winningBid.amount)
                    : 'Not yet'
                  }
                </dd>
              </div>
            </dl>
          </Card>

          {/* Auto-extend Notice */}
          {currentAuction.autoExtendMinutes && isLive && (
            <Card className="p-4 bg-blue-50 border-blue-200 dark:bg-blue-950 dark:border-blue-800">
              <p className="text-sm text-blue-700 dark:text-blue-300 flex items-center gap-2">
                <Clock className="h-4 w-4" />
                Auction auto-extends by {currentAuction.autoExtendMinutes} minutes 
                if a bid is placed in the last 5 minutes.
              </p>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}