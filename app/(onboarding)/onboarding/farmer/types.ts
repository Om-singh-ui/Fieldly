export type FarmingType =
  | "COMMERCIAL"
  | "SUBSISTENCE"
  | "ORGANIC"
  | "MIXED";

export interface FarmerOnboardingInput {
  phone: string;
  state: string;
  district: string;
  bio?: string;

  primaryCrops: string[];
  farmingExperience: number;
  farmingType: FarmingType;

  requiredLandSize: number;
  leaseDuration: number;

  irrigationNeeded: boolean;
  equipmentAccess: boolean;
}
