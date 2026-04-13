    // app/api/listings/[id]/route.ts
    import { NextRequest, NextResponse } from "next/server";
    import { prisma } from "@/lib/prisma";

    interface RouteContext {
    params: Promise<{ id: string }>;
    }

    export async function GET(
    req: NextRequest,
    context: RouteContext
    ) {
    try {
        const params = await context.params;
        const { id } = params;

        if (!id) {
        return NextResponse.json(
            { error: "Listing ID required" },
            { status: 400 }
        );
        }

        const listing = await prisma.landListing.findUnique({
        where: { 
            id,
            status: "ACTIVE", // Only show active listings publicly
        },
        include: {
            land: {
            select: {
                id: true,
                size: true,
                landType: true,
                soilType: true,
                village: true,
                district: true,
                state: true,
                irrigationAvailable: true,
                electricityAvailable: true,
                roadAccess: true,
                fencingAvailable: true,
                storageAvailable: true,
                allowedCropTypes: true,
                waterSource: true,
                latitude: true,
                longitude: true,
                address: true,
                pincode: true,
            },
            },
            owner: {
            select: {
                id: true,
                name: true,
                imageUrl: true,
                createdAt: true,
            },
            },
            bids: {
            where: { status: "ACTIVE" },
            orderBy: { amount: "desc" },
            take: 5,
            select: {
                id: true,
                amount: true,
                createdAt: true,
                farmer: {
                select: { id: true, name: true },
                },
            },
            },
            images: {
            orderBy: { sortOrder: "asc" },
            },
            terms: true,
            _count: {
            select: {
                bids: true,
                applications: true,
                savedBy: true,
            },
            },
        },
        });

        if (!listing) {
        return NextResponse.json(
            { error: "Listing not found" },
            { status: 404 }
        );
        }

        // Increment view count
        await prisma.landListing.update({
        where: { id },
        data: { viewCount: { increment: 1 } },
        });

        return NextResponse.json(listing);
    } catch (error) {
        console.error("Public listing detail fetch error:", error);
        return NextResponse.json(
        { error: "Failed to fetch listing" },
        { status: 500 }
        );
    }
    }