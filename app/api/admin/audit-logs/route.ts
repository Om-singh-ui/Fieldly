// app/api/admin/audit-logs/route.ts

import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/server/admin-guard";
import { prisma } from "@/lib/prisma";
import { headers } from "next/headers";
import { z } from "zod";
import { logDetailedAction } from "@/lib/server/audit-logger";

// ============= TYPES =============
interface AuditLogQueryParams {
  page?: number;
  limit?: number;
  action?: string;
  entity?: string;
  adminId?: string;
  startDate?: string;
  endDate?: string;
}

// ============= VALIDATION SCHEMA =============
const auditLogQuerySchema = z.object({
  page: z.coerce.number().min(1).default(1),
  limit: z.coerce.number().min(1).max(100).default(20),
  action: z.string().optional(),
  entity: z.string().optional(),
  adminId: z.string().optional(),
  startDate: z.string().datetime().optional(),
  endDate: z.string().datetime().optional(),
});

// ============= HELPER =============
const json = <T>(data: T, init?: ResponseInit): NextResponse<T> => {
  return NextResponse.json(data, init) as NextResponse<T>;
};

// ============= GET /api/admin/audit-logs =============
export async function GET(
  req: NextRequest
): Promise<NextResponse> {
  try {
    const admin = await requireAdmin();
    const headersList = await headers();
    
    // Parse query parameters
    const searchParams = req.nextUrl.searchParams;
    const queryParams: AuditLogQueryParams = {
      page: searchParams.get("page") ? parseInt(searchParams.get("page")!) : undefined,
      limit: searchParams.get("limit") ? parseInt(searchParams.get("limit")!) : undefined,
      action: searchParams.get("action") || undefined,
      entity: searchParams.get("entity") || undefined,
      adminId: searchParams.get("adminId") || undefined,
      startDate: searchParams.get("startDate") || undefined,
      endDate: searchParams.get("endDate") || undefined,
    };

    const validated = auditLogQuerySchema.parse(queryParams);
    const { page, limit, action, entity, adminId, startDate, endDate } = validated;

    // Build where clause with proper typing
    const where: Record<string, unknown> = {};
    
    if (action) where.action = action;
    if (entity) where.entity = entity;
    if (adminId) where.adminId = adminId;
    
    if (startDate || endDate) {
      const dateFilter: Record<string, Date> = {};
      if (startDate) dateFilter.gte = new Date(startDate);
      if (endDate) dateFilter.lte = new Date(endDate);
      where.createdAt = dateFilter;
    }

    // Fetch audit logs with pagination
    const [logs, total] = await Promise.all([
      prisma.adminAction.findMany({
        where,
        include: {
          admin: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
        },
        orderBy: { createdAt: "desc" },
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.adminAction.count({ where }),
    ]);

    // Get unique actions and entities for filters
    const [uniqueActions, uniqueEntities] = await Promise.all([
      prisma.adminAction.groupBy({
        by: ["action"],
        _count: true,
      }),
      prisma.adminAction.groupBy({
        by: ["entity"],
        _count: true,
      }),
    ]);

    // Log the view action
    await logDetailedAction({
      adminId: admin.id,
      action: "VIEW_AUDIT_LOGS",
      entity: "AUDIT_LOG",
      metadata: {
        filters: { action, entity, adminId, startDate, endDate },
        ipAddress: headersList.get("x-forwarded-for") || "unknown",
      },
    });

    return json({
      logs,
      filters: {
        actions: uniqueActions.map((a) => ({ value: a.action, count: a._count })),
        entities: uniqueEntities.map((e) => ({ value: e.entity, count: e._count })),
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
    console.error("Audit logs fetch error:", error);
    
    if (error instanceof z.ZodError) {
      return json(
        { error: "Invalid query parameters", details: error.issues },
        { status: 400 }
      );
    }
    
    return json(
      { error: "Failed to fetch audit logs" },
      { status: 500 }
    );
  }
}

// ============= POST /api/admin/audit-logs - Create audit log entry =============
export async function POST(
  req: NextRequest
): Promise<NextResponse> {
  try {
    const admin = await requireAdmin();
    const headersList = await headers();
    const body = await req.json();
    
    const { action, entity, entityId, changes, metadata } = body;

    if (!action || !entity) {
      return json(
        { error: "Action and entity are required" },
        { status: 400 }
      );
    }

    const auditLog = await prisma.adminAction.create({
      data: {
        adminId: admin.id,
        action,
        entity,
        entityId: entityId || null,
        changes: changes || null,
        metadata: metadata || {},
        ipAddress: headersList.get("x-forwarded-for") || "unknown",
        userAgent: headersList.get("user-agent") || null,
      },
    });

    return json({ 
      success: true, 
      auditLog 
    }, { status: 201 });
  } catch (error) {
    console.error("Audit log creation error:", error);
    return json(
      { error: "Failed to create audit log" },
      { status: 500 }
    );
  }
}

// ============= DELETE /api/admin/audit-logs - Clear old logs =============
export async function DELETE(
  req: NextRequest
): Promise<NextResponse> {
  try {
    const admin = await requireAdmin();
    const headersList = await headers();
    
    const searchParams = req.nextUrl.searchParams;
    const daysToKeep = parseInt(searchParams.get("daysToKeep") || "90");

    if (daysToKeep < 30) {
      return json(
        { error: "Cannot delete logs newer than 30 days" },
        { status: 400 }
      );
    }

    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - daysToKeep);

    const result = await prisma.adminAction.deleteMany({
      where: {
        createdAt: {
          lt: cutoffDate,
        },
      },
    });

    // Log this cleanup action
    await logDetailedAction({
      adminId: admin.id,
      action: "DELETE_AUDIT_LOGS",
      entity: "AUDIT_LOG",
      metadata: {
        deletedCount: result.count,
        daysToKeep,
        cutoffDate: cutoffDate.toISOString(),
        ipAddress: headersList.get("x-forwarded-for") || "unknown",
      },
    });

    return json({
      success: true,
      message: `Deleted ${result.count} audit logs older than ${daysToKeep} days`,
      deletedCount: result.count,
    });
  } catch (error) {
    console.error("Audit logs deletion error:", error);
    return json(
      { error: "Failed to delete audit logs" },
      { status: 500 }
    );
  }
}

// ============= OPTIONS =============
export async function OPTIONS(): Promise<NextResponse> {
  return json(null, {
    status: 204,
    headers: {
      Allow: "GET, POST, DELETE, OPTIONS",
      "Access-Control-Allow-Methods": "GET, POST, DELETE, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type, Authorization",
      "Access-Control-Max-Age": "86400",
    },
  });
}