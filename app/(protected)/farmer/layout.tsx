// app/(protected)/farmer/layout.tsx
import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";

export default async function FarmerLayout({
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

  // Redirect if user doesn't exist or isn't a farmer
  if (!user) {
    redirect("/onboarding/role");
  }

  if (user.role !== "FARMER") {
    redirect("/unauthorized");
  }

  // Redirect if not onboarded
  if (!user.isOnboarded) {
    redirect("/onboarding/farmer");
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* You can add farmer-specific header/sidebar here */}
      {children}
    </div>
  );
}