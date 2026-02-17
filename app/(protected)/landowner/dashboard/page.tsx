  // app/(protected)/landowner/dashboard/page.tsx

  import { auth } from "@clerk/nextjs/server";
  import { redirect } from "next/navigation";
  import { Suspense } from "react";
  import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
  import { Button } from "@/components/ui/button";

  import { Plus, Download, ArrowUpRight, LandPlot } from "lucide-react";

  import { getLandownerDashboardData } from "@/lib/queries/landowner";

  import { StatsCards } from "./_components/StatsCards";
  import { RevenueChart } from "./_components/RevenueChart";
  import { LandsTable } from "./_components/LandsTable";
  import { RecentApplications } from "./_components/RecentApplications";
  import { ActivityFeed } from "./_components/ActivityFeed";
  import { QuickActions } from "./_components/QuickActions";

  function DashboardSkeleton() {
    return (
      <div className="space-y-6">
        <div className="h-10 w-72 bg-muted animate-pulse rounded-lg" />

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-36 bg-muted animate-pulse rounded-xl" />
          ))}
        </div>

        <div className="h-[400px] bg-muted animate-pulse rounded-xl" />
      </div>
    );
  }

  export default async function LandownerDashboardPage() {
    const { userId } = await auth();

    if (!userId) redirect("/sign-in");

    const data = await getLandownerDashboardData(userId);

    if (!data) redirect("/onboarding/landowner");

    const { user, stats, lands, applications, revenueTrend, recentActivities } =
      data;

    return (
      <div className="min-h-screen mt-18 bg-background relative">
        <main className="max-w-7xl mx-auto px-6 py-10">
          {/* HERO HEADER */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6 mb-10">
            <div>
              <h1 className="text-4xl font-bold tracking-tight">
                Welcome back, {user.name}
              </h1>

              <p className="text-muted-foreground mt-2">
                Manage your agricultural lands, monitor revenue, and track
                applications.
              </p>
            </div>

            {/* ACTION BUTTONS */}
            <div className="flex items-center gap-3">
              <Button variant="outline" className="gap-2 shadow-sm">
                <Download className="w-4 h-4" />
                Export
              </Button>

              <Button className="gap-2 shadow-lg shadow-emerald-500/20">
                <Plus className="w-4 h-4" />
                Add Land
              </Button>
            </div>
          </div>

          {/* STATS */}
          <Suspense fallback={<DashboardSkeleton />}>
            <StatsCards stats={stats} />
          </Suspense>

          {/* TABS */}
          <Tabs defaultValue="overview" className="mt-10">
            {/* TAB NAV */}
            <TabsList className="bg-muted/50 backdrop-blur border rounded-xl p-1">
              <TabsTrigger value="overview">Overview</TabsTrigger>

              <TabsTrigger value="lands">My Lands</TabsTrigger>

              <TabsTrigger value="applications">Applications</TabsTrigger>

              <TabsTrigger value="leases">Active Leases</TabsTrigger>
            </TabsList>

            {/* OVERVIEW */}
            <TabsContent value="overview" className="mt-6 space-y-6">
              <div className="grid gap-6 lg:grid-cols-3">
                {/* CHART */}
                <div className="lg:col-span-2 rounded-xl border bg-card/60 backdrop-blur p-6 shadow-sm">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-semibold text-lg">Revenue Trend</h3>

                    <ArrowUpRight className="w-4 h-4 text-muted-foreground" />
                  </div>

                  <RevenueChart data={revenueTrend} />
                </div>

                {/* QUICK ACTIONS */}
                <div className="rounded-xl border bg-card/60 backdrop-blur p-6 shadow-sm">
                  <QuickActions />
                </div>
              </div>

              {/* LOWER SECTION */}
              <div className="grid gap-6 lg:grid-cols-2">
                <div className="rounded-xl border bg-card/60 backdrop-blur p-6 shadow-sm">
                  <RecentApplications applications={applications.slice(0, 5)} />
                </div>

                <div className="rounded-xl border bg-card/60 backdrop-blur p-6 shadow-sm">
                  <ActivityFeed activities={recentActivities} />
                </div>
              </div>
            </TabsContent>

            {/* LANDS */}
            <TabsContent value="lands" className="mt-6">
              <div className="rounded-xl border bg-card/60 backdrop-blur p-6 shadow-sm">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-2">
                    <LandPlot className="w-5 h-5 text-emerald-600" />
                    <h3 className="font-semibold text-lg">Your Lands</h3>
                  </div>

                  <Button size="sm" className="gap-2">
                    <Plus className="w-4 h-4" />
                    Add Land
                  </Button>
                </div>

                <LandsTable lands={lands} />
              </div>
            </TabsContent>

            {/* APPLICATIONS */}
            <TabsContent value="applications" className="mt-6">
              <div className="rounded-xl border bg-card/60 backdrop-blur p-6 shadow-sm">
                <RecentApplications applications={applications} />
              </div>
            </TabsContent>

            {/* LEASES */}
            <TabsContent value="leases" className="mt-6">
              <div className="rounded-xl border bg-card/60 backdrop-blur p-10 shadow-sm text-center">
                <h3 className="text-xl font-semibold mb-2">Active Leases</h3>

                <p className="text-muted-foreground">
                  You currently have{" "}
                  <span className="font-semibold text-foreground">
                    {stats.activeLeases}
                  </span>{" "}
                  active lease
                  {stats.activeLeases !== 1 ? "s" : ""}
                </p>
              </div>
            </TabsContent>
          </Tabs>
        </main>
      </div>
    );
  }
