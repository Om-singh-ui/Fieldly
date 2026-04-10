// app/api/marketplace/[id]/bid/route.ts

import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { Prisma } from "@prisma/client";
import { z } from "zod";
import { pusherServer } from "@/lib/pusher/server";

const json = <T>(data: T, init?: ResponseInit): NextResponse<T> => {
  return NextResponse.json(data, init) as NextResponse<T>;
};

const bidSchema = z.object({
  farmerId: z.string().min(1),
  amount: z.number().positive(),
  isAutoBid: z.boolean().optional().default(false),
  message: z.string().optional(),
});

// PUT /api/marketplace/[id]/bid - Place a bid
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
): Promise<NextResponse> {
  const startTime = performance.now();

  try {
    const { id } = await params;
    const body = await request.json();

    // Validate input
    const validation = bidSchema.safeParse(body);
    if (!validation.success) {
      return json(
        { error: "Invalid bid data", details: validation.error.issues },
        { status: 400 }
      );
    }

    const { farmerId, amount, isAutoBid, message } = validation.data;

    // Check if listing exists and is active
    const listing = await prisma.landListing.findUnique({
      where: { 
        id,
        status: "ACTIVE",
        listingType: "OPEN_BIDDING",
      },
      include: {
        bids: {
          where: { status: "ACTIVE" },
          orderBy: { amount: "desc" },
          take: 1,
        },
      },
    });

    if (!listing) {
      return json({ error: "Listing not available for bidding" }, { status: 400 });
    }

    // Check if auction is live based on dates
    const now = new Date();
    const startDate = new Date(listing.startDate);
    const endDate = new Date(listing.endDate);
    
    if (now < startDate) {
      return json({ error: "Auction has not started yet" }, { status: 400 });
    }
    if (now > endDate) {
      return json({ error: "Auction has ended" }, { status: 400 });
    }

    // Validate bid amount
    const highestBid = listing.bids[0]?.amount || listing.basePrice;
    const minBid = highestBid + (listing.bidIncrement || 1000);

    if (amount < minBid) {
      return json({ error: `Bid must be at least ₹${minBid}` }, { status: 400 });
    }

    // Start transaction
    const result = await prisma.$transaction(
      async (tx) => {
        // Get next sequence
        const lastBid = await tx.bid.findFirst({
          where: { listingId: id },
          orderBy: { sequence: "desc" },
        });
        const sequence = (lastBid?.sequence || 0) + 1;

        // Create new bid
        const bid = await tx.bid.create({
          data: {
            listingId: id,
            farmerId,
            amount,
            sequence,
            isAutoBid: isAutoBid || false,
            status: "ACTIVE",
            message: message || null,
            isWinning: true, // Set as winning initially
          },
        });

        // Update previous highest bid to OUTBID
        if (listing.bids[0]) {
          await tx.bid.update({
            where: { id: listing.bids[0].id },
            data: {
              status: "OUTBID",
              outbidAt: new Date(),
              isWinning: false,
            },
          });
        }

        // Update listing - FIXED: Use winningBid relation instead of winningBidId
        const updateData: Prisma.LandListingUpdateInput = {
          totalBids: { increment: 1 },
          highestBid: amount,
          currentLeaderId: farmerId,
          lastBidAt: new Date(),
          winningBid: {
            connect: { id: bid.id },
          },
        };

        // Auto-extend if within last 5 minutes
        const timeLeft = endDate.getTime() - Date.now();
        let extended = false;

        if (timeLeft < 5 * 60 * 1000 && listing.autoExtendMinutes) {
          updateData.endDate = new Date(
            Date.now() + listing.autoExtendMinutes * 60 * 1000
          );
          extended = true;
        }

        await tx.landListing.update({
          where: { id },
          data: updateData,
        });

        // Create auction event
        await tx.auctionEvent.create({
          data: {
            listingId: id,
            type: "BID_PLACED",
            actorId: farmerId,
            bidId: bid.id,
            metadata: { amount, sequence, autoExtended: extended },
          },
        });

        return { bid, extended };
      },
      {
        timeout: 10000,
        isolationLevel: Prisma.TransactionIsolationLevel.Serializable,
      }
    );

    // Trigger realtime updates (fire and forget)
    void (async () => {
      try {
        await pusherServer.trigger(`auction-${id}`, "new-bid", {
          bid: {
            id: result.bid.id,
            amount: result.bid.amount,
            farmerId: result.bid.farmerId,
            createdAt: result.bid.createdAt,
          },
          timestamp: new Date().toISOString(),
        });
        if (result.extended) {
          await pusherServer.trigger(`auction-${id}`, "auction-extended", {
            message: "Auction extended due to late bidding",
            newEndTime: new Date(Date.now() + 5 * 60 * 1000).toISOString(),
          });
        }
      } catch (err) {
        console.error("Pusher error:", err);
      }
    })();

    const duration = performance.now() - startTime;
    console.log(`Bid placed in ${duration.toFixed(2)}ms`);

    return json({
      success: true,
      bid: {
        id: result.bid.id,
        amount: result.bid.amount,
        farmerId: result.bid.farmerId,
        createdAt: result.bid.createdAt,
      },
      extended: result.extended,
    });
  } catch (error) {
    console.error("Place Bid API Error:", error);
    if (error instanceof Error) {
      return json({ error: error.message }, { status: 400 });
    }
    return json({ error: "Failed to place bid" }, { status: 500 });
  }
}