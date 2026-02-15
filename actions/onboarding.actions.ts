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
    role?: "FARMER" | "LANDOWNER" | null; // Only FARMER or LANDOWNER, ADMIN excluded
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

export async function setUserRole(role: "FARMER" | "LANDOWNER"): Promise<OnboardingResult> {
  try {
    const { userId } = await auth();

    if (!userId) {
      return { success: false, error: "User not authenticated" };
    }

    const clerkUser = await currentUser();

    await prisma.user.upsert({
      where: { clerkUserId: userId },
      update: { role },
      create: {
        clerkUserId: userId,
        email: clerkUser?.emailAddresses[0]?.emailAddress ?? `${userId}@temp.com`,
        name: `${clerkUser?.firstName ?? ""} ${clerkUser?.lastName ?? ""}`.trim() || "User",
        role,
        isOnboarded: false,
      },
    });

    revalidatePath("/");
    return { success: true, redirectTo: `/onboarding/${role.toLowerCase()}` };
  } catch (error) {
    console.error("Set user role error:", error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : "Failed to set user role" 
    };
  }
}

/* ============================================================
   GET OR CREATE USER
============================================================ */

export async function getOrCreateUser() {
  try {
    const { userId } = await auth();

    if (!userId) throw new Error("User not authenticated");

    const clerkUser = await currentUser();

    return await prisma.user.upsert({
      where: { clerkUserId: userId },
      update: {},
      create: {
        clerkUserId: userId,
        email: clerkUser?.emailAddresses[0]?.emailAddress ?? `${userId}@temp.com`,
        name: `${clerkUser?.firstName ?? ""} ${clerkUser?.lastName ?? ""}`.trim() || "User",
        role: null,
        isOnboarded: false,
      },
    });
  } catch (error) {
    console.error("Get or create user error:", error);
    throw new Error("Failed to initialize user");
  }
}

/* ============================================================
   FARMER ONBOARDING
============================================================ */

export async function completeFarmerOnboarding(
  formData: FarmerFormData
): Promise<OnboardingResult> {
  try {
    const { userId } = await auth();

    if (!userId) {
      return { success: false, error: "User not authenticated" };
    }

    const user = await prisma.user.findUnique({
      where: { clerkUserId: userId },
    });

    if (!user) {
      return { success: false, error: "User not found" };
    }
    
    if (user.role !== "FARMER") {
      return { success: false, error: "User role is not FARMER" };
    }

    // Start transaction
    await prisma.$transaction(async (tx) => {
      // Update User
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

      // Create/Update Farmer Profile
      await tx.farmerProfile.upsert({
        where: { userId: user.id },
        update: {
          primaryCrops: formData.primaryCrops ?? [],
          farmingExperience: toNumber(formData.farmingExperience),
          farmingType: formData.farmingType ?? "SUBSISTENCE",
          requiredLandSize: toNumber(formData.requiredLandSize),
          leaseDuration: toNumber(formData.leaseDuration),
          irrigationNeeded: toBoolean(formData.irrigationNeeded),
          equipmentAccess: toBoolean(formData.equipmentAccess),
        },
        create: {
          userId: user.id,
          primaryCrops: formData.primaryCrops ?? [],
          farmingExperience: toNumber(formData.farmingExperience),
          farmingType: formData.farmingType ?? "SUBSISTENCE",
          requiredLandSize: toNumber(formData.requiredLandSize),
          leaseDuration: toNumber(formData.leaseDuration),
          irrigationNeeded: toBoolean(formData.irrigationNeeded),
          equipmentAccess: toBoolean(formData.equipmentAccess),
        },
      });

      // Create welcome notification
      await tx.notification.create({
        data: {
          userId: user.id,
          type: "SYSTEM",
          title: "Welcome to Fieldly! 🎉",
          message: "Your farmer profile is complete. Start exploring available lands now!",
        },
      });

      // Audit log
      await tx.auditLog.create({
        data: {
          userId: user.id,
          action: "FARMER_ONBOARDING_COMPLETED",
          metadata: { timestamp: new Date().toISOString() },
        },
      });
    });

    revalidatePath("/");
    return { success: true, redirectTo: "/farmer/dashboard" };
  } catch (error) {
    console.error("Farmer onboarding error:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to complete onboarding",
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
    const { userId } = await auth();

    if (!userId) {
      return { success: false, error: "User not authenticated" };
    }

    const user = await prisma.user.findUnique({
      where: { clerkUserId: userId },
    });

    if (!user) {
      return { success: false, error: "User not found" };
    }
    
    if (user.role !== "LANDOWNER") {
      return { success: false, error: "User role is not LANDOWNER" };
    }

    // Start transaction
    await prisma.$transaction(async (tx) => {
      // 1. Update User with basic info
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

      // 2. Create Landowner Profile with preferences
      await tx.landownerProfile.upsert({
        where: { userId: user.id },
        update: {
          ownershipType: formData.ownershipType,
          preferredPaymentFrequency: formData.preferredPaymentFrequency,
          preferredContactMethod: formData.preferredContactMethod,
          verificationLevel: 1,
        },
        create: {
          userId: user.id,
          ownershipType: formData.ownershipType,
          preferredPaymentFrequency: formData.preferredPaymentFrequency,
          preferredContactMethod: formData.preferredContactMethod,
          verificationLevel: 1,
        },
      });

      // 3. Create welcome notification
      await tx.notification.create({
        data: {
          userId: user.id,
          type: "SYSTEM",
          title: "Welcome to Fieldly! 🎉",
          message: "Your landowner profile is complete. Start listing your lands now!",
        },
      });

      // 4. Audit log
      await tx.auditLog.create({
        data: {
          userId: user.id,
          action: "LANDOWNER_ONBOARDING_COMPLETED",
          metadata: {
            timestamp: new Date().toISOString(),
            preferences: {
              ownershipType: formData.ownershipType,
              paymentFrequency: formData.preferredPaymentFrequency,
              contactMethod: formData.preferredContactMethod,
            },
          },
        },
      });
    });

    revalidatePath("/");
    return { success: true, redirectTo: "/landowner/dashboard" };
  } catch (error) {
    console.error("Landowner onboarding error:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to complete onboarding",
    };
  }
}

/* ============================================================
   CHECK USER STATUS
============================================================ */

export async function checkUserStatus(): Promise<UserStatusResult> {
  try {
    const { userId } = await auth();
    
    if (!userId) {
      return { 
        authenticated: false,
        error: "Not authenticated",
        needsAuth: true 
      };
    }

    const user = await prisma.user.findUnique({
      where: { clerkUserId: userId },
      include: {
        farmerProfile: true,
        landownerProfile: true,
      },
    });

    if (!user) {
      return {
        authenticated: true,
        user: null,
        exists: false,
        needsOnboarding: true,
        status: "needs_role"
      };
    }

    return {
      authenticated: true,
      user: {
        id: user.id,
        clerkId: user.clerkUserId,
        name: user.name || "",
        email: user.email || "",
        phone: user.phone,
        state: user.state,
        district: user.district,
        bio: user.bio,
        role: user.role === "ADMIN" ? null : user.role, // Convert ADMIN to null
        isOnboarded: user.isOnboarded,
        hasFarmerProfile: !!user.farmerProfile,
        hasLandownerProfile: !!user.landownerProfile,
      },
      exists: true,
      needsOnboarding: !user.role || !user.isOnboarded,
      status: user.role && user.isOnboarded ? "complete" : 
              user.role && !user.isOnboarded ? "needs_profile" : 
              "needs_role"
    };
    
  } catch (error) {
    console.error("Error checking user status:", error);
    return {
      authenticated: false,
      error: "Internal server error",
    };
  }
}