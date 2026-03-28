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
   GET OR CREATE USER (PRODUCTION-GRADE)
============================================================ */

/**
 * Gets or creates a user in the database
 * This is the ONLY function that should be used to get the current user
 * It ensures the user exists in the database and returns the DB user object
 * 
 * @throws {Error} If not authenticated
 * @returns {Promise<Object>} The database user object
 */
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
   SET USER ROLE
============================================================ */

export async function setUserRole(
  role: "FARMER" | "LANDOWNER"
): Promise<OnboardingResult> {
  try {
    // Use getOrCreateUser to ensure user exists and get DB user
    const user = await getOrCreateUser();

    // Update the user's role using DB id
    await prisma.user.update({
      where: { id: user.id },
      data: { role },
    });

    // Revalidate only auth flow page
    revalidatePath("/post-auth");

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
   FARMER ONBOARDING
============================================================ */

export async function completeFarmerOnboarding(
  formData: FarmerFormData
): Promise<OnboardingResult> {
  try {
    // Use getOrCreateUser to ensure user exists and get DB user
    const user = await getOrCreateUser();

    // Check role using DB user object
    if (user.role !== "FARMER") {
      return { success: false, error: "Invalid role" };
    }

    await prisma.$transaction(async (tx) => {
      // Update user using DB id
      await tx.user.update({
        where: { id: user.id },
        data: {
          phone: formData.phone,
          district: formData.district,
          state: formData.state,
          bio: sanitizeString(formData.bio),
          isOnboarded: true,
        },
      });

      // Create farmer profile using DB user.id
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
    });

    // Create notifications using DB user.id
    await Promise.allSettled([
      prisma.notification.create({
        data: {
          userId: user.id,
          type: "SYSTEM",
          title: "Welcome to Fieldly! 🎉",
          message: "Your farmer profile is complete.",
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

    revalidatePath("/farmer/dashboard");

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
   LANDOWNER ONBOARDING
============================================================ */

export async function completeLandownerOnboarding(
  formData: LandownerOnboardingInput
): Promise<OnboardingResult> {
  try {
    // Use getOrCreateUser to ensure user exists and get DB user
    const user = await getOrCreateUser();

    // Check role using DB user object
    if (user.role !== "LANDOWNER") {
      return { success: false, error: "Invalid role" };
    }

    await prisma.$transaction(async (tx) => {
      // Update user using DB id
      await tx.user.update({
        where: { id: user.id },
        data: {
          phone: formData.phone,
          district: formData.district,
          state: formData.state,
          bio: sanitizeString(formData.bio),
          isOnboarded: true,
        },
      });

      // Create landowner profile using DB user.id
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
    });

    //Create notifications using DB user.id
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

    revalidatePath("/landowner/dashboard");

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
   HELPER FUNCTIONS FOR API ROUTES
============================================================ */

/**
 * Gets the current user with their role
 * Useful for API routes that need user data
 * Returns null if not authenticated
 */
export async function getCurrentUser() {
  try {
    const user = await getOrCreateUser();
    return user;
  } catch {
    return null;
  }
}

/**
 * Gets the current user and verifies they have a specific role
 * @throws {Error} If not authenticated or role mismatch
 */
export async function getCurrentUserWithRole(role: "FARMER" | "LANDOWNER") {
  const user = await getOrCreateUser();
  
  if (user.role !== role) {
    throw new Error(`User must be a ${role.toLowerCase()}`);
  }
  
  return user;
}

/**
 * Checks if the current user is onboarded
 */
export async function isUserOnboarded() {
  try {
    const user = await getOrCreateUser();
    return user.isOnboarded;
  } catch {
    return false;
  }
}

/**
 * Gets the current user's role
 */
export async function getUserRole() {
  try {
    const user = await getOrCreateUser();
    return user.role;
  } catch {
    return null;
  }
}