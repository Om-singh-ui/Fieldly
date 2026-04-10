// app/api/user/by-clerk/[clerkId]/route.ts
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// Type-safe JSON response helper
const json = <T>(data: T, init?: ResponseInit): NextResponse<T> => {
  return NextResponse.json(data, init) as NextResponse<T>;
};

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ clerkId: string }> }
): Promise<NextResponse> {
  try {
    const { clerkId } = await params;
    
    const user = await prisma.user.findUnique({
      where: { clerkUserId: clerkId },
      select: { 
        id: true, 
        email: true, 
        name: true, 
        role: true,
        isOnboarded: true,
        farmerProfile: {
          select: { id: true }
        }
      }
    });

    if (!user) {
      return json({ error: "User not found" }, { status: 404 });
    }

    return json({ user });
  } catch (error) {
    console.error("Error fetching user by Clerk ID:", error);
    return json({ error: "Failed to fetch user" }, { status: 500 });
  }
}