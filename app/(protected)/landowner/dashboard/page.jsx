// app/(protected)/landowner/dashboard/page.tsx
import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { 
  Landmark, 
  Users, 
  DollarSign, 
  FileText,
  Building,
  MapPin
} from "lucide-react";

export default async function LandownerDashboardPage() {
  const { userId } = await auth();
  if (!userId) redirect("/sign-in");

  const user = await prisma.user.findUnique({
    where: { clerkUserId: userId },
    include: {
      landownerProfile: {
        include: {
          lands: true,
        },
      },
    },
  });

  if (!user || !user.landownerProfile) {
    redirect("/onboarding/landowner");
  }

  const stats = [
    { label: "Total Lands", value: user.landownerProfile.lands.length.toString(), icon: Landmark, color: "text-blue-600", bg: "bg-blue-50" },
    { label: "Active Leases", value: "2", icon: Users, color: "text-green-600", bg: "bg-green-50" },
    { label: "Monthly Revenue", value: "₹25,000", icon: DollarSign, color: "text-purple-600", bg: "bg-purple-50" },
    { label: "Pending Applications", value: "5", icon: FileText, color: "text-orange-600", bg: "bg-orange-50" },
  ];

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">
          Welcome back, {user.name} 🏢
        </h1>
        <p className="text-gray-600 mt-2">
          Manage your lands and leases
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div key={stat.label} className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">{stat.label}</p>
                  <p className="text-3xl font-bold text-gray-900 mt-2">{stat.value}</p>
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
          Your Information
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Building className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Name</p>
                <p className="font-medium text-gray-900">{user.name}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-100 rounded-lg">
                <MapPin className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Location</p>
                <p className="font-medium text-gray-900">
                  {user.district}, {user.state}
                </p>
              </div>
            </div>
          </div>
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-purple-100 rounded-lg">
                <FileText className="h-5 w-5 text-purple-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Contact</p>
                <p className="font-medium text-gray-900">{user.phone}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="p-2 bg-orange-100 rounded-lg">
                <Landmark className="h-5 w-5 text-orange-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Lands Registered</p>
                <p className="font-medium text-gray-900">
                  {user.landownerProfile.lands.length} lands
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-8 border border-blue-100">
        <h2 className="text-xl font-semibold text-gray-900 mb-6">
          Quick Actions
        </h2>
        <div className="flex flex-wrap gap-4">
          <button className="px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors">
            Add New Land
          </button>
          <button className="px-6 py-3 bg-white text-blue-600 font-medium rounded-lg border border-blue-600 hover:bg-blue-50 transition-colors">
            View Applications
          </button>
          <button className="px-6 py-3 bg-white text-gray-700 font-medium rounded-lg border border-gray-300 hover:bg-gray-50 transition-colors">
            Manage Leases
          </button>
          <button className="px-6 py-3 bg-white text-gray-700 font-medium rounded-lg border border-gray-300 hover:bg-gray-50 transition-colors">
            Generate Reports
          </button>
        </div>
      </div>
    </div>
  );
}