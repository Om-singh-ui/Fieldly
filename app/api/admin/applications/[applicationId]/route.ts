// app/api/admin/applications/[applicationId]/route.ts

import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/server/admin-guard";
import { prisma } from "@/lib/prisma";
import { logDetailedAction } from "@/lib/server/audit-logger";
import { headers } from "next/headers";
import { z } from "zod";
import { notifyApplicationStatusChange } from "@/services/notifications/notificationTrigger.service";

// ============= TYPES =============
interface RouteParams {
  params: Promise<{ applicationId: string }>;
}

// ============= VALIDATION SCHEMA =============
const updateApplicationSchema = z.object({
  status: z.enum(["PENDING", "UNDER_REVIEW", "APPROVED", "REJECTED", "WITHDRAWN", "EXPIRED"]),
  reviewNotes: z.string().max(500).optional(),
});

// ============= HELPER =============
const json = <T>(data: T, init?: ResponseInit): NextResponse<T> => {
  return NextResponse.json(data, init) as NextResponse<T>;
};

// ============= GET /api/admin/applications/[applicationId] =============
export async function GET(
  req: NextRequest,
  { params }: RouteParams
): Promise<NextResponse> {
  try {
    const admin = await requireAdmin();
    const headersList = await headers();
    
    // Await params in Next.js 15
    const { applicationId } = await params;

    const application = await prisma.application.findUnique({
      where: { id: applicationId },
      include: {
        farmer: {
          select: {
            id: true,
            name: true,
            email: true,
            phone: true,
            farmerProfile: true,
          },
        },
        land: {
          include: {
            landowner: {
              include: {
                user: { 
                  select: { 
                    id: true, 
                    name: true, 
                    email: true, 
                    phone: true 
                  } 
                },
              },
            },
          },
        },
        listing: true,
      },
    });

    if (!application) {
      return json({ error: "Application not found" }, { status: 404 });
    }

    await logDetailedAction({
      adminId: admin.id,
      action: "VIEW_APPLICATION_DETAILS",
      entity: "APPLICATION",
      entityId: applicationId,
      metadata: {
        ipAddress: headersList.get("x-forwarded-for") || "unknown",
      },
    });

    return json({ application });
  } catch (error) {
    console.error("Application fetch error:", error);
    return json(
      { error: "Failed to fetch application" },
      { status: 500 }
    );
  }
}

// ============= PATCH /api/admin/applications/[applicationId] =============
export async function PATCH(
  req: NextRequest,
  { params }: RouteParams
): Promise<NextResponse> {
  try {
    const admin = await requireAdmin();
    const headersList = await headers();
    const body = await req.json();
    
    // Await params in Next.js 15
    const { applicationId } = await params;

    const validated = updateApplicationSchema.parse(body);

    const currentApplication = await prisma.application.findUnique({
      where: { id: applicationId },
    });

    if (!currentApplication) {
      return json({ error: "Application not found" }, { status: 404 });
    }

    const updatedApplication = await prisma.application.update({
      where: { id: applicationId },
      data: {
        status: validated.status,
        reviewNotes: validated.reviewNotes,
        reviewedAt: new Date(),
      },
    });

    // Send notification if status changed
    if (currentApplication.status !== validated.status) {
      await notifyApplicationStatusChange(
        applicationId,
        currentApplication.status,
        validated.status
      );
    }

    await logDetailedAction({
      adminId: admin.id,
      action: "UPDATE_APPLICATION",
      entity: "APPLICATION",
      entityId: applicationId,
      changes: {
        before: { status: currentApplication.status },
        after: { status: validated.status },
      },
      metadata: {
        ipAddress: headersList.get("x-forwarded-for") || "unknown",
      },
    });

    return json({
      success: true,
      application: updatedApplication,
      message: "Application updated successfully",
    });
  } catch (error) {
    console.error("Application update error:", error);
    
    if (error instanceof z.ZodError) {
      return json(
        { error: "Validation failed", details: error.issues },
        { status: 400 }
      );
    }
    
    return json(
      { error: "Failed to update application" },
      { status: 500 }
    );
  }
}

// ============= DELETE /api/admin/applications/[applicationId] =============
export async function DELETE(
  req: NextRequest,
  { params }: RouteParams
): Promise<NextResponse> {
  try {
    const admin = await requireAdmin();
    const headersList = await headers();
    
    // Await params in Next.js 15
    const { applicationId } = await params;

    const application = await prisma.application.findUnique({
      where: { id: applicationId },
    });

    if (!application) {
      return json({ error: "Application not found" }, { status: 404 });
    }

    await prisma.application.delete({
      where: { id: applicationId },
    });

    await logDetailedAction({
      adminId: admin.id,
      action: "DELETE_APPLICATION",
      entity: "APPLICATION",
      entityId: applicationId,
      metadata: {
        ipAddress: headersList.get("x-forwarded-for") || "unknown",
      },
    });

    return json({ 
      success: true, 
      message: "Application deleted successfully" 
    });
  } catch (error) {
    console.error("Application delete error:", error);
    return json(
      { error: "Failed to delete application" },
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