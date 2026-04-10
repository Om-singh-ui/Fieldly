// app/api/admin/applications/route.ts
import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/server/admin-guard";
import { prisma } from "@/lib/prisma";
import { logDetailedAction } from "@/lib/server/audit-logger";
import { headers } from "next/headers";

interface ApplicationWhereClause {
  status?: string;
  landownerId?: string;
  farmerId?: string;
  OR?: Array<Record<string, unknown>>;
}

export async function GET(req: NextRequest) {
  try {
    const admin = await requireAdmin();
    const headersList = await headers();

    const searchParams = req.nextUrl.searchParams;
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "20");
    const status = searchParams.get("status");
    const landownerId = searchParams.get("landownerId");
    const farmerId = searchParams.get("farmerId");
    const search = searchParams.get("search");

    const where: ApplicationWhereClause = {};
    
    if (status && status !== "all") where.status = status;
    if (landownerId) where.landownerId = landownerId;
    if (farmerId) where.farmerId = farmerId;
    if (search) {
      where.OR = [
        { land: { title: { contains: search, mode: "insensitive" as const } } },
        { farmer: { name: { contains: search, mode: "insensitive" as const } } },
      ];
    }

    const [applications, total, stats] = await Promise.all([
      prisma.application.findMany({
        where: where as Record<string, unknown>,
        include: {
          farmer: { select: { id: true, name: true, email: true } },
          land: {
            select: {
              id: true,
              title: true,
              size: true,
              village: true,
              district: true,
              landowner: { select: { user: { select: { name: true, email: true } } } },
            },
          },
          listing: { select: { id: true, title: true, basePrice: true } },
        },
        orderBy: { createdAt: "desc" },
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.application.count({ where: where as Record<string, unknown> }),
      prisma.application.groupBy({
        by: ["status"],
        where: where as Record<string, unknown>,
        _count: true,
      }),
    ]);

    await logDetailedAction({
      adminId: admin.id,
      action: "VIEW_APPLICATIONS",
      entity: "APPLICATION",
      metadata: {
        filters: { status, landownerId, farmerId, search },
        ipAddress: headersList.get("x-forwarded-for") || "unknown",
      },
    });

    return NextResponse.json({
      applications,
      stats: {
        total,
        byStatus: stats.reduce((acc, curr) => {
          acc[curr.status] = curr._count;
          return acc;
        }, {} as Record<string, number>),
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
    console.error("Applications fetch error:", error);
    return NextResponse.json(
      { error: "Failed to fetch applications" },
      { status: 500 }
    );
  }
}