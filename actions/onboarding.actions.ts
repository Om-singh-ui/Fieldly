"use server";

import { auth, currentUser } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import type { LandownerOnboardingInput } from "@/lib/validations/onboarding";

/* ============================================================
   TYPES
============================================================ */

export interface FarmerFormData {
  phone: string;
  district: string;
  state: string;
  bio?: string | null;
  primaryCrops: string[];
  farmingExperience: number;
  farmingType: "SUBSISTENCE" | "COMMERCIAL" | "ORGANIC" | "MIXED";
  requiredLandSize: number;
  leaseDuration: number;
  irrigationNeeded: boolean;
  equipmentAccess: boolean;
}

export interface OnboardingResult {
  success: boolean;
  redirectTo?: string;
  error?: string;
}

export interface UserStatusResult {
  authenticated: boolean;
  user?: {
    id: string;
    clerkId: string;
    name: string;
    email: string;
    phone?: string | null;
    state?: string | null;
    district?: string | null;
    bio?: string | null;
    role?: "FARMER" | "LANDOWNER" | null;
    isOnboarded: boolean;
    hasFarmerProfile: boolean;
    hasLandownerProfile: boolean;
  } | null;
  exists?: boolean;
  needsOnboarding?: boolean;
  status?: "needs_role" | "needs_profile" | "complete";
  error?: string;
  needsAuth?: boolean;
}

/* ============================================================
   HELPERS
============================================================ */

function sanitizeString(value?: string | null): string | null {
  if (!value) return null;
  return value.trim().slice(0, 500);
}

function toBoolean(value?: boolean | string | null): boolean {
  if (typeof value === "boolean") return value;
  if (typeof value === "string") return value === "true";
  return false;
}

function toNumber(value?: number | string | null): number {
  if (value === undefined || value === null) return 0;
  if (typeof value === "number") return value;
  const parsed = Number(value);
  return isNaN(parsed) ? 0 : parsed;
}

/* ============================================================
   SET USER ROLE
============================================================ */

export async function setUserRole(
  role: "FARMER" | "LANDOWNER"
): Promise<OnboardingResult> {
  try {
    const { userId } = await auth();

    if (!userId)
      return { success: false, error: "User not authenticated" };

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

    return {
      success: true,
      redirectTo: `/onboarding/${role.toLowerCase()}`,
    };
  } catch (error) {
    console.error("setUserRole error:", error);

    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : "Failed to set role",
    };
  }
}

/* ============================================================
   GET OR CREATE USER
============================================================ */

export async function getOrCreateUser() {
  const { userId } = await auth();

  if (!userId) throw new Error("Not authenticated");

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
   FARMER ONBOARDING (PRODUCTION SAFE)
============================================================ */

export async function completeFarmerOnboarding(
  formData: FarmerFormData
): Promise<OnboardingResult> {
  try {
    const { userId } = await auth();

    if (!userId)
      return { success: false, error: "Not authenticated" };

    const user = await prisma.user.findUnique({
      where: { clerkUserId: userId },
    });

    if (!user)
      return { success: false, error: "User not found" };

    if (user.role !== "FARMER")
      return { success: false, error: "Invalid role" };

    /* TRANSACTION ONLY CRITICAL WRITES */
    await prisma.$transaction(
      async (tx) => {
        await tx.user.update({
          where: { clerkUserId: userId },
          data: {
            phone: formData.phone,
            district: formData.district,
            state: formData.state,
            bio: sanitizeString(formData.bio),
            isOnboarded: true,
          },
        });

        await tx.farmerProfile.upsert({
          where: { userId: user.id },
          update: {
            primaryCrops: formData.primaryCrops,
            farmingExperience: toNumber(
              formData.farmingExperience
            ),
            farmingType: formData.farmingType,
            requiredLandSize: toNumber(
              formData.requiredLandSize
            ),
            leaseDuration: toNumber(
              formData.leaseDuration
            ),
            irrigationNeeded: toBoolean(
              formData.irrigationNeeded
            ),
            equipmentAccess: toBoolean(
              formData.equipmentAccess
            ),
          },
          create: {
            userId: user.id,
            primaryCrops: formData.primaryCrops,
            farmingExperience: toNumber(
              formData.farmingExperience
            ),
            farmingType: formData.farmingType,
            requiredLandSize: toNumber(
              formData.requiredLandSize
            ),
            leaseDuration: toNumber(
              formData.leaseDuration
            ),
            irrigationNeeded: toBoolean(
              formData.irrigationNeeded
            ),
            equipmentAccess: toBoolean(
              formData.equipmentAccess
            ),
          },
        });
      },
      {
        timeout: 10000,
      }
    );

    /* NON-CRITICAL OPERATIONS OUTSIDE TRANSACTION */

    await Promise.allSettled([
      prisma.notification.create({
        data: {
          userId: user.id,
          type: "SYSTEM",
          title: "Welcome to Fieldly! 🎉",
          message:
            "Your farmer profile is complete.",
        },
      }),

      prisma.auditLog.create({
        data: {
          userId: user.id,
          action: "FARMER_ONBOARDING_COMPLETED",
          metadata: {
            timestamp: new Date().toISOString(),
          },
        },
      }),
    ]);

    revalidatePath("/");

    return {
      success: true,
      redirectTo: "/farmer/dashboard",
    };
  } catch (error) {
    console.error("Farmer onboarding error:", error);

    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : "Onboarding failed",
    };
  }
}

/* ============================================================
   LANDOWNER ONBOARDING (FULLY FIXED)
============================================================ */

export async function completeLandownerOnboarding(
  formData: LandownerOnboardingInput
): Promise<OnboardingResult> {
  try {
    const { userId } = await auth();

    if (!userId)
      return { success: false, error: "Not authenticated" };

    const user = await prisma.user.findUnique({
      where: { clerkUserId: userId },
    });

    if (!user)
      return { success: false, error: "User not found" };

    if (user.role !== "LANDOWNER")
      return { success: false, error: "Invalid role" };

    /* TRANSACTION ONLY CRITICAL WRITES */

    await prisma.$transaction(
      async (tx) => {
        await tx.user.update({
          where: { clerkUserId: userId },
          data: {
            phone: formData.phone,
            district: formData.district,
            state: formData.state,
            bio: sanitizeString(formData.bio),
            isOnboarded: true,
          },
        });

        await tx.landownerProfile.upsert({
          where: { userId: user.id },
          update: {
            ownershipType: formData.ownershipType,
            preferredPaymentFrequency:
              formData.preferredPaymentFrequency,
            preferredContactMethod:
              formData.preferredContactMethod,
            verificationLevel: 1,
          },
          create: {
            userId: user.id,
            ownershipType: formData.ownershipType,
            preferredPaymentFrequency:
              formData.preferredPaymentFrequency,
            preferredContactMethod:
              formData.preferredContactMethod,
            verificationLevel: 1,
          },
        });
      },
      {
        timeout: 10000,
      }
    );

    /* SAFE NON-BLOCKING OPERATIONS */

    await Promise.allSettled([
      prisma.notification.create({
        data: {
          userId: user.id,
          type: "SYSTEM",
          title: "Welcome to Fieldly! 🎉",
          message:
            "Your landowner profile is complete.",
        },
      }),

      prisma.auditLog.create({
        data: {
          userId: user.id,
          action:
            "LANDOWNER_ONBOARDING_COMPLETED",
          metadata: {
            timestamp: new Date().toISOString(),
          },
        },
      }),
    ]);

    revalidatePath("/");

    return {
      success: true,
      redirectTo: "/landowner/dashboard",
    };
  } catch (error) {
    console.error(
      "Landowner onboarding error:",
      error
    );

    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : "Onboarding failed",
    };
  }
}

/* ============================================================
   CHECK USER STATUS
============================================================ */

export async function checkUserStatus(): Promise<UserStatusResult> {
  try {
    const { userId } = await auth();

    if (!userId)
      return {
        authenticated: false,
        needsAuth: true,
      };

    const user = await prisma.user.findUnique({
      where: { clerkUserId: userId },
      include: {
        farmerProfile: true,
        landownerProfile: true,
      },
    });

    if (!user)
      return {
        authenticated: true,
        exists: false,
        needsOnboarding: true,
        status: "needs_role",
      };

    return {
      authenticated: true,
      exists: true,
      needsOnboarding:
        !user.role || !user.isOnboarded,
      status:
        user.role && user.isOnboarded
          ? "complete"
          : user.role
          ? "needs_profile"
          : "needs_role",
      user: {
        id: user.id,
        clerkId: user.clerkUserId,
        name: user.name,
        email: user.email,
        phone: user.phone,
        state: user.state,
        district: user.district,
        bio: user.bio,
        role:
          user.role === "ADMIN"
            ? null
            : user.role,
        isOnboarded: user.isOnboarded,
        hasFarmerProfile:
          !!user.farmerProfile,
        hasLandownerProfile:
          !!user.landownerProfile,
      },
    };
  } catch (error) {
    console.error(error);

    return {
      authenticated: false,
      error: "Internal error",
    };
  }
}

