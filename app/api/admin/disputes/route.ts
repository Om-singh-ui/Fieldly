// app/api/admin/disputes/route.ts

import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/server/admin-guard";
import { prisma } from "@/lib/prisma";
import { headers } from "next/headers";
import { z } from "zod";
import { logDetailedAction } from "@/lib/server/audit-logger";

// ============= VALIDATION SCHEMAS =============
const disputeQuerySchema = z.object({
  page: z.coerce.number().min(1).default(1),
  limit: z.coerce.number().min(1).max(100).default(20),
  status: z.enum(["PENDING", "UNDER_REVIEW", "RESOLVED", "ESCALATED", "DISMISSED"]).optional(),
  priority: z.enum(["LOW", "MEDIUM", "HIGH", "URGENT"]).optional(),
  type: z.string().optional(),
  search: z.string().optional(),
});

const createDisputeSchema = z.object({
  type: z.string().min(1),
  entityId: z.string().min(1),
  filedByRole: z.enum(["FARMER", "LANDOWNER", "ADMIN", "SUPER_ADMIN"]),
  reason: z.string().min(10).max(1000),
  description: z.string().min(20).max(5000).optional(),
  priority: z.enum(["LOW", "MEDIUM", "HIGH", "URGENT"]).default("MEDIUM"),
});

// ============= HELPER =============
const json = <T>(data: T, init?: ResponseInit): NextResponse<T> => {
  return NextResponse.json(data, init) as NextResponse<T>;
};

// ============= GET /api/admin/disputes =============
export async function GET(
  req: NextRequest
): Promise<NextResponse> {
  try {
    const admin = await requireAdmin();
    const headersList = await headers();
    
    const searchParams = req.nextUrl.searchParams;
    const queryParams = {
      page: searchParams.get("page") ? parseInt(searchParams.get("page")!) : undefined,
      limit: searchParams.get("limit") ? parseInt(searchParams.get("limit")!) : undefined,
      status: searchParams.get("status") || undefined,
      priority: searchParams.get("priority") || undefined,
      type: searchParams.get("type") || undefined,
      search: searchParams.get("search") || undefined,
    };

    const validated = disputeQuerySchema.parse(queryParams);
    const { page, limit, status, priority, type, search } = validated;

    // Build where clause
    const where: Record<string, unknown> = {};
    
    if (status) where.status = status;
    if (priority) where.priority = priority;
    if (type) where.type = type;
    
    if (search) {
      where.OR = [
        { reason: { contains: search, mode: "insensitive" } },
        { description: { contains: search, mode: "insensitive" } },
        { entityId: { contains: search, mode: "insensitive" } },
      ];
    }

    // Fetch disputes with pagination
    const [disputes, total, stats] = await Promise.all([
      prisma.dispute.findMany({
        where,
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
            take: 1,
            orderBy: { createdAt: "desc" },
            include: {
              admin: {
                select: {
                  id: true,
                  name: true,
                },
              },
            },
          },
        },
        orderBy: [
          { priority: "desc" },
          { createdAt: "desc" },
        ],
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.dispute.count({ where }),
      prisma.dispute.groupBy({
        by: ["status"],
        _count: true,
      }),
    ]);

    // Calculate statistics
    const statusCounts: Record<string, number> = {};
    stats.forEach((s) => {
      statusCounts[s.status] = s._count;
    });

    const urgentCount = await prisma.dispute.count({
      where: { 
        priority: "URGENT", 
        status: { notIn: ["RESOLVED", "DISMISSED"] } 
      },
    });

    // Log the view action
    await logDetailedAction({
      adminId: admin.id,
      action: "VIEW_DISPUTES",
      entity: "DISPUTE",
      metadata: {
        filters: { status, priority, type, search },
        ipAddress: headersList.get("x-forwarded-for") || "unknown",
      },
    });

    return json({
      disputes,
      stats: {
        total,
        byStatus: statusCounts,
        urgentCount,
        pendingCount: statusCounts["PENDING"] || 0,
        resolvedCount: statusCounts["RESOLVED"] || 0,
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
    console.error("Disputes fetch error:", error);
    
    if (error instanceof z.ZodError) {
      return json(
        { error: "Invalid query parameters", details: error.issues },
        { status: 400 }
      );
    }
    
    return json(
      { error: "Failed to fetch disputes" },
      { status: 500 }
    );
  }
}

// ============= POST /api/admin/disputes =============
export async function POST(
  req: NextRequest
): Promise<NextResponse> {
  try {
    const admin = await requireAdmin();
    const headersList = await headers();
    const body = await req.json();
    
    const validated = createDisputeSchema.parse(body);
    const { type, entityId, filedByRole, reason, description, priority } = validated;

    // Create dispute
    const dispute = await prisma.dispute.create({
      data: {
        type,
        entityId,
        filedById: admin.id,
        filedByRole,
        reason,
        description: description || null,
        priority,
        status: "PENDING",
      },
      include: {
        filedBy: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });

    // Create initial resolution note
    await prisma.disputeResolution.create({
      data: {
        disputeId: dispute.id,
        adminId: admin.id,
        action: "CREATED",
        notes: "Dispute filed",
        metadata: {
          type,
          entityId,
          reason,
        },
      },
    });

    await logDetailedAction({
      adminId: admin.id,
      action: "CREATE_DISPUTE",
      entity: "DISPUTE",
      entityId: dispute.id,
      metadata: {
        type,
        entityId,
        priority,
        ipAddress: headersList.get("x-forwarded-for") || "unknown",
      },
    });

    return json({ 
      success: true, 
      dispute,
      message: "Dispute created successfully",
    }, { status: 201 });
  } catch (error) {
    console.error("Dispute creation error:", error);
    
    if (error instanceof z.ZodError) {
      return json(
        { error: "Validation failed", details: error.issues },
        { status: 400 }
      );
    }
    
    return json(
      { error: "Failed to create dispute" },
      { status: 500 }
    );
  }
}

// ============= PATCH /api/admin/disputes (Bulk Update) =============
export async function PATCH(
  req: NextRequest
): Promise<NextResponse> {
  try {
    const admin = await requireAdmin();
    const headersList = await headers();
    const body = await req.json();
    
    const { disputeIds, action, assignedToId } = body;

    if (!disputeIds?.length) {
      return json({ error: "No dispute IDs provided" }, { status: 400 });
    }

    let result;
    let actionName: string;

    if (action === "assign") {
      if (!assignedToId) {
        return json({ error: "assignedToId is required" }, { status: 400 });
      }
      
      result = await prisma.dispute.updateMany({
        where: { id: { in: disputeIds } },
        data: { assignedTo: assignedToId },
      });
      actionName = "BULK_ASSIGN_DISPUTES";
    } else if (action === "dismiss") {
      result = await prisma.dispute.updateMany({
        where: { id: { in: disputeIds } },
        data: { 
          status: "DISMISSED",
          resolvedAt: new Date(),
        },
      });
      
      // Create resolution records for each
      for (const disputeId of disputeIds) {
        await prisma.disputeResolution.create({
          data: {
            disputeId,
            adminId: admin.id,
            action: "DISMISSED",
            notes: "Bulk dismissed by admin",
          },
        });
      }
      actionName = "BULK_DISMISS_DISPUTES";
    } else {
      return json({ error: "Invalid action" }, { status: 400 });
    }

    await logDetailedAction({
      adminId: admin.id,
      action: actionName,
      entity: "DISPUTE",
      metadata: {
        disputeIds,
        action,
        affected: result.count,
        ipAddress: headersList.get("x-forwarded-for") || "unknown",
      },
    });

    return json({ 
      success: true, 
      affected: result.count,
      message: `${result.count} disputes updated`,
    });
  } catch (error) {
    console.error("Bulk dispute update error:", error);
    return json(
      { error: "Failed to update disputes" },
      { status: 500 }
    );
  }
}

// ============= OPTIONS =============
export async function OPTIONS(): Promise<NextResponse> {
  return json(null, {
    status: 204,
    headers: {
      Allow: "GET, POST, PATCH, OPTIONS",
      "Access-Control-Allow-Methods": "GET, POST, PATCH, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type, Authorization",
      "Access-Control-Max-Age": "86400",
    },
  });
}