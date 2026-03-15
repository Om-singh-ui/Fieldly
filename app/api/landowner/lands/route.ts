import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";
import { supabaseAdmin } from "@/lib/storage/supabase-server";
import { v4 as uuid } from "uuid";
import {
  LandType,
  ListingType,
  PaymentFrequency,
  ListingStatus,
} from "@prisma/client";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    const { userId: clerkId } = await auth();
    if (!clerkId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const formData = await req.formData();

    const user = await prisma.user.findUnique({
      where: { clerkUserId: clerkId },
      include: { landownerProfile: true },
    });

    if (!user || !user.landownerProfile) {
      return NextResponse.json(
        { error: "Complete landowner profile first" },
        { status: 400 },
      );
    }

    // ---------- SAFE PARSERS ----------
    type FDValue = FormDataEntryValue | null;

    const num = (v: FDValue): number | null => {
      if (!v || typeof v !== "string") return null;
      const n = Number(v);
      return isNaN(n) ? null : n;
    };

    const bool = (v: FDValue): boolean => {
      return v === "true";
    };

    const allowedCropTypes = JSON.parse(
      (formData.get("allowedCropTypes") as string) || "[]",
    );

    const previousCrops = JSON.parse(
      (formData.get("previousCrops") as string) || "[]",
    );

    // ---------- LAND ----------
    const land = await prisma.land.create({
      data: {
        landownerId: user.landownerProfile.id,
        title: formData.get("title") as string,
        size: Number(formData.get("size")),
        landType: formData.get("landType") as LandType,
        village: formData.get("village") as string,
        soilType: (formData.get("soilType") as string) || null,
        latitude: num(formData.get("latitude")),
        longitude: num(formData.get("longitude")),
        irrigationAvailable: bool(formData.get("irrigationAvailable")),
        electricityAvailable: bool(formData.get("electricityAvailable")),
        roadAccess: bool(formData.get("roadAccess")),
        fencingAvailable: bool(formData.get("fencingAvailable")),
        storageAvailable: bool(formData.get("storageAvailable")),
        allowedCropTypes,
        previousCrops,
        allowsInfrastructureModification: bool(
          formData.get("allowsInfrastructureModification"),
        ),
        allowsOrganicFarming: formData.get("allowsOrganicFarming") !== "false",
        allowsSubleasing: bool(formData.get("allowsSubleasing")),
        minLeaseDuration: Number(formData.get("minLeaseDuration") || 12),
        maxLeaseDuration: Number(formData.get("maxLeaseDuration") || 60),
        expectedRentMin: num(formData.get("expectedRentMin")),
        expectedRentMax: num(formData.get("expectedRentMax")),
        depositAmount: num(formData.get("depositAmount")),
      },
    });

    // ---------- LISTING ----------
    const listing = await prisma.landListing.create({
      data: {
        landId: land.id,
        ownerId: user.id,
        title: land.title,
        description: (formData.get("description") as string) || null,
        listingType:
          (formData.get("listingType") as ListingType) || "OPEN_BIDDING",
        basePrice: Number(formData.get("basePrice")),
        reservePrice: num(formData.get("reservePrice")),
        buyNowPrice: num(formData.get("buyNowPrice")),
        startDate: new Date(formData.get("listingStartDate") as string),
        endDate: new Date(formData.get("listingEndDate") as string),
        minimumLeaseDuration: land.minLeaseDuration,
        maximumLeaseDuration: land.maxLeaseDuration,
        status: "ACTIVE" as ListingStatus,
      },
    });

    // ---------- TERMS ----------
    await prisma.listingTerms.create({
      data: {
        listingId: listing.id,
        paymentFrequency:
          (formData.get("paymentFrequency") as PaymentFrequency) || "MONTHLY",
        securityDepositRequired:
          formData.get("securityDepositRequired") === "true",
        depositAmount: num(formData.get("depositAmount")),
        additionalTerms: (formData.get("additionalTerms") as string) || null,
      },
    });

    // ---------- IMAGE UPLOAD (PARALLEL CDN) ----------
    const files = formData.getAll("images") as File[];

    if (files.length) {
      const uploads = files.map(async (file, i) => {
        const ext = file.name.split(".").pop();
        const key = `${listing.id}/${uuid()}.${ext}`;

        const { error } = await supabaseAdmin.storage
          .from("lands")
          .upload(key, file);

        if (error) throw error;

        const { data } = supabaseAdmin.storage.from("lands").getPublicUrl(key);

        return prisma.listingImage.create({
          data: {
            listingId: listing.id,
            url: data.publicUrl,
            isPrimary: i === 0,
            sortOrder: i,
          },
        });
      });

      await Promise.all(uploads);
    }

    // ---------- AUDIT ----------
    await prisma.auditLog.create({
      data: {
        userId: user.id,
        action: "LAND_CREATED",
        metadata: {
          landId: land.id,
          listingId: listing.id,
        },
      },
    });

    return NextResponse.json({
      success: true,
      landId: land.id,
      listingId: listing.id,
    });
  } catch (err) {
    console.error("LAND CREATE ERROR:", err);
    return NextResponse.json(
      { error: "Failed to create listing" },
      { status: 500 },
    );
  }
}
