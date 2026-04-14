// app/profile/[id]/page.tsx
import { getLandownerProfileData } from "@/lib/queries/getLandownerProfileData";
import { notFound } from "next/navigation";
import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";

import { ProfileHeader } from "./_components/ProfileHeader";
import { StatsBar } from "./_components/StatsBar";
import { ListingsGrid } from "./_components/ListingsGrid";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function ProfilePage({ params }: PageProps) {
  const { id } = await params;

  if (!id) return notFound();

  // Fetch profile data (now includes clerkId and role)
  const data = await getLandownerProfileData(id);

  if (!data) return notFound();

  // Fetch current user's role from database
  const { userId } = await auth();
  let currentUserRole: string | null = null;
  let currentUserId: string | null = null;
  
  if (userId) {
    const currentUser = await prisma.user.findUnique({
      where: { clerkUserId: userId },
      select: { 
        id: true,
        role: true 
      }
    });
    
    currentUserRole = currentUser?.role || null;
    currentUserId = currentUser?.id || null;
  }

  return (
    <div className="min-h-screen">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 sm:py-12 space-y-8 sm:space-y-12">
        <ProfileHeader 
          user={data.user} 
          currentUserRole={currentUserRole}
          currentUserId={currentUserId}
        />
        <StatsBar stats={data.stats} />
        <ListingsGrid listings={data.listings} />
      </div>  
    </div>
  );
}