// app/api/admin/listings/bulk-status/route.ts
import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/server/admin-guard";
import { prisma } from "@/lib/prisma";
import { logDetailedAction } from "@/lib/server/audit-logger";
import { headers } from "next/headers";
import { ListingStatus, NotificationType } from "@prisma/client";

export async function PUT(req: NextRequest) {
  try {
    const admin = await requireAdmin();
    const headersList = await headers();
    const body = await req.json();
    const { listingIds, status, reason } = body;

    console.log("Bulk status update request:", { listingIds, status, reason });

    // Validate request
    if (!listingIds || !Array.isArray(listingIds) || listingIds.length === 0) {
      return NextResponse.json(
        { error: "listingIds array is required and must not be empty" },
        { status: 400 }
      );
    }

    if (!status) {
      return NextResponse.json(
        { error: "status is required" },
        { status: 400 }
      );
    }

    // Validate status is a valid ListingStatus
    const validStatuses = ["ACTIVE", "CLOSED", "CANCELLED", "EXPIRED", "DRAFT", "PENDING_APPROVAL"];
    if (!validStatuses.includes(status)) {
      return NextResponse.json(
        { error: `Invalid status. Must be one of: ${validStatuses.join(", ")}` },
        { status: 400 }
      );
    }

    // Get current listings to validate and for notifications
    const currentListings = await prisma.landListing.findMany({
      where: { id: { in: listingIds } },
      select: { 
        id: true, 
        status: true, 
        ownerId: true, 
        title: true,
        publishedAt: true 
      },
    });

    if (currentListings.length === 0) {
      return NextResponse.json(
        { error: "No listings found with the provided IDs" },
        { status: 404 }
      );
    }

    // Valid status transitions
    const VALID_TRANSITIONS: Record<string, string[]> = {
      DRAFT: ["PENDING_APPROVAL", "CANCELLED"],
      PENDING_APPROVAL: ["ACTIVE", "DRAFT", "CANCELLED"],
      ACTIVE: ["CLOSED", "CANCELLED", "EXPIRED"],
      CLOSED: ["ACTIVE"],
      CANCELLED: [],
      EXPIRED: ["ACTIVE"],
    };

    // Filter listings that can be transitioned
    const validListingIds = currentListings
      .filter(listing => VALID_TRANSITIONS[listing.status]?.includes(status))
      .map(l => l.id);

    if (validListingIds.length === 0) {
      return NextResponse.json(
        { error: "No listings can be transitioned to the selected status from their current state" },
        { status: 400 }
      );
    }

    // Update all valid listings
    const prismaStatus = status as ListingStatus;
    
    const result = await prisma.landListing.updateMany({
      where: { id: { in: validListingIds } },
      data: {
        status: prismaStatus,
        publishedAt: status === "ACTIVE" ? new Date() : undefined,
      },
    });

    // Create notifications for affected owners
    const affectedListings = currentListings.filter(l => validListingIds.includes(l.id));
    const notifications = affectedListings.map(listing => ({
      userId: listing.ownerId,
      type: NotificationType.LISTING,
      title: "Listing Status Updated by Admin",
      message: `Your listing "${listing.title}" status has been changed to ${status}.${reason ? ` Reason: ${reason}` : ''}`,
      actionUrl: `/dashboard/listings/${listing.id}`,
      entityId: listing.id,
      entityType: "LISTING",
    }));

    if (notifications.length > 0) {
      await prisma.notification.createMany({
        data: notifications,
      });
    }

    // Log the action
    await logDetailedAction({
      adminId: admin.id,
      action: "BULK_CHANGE_LISTING_STATUS",
      entity: "LISTING",
      metadata: {
        requestedIds: listingIds,
        validIds: validListingIds,
        status,
        reason,
        affected: result.count,
        ipAddress: headersList.get("x-forwarded-for") || "unknown",
      },
    });

    return NextResponse.json({
      success: true,
      affected: result.count,
      totalRequested: listingIds.length,
      message: `Changed status for ${result.count} out of ${listingIds.length} listings to ${status}`,
    });
  } catch (error) {
    console.error("Bulk status change error:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to update status" },
      { status: 500 }
    );
  }
}   