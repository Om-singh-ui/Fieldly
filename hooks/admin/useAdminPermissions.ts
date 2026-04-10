// hooks/admin/useAdminPermissions.ts
"use client";

import { useAdminAuth } from "./useAdminAuth";
import { PERMISSIONS } from "@/lib/admin/permissions";

export function useAdminPermissions() {
  const { admin } = useAdminAuth();

  const hasPermission = (permission: string): boolean => {
    if (!admin) return false;
    if (admin.role === "SUPER_ADMIN") return true;

    // Check specific permissions based on role
    const rolePermissions: Record<string, string[]> = {
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
    };

    const permissions = rolePermissions[admin.role] || [];
    return permissions.includes(permission);
  };

  const can = {
    viewUsers: hasPermission(PERMISSIONS.VIEW_USERS),
    createUser: hasPermission(PERMISSIONS.CREATE_USER),
    updateUser: hasPermission(PERMISSIONS.UPDATE_USER),
    deleteUser: hasPermission(PERMISSIONS.DELETE_USER),
    viewListings: hasPermission(PERMISSIONS.VIEW_LISTINGS),
    approveListing: hasPermission(PERMISSIONS.APPROVE_LISTING),
    rejectListing: hasPermission(PERMISSIONS.REJECT_LISTING),
    viewApplications: hasPermission(PERMISSIONS.VIEW_APPLICATIONS),
    viewPayments: hasPermission(PERMISSIONS.VIEW_PAYMENTS),
    viewDisputes: hasPermission(PERMISSIONS.VIEW_DISPUTES),
    resolveDispute: hasPermission(PERMISSIONS.RESOLVE_DISPUTE),
    viewAuditLogs: hasPermission(PERMISSIONS.VIEW_AUDIT_LOGS),
    manageSettings: hasPermission(PERMISSIONS.MANAGE_SETTINGS),
  };

  return { hasPermission, can };
}