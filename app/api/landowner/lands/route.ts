// app/api/landowner/lands/route.ts
import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";
import { writeFile, mkdir } from "fs/promises";
import path from "path";
import { LandType, ListingType, PaymentFrequency, ListingStatus } from "@prisma/client";

export async function POST(req: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const formData = await req.formData();
    
    // Log received form data for debugging
    console.log("Received form data:");
    for (const [key, value] of formData.entries()) {
      console.log(`${key}:`, value);
    }

    const user = await prisma.user.findUnique({
      where: { clerkUserId: userId },
      include: { landownerProfile: true }
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    if (!user.landownerProfile) {
      return NextResponse.json({ error: "Please complete your landowner profile first" }, { status: 400 });
    }

    // Parse and validate land data - REMOVED district and state
    let allowedCropTypes = [];
    try {
      const crops = formData.get("allowedCropTypes");
      allowedCropTypes = crops ? JSON.parse(crops as string) : [];
    } catch (e) {
      console.error("Error parsing allowedCropTypes:", e);
    }

    // Get district and state from user profile if needed
    const district = formData.get("district") as string || user.district || "";
    const state = formData.get("state") as string || user.state || "";

    const landData = {
      landownerId: user.landownerProfile.id,
      title: formData.get("title") as string,
      size: parseFloat(formData.get("size") as string),
      landType: formData.get("landType") as LandType,
      soilType: formData.get("soilType") as string || null,
      village: formData.get("village") as string,
      // Note: district and state are NOT in Land model
      // They will be stored in the User model instead
      latitude: formData.get("latitude") ? parseFloat(formData.get("latitude") as string) : null,
      longitude: formData.get("longitude") ? parseFloat(formData.get("longitude") as string) : null,
      irrigationAvailable: formData.get("irrigationAvailable") === "true",
      electricityAvailable: formData.get("electricityAvailable") === "true",
      roadAccess: formData.get("roadAccess") === "true",
      fencingAvailable: formData.get("fencingAvailable") === "true",
      storageAvailable: formData.get("storageAvailable") === "true",
      allowedCropTypes: allowedCropTypes,
      allowsInfrastructureModification: formData.get("allowsInfrastructureModification") === "true",
      allowsOrganicFarming: formData.get("allowsOrganicFarming") !== "false",
      allowsSubleasing: formData.get("allowsSubleasing") === "true",
      minLeaseDuration: parseInt(formData.get("minLeaseDuration") as string) || 12,
      maxLeaseDuration: parseInt(formData.get("maxLeaseDuration") as string) || 60,
      expectedRentMin: formData.get("expectedRentMin") ? parseFloat(formData.get("expectedRentMin") as string) : null,
      expectedRentMax: formData.get("expectedRentMax") ? parseFloat(formData.get("expectedRentMax") as string) : null,
      depositAmount: formData.get("depositAmount") ? parseFloat(formData.get("depositAmount") as string) : null,
    };

    // Log the parsed data
    console.log("Parsed landData:", landData);

    // Validate required fields
    if (!landData.title) {
      return NextResponse.json({ error: "Title is required" }, { status: 400 });
    }
    if (!landData.size || landData.size <= 0) {
      return NextResponse.json({ error: "Valid size is required" }, { status: 400 });
    }
    if (!landData.village) {
      return NextResponse.json({ error: "Village is required" }, { status: 400 });
    }

    const basePrice = parseFloat(formData.get("basePrice") as string);
    if (isNaN(basePrice) || basePrice <= 0) {
      return NextResponse.json({ error: "Base price must be a positive number" }, { status: 400 });
    }

    const listingData = {
      ownerId: user.id,
      listingType: formData.get("listingType") as ListingType || "OPEN_BIDDING",
      basePrice,
      reservePrice: formData.get("reservePrice") ? parseFloat(formData.get("reservePrice") as string) : null,
      buyNowPrice: formData.get("buyNowPrice") ? parseFloat(formData.get("buyNowPrice") as string) : null,
      startDate: new Date(formData.get("listingStartDate") as string || Date.now()),
      endDate: new Date(formData.get("listingEndDate") as string || Date.now() + 30 * 24 * 60 * 60 * 1000),
      status: "DRAFT" as ListingStatus,
      minimumLeaseDuration: landData.minLeaseDuration,
      maximumLeaseDuration: landData.maxLeaseDuration,
      title: landData.title,
      description: formData.get("description") as string || null,
    };

    const termsData = {
      paymentFrequency: formData.get("paymentFrequency") as PaymentFrequency || "MONTHLY",
      securityDepositRequired: formData.get("securityDepositRequired") === "true",
      depositAmount: formData.get("depositAmount") ? parseFloat(formData.get("depositAmount") as string) : null,
      additionalTerms: formData.get("additionalTerms") as string || null,
    };

    // Create land and listing in transaction
    const result = await prisma.$transaction(async (tx) => {
      // Create land
      const land = await tx.land.create({
        data: landData,
      });

      // Create listing
      const listing = await tx.landListing.create({
        data: {
          landId: land.id,
          ownerId: listingData.ownerId,
          listingType: listingData.listingType,
          basePrice: listingData.basePrice,
          reservePrice: listingData.reservePrice,
          buyNowPrice: listingData.buyNowPrice,
          startDate: listingData.startDate,
          endDate: listingData.endDate,
          status: listingData.status,
          minimumLeaseDuration: listingData.minimumLeaseDuration,
          maximumLeaseDuration: listingData.maximumLeaseDuration,
          title: listingData.title,
          description: listingData.description,
        },
      });

      // Create listing terms
      await tx.listingTerms.create({
        data: {
          listingId: listing.id,
          paymentFrequency: termsData.paymentFrequency,
          securityDepositRequired: termsData.securityDepositRequired,
          depositAmount: termsData.depositAmount,
          additionalTerms: termsData.additionalTerms,
        },
      });

      return { land, listing };
    });

    // Handle image uploads
    const imageFiles = formData.getAll("images") as File[];
    if (imageFiles.length > 0) {
      try {
        const uploadDir = path.join(process.cwd(), "public/uploads/lands", result.land.id);
        await mkdir(uploadDir, { recursive: true });

        const uploadPromises = imageFiles.map(async (file, index) => {
          try {
            const bytes = await file.arrayBuffer();
            const buffer = Buffer.from(bytes);
            
            const originalName = file.name.replace(/[^a-zA-Z0-9.]/g, '_');
            const fileName = `${Date.now()}-${index}-${originalName}`;
            const filePath = path.join(uploadDir, fileName);
            
            await writeFile(filePath, buffer);
            
            return await prisma.listingImage.create({
              data: {
                listingId: result.listing.id,
                url: `/uploads/lands/${result.land.id}/${fileName}`,
                isPrimary: index === 0,
              },
            });
          } catch (error) {
            console.error(`Failed to upload image ${index}:`, error);
            return null;
          }
        });

        await Promise.all(uploadPromises);
      } catch (error) {
        console.error("Error in image upload process:", error);
      }
    }

    // Update user's district and state if provided
    if (district || state) {
      await prisma.user.update({
        where: { id: user.id },
        data: {
          ...(district && { district }),
          ...(state && { state }),
        },
      });
    }

    // Create audit log
    await prisma.auditLog.create({
      data: {
        userId: user.id,
        action: "LAND_CREATED",
        metadata: {
          landId: result.land.id,
          listingId: result.listing.id,
          title: result.land.title,
        },
      },
    });

    return NextResponse.json({
      success: true,
      message: "Land listing created successfully",
      data: {
        landId: result.land.id,
        listingId: result.listing.id,
      },
    });

  } catch (error) {
    // Log the full error details
    console.error("Detailed error in land listing creation:");
    console.error(error);
    
    if (error instanceof Error) {
      console.error("Error name:", error.name);
      console.error("Error message:", error.message);
      console.error("Error stack:", error.stack);
      
      // Check for specific Prisma errors
      if (error.message.includes("Foreign key constraint")) {
        return NextResponse.json(
          { error: "Invalid reference data - please check your profile setup" },
          { status: 400 }
        );
      }
      
      if (error.message.includes("Unique constraint")) {
        return NextResponse.json(
          { error: "A listing with this data already exists" },
          { status: 409 }
        );
      }

      if (error.message.includes("Argument")) {
        return NextResponse.json(
          { error: `Invalid data format: ${error.message}` },
          { status: 400 }
        );
      }
    }

    return NextResponse.json(
      { error: "Failed to create land listing. Please check server logs." },
      { status: 500 }
    );
  }
}