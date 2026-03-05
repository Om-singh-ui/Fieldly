"use client";

import { motion } from "framer-motion";
import CountUp from "react-countup";
import Image from "next/image";
import { ArrowUpRight } from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { useState, useEffect } from "react";

interface FarmerStats {
  activeApplications: number;
  activeLeases: number;
  recommendedLands: number;
  savedListings: number;
  upcomingPayments: number;
}

interface StatsGridProps {
  stats: FarmerStats;
}

export function FarmerStatsGrid({ stats }: StatsGridProps) {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 1200);
    return () => clearTimeout(timer);
  }, []);

  const cards = [
    {
      title: "Active Applications",
      value: stats.activeApplications,
      icon: "/onboarding/individualownership.png",
      trend: "+4%",
    },
    {
      title: "Active Leases",
      value: stats.activeLeases,
      icon: "/onboarding/user-man-account-person.png",
      trend: "+2%",
    },
    {
      title: "Recommended Lands",
      value: stats.recommendedLands,
      icon: "/onboarding/landreq.png",
      trend: "+9%",
    },
    {
      title: "Saved Listings",
      value: stats.savedListings,
      icon: "/icons/saved.png",
      trend: "+6%",
    },
    {
      title: "Upcoming Payments",
      value: stats.upcomingPayments,
      icon: "/icons/upcomingpayment.png",
      trend: "Due Soon",
    },
  ];

  /* ---------------- Skeleton Loader ---------------- */

  if (isLoading) {
    return (
      <div className="relative mt-10">
        <div className="absolute inset-0 rounded-[70px] border border-[#b7cf8a]/20 backdrop-blur-2xl" />

        <div className="relative z-10 px-8 py-14">
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-5 animate-pulse">
            {[1, 2, 3, 4, 5].map((_, i) => (
              <Card
                key={i}
                className="rounded-3xl border border-white/40 dark:border-white/10 bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl shadow-xl"
              >
                <CardContent className="p-7 space-y-6">
                  <div className="flex justify-between items-start">
                    <div className="w-16 h-16 bg-gray-200 dark:bg-gray-700 rounded-2xl" />
                    <div className="h-5 w-14 bg-gray-200 dark:bg-gray-700 rounded-full" />
                  </div>

                  <div>
                    <div className="h-4 w-24 bg-gray-200 dark:bg-gray-700 rounded mb-2" />
                    <div className="h-8 w-16 bg-gray-200 dark:bg-gray-700 rounded" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    );
  }

  /* ---------------- Main UI ---------------- */

  return (
    <div className="relative mt-10">
      {/* Capsule Background */}
      <div
        className="absolute inset-0 rounded-[70px]
        border border-[#b7cf8a]/20
        shadow-[0_18px_48px_rgba(0,0,0,0.10),0_6px_16px_rgba(0,0,0,0.06)]
        backdrop-blur-2xl"
      />

      <div className="relative z-10 px-8 py-14">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="grid gap-8 sm:grid-cols-2 lg:grid-cols-5"
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
                  "transition-all duration-300"
                )}
              >
                <CardContent className="p-7 space-y-6">
                  <div className="flex justify-between items-start">
                    {/* Image Icon */}
                    <div
                      className="w-16 h-16 rounded-2xl 
                      bg-[#b7cf8a]/15 flex items-center justify-center shadow-sm"
                    >
                      <Image
                        src={card.icon}
                        alt={card.title}
                        width={38}
                        height={38}
                        className="object-contain"
                      />
                    </div>

                    {/* Trend Badge */}
                    <span
                      className="flex items-center gap-1 text-xs font-medium 
                      text-emerald-600 bg-emerald-50 
                      dark:bg-emerald-900/30 px-3 py-1 rounded-full"
                    >
                      <ArrowUpRight className="w-3 h-3" />
                      {card.trend}
                    </span>
                  </div>

                  {/* Stat Value */}
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {card.title}
                    </p>

                    <h3 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white mt-1">
                      <CountUp end={card.value} duration={2} separator="," />
                    </h3>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </div>
  );
}