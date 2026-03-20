// app/api/marketplace/feed/route.ts
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { Prisma } from "@prisma/client";
import {
  marketplaceFeedQuery,
  calculateMarketplaceScore,
} from "@/lib/prisma/marketplace-queries";
import { MarketplaceFilters } from "@/lib/types/marketplace";
import { getImageUrl } from "@/lib/supabase-image";

type FeedListing = Prisma.LandListingGetPayload<{
  include: {
    land: true;
    owner: { include: { landownerProfile: true } };
    images: true;
    _count: { select: { bids: true; savedBy: true } };
  };
}>;

export async function GET(req: NextRequest) {
  try {
    const searchParams = req.nextUrl.searchParams;

    const filters: MarketplaceFilters = {
      search: searchParams.get("search"),
      minPrice: searchParams.get("minPrice")
        ? parseFloat(searchParams.get("minPrice")!)
        : undefined,
      maxPrice: searchParams.get("maxPrice")
        ? parseFloat(searchParams.get("maxPrice")!)
        : undefined,
      landType: searchParams.get("landType"),
      state: searchParams.get("state"),
      district: searchParams.get("district"),
      minSize: searchParams.get("minSize")
        ? parseFloat(searchParams.get("minSize")!)
        : undefined,
      maxSize: searchParams.get("maxSize")
        ? parseFloat(searchParams.get("maxSize")!)
        : undefined,
      irrigation: searchParams.get("irrigation") === "true",
      verifiedOnly: searchParams.get("verifiedOnly") === "true",
      sortBy:
        (searchParams.get("sortBy") as MarketplaceFilters["sortBy"]) ||
        "hotnessScore",
    };

    const pagination = {
      page: parseInt(searchParams.get("page") || "1"),
      limit: parseInt(searchParams.get("limit") || "20"),
    };

    const baseQuery = marketplaceFeedQuery(filters, pagination);
    const where = baseQuery.where;

    const [listings, totalCount] = await prisma.$transaction([
      prisma.landListing.findMany({
        where,
        skip: (pagination.page - 1) * pagination.limit,
        take: pagination.limit,
        orderBy: { createdAt: "desc" },
        include: {
          land: true,
          owner: {
            include: { landownerProfile: true },
          },
          images: {
            orderBy: { sortOrder: "asc" },
            take: 3,
          },
          _count: {
            select: {
              bids: true,
              savedBy: true,
            },
          },
        },
      }),
      prisma.landListing.count({ where }),
    ]);

    const enhancedListings = (listings as FeedListing[]).map((listing) => {
      const listingImages =
        listing.images?.map((img) => ({
          ...img,
          url: getImageUrl(img.url),
        })) || [];

      const ownerImage = listing.owner?.imageUrl
        ? getImageUrl(listing.owner.imageUrl)
        : null;

      // Generate map URL and location from geo data
      const mapUrl = listing.land?.latitude && listing.land?.longitude
        ? `https://www.google.com/maps?q=${listing.land.latitude},${listing.land.longitude}`
        : null;

      const location = [
        listing.land?.village,
        listing.land?.district,
        listing.land?.state,
      ]
        .filter(Boolean)
        .join(", ");

      return {
        ...listing,
        land: listing.land ? {
          ...listing.land,
          mapUrl,
          location: location || `${listing.land.district}, ${listing.land.state}`,
        } : null,
        images: listingImages,
        owner: listing.owner
          ? {
              ...listing.owner,
              imageUrl: ownerImage,
            }
          : null,
        marketplaceScore: calculateMarketplaceScore(listing),
      };
    });

    // Deduplicate at API level as well
    const uniqueListings = Array.from(
      new Map(enhancedListings.map(listing => [listing.id, listing])).values()
    );

    return NextResponse.json({
      listings: uniqueListings,
      pagination: {
        page: pagination.page,
        limit: pagination.limit,
        total: totalCount,
        pages: Math.ceil(totalCount / pagination.limit),
      },
    });
  } catch (error) {
    console.error("Feed API Error:", error);
    return NextResponse.json(
      { error: "Failed to fetch marketplace feed" },
      { status: 500 },
    );
  }
}