// app/api/admin/auth/logout/route.ts
import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";
import { revokeAllAdminSessions } from "@/lib/server/session-manager";
import { logSecurityEvent } from "@/lib/server/security-logger";
import { headers } from "next/headers";

export async function POST() {
  try {
    const { userId } = await auth();
    const headersList = await headers();
    const ipAddress = headersList.get("x-forwarded-for") || "unknown";

    if (!userId) {
      return NextResponse.json(
        { error: "Not authenticated" },
        { status: 401 }
      );
    }

    const user = await prisma.user.findUnique({
      where: { clerkUserId: userId },
      select: { id: true },
    });

    if (user) {
      await revokeAllAdminSessions(user.id, user.id);

      await logSecurityEvent({
        type: "ADMIN_LOGOUT",
        severity: "LOW",
        userId: user.id,
        ipAddress,
      });

      await prisma.adminAction.create({
        data: {
          adminId: user.id,
          action: "LOGOUT",
          entity: "ADMIN",
          ipAddress,
        },
      });
    }

    return NextResponse.json({
      success: true,
      message: "Logged out successfully",
    });
  } catch (error) {
    console.error("Admin logout error:", error);
    return NextResponse.json(
      { error: "Logout failed" },
      { status: 500 }
    );
  }
}