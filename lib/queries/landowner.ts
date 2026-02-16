// lib/queries/landowner.ts
import { prisma } from "@/lib/prisma";
import { cache } from "react";

export interface DashboardStats {
  totalLands: number;
  activeLeases: number;
  pendingApplications: number;
  monthlyRevenue: number;
  totalRevenue: number;
  leasedArea: number;
  availableArea: number;
  averageLeaseDuration: number;
}

export interface LandWithDetails {
  id: string;
  title: string;
  size: number;
  landType: string;
  status: string;
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

export interface ApplicationWithFarmer {
  id: string;
  proposedRent: number | null;
  duration: number;
  status: string;
  createdAt: Date;
  farmer: {
    name: string;
    imageUrl: string | null;
    farmerProfile: {
      farmingType: string;
      farmingExperience: number;
    } | null;
  };
}

export const getLandownerDashboardData = cache(async (userId: string) => {
  const user = await prisma.user.findUnique({
    where: { clerkUserId: userId },
    include: {
      landownerProfile: {
        include: {
          lands: {
            include: {
              applications: {
                where: { status: { in: ["PENDING", "APPROVED"] } },
                include: {
                  farmer: {
                    include: {
                      farmerProfile: true
                    }
                  }
                },
                orderBy: { createdAt: 'desc' }
              },
              leases: {
                where: { status: "ACTIVE" },
                include: {
                  farmer: true
                }
              },
              _count: {
                select: { applications: true }
              }
            }
          }
        }
      }
    }
  });

  if (!user?.landownerProfile) return null;

  const profile = user.landownerProfile;
  const lands = profile.lands;

  // Calculate comprehensive stats
  const stats: DashboardStats = {
    totalLands: lands.length,
    activeLeases: lands.filter(l => l.leases.length > 0).length,
    pendingApplications: lands.reduce((acc, l) => 
      acc + l.applications.filter(a => a.status === "PENDING").length, 0
    ),
    monthlyRevenue: lands.reduce((acc, l) => {
      if (l.leases[0]) {
        return acc + (l.leases[0].rent / 12); // Assuming annual rent
      }
      return acc;
    }, 0),
    totalRevenue: lands.reduce((acc, l) => {
      if (l.leases[0]) {
        return acc + l.leases[0].rent;
      }
      return acc;
    }, 0),
    leasedArea: lands.reduce((acc, l) => 
      l.leases.length > 0 ? acc + l.size : acc, 0
    ),
    availableArea: lands.reduce((acc, l) => 
      l.leases.length === 0 ? acc + l.size : acc, 0
    ),
    averageLeaseDuration: lands.reduce((acc, l) => {
      if (l.leases[0]) {
        const duration = Math.ceil(
          (l.leases[0].endDate.getTime() - l.leases[0].startDate.getTime()) / 
          (1000 * 60 * 60 * 24 * 30)
        );
        return acc + duration;
      }
      return acc;
    }, 0) / (lands.filter(l => l.leases.length > 0).length || 1)
  };

  // Get all applications
  const applications: ApplicationWithFarmer[] = lands
    .flatMap(l => l.applications)
    .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());

  // Get lands with details
  const landsWithDetails: LandWithDetails[] = lands.map(land => ({
    id: land.id,
    title: land.title,
    size: land.size,
    landType: land.landType,
    status: land.leases.length > 0 ? "LEASED" : "AVAILABLE",
    location: land.village || "Location not specified",
    expectedRentMin: land.expectedRentMin,
    expectedRentMax: land.expectedRentMax,
    applicationsCount: land._count.applications,
    activeLease: land.leases[0] ? {
      id: land.leases[0].id,
      farmerName: land.leases[0].farmer.name,
      rent: land.leases[0].rent,
      startDate: land.leases[0].startDate,
      endDate: land.leases[0].endDate
    } : null,
    createdAt: land.createdAt
  }));

  // Calculate monthly revenue trend for chart
  const revenueTrend = await calculateRevenueTrend(profile.id);
  
  // Get recent activities
  const recentActivities = await getRecentActivities(profile.id);

  return {
    user,
    profile,
    stats,
    lands: landsWithDetails,
    applications,
    revenueTrend,
    recentActivities
  };
});

async function calculateRevenueTrend(landownerId: string) {
  const sixMonthsAgo = new Date();
  sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

  const leases = await prisma.lease.findMany({
    where: {
      ownerId: landownerId,
      status: "ACTIVE",
      startDate: { gte: sixMonthsAgo }
    },
    include: { payments: true }
  });

  // Group by month
  const monthlyData = Array.from({ length: 6 }, (_, i) => {
    const date = new Date();
    date.setMonth(date.getMonth() - i);
    const monthName = date.toLocaleString('default', { month: 'short' });
    
    const monthLeases = leases.filter(l => 
      l.startDate.getMonth() === date.getMonth() &&
      l.startDate.getFullYear() === date.getFullYear()
    );

    const revenue = monthLeases.reduce((acc, l) => acc + l.rent, 0);
    
    return {
      month: monthName,
      revenue
    };
  }).reverse();

  return monthlyData;
}

async function getRecentActivities(landownerId: string) {
  const activities = await prisma.$transaction([
    // New applications
    prisma.application.findMany({
      where: { land: { landownerId } },
      orderBy: { createdAt: 'desc' },
      take: 5,
      include: {
        farmer: true,
        land: { select: { title: true } }
      }
    }),
    // New leases
    prisma.lease.findMany({
      where: { ownerId: landownerId },
      orderBy: { createdAt: 'desc' },
      take: 5,
      include: {
        farmer: true,
        land: { select: { title: true } }
      }
    }),
    // New payments
    prisma.payment.findMany({
      where: { lease: { ownerId: landownerId } },
      orderBy: { createdAt: 'desc' },
      take: 5,
      include: {
        user: true,
        lease: { include: { land: { select: { title: true } } } }
      }
    })
  ]);

  return [
    ...activities[0].map(a => ({
      type: 'application' as const,
      id: a.id,
      message: `New application from ${a.farmer.name} for ${a.land.title}`,
      timestamp: a.createdAt,
      status: a.status
    })),
    ...activities[1].map(l => ({
      type: 'lease' as const,
      id: l.id,
      message: `New lease started with ${l.farmer.name} for ${l.land.title}`,
      timestamp: l.createdAt,
      amount: l.rent
    })),
    ...activities[2].map(p => ({
      type: 'payment' as const,
      id: p.id,
      message: `Payment of ₹${p.amount} received from ${p.user.name}`,
      timestamp: p.createdAt,
      amount: p.amount
    }))
  ].sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
   .slice(0, 10);
}