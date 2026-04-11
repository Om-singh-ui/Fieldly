// hooks/useAuction.ts
import { useState, useEffect, useCallback, useMemo } from 'react';
import { useUser } from '@clerk/nextjs';
import { usePusher, NewBidEvent, AuctionExtendedEvent } from './usePusher';
import { AuctionRoomData, Bid } from '@/types/marketplace';

interface UseAuctionReturn {
  auction: AuctionRoomData | null;
  bids: Bid[];
  loading: boolean;
  error: string | null;
  placeBid: (amount: number, isAutoBid?: boolean) => Promise<void>;
  timeRemaining: number;
  isLive: boolean;
  canBid: boolean;
  validationMessage: string | null;
}

export function useAuction(listingId: string): UseAuctionReturn {
  const { user: clerkUser, isLoaded: isClerkLoaded } = useUser();
  const [auction, setAuction] = useState<AuctionRoomData | null>(null);
  const [bids, setBids] = useState<Bid[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [timeRemaining, setTimeRemaining] = useState<number>(0);
  const [farmerId, setFarmerId] = useState<string | null>(null);
  const [isFarmer, setIsFarmer] = useState(false);
  const [userRole, setUserRole] = useState<string | null>(null);

  // ============================================
  // Get database user ID from Clerk
  // ============================================
  useEffect(() => {
    async function getFarmerId() {
      if (!isClerkLoaded || !clerkUser) {
        setFarmerId(null);
        setIsFarmer(false);
        setUserRole(null);
        return;
      }

      try {
        const res = await fetch(`/api/user/by-clerk/${clerkUser.id}`);
        const data = await res.json();

        if (data.user?.id) {
          setFarmerId(data.user.id);
          setIsFarmer(data.user.role === 'FARMER');
          setUserRole(data.user.role);
        } else {
          console.error('User not found in database');
          setFarmerId(null);
          setIsFarmer(false);
          setUserRole(null);
        }
      } catch (err) {
        console.error('Failed to get farmer ID:', err);
        setFarmerId(null);
        setIsFarmer(false);
        setUserRole(null);
      }
    }

    getFarmerId();
  }, [clerkUser, isClerkLoaded]);

  // ============================================
  // Fetch auction data
  // ============================================
  const fetchAuctionData = useCallback(async () => {
    try {
      const response = await fetch(`/api/marketplace/${listingId}`);
      if (!response.ok) throw new Error('Failed to fetch auction');

      const data = await response.json();
      const listing = data.listing;
      
      setAuction(listing);
      setBids(listing.bids || []);
      
      const endTime = new Date(listing.endDate).getTime();
      setTimeRemaining(Math.max(0, endTime - Date.now()));
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      console.error('Auction fetch error:', err);
    } finally {
      setLoading(false);
    }
  }, [listingId]);

  useEffect(() => {
    fetchAuctionData();
  }, [fetchAuctionData]);

  // ============================================
  // Real-time Pusher updates
  // ============================================
  usePusher(`auction-${listingId}`, {
    onNewBid: (data: NewBidEvent) => {
      const newBid: Bid = {
        id: data.bid.id,
        amount: data.bid.amount,
        farmerId: data.bid.farmerId,
        createdAt: data.bid.createdAt instanceof Date ? data.bid.createdAt.toISOString() : data.bid.createdAt,
      };
      setBids(prev => [newBid, ...prev]);
      setAuction(prev => prev ? { ...prev, highestBid: data.bid.amount, _count: { ...prev._count, bids: (prev._count?.bids || 0) + 1 } } : null);
    },
    onAuctionExtended: (data: AuctionExtendedEvent) => {
      console.log('Auction extended:', data.message);
      fetchAuctionData();
    },
  });

  // ============================================
  // Countdown timer
  // ============================================
  useEffect(() => {
    if (!auction) return;
    
    const now = Date.now();
    const startTime = new Date(auction.startDate).getTime();
    const endTime = new Date(auction.endDate).getTime();
    const isAuctionLive = now >= startTime && now <= endTime;
    
    if (!isAuctionLive) return;

    const timer = setInterval(() => {
      setTimeRemaining(prev => Math.max(0, prev - 1000));
    }, 1000);

    return () => clearInterval(timer);
  }, [auction]);

  // ============================================
  // Comprehensive validation for bidding
  // ============================================
  const { canBid, validationMessage } = useMemo(() => {
    if (!auction) {
      return { canBid: false, validationMessage: 'Loading auction data...' };
    }

    // Check user authentication
    if (!clerkUser) {
      return { canBid: false, validationMessage: 'You must be signed in to place a bid' };
    }

    // Check user role
    if (!isFarmer) {
      return { canBid: false, validationMessage: `Only farmers can place bids (your role: ${userRole || 'unknown'})` };
    }

    // Check farmer ID
    if (!farmerId) {
      return { canBid: false, validationMessage: 'User profile not found. Please complete your profile.' };
    }

    // Check listing status
    if (auction.status !== 'ACTIVE') {
      return { canBid: false, validationMessage: 'This listing is not active' };
    }

    // Check listing type
    if (auction.listingType !== 'OPEN_BIDDING') {
      return { canBid: false, validationMessage: 'This is not an auction listing' };
    }

    // Check auction status
    if (auction.auctionStatus !== 'LIVE') {
      return { canBid: false, validationMessage: `Auction is ${auction.auctionStatus?.toLowerCase() || 'not live'}` };
    }

    // Check date range
    const now = Date.now();
    const startTime = new Date(auction.startDate).getTime();
    const endTime = new Date(auction.endDate).getTime();

    if (now < startTime) {
      const daysUntil = Math.ceil((startTime - now) / (1000 * 60 * 60 * 24));
      return { canBid: false, validationMessage: `Auction starts ${daysUntil === 0 ? 'today' : `in ${daysUntil} ${daysUntil === 1 ? 'day' : 'days'}`}` };
    }

    if (now > endTime) {
      return { canBid: false, validationMessage: 'Auction has ended' };
    }

    return { canBid: true, validationMessage: null };
  }, [auction, clerkUser, isFarmer, farmerId, userRole]);

  // ============================================
  // Calculate isLive status
  // ============================================
  const isLive = useMemo(() => {
    if (!auction) return false;
    const now = Date.now();
    const startTime = new Date(auction.startDate).getTime();
    const endTime = new Date(auction.endDate).getTime();
    return now >= startTime && now <= endTime && auction.auctionStatus === 'LIVE' && auction.status === 'ACTIVE';
  }, [auction]);

  // ============================================
  // Place bid with full validation
  // ============================================
  const placeBid = useCallback(async (amount: number, isAutoBid: boolean = false) => {
    // Run all validations
    if (!canBid) {
      throw new Error(validationMessage || 'Cannot place bid');
    }

    if (!auction) {
      throw new Error('Auction data not available');
    }

    if (!farmerId) {
      throw new Error('User profile not found');
    }

    // Validate bid amount
    const highestBid = bids[0]?.amount || auction.basePrice;
    const minBid = highestBid + (auction.bidIncrement || 1000);
    
    if (amount < minBid) {
      throw new Error(`Bid must be at least ₹${minBid.toLocaleString()}`);
    }

    // Prevent bidding on own listing
    if (auction.ownerId === farmerId) {
      throw new Error('You cannot bid on your own listing');
    }

    try {
      const response = await fetch(`/api/marketplace/${listingId}/bid`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ farmerId, amount, isAutoBid }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to place bid');
      }

      await fetchAuctionData();
      setError(null);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to place bid';
      setError(errorMessage);
      throw err;
    }
  }, [listingId, farmerId, canBid, validationMessage, auction, bids, fetchAuctionData]);

  return {
    auction,
    bids,
    loading,
    error,
    placeBid,
    timeRemaining,
    isLive,
    canBid,
    validationMessage,
  };
}