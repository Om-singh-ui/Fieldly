import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";

export async function requireOnboardedUser() {
  const { userId } = await auth();
  if (!userId) redirect("/sign-in");

  const user = await prisma.user.findUnique({
    where: { clerkUserId: userId },
    select: {
      role: true,
      isOnboarded: true,
    },
  });

  if (!user) redirect("/onboarding/role");
  if (!user.role) redirect("/onboarding/role");
  if (!user.isOnboarded) {
    redirect(`/onboarding/${user.role.toLowerCase()}`);
  }

  return { userId, role: user.role };
}
