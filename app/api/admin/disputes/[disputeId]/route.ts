// app/api/admin/disputes/[disputeId]/route.ts

import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/server/admin-guard";
import { prisma } from "@/lib/prisma";
import { headers } from "next/headers";
import { z } from "zod";
import { logDetailedAction } from "@/lib/server/audit-logger";

// ============= TYPES =============
interface RouteParams {
  params: Promise<{ disputeId: string }>;
}

// ============= VALIDATION SCHEMAS =============
const updateDisputeSchema = z.object({
  status: z.enum(["PENDING", "UNDER_REVIEW", "RESOLVED", "ESCALATED", "DISMISSED"]).optional(),
  priority: z.enum(["LOW", "MEDIUM", "HIGH", "URGENT"]).optional(),
  assignedTo: z.string().optional(),
  resolution: z.string().max(1000).optional(),
  notes: z.string().max(2000).optional(),
});

// ============= HELPER =============
const json = <T>(data: T, init?: ResponseInit): NextResponse<T> => {
  return NextResponse.json(data, init) as NextResponse<T>;
};

// ============= GET /api/admin/disputes/[disputeId] =============
export async function GET(
  req: NextRequest,
  { params }: RouteParams
): Promise<NextResponse> {
  try {
    const admin = await requireAdmin();
    const headersList = await headers();
    
    const { disputeId } = await params;

    const dispute = await prisma.dispute.findUnique({
      where: { id: disputeId },
      include: {
        filedBy: {
          select: {
            id: true,
            name: true,
            email: true,
            role: true,
          },
        },
        assigned: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        resolutions: {
          include: {
            admin: {
              select: {
                id: true,
                name: true,
              },
            },
          },
          orderBy: { createdAt: "desc" },
        },
      },
    });

    if (!dispute) {
      return json({ error: "Dispute not found" }, { status: 404 });
    }

    await logDetailedAction({
      adminId: admin.id,
      action: "VIEW_DISPUTE_DETAILS",
      entity: "DISPUTE",
      entityId: disputeId,
      metadata: {
        ipAddress: headersList.get("x-forwarded-for") || "unknown",
      },
    });

    return json({ dispute });
  } catch (error) {
    console.error("Dispute fetch error:", error);
    return json(
      { error: "Failed to fetch dispute" },
      { status: 500 }
    );
  }
}

// ============= PATCH /api/admin/disputes/[disputeId] =============
export async function PATCH(
  req: NextRequest,
  { params }: RouteParams
): Promise<NextResponse> {
  try {
    const admin = await requireAdmin();
    const headersList = await headers();
    const body = await req.json();
    
    const { disputeId } = await params;
    const validated = updateDisputeSchema.parse(body);

    const currentDispute = await prisma.dispute.findUnique({
      where: { id: disputeId },
    });

    if (!currentDispute) {
      return json({ error: "Dispute not found" }, { status: 404 });
    }

    // Prepare update data
    const updateData: Record<string, unknown> = {};
    
    if (validated.status) updateData.status = validated.status;
    if (validated.priority) updateData.priority = validated.priority;
    if (validated.assignedTo !== undefined) updateData.assignedTo = validated.assignedTo || null;
    
    if (validated.status === "RESOLVED" || validated.status === "DISMISSED") {
      updateData.resolvedAt = new Date();
      updateData.resolution = validated.resolution || null;
    }

    const updatedDispute = await prisma.dispute.update({
      where: { id: disputeId },
      data: updateData,
    });

    // Create resolution record
    if (validated.status && validated.status !== currentDispute.status) {
      await prisma.disputeResolution.create({
        data: {
          disputeId,
          adminId: admin.id,
          action: validated.status,
          notes: validated.notes || `Status changed to ${validated.status}`,
          metadata: {
            previousStatus: currentDispute.status,
            newStatus: validated.status,
          },
        },
      });
    } else if (validated.notes) {
      await prisma.disputeResolution.create({
        data: {
          disputeId,
          adminId: admin.id,
          action: "NOTE_ADDED",
          notes: validated.notes,
        },
      });
    }

    await logDetailedAction({
      adminId: admin.id,
      action: "UPDATE_DISPUTE",
      entity: "DISPUTE",
      entityId: disputeId,
      changes: {
        before: { 
          status: currentDispute.status, 
          priority: currentDispute.priority,
          assignedTo: currentDispute.assignedTo,
        },
        after: { 
          status: updatedDispute.status, 
          priority: updatedDispute.priority,
          assignedTo: updatedDispute.assignedTo,
        },
      },
      metadata: {
        ipAddress: headersList.get("x-forwarded-for") || "unknown",
      },
    });

    return json({
      success: true,
      dispute: updatedDispute,
      message: "Dispute updated successfully",
    });
  } catch (error) {
    console.error("Dispute update error:", error);
    
    if (error instanceof z.ZodError) {
      return json(
        { error: "Validation failed", details: error.issues },
        { status: 400 }
      );
    }
    
    return json(
      { error: "Failed to update dispute" },
      { status: 500 }
    );
  }
}

// ============= DELETE /api/admin/disputes/[disputeId] =============
export async function DELETE(
  req: NextRequest,
  { params }: RouteParams
): Promise<NextResponse> {
  try {
    const admin = await requireAdmin();
    const headersList = await headers();
    
    const { disputeId } = await params;

    const dispute = await prisma.dispute.findUnique({
      where: { id: disputeId },
    });

    if (!dispute) {
      return json({ error: "Dispute not found" }, { status: 404 });
    }

    // Soft delete by marking as dismissed
    await prisma.dispute.update({
      where: { id: disputeId },
      data: {
        status: "DISMISSED",
        resolution: "Dispute deleted by admin",
        resolvedAt: new Date(),
      },
    });

    await prisma.disputeResolution.create({
      data: {
        disputeId,
        adminId: admin.id,
        action: "DELETED",
        notes: `Deleted by ${admin.name} on ${new Date().toISOString()}`,
      },
    });

    await logDetailedAction({
      adminId: admin.id,
      action: "DELETE_DISPUTE",
      entity: "DISPUTE",
      entityId: disputeId,
      metadata: {
        ipAddress: headersList.get("x-forwarded-for") || "unknown",
      },
    });

    return json({ 
      success: true, 
      message: "Dispute deleted successfully",
    });
  } catch (error) {
    console.error("Dispute deletion error:", error);
    return json(
      { error: "Failed to delete dispute" },
      { status: 500 }
    );
  }
}

// ============= OPTIONS =============
export async function OPTIONS(): Promise<NextResponse> {
  return json(null, {
    status: 204,
    headers: {
      Allow: "GET, PATCH, DELETE, OPTIONS",
      "Access-Control-Allow-Methods": "GET, PATCH, DELETE, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type, Authorization",
      "Access-Control-Max-Age": "86400",
    },
  });
}