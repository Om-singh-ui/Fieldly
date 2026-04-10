// app/api/admin/security/alerts/route.ts
import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/server/admin-guard";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    await requireAdmin();

    const alerts = await prisma.securityEvent.findMany({
      where: {
        severity: { in: ["HIGH", "CRITICAL"] },
        createdAt: { gte: new Date(Date.now() - 24 * 60 * 60 * 1000) },
      },
      orderBy: { createdAt: "desc" },
      take: 10,
    });

    return NextResponse.json({
      alerts: alerts.map(alert => ({
        id: alert.id,
        type: alert.type,
        severity: alert.severity,
        message: `${alert.type}: ${alert.ipAddress}`,
        createdAt: alert.createdAt.toISOString(),
      })),
    });
  } catch {
    return NextResponse.json(
      { error: "Failed to fetch alerts" },
      { status: 500 }
    );
  }
}