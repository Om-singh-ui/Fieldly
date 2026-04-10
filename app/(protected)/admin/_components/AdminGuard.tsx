// lib/server/admin-guard.ts

import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";

export interface AdminUser {
  id: string;
  email: string;
  name: string;
  role: "ADMIN" | "SUPER_ADMIN" | "FARMER" | "LANDOWNER" | null;
  clerkUserId: string;
}

export interface RequireAdminOptions {
  allowedRoles?: Array<"ADMIN" | "SUPER_ADMIN">;
  redirectTo?: string;
}

/**
 * Require admin authentication for API routes and server components
 */
export async function requireAdmin(
  options: RequireAdminOptions = {}
): Promise<AdminUser> {
  const { allowedRoles = ["ADMIN", "SUPER_ADMIN"], redirectTo } = options;

  // Get session from Clerk - this is safe for static/dynamic rendering
  const { userId } = await auth();

  if (!userId) {
    if (redirectTo) {
      redirect(redirectTo);
    }
    throw new Error("Unauthorized: No session found");
  }

  // Get user from database with role
  const user = await prisma.user.findUnique({
    where: { clerkUserId: userId },
    select: {
      id: true,
      email: true,
      name: true,
      role: true,
      clerkUserId: true,
    },
  });

  if (!user) {
    if (redirectTo) {
      redirect(redirectTo);
    }
    throw new Error("Unauthorized: User not found in database");
  }

  // Check if user has admin role
  const userRole = user.role;

  if (!userRole) {
    if (redirectTo) {
      redirect("/unauthorized");
    }
    throw new Error("Forbidden: No role assigned");
  }

  // Check if user's role is allowed
  if (!allowedRoles.includes(userRole as "ADMIN" | "SUPER_ADMIN")) {
    if (redirectTo) {
      redirect("/unauthorized");
    }
    throw new Error(`Forbidden: Requires ${allowedRoles.join(" or ")} role`);
  }

  return user as AdminUser;
}

export async function isAdmin(): Promise<boolean> {
  try {
    await requireAdmin();
    return true;
  } catch {
    return false;
  }
}

export async function isSuperAdmin(): Promise<boolean> {
  try {
    const user = await requireAdmin();
    return user.role === "SUPER_ADMIN";
  } catch {
    return false;
  }
}

export async function getCurrentUser(): Promise<AdminUser | null> {
  try {
    const { userId } = await auth();

    if (!userId) {
      return null;
    }

    const user = await prisma.user.findUnique({
      where: { clerkUserId: userId },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        clerkUserId: true,
      },
    });

    return user as AdminUser | null;
  } catch {
    return null;
  }
}

export async function getCurrentUserId(): Promise<string | null> {
  const user = await getCurrentUser();
  return user?.id || null;
}