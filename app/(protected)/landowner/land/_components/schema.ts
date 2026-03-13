import { z } from "zod";

const baseFormSchema = z.object({
  title: z.string().min(5).max(100),
  description: z.string().optional(),
  landType: z.enum(["AGRICULTURAL", "FALLOW", "ORCHARD", "PASTURE"]),
  size: z.number().min(0.1),
  soilType: z.string().optional(),

  village: z.string().min(2),
  district: z.string().min(2),
  state: z.string().min(2),
  latitude: z.number().nullable(),
  longitude: z.number().nullable(),

  irrigationAvailable: z.boolean(),
  electricityAvailable: z.boolean(),
  roadAccess: z.boolean(),
  fencingAvailable: z.boolean(),
  storageAvailable: z.boolean(),
  waterSource: z.string().optional(),
  soilReportAvailable: z.boolean(),

  allowedCropTypes: z.array(z.string()).min(1),
  allowsInfrastructureModification: z.boolean(),
  allowsOrganicFarming: z.boolean(),
  allowsSubleasing: z.boolean(),
  previousCrops: z.array(z.string()).optional(),

  minLeaseDuration: z.number().min(1),
  maxLeaseDuration: z.number().min(1),
  expectedRentMin: z.number().nullable(),
  expectedRentMax: z.number().nullable(),
  depositAmount: z.number().nullable(),
  preferredPaymentFrequency: z.enum([
    "MONTHLY",
    "QUARTERLY",
    "HALF_YEARLY",
    "YEARLY",
  ]).optional(),

  listingType: z.enum(["OPEN_BIDDING", "FIXED_PRICE"]),
  basePrice: z.number().min(0),
  reservePrice: z.number().nullable(),
  buyNowPrice: z.number().nullable(),
  listingStartDate: z.coerce.date(),
  listingEndDate: z.coerce.date(),

  paymentFrequency: z.enum([
    "MONTHLY",
    "QUARTERLY",
    "HALF_YEARLY",
    "YEARLY",
  ]),
  securityDepositRequired: z.boolean(),
  additionalTerms: z.string().optional(),
  inspectionRequired: z.boolean(),
  insuranceRequired: z.boolean(),
});

export const formSchema = baseFormSchema
  .refine(
    (d) =>
      d.expectedRentMin == null ||
      d.expectedRentMax == null ||
      d.expectedRentMax >= d.expectedRentMin,
    { message: "Max rent must be >= min rent", path: ["expectedRentMax"] }
  )
  .refine((d) => d.maxLeaseDuration >= d.minLeaseDuration, {
    message: "Max lease must be >= min lease",
    path: ["maxLeaseDuration"],
  })
  .refine((d) => d.listingEndDate > d.listingStartDate, {
    message: "End date must be after start date",
    path: ["listingEndDate"],
  })
  .refine(
    (d) => d.listingType === "OPEN_BIDDING" || d.buyNowPrice != null,
    {
      message: "Buy now required for fixed listing",
      path: ["buyNowPrice"],
    }
  );

export type FormValues = z.input<typeof formSchema>;