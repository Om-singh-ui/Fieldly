// lib/server/admin-guard.ts
import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";
import { headers } from "next/headers";
import { checkRateLimit } from "./rate-limiter";

export const ADMIN_ROLES = ["ADMIN", "SUPER_ADMIN"];
export const SUPER_ADMIN_ONLY = ["SUPER_ADMIN"];

interface AdminGuardOptions {
  allowedRoles?: string[];
  requireIPWhitelist?: boolean;
  require2FA?: boolean;
  rateLimit?: number;
}

export async function requireAdmin(options: AdminGuardOptions = {}) {
  const {
    allowedRoles = ADMIN_ROLES,
    requireIPWhitelist = false,  // DISABLED for development
    require2FA = false,           // DISABLED for development
    rateLimit = 1000,             // INCREASED for development
  } = options;

  const { userId } = await auth();
  const headersList = await headers();
  const ipAddress = headersList.get("x-forwarded-for") || "unknown";

  // 1. Authentication check
  if (!userId) {
    console.log('❌ Admin guard: No userId');
    throw new Error("Unauthorized");
  }

  // 2. Rate limiting (more lenient for dev)
  const rateLimitKey = `admin:${userId}`;
  const isRateLimited = await checkRateLimit(rateLimitKey, rateLimit);
  if (isRateLimited) {
    console.log('❌ Admin guard: Rate limited');
    throw new Error("Rate limit exceeded");
  }

  // 3. IP Whitelist check (DISABLED)
  // if (requireIPWhitelist) { ... }

  // 4. Database user verification
  const user = await prisma.user.findUnique({
    where: { clerkUserId: userId },
    select: {
      id: true,
      email: true,
      name: true,
      role: true,
    },
  });

  if (!user) {
    console.log('❌ Admin guard: User not found for Clerk ID:', userId);
    throw new Error("User not found");
  }

  console.log('✅ Admin guard: User found -', user.email, 'Role:', user.role);

  // 5. Role check
  if (!allowedRoles.includes(user.role || "")) {
    console.log('❌ Admin guard: Insufficient permissions. User role:', user.role);
    throw new Error("Insufficient permissions");
  }

  // 6. Session validation - AUTO-CREATE SESSION IF MISSING
  const activeSession = await validateOrCreateAdminSession(user.id, ipAddress);
  if (!activeSession && require2FA) {
    console.log('❌ Admin guard: No active session');
    throw new Error("Invalid admin session");
  }

  // 7. Log successful access
  await prisma.adminAction.create({
    data: {
      adminId: user.id,
      action: "ACCESS",
      entity: "ADMIN",
      ipAddress,
      userAgent: headersList.get("user-agent") || undefined,
    },
  });

  console.log('✅ Admin guard: Access GRANTED for', user.email);
  return user;
}

export async function requireSuperAdmin() {
  return requireAdmin({ allowedRoles: SUPER_ADMIN_ONLY });
}

async function validateOrCreateAdminSession(adminId: string, ipAddress: string): Promise<boolean> {
  // Check for existing session
  const session = await prisma.adminSession.findFirst({
    where: {
      adminId,
      isRevoked: false,
      expiresAt: { gt: new Date() },
    },
    orderBy: { createdAt: "desc" },
  });

  if (session) {
    await prisma.adminSession.update({
      where: { id: session.id },
      data: { lastActive: new Date() },
    });
    console.log('✅ Existing session found and updated');
    return true;
  }

  // AUTO-CREATE SESSION FOR DEVELOPMENT
  console.log('📝 No session found - creating new session...');
  
  try {
    const newSession = await prisma.adminSession.create({
      data: {
        adminId,
        token: `dev-session-${Date.now()}-${Math.random().toString(36)}`,
        ipAddress,
        expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 hours
        lastActive: new Date(),
        isRevoked: false,
      },
    });
    
    console.log('✅ New session created:', newSession.id);
    return true;
  } catch (error) {
    console.error('❌ Failed to create session:', error);
    return false;
  }
}