import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

// ensure fresh execution every time (no caching issues)
export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET() {
  try {
    const { userId } = await auth();

    // User not signed in
    if (!userId) {
      return NextResponse.json({
        exists: false,
        user: null,
        needsAuth: true,
      });
    }

    // Check if user exists in DB
    const user = await prisma.user.findUnique({
      where: { clerkUserId: userId },
      select: {
        role: true,
        isOnboarded: true,
      },
    });

    // New user → needs onboarding
    if (!user) {
      return NextResponse.json({
        exists: false,
        user: null,
        needsOnboarding: true,
      });
    }

    // Existing user
    return NextResponse.json({
      exists: true,
      user,
    });
  } catch (error) {
    console.error("post-auth-check error:", error);

    return NextResponse.json(
      {
        exists: false,
        user: null,
        error: "internal_error",
      },
      { status: 500 }
    );
  }
}