import { z } from "zod";

/* ======================================================
   Helpers
====================================================== */

const phoneRegex = /^[0-9]{10}$/;

/* ======================================================
   Farmer Schema
====================================================== */

export const farmerOnboardingSchema = z.object({
  phone: z.string().trim().regex(phoneRegex, "Enter valid 10-digit phone number"),
  state: z.string().trim().min(2, "Enter valid state"),
  district: z.string().trim().min(2, "Enter valid district"),
  bio: z.string().trim().optional(),

  primaryCrops: z.array(z.string().trim()).min(1, "Select at least one crop"),
  farmingExperience: z.number().min(0).max(60, "Experience must be between 0 and 60 years"),
  farmingType: z.enum(["SUBSISTENCE", "COMMERCIAL", "ORGANIC", "MIXED"]),

  requiredLandSize: z.number().min(0.1, "Minimum 0.1 acres").max(1000, "Maximum 1000 acres"),
  leaseDuration: z.number().min(1, "Minimum 1 month").max(120, "Maximum 120 months"),

  irrigationNeeded: z.boolean(),
  equipmentAccess: z.boolean(),
});

/* ======================================================
   Landowner Schema - Clean, No Land Fields
====================================================== */

// Define arrays for UI options
export const ownershipTypes = [
  "Individual",
  "Joint",
  "Corporate",
  "Family Trust",
  "Partnership"
] as const;

export const paymentFrequencies = [
  "Monthly",
  "Quarterly",
  "Half-Yearly",
  "Annual"
] as const;

export const contactMethods = [
  "Call",
  "WhatsApp",
  "App Chat",
  "Email"
] as const;

// Define the schema with proper types
export const landownerOnboardingSchema = z.object({
  // Contact Information
  phone: z.string().trim().regex(phoneRegex, "Enter valid 10-digit phone number"),
  state: z.string().trim().min(2, "Enter valid state"),
  district: z.string().trim().min(2, "Enter valid district"),
  
  // Professional Background
  bio: z.string()
    .trim()
    .min(20, "Please provide at least 20 characters about your land ownership experience")
    .max(500, "Bio must be less than 500 characters"),

  // Account Preferences
  ownershipType: z.enum(ownershipTypes),
  preferredPaymentFrequency: z.enum(paymentFrequencies),
  preferredContactMethod: z.enum(contactMethods),

  // Notification Preferences
  emailNotifications: z.boolean(),
  whatsappNotifications: z.boolean(),
  
  // Terms Agreement
  termsAccepted: z.boolean().refine(val => val === true, {
    message: "You must accept the terms and conditions"
  }),
  
  privacyPolicyAccepted: z.boolean().refine(val => val === true, {
    message: "You must accept the privacy policy" 
  }),
});

/* ======================================================
   Types
====================================================== */

export type FarmerOnboardingInput = z.infer<typeof farmerOnboardingSchema>;
export type LandownerOnboardingInput = z.infer<typeof landownerOnboardingSchema>;