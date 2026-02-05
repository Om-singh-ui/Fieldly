// app/(auth)/post-auth/page.tsx
import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";

export default async function PostAuthPage() {
  const { userId } = await auth();
  
  if (!userId) {
    redirect("/sign-in");
  }

  // Check if user exists
  const user = await prisma.user.findUnique({
    where: { clerkUserId: userId },
  });

  // If user doesn't exist, create a minimal record first
  if (!user) {
    try {
      await prisma.user.create({
        data: {
          clerkUserId: userId,
          email: "", // Empty for now
          name: "", // Empty for now
          isOnboarded: false,
          role: null,
        },
      });
      
      // Redirect to role selection
      redirect("/onboarding/role");
    } catch (error) {
      console.error("Error creating user:", error);
      // Fallback: still redirect to role selection
      redirect("/onboarding/role");
    }
  }

  // User exists, check their status
  if (!user.role) {
    redirect("/onboarding/role");
  } else if (!user.isOnboarded) {
    const onboardingPath = user.role === "FARMER" 
      ? "/onboarding/farmer" 
      : "/onboarding/landowner";
    redirect(onboardingPath);
  } else {
    const dashboardPath = user.role === "FARMER"
      ? "/farmer/dashboard"
      : "/landowner/dashboard";
    redirect(dashboardPath);
  }
}