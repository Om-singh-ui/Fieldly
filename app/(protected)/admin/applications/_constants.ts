// app/(protected)/admin/applications/_constants.ts
import { Clock, AlertCircle, CheckCircle, XCircle, Ban } from "lucide-react";

export const ITEMS_PER_PAGE_OPTIONS = [10, 20, 50, 100];

export const STATUS_OPTIONS = [
  { value: "all", label: "All Status" },
  { value: "PENDING", label: "Pending" },
  { value: "UNDER_REVIEW", label: "Under Review" },
  { value: "APPROVED", label: "Approved" },
  { value: "REJECTED", label: "Rejected" },
  { value: "WITHDRAWN", label: "Withdrawn" },
] as const;

export const SORT_OPTIONS = [
  { value: "createdAt", label: "Date Applied" },
  { value: "proposedRent", label: "Proposed Rent" },
  { value: "duration", label: "Duration" },
  { value: "status", label: "Status" },
] as const;

export const STATUS_BADGE_CONFIG: Record<string, {
  variant: "default" | "secondary" | "destructive" | "outline";
  label: string;
  icon: React.ElementType;
}> = {
  PENDING: { variant: "secondary", label: "Pending", icon: Clock },
  UNDER_REVIEW: { variant: "outline", label: "Under Review", icon: AlertCircle },
  APPROVED: { variant: "default", label: "Approved", icon: CheckCircle },
  REJECTED: { variant: "destructive", label: "Rejected", icon: XCircle },
  WITHDRAWN: { variant: "outline", label: "Withdrawn", icon: Ban },
};