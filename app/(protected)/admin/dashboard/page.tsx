// app/(protected)/admin/page.tsx
"use client";

import { useEffect, useState, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { StatsCard } from "../_components/StatsCard";
import { RecentActivity } from "../_components/RecentActivity";
import { SecurityAlert } from "../_components/SecurityAlert";
import {
  Users,
  Home,
  FileText,
  AlertTriangle,
  TrendingUp,
  Download,
  RefreshCw,
  DollarSign,
  Calendar,
  MapPin,
  Activity,
  Clock,
  CheckCircle,
  XCircle,
  Eye,
  Building,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import {
  AreaChart,
  Area,
  LineChart as RechartsLineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart as RechartsPieChart,
  Pie,
  Cell,
} from "recharts";

const COLORS = ["#b7cf8a", "#4ade80", "#fbbf24", "#f87171", "#a78bfa", "#60a5fa", "#34d399", "#f472b6"];
const CHART_COLORS = {
  primary: "#b7cf8a",
  secondary: "#4ade80",
  warning: "#fbbf24",
  danger: "#f87171",
  purple: "#a78bfa",
  blue: "#60a5fa",
};

// Type definitions
interface AdminStats {
  users: { total: number; trend?: number };
  listings: { total: number; active: number; trend?: number };
  applications: { pending: number; trend?: number };
  payments: { 
    total: number; 
    trend?: number;
    successful?: number;
    successfulAmount?: number;
    failed?: number;
    failedAmount?: number;
    pending?: number;
    pendingAmount?: number;
    refunded?: number;
    refundedAmount?: number;
  };
  disputes: { open: number; trend?: number };
  conversion: { rate: number; trend?: number };
}

interface AnalyticsData {
  userGrowth: Array<{ date: string; farmers: number; landowners: number; total: number }>;
  revenue: Array<{ month: string; revenue: number; platformFee: number }>;
  userDistribution: Array<{ name: string; value: number }>;
  listingStatus: Array<{ status: string; count: number; percentage: number }>;
  recentActivity: Array<{ id: string; type: string; user: string; action: string; timestamp: string }>;
  avgPricePerAcre?: number;
  userGrowthRate?: Array<{ date: string; farmers: number; landowners: number }>;
  topStates?: Array<{ state: string; users: number; percentage: number }>;
  topDistricts?: Array<{ district: string; users: number }>;
  engagement?: { avgSessionDuration: string; dau: number; wau: number; mau: number };
  revenueBreakdown?: Array<{ name: string; value: number }>;
  monthlyRevenue?: Array<{ month: string; amount: number }>;
  listingsByType?: Array<{ name: string; value: number }>;
  listingsByLandType?: Array<{ type: string; count: number }>;
  topListings?: Array<{ title: string; size: number; location: string; applications: number; views: number }>;
}

export default function AdminDashboardPage() {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  const [dateRange, setDateRange] = useState("last30days");
  const [activeTab, setActiveTab] = useState("overview");

  const fetchDashboardData = useCallback(async () => {
    setLoading(true);
    try {
      const [statsRes, analyticsRes] = await Promise.all([
        fetch("/api/admin/stats"),
        fetch(`/api/admin/analytics?range=${dateRange}`),
      ]);

      const statsData = await statsRes.json();
      const analyticsData = await analyticsRes.json();

      setStats(statsData);
      setAnalytics(analyticsData);
    } catch {
      toast.error("Failed to load dashboard data");
    } finally {
      setLoading(false);
    }
  }, [dateRange]);

  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

  const statCards = [
    {
      title: "Total Users",
      value: stats?.users?.total || 0,
      icon: Users,
      trend: stats?.users?.trend,
      color: "bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400",
      description: "Registered platform users",
    },
    {
      title: "Active Listings",
      value: stats?.listings?.active || 0,
      icon: Home,
      trend: stats?.listings?.trend,
      color: "bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400",
      description: "Currently active land listings",
    },
    {
      title: "Applications",
      value: stats?.applications?.pending || 0,
      icon: FileText,
      trend: stats?.applications?.trend,
      color: "bg-purple-100 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400",
      description: "Pending applications",
    },
    {
      title: "Total Revenue",
      value: `₹${((stats?.payments?.total || 0) / 100000).toFixed(1)}L`,
      icon: DollarSign,
      trend: stats?.payments?.trend,
      color: "bg-amber-100 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400",
      description: "Total platform revenue",
    },
    {
      title: "Open Disputes",
      value: stats?.disputes?.open || 0,
      icon: AlertTriangle,
      trend: stats?.disputes?.trend,
      color: "bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400",
      description: "Active disputes requiring attention",
    },
    {
      title: "Conversion Rate",
      value: `${stats?.conversion?.rate || 0}%`,
      icon: TrendingUp,
      trend: stats?.conversion?.trend,
      color: "bg-cyan-100 text-cyan-600 dark:bg-cyan-900/30 dark:text-cyan-400",
      description: "Application to lease conversion",
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold">Dashboard</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">
            Platform overview and analytics
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Select value={dateRange} onValueChange={setDateRange}>
            <SelectTrigger className="w-[180px]">
              <Calendar className="h-4 w-4 mr-2" />
              <SelectValue placeholder="Select range" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="today">Today</SelectItem>
              <SelectItem value="yesterday">Yesterday</SelectItem>
              <SelectItem value="last7days">Last 7 Days</SelectItem>
              <SelectItem value="last30days">Last 30 Days</SelectItem>
              <SelectItem value="thisMonth">This Month</SelectItem>
              <SelectItem value="lastMonth">Last Month</SelectItem>
              <SelectItem value="thisYear">This Year</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" size="icon" onClick={fetchDashboardData}>
            <RefreshCw className={cn("h-4 w-4", loading && "animate-spin")} />
          </Button>
          <Button>
            <Download className="h-4 w-4 mr-2" />
            Export Report
          </Button>
        </div>
      </div>

      {/* Security Alerts */}
      <SecurityAlert />

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
        {statCards.map((stat) => (
          <StatsCard key={stat.title} {...stat} loading={loading} />
        ))}
      </div>

      {/* Tabs for different analytics views */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full max-w-md grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="users">Users</TabsTrigger>
          <TabsTrigger value="revenue">Revenue</TabsTrigger>
          <TabsTrigger value="listings">Listings</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6">
          <div className="grid gap-6 lg:grid-cols-2">
            {/* User Growth Chart */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>User Growth</span>
                  <Button variant="ghost" size="sm">
                    <Eye className="h-4 w-4 mr-1" />
                    Details
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[350px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={analytics?.userGrowth || []}>
                      <defs>
                        <linearGradient id="colorFarmers" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor={CHART_COLORS.secondary} stopOpacity={0.3} />
                          <stop offset="95%" stopColor={CHART_COLORS.secondary} stopOpacity={0} />
                        </linearGradient>
                        <linearGradient id="colorLandowners" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor={CHART_COLORS.blue} stopOpacity={0.3} />
                          <stop offset="95%" stopColor={CHART_COLORS.blue} stopOpacity={0} />
                        </linearGradient>
                        <linearGradient id="colorTotal" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor={CHART_COLORS.primary} stopOpacity={0.3} />
                          <stop offset="95%" stopColor={CHART_COLORS.primary} stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                      <XAxis dataKey="date" tick={{ fontSize: 12 }} />
                      <YAxis tick={{ fontSize: 12 }} />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "rgba(255, 255, 255, 0.95)",
                          borderRadius: "8px",
                          border: "none",
                          boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
                        }}
                      />
                      <Legend />
                      <Area
                        type="monotone"
                        dataKey="farmers"
                        stroke={CHART_COLORS.secondary}
                        fill="url(#colorFarmers)"
                        name="Farmers"
                        strokeWidth={2}
                      />
                      <Area
                        type="monotone"
                        dataKey="landowners"
                        stroke={CHART_COLORS.blue}
                        fill="url(#colorLandowners)"
                        name="Landowners"
                        strokeWidth={2}
                      />
                      <Area
                        type="monotone"
                        dataKey="total"
                        stroke={CHART_COLORS.primary}
                        fill="url(#colorTotal)"
                        name="Total Users"
                        strokeWidth={2}
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            {/* Revenue Chart */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>Revenue Overview</span>
                  <Button variant="ghost" size="sm">
                    <Eye className="h-4 w-4 mr-1" />
                    Details
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[350px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={analytics?.revenue || []}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                      <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                      <YAxis tick={{ fontSize: 12 }} />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "rgba(255, 255, 255, 0.95)",
                          borderRadius: "8px",
                          border: "none",
                          boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
                        }}
                      />
                      <Legend />
                      <Bar dataKey="revenue" fill={CHART_COLORS.primary} name="Revenue (₹)" radius={[4, 4, 0, 0]} />
                      <Bar dataKey="platformFee" fill={CHART_COLORS.warning} name="Platform Fee" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="grid gap-6 lg:grid-cols-3">
            {/* User Distribution */}
            <Card>
              <CardHeader>
                <CardTitle>User Distribution</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[250px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <RechartsPieChart>
                      <Pie
                        data={analytics?.userDistribution || []}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, percent }) => `${name} (${((percent ?? 0) * 100).toFixed(0)}%)`}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {(analytics?.userDistribution || []).map((_entry, index: number) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </RechartsPieChart>
                  </ResponsiveContainer>
                </div>
                <div className="mt-4 space-y-2">
                  {(analytics?.userDistribution || []).map((item, index: number) => (
                    <div key={index} className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-2">
                        <div
                          className="h-3 w-3 rounded-full"
                          style={{ backgroundColor: COLORS[index % COLORS.length] }}
                        />
                        <span>{item.name}</span>
                      </div>
                      <span className="font-medium">{item.value}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Listing Status */}
            <Card>
              <CardHeader>
                <CardTitle>Listing Status</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {(analytics?.listingStatus || []).map((item) => (
                    <div key={item.status}>
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm">{item.status}</span>
                        <span className="text-sm font-medium">{item.count}</span>
                      </div>
                      <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-[#b7cf8a] rounded-full transition-all"
                          style={{ width: `${item.percentage}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
                <div className="mt-6 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600 dark:text-gray-400">Total Listings</span>
                    <span className="text-xl font-bold">{stats?.listings?.total || 0}</span>
                  </div>
                  <div className="flex items-center justify-between mt-2">
                    <span className="text-sm text-gray-600 dark:text-gray-400">Avg. Price/Acre</span>
                    <span className="text-lg font-semibold">
                      ₹{analytics?.avgPricePerAcre?.toLocaleString() || 0}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Recent Activity */}
            <Card>
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
              </CardHeader>
              <CardContent>
                <RecentActivity activities={analytics?.recentActivity || []} />
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Users Tab */}
        <TabsContent value="users" className="space-y-6">
          <div className="grid gap-6 lg:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>User Growth Rate</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <RechartsLineChart data={analytics?.userGrowthRate || []}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="date" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Line
                        type="monotone"
                        dataKey="farmers"
                        stroke={CHART_COLORS.secondary}
                        name="Farmers"
                        strokeWidth={2}
                      />
                      <Line
                        type="monotone"
                        dataKey="landowners"
                        stroke={CHART_COLORS.blue}
                        name="Landowners"
                        strokeWidth={2}
                      />
                    </RechartsLineChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>User Demographics</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div>
                    <h4 className="text-sm font-medium mb-3">Top States</h4>
                    <div className="space-y-2">
                      {(analytics?.topStates || []).map((item, index: number) => (
                        <div key={index} className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <MapPin className="h-4 w-4 text-gray-400" />
                            <span className="text-sm">{item.state}</span>
                          </div>
                          <div className="flex items-center gap-3">
                            <span className="text-sm font-medium">{item.users}</span>
                            <div className="w-20 h-1.5 bg-gray-200 rounded-full overflow-hidden">
                              <div
                                className="h-full bg-[#b7cf8a]"
                                style={{ width: `${item.percentage}%` }}
                              />
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h4 className="text-sm font-medium mb-3">Top Districts</h4>
                    <div className="space-y-2">
                      {(analytics?.topDistricts || []).map((item, index: number) => (
                        <div key={index} className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <Building className="h-4 w-4 text-gray-400" />
                            <span className="text-sm">{item.district}</span>
                          </div>
                          <span className="text-sm font-medium">{item.users}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>User Engagement Metrics</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-6 md:grid-cols-4">
                <div className="text-center p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <p className="text-sm text-gray-500">Avg. Session Duration</p>
                  <p className="text-2xl font-bold">{analytics?.engagement?.avgSessionDuration || "0m"}</p>
                </div>
                <div className="text-center p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <p className="text-sm text-gray-500">Daily Active Users</p>
                  <p className="text-2xl font-bold">{analytics?.engagement?.dau || 0}</p>
                </div>
                <div className="text-center p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <p className="text-sm text-gray-500">Weekly Active Users</p>
                  <p className="text-2xl font-bold">{analytics?.engagement?.wau || 0}</p>
                </div>
                <div className="text-center p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <p className="text-sm text-gray-500">Monthly Active Users</p>
                  <p className="text-2xl font-bold">{analytics?.engagement?.mau || 0}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Revenue Tab */}
        <TabsContent value="revenue" className="space-y-6">
          <div className="grid gap-6 lg:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Revenue Breakdown</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <RechartsPieChart>
                      <Pie
                        data={analytics?.revenueBreakdown || []}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, percent }) => `${name} (${((percent ?? 0) * 100).toFixed(0)}%)`}
                        outerRadius={100}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {(analytics?.revenueBreakdown || []).map((_entry, index: number) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </RechartsPieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Payment Statistics</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                      <div className="flex items-center gap-2">
                        <CheckCircle className="h-5 w-5 text-green-600" />
                        <span className="text-sm font-medium">Successful</span>
                      </div>
                      <p className="text-2xl font-bold mt-2">{stats?.payments?.successful || 0}</p>
                      <p className="text-sm text-gray-500">
                        ₹{((stats?.payments?.successfulAmount || 0) / 100000).toFixed(1)}L
                      </p>
                    </div>
                    <div className="p-4 bg-red-50 dark:bg-red-900/20 rounded-lg">
                      <div className="flex items-center gap-2">
                        <XCircle className="h-5 w-5 text-red-600" />
                        <span className="text-sm font-medium">Failed</span>
                      </div>
                      <p className="text-2xl font-bold mt-2">{stats?.payments?.failed || 0}</p>
                      <p className="text-sm text-gray-500">
                        ₹{((stats?.payments?.failedAmount || 0) / 100000).toFixed(1)}L
                      </p>
                    </div>
                    <div className="p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
                      <div className="flex items-center gap-2">
                        <Clock className="h-5 w-5 text-yellow-600" />
                        <span className="text-sm font-medium">Pending</span>
                      </div>
                      <p className="text-2xl font-bold mt-2">{stats?.payments?.pending || 0}</p>
                      <p className="text-sm text-gray-500">
                        ₹{((stats?.payments?.pendingAmount || 0) / 100000).toFixed(1)}L
                      </p>
                    </div>
                    <div className="p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                      <div className="flex items-center gap-2">
                        <Activity className="h-5 w-5 text-purple-600" />
                        <span className="text-sm font-medium">Refunded</span>
                      </div>
                      <p className="text-2xl font-bold mt-2">{stats?.payments?.refunded || 0}</p>
                      <p className="text-sm text-gray-500">
                        ₹{((stats?.payments?.refundedAmount || 0) / 100000).toFixed(1)}L
                      </p>
                    </div>
                  </div>

                  <div>
                    <h4 className="text-sm font-medium mb-3">Monthly Revenue Trend</h4>
                    <div className="h-[150px]">
                      <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={analytics?.monthlyRevenue || []}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="month" />
                          <YAxis />
                          <Tooltip />
                          <Area
                            type="monotone"
                            dataKey="amount"
                            stroke={CHART_COLORS.primary}
                            fill={CHART_COLORS.primary}
                            fillOpacity={0.3}
                          />
                        </AreaChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Listings Tab */}
        <TabsContent value="listings" className="space-y-6">
          <div className="grid gap-6 lg:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Listings by Type</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <RechartsPieChart>
                      <Pie
                        data={analytics?.listingsByType || []}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, percent }) => `${name} (${((percent ?? 0) * 100).toFixed(0)}%)`}
                        outerRadius={100}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {(analytics?.listingsByType || []).map((_entry, index: number) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </RechartsPieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Listings by Land Type</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={analytics?.listingsByLandType || []} layout="vertical">
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis type="number" />
                      <YAxis dataKey="type" type="category" width={100} />
                      <Tooltip />
                      <Bar dataKey="count" fill={CHART_COLORS.primary} radius={[0, 4, 4, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Top Performing Listings</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {(analytics?.topListings || []).map((listing, index: number) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-lg bg-[#b7cf8a]/20 flex items-center justify-center">
                        <Home className="h-5 w-5 text-[#b7cf8a]" />
                      </div>
                      <div>
                        <p className="font-medium">{listing.title}</p>
                        <p className="text-sm text-gray-500">
                          {listing.size} acres • {listing.location}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">{listing.applications} applications</p>
                      <p className="text-sm text-gray-500">{listing.views} views</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}