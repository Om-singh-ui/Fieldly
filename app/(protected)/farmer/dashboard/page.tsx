// app/(protected)/farmer/dashboard/page.tsx

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

import { DashboardHeroHeader } from "./_components/DashboardHeroHeader";
import { FarmerStatsGrid } from "./_components/FarmerStatsGrid";
import { FarmerProfileCard } from "./_components/FarmerProfileCard";
import { FarmerQuickActions } from "./_components/FarmerQuickActions";
import { FarmerRecentActivity } from "./_components/FarmerRecentActivity";

import {
  getFarmerDashboardData,
  getFarmerActivityFeed,
} from "@/lib/queries/farmers";

export default async function FarmerDashboardPage() {
  /////////////////////////////////////////////////////////
  // AUTH
  /////////////////////////////////////////////////////////

  const { userId } = await auth();

  if (!userId) {
    redirect("/sign-in");
  }

  /////////////////////////////////////////////////////////
  // FETCH DASHBOARD DATA
  /////////////////////////////////////////////////////////

  const dashboard = await getFarmerDashboardData(userId);

  // Safety check (TypeScript + runtime safe)
  if (!dashboard || !dashboard.user || !dashboard.user.farmerProfile) {
    redirect("/onboarding/farmer");
  }

  /////////////////////////////////////////////////////////
  // FETCH ACTIVITY FEED
  /////////////////////////////////////////////////////////

  const activities = await getFarmerActivityFeed(userId);

  /////////////////////////////////////////////////////////
  // ENSURE stats contains savedListings (critical fix)
  /////////////////////////////////////////////////////////

  const stats = {
    activeApplications: dashboard.stats.activeApplications ?? 0,

    activeLeases: dashboard.stats.activeLeases ?? 0,

    recommendedLands: dashboard.stats.recommendedLands ?? 0,

    upcomingPayments: dashboard.stats.upcomingPayments ?? 0,

    savedListings: dashboard.stats.savedListings ?? 0,
  };

  /////////////////////////////////////////////////////////
  // UI
  /////////////////////////////////////////////////////////

  return (
    <div className="min-h-screen bg-gradient-to-b from-muted/30 via-background to-background">
      {/* HERO */}
      <section className="relative pt-24 md:pt-28 lg:pt-32 pb-8">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 left-1/3 w-[500px] h-[500px] blur-3xl rounded-full" />

          <div className="absolute top-0 right-1/3 w-[400px] h-[400px]  blur-3xl rounded-full" />
        </div>

        <div className="relative max-w-7xl mx-auto px-6">
          <DashboardHeroHeader name={dashboard.user.name} />
        </div>
      </section>

      {/* MAIN */}
      <main className="relative max-w-7xl mx-auto px-6 pb-16 space-y-8">
        {/* Stats Grid */}
        <FarmerStatsGrid stats={stats} />

        {/* Profile + Actions */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <FarmerProfileCard profile={dashboard.user.farmerProfile} />

          <FarmerQuickActions />
        </div>

        {/* Activity Feed */}
        <FarmerRecentActivity activities={activities} />
      </main>
    </div>
  );
}
