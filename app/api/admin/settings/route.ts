// app/api/admin/settings/route.ts
import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/server/admin-guard";
import { prisma } from "@/lib/prisma";
import { logDetailedAction } from "@/lib/server/audit-logger";

export async function GET() {
  try {
    await requireAdmin({ allowedRoles: ["SUPER_ADMIN"] });

    const settings = await prisma.platformSetting.findMany({
      orderBy: { category: "asc" },
    });

    return NextResponse.json({ settings });
  } catch {
    return NextResponse.json(
      { error: "Failed to fetch settings" },
      { status: 500 }
    );
  }
}

export async function PUT(req: NextRequest) {
  try {
    const admin = await requireAdmin({ allowedRoles: ["SUPER_ADMIN"] });
    const body = await req.json();
    const { key, value, category, description } = body;

    const setting = await prisma.platformSetting.upsert({
      where: { key },
      update: {
        value,
        updatedBy: admin.id,
      },
      create: {
        key,
        value,
        category: category || "GENERAL",
        description: description || "",
        updatedBy: admin.id,
      },
    });

    await logDetailedAction({
      adminId: admin.id,
      action: "UPDATE_SETTING",
      entity: "PLATFORM_SETTING",
      entityId: setting.id,
      changes: { key, value },
    });

    return NextResponse.json({ setting });
  } catch {
    return NextResponse.json(
      { error: "Failed to update setting" },
      { status: 500 }
    );
  }
}