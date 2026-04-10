// app/api/admin/auth/verify/route.ts
import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";
import { validateAdminSession } from "@/lib/server/session-manager";
import { validateIP } from "@/lib/server/ip-validator";
import { headers } from "next/headers";

export async function GET() {
  try {
    const { userId } = await auth();
    const headersList = await headers();
    const ipAddress = headersList.get("x-forwarded-for") || "unknown";

    if (!userId) {
      return NextResponse.json(
        { authenticated: false, error: "No session" },
        { status: 401 }
      );
    }

    const user = await prisma.user.findUnique({
      where: { clerkUserId: userId },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        imageUrl: true,
      },
    });

    if (!user) {
      return NextResponse.json(
        { authenticated: false, error: "User not found" },
        { status: 404 }
      );
    }

    // Check admin role
    if (!["ADMIN", "SUPER_ADMIN"].includes(user.role || "")) {
      return NextResponse.json(
        { authenticated: false, error: "Not an admin" },
        { status: 403 }
      );
    }

    // Check IP whitelist
    const isIPAllowed = await validateIP(ipAddress);
    if (!isIPAllowed) {
      return NextResponse.json(
        { authenticated: false, error: "IP not whitelisted" },
        { status: 403 }
      );
    }

    // Validate admin session
    const hasValidSession = await validateAdminSession(user.id);
    if (!hasValidSession) {
      return NextResponse.json(
        { authenticated: false, error: "Invalid admin session" },
        { status: 401 }
      );
    }

    return NextResponse.json({
      authenticated: true,
      admin: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        imageUrl: user.imageUrl,
      },
    });
  } catch (error) {
    console.error("Admin verify error:", error);
    return NextResponse.json(
      { authenticated: false, error: "Verification failed" },
      { status: 500 }
    );
  }
}