// hooks/useAuction.ts
import { useState, useEffect, useCallback } from 'react'
import { usePusher, NewBidEvent, AuctionExtendedEvent } from './usePusher'
import { AuctionRoomData, Bid } from '@/types/marketplace'

interface UseAuctionReturn {
  auction: AuctionRoomData | null
  bids: Bid[]
  loading: boolean
  error: string | null
  placeBid: (amount: number, isAutoBid?: boolean) => Promise<void>
  timeRemaining: number
  isLive: boolean
}

export function useAuction(listingId: string): UseAuctionReturn {
  const [auction, setAuction] = useState<AuctionRoomData | null>(null)
  const [bids, setBids] = useState<Bid[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [timeRemaining, setTimeRemaining] = useState<number>(0)

  // Fetch initial auction data
  useEffect(() => {
    const fetchAuction = async () => {
      try {
        setLoading(true)
        const response = await fetch(`/api/marketplace/${listingId}/auction`)
        
        if (!response.ok) {
          throw new Error('Failed to fetch auction')
        }

        const data = await response.json()
        setAuction(data.listing)
        setBids(data.listing.bids)
        setTimeRemaining(data.stats.timeRemaining)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred')
      } finally {
        setLoading(false)
      }
    }

    fetchAuction()
  }, [listingId])

  // FIXED: Properly typed Pusher callbacks
  usePusher(`auction-${listingId}`, {
    onNewBid: (data: NewBidEvent) => {
      // Convert the bid from the event to match your Bid type
      const newBid: Bid = {
        id: data.bid.id,
        amount: data.bid.amount,
        farmerId: data.bid.farmerId,
        createdAt: data.bid.createdAt instanceof Date 
          ? data.bid.createdAt.toISOString() 
          : data.bid.createdAt,
      }
      setBids(prev => [newBid, ...prev])
    },
    onAuctionExtended: (data: AuctionExtendedEvent) => {
      // Handle auction extension - you might want to refetch auction data
      console.log('Auction extended:', data.message)
      // Optionally refetch auction to get new end time
      fetchAuctionData()
    },
  })

  const fetchAuctionData = useCallback(async () => {
    try {
      const response = await fetch(`/api/marketplace/${listingId}/auction`)
      if (response.ok) {
        const data = await response.json()
        setAuction(data.listing)
        setBids(data.listing.bids)
        setTimeRemaining(data.stats.timeRemaining)
      }
    } catch (err) {
      console.error('Error refetching auction:', err)
    }
  }, [listingId])

  // Countdown timer
  useEffect(() => {
    if (!auction || auction.auctionStatus !== 'LIVE') return

    const timer = setInterval(() => {
      setTimeRemaining(prev => Math.max(0, prev - 1000))
    }, 1000)

    return () => clearInterval(timer)
  }, [auction])

  const placeBid = useCallback(async (amount: number, isAutoBid: boolean = false) => {
    try {
      const response = await fetch(`/api/marketplace/${listingId}/bid`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          farmerId: 'current-user-id', // Get from auth context
          amount,
          isAutoBid,
        }),
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || 'Failed to place bid')
      }

      // Refetch auction data after successful bid
      await fetchAuctionData()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to place bid')
      throw err
    }
  }, [listingId, fetchAuctionData])

  const isLive = auction?.auctionStatus === 'LIVE' && timeRemaining > 0

  return {
    auction,
    bids,
    loading,
    error,
    placeBid,
    timeRemaining,
    isLive,
  }
}