// lib/admin/permissions.ts
export const PERMISSIONS = {
  // User permissions
  VIEW_USERS: "view_users",
  CREATE_USER: "create_user",
  UPDATE_USER: "update_user",
  DELETE_USER: "delete_user",
  BAN_USER: "ban_user",

  // Listing permissions
  VIEW_LISTINGS: "view_listings",
  APPROVE_LISTING: "approve_listing",
  REJECT_LISTING: "reject_listing",
  DELETE_LISTING: "delete_listing",
  FEATURE_LISTING: "feature_listing",

  // Application permissions
  VIEW_APPLICATIONS: "view_applications",
  APPROVE_APPLICATION: "approve_application",
  REJECT_APPLICATION: "reject_application",

  // Payment permissions
  VIEW_PAYMENTS: "view_payments",
  PROCESS_REFUND: "process_refund",
  VIEW_FINANCIALS: "view_financials",

  // Dispute permissions
  VIEW_DISPUTES: "view_disputes",
  RESOLVE_DISPUTE: "resolve_dispute",
  ASSIGN_DISPUTE: "assign_dispute",

  // Admin permissions
  VIEW_AUDIT_LOGS: "view_audit_logs",
  MANAGE_ADMINS: "manage_admins",
  MANAGE_SETTINGS: "manage_settings",
  VIEW_SECURITY: "view_security",

  // Super admin only
  SUPER_ADMIN_ALL: "super_admin_all",
} as const;

export const ROLE_PERMISSIONS: Record<string, string[]> = {
  ADMIN: [
    PERMISSIONS.VIEW_USERS,
    PERMISSIONS.VIEW_LISTINGS,
    PERMISSIONS.APPROVE_LISTING,
    PERMISSIONS.REJECT_LISTING,
    PERMISSIONS.VIEW_APPLICATIONS,
    PERMISSIONS.VIEW_PAYMENTS,
    PERMISSIONS.VIEW_DISPUTES,
    PERMISSIONS.RESOLVE_DISPUTE,
    PERMISSIONS.VIEW_AUDIT_LOGS,
  ],
  SUPER_ADMIN: Object.values(PERMISSIONS),
};

export function hasPermission(userRole: string | null, permission: string): boolean {
  if (!userRole) return false;
  if (userRole === "SUPER_ADMIN") return true;
  
  const permissions = ROLE_PERMISSIONS[userRole] || [];
  return permissions.includes(permission);
}