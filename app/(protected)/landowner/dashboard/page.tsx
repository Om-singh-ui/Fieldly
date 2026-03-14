import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

export const dynamic = "force-dynamic"; // ✅ REAL TIME DATA (CRITICAL)

import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { getLandownerDashboardData } from "@/lib/queries/landowner";

import { DashboardHeroHeader } from "./_components/DashboardHeroHeader";
import { StatsCards } from "./_components/StatsCards";
import { RevenueChart } from "./_components/RevenueChart";
import { LandsTable } from "./_components/LandsTable";
import { RecentApplications } from "./_components/RecentApplications";
import { ActivityFeed } from "./_components/ActivityFeed";
import { QuickActions } from "./_components/QuickActions";
import { CapsuleTabs } from "./_components/CapsuleTabs";

import { ErrorBoundary } from "@/components/shared/ErrorBoundary";
import Link from "next/link";
import Image from "next/image";

export default async function LandownerDashboardPage() {
  const { userId } = await auth();

  if (!userId) redirect("/sign-in");

  const data = await getLandownerDashboardData(userId);

  if (!data) redirect("/onboarding/landowner");

  const { user, stats, lands, applications, revenueTrend, recentActivities } =
    data;

  return (
    <div className="min-h-screen bg-white dark:bg-gray-950">
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
        {/* HERO */}
        <DashboardHeroHeader name={user.name} />

        {/* STATS */}
        <ErrorBoundary fallback={<StatsErrorFallback />}>
          <StatsCards stats={stats} />
        </ErrorBoundary>

        {/* CAPSULE TABS */}
        <CapsuleTabs stats={stats} />

        <div className="mt-8">
          {/* OVERVIEW */}
          <div id="overview" className="space-y-8">
            <div className="grid gap-6 lg:grid-cols-3">
              <div className="lg:col-span-2">
                <ErrorBoundary fallback={<ChartErrorFallback />}>
                  <RevenueChart data={revenueTrend} />
                </ErrorBoundary>
              </div>

              <div>
                <ErrorBoundary fallback={<QuickActionsErrorFallback />}>
                  <QuickActions />
                </ErrorBoundary>
              </div>
            </div>

            <div className="grid gap-6 lg:grid-cols-2">
              <ErrorBoundary fallback={<ApplicationsErrorFallback />}>
                <RecentApplications applications={applications.slice(0, 5)} />
              </ErrorBoundary>

              <ErrorBoundary fallback={<ActivityErrorFallback />}>
                <ActivityFeed activities={recentActivities} />
              </ErrorBoundary>
            </div>
          </div>

          {/* LANDS */}
          <div id="lands" className="hidden">
            <div className="rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 shadow-sm">
              <div className="p-6 border-b border-gray-200 dark:border-gray-800">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2.5 rounded-xl">
                      <div className="relative w-7 h-7">
                        <Image
                          src="/onboarding/landreq.png"
                          alt="Lands"
                          fill
                          className="object-contain"
                        />
                      </div>
                    </div>

                    <div>
                      <h3 className="font-semibold text-gray-900 dark:text-white">
                        Your Lands
                      </h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        Manage and monitor your property portfolio
                      </p>
                    </div>
                  </div>

                  <Link href="/landowner/land/new">
                    <Button
                      size="sm"
                      className="
                        gap-2
                        bg-[#b7cf8a]
                        hover:bg-[#a9c87a]
                        text-gray-900
                        font-medium
                        border border-[#a9c87a]
                        shadow-[0_4px_12px_rgba(0,0,0,0.08)]
                        hover:shadow-[0_10px_24px_rgba(0,0,0,0.14)]
                        transition-all duration-200
                        rounded-full
                        px-4
                      "
                    >
                      <Plus className="w-4 h-4" />
                      Add Land
                    </Button>
                  </Link>
                </div>
              </div>

              <div className="p-6">
                <ErrorBoundary fallback={<TableErrorFallback />}>
                  <LandsTable lands={lands} />
                </ErrorBoundary>
              </div>
            </div>
          </div>

          {/* APPLICATIONS */}
          <div id="applications" className="hidden">
            <div className="rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 shadow-sm">
              <div className="p-6 border-b border-gray-200 dark:border-gray-800">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 rounded-xl">
                    <div className="relative w-7 h-7">
                      <Image
                        src="/onboarding/review.png"
                        alt="Applications"
                        fill
                        className="object-contain"
                      />
                    </div>
                  </div>

                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-white">
                      All Applications
                    </h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Review and manage all land applications
                    </p>
                  </div>
                </div>
              </div>

              <div className="p-6">
                <ErrorBoundary fallback={<ApplicationsErrorFallback />}>
                  <RecentApplications applications={applications} />
                </ErrorBoundary>
              </div>
            </div>
          </div>

          {/* LEASES */}
          <div id="leases" className="hidden">
            <div className="rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 shadow-sm">
              <div className="p-6 border-b border-gray-200 dark:border-gray-800">
                <h3 className="font-semibold text-gray-900 dark:text-white">
                  Active Leases
                </h3>
              </div>

              <div className="p-10 text-center">
                {stats.activeLeases > 0 ? (
                  <Link href="/landowner/leases">
                    <Button variant="outline" className="rounded-full">
                      View All Leases
                    </Button>
                  </Link>
                ) : (
                  <p className="text-muted-foreground">No active leases yet</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

/* ERROR FALLBACKS */

function StatsErrorFallback() {
  return <ErrorBox text="Failed to load statistics" />;
}
function ChartErrorFallback() {
  return <ErrorBox text="Failed to load revenue chart" />;
}
function TableErrorFallback() {
  return <ErrorBox text="Failed to load lands data" />;
}
function QuickActionsErrorFallback() {
  return <ErrorBox text="Quick Actions unavailable" />;
}
function ApplicationsErrorFallback() {
  return <ErrorBox text="Failed to load applications" />;
}
function ActivityErrorFallback() {
  return <ErrorBox text="Failed to load activity feed" />;
}

function ErrorBox({ text }: { text: string }) {
  return (
    <div className="p-8 text-center bg-red-50 dark:bg-red-900/10 rounded-xl border border-red-100 dark:border-red-900/20">
      <p className="text-red-600 dark:text-red-400">{text}</p>
    </div>
  );
}