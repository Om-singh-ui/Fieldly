// hooks/useAuction.ts
import { useState, useEffect, useCallback } from 'react'
import { useUser } from '@clerk/nextjs'
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
  const { user: clerkUser, isLoaded: isClerkLoaded } = useUser()
  const [auction, setAuction] = useState<AuctionRoomData | null>(null)
  const [bids, setBids] = useState<Bid[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [timeRemaining, setTimeRemaining] = useState<number>(0)
  const [farmerId, setFarmerId] = useState<string | null>(null)
  const [isFarmer, setIsFarmer] = useState(false)

  // ============================================
  // STEP 1: Get the database user ID from Clerk
  // ============================================
  useEffect(() => {
    async function getFarmerId() {
      if (!isClerkLoaded || !clerkUser) {
        setFarmerId(null)
        setIsFarmer(false)
        return
      }

      try {
        // Get the database user ID using the Clerk ID
        const res = await fetch(`/api/user/by-clerk/${clerkUser.id}`)
        const data = await res.json()

        if (data.user?.id) {
          setFarmerId(data.user.id)
          setIsFarmer(data.user.role === 'FARMER')
          
          if (data.user.role !== 'FARMER') {
            console.warn('User is not a farmer. Role:', data.user.role)
          }
        } else {
          console.error('User not found in database')
          setFarmerId(null)
          setIsFarmer(false)
        }
      } catch (err) {
        console.error('Failed to get farmer ID:', err)
        setFarmerId(null)
        setIsFarmer(false)
      }
    }

    getFarmerId()
  }, [clerkUser, isClerkLoaded])

  // ============================================
  // STEP 2: Fetch auction data
  // ============================================
  useEffect(() => {
    const fetchAuction = async () => {
      try {
        setLoading(true)
        const response = await fetch(`/api/marketplace/${listingId}`)
        
        if (!response.ok) {
          throw new Error('Failed to fetch auction')
        }

        const data = await response.json()
        const listing = data.listing
        
        setAuction(listing)
        setBids(listing.bids || [])
        
        // Calculate time remaining
        const endTime = new Date(listing.endDate).getTime()
        const now = Date.now()
        setTimeRemaining(Math.max(0, endTime - now))
        setError(null)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred')
        console.error('Auction fetch error:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchAuction()
  }, [listingId])

  // ============================================
  // STEP 3: Real-time Pusher updates
  // ============================================
  usePusher(`auction-${listingId}`, {
    onNewBid: (data: NewBidEvent) => {
      const newBid: Bid = {
        id: data.bid.id,
        amount: data.bid.amount,
        farmerId: data.bid.farmerId,
        createdAt: data.bid.createdAt instanceof Date 
          ? data.bid.createdAt.toISOString() 
          : data.bid.createdAt,
      }
      setBids(prev => [newBid, ...prev])
      
      // Update auction with new highest bid
      setAuction(prev => prev ? {
        ...prev,
        highestBid: data.bid.amount,
        _count: { ...prev._count, bids: (prev._count?.bids || 0) + 1 }
      } : null)
    },
    onAuctionExtended: (data: AuctionExtendedEvent) => {
      console.log('Auction extended:', data.message)
      fetchAuctionData()
    },
  })

  // ============================================
  // STEP 4: Refetch auction data
  // ============================================
  const fetchAuctionData = useCallback(async () => {
    try {
      const response = await fetch(`/api/marketplace/${listingId}`)
      if (response.ok) {
        const data = await response.json()
        const listing = data.listing
        
        setAuction(listing)
        setBids(listing.bids || [])
        
        const endTime = new Date(listing.endDate).getTime()
        const now = Date.now()
        setTimeRemaining(Math.max(0, endTime - now))
      }
    } catch (err) {
      console.error('Error refetching auction:', err)
    }
  }, [listingId])

  // ============================================
  // STEP 5: Countdown timer
  // ============================================
  useEffect(() => {
    if (!auction) return
    
    const now = Date.now()
    const startTime = new Date(auction.startDate).getTime()
    const endTime = new Date(auction.endDate).getTime()
    const isAuctionLive = now >= startTime && now <= endTime
    
    if (!isAuctionLive) return

    const timer = setInterval(() => {
      setTimeRemaining(prev => Math.max(0, prev - 1000))
    }, 1000)

    return () => clearInterval(timer)
  }, [auction])

  // ============================================
  // STEP 6: Place bid (FIXED - uses real farmerId)
  // ============================================
  const placeBid = useCallback(async (amount: number, isAutoBid: boolean = false) => {
    // Validate user is authenticated and is a farmer
    if (!clerkUser) {
      throw new Error('You must be signed in to place a bid')
    }
    
    if (!farmerId) {
      throw new Error('User profile not found. Please complete your profile.')
    }
    
    if (!isFarmer) {
      throw new Error('Only farmers can place bids')
    }

    // Validate auction is live
    if (!auction) {
      throw new Error('Auction data not available')
    }
    
    const now = Date.now()
    const startTime = new Date(auction.startDate).getTime()
    const endTime = new Date(auction.endDate).getTime()
    
    if (now < startTime) {
      throw new Error('Auction has not started yet')
    }
    if (now > endTime) {
      throw new Error('Auction has ended')
    }

    // Validate bid amount
    const highestBid = bids[0]?.amount || auction.basePrice
    const minBid = highestBid + (auction.bidIncrement || 1000)
    
    if (amount < minBid) {
      throw new Error(`Bid must be at least ₹${minBid.toLocaleString()}`)
    }

    try {
      const response = await fetch(`/api/marketplace/${listingId}/bid`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          farmerId, // ✅ Now using the actual database user ID
          amount,
          isAutoBid,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to place bid')
      }

      // Refetch auction data after successful bid
      await fetchAuctionData()
      
      // Clear any previous errors
      setError(null)
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to place bid'
      setError(errorMessage)
      throw err
    }
  }, [listingId, farmerId, isFarmer, clerkUser, auction, bids, fetchAuctionData])

  // ============================================
  // STEP 7: Calculate isLive status
  // ============================================
  const isLive = (() => {
    if (!auction) return false
    
    const now = Date.now()
    const startTime = new Date(auction.startDate).getTime()
    const endTime = new Date(auction.endDate).getTime()
    
    return now >= startTime && now <= endTime
  })()

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