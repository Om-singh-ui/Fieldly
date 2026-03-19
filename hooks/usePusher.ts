// hooks/usePusher.ts
import { useEffect } from 'react'
import { pusherClient } from '@/lib/pusher/client'

// Define types that match your API response
export interface NewBidEvent {
  bid: {
    id: string
    amount: number
    farmerId: string
    createdAt: string | Date
  }
  timestamp: string
}

export interface AuctionExtendedEvent {
  message: string
  newEndTime?: string
}

export interface AuctionEndedEvent {
  winningBidId: string
  winningAmount: number
  winnerId: string
  message: string
}

// Type-safe callback types
type NewBidCallback = (data: NewBidEvent) => void
type AuctionExtendedCallback = (data: AuctionExtendedEvent) => void
type AuctionEndedCallback = (data: AuctionEndedEvent) => void

interface PusherCallbacks {
  onNewBid?: NewBidCallback
  onAuctionExtended?: AuctionExtendedCallback
  onAuctionEnded?: AuctionEndedCallback
}

export function usePusher(channelName: string, callbacks: PusherCallbacks) {
  useEffect(() => {
    const channel = pusherClient.subscribe(channelName)

    if (callbacks.onNewBid) {
      channel.bind('new-bid', callbacks.onNewBid)
    }
    
    if (callbacks.onAuctionExtended) {
      channel.bind('auction-extended', callbacks.onAuctionExtended)
    }
    
    if (callbacks.onAuctionEnded) {
      channel.bind('auction-ended', callbacks.onAuctionEnded)
    }

    return () => {
      channel.unbind_all()
      pusherClient.unsubscribe(channelName)
    }
  }, [channelName, callbacks.onNewBid, callbacks.onAuctionExtended, callbacks.onAuctionEnded])
}