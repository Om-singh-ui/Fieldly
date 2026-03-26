// lib/getOrCreateUser.ts
import { auth, currentUser } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";

export async function getOrCreateUserDB() {
  const { userId } = await auth();
  if (!userId) throw new Error("Not authenticated");

  const clerkUser = await currentUser();

  return prisma.user.upsert({
    where: { clerkUserId: userId },
    update: {},
    create: {
      clerkUserId: userId,
      email:
        clerkUser?.emailAddresses?.[0]?.emailAddress ??
        `${userId}@temp.com`,
      name:
        `${clerkUser?.firstName ?? ""} ${
          clerkUser?.lastName ?? ""
        }`.trim() || "User",
      role: null,
      isOnboarded: false,
    },
  });
}