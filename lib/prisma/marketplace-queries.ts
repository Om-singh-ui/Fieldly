// lib/prisma/marketplace-queries.ts
import { Prisma } from "@prisma/client"
import { prisma } from "@/lib/prisma"
import { MarketplaceFilters, PaginationParams } from "@/lib/types/marketplace"

//
// ================= BID TYPES =================
//

export interface Bid {
  id: string
  amount: number
  farmerId: string
  farmerName?: string
  createdAt: string | Date
  isWinning?: boolean
  isAutoBid?: boolean
  farmer?: {
    id: string
    name: string
    imageUrl?: string | null
    farmerProfile?: {
      isVerified?: boolean
      farmingExperience?: number
    }
  }
  listing?: {
    id: string
    title: string
    endDate: string
    auctionStatus: string
    location?: string
    image?: string
  }
}

export interface NewBidEvent {
  bid: Bid
  timestamp: string
}

export interface AuctionExtendedEvent {
  message: string
  extendedByMinutes: number
  newEndTime: string
}

//
// ================= DOCUMENT TYPES =================
//

export interface Document {
  id: string
  name: string
  url: string
  type?: string | null
  size?: number | null
  createdAt?: Date
}

//
// ================= FEED VIEW =================
//

export type MarketplaceFeedItem = Prisma.LandListingGetPayload<{
  include: {
    land: {
      include: {
        images: {
          take: 1
          select: {
            url: true
          }
        }
      }
    }
    owner: {
      include: {
        landownerProfile: true
      }
    }
    _count: {
      select: {
        bids: true
        savedBy: true
      }
    }
  }
}>

export const marketplaceFeedQuery = (
  filters: MarketplaceFilters,
  pagination: PaginationParams
): Prisma.LandListingFindManyArgs => {
  const {
    search,
    minPrice,
    maxPrice,
    landType,
    state,
    district,
    minSize,
    maxSize,
    irrigation,
    verifiedOnly,
    sortBy = "hotnessScore",
  } = filters

  const { page = 1, limit = 20 } = pagination
  const skip = (page - 1) * limit

  const where: Prisma.LandListingWhereInput = {
    status: "ACTIVE",
    auctionStatus: { in: ["UPCOMING", "LIVE"] },
    endDate: { gt: new Date() },

    ...(search && {
      OR: [
        { title: { contains: search, mode: "insensitive" } },
        { description: { contains: search, mode: "insensitive" } },
        { land: { title: { contains: search, mode: "insensitive" } } },
        { land: { village: { contains: search, mode: "insensitive" } } },
      ],
    }),

    ...((minPrice !== undefined || maxPrice !== undefined) && {
      basePrice: {
        ...(minPrice !== undefined && { gte: minPrice }),
        ...(maxPrice !== undefined && { lte: maxPrice }),
      },
    }),

    ...((landType || state || district || minSize !== undefined || maxSize !== undefined || irrigation) && {
      land: {
        is: {
          ...(landType && { landType: landType as Prisma.EnumLandTypeFilter }),
          ...(state && { state }),
          ...(district && { district }),
          ...((minSize !== undefined || maxSize !== undefined) && {
            size: {
              ...(minSize !== undefined && { gte: minSize }),
              ...(maxSize !== undefined && { lte: maxSize }),
            },
          }),
          ...(irrigation && { irrigationAvailable: true }),
        },
      },
    }),

    ...(verifiedOnly && {
      owner: {
        landownerProfile: {
          isVerified: true,
        },
      },
    }),
  }

  // Handle orderBy properly
  let orderBy: Prisma.LandListingOrderByWithRelationInput | Prisma.LandListingOrderByWithRelationInput[] = []

  switch (sortBy) {
    case "hotnessScore":
      orderBy = [
        { hotnessScore: "desc" },
        { engagementScore: "desc" },
        { createdAt: "desc" },
      ]
      break
    case "newest":
      orderBy = [{ createdAt: "desc" }]
      break
    case "endingSoon":
      orderBy = [{ endDate: "asc" }]
      break
    case "priceLowToHigh":
      orderBy = [{ basePrice: "asc" }]
      break
    case "priceHighToLow":
      orderBy = [{ basePrice: "desc" }]
      break
    case "mostBids":
      orderBy = [{ totalBids: "desc" }]
      break
    default:
      orderBy = [{ hotnessScore: "desc" }]
  }

  return {
    where,
    orderBy,
    skip,
    take: limit,
    include: {
      land: {
        include: {
          images: {
            take: 1,
            select: {
              url: true
            }
          }
        },
      },
      owner: {
        include: {
          landownerProfile: {
            select: {
              isVerified: true,
              verificationLevel: true,
            }
          }
        },
      },
      _count: {
        select: {
          bids: true,
          savedBy: true,
        },
      },
    },
  }
}

//
// ================= LISTING DETAIL =================
//

export type ListingDetail = Prisma.LandListingGetPayload<{
  include: {
    land: {
      include: {
        soilReports: {
          orderBy: { testedAt: "desc" }
          take: 1
        }
        documents: {
          select: {
            id: true
            name: true
            url: true
            type: true
            size: true
            createdAt: true
          }
        }
        images: {
          take: 10
          select: {
            id: true
            url: true
            caption: true
            isPrimary: true
          }
        }
      }
    }
    owner: {
      include: {
        landownerProfile: true
      }
    }
    terms: true
    images: { 
      orderBy: { sortOrder: "asc" },
      select: {
        id: true,
        url: true,
        caption: true,
        isPrimary: true,
        sortOrder: true,
      }
    }
    analytics: true
    savedBy?: {
      where: { userId: string }
      select: { id: true }
    }
    _count: {
      select: {
        bids: true
        savedBy: true
        applications: true
      }
    }
    bids: {
      where: { status: "ACTIVE" }
      orderBy: { createdAt: "desc" }
      take: 5
      select: {
        id: true
        amount: true
        farmerId: true
        createdAt: true
        isAutoBid: true
        farmer: {
          select: {
            id: true
            name: true
            imageUrl: true
          }
        }
      }
    }
  }
}>

export const listingDetailQuery = (
  listingId: string,
  userId?: string
): Prisma.LandListingFindUniqueArgs => {
  const include: Prisma.LandListingInclude = {
    land: {
      include: {
        soilReports: {
          orderBy: { testedAt: "desc" },
          take: 1,
        },
        documents: {
          select: {
            id: true,
            name: true,
            url: true,
            type: true,
            size: true,
            createdAt: true,
          },
        },
        images: {
          take: 10,
          select: {
            id: true,
            url: true,
            caption: true,
            isPrimary: true,
          },
        },
      },
    },
    owner: {
      include: {
        landownerProfile: true
      },
    },
    terms: true,
    images: { 
      orderBy: { sortOrder: "asc" },
      select: {
        id: true,
        url: true,
        caption: true,
        isPrimary: true,
        sortOrder: true,
      }
    },
    analytics: true,
    _count: {
      select: {
        bids: true,
        savedBy: true,
        applications: true,
      },
    },
    bids: {
      where: { status: "ACTIVE" },
      orderBy: { createdAt: "desc" },
      take: 5,
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
          }
        }
      }
    }
  }

  if (userId) {
    include.savedBy = {
      where: { userId },
      select: { id: true },
    }
  }

  return {
    where: { id: listingId },
    include,
  }
}

//
// ================= AUCTION ROOM =================
//

export type AuctionRoomData = Prisma.LandListingGetPayload<{
  include: {
    bids: {
      where: { status: "ACTIVE" }
      orderBy: [{ amount: "desc" }, { createdAt: "asc" }]
      include: {
        farmer: {
          select: {
            id: true
            name: true
            imageUrl: true
            farmerProfile: {
              select: {
                isVerified: true
                farmingExperience: true
              }
            }
          }
        }
      }
    }
    winningBid: {
      include: {
        farmer: {
          select: {
            id: true
            name: true
          }
        }
      }
    }
    auctionEvents: {
      where: {
        createdAt: { gt: Date }
      }
      orderBy: { createdAt: "desc" }
      take: 20
      include: {
        bid: {
          select: {
            amount: true,
            farmer: {
              select: {
                name: true
              }
            }
          }
        }
      }
    }
    _count: {
      select: {
        bids: {
          where: { status: "ACTIVE" }
        }
      }
    }
  }
}>

export const auctionRoomQuery = (
  listingId: string
): Prisma.LandListingFindUniqueArgs => ({
  where: { id: listingId },
  include: {
    bids: {
      where: { status: "ACTIVE" },
      orderBy: [{ amount: "desc" }, { createdAt: "asc" }],
      take: 50,
      include: {
        farmer: {
          select: {
            id: true,
            name: true,
            imageUrl: true,
            farmerProfile: {
              select: {
                isVerified: true,
                farmingExperience: true
              }
            }
          },
        },
      },
    },
    winningBid: {
      include: {
        farmer: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    },
    auctionEvents: {
      where: {
        createdAt: { gt: new Date(Date.now() - 5 * 60 * 1000) },
      },
      orderBy: { createdAt: "desc" },
      take: 20,
      include: {
        bid: {
          select: {
            amount: true,
            farmer: {
              select: {
                name: true
              }
            }
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
})

// Helper function to calculate marketplace score
export interface ScoreableListing {
  createdAt: Date
  hotnessScore?: number | null
  engagementScore?: number | null
}

export function calculateMarketplaceScore(listing: ScoreableListing) {
  const recencyScore = Math.max(
    0,
    1 - (Date.now() - new Date(listing.createdAt).getTime()) / (7 * 24 * 60 * 60 * 1000)
  )

  return {
    total:
      (listing.hotnessScore || 0) * 0.5 +
      (listing.engagementScore || 0) * 0.3 +
      recencyScore * 0.2,
    components: {
      hotness: listing.hotnessScore || 0,
      engagement: listing.engagementScore || 0,
      recency: recencyScore,
    },
  }
}

// Utility function to get active auction count for a user
export async function getUserActiveAuctionCount(userId: string): Promise<number> {
  try {
    const count = await prisma.landListing.count({
      where: {
        OR: [
          { ownerId: userId },
          { bids: { some: { farmerId: userId } } }
        ],
        auctionStatus: "LIVE",
        endDate: { gt: new Date() }
      }
    })
    return count
  } catch (error) {
    console.error("Error getting user active auction count:", error)
    return 0
  }
}

// Utility function to get user's bid history
export async function getUserBidHistory(
  userId: string,
  limit: number = 20
): Promise<Bid[]> {
  try {
    const bids = await prisma.bid.findMany({
      where: { farmerId: userId },
      orderBy: { createdAt: "desc" },
      take: limit,
      include: {
        listing: {
          select: {
            id: true,
            title: true,
            endDate: true,
            auctionStatus: true,
            land: {
              select: {
                district: true,
                state: true,
                images: {
                  take: 1,
                  select: { url: true }
                }
              }
            }
          }
        }
      }
    })

    return bids.map(bid => ({
      id: bid.id,
      amount: bid.amount,
      farmerId: bid.farmerId,
      createdAt: bid.createdAt.toISOString(),
      isWinning: bid.isWinning,
      isAutoBid: bid.isAutoBid,
      listing: bid.listing ? {
        id: bid.listing.id,
        title: bid.listing.title,
        endDate: bid.listing.endDate.toISOString(),
        auctionStatus: bid.listing.auctionStatus,
        location: `${bid.listing.land?.district || ''}, ${bid.listing.land?.state || ''}`,
        image: bid.listing.land?.images?.[0]?.url
      } : undefined
    }))
  } catch (error) {
    console.error("Error getting user bid history:", error)
    return []
  }
}

// Utility function to check if user has already bid on a listing
export async function hasUserBidOnListing(
  userId: string,
  listingId: string
): Promise<boolean> {
  try {
    const bid = await prisma.bid.findFirst({
      where: {
        farmerId: userId,
        listingId,
        status: "ACTIVE"
      }
    })
    return !!bid
  } catch (error) {
    console.error("Error checking user bid:", error)
    return false
  }
}

// Utility function to get recommended listings based on user preferences
export async function getRecommendedListings(
  userId: string,
  limit: number = 10
): Promise<MarketplaceFeedItem[]> {
  try {
    // Get user's preferences from their profile or past behavior
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        farmerProfile: true,
        landownerProfile: true
      }
    })

    const where: Prisma.LandListingWhereInput = {
      status: "ACTIVE",
      auctionStatus: { in: ["UPCOMING", "LIVE"] },
      endDate: { gt: new Date() },
      NOT: { ownerId: userId } // Don't recommend user's own listings
    }

    // Add personalized filters based on user profile
    if (user?.farmerProfile) {
      where.land = {
        is: {
          minLeaseDuration: { lte: user.farmerProfile.leaseDuration },
          size: { 
            gte: user.farmerProfile.requiredLandSize * 0.8, 
            lte: user.farmerProfile.requiredLandSize * 1.2 
          }
        }
      }
    }

    const listings = await prisma.landListing.findMany({
      where,
      take: limit,
      orderBy: [
        { hotnessScore: "desc" },
        { engagementScore: "desc" },
        { createdAt: "desc" }
      ],
      include: {
        land: {
          include: {
            images: {
              take: 1,
              select: { url: true }
            }
          }
        },
        owner: {
          include: {
            landownerProfile: true
          }
        },
        _count: {
          select: {
            bids: true,
            savedBy: true
          }
        }
      }
    })

    return listings as MarketplaceFeedItem[]
  } catch (error) {
    console.error("Error getting recommended listings:", error)
    return []
  }
}

// Utility function to get trending listings based on engagement
export async function getTrendingListings(limit: number = 10): Promise<MarketplaceFeedItem[]> {
  try {
    const listings = await prisma.landListing.findMany({
      where: {
        status: "ACTIVE",
        auctionStatus: { in: ["UPCOMING", "LIVE"] },
        endDate: { gt: new Date() }
      },
      take: limit,
      orderBy: [
        { engagementScore: "desc" },
        { hotnessScore: "desc" },
        { viewCount: "desc" },
        { totalBids: "desc" }
      ],
      include: {
        land: {
          include: {
            images: {
              take: 1,
              select: { url: true }
            }
          }
        },
        owner: {
          include: {
            landownerProfile: true
          }
        },
        _count: {
          select: {
            bids: true,
            savedBy: true
          }
        }
      }
    })

    return listings as MarketplaceFeedItem[]
  } catch (error) {
    console.error("Error getting trending listings:", error)
    return []
  }
}

// Export types for the query functions themselves
export type MarketplaceFeedQuery = ReturnType<typeof marketplaceFeedQuery>
export type ListingDetailQuery = ReturnType<typeof listingDetailQuery>
export type AuctionRoomQuery = ReturnType<typeof auctionRoomQuery>