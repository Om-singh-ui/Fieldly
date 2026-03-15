import { prisma } from "@/lib/prisma";
import {
  RecentApplications,
  RecentApplication,
} from "../_components/RecentApplications";

export async function ApplicationsSection({
  userId,
}: {
  userId: string;
}) {
  const user = await prisma.user.findUnique({
    where: { clerkUserId: userId },
    select: { id: true },
  });

  if (!user) return null;

  const apps = await prisma.application.findMany({
    where: {
      land: { landownerId: user.id },
    },
    orderBy: { createdAt: "desc" },
    take: 5,
    select: {
      id: true,
      status: true,
      proposedRent: true,
      createdAt: true,
      farmer: {
        select: {
          name: true,
          imageUrl: true,
        },
      },
    },
  });

  const mapped: RecentApplication[] = apps.map((a) => ({
    id: a.id,
    farmerName: a.farmer.name,
    farmerImage: a.farmer.imageUrl,
    proposedRent: a.proposedRent,
    status: a.status as RecentApplication["status"],
    createdAt: a.createdAt.toISOString(),
  }));

  return <RecentApplications applications={mapped} />;
}