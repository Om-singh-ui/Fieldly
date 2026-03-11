// app/(auth)/post-auth/page.tsx

import { auth, currentUser } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

export default async function PostAuthPage() {
  const { userId } = await auth();

  if (!userId) {
    redirect("/sign-in");
  }

  /**
   * Get Clerk user (needed for first DB sync)
   */
  const clerkUser = await currentUser();

  /**
   * RACE-SAFE UPSERT
   * - Prevent duplicate users
   * - Ensure email/name always synced
   */
  const user = await prisma.user.upsert({
    where: { clerkUserId: userId },
    update: {
      email:
        clerkUser?.emailAddresses?.[0]?.emailAddress ?? undefined,
      name:
        `${clerkUser?.firstName ?? ""} ${
          clerkUser?.lastName ?? ""
        }`.trim() || undefined,
    },
    create: {
      clerkUserId: userId,
      email:
        clerkUser?.emailAddresses?.[0]?.emailAddress ??
        `${userId}@temp.fieldly`,
      name:
        `${clerkUser?.firstName ?? ""} ${
          clerkUser?.lastName ?? ""
        }`.trim() || "User",
      role: null,
      isOnboarded: false,
    },
    select: {
      role: true,
      isOnboarded: true,
    },
  });

  /**
   * DETERMINISTIC ROUTING
   */

  // 1️⃣ No role selected
  if (!user.role) {
    redirect("/onboarding/role");
  }

  // 2️⃣ Role selected but onboarding incomplete
  if (!user.isOnboarded) {
    redirect(
      user.role === "FARMER"
        ? "/onboarding/farmer"
        : "/onboarding/landowner"
    );
  }

  // 3️⃣ Fully onboarded
  redirect(
    user.role === "FARMER"
      ? "/farmer/dashboard"
      : "/landowner/dashboard"
  );
}