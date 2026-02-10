// app/(auth)/post-auth/page.tsx

import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";

export default async function PostAuthPage() {
  const { userId } = await auth();

  if (!userId) {
    redirect("/sign-in");
  }

  /**
   * RACE-SAFE USER FETCH / CREATE
   * - Prevents duplicate users
   * - Prevents redirect loops
   */
  const user = await prisma.user.upsert({
    where: { clerkUserId: userId },
    update: {},
    create: {
      clerkUserId: userId,
      email: "",
      name: "",
      role: null,
      isOnboarded: false,
    },
    select: {
      role: true,
      isOnboarded: true,
    },
  });

  /**
   * ROUTING LOGIC (DETERMINISTIC)
   */

  // 1️⃣ Role not chosen yet
  if (!user.role) {
    redirect("/onboarding/role");
  }

  // 2️⃣ Role chosen but onboarding not complete
  if (!user.isOnboarded) {
    if (user.role === "FARMER") {
      redirect("/onboarding/farmer");
    }

    if (user.role === "LANDOWNER") {
      redirect("/onboarding/landowner");
    }

    redirect("/onboarding/role");
  }

  // 3️⃣ Fully onboarded → dashboard
  if (user.role === "FARMER") {
    redirect("/farmer/dashboard");
  }

  if (user.role === "LANDOWNER") {
    redirect("/landowner/dashboard");
  }

  // Safety fallback
  redirect("/");
}
