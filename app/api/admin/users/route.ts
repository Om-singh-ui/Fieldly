// app/api/admin/users/route.ts
import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/server/admin-guard";
import { prisma } from "@/lib/prisma";
import { logDetailedAction } from "@/lib/server/audit-logger";
import { headers } from "next/headers";
import { z } from "zod";

interface UserWhereClause {
  role?: string;
  isOnboarded?: boolean;
  OR?: Array<Record<string, unknown>>;
}

const createUserSchema = z.object({
  email: z.string().email(),
  name: z.string().min(2).max(100),
  role: z.enum(["FARMER", "LANDOWNER", "ADMIN", "SUPER_ADMIN"]).optional(),
  phone: z.string().optional(),
  state: z.string().optional(),
  district: z.string().optional(),
});

export async function GET(req: NextRequest) {
  try {
    const admin = await requireAdmin();
    const headersList = await headers();

    const searchParams = req.nextUrl.searchParams;
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "20");
    const role = searchParams.get("role");
    const search = searchParams.get("search");
    const isOnboarded = searchParams.get("isOnboarded");
    const sortBy = searchParams.get("sortBy") || "createdAt";
    const sortOrder = (searchParams.get("sortOrder") || "desc") as "asc" | "desc";

    const where: UserWhereClause = {};
    if (role && role !== "all") where.role = role;
    if (isOnboarded !== null && isOnboarded !== undefined) where.isOnboarded = isOnboarded === "true";
    if (search) {
      where.OR = [
        { name: { contains: search, mode: "insensitive" as const } },
        { email: { contains: search, mode: "insensitive" as const } },
        { phone: { contains: search, mode: "insensitive" as const } },
      ];
    }

    const allowedSortFields = ["name", "email", "role", "createdAt", "isOnboarded"];
    const validSortBy = allowedSortFields.includes(sortBy) ? sortBy : "createdAt";

    const [users, total, stats] = await Promise.all([
      prisma.user.findMany({
        where: where as Record<string, unknown>,
        select: {
          id: true, name: true, email: true, role: true, isOnboarded: true,
          phone: true, state: true, district: true, imageUrl: true, createdAt: true,
          _count: { select: { applications: true, listingsOwned: true, leasesAsFarmer: true, leasesAsOwner: true, payments: true } },
          farmerProfile: { select: { primaryCrops: true, requiredLandSize: true, isVerified: true } },
          landownerProfile: { select: { ownershipType: true, isVerified: true } },
        },
        orderBy: { [validSortBy]: sortOrder },
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.user.count({ where: where as Record<string, unknown> }),
      prisma.user.groupBy({ by: ["role"], where: where as Record<string, unknown>, _count: true }),
    ]);

    await logDetailedAction({
      adminId: admin.id,
      action: "VIEW_USERS",
      entity: "USER",
      metadata: JSON.parse(JSON.stringify({
        filters: { role, search, isOnboarded },
        ipAddress: headersList.get("x-forwarded-for") || "unknown",
      })),
    });

    return NextResponse.json({
      users,
      stats: { total, byRole: stats.reduce((acc, c) => { if (c.role) acc[c.role] = c._count; return acc; }, {} as Record<string, number>) },
      pagination: { page, limit, total, totalPages: Math.ceil(total / limit), hasNext: page < Math.ceil(total / limit), hasPrev: page > 1 },
    });
  } catch (error) {
    console.error("Admin users fetch error:", error);
    if (error instanceof Error) {
      if (error.message.includes("Rate limit")) return NextResponse.json({ error: "Rate limit exceeded" }, { status: 429 });
      if (error.message.includes("Unauthorized")) return NextResponse.json({ error: error.message }, { status: 403 });
    }
    return NextResponse.json({ error: "Failed to fetch users" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const admin = await requireAdmin({ allowedRoles: ["SUPER_ADMIN", "ADMIN"] });
    const headersList = await headers();
    const body = await req.json();
    const validated = createUserSchema.parse(body);

    const existingUser = await prisma.user.findUnique({ where: { email: validated.email } });
    if (existingUser) return NextResponse.json({ error: "User already exists" }, { status: 400 });

    const newUser = await prisma.user.create({
      data: {
        email: validated.email, name: validated.name, role: validated.role || null,
        phone: validated.phone, state: validated.state, district: validated.district,
        clerkUserId: `manual-${Date.now()}`,
      },
    });

    if (validated.role === "FARMER") {
      await prisma.farmerProfile.create({ data: { userId: newUser.id, farmingExperience: 0, farmingType: "MIXED", requiredLandSize: 0, leaseDuration: 12, primaryCrops: [] } });
    } else if (validated.role === "LANDOWNER") {
      await prisma.landownerProfile.create({ data: { userId: newUser.id, verificationLevel: 0 } });
    }

    await logDetailedAction({
      adminId: admin.id,
      action: "CREATE_USER",
      entity: "USER",
      entityId: newUser.id,
      changes: JSON.parse(JSON.stringify({ after: validated })),
      metadata: JSON.parse(JSON.stringify({ ipAddress: headersList.get("x-forwarded-for") || "unknown" })),
    });

    return NextResponse.json({ success: true, user: { id: newUser.id, email: newUser.email, name: newUser.name } }, { status: 201 });
  } catch (error) {
    console.error("Admin user create error:", error);
    if (error instanceof z.ZodError) return NextResponse.json({ error: "Validation failed", details: error.issues }, { status: 400 });
    return NextResponse.json({ error: "Failed to create user" }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const admin = await requireAdmin();
    const headersList = await headers();
    const { userIds, action, data } = await req.json();

    if (!userIds?.length) return NextResponse.json({ error: "No user IDs" }, { status: 400 });

    switch (action) {
      case "bulk_update_role":
        if (!data?.role) return NextResponse.json({ error: "Role required" }, { status: 400 });
        await prisma.user.updateMany({ where: { id: { in: userIds } }, data: { role: data.role } });
        break;
      case "bulk_onboard":
        await prisma.user.updateMany({ where: { id: { in: userIds } }, data: { isOnboarded: true, onboardingStep: 100 } });
        break;
      case "bulk_verify":
        await prisma.$transaction([
          prisma.farmerProfile.updateMany({ where: { userId: { in: userIds } }, data: { isVerified: true } }),
          prisma.landownerProfile.updateMany({ where: { userId: { in: userIds } }, data: { isVerified: true } }),
        ]);
        break;
      default:
        return NextResponse.json({ error: "Invalid action" }, { status: 400 });
    }

    await logDetailedAction({
      adminId: admin.id,
      action: `BULK_${action.toUpperCase()}`,
      entity: "USER",
      metadata: JSON.parse(JSON.stringify({ userIds, action, count: userIds.length, ipAddress: headersList.get("x-forwarded-for") || "unknown" })),
    });

    return NextResponse.json({ success: true, affected: userIds.length });
  } catch (error) {
    console.error("Admin bulk update error:", error);
    return NextResponse.json({ error: "Failed to perform bulk update" }, { status: 500 });
  }
}