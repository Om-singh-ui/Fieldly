// app/api/admin/listings/status/route.ts
import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/server/admin-guard";
import { prisma } from "@/lib/prisma";
import { logDetailedAction } from "@/lib/server/audit-logger";
import { headers } from "next/headers";
import { ListingStatus, NotificationType } from "@prisma/client";

const VALID_TRANSITIONS: Record<string, string[]> = {
  DRAFT: ["PENDING_APPROVAL", "CANCELLED"],
  PENDING_APPROVAL: ["ACTIVE", "DRAFT", "CANCELLED"],
  ACTIVE: ["CLOSED", "CANCELLED", "EXPIRED"],
  CLOSED: ["ACTIVE"],
  CANCELLED: [],
  EXPIRED: ["ACTIVE"],
};

export async function PUT(req: NextRequest) {
  try {
    const admin = await requireAdmin();
    const headersList = await headers();
    const { listingId, status, reason } = await req.json();

    if (!listingId || !status) {
      return NextResponse.json({ error: "Listing ID and status required" }, { status: 400 });
    }

    const currentListing = await prisma.landListing.findUnique({
      where: { id: listingId },
      include: {
        owner: { select: { name: true, email: true } },
      },
    });

    if (!currentListing) {
      return NextResponse.json({ error: "Listing not found" }, { status: 404 });
    }

    const allowedTransitions = VALID_TRANSITIONS[currentListing.status] || [];
    if (!allowedTransitions.includes(status)) {
      return NextResponse.json({ 
        error: `Cannot transition from ${currentListing.status} to ${status}` 
      }, { status: 400 });
    }

    const prismaStatus = status as ListingStatus;

    const updatedListing = await prisma.landListing.update({
      where: { id: listingId },
      data: {
        status: prismaStatus,
        publishedAt: status === "ACTIVE" && !currentListing.publishedAt ? new Date() : currentListing.publishedAt,
      },
    });

    
    await prisma.notification.create({
      data: {
        userId: currentListing.ownerId,
        type: NotificationType.LISTING,
        title: "Listing Status Updated",
        message: `Your listing "${currentListing.title}" status has been changed to ${status}. ${reason ? `Reason: ${reason}` : ''}`,
        actionUrl: `/marketplace/listings/${listingId}`, 
        entityId: listingId,
        entityType: "LISTING",
      },
    });

    await logDetailedAction({
      adminId: admin.id,
      action: "CHANGE_LISTING_STATUS",
      entity: "LISTING",
      entityId: listingId,
      changes: {
        before: { status: currentListing.status },
        after: { status },
        reason,
      },
      metadata: {
        listingTitle: currentListing.title,
        ownerEmail: currentListing.owner.email,
        ipAddress: headersList.get("x-forwarded-for") || "unknown",
      },
    });

    return NextResponse.json({ 
      success: true, 
      listing: updatedListing,
      message: `Listing status changed to ${status}`
    });
  } catch (error) {
    console.error("Status change error:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to change status" },
      { status: 500 }
    );
  }
}