import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { Suspense } from "react";

export const dynamic = "force-dynamic";

import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { getLandownerDashboardData } from "@/lib/queries/landowner";

import { DashboardHeroHeader } from "./_components/DashboardHeroHeader";
import { StatsCards } from "./_components/StatsCards";
import { RevenueChart } from "./_components/RevenueChart";
import { LandsTable } from "./_components/LandsTable";
import { QuickActions } from "./_components/QuickActions";
import { CapsuleTabs } from "./_components/CapsuleTabs";

import { ApplicationsSection } from "./_server/ApplicationsSection";
import { ActivitySection } from "./_server/ActivitySection";

import { ErrorBoundary } from "@/components/shared/ErrorBoundary";
import Link from "next/link";
import Image from "next/image";

type Props = {
  searchParams: Promise<{ tab?: string; page?: string }>;
};

export default async function LandownerDashboardPage({ searchParams }: Props) {
  const { userId } = await auth();
  if (!userId) redirect("/sign-in");

  // Next 15 safe param unwrap
  const params = await searchParams;
  const page = Math.max(1, Number(params?.page ?? "1"));

  // single optimized server fetch
  const data = await getLandownerDashboardData(userId, page);

  if (!data) redirect("/onboarding/landowner");

  const { user, stats, lands, totalLands, revenueTrend } = data;

  return (
    <div className="min-h-screen bg-white dark:bg-gray-950">
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
        {/* HERO */}
        <DashboardHeroHeader name={user.name} />

        {/* STATS */}
        <ErrorBoundary fallback={<StatsErrorFallback />}>
          <StatsCards stats={stats} />
        </ErrorBoundary>

        {/* TABS */}
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

            {/* STREAM HEAVY */}
            <div className="grid gap-6 lg:grid-cols-2">
              <Suspense fallback={<SectionSkeleton />}>
                <ApplicationsSection userId={userId} />
              </Suspense>

              <Suspense fallback={<SectionSkeleton />}>
                <ActivitySection userId={userId} />
              </Suspense>
            </div>
          </div>

          {/* LANDS */}
          <div id="lands" className="hidden">
            <div className="rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 shadow-sm">
              <div className="p-6 border-b border-gray-200 dark:border-gray-800 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="relative w-7 h-7">
                    <Image
                      src="/onboarding/landreq.png"
                      alt="Lands"
                      fill
                      className="object-contain"
                    />
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
                    className="rounded-full px-4 gap-2 bg-[#b7cf8a]"
                  >
                    <Plus className="w-4 h-4" />
                    Add Land
                  </Button>
                </Link>
              </div>

              <div className="p-6">
                <ErrorBoundary fallback={<TableErrorFallback />}>
                  <LandsTable
                    lands={lands}
                    total={totalLands}
                    page={page}
                  />
                </ErrorBoundary>
              </div>
            </div>
          </div>

          {/* APPLICATIONS */}
          <div id="applications" className="hidden">
            <div className="rounded-xl border bg-white dark:bg-gray-900 shadow-sm">
              <div className="p-6 border-b flex items-center gap-3">
                <div className="relative w-7 h-7">
                  <Image
                    src="/onboarding/review.png"
                    alt="Applications"
                    fill
                    className="object-contain"
                  />
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

              <div className="p-6">
                <ApplicationsSection userId={userId} />
              </div>
            </div>
          </div>

          {/* LEASES */}
          <div id="leases" className="hidden">
            <div className="rounded-xl border bg-white dark:bg-gray-900 shadow-sm">
              <div className="p-6 border-b">
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
                  <p className="text-muted-foreground">
                    No active leases yet
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

/* ================= SKELETON ================= */

function SectionSkeleton() {
  return (
    <div className="h-48 rounded-xl bg-gray-100 dark:bg-gray-900 animate-pulse" />
  );
}

/* ================= FALLBACKS ================= */

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

function ErrorBox({ text }: { text: string }) {
  return (
    <div className="p-8 text-center bg-red-50 dark:bg-red-900/10 rounded-xl border">
      <p className="text-red-600 dark:text-red-400">{text}</p>
    </div>
  );
}