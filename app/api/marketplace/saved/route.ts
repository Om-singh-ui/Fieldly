// app/api/marketplace/saved/route.ts
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/server/admin-guard";

// Type for Prisma error with code
interface PrismaError {
  code?: string;
  message?: string;
}

// GET /api/marketplace/saved - Get all saved listings for current user
export async function GET() {
  try {
    const user = await getCurrentUser();
    
    if (!user) {
      return NextResponse.json(
        { error: "Unauthorized. Please sign in." },
        { status: 401 }
      );
    }

    const savedListings = await prisma.savedListing.findMany({
      where: { userId: user.id },
      include: {
        listing: {
          include: {
            land: {
              select: {
                size: true,
                landType: true,
                village: true,
                district: true,
                state: true,
              },
            },
            images: {
              where: { isPrimary: true },
              take: 1,
            },
            _count: {
              select: {
                bids: true,
              },
            },
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json({
      saved: savedListings,
      count: savedListings.length,
    });
  } catch (error) {
    console.error("[Saved API] GET error:", error);
    return NextResponse.json(
      { error: "Failed to fetch saved listings" },
      { status: 500 }
    );
  }
}

// POST /api/marketplace/saved - Save a listing
export async function POST(req: NextRequest) {
  try {
    const user = await getCurrentUser();
    
    if (!user) {
      return NextResponse.json(
        { error: "Unauthorized. Please sign in." },
        { status: 401 }
      );
    }

    const body = await req.json();
    const { listingId } = body;

    if (!listingId) {
      return NextResponse.json(
        { error: "Listing ID is required" },
        { status: 400 }
      );
    }

    // Check if listing exists
    const listing = await prisma.landListing.findUnique({
      where: { id: listingId },
      select: { id: true },
    });

    if (!listing) {
      return NextResponse.json(
        { error: "Listing not found" },
        { status: 404 }
      );
    }

    // Try to create saved listing
    try {
      const saved = await prisma.savedListing.create({
        data: {
          listingId,
          userId: user.id,
        },
      });

      return NextResponse.json({
        success: true,
        saved,
        message: "Listing saved successfully",
      });
    } catch (error) {
      const prismaError = error as PrismaError;
      // P2002 is Prisma's "unique constraint violation" error
      if (prismaError.code === "P2002") {
        // Already saved - this is fine, return success
        return NextResponse.json({
          success: true,
          message: "Listing already saved",
        });
      }
      throw error;
    }
  } catch (error) {
    console.error("[Saved API] POST error:", error);
    return NextResponse.json(
      { error: "Failed to save listing" },
      { status: 500 }
    );
  }
}

// DELETE /api/marketplace/saved - Remove a saved listing
export async function DELETE(req: NextRequest) {
  try {
    const user = await getCurrentUser();
    
    if (!user) {
      return NextResponse.json(
        { error: "Unauthorized. Please sign in." },
        { status: 401 }
      );
    }

    const body = await req.json();
    const { listingId } = body;

    if (!listingId) {
      return NextResponse.json(
        { error: "Listing ID is required" },
        { status: 400 }
      );
    }

    try {
      await prisma.savedListing.delete({
        where: {
          listingId_userId: {
            listingId,
            userId: user.id,
          },
        },
      });

      return NextResponse.json({
        success: true,
        message: "Listing removed from saved",
      });
    } catch (error) {
      const prismaError = error as PrismaError;
      // P2025 is Prisma's "record not found" error
      if (prismaError.code === "P2025") {
        return NextResponse.json({
          success: true,
          message: "Listing was not saved",
        });
      }
      throw error;
    }
  } catch (error) {
    console.error("[Saved API] DELETE error:", error);
    return NextResponse.json(
      { error: "Failed to remove saved listing" },
      { status: 500 }
    );
  }
}

