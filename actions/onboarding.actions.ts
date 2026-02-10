"use server";

import { auth, currentUser } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

/* ============================================================
   TYPES
============================================================ */

interface FarmerFormData {
  email?: string;
  name?: string;
  phone?: string;
  district?: string;
  state?: string;
  bio?: string;

  primaryCrops?: string[];
  farmingExperience?: string;
  farmingType?: "SUBSISTENCE" | "COMMERCIAL" | "ORGANIC" | "MIXED";

  requiredLandSize?: string;
  leaseDuration?: string;

  irrigationNeeded?: boolean;
  equipmentAccess?: boolean;
}

interface LandownerFormData {
  email?: string;
  name?: string;
  phone?: string;
  district?: string;
  state?: string;
  bio?: string;

  landTitle?: string;
  landSize?: string;
  landType?: "AGRICULTURAL" | "FALLOW" | "ORCHARD" | "PASTURE";
  soilType?: string;

  irrigationAvailable?: boolean;

  minLeaseDuration?: string;
  maxLeaseDuration?: string;

  expectedRentMin?: string;
  expectedRentMax?: string;

  allowedCropTypes?: string[];
}

/* ============================================================
   HELPERS
============================================================ */

function toNumber(value?: string) {
  if (!value) return 0;
  const parsed = Number(value);
  return Number.isNaN(parsed) ? 0 : parsed;
}

/* ============================================================
   SET USER ROLE
============================================================ */

export async function setUserRole(role: "FARMER" | "LANDOWNER") {
  const { userId } = await auth();

  if (!userId) throw new Error("User not authenticated");

  const clerkUser = await currentUser();

  await prisma.user.upsert({
    where: { clerkUserId: userId },

    update: { role },

    create: {
      clerkUserId: userId,
      email:
        clerkUser?.emailAddresses[0]?.emailAddress ??
        `${userId}@temp.com`,

      name:
        `${clerkUser?.firstName ?? ""} ${
          clerkUser?.lastName ?? ""
        }`.trim() || "User",

      role,
      isOnboarded: false,
    },
  });

  revalidatePath("/");
  return { success: true };
}

/* ============================================================
   GET OR CREATE USER
============================================================ */

export async function getOrCreateUser() {
  const { userId } = await auth();

  if (!userId) throw new Error("User not authenticated");

  const clerkUser = await currentUser();

  return prisma.user.upsert({
    where: { clerkUserId: userId },

    update: {},

    create: {
      clerkUserId: userId,
      email:
        clerkUser?.emailAddresses[0]?.emailAddress ??
        `${userId}@temp.com`,

      name:
        `${clerkUser?.firstName ?? ""} ${
          clerkUser?.lastName ?? ""
        }`.trim() || "User",

      role: null,
      isOnboarded: false,
    },
  });
}

/* ============================================================
   FARMER ONBOARDING
============================================================ */

export async function completeFarmerOnboarding(
  formData: FarmerFormData
) {
  const { userId } = await auth();

  if (!userId) throw new Error("User not authenticated");

  const user = await prisma.user.findUnique({
    where: { clerkUserId: userId },
  });

  if (!user) throw new Error("User not found");

  if (user.role !== "FARMER") {
    throw new Error("User role is not FARMER");
  }

  /* ---------- Update User ---------- */

  await prisma.user.update({
    where: { clerkUserId: userId },

    data: {
      email: formData.email ?? user.email,
      name: formData.name ?? user.name,
      phone: formData.phone ?? user.phone,
      district: formData.district ?? user.district,
      state: formData.state ?? user.state,
      bio: formData.bio ?? user.bio ?? null,

      isOnboarded: true, // 🔥 critical
    },
  });

  /* ---------- Farmer Profile ---------- */

  await prisma.farmerProfile.upsert({
    where: { userId: user.id },

    update: {
      primaryCrops: formData.primaryCrops ?? [],
      farmingExperience: toNumber(formData.farmingExperience),
      farmingType: formData.farmingType ?? "SUBSISTENCE",
      requiredLandSize: toNumber(formData.requiredLandSize),
      leaseDuration: toNumber(formData.leaseDuration),
      irrigationNeeded: !!formData.irrigationNeeded,
      equipmentAccess: !!formData.equipmentAccess,
    },

    create: {
      userId: user.id,
      primaryCrops: formData.primaryCrops ?? [],
      farmingExperience: toNumber(formData.farmingExperience),
      farmingType: formData.farmingType ?? "SUBSISTENCE",
      requiredLandSize: toNumber(formData.requiredLandSize),
      leaseDuration: toNumber(formData.leaseDuration),
      irrigationNeeded: !!formData.irrigationNeeded,
      equipmentAccess: !!formData.equipmentAccess,
    },
  });

  revalidatePath("/");
  return { success: true };
}

/* ============================================================
   LANDOWNER ONBOARDING
============================================================ */

export async function completeLandownerOnboarding(
  formData: LandownerFormData
) {
  const { userId } = await auth();

  if (!userId) throw new Error("User not authenticated");

  const user = await prisma.user.findUnique({
    where: { clerkUserId: userId },
  });

  if (!user) throw new Error("User not found");

  if (user.role !== "LANDOWNER") {
    throw new Error("User role is not LANDOWNER");
  }

  /* ---------- Update User ---------- */

  await prisma.user.update({
    where: { clerkUserId: userId },

    data: {
      email: formData.email ?? user.email,
      name: formData.name ?? user.name,
      phone: formData.phone ?? user.phone,
      district: formData.district ?? user.district,
      state: formData.state ?? user.state,
      bio: formData.bio ?? user.bio ?? null,

      isOnboarded: true, // 🔥 critical
    },
  });

  /* ---------- Landowner Profile ---------- */

  const landownerProfile = await prisma.landownerProfile.upsert({
    where: { userId: user.id },
    update: {},
    create: { userId: user.id },
  });

  /* ---------- Optional Land Entry ---------- */

  if (formData.landTitle && formData.landSize) {
    await prisma.land.create({
      data: {
        landownerId: landownerProfile.id,
        title: formData.landTitle,
        size: toNumber(formData.landSize),
        landType: formData.landType ?? "AGRICULTURAL",
        soilType: formData.soilType ?? "",
        irrigationAvailable: !!formData.irrigationAvailable,
        minLeaseDuration: toNumber(formData.minLeaseDuration),
        maxLeaseDuration: toNumber(formData.maxLeaseDuration),
        expectedRentMin: formData.expectedRentMin
          ? toNumber(formData.expectedRentMin)
          : null,
        expectedRentMax: formData.expectedRentMax
          ? toNumber(formData.expectedRentMax)
          : null,
        allowedCropTypes: formData.allowedCropTypes ?? [],
      },
    });
  }

  revalidatePath("/");
  return { success: true };
}
