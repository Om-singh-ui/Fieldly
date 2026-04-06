import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function OnboardingLayout({
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
      onboardingStep: true,
    },
  });

  if (!user) redirect("/post-auth");

  ////////////////////////////////////////
  // STATE MACHINE CONTROL
  ////////////////////////////////////////

  // DONE → block onboarding
  if (user.onboardingStep === 4) {
    const dashboard =
      user.role === "FARMER"
        ? "/farmer/dashboard"
        : "/landowner/dashboard";

    redirect(dashboard);
  }

  // SUCCESS → allow ONLY success screen
  if (user.onboardingStep === 3) {
    return <>{children}</>;
  }

  // otherwise → onboarding flow continues
  return <>{children}</>;
}