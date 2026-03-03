"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { Activity, ArrowUpRight, BadgeCheck, Sparkles } from "lucide-react";

interface StatsCardsProps {
  stats: {
    totalLands: number;
    activeLeases: number;
    pendingApplications: number;
    monthlyRevenue: number;
    leasedArea: number;
    availableArea: number;
    totalRevenue?: number;
    revenueGrowth?: number;
  };
}

export function StatsCards({ stats }: StatsCardsProps) {
  const totalArea = stats.leasedArea + stats.availableArea;
  const leasedPercentage =
    totalArea > 0 ? (stats.leasedArea / totalArea) * 100 : 0;

  const revenueGrowth = stats.revenueGrowth || 8.2;

  const cards = [
    {
      title: "Total Lands",
      value: stats.totalLands,
      icon: "/onboarding/landreq.png",
      trend: "+12.5%",
    },
    {
      title: "Active Leases",
      value: stats.activeLeases,
      icon: "/onboarding/user-man-account-person.png",
      trend:
        stats.activeLeases > 0
          ? `+${stats.activeLeases} this month`
          : "No active leases",
    },
    {
      title: "Monthly Revenue",
      value: `₹${stats.monthlyRevenue.toLocaleString()}`,
      icon: "/icons/quaterly.png",
      trend: `+${revenueGrowth}% from last month`,
    },
    {
      title: "Pending Applications",
      value: stats.pendingApplications,
      icon: "/icons/pending.png",
      trend:
        stats.pendingApplications > 0 ? "Requires attention" : "No pending",
    },
  ];

  return (
    <div className="space-y-16 mt-10">
      {/* ================= Capsule Stats Container ================= */}
      <div className="relative">
        {/* Capsule background */}
        <div
          className="absolute inset-0 rounded-[70px]  dark:to-[#0f172a]
            border border-[#b7cf8a]/20 
      shadow-[0_18px_48px_rgba(0,0,0,0.10),0_6px_16px_rgba(0,0,0,0.06)]
 backdrop-blur-2xl"
        />

        <div className="relative z-10 px-8 py-14">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4"
          >
            {cards.map((card, index) => (
              <motion.div
                key={card.title}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -10, scale: 1.04 }}
              >
                <Card
                  className={cn(
                    "rounded-3xl border border-white/40 dark:border-white/10",
                    "bg-white/80 dark:bg-gray-900/80",
                    "backdrop-blur-xl shadow-xl hover:shadow-2xl",
                    "transition-all duration-300",
                  )}
                >
                  <CardContent className="p-7 space-y-6">
                    <div className="flex justify-between items-start">
                      <div
                        className="w-16 h-16 rounded-2xl 
                          bg-[#b7cf8a]/15 flex items-center justify-center 
                          shadow-sm"
                      >
                        <Image
                          src={card.icon}
                          alt={card.title}
                          width={38}
                          height={38}
                          className="object-contain"
                        />
                      </div>

                      <span
                        className="text-xs font-medium text-emerald-600 
                          bg-emerald-50 dark:bg-emerald-900/30 
                          px-3 py-1 rounded-full"
                      >
                        {card.trend}
                      </span>
                    </div>

                    <div>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {card.title}
                      </p>
                      <h3
                        className="text-3xl font-bold tracking-tight 
                          text-gray-900 dark:text-white mt-1"
                      >
                        {card.value}
                      </h3>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>

      {/* ================= Land Utilization Card (Enhanced) ================= */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        <Card
          className="relative overflow-hidden rounded-3xl
          shadow-[0_18px_48px_rgba(0,0,0,0.10),0_6px_16px_rgba(0,0,0,0.06)]
          backdrop-blur-2xl "
        >
          <CardHeader className="relative z-10 pb-4">
            <div className="flex items-center justify-between">
              <CardTitle
                className="flex items-center gap-2 
                  text-sm font-medium text-gray-700 dark:text-gray-300"
              >
                <Activity className="w-4 h-4 text-[#b7cf8a]" />
                Land Utilization
              </CardTitle>

              <div className="flex items-center gap-2">
                <BadgeCheck className="w-4 h-4 text-[#b7cf8a]" />
                <Sparkles className="w-3 h-3 text-[#b7cf8a] animate-pulse" />
              </div>
            </div>
          </CardHeader>

          <CardContent className="relative z-10 space-y-6">
            <div className="grid grid-cols-2 gap-6">
              <div>
                <p className="text-xs text-gray-500">Leased Area</p>
                <h3 className="text-2xl font-bold mt-1">
                  {stats.leasedArea.toFixed(1)}
                  <span className="text-sm ml-1 text-gray-500">acres</span>
                </h3>
              </div>

              <div>
                <p className="text-xs text-gray-500">Available Area</p>
                <h3 className="text-2xl font-bold mt-1">
                  {stats.availableArea.toFixed(1)}
                  <span className="text-sm ml-1 text-gray-500">acres</span>
                </h3>
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs mb-2">
                <span className="text-gray-500">Utilization Rate</span>
                <span className="text-[#b7cf8a] font-medium">
                  {leasedPercentage.toFixed(1)}%
                </span>
              </div>

              <div className="relative h-3 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${leasedPercentage}%` }}
                  transition={{ duration: 1 }}
                  className="absolute h-full bg-gradient-to-r 
                    from-[#b7cf8a] to-[#a9c87a] rounded-full"
                />
              </div>
            </div>

            <div
              className="flex items-center gap-2 p-4 
                bg-[#b7cf8a]/10 rounded-xl border border-[#b7cf8a]/20"
            >
              <ArrowUpRight className="w-4 h-4 text-[#b7cf8a]" />
              <p className="text-sm text-gray-700 dark:text-gray-300">
                {leasedPercentage > 70
                  ? "Excellent utilization! Your land is in high demand."
                  : leasedPercentage > 40
                    ? "Good utilization. Promote available land."
                    : "Low utilization. Consider listing more land."}
              </p>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
