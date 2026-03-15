import { prisma } from "@/lib/prisma";
import { cache } from "react";

export interface LandWithDetails {
  id: string;
  title: string;
  size: number;
  landType: string;
  status: "LEASED" | "AVAILABLE";
  location: string;
  expectedRentMin: number | null;
  expectedRentMax: number | null;
  applicationsCount: number;
  activeLease: {
    id: string;
    farmerName: string;
    rent: number;
    startDate: Date;
    endDate: Date;
  } | null;
  createdAt: Date;
}

export const getLandownerDashboardData = cache(async (clerkId: string) => {
  /* ================= USER ================= */
  const user = await prisma.user.findUnique({
    where: { clerkUserId: clerkId },
    select: {
      id: true,
      name: true,
      landownerProfile: {
        select: { id: true },
      },
    },
  });

  if (!user?.landownerProfile) return null;

  const profileId = user.landownerProfile.id;
  const userId = user.id;

  /* ================= ALL LANDS (FOR STATS) ================= */
  const allLands = await prisma.land.findMany({
    where: {
      landownerId: profileId,
      isActive: true,
    },
    select: {
      id: true,
      size: true,
    },
  });

  /* ================= ACTIVE LEASES ================= */
  const activeLeases = await prisma.lease.findMany({
    where: {
      ownerId: userId,
      status: "ACTIVE",
    },
    select: {
      id: true,
      landId: true,
      rent: true,
    },
  });

  const leasedLandIds = new Set(activeLeases.map((l) => l.landId));

  /* ================= REAL AREA CALCULATION ================= */
  let leasedArea = 0;
  let availableArea = 0;

  for (const land of allLands) {
    if (leasedLandIds.has(land.id)) leasedArea += land.size;
    else availableArea += land.size;
  }

  /* ================= APPLICATION COUNT ================= */
  const pendingApplications = await prisma.application.count({
    where: {
      land: { landownerId: profileId },
      status: "PENDING",
    },
  });

  /* ================= REVENUE ================= */
  const revenueAgg = await prisma.payment.aggregate({
    where: {
      lease: { ownerId: userId },
      status: "SUCCESS",
    },
    _sum: { amount: true },
  });

  const totalRevenue = revenueAgg._sum.amount ?? 0;

  /* ================= STATS ================= */
  const stats = {
    totalLands: allLands.length,
    activeLeases: activeLeases.length,
    pendingApplications,
    monthlyRevenue: totalRevenue / 12,
    totalRevenue,
    leasedArea,
    availableArea,
    averageLeaseDuration: 8,
  };

  /* ================= LAND LIST (UI ONLY) ================= */
  const lands = await prisma.land.findMany({
    where: { landownerId: profileId },
    include: {
      _count: {
        select: { applications: true },
      },
      leases: {
        where: { status: "ACTIVE" },
        include: { farmer: true },
      },
    },
    orderBy: { createdAt: "desc" },
    take: 6,
  });

  const landsFormatted: LandWithDetails[] = lands.map((l) => ({
    id: l.id,
    title: l.title,
    size: l.size,
    landType: l.landType,
    status: l.leases.length > 0 ? "LEASED" : "AVAILABLE",
    location: l.village ?? "Location not specified",
    expectedRentMin: l.expectedRentMin,
    expectedRentMax: l.expectedRentMax,
    applicationsCount: l._count.applications,
    activeLease: l.leases[0]
      ? {
          id: l.leases[0].id,
          farmerName: l.leases[0].farmer.name,
          rent: l.leases[0].rent,
          startDate: l.leases[0].startDate,
          endDate: l.leases[0].endDate,
        }
      : null,
    createdAt: l.createdAt,
  }));

  /* ================= REVENUE TREND ================= */
  const revenueTrend = Array.from({ length: 6 })
    .map((_, i) => {
      const d = new Date();
      d.setMonth(d.getMonth() - i);

      return {
        month: d.toLocaleString("default", { month: "short" }),
        revenue: totalRevenue / 6,
      };
    })
    .reverse();

  return {
    user,
    stats,
    lands: landsFormatted,
    revenueTrend,
    recentActivities: [],
  };
});