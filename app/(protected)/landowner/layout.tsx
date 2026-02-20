// app/(protected)/landowner/layout.tsx
import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";

export default async function LandownerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { userId } = await auth();
  
  if (!userId) {
    redirect("/sign-in");
  }

  const user = await prisma.user.findUnique({
    where: { clerkUserId: userId },
  });

  // Redirect if user doesn't exist or isn't a landowner
  if (!user) {
    redirect("/onboarding/role");
  }

  if (user.role !== "LANDOWNER") {
    redirect("/unauthorized");
  }

  // Redirect if not onboarded
  if (!user.isOnboarded) {
    redirect("/onboarding/landowner");
  }

  return (
    <div className="min-h-screen">
      {/* You can add landowner-specific header/sidebar here */}
      {children}
    </div>
  );
}