// lib/admin/config.ts
export const ADMIN_CONFIG = {
  // Feature flags
  features: {
    userManagement: true,
    listingManagement: true,
    paymentManagement: true,
    disputeResolution: true,
    analytics: true,
    auditLogs: true,
  },

  // Pagination defaults
  pagination: {
    defaultLimit: 20,
    maxLimit: 100,
  },

  // Session configuration
  session: {
    timeoutMinutes: 60,
    maxConcurrentSessions: 5,
  },

  // Security
  security: {
    maxLoginAttempts: 5,
    lockoutDurationMinutes: 30,
    require2FA: true,
  },

  // Routes
  routes: {
    dashboard: "/admin",
    users: "/admin/users",
    listings: "/admin/listings",
    applications: "/admin/applications",
    payments: "/admin/payments",
    disputes: "/admin/disputes",
    analytics: "/admin/analytics",
    auditLogs: "/admin/audit-logs",
    settings: "/admin/settings",
    security: "/admin/security",
  },
} as const;