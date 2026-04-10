// app/api/marketplace/[id]/route.ts

import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { listingDetailQuery } from "@/lib/prisma/marketplace-queries";
import { pusherServer } from "@/lib/pusher/server";
import { Prisma } from "@prisma/client";
import { safeRedis, CACHE_KEYS, CACHE_TTL } from "@/lib/redis";
import { z } from "zod";
import { getImageUrl } from "@/lib/supabase-image";

// ============= TYPE DEFINITIONS =============
interface RouteParams {
  params: Promise<{ id: string }> | { id: string };
}

interface ImageObject {
  id: string;
  url: string;
  caption?: string | null;
  isPrimary?: boolean;
  sortOrder?: number;
}

interface DocumentObject {
  id: string;
  url: string;
  name: string;
  type?: string | null;
  size?: number | null;
  createdAt?: Date | null;
}

interface SoilReportObject {
  id: string;
  reportUrl?: string | null;
  ph?: number | null;
  moisture?: number | null;
  nutrients?: string | null;
  testedBy?: string | null;
  testedAt?: Date | null;
  createdAt?: Date;
}

interface RawListing {
  id: string;
  title: string;
  description: string | null;
  basePrice: number;
  highestBid: number | null;
  endDate: Date;
  startDate: Date;
  auctionStatus: string;
  minimumLeaseDuration: number;
  maximumLeaseDuration: number;
  createdAt: Date;
  updatedAt: Date;
  publishedAt: Date | null;
  lastBidAt: Date | null;
  status: string;
  listingType: string;
  land?: {
    id: string;
    size: number;
    landType: string;
    latitude?: number | null;
    longitude?: number | null;
    village?: string | null;
    district?: string | null;
    state?: string | null;
    pincode?: string | null;
    address?: string | null;
    soilType: string | null;
    irrigationAvailable: boolean;
    electricityAvailable: boolean | null;
    roadAccess: boolean | null;
    fencingAvailable: boolean | null;
    waterSource: string | null;
    createdAt: Date;
    updatedAt: Date;
    images?: ImageObject[];
    documents?: DocumentObject[];
    soilReports?: SoilReportObject[];
  };
  owner?: {
    id: string;
    name: string;
    imageUrl: string | null;
    createdAt: Date;
    updatedAt: Date;
    landownerProfile?: {
      isVerified: boolean;
      verificationLevel: number;
    };
  };
  images?: ImageObject[];
  terms?: Record<string, unknown> | null;
  analytics?: Record<string, unknown> | null;
  bids?: Array<{
    id: string;
    amount: number;
    farmerId: string;
    createdAt: Date;
    isAutoBid: boolean;
    farmer?: {
      id: string;
      name: string;
      imageUrl: string | null;
    };
  }>;
  _count?: {
    bids: number;
    savedBy: number;
    applications: number;
  };
  savedByUsers?: Array<{ id: string }>;
}

// ============= VALIDATION SCHEMAS =============
const bidSchema = z.object({
  farmerId: z.string().min(1),
  amount: z.number().positive(),
  isAutoBid: z.boolean().optional().default(false),
});

// ============= HELPER FUNCTIONS =============
const json = <T>(data: T, init?: ResponseInit): NextResponse<T> => {
  return NextResponse.json(data, init) as NextResponse<T>;
};

// ============= GET /api/marketplace/[id] =============
export async function GET(
  request: NextRequest,
  { params }: RouteParams
): Promise<NextResponse> {
  const startTime = performance.now();

  try {
    const { id } = await params;
    const userId = request.nextUrl.searchParams.get("userId");
    const cacheKey = CACHE_KEYS.LISTING(id, userId || "anonymous");

    // Try cache first using safe Redis
    const cached = await safeRedis.get(cacheKey);
    if (cached) {
      console.log(`[Cache HIT] Listing ${id}`);
      return json({
        listing: cached,
        fromCache: true,
      });
    }

    console.log(`[Cache MISS] Listing ${id}`);

    const listing = await prisma.landListing.findUnique(
      listingDetailQuery(id, userId || undefined)
    );

    if (!listing) {
      return json({ error: "Listing not found" }, { status: 404 });
    }

    const rawListing = listing as unknown as RawListing;

    // Enhanced listing with geo data and optimized images
    const enhancedListing = {
      ...rawListing,
      
      land: rawListing.land
        ? {
            ...rawListing.land,
            
            mapUrl:
              rawListing.land.latitude && rawListing.land.longitude
                ? `https://www.google.com/maps?q=${rawListing.land.latitude},${rawListing.land.longitude}`
                : null,
            
            location: [
              rawListing.land.village,
              rawListing.land.district,
              rawListing.land.state,
            ]
              .filter(Boolean)
              .join(", "),
            
            fullAddress: rawListing.land.address || null,
            
            images:
              rawListing.land.images?.map((img: ImageObject) => ({
                ...img,
                url: getImageUrl(img.url) || "/images/placeholder-land.jpg",
              })) || [],
            
            documents:
              rawListing.land.documents?.map((doc: DocumentObject) => ({
                ...doc,
                url: getImageUrl(doc.url),
              })) || [],
            
            soilReports:
              rawListing.land.soilReports?.map((report: SoilReportObject) => ({
                ...report,
                reportUrl: report.reportUrl ? getImageUrl(report.reportUrl) : null,
              })) || [],
          }
        : null,

      images:
        rawListing.images?.map((img: ImageObject) => ({
          ...img,
          url: getImageUrl(img.url) || "/images/placeholder-land.jpg",
        })) || [],

      owner: rawListing.owner
        ? {
            ...rawListing.owner,
            imageUrl: rawListing.owner.imageUrl
              ? getImageUrl(rawListing.owner.imageUrl)
              : "/images/avatar-placeholder.jpg",
          }
        : null,

      bids:
        rawListing.bids?.map((bid) => ({
          ...bid,
          createdAt: bid.createdAt.toISOString(),
          farmer: bid.farmer
            ? {
                ...bid.farmer,
                imageUrl: bid.farmer.imageUrl
                  ? getImageUrl(bid.farmer.imageUrl)
                  : "/images/avatar-placeholder.jpg",
              }
            : undefined,
        })) || [],

      isSaved: rawListing.savedByUsers && rawListing.savedByUsers.length > 0,
    };

    // Track view asynchronously (non-blocking)
    trackView(id).catch((err) => console.error("Error tracking view:", err));

    // Cache the result using safe Redis
    await safeRedis.setex(cacheKey, CACHE_TTL.LISTING, enhancedListing);

    const duration = performance.now() - startTime;
    console.log(`GET /api/marketplace/${id} completed in ${duration.toFixed(2)}ms`);

    return json({ listing: enhancedListing });
  } catch (error) {
    console.error("Listing Detail API Error:", error);
    return json(
      { error: "Failed to fetch listing details" },
      { status: 500 }
    );
  }
}

// ============= POST /api/marketplace/[id]/auction =============
export async function POST(
  request: NextRequest,
  { params }: RouteParams
): Promise<NextResponse> {
  try {
    const { id } = await params;
    const cacheKey = CACHE_KEYS.AUCTION(id);

    // Try cache first using safe Redis
    const cached = await safeRedis.get(cacheKey);
    if (cached) {
      return json(cached);
    }

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
        startDate: true,
        auctionStatus: true,
        autoExtendMinutes: true,
        winningBidId: true,
        currentLeaderId: true,
        highestBid: true,
        status: true,
        listingType: true,
        land: {
          select: {
            latitude: true,
            longitude: true,
            village: true,
            district: true,
            state: true,
            size: true,
            landType: true,
            images: {
              take: 1,
              select: { url: true },
            },
          },
        },
        bids: {
          where: { status: "ACTIVE" },
          orderBy: [{ amount: "desc" }, { createdAt: "asc" }],
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
                imageUrl: true,
              },
            },
          },
        },
        winningBid: {
          select: {
            id: true,
            amount: true,
            farmer: {
              select: {
                id: true,
                name: true,
              },
            },
          },
        },
        _count: {
          select: {
            bids: {
              where: { status: "ACTIVE" },
            },
          },
        },
      },
    });

    if (!auctionData) {
      return json({ error: "Auction not found" }, { status: 404 });
    }

    const enhancedAuctionData = {
      ...auctionData,
      
      land: auctionData.land
        ? {
            ...auctionData.land,
            mapUrl:
              auctionData.land.latitude && auctionData.land.longitude
                ? `https://www.google.com/maps?q=${auctionData.land.latitude},${auctionData.land.longitude}`
                : null,
            location: [
              auctionData.land.village,
              auctionData.land.district,
              auctionData.land.state,
            ]
              .filter(Boolean)
              .join(", "),
            images:
              auctionData.land.images?.map((img: { url: string | null }) => ({
                url: getImageUrl(img.url) || "/images/placeholder-land.jpg",
              })) || [],
          }
        : null,

      bids:
        auctionData.bids?.map((bid) => ({
          ...bid,
          createdAt: bid.createdAt.toISOString(),
          farmer: bid.farmer
            ? {
                ...bid.farmer,
                imageUrl: bid.farmer.imageUrl
                  ? getImageUrl(bid.farmer.imageUrl)
                  : "/images/avatar-placeholder.jpg",
              }
            : undefined,
        })) || [],
    };

    const uniqueBidders = new Set(auctionData.bids.map((b) => b.farmerId)).size;
    const timeRemaining = Math.max(
      0,
      new Date(auctionData.endDate).getTime() - Date.now()
    );

    const response = {
      listing: enhancedAuctionData,
      stats: {
        totalBids: auctionData._count.bids,
        uniqueBidders,
        timeRemaining,
        status: auctionData.auctionStatus,
        currentLeader: auctionData.winningBid,
        bidHistory: auctionData.bids.slice(0, 10).map((bid) => ({
          ...bid,
          createdAt: bid.createdAt.toISOString(),
        })),
      },
    };

    // Cache for 2 seconds using safe Redis
    await safeRedis.setex(cacheKey, CACHE_TTL.AUCTION, response);

    return json(response);
  } catch (error) {
    console.error("Auction Room API Error:", error);
    return json(
      { error: "Failed to fetch auction data" },
      { status: 500 }
    );
  }
}

// ============= PUT /api/marketplace/[id]/bid =============
export async function PUT(
  request: NextRequest,
  { params }: RouteParams
): Promise<NextResponse> {
  const startTime = performance.now();

  try {
    const { id } = await params;
    const body = await request.json();

    // Validate input
    const validation = bidSchema.safeParse(body);
    if (!validation.success) {
      return json(
        {
          error: "Invalid bid data",
          details: validation.error.issues,
        },
        { status: 400 }
      );
    }

    const { farmerId, amount, isAutoBid } = validation.data;

    // Check if listing exists and is available for bidding
    const listingData = await prisma.landListing.findUnique({
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

    if (!listingData) {
      return json({ 
        error: "This listing is not available for bidding. It may be pending approval or not a bidding listing." 
      }, { status: 400 });
    }

    // Check auction dates
    const now = new Date();
    const startDate = new Date(listingData.startDate);
    const endDate = new Date(listingData.endDate);
    
    if (now < startDate) {
      return json({ error: "Auction has not started yet" }, { status: 400 });
    }
    if (now > endDate) {
      return json({ error: "Auction has ended" }, { status: 400 });
    }

    // Validate bid amount
    const highestBid = listingData.bids[0]?.amount || listingData.basePrice;
    const minBid = highestBid + (listingData.bidIncrement || 1000);

    if (amount < minBid) {
      return json({ error: `Bid must be at least ₹${minBid}` }, { status: 400 });
    }

    // Start transaction
    const result = await prisma.$transaction(
      async (tx) => {
        const lastBid = await tx.bid.findFirst({
          where: { listingId: id },
          orderBy: { sequence: "desc" },
        });
        const sequence = (lastBid?.sequence || 0) + 1;

        const bid = await tx.bid.create({
          data: {
            listingId: id,
            farmerId,
            amount,
            sequence,
            isAutoBid: isAutoBid || false,
            status: "ACTIVE",
            isWinning: true,
          },
        });

        if (listingData.bids[0]) {
          await tx.bid.update({
            where: { id: listingData.bids[0].id },
            data: {
              status: "OUTBID",
              outbidAt: new Date(),
              isWinning: false,
            },
          });
        }

        const updateData: Prisma.LandListingUpdateInput = {
          totalBids: { increment: 1 },
          highestBid: amount,
          currentLeaderId: farmerId,
          lastBidAt: new Date(),
          winningBid: {
            connect: { id: bid.id },
          },
        };

        const timeLeft = endDate.getTime() - Date.now();
        let extended = false;

        if (timeLeft < 5 * 60 * 1000 && listingData.autoExtendMinutes) {
          updateData.endDate = new Date(
            Date.now() + listingData.autoExtendMinutes * 60 * 1000
          );
          extended = true;
        }

        await tx.landListing.update({
          where: { id },
          data: updateData,
        });

        await tx.auctionEvent.create({
          data: {
            listingId: id,
            type: "BID_PLACED",
            actorId: farmerId,
            bidId: bid.id,
            metadata: {
              amount,
              sequence,
              autoExtended: extended,
            },
          },
        });

        await tx.listingAnalytics.upsert({
          where: { listingId: id },
          update: {
            bidVelocity: { increment: 1 },
            lastActivityAt: new Date(),
          },
          create: {
            listingId: id,
            bidVelocity: 1,
            lastActivityAt: new Date(),
          },
        });

        return { bid, extended };
      },
      {
        timeout: 10000,
        maxWait: 5000,
        isolationLevel: Prisma.TransactionIsolationLevel.Serializable,
      }
    );

    // Invalidate caches using safe Redis
    await safeRedis.delMany([
      CACHE_KEYS.AUCTION(id),
      CACHE_KEYS.LISTING(id, "anonymous"),
    ]);

    // Trigger realtime updates
    Promise.all([
      pusherServer.trigger(`auction-${id}`, "new-bid", {
        bid: {
          id: result.bid.id,
          amount: result.bid.amount,
          farmerId: result.bid.farmerId,
          createdAt: result.bid.createdAt,
        },
        timestamp: new Date().toISOString(),
      }),
      result.extended &&
        pusherServer.trigger(`auction-${id}`, "auction-extended", {
          message: "Auction extended due to late bidding",
          newEndTime: new Date(Date.now() + 5 * 60 * 1000).toISOString(),
          extendedByMinutes: 5,
        }),
    ]).catch((err) => console.error("Pusher error:", err));

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
      timing: { durationMs: duration },
    });
  } catch (error) {
    console.error("Place Bid API Error:", error);

    if (error instanceof Error) {
      if (error.message.includes("transaction")) {
        return json(
          { error: "Transaction failed. Please try again." },
          { status: 409 }
        );
      }
      return json({ error: error.message }, { status: 400 });
    }

    return json({ error: "Failed to place bid" }, { status: 500 });
  }
}

// ============= HELPER: trackView =============
async function trackView(listingId: string): Promise<void> {
  const today = new Date().toISOString().split("T")[0];
  const viewKey = `view:${listingId}:${today}`;

  try {
    // Check if already viewed today using safe Redis
    const viewed = await safeRedis.get(viewKey);
    
    if (!viewed) {
      await prisma.$transaction([
        prisma.landListing.update({
          where: { id: listingId },
          data: { viewCount: { increment: 1 } },
        }),
        prisma.listingAnalytics.upsert({
          where: { listingId: listingId },
          update: {
            lastActivityAt: new Date(),
          },
          create: {
            listingId: listingId,
            lastActivityAt: new Date(),
          },
        }),
      ]);
      
      await safeRedis.setex(viewKey, 86400, "1");
    }
  } catch (error) {
    console.error("Error tracking view:", error);
  }
}

// ============= OPTIONS =============
export async function OPTIONS(): Promise<NextResponse> {
  return json(null, {
    status: 204,
    headers: {
      Allow: "GET, POST, PUT, OPTIONS",
      "Access-Control-Allow-Methods": "GET, POST, PUT, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type, Authorization",
      "Access-Control-Max-Age": "86400",
    },
  });
}