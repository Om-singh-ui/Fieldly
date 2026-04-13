// app/api/admin/listings/bulk/route.ts
import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/server/admin-guard";
import { prisma } from "@/lib/prisma";
import { logDetailedAction } from "@/lib/server/audit-logger";
import { headers } from "next/headers";
import { ListingStatus } from "@prisma/client";

interface BulkUpdateData {
  status: ListingStatus;
  publishedAt?: Date | null;
}

export async function POST(req: NextRequest) {
  try {
    const admin = await requireAdmin();
    const headersList = await headers();
    const { listingIds, action } = await req.json();

    if (!listingIds?.length) {
      return NextResponse.json({ error: "No listing IDs provided" }, { status: 400 });
    }

    let updateData: BulkUpdateData;
    let actionName: string;

    switch (action) {
      case "approve":
        updateData = {
          status: ListingStatus.ACTIVE,
          publishedAt: new Date(),
        };
        actionName = "BULK_APPROVE_LISTINGS";
        break;
      case "reject":
        updateData = {
          status: ListingStatus.CLOSED,
          publishedAt: null,
        };
        actionName = "BULK_REJECT_LISTINGS";
        break;
      case "close":
        updateData = {
          status: ListingStatus.CLOSED,
          publishedAt: null,
        };
        actionName = "BULK_CLOSE_LISTINGS";
        break;
      case "activate":
        updateData = {
          status: ListingStatus.ACTIVE,
          publishedAt: new Date(),
        };
        actionName = "BULK_ACTIVATE_LISTINGS";
        break;
      case "cancel":
        updateData = {
          status: ListingStatus.CANCELLED,
          publishedAt: null,
        };
        actionName = "BULK_CANCEL_LISTINGS";
        break;
      default:
        return NextResponse.json({ error: "Invalid action" }, { status: 400 });
    }

    const result = await prisma.landListing.updateMany({
      where: { id: { in: listingIds } },
      data: updateData,
    });

    await logDetailedAction({
      adminId: admin.id,
      action: actionName,
      entity: "LISTING",
      metadata: {
        listingIds,
        action,
        count: listingIds.length,
        affected: result.count,
        ipAddress: headersList.get("x-forwarded-for") || "unknown",
      },
    });

    return NextResponse.json({ 
      success: true, 
      affected: result.count,
      message: `Successfully ${action}ed ${result.count} listings`
    });
  } catch (error) {
    console.error("Bulk listing update error:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to perform bulk action" },
      { status: 500 }
    );
  }
}