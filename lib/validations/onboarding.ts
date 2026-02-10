import { z } from "zod";

/* ======================================================
   Helpers
====================================================== */

const numberFromInput = z
  .union([z.string(), z.number()])
  .transform((val) => Number(val));

/* ======================================================
   Farmer Schema
====================================================== */

export const farmerOnboardingSchema = z.object({
  /* ---------- Basic Info ---------- */

  phone: z
    .string()
    .trim()
    .regex(/^[0-9]{10}$/, "Enter valid 10-digit phone number"),

  state: z.string().trim().min(2, "Enter valid state"),

  district: z.string().trim().min(2, "Enter valid district"),

  bio: z.string().trim().optional(),

  /* ---------- Farming Details ---------- */

  primaryCrops: z
    .array(z.string().trim())
    .min(1, "Select at least one crop"),

  farmingExperience: numberFromInput
    .refine((v) => v >= 0 && v <= 60, {
      message: "Experience must be between 0 and 60 years",
    }),

  farmingType: z.enum([
    "SUBSISTENCE",
    "COMMERCIAL",
    "ORGANIC",
    "MIXED",
  ]),

  /* ---------- Land Requirements ---------- */

  requiredLandSize: numberFromInput.refine(
    (v) => v >= 0.1 && v <= 1000,
    {
      message: "Land size must be between 0.1 and 1000 acres",
    }
  ),

  leaseDuration: numberFromInput.refine(
    (v) => v >= 1 && v <= 120,
    {
      message: "Lease duration must be between 1 and 120 months",
    }
  ),

  /* ---------- Infrastructure ---------- */

  irrigationNeeded: z.boolean(),

  equipmentAccess: z.boolean(),
});

/* ======================================================
   Landowner Schema
====================================================== */

export const landownerOnboardingSchema = z.object({
  phone: z
    .string()
    .trim()
    .regex(/^[0-9]{10}$/, "Enter valid 10-digit phone number"),

  state: z.string().trim().min(2, "Enter valid state"),

  district: z.string().trim().min(2, "Enter valid district"),

  bio: z.string().trim().optional(),
});

/* ======================================================
   Types
====================================================== */

export type FarmerOnboardingInput = z.infer<
  typeof farmerOnboardingSchema
>;

export type LandownerOnboardingInput = z.infer<
  typeof landownerOnboardingSchema
>;
