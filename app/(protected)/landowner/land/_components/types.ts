// app/(protected)/landowner/land/new/_components/types.ts
export { formSchema, type FormValues } from "./schema";

export const STEPS = [
  { id: 1, title: "Basic Info", icon: "Landmark" },
  { id: 2, title: "Location", icon: "MapPin" },
  { id: 3, title: "Amenities", icon: "Zap" },
  { id: 4, title: "Farming Details", icon: "Sprout" },
  { id: 5, title: "Lease Terms", icon: "Calendar" },
  { id: 6, title: "Pricing", icon: "Banknote" },
  { id: 7, title: "Review", icon: "Check" },
] as const;

export const CROP_TYPES = [
  "Cereals", "Pulses", "Oilseeds", "Vegetables",
  "Fruits", "Cash Crops", "Fodder", "Flowers",
] as const;

export const SOIL_TYPES = [
  "Alluvial", "Black", "Red", "Laterite",
  "Arid", "Saline", "Peaty", "Forest",
] as const;