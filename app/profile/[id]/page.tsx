import { getLandownerProfileData } from "@/lib/queries/getLandownerProfileData";
import { notFound } from "next/navigation";

import { ProfileHeader } from "./_components/ProfileHeader";
import { StatsBar } from "./_components/StatsBar";
import { ListingsGrid } from "./_components/ListingsGrid";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function ProfilePage({ params }: PageProps) {
  const { id } = await params;

  if (!id) return notFound();

  const data = await getLandownerProfileData(id);

  if (!data) return notFound();

  return (
    <div className="min-h-screen">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 sm:py-12 space-y-8 sm:space-y-12">
        <ProfileHeader user={data.user} />
        <StatsBar stats={data.stats} />
        <ListingsGrid listings={data.listings} />
      </div>  
    </div>
  );
}