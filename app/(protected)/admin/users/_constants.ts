// app/(protected)/admin/users/_constants.ts
import { Shield, Home, Sprout } from "lucide-react";

export const ROLE_OPTIONS = [
  { value: "all", label: "All Roles" },
  { value: "FARMER", label: "Farmer" },
  { value: "LANDOWNER", label: "Landowner" },
  { value: "ADMIN", label: "Admin" },
  { value: "SUPER_ADMIN", label: "Super Admin" },
] as const;

export const STATUS_OPTIONS = [
  { value: "all", label: "All Status" },
  { value: "onboarded", label: "Onboarded" },
  { value: "pending", label: "Pending" },
] as const;

export const ROLE_BADGE_CONFIG: Record<string, { 
  label: string; 
  variant: "default" | "secondary" | "destructive" | "outline"; 
  icon: React.ElementType 
}> = {
  SUPER_ADMIN: { label: "Super Admin", variant: "destructive", icon: Shield },
  ADMIN: { label: "Admin", variant: "default", icon: Shield },
  LANDOWNER: { label: "Landowner", variant: "secondary", icon: Home },
  FARMER: { label: "Farmer", variant: "outline", icon: Sprout },
};

export const BULK_ACTIONS = [
  { value: "bulk_onboard", label: "Mark as Onboarded" },
  { value: "bulk_verify", label: "Verify Profiles" },
  { value: "bulk_update_role", label: "Change Role" },
] as const;