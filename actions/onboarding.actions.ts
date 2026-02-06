// actions/onboarding.actions.ts
"use server";

import { auth, currentUser } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function setUserRole(role: "FARMER" | "LANDOWNER") {
  try {
    const { userId } = await auth();
    
    if (!userId) {
      throw new Error("User not authenticated");
    }

    // Get Clerk user data
    const clerkUser = await currentUser();
    
    // First, check if user exists
    let user = await prisma.user.findUnique({
      where: { clerkUserId: userId },
    });

    // If user doesn't exist, create with Clerk user data
    if (!user) {
      user = await prisma.user.create({
        data: {
          clerkUserId: userId,
          email: clerkUser?.emailAddresses[0]?.emailAddress || `${userId}@temp.com`,
          name: `${clerkUser?.firstName || ''} ${clerkUser?.lastName || ''}`.trim() || 'User',
          role: role,
          isOnboarded: false,
        },
      });
    } else {
      // Update existing user
      user = await prisma.user.update({
        where: { clerkUserId: userId },
        data: { role },
      });
    }

    revalidatePath("/");
    return { success: true, user };
  } catch (error) {
    console.error("Error setting user role:", error);
    throw new Error("Failed to set user role");
  }
}

// Helper to get or create user
export async function getOrCreateUser() {
  try {
    const { userId } = await auth();
    
    if (!userId) {
      throw new Error("User not authenticated");
    }

    // Check if user exists
    let user = await prisma.user.findUnique({
      where: { clerkUserId: userId },
    });

    // Create user if not exists
    if (!user) {
      const clerkUser = await currentUser();
      
      user = await prisma.user.create({
        data: {
          clerkUserId: userId,
          email: clerkUser?.emailAddresses[0]?.emailAddress || `${userId}@temp.com`,
          name: `${clerkUser?.firstName || ''} ${clerkUser?.lastName || ''}`.trim() || 'User',
          isOnboarded: false,
          role: null,
        },
      });
    }

    return user;
  } catch (error) {
    console.error("Error getting or creating user:", error);
    throw error;
  }
}

// Define proper types for form data
interface FarmerFormData {
  email?: string;
  name?: string;
  phone?: string;
  district?: string;
  state?: string;
  bio?: string; // ADDED: bio field
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
  bio?: string; // ADDED: bio field
  // Land details
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

export async function completeFarmerOnboarding(formData: FarmerFormData) {
  try {
    const { userId } = await auth();
    
    if (!userId) {
      throw new Error("User not authenticated");
    }

    // First, ensure user exists and has farmer role
    let user = await prisma.user.findUnique({
      where: { clerkUserId: userId },
    });

    if (!user) {
      throw new Error("User not found. Please select a role first.");
    }

    if (user.role !== "FARMER") {
      throw new Error("User role is not set to FARMER");
    }

    // Update user basic info - INCLUDING BIO
    user = await prisma.user.update({
      where: { clerkUserId: userId },
      data: {
        email: formData.email || user.email,
        name: formData.name || user.name,
        phone: formData.phone || user.phone,
        district: formData.district || user.district,
        state: formData.state || user.state,
        bio: formData.bio || user.bio || null, // ADDED: bio field
        isOnboarded: true,
      },
    });

    // Create or update farmer profile
    await prisma.farmerProfile.upsert({
      where: { userId: user.id },
      update: {
        primaryCrops: formData.primaryCrops || [],
        farmingExperience: parseInt(formData.farmingExperience || "0"),
        farmingType: formData.farmingType || "SUBSISTENCE",
        requiredLandSize: parseFloat(formData.requiredLandSize || "0"),
        leaseDuration: parseInt(formData.leaseDuration || "0"),
        irrigationNeeded: formData.irrigationNeeded || false,
        equipmentAccess: formData.equipmentAccess || false,
      },
      create: {
        userId: user.id,
        primaryCrops: formData.primaryCrops || [],
        farmingExperience: parseInt(formData.farmingExperience || "0"),
        farmingType: formData.farmingType || "SUBSISTENCE",
        requiredLandSize: parseFloat(formData.requiredLandSize || "0"),
        leaseDuration: parseInt(formData.leaseDuration || "0"),
        irrigationNeeded: formData.irrigationNeeded || false,
        equipmentAccess: formData.equipmentAccess || false,
      },
    });

    revalidatePath("/");
    return { success: true, user };
  } catch (error) {
    console.error("Error completing farmer onboarding:", error);
    throw new Error("Failed to complete onboarding");
  }
}

export async function completeLandownerOnboarding(formData: LandownerFormData) {
  try {
    const { userId } = await auth();
    
    if (!userId) {
      throw new Error("User not authenticated");
    }

    // First, ensure user exists and has landowner role
    let user = await prisma.user.findUnique({
      where: { clerkUserId: userId },
    });

    if (!user) {
      throw new Error("User not found. Please select a role first.");
    }

    if (user.role !== "LANDOWNER") {
      throw new Error("User role is not set to LANDOWNER");
    }

    // Update user basic info - INCLUDING BIO
    user = await prisma.user.update({
      where: { clerkUserId: userId },
      data: {
        email: formData.email || user.email,
        name: formData.name || user.name,
        phone: formData.phone || user.phone,
        district: formData.district || user.district,
        state: formData.state || user.state,
        bio: formData.bio || user.bio || null, // ADDED: bio field
        isOnboarded: true,
      },
    });

    // Create landowner profile if it doesn't exist
    await prisma.landownerProfile.upsert({
      where: { userId: user.id },
      update: {},
      create: {
        userId: user.id,
      },
    });

    // If land details are provided, create a land entry
    if (formData.landTitle && formData.landSize) {
      await prisma.land.create({
        data: {
          landownerId: (await prisma.landownerProfile.findUnique({
            where: { userId: user.id }
          }))!.id,
          title: formData.landTitle,
          size: parseFloat(formData.landSize || "0"),
          landType: formData.landType || "AGRICULTURAL",
          soilType: formData.soilType || "",
          irrigationAvailable: formData.irrigationAvailable || false,
          minLeaseDuration: parseInt(formData.minLeaseDuration || "0"),
          maxLeaseDuration: parseInt(formData.maxLeaseDuration || "0"),
          expectedRentMin: formData.expectedRentMin ? parseFloat(formData.expectedRentMin) : null,
          expectedRentMax: formData.expectedRentMax ? parseFloat(formData.expectedRentMax) : null,
          allowedCropTypes: formData.allowedCropTypes || [],
        },
      });
    }

    revalidatePath("/");
    return { success: true, user };
  } catch (error) {
    console.error("Error completing landowner onboarding:", error);
    throw new Error("Failed to complete onboarding");
  }
}