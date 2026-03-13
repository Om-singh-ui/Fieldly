import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";

export default async function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { userId } = await auth();

  if (!userId) redirect("/sign-in");

  const user = await prisma.user.findUnique({
    where: { clerkUserId: userId },
    select: {
      role: true,
      isOnboarded: true,
    },
  });

  if (!user) redirect("/post-auth");

  if (!user.role) redirect("/onboarding/role");

  if (!user.isOnboarded) {
    const path =
      user.role === "FARMER"
        ? "/onboarding/farmer"
        : "/onboarding/landowner";

    redirect(path);
  }

  return <>{children}</>;
}