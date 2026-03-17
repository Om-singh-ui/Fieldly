// app/(protected)/landowner/land/new/_components/types.ts
export { formSchema, type FormValues } from "./schema";

export const STEPS = [
  { id: 1, title: "Basic Info", image: "/onboarding/user-man-account-person.png" },
  { id: 2, title: "Location", image: "/onboarding/landreq.png" },
  { id: 3, title: "Amenities", image: "/onboarding/commercial.png" },
  { id: 4, title: "Farming Details", image: "/ilsfarmer.png" },
  { id: 5, title: "Lease Terms", image: "/onboarding/jointownership.jpg" },
  { id: 6, title: "Pricing", image: "/icons/sponsor-npci.png" },
  { id: 7, title: "Review", image: "/onboarding/review.png" },
] as const;

export const CROP_TYPES = [
  "Cereals", "Pulses", "Oilseeds", "Vegetables",
  "Fruits", "Cash Crops", "Fodder", "Flowers",
] as const;

export const SOIL_TYPES = [
  "Alluvial", "Black", "Red", "Laterite",
  "Arid", "Saline", "Peaty", "Forest",
] as const;