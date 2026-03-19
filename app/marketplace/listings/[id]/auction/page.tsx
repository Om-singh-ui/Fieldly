// app/(marketplace)/listings/[id]/auction/page.tsx
import { notFound } from 'next/navigation'
import { Metadata } from 'next'
import { prisma } from '@/lib/prisma'
import { AuctionRoomClient } from '../_components/AuctionRoomClient'

interface PageProps {
  params: Promise<{ id: string }>
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params
  
  const listing = await prisma.landListing.findUnique({
    where: { id },
    select: { title: true }
  })

  return {
    title: `${listing?.title || 'Auction'} - Live Bidding | Fieldly`,
    description: 'Join the live auction and place your bids in real-time.'
  }
}

export default async function AuctionPage({ params }: PageProps) {
  const { id } = await params
  
  // Fetch initial auction data
  const auctionData = await prisma.landListing.findUnique({
    where: { id },
    select: {
      id: true,
      title: true,
      description: true,
      basePrice: true,
      reservePrice: true,
      bidIncrement: true,
      endDate: true,
      auctionStatus: true,
      autoExtendMinutes: true,
      winningBidId: true,
      currentLeaderId: true,
      highestBid: true,
      bids: {
        where: { status: 'ACTIVE' },
        orderBy: [{ amount: 'desc' }, { createdAt: 'asc' }],
        take: 50,
        select: {
          id: true,
          amount: true,
          farmerId: true,
          createdAt: true,
          isAutoBid: true,
          farmer: {
            select: {
              id: true,
              name: true,
              imageUrl: true
            }
          }
        }
      },
      winningBid: {
        select: {
          id: true,
          amount: true,
          farmer: {
            select: {
              id: true,
              name: true
            }
          }
        }
      },
      _count: {
        select: {
          bids: {
            where: { status: 'ACTIVE' }
          }
        }
      }
    }
  })

  if (!auctionData) {
    notFound()
  }

  // Convert Date objects to plain objects for client component
  const serializedData = {
    ...auctionData,
    endDate: auctionData.endDate.toISOString(),
    bids: auctionData.bids?.map(bid => ({
      ...bid,
      createdAt: bid.createdAt.toISOString(),
    })) || [],
    winningBid: auctionData.winningBid ? {
      ...auctionData.winningBid,
    } : null,
    _count: auctionData._count || { bids: 0 }
  }

  return <AuctionRoomClient listingId={id} initialData={serializedData} />
}   