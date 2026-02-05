// lib/validations/onboarding.ts
import { z } from "zod";

export const farmerOnboardingSchema = z.object({
  // Basic Info
  phone: z.string().regex(/^[0-9]{10}$/, "Enter valid 10-digit phone number"),
  state: z.string().min(2, "Enter valid state"),
  district: z.string().min(2, "Enter valid district"),
  bio: z.string().optional(),
  
  // Farming Details
  primaryCrops: z.array(z.string()).min(1, "Select at least one crop"),
  farmingExperience: z
    .number()
    .min(0, "Experience cannot be negative")
    .max(60, "Maximum 60 years experience"),
  farmingType: z.enum(["SUBSISTENCE", "COMMERCIAL", "ORGANIC", "MIXED"]),
  
  // Land Requirements
  requiredLandSize: z
    .number()
    .min(0.1, "Minimum 0.1 acre")
    .max(1000, "Maximum 1000 acres"),
  leaseDuration: z
    .number()
    .min(1, "Minimum 1 month")
    .max(120, "Maximum 10 years (120 months)"),
  
  // Infrastructure
  irrigationNeeded: z.boolean().default(false),
  equipmentAccess: z.boolean().default(false),
});

export const landownerOnboardingSchema = z.object({
  phone: z.string().regex(/^[0-9]{10}$/, "Enter valid 10-digit phone number"),
  state: z.string().min(2, "Enter valid state"),
  district: z.string().min(2, "Enter valid district"),
  bio: z.string().optional(),
});

export type FarmerOnboardingInput = z.infer<typeof farmerOnboardingSchema>;
export type LandownerOnboardingInput = z.infer<typeof landownerOnboardingSchema>;