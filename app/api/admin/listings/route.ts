// app/api/admin/listings/route.ts
import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/server/admin-guard";
import { prisma } from "@/lib/prisma";
import { logDetailedAction } from "@/lib/server/audit-logger";
import { headers } from "next/headers";
import { ListingStatus, ListingType, Prisma } from "@prisma/client";

const json = <T>(data: T, init?: ResponseInit): NextResponse<T> => {
  return NextResponse.json(data, init) as NextResponse<T>;
};

export async function GET(req: NextRequest) {
  try {
    const admin = await requireAdmin();
    const headersList = await headers();

    const searchParams = req.nextUrl.searchParams;
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "20");
    const status = searchParams.get("status");
    const listingType = searchParams.get("listingType");
    const search = searchParams.get("search");
    const sortBy = searchParams.get("sortBy") || "createdAt";
    const sortOrder = (searchParams.get("sortOrder") || "desc") as "asc" | "desc";

    // Build where clause with proper types
    const where: Prisma.LandListingWhereInput = {};
    
    if (status && status !== "all") {
      where.status = status as ListingStatus;
    }
    
    if (listingType && listingType !== "all") {
      where.listingType = listingType as ListingType;
    }
    
    if (search) {
      where.OR = [
        { title: { contains: search, mode: "insensitive" as const } },
        { description: { contains: search, mode: "insensitive" as const } },
      ];
    }

    const allowedSortFields = ["title", "basePrice", "status", "createdAt"];
    const validSortBy = allowedSortFields.includes(sortBy) ? sortBy : "createdAt";

    const [listings, total, stats] = await Promise.all([
      prisma.landListing.findMany({
        where,
        include: {
          land: {
            select: {
              size: true,
              landType: true,
              village: true,
              district: true,
            },
          },
          owner: {
            select: { name: true, email: true },
          },
          _count: {
            select: { applications: true, bids: true },
          },
        },
        orderBy: { [validSortBy]: sortOrder },
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.landListing.count({ where }),
      prisma.landListing.groupBy({
        by: ["status"],
        where,
        _count: true,
      }),
    ]);

    const totalValue = listings.reduce((sum, l) => sum + (l.basePrice || 0), 0);

    await logDetailedAction({
      adminId: admin.id,
      action: "VIEW_LISTINGS",
      entity: "LISTING",
      metadata: {
        filters: JSON.parse(JSON.stringify({ status, listingType, search })),
        ipAddress: headersList.get("x-forwarded-for") || "unknown",
      },
    });

    // Convert stats to Record<string, number>
    const byStatus: Record<string, number> = {};
    stats.forEach((s) => {
      byStatus[s.status] = s._count;
    });

    return json({
      listings,
      stats: {
        total,
        totalValue,
        byStatus,
      },
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
        hasNext: page < Math.ceil(total / limit),
        hasPrev: page > 1,
      },
    });
  } catch (error) {
    console.error("Listings fetch error:", error);
    return json(
      { error: error instanceof Error ? error.message : "Failed to fetch listings" },
      { status: 500 }
    );
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const admin = await requireAdmin();
    const headersList = await headers();
    const { listingId, status, reason } = await req.json();

    if (!listingId) {
      return json({ error: "Listing ID required" }, { status: 400 });
    }

    const currentListing = await prisma.landListing.findUnique({
      where: { id: listingId },
      select: { status: true, title: true, listingType: true },
    });

    if (!currentListing) {
      return json({ error: "Listing not found" }, { status: 404 });
    }

    // Validate status transition
    const validStatuses = ["ACTIVE", "CLOSED", "REJECTED", "PENDING"];
    if (!validStatuses.includes(status)) {
      return json({ error: "Invalid status" }, { status: 400 });
    }

    // Map to Prisma enum
    let prismaStatus: ListingStatus;
    switch (status) {
      case "ACTIVE":
        prismaStatus = ListingStatus.ACTIVE;
        break;
      case "CLOSED":
        prismaStatus = ListingStatus.CLOSED;
        break;
      case "REJECTED":
        prismaStatus = ListingStatus.CLOSED;
        break;
      default:
        prismaStatus = ListingStatus.ACTIVE;
    }

    const listing = await prisma.landListing.update({
      where: { id: listingId },
      data: {
        status: prismaStatus,
        ...(status === "ACTIVE" && { publishedAt: new Date() }),
        ...(status === "REJECTED" && {
          // Note: rejectionReason may need to be added to schema
          // rejectionReason: reason || "Rejected by admin",
        }),
      },
      include: {
        land: { select: { id: true } },
        owner: { select: { name: true, email: true } },
      },
    });

    const actionMap: Record<string, string> = {
      ACTIVE: "APPROVE_LISTING",
      CLOSED: "CLOSE_LISTING",
      REJECTED: "REJECT_LISTING",
    };

    await logDetailedAction({
      adminId: admin.id,
      action: actionMap[status] || "UPDATE_LISTING",
      entity: "LISTING",
      entityId: listingId,
      changes: JSON.parse(
        JSON.stringify({
          before: { status: currentListing.status },
          after: { status: listing.status },
          reason,
        })
      ),
      metadata: JSON.parse(
        JSON.stringify({
          listingTitle: currentListing.title,
          ipAddress: headersList.get("x-forwarded-for") || "unknown",
        })
      ),
    });

    return json({ success: true, listing });
  } catch (error) {
    console.error("Listing update error:", error);
    return json(
      { error: error instanceof Error ? error.message : "Update failed" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const admin = await requireAdmin();
    const headersList = await headers();
    const { listingIds, action } = await req.json();

    if (!listingIds?.length) {
      return json({ error: "No listing IDs" }, { status: 400 });
    }

    let actionName: string;
    let updateData: { status: ListingStatus; publishedAt?: Date | null };

    if (action === "approve") {
      updateData = {
        status: ListingStatus.ACTIVE,
        publishedAt: new Date(),
      };
      actionName = "BULK_APPROVE_LISTINGS";
    } else if (action === "close") {
      updateData = {
        status: ListingStatus.CLOSED,
        publishedAt: null,
      };
      actionName = "BULK_CLOSE_LISTINGS";
    } else if (action === "reject") {
      updateData = {
        status: ListingStatus.CLOSED,
        publishedAt: null,
      };
      actionName = "BULK_REJECT_LISTINGS";
    } else {
      return json({ error: "Invalid action" }, { status: 400 });
    }

    const result = await prisma.landListing.updateMany({
      where: { id: { in: listingIds } },
      data: updateData,
    });

    await logDetailedAction({
      adminId: admin.id,
      action: actionName,
      entity: "LISTING",
      metadata: JSON.parse(
        JSON.stringify({
          listingIds,
          action,
          count: listingIds.length,
          affected: result.count,
          ipAddress: headersList.get("x-forwarded-for") || "unknown",
        })
      ),
    });

    return json({ success: true, affected: result.count });
  } catch (error) {
    console.error("Bulk listing update error:", error);
    return json(
      { error: "Failed to perform bulk action" },
      { status: 500 }
    );
  }
}