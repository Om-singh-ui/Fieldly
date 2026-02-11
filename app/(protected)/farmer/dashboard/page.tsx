// app/(protected)/farmer/dashboard/page.tsx
import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import {
  Package,
  Landmark,
  TrendingUp,
  Calendar,
  Leaf,
  MapPin,
} from "lucide-react";

export default async function FarmerDashboardPage() {
  const { userId } = await auth();
  if (!userId) redirect("/sign-in");

  const user = await prisma.user.findUnique({
    where: { clerkUserId: userId },
    include: {
      farmerProfile: true,
    },
  });

  if (!user || !user.farmerProfile) {
    redirect("/onboarding/farmer");
  }

  const stats = [
    {
      label: "Active Applications",
      value: "3",
      icon: Package,
      color: "text-blue-600",
      bg: "bg-blue-50",
    },
    {
      label: "Current Leases",
      value: "1",
      icon: Landmark,
      color: "text-green-600",
      bg: "bg-green-50",
    },
    {
      label: "Recommended Lands",
      value: "12",
      icon: MapPin,
      color: "text-purple-600",
      bg: "bg-purple-50",
    },
    {
      label: "Upcoming Payments",
      value: "2",
      icon: TrendingUp,
      color: "text-orange-600",
      bg: "bg-orange-50",
    },
  ];

  return (
    <div className="p-6 mt-16">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">
          Welcome back, {user.name} 👨‍🌾
        </h1>
        <p className="text-gray-600 mt-2">Here&apos;s your farming dashboard</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div
              key={stat.label}
              className="bg-white rounded-xl p-6 shadow-sm border border-gray-100"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">{stat.label}</p>
                  <p className="text-3xl font-bold text-gray-900 mt-2">
                    {stat.value}
                  </p>
                </div>
                <div className={`p-3 rounded-lg ${stat.bg}`}>
                  <Icon className={`h-6 w-6 ${stat.color}`} />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Profile Summary */}
      <div className="bg-white rounded-xl p-8 shadow-sm border border-gray-100 mb-8">
        <h2 className="text-xl font-semibold text-gray-900 mb-6">
          Your Farming Profile
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-100 rounded-lg">
                <Leaf className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Primary Crops</p>
                <p className="font-medium text-gray-900">
                  {user.farmerProfile.primaryCrops.join(", ")}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Calendar className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Farming Experience</p>
                <p className="font-medium text-gray-900">
                  {user.farmerProfile.farmingExperience} years
                </p>
              </div>
            </div>
          </div>
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-purple-100 rounded-lg">
                <MapPin className="h-5 w-5 text-purple-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Required Land Size</p>
                <p className="font-medium text-gray-900">
                  {user.farmerProfile.requiredLandSize} acres
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="p-2 bg-orange-100 rounded-lg">
                <Landmark className="h-5 w-5 text-orange-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">
                  Preferred Lease Duration
                </p>
                <p className="font-medium text-gray-900">
                  {user.farmerProfile.leaseDuration} months
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-xl p-8 border border-green-100">
        <h2 className="text-xl font-semibold text-gray-900 mb-6">
          Quick Actions
        </h2>
        <div className="flex flex-wrap gap-4">
          <button className="px-6 py-3 bg-green-600 text-white font-medium rounded-lg hover:bg-green-700 transition-colors">
            Find Available Land
          </button>
          <button className="px-6 py-3 bg-white text-green-600 font-medium rounded-lg border border-green-600 hover:bg-green-50 transition-colors">
            Submit New Application
          </button>
          <button className="px-6 py-3 bg-white text-gray-700 font-medium rounded-lg border border-gray-300 hover:bg-gray-50 transition-colors">
            View Applications
          </button>
          <button className="px-6 py-3 bg-white text-gray-700 font-medium rounded-lg border border-gray-300 hover:bg-gray-50 transition-colors">
            Manage Leases
          </button>
        </div>
      </div>
    </div>
  );
}
