// app/api/admin/auth/verify/route.ts

import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/server/admin-guard";
import { auth } from "@clerk/nextjs/server";

export async function GET() {
  try {
    // Debug: Check Clerk auth directly
    const { userId } = await auth();
    console.log("[Admin Verify] Clerk userId:", userId);
    
    if (!userId) {
      console.log("[Admin Verify] No userId - returning 401");
      return NextResponse.json(
        { isAdmin: false, error: "Not authenticated" },
        { status: 401 }
      );
    }
    
    // Get user from database
    const user = await getCurrentUser();
    console.log("[Admin Verify] DB user:", { 
      email: user?.email, 
      role: user?.role,
      found: !!user 
    });
    
    if (!user) {
      console.log("[Admin Verify] User not found in DB");
      return NextResponse.json(
        { isAdmin: false, error: "User not found in database" },
        { status: 404 }
      );
    }
    
    const isAdmin = user.role === "ADMIN" || user.role === "SUPER_ADMIN";
    console.log("[Admin Verify] isAdmin:", isAdmin, "role:", user.role);
    
    if (!isAdmin) {
      console.log("[Admin Verify] Not admin - returning 403");
      return NextResponse.json(
        { isAdmin: false, role: user.role, error: "Not an admin" },
        { status: 403 }
      );
    }
    
    console.log("[Admin Verify] ✅ Admin verified");
    return NextResponse.json({
      isAdmin: true,
      role: user.role,
      email: user.email,
      id: user.id,
    });
  } catch (error) {
    console.error("[Admin Verify] Error:", error);
    return NextResponse.json(
      { isAdmin: false, error: error instanceof Error ? error.message : "Verification failed" },
      { status: 500 }
    );
  }
}

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 204,
    headers: {
      Allow: "GET, OPTIONS",
      "Access-Control-Allow-Methods": "GET, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type, Authorization",
      "Access-Control-Max-Age": "86400",
    },
  });
}