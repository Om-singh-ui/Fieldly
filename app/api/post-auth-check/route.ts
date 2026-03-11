import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({
        exists: false,
        user: null,
        needsAuth: true,
      });
    }

    const user = await prisma.user.findUnique({
      where: { clerkUserId: userId },
      select: {
        role: true,
        isOnboarded: true,
      },
    });

    if (!user) {
      return NextResponse.json({
        exists: false,
        user: null,
        needsOnboarding: true,
      });
    }

    return NextResponse.json({
      exists: true,
      user,
    });
  } catch (e) {
    console.error("post-auth-check error:", e);

    return NextResponse.json(
      { exists: false, error: "internal error" },
      { status: 500 }
    );
  }
}