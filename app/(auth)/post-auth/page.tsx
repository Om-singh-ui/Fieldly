// app/(auth)/post-auth/page.tsx

import { auth, currentUser } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";

// CRITICAL: prevents caching + ensures fresh execution
export const dynamic = "force-dynamic";
export const fetchCache = "force-no-store";
export const revalidate = 0;

export default async function PostAuthPage() {
  const { userId } = await auth();

  // redirect immediately (no async before)
  if (!userId) redirect("/sign-in");

  // run both in parallel (reduces delay → less URL exposure)
  const [clerkUser, user] = await Promise.all([
    currentUser(),
    prisma.user.findUnique({
      where: { clerkUserId: userId },
      select: { role: true, isOnboarded: true },
    }),
  ]);

  let dbUser = user;

  // only upsert if user doesn't exist (BIG performance win)
  if (!dbUser) {
    dbUser = await prisma.user.create({
      data: {
        clerkUserId: userId,
        email:
          clerkUser?.emailAddresses?.[0]?.emailAddress ??
          `${userId}@temp.fieldly`,
        name:
          `${clerkUser?.firstName ?? ""} ${clerkUser?.lastName ?? ""}`.trim() ||
          "User",
        role: null,
        isOnboarded: false,
      },
      select: { role: true, isOnboarded: true },
    });
  }

  // routing (FAST, no extra work)
  if (!dbUser.role) {
    redirect("/onboarding/role");
  }

  if (!dbUser.isOnboarded) {
    redirect(
      dbUser.role === "FARMER"
        ? "/onboarding/farmer"
        : "/onboarding/landowner"
    );
  }

  redirect(
    dbUser.role === "FARMER"
      ? "/farmer/dashboard"
      : "/landowner/dashboard"
  );
}