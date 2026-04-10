// app/api/admin/analytics/route.ts
import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/server/admin-guard";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  try {
    await requireAdmin();

    const searchParams = req.nextUrl.searchParams;
    const range = searchParams.get("range") || "last30days";

    const dateRange = getDateRange(range);

    const [userStats, listingStats, applicationStats, paymentStats] = await Promise.all([
      prisma.user.groupBy({
        by: ["role"],
        where: { createdAt: { gte: dateRange.start } },
        _count: true,
      }),
      prisma.landListing.groupBy({
        by: ["status"],
        where: { createdAt: { gte: dateRange.start } },
        _count: true,
      }),
      prisma.application.groupBy({
        by: ["status"],
        where: { createdAt: { gte: dateRange.start } },
        _count: true,
      }),
      prisma.payment.aggregate({
        where: {
          status: "SUCCESS",
          createdAt: { gte: dateRange.start },
        },
        _sum: { amount: true },
        _count: true,
      }),
    ]);

    return NextResponse.json({
      range: { start: dateRange.start, end: dateRange.end },
      users: userStats,
      listings: listingStats,
      applications: applicationStats,
      payments: {
        total: paymentStats._sum.amount || 0,
        count: paymentStats._count,
      },
    });
  } catch {
    return NextResponse.json(
      { error: "Failed to fetch analytics" },
      { status: 500 }
    );
  }
}

function getDateRange(range: string): { start: Date; end: Date } {
  const end = new Date();
  const start = new Date();

  switch (range) {
    case "today":
      start.setHours(0, 0, 0, 0);
      break;
    case "yesterday":
      start.setDate(start.getDate() - 1);
      start.setHours(0, 0, 0, 0);
      end.setDate(end.getDate() - 1);
      end.setHours(23, 59, 59, 999);
      break;
    case "last7days":
      start.setDate(start.getDate() - 7);
      break;
    case "last30days":
      start.setDate(start.getDate() - 30);
      break;
    case "thisMonth":
      start.setDate(1);
      start.setHours(0, 0, 0, 0);
      break;
    default:
      start.setDate(start.getDate() - 30);
  }

  return { start, end };
}