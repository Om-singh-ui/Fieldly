export const runtime = "nodejs";
export const dynamic = "force-dynamic";

import { redirect } from "next/navigation";
import { requireOnboardedUser } from "@/lib/server/dashboardGuard";

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
  const { userId } = await requireOnboardedUser();

  const [dashboard, activities] = await Promise.all([
    getFarmerDashboardData(userId),
    getFarmerActivityFeed(userId),
  ]);

  if (!dashboard || !dashboard.user?.farmerProfile) {
    redirect("/onboarding/farmer");
  }

  const stats = {
    activeApplications: dashboard.stats?.activeApplications ?? 0,
    activeLeases: dashboard.stats?.activeLeases ?? 0,
    recommendedLands: dashboard.stats?.recommendedLands ?? 0,
    upcomingPayments: dashboard.stats?.upcomingPayments ?? 0,
    savedListings: dashboard.stats?.savedListings ?? 0,
  };

  return (
    <div className="min-h-screen bg-white mt-14 dark:bg-black">
      {/* MAIN */}
      <main className="max-w-7xl mx-auto px-6 pb-20 space-y-10">
        {/* HERO */}
        <section className="pt-20 pb-6">
          <div className="max-w-7xl mx-auto px-6">
            <DashboardHeroHeader name={dashboard.user.name} />
          </div>
        </section>
        {/* STATS */}
        <section>
          <FarmerStatsGrid stats={stats} />
        </section>

        {/* PROFILE + ACTIONS */}
        <section className="grid grid-cols-1 xl:grid-cols-[1.15fr_0.85fr] gap-8 items-start">
          <FarmerProfileCard profile={dashboard.user.farmerProfile} />
          <FarmerQuickActions />
        </section>

        {/* ACTIVITY */}
        <section>
          <FarmerRecentActivity activities={activities} />
        </section>
      </main>
    </div>
  );
}
