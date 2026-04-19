// app/api/admin/listings/review/route.ts
import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/server/admin-guard";
import { prisma } from "@/lib/prisma";
import { logDetailedAction } from "@/lib/server/audit-logger";
import { headers } from "next/headers";
import { ListingStatus, NotificationType } from "@prisma/client";
import { notifyMatchingFarmersAboutListing } from "@/services/notifications/notificationTrigger.service"; 

export async function POST(req: NextRequest) {
  try {
    const admin = await requireAdmin();
    const headersList = await headers();
    const { listingId, action, notes } = await req.json();

    if (!listingId) {
      return NextResponse.json({ error: "Listing ID required" }, { status: 400 });
    }

    const currentListing = await prisma.landListing.findUnique({
      where: { id: listingId },
      include: {
        land: { select: { id: true } },
        owner: { select: { name: true, email: true } },
      },
    });

    if (!currentListing) {
      return NextResponse.json({ error: "Listing not found" }, { status: 404 });
    }

    let newStatus: ListingStatus;
    let actionName: string;

    if (action === "APPROVE") {
      newStatus = ListingStatus.ACTIVE;
      actionName = "APPROVE_LISTING";
    } else if (action === "REJECT") {
      newStatus = ListingStatus.CLOSED;
      actionName = "REJECT_LISTING";
    } else {
      return NextResponse.json({ error: "Invalid action" }, { status: 400 });
    }

    const updatedListing = await prisma.landListing.update({
      where: { id: listingId },
      data: {
        status: newStatus,
        publishedAt: action === "APPROVE" ? new Date() : null,
      },
    });

    // Notify landowner
    await prisma.notification.create({
      data: {
        userId: currentListing.ownerId,
        type: NotificationType.LISTING,
        title: `Listing ${action === "APPROVE" ? "Approved" : "Rejected"}`,
        message: action === "APPROVE" 
          ? `Your listing "${currentListing.title}" has been approved and is now live.`
          : `Your listing "${currentListing.title}" has been rejected. ${notes ? `Reason: ${notes}` : ''}`,
        actionUrl: `/marketplace/listings/${listingId}`,
        entityId: listingId,
        entityType: "LISTING",
      },
    });

    // NOTIFY MATCHING FARMERS WHEN LISTING IS APPROVED
    if (action === "APPROVE") {
      await notifyMatchingFarmersAboutListing(currentListing.land.id, listingId);
    }

    await logDetailedAction({
      adminId: admin.id,
      action: actionName,
      entity: "LISTING",
      entityId: listingId,
      changes: {
        before: { status: currentListing.status },
        after: { status: newStatus },
        notes,
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
      message: `Listing ${action === "APPROVE" ? "approved" : "rejected"} successfully`
    });
  } catch (error) {
    console.error("Review listing error:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to review listing" },
      { status: 500 }
    );
  }
}