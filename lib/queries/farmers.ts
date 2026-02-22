// lib/queries/farmers.ts

import { cache } from "react";
import { prisma } from "@/lib/prisma";

import type {
  User,
  FarmerProfile,
  ApplicationStatus,
  LeaseStatus,
  BidStatus,
  PaymentStatus,
} from "@prisma/client";

//////////////////////////////////////////////////////////////
// TYPES
//////////////////////////////////////////////////////////////

export type FarmerUser = User & {
  farmerProfile: FarmerProfile | null;
};

export type FarmerStats = {
  activeApplications: number;
  activeLeases: number;
  recommendedLands: number;
  upcomingPayments: number;
  savedListings: number;
};

export type ActivityType =
  | "application"
  | "lease"
  | "bid"
  | "payment";

export type Activity = {
  id: string;
  type: ActivityType;
  title: string;
  description: string;
  status:
    | ApplicationStatus
    | LeaseStatus
    | BidStatus
    | PaymentStatus;
  timestamp: Date;
};

//////////////////////////////////////////////////////////////
// DASHBOARD DATA
//////////////////////////////////////////////////////////////

export const getFarmerDashboardData = cache(
  async (
    clerkUserId: string
  ): Promise<{
    user: FarmerUser;
    stats: FarmerStats;
  } | null> => {

    //////////////////////////////////////////////////////////
    // Get user
    //////////////////////////////////////////////////////////

    const user = await prisma.user.findUnique({
      where: { clerkUserId },
      include: {
        farmerProfile: true,
      },
    });

    if (!user) return null;

    //////////////////////////////////////////////////////////
    // Get stats
    //////////////////////////////////////////////////////////

    const [
      activeApplications,
      activeLeases,
      savedListingsCount,
      upcomingPayments,
    ] = await Promise.all([
      prisma.application.count({
        where: { farmerId: user.id },
      }),

      prisma.lease.count({
        where: { farmerId: user.id },
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

    //////////////////////////////////////////////////////////
    // Return FULL FarmerStats object (FIXED)
    //////////////////////////////////////////////////////////

    return {
      user,

      stats: {
        activeApplications,
        activeLeases,

        // recommended lands can reuse saved listings
        recommendedLands: savedListingsCount,

        upcomingPayments,

        // REQUIRED FIELD — FIXED
        savedListings: savedListingsCount,
      },
    };
  }
);

//////////////////////////////////////////////////////////////
// ACTIVITY FEED
//////////////////////////////////////////////////////////////

export const getFarmerActivityFeed = cache(
  async (clerkUserId: string): Promise<Activity[]> => {

    const user = await prisma.user.findUnique({
      where: { clerkUserId },
    });

    if (!user) return [];

    //////////////////////////////////////////////////////////
    // Fetch activity sources
    //////////////////////////////////////////////////////////

    const [
      applications,
      leases,
      bids,
      payments,
    ] = await Promise.all([
      prisma.application.findMany({
        where: { farmerId: user.id },
        include: { land: true },
        orderBy: { createdAt: "desc" },
        take: 3,
      }),

      prisma.lease.findMany({
        where: { farmerId: user.id },
        include: { land: true },
        orderBy: { createdAt: "desc" },
        take: 3,
      }),

      prisma.bid.findMany({
        where: { farmerId: user.id },
        include: {
          listing: {
            include: { land: true },
          },
        },
        orderBy: { createdAt: "desc" },
        take: 3,
      }),

      prisma.payment.findMany({
        where: { userId: user.id },
        orderBy: { createdAt: "desc" },
        take: 3,
      }),
    ]);

    //////////////////////////////////////////////////////////
    // Build Activity Array
    //////////////////////////////////////////////////////////

const activities: Activity[] = [

  ...applications.map(
    (app): Activity => ({
      id: `app-${app.id}`,
      type: "application", // now correctly inferred
      title: `Application for ${app.land.title}`,
      description: `Applied in ${
        app.land.village ?? "your area"
      }`,
      status: app.status,
      timestamp: app.createdAt,
    })
  ),

  ...leases.map(
    (lease): Activity => ({
      id: `lease-${lease.id}`,
      type: "lease",
      title: `Lease for ${lease.land.title}`,
      description: `Lease is ${lease.status.toLowerCase()}`,
      status: lease.status,
      timestamp: lease.createdAt,
    })
  ),

  ...bids.map(
    (bid): Activity => ({
      id: `bid-${bid.id}`,
      type: "bid",
      title: `Bid ₹${bid.amount}`,
      description: `Bid placed`,
      status: bid.status,
      timestamp: bid.createdAt,
    })
  ),

  ...payments.map(
    (payment): Activity => ({
      id: `payment-${payment.id}`,
      type: "payment",
      title: `Payment ₹${payment.amount}`,
      description: `Payment recorded`,
      status: payment.status,
      timestamp: payment.createdAt,
    })
  ),

];


    //////////////////////////////////////////////////////////
    // Sort newest first
    //////////////////////////////////////////////////////////

    return activities
      .sort(
        (a, b) =>
          b.timestamp.getTime() -
          a.timestamp.getTime()
      )
      .slice(0, 8);
  }
);