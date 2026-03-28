"use server";

import { prisma } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { revalidateTag } from "next/cache";

/* ================= DELETE / ARCHIVE ================= */

export async function deleteOrArchiveLand(landId: string) {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  const user = await prisma.user.findUnique({
    where: { clerkUserId: userId },
    select: {
      id: true,
      landownerProfile: { select: { id: true } },
    },
  });

  if (!user?.landownerProfile) throw new Error("Forbidden");

  const land = await prisma.land.findUnique({
    where: { id: landId },
    include: {
      listings: { where: { status: "ACTIVE" } },
      leases: { where: { status: "ACTIVE" } },
    },
  });

  if (!land) throw new Error("Land not found");

  if (land.landownerId !== user.landownerProfile.id)
    throw new Error("Not owner");

  const unsafe =
    land.listings.length > 0 ||
    land.leases.length > 0;

  if (unsafe) {
    await prisma.land.update({
      where: { id: landId },
      data: {
        isArchived: true,
        isActive: false,
      },
    });
  } else {
    await prisma.land.delete({
      where: { id: landId },
    });
  }

  revalidateTag(`lands-${user.id}`, "max");
  revalidateTag(`land-${landId}`, "max");
}

/* ================= EDIT LAND ================= */

type UpdateData = {
  title?: string;
  description?: string | null;
  irrigationAvailable?: boolean;
  electricityAvailable?: boolean;
  roadAccess?: boolean;
  fencingAvailable?: boolean;
  editCount: { increment: number };
  lastEditedAt: Date;
};

export async function editLandAction(data: {
  id: string;
  title?: string;
  description?: string;
  irrigationAvailable?: boolean;
  electricityAvailable?: boolean;
  roadAccess?: boolean;
  fencingAvailable?: boolean;
}) {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  const user = await prisma.user.findUnique({
    where: { clerkUserId: userId },
    select: {
      id: true,
      landownerProfile: { select: { id: true } },
    },
  });

  if (!user?.landownerProfile) throw new Error("Forbidden");

  const land = await prisma.land.findUnique({
    where: { id: data.id },
    include: {
      listings: { where: { status: "ACTIVE" } },
    },
  });

  if (!land) throw new Error("Land not found");

  if (land.landownerId !== user.landownerProfile.id)
    throw new Error("Not owner");

  const listingActive = land.listings.length > 0;

  if (listingActive && land.editCount >= 3) {
    throw new Error("Edit limit reached. Close listing.");
  }

  /* ================= SAFE UPDATE BUILD ================= */

  const updateData: UpdateData = {
    editCount: { increment: 1 },
    lastEditedAt: new Date(),
  };

  if (data.title !== undefined) {
    updateData.title = data.title.trim();
  }

  if (data.description !== undefined) {
    //CRITICAL FIX
    updateData.description = data.description.trim() || null;
  }

  if (data.irrigationAvailable !== undefined) {
    updateData.irrigationAvailable = data.irrigationAvailable;
  }

  if (data.electricityAvailable !== undefined) {
    updateData.electricityAvailable = data.electricityAvailable;
  }

  if (data.roadAccess !== undefined) {
    updateData.roadAccess = data.roadAccess;
  }

  if (data.fencingAvailable !== undefined) {
    updateData.fencingAvailable = data.fencingAvailable;
  }

  /* ================= UPDATE ================= */

  await prisma.land.update({
    where: { id: data.id },
    data: updateData,
  });

  revalidateTag(`lands-${user.id}`, "max");
  revalidateTag(`land-${data.id}`, "max");
}