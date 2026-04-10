// app/api/admin/auth/login/route.ts
import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";
import { createAdminSession } from "@/lib/server/session-manager";
import { logSecurityEvent } from "@/lib/server/security-logger";
import { validateIP } from "@/lib/server/ip-validator";
import { headers } from "next/headers";

export async function POST() {
  try {
    const { userId } = await auth();
    const headersList = await headers();
    const ipAddress = headersList.get("x-forwarded-for") || "unknown";
    const userAgent = headersList.get("user-agent") || undefined;

    if (!userId) {
      return NextResponse.json(
        { error: "Not authenticated" },
        { status: 401 }
      );
    }

    const user = await prisma.user.findUnique({
      where: { clerkUserId: userId },
      select: { id: true, email: true, role: true },
    });

    if (!user) {
      await logSecurityEvent({
        type: "ADMIN_LOGIN_FAILED",
        severity: "HIGH",
        userId,
        ipAddress,
        metadata: { reason: "User not found in database" },
      });

      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }

    if (!["ADMIN", "SUPER_ADMIN"].includes(user.role || "")) {
      await logSecurityEvent({
        type: "ADMIN_LOGIN_DENIED",
        severity: "HIGH",
        userId: user.id,
        ipAddress,
        metadata: { userRole: user.role },
      });

      return NextResponse.json(
        { error: "Insufficient permissions" },
        { status: 403 }
      );
    }

    const isIPAllowed = await validateIP(ipAddress);
    if (!isIPAllowed) {
      await logSecurityEvent({
        type: "ADMIN_IP_BLOCKED",
        severity: "HIGH",
        userId: user.id,
        ipAddress,
        metadata: { reason: "IP not whitelisted" },
      });

      return NextResponse.json(
        { error: "Access denied from this IP" },
        { status: 403 }
      );
    }

    const session = await createAdminSession(user.id, ipAddress, userAgent);

    await logSecurityEvent({
      type: "ADMIN_LOGIN_SUCCESS",
      severity: "LOW",
      userId: user.id,
      ipAddress,
      userAgent,
    });

    await prisma.adminAction.create({
      data: {
        adminId: user.id,
        action: "LOGIN",
        entity: "ADMIN",
        ipAddress,
        userAgent,
      },
    });

    return NextResponse.json({
      success: true,
      session: {
        id: session.id,
        token: session.token,
        expiresAt: session.expiresAt,
      },
      admin: {
        id: user.id,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.error("Admin login error:", error);
    return NextResponse.json(
      { error: "Login failed" },
      { status: 500 }
    );
  }
}