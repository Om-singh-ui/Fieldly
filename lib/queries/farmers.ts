import { cache } from "react";
import { prisma } from "@/lib/prisma";

import type {
  ApplicationStatus,
  LeaseStatus,
  BidStatus,
  PaymentStatus,
} from "@prisma/client";

//////////////////////////////////////////////////////////////
// TYPES
//////////////////////////////////////////////////////////////

export type FarmerStats = {
  activeApplications: number;
  activeLeases: number;
  recommendedLands: number;
  upcomingPayments: number;
  savedListings: number;
};

export type ActivityType = "application" | "lease" | "bid" | "payment";

export type Activity = {
  id: string;
  type: ActivityType;
  title: string;
  description: string;
  status: ApplicationStatus | LeaseStatus | BidStatus | PaymentStatus;
  timestamp: Date;
};

//////////////////////////////////////////////////////////////
// DASHBOARD DATA (OPTIMIZED)
//////////////////////////////////////////////////////////////

export const getFarmerDashboardData = cache(async (clerkUserId: string) => {
  const user = await prisma.user.findUnique({
    where: { clerkUserId },
    select: {
      id: true,
      name: true,
      farmerProfile: true,
    },
  });

  if (!user) return null;

  const [
    applicationsCount,
    leasesCount,
    savedListingsCount,
    pendingPaymentsCount,
  ] = await Promise.all([
    prisma.application.count({
      where: {
        farmerId: user.id,
        status: { not: "REJECTED" }, // ⭐ index friendly
      },
    }),

    prisma.lease.count({
      where: {
        farmerId: user.id,
        status: { in: ["ACTIVE"] },
      },
    }),

    prisma.savedListing.count({
      where: { userId: user.id },
    }),

    prisma.payment.count({
      where: {
        userId: user.id,
        status: "PENDING",
      },
    }),
  ]);

  return {
    user,

    stats: {
      activeApplications: applicationsCount,
      activeLeases: leasesCount,
      recommendedLands: savedListingsCount,
      upcomingPayments: pendingPaymentsCount,
      savedListings: savedListingsCount,
    },
  };
});

//////////////////////////////////////////////////////////////
// ACTIVITY FEED (OPTIMIZED)
//////////////////////////////////////////////////////////////

export const getFarmerActivityFeed = cache(
  async (clerkUserId: string): Promise<Activity[]> => {
    const user = await prisma.user.findUnique({
      where: { clerkUserId },
      select: { id: true },
    });

    if (!user) return [];

    const [applications, leases, bids, payments] = await Promise.all([
      prisma.application.findMany({
        where: { farmerId: user.id },
        select: {
          id: true,
          status: true,
          createdAt: true,
          land: {
            select: { title: true, village: true },
          },
        },
        orderBy: { createdAt: "desc" },
        take: 2,
      }),

      prisma.lease.findMany({
        where: { farmerId: user.id },
        select: {
          id: true,
          status: true,
          createdAt: true,
          land: {
            select: { title: true },
          },
        },
        orderBy: { createdAt: "desc" },
        take: 2,
      }),

      prisma.bid.findMany({
        where: { farmerId: user.id },
        select: {
          id: true,
          amount: true,
          status: true,
          createdAt: true,
        },
        orderBy: { createdAt: "desc" },
        take: 2,
      }),

      prisma.payment.findMany({
        where: { userId: user.id },
        select: {
          id: true,
          amount: true,
          status: true,
          createdAt: true,
        },
        orderBy: { createdAt: "desc" },
        take: 2,
      }),
    ]);

    const activities: Activity[] = [
      ...applications.map(
        (app): Activity => ({
          id: `app-${app.id}`,
          type: "application",
          title: `Application for ${app.land.title}`,
          description: `Applied in ${app.land.village ?? "your area"}`,
          status: app.status,
          timestamp: app.createdAt,
        }),
      ),

      ...leases.map(
        (lease): Activity => ({
          id: `lease-${lease.id}`,
          type: "lease",
          title: `Lease for ${lease.land.title}`,
          description: `Lease is ${lease.status.toLowerCase()}`,
          status: lease.status,
          timestamp: lease.createdAt,
        }),
      ),

      ...bids.map(
        (bid): Activity => ({
          id: `bid-${bid.id}`,
          type: "bid",
          title: `Bid ₹${bid.amount}`,
          description: `Bid placed`,
          status: bid.status,
          timestamp: bid.createdAt,
        }),
      ),

      ...payments.map(
        (p): Activity => ({
          id: `payment-${p.id}`,
          type: "payment",
          title: `Payment ₹${p.amount}`,
          description: `Payment recorded`,
          status: p.status,
          timestamp: p.createdAt,
        }),
      ),
    ];

    return activities
      .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
      .slice(0, 6);
  },
);
