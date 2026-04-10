// app/api/admin/users/[userId]/route.ts

import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/server/admin-guard";
import { prisma } from "@/lib/prisma";
import { logDetailedAction } from "@/lib/server/audit-logger";
import { headers } from "next/headers";
import { z } from "zod";

// ============= TYPES =============
interface RouteParams {
  params: Promise<{ userId: string }>;
}

// ============= VALIDATION SCHEMAS =============
const updateUserSchema = z.object({
  role: z.enum(["FARMER", "LANDOWNER", "ADMIN", "SUPER_ADMIN"]).optional(),
  isOnboarded: z.boolean().optional(),
  onboardingStep: z.number().min(0).optional(),
  name: z.string().min(1).max(100).optional(),
  phone: z.string().nullable().optional(),
  state: z.string().nullable().optional(),
  district: z.string().nullable().optional(),
  bio: z.string().max(500).nullable().optional(),
});

// ============= HELPER =============
const json = <T>(data: T, init?: ResponseInit): NextResponse<T> => {
  return NextResponse.json(data, init) as NextResponse<T>;
};

// ============= GET /api/admin/users/[userId] =============
export async function GET(
  req: NextRequest,
  { params }: RouteParams
): Promise<NextResponse> {
  try {
    const admin = await requireAdmin();
    const headersList = await headers();
    
    // Await params in Next.js 15
    const { userId } = await params;

    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        farmerProfile: {
          select: {
            id: true,
            primaryCrops: true,
            farmingExperience: true,
            farmingType: true,
            requiredLandSize: true,
            leaseDuration: true,
            irrigationNeeded: true,
            equipmentAccess: true,
            isVerified: true,
          },
        },
        landownerProfile: {
          select: {
            id: true,
            ownershipType: true,
            verificationLevel: true,
            preferredPaymentFrequency: true,
            preferredContactMethod: true,
            isVerified: true,
          },
        },
        _count: {
          select: {
            applications: true,
            listingsOwned: true,
            leasesAsFarmer: true,
            leasesAsOwner: true,
            payments: true,
            savedListings: true,
            bids: true,
            reviewsReceived: true,
            reviewsGiven: true,
          },
        },
      },
    });

    if (!user) {
      return json({ error: "User not found" }, { status: 404 });
    }

    // Get recent activity
    const recentActivity = await Promise.all([
      prisma.application.findMany({
        where: { farmerId: userId },
        orderBy: { createdAt: "desc" },
        take: 5,
        select: {
          id: true,
          status: true,
          createdAt: true,
          land: { select: { title: true } },
        },
      }),
      prisma.payment.findMany({
        where: { userId },
        orderBy: { createdAt: "desc" },
        take: 5,
        select: {
          id: true,
          amount: true,
          status: true,
          createdAt: true,
        },
      }),
      prisma.lease.findMany({
        where: { OR: [{ farmerId: userId }, { ownerId: userId }] },
        orderBy: { createdAt: "desc" },
        take: 5,
        select: {
          id: true,
          status: true,
          startDate: true,
          endDate: true,
          land: { select: { title: true } },
        },
      }),
    ]);

    await logDetailedAction({
      adminId: admin.id,
      action: "VIEW_USER",
      entity: "USER",
      entityId: userId,
      metadata: {
        userEmail: user.email,
        userRole: user.role,
        ipAddress: headersList.get("x-forwarded-for") || "unknown",
      },
    });

    return json({
      user,
      recentActivity: {
        applications: recentActivity[0],
        payments: recentActivity[1],
        leases: recentActivity[2],
      },
    });
  } catch (error) {
    console.error("User fetch error:", error);
    
    if (error instanceof Error && error.message === "Unauthorized") {
      return json({ error: "Unauthorized" }, { status: 403 });
    }
    
    return json(
      { error: error instanceof Error ? error.message : "Failed to fetch user" },
      { status: 500 }
    );
  }
}

// ============= PATCH /api/admin/users/[userId] =============
export async function PATCH(
  req: NextRequest,
  { params }: RouteParams
): Promise<NextResponse> {
  try {
    const admin = await requireAdmin();
    const headersList = await headers();
    const body = await req.json();
    
    // Await params in Next.js 15
    const { userId } = await params;

    // Validate input
    const validated = updateUserSchema.parse(body);

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        role: true,
        isOnboarded: true,
        onboardingStep: true,
        name: true,
        phone: true,
        state: true,
        district: true,
        bio: true,
      },
    });

    if (!user) {
      return json({ error: "User not found" }, { status: 404 });
    }

    // Prevent super admin modification by non-super admins
    if (user.role === "SUPER_ADMIN" && admin.role !== "SUPER_ADMIN") {
      return json({ error: "Cannot modify super admin account" }, { status: 403 });
    }

    // Build update data
    const updateData: Record<string, unknown> = {};
    
    if (validated.role !== undefined) updateData.role = validated.role;
    if (validated.isOnboarded !== undefined) updateData.isOnboarded = validated.isOnboarded;
    if (validated.onboardingStep !== undefined) updateData.onboardingStep = validated.onboardingStep;
    if (validated.name !== undefined) updateData.name = validated.name;
    if (validated.phone !== undefined) updateData.phone = validated.phone;
    if (validated.state !== undefined) updateData.state = validated.state;
    if (validated.district !== undefined) updateData.district = validated.district;
    if (validated.bio !== undefined) updateData.bio = validated.bio;

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: updateData,
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        isOnboarded: true,
        onboardingStep: true,
        phone: true,
        state: true,
        district: true,
        bio: true,
        updatedAt: true,
      },
    });

    await logDetailedAction({
      adminId: admin.id,
      action: "UPDATE_USER",
      entity: "USER",
      entityId: userId,
      changes: {
        before: {
          role: user.role,
          isOnboarded: user.isOnboarded,
          name: user.name,
          phone: user.phone,
        },
        after: {
          role: updatedUser.role,
          isOnboarded: updatedUser.isOnboarded,
          name: updatedUser.name,
          phone: updatedUser.phone,
        },
      },
      metadata: {
        userEmail: user.email,
        ipAddress: headersList.get("x-forwarded-for") || "unknown",
      },
    });

    return json({
      success: true,
      user: updatedUser,
      message: "User updated successfully",
    });
  } catch (error) {
    console.error("User update error:", error);
    
    if (error instanceof z.ZodError) {
      return json(
        { error: "Validation failed", details: error.issues },
        { status: 400 }
      );
    }
    
    if (error instanceof Error && error.message === "Unauthorized") {
      return json({ error: "Unauthorized" }, { status: 403 });
    }
    
    return json(
      { error: error instanceof Error ? error.message : "Update failed" },
      { status: 500 }
    );
  }
}

// ============= DELETE /api/admin/users/[userId] =============
export async function DELETE(
  req: NextRequest,
  { params }: RouteParams
): Promise<NextResponse> {
  try {
    // Only SUPER_ADMIN can delete users
    const admin = await requireAdmin({ allowedRoles: ["SUPER_ADMIN"] });
    const headersList = await headers();
    
    // Await params in Next.js 15
    const { userId } = await params;

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        clerkUserId: true,
      },
    });

    if (!user) {
      return json({ error: "User not found" }, { status: 404 });
    }

    // Prevent deleting super admin accounts
    if (user.role === "SUPER_ADMIN") {
      return json({ error: "Cannot delete super admin account" }, { status: 403 });
    }

    // Prevent self-deletion
    if (user.id === admin.id) {
      return json({ error: "Cannot delete your own account" }, { status: 403 });
    }

    // Soft delete - anonymize user data
    const timestamp = Date.now();
    const anonymizedUser = await prisma.user.update({
      where: { id: userId },
      data: {
        role: null,
        isOnboarded: false,
        name: `[Deleted User ${timestamp}]`,
        email: `deleted_${timestamp}_${userId.slice(0, 8)}@deleted.com`,
        phone: null,
        imageUrl: null,
        bio: null,
        state: null,
        district: null,
        // Keep clerkUserId for reference but mark as deleted
      },
    });

    // Optionally, you can also clean up related data
    // await cleanupUserData(userId);

    await logDetailedAction({
      adminId: admin.id,
      action: "DELETE_USER",
      entity: "USER",
      entityId: userId,
      metadata: {
        userEmail: user.email,
        userName: user.name,
        userRole: user.role,
        clerkUserId: user.clerkUserId,
        ipAddress: headersList.get("x-forwarded-for") || "unknown",
      },
    });

    return json({
      success: true,
      message: "User deleted successfully",
      userId: anonymizedUser.id,
    });
  } catch (error) {
    console.error("User delete error:", error);
    
    if (error instanceof Error && error.message === "Unauthorized") {
      return json({ error: "Unauthorized" }, { status: 403 });
    }
    
    return json(
      { error: error instanceof Error ? error.message : "Delete failed" },
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