// app/(protected)/landowner/dashboard/page.tsx
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { cache } from "react";
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
import { ErrorBoundary } from "@/components/shared/ErrorBoundary";
import Link from "next/link";
import { CapsuleTabs } from "./_components/CapsuleTabs";
import Image from "next/image";

// Cache the data fetching function
const getCachedDashboardData = cache(async (userId: string) => {
  return getLandownerDashboardData(userId);
});

export default async function LandownerDashboardPage() {
  const { userId } = await auth();
  if (!userId) redirect("/sign-in");

  const data = await getCachedDashboardData(userId);
  if (!data) redirect("/onboarding/landowner");

  const { user, stats, lands, applications, revenueTrend, recentActivities } =
    data;

  return (
    <div className="min-h-screen bg-white dark:bg-gray-950">
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
        {/* Hero Header */}
        <DashboardHeroHeader name={user.name} />

        {/* Stats Cards */}
        <ErrorBoundary fallback={<StatsErrorFallback />}>
          <StatsCards stats={stats} />
        </ErrorBoundary>

        {/* Capsule Tabs with Images */}
        <CapsuleTabs stats={stats} />

        {/* Tab Content Sections */}
        <div className="mt-8">
          {/* Overview Section */}
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

          {/* Lands Section */}
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
                  <Link href="/landowner/lands/new">
                    <Button 
                      size="sm" 
                      className="gap-2 bg-[#b7cf8a] hover:bg-[#a9c87a] text-gray-900 font-medium border-0 shadow-sm transition-all duration-200 hover:shadow-md rounded-full"
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

          {/* Applications Section */}
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

          {/* Leases Section */}
          <div id="leases" className="hidden">
            <div className="rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 shadow-sm">
              <div className="p-6 border-b border-gray-200 dark:border-gray-800">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 rounded-xl">
                    <div className="relative w-7 h-7">
                      <Image
                        src="/onboarding/user-man-account-person.png"
                        alt="Leases"
                        fill
                        className="object-contain"
                      />
                    </div>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-white">
                      Active Leases
                    </h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      You currently have{" "}
                      <span className="font-medium text-[#b7cf8a]">
                        {stats.activeLeases}
                      </span>{" "}
                      active lease{stats.activeLeases !== 1 ? "s" : ""}
                    </p>
                  </div>
                </div>
              </div>
              <div className="p-10 text-center">
                {stats.activeLeases > 0 ? (
                  <div className="space-y-4">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-[#b7cf8a]/10 mb-4">
                      <div className="relative w-8 h-8">
                        <Image
                          src="/icons/leases-green.svg"
                          alt="Leases"
                          fill
                          className="object-contain"
                        />
                      </div>
                    </div>
                    <h4 className="text-lg font-semibold text-gray-900 dark:text-white">
                      Manage Your Active Leases
                    </h4>
                    <p className="text-gray-500 dark:text-gray-400 max-w-sm mx-auto">
                      View all your active leases, track payments, and manage lease agreements
                    </p>
                    <Link href="/landowner/leases">
                      <Button 
                        variant="outline"
                        className="mt-2 border-[#b7cf8a] text-[#b7cf8a] hover:bg-[#b7cf8a] hover:text-white transition-colors rounded-full"
                      >
                        View All Leases
                      </Button>
                    </Link>
                  </div>
                ) : (
                  <div className="py-12">
                    <div className="relative w-12 h-12 mx-auto mb-4 opacity-50">
                      <Image
                        src="/icons/leases-gray.svg"
                        alt="No Leases"
                        fill
                        className="object-contain"
                      />
                    </div>
                    <h4 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                      No Active Leases
                    </h4>
                    <p className="text-gray-500 dark:text-gray-400">
                      When your lands get applications approved, they&apos;ll appear here
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

// Error Fallback Components (keep these the same)
function StatsErrorFallback() {
  return (
    <div className="p-8 text-center bg-red-50 dark:bg-red-900/10 rounded-xl border border-red-100 dark:border-red-900/20">
      <p className="text-red-600 dark:text-red-400">Failed to load statistics</p>
    </div>
  );
}

function ChartErrorFallback() {
  return (
    <div className="p-8 text-center bg-red-50 dark:bg-red-900/10 rounded-xl border border-red-100 dark:border-red-900/20">
      <p className="text-red-600 dark:text-red-400">Failed to load revenue chart</p>
    </div>
  );
}

function TableErrorFallback() {
  return (
    <div className="p-8 text-center bg-red-50 dark:bg-red-900/10 rounded-xl border border-red-100 dark:border-red-900/20">
      <p className="text-red-600 dark:text-red-400">Failed to load lands data</p>
    </div>
  );
}

function QuickActionsErrorFallback() {
  return (
    <div className="p-8 text-center bg-red-50 dark:bg-red-900/10 rounded-xl border border-red-100 dark:border-red-900/20">
      <p className="text-red-600 dark:text-red-400">Quick Actions unavailable</p>
    </div>
  );
}

function ApplicationsErrorFallback() {
  return (
    <div className="p-8 text-center bg-red-50 dark:bg-red-900/10 rounded-xl border border-red-100 dark:border-red-900/20">
      <p className="text-red-600 dark:text-red-400">Failed to load applications</p>
    </div>
  );
}

function ActivityErrorFallback() {
  return (
    <div className="p-8 text-center bg-red-50 dark:bg-red-900/10 rounded-xl border border-red-100 dark:border-red-900/20">
      <p className="text-red-600 dark:text-red-400">Failed to load activity feed</p>
    </div>
  );
}