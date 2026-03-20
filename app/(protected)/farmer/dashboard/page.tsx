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

  // HARD TYPE NARROWING (IMPORTANT)
  if (!dashboard) {
    redirect("/onboarding/farmer");
  }

  if (!dashboard.user?.farmerProfile) {
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
    <div className="min-h-screen bg-gradient-to-b from-muted/30 via-background to-background">
      <section className="relative pt-24 md:pt-28 lg:pt-32 pb-8">
        <div className="relative max-w-7xl mx-auto px-6">
          <DashboardHeroHeader name={dashboard.user.name} />
        </div>
      </section>

      <main className="relative max-w-7xl mx-auto px-6 pb-16 space-y-8">
        <FarmerStatsGrid stats={stats} />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <FarmerProfileCard profile={dashboard.user.farmerProfile} />
          <FarmerQuickActions />
        </div>

        <FarmerRecentActivity activities={activities} />
      </main>
    </div>
  );
}