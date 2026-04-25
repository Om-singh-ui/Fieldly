// app/(protected)/admin/listings/_constants.ts
import {
  FileText,
  CheckCircle,
  Clock,
  Archive,
  Ban,
  Calendar,
  PlayCircle,
  PauseCircle,
  StopCircle,
  type LucideIcon,   
} from "lucide-react";

export const ITEMS_PER_PAGE_OPTIONS = [10, 20, 50, 100];

export const STATUS_OPTIONS = [
  { value: "all", label: "All Status" },
  { value: "DRAFT", label: "Draft" },
  { value: "ACTIVE", label: "Active" },
  { value: "PENDING_APPROVAL", label: "Pending Approval" },
  { value: "CLOSED", label: "Closed" },
  { value: "CANCELLED", label: "Cancelled" },
  { value: "EXPIRED", label: "Expired" },
] as const;

export const LISTING_TYPE_OPTIONS = [
  { value: "all", label: "All Types" },
  { value: "OPEN_BIDDING", label: "Open Bidding" },
  { value: "FIXED_PRICE", label: "Fixed Price" },
  { value: "NEGOTIABLE", label: "Negotiable" },
] as const;

export const SORT_OPTIONS = [
  { value: "createdAt", label: "Date Listed" },
  { value: "title", label: "Title" },
  { value: "basePrice", label: "Price" },
  { value: "status", label: "Status" },
] as const;

export interface StatusOption {
  value: string;
  label: string;
  icon: LucideIcon;
  description: string;
}

export const AVAILABLE_STATUSES: StatusOption[] = [
  { value: "DRAFT", label: "Draft", icon: FileText, description: "Listing being prepared" },
  { value: "PENDING_APPROVAL", label: "Pending Approval", icon: Clock, description: "Awaiting admin review" },
  { value: "ACTIVE", label: "Active", icon: CheckCircle, description: "Published and visible" },
  { value: "CLOSED", label: "Closed", icon: Archive, description: "No longer accepting bids" },
  { value: "CANCELLED", label: "Cancelled", icon: Ban, description: "Listing cancelled" },
  { value: "EXPIRED", label: "Expired", icon: Calendar, description: "End date passed" },
] as const;

export const VALID_TRANSITIONS: Record<string, readonly string[]> = {
  DRAFT: ["PENDING_APPROVAL", "CANCELLED"],
  PENDING_APPROVAL: ["ACTIVE", "DRAFT", "CANCELLED"],
  ACTIVE: ["CLOSED", "CANCELLED", "EXPIRED"],
  CLOSED: ["ACTIVE"],
  CANCELLED: [],
  EXPIRED: ["ACTIVE"],
} as const;

interface BadgeConfig {
  variant: "default" | "secondary" | "destructive" | "outline";
  label: string;
  icon?: LucideIcon;
}

export const STATUS_BADGE_CONFIG: Record<string, BadgeConfig> = {
  DRAFT: { variant: "secondary", label: "Draft", icon: FileText },
  ACTIVE: { variant: "default", label: "Active", icon: CheckCircle },
  PENDING_APPROVAL: { variant: "outline", label: "Pending", icon: Clock },
  CLOSED: { variant: "secondary", label: "Closed", icon: Archive },
  CANCELLED: { variant: "destructive", label: "Cancelled", icon: Ban },
  EXPIRED: { variant: "secondary", label: "Expired", icon: Calendar },
};

export const AUCTION_STATUS_BADGE_CONFIG: Record<string, BadgeConfig> = {
  UPCOMING: { variant: "secondary", label: "Upcoming" },
  LIVE: { variant: "default", label: "LIVE" },
  PAUSED: { variant: "outline", label: "Paused" },
  CLOSED: { variant: "secondary", label: "Closed" },
  SETTLED: { variant: "default", label: "Settled" },
  FAILED: { variant: "destructive", label: "Failed" },
};

export const LISTING_TYPE_BADGE_CONFIG: Record<string, { label: string; color: string }> = {
  OPEN_BIDDING: { label: "Bidding", color: "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400" },
  FIXED_PRICE: { label: "Fixed", color: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400" },
  NEGOTIABLE: { label: "Negotiable", color: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400" },
};

export const AUCTION_ACTION_CONFIG = {
  UPCOMING: {
    title: "Set as Upcoming",
    description: "Listing will be visible in marketplace but bidding is not yet open.",
    variant: "outline" as const,
    icon: Calendar,
    color: "text-blue-600",
  },
  LIVE: {
    title: "Make LIVE for Bidding",
    description: "Listing will be visible and farmers can place bids immediately.",
    variant: "default" as const,
    icon: PlayCircle,
    color: "text-green-600",
  },
  PAUSED: {
    title: "Pause Auction",
    description: "Listing will be hidden from marketplace temporarily. You can resume later.",
    variant: "outline" as const,
    icon: PauseCircle,
    color: "text-amber-600",
  },
  CLOSED: {
    title: "Close Auction",
    description: "Auction will end. Listing will be hidden from marketplace.",
    variant: "destructive" as const,
    icon: StopCircle,
    color: "text-red-600",
  },
} as const;