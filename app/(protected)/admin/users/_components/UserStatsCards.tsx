// app/(protected)/admin/users/_components/UserStatsCards.tsx
"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import type { UserStats } from "../_types";

interface UserStatsCardsProps {
  stats: UserStats;
}

export function UserStatsCards({ stats }: UserStatsCardsProps) {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 800);
    return () => clearTimeout(timer);
  }, []);

  const cards = [
    {
      title: "Total Users",
      value: stats.total,
      icon: "/onboarding/user-man-account-person.png",
    },
    {
      title: "Farmers",
      value: stats.byRole?.FARMER || 0,
      icon: "/ilsfarmer.png",
    },
    {
      title: "Landowners",
      value: stats.byRole?.LANDOWNER || 0,
      icon: "/landownersicon.png",
    },
    {
      title: "Admins",
      value: (stats.byRole?.ADMIN || 0) + (stats.byRole?.SUPER_ADMIN || 0),
      icon: "/onboarding/review.png",
    },
  ];

  if (isLoading) {
    return <UserStatsCardsSkeleton />;
  }

  return (
    <div className="mt-10">
      {/* Glass Container */}
      <div className="relative">
        {/* Container background */}
        <div
          className="absolute inset-0 rounded-[40px]
            bg-gradient-to-br from-white/80 via-white/40 to-gray-100/30
            dark:from-gray-900/80 dark:via-gray-900/40 dark:to-gray-950/30
            border border-gray-200/40 dark:border-gray-700/40
            shadow-[0_20px_60px_rgba(0,0,0,0.06),0_8px_20px_rgba(0,0,0,0.04)]
            backdrop-blur-2xl"
        />

        <div className="relative z-10 px-6 py-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4"
          >
            {cards.map((card, index) => (
              <motion.div
                key={card.title}
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ 
                  delay: 0.1 + index * 0.08, 
                  duration: 0.4,
                  ease: "easeOut" 
                }}
                whileHover={{ y: -8, scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Card
                  className={cn(
                    "relative rounded-3xl overflow-hidden",
                    "bg-white/70 dark:bg-gray-900/70",
                    "backdrop-blur-xl",
                    "border border-gray-200/50 dark:border-gray-700/50",
                    "shadow-[0_8px_30px_rgba(0,0,0,0.04)]",
                    "hover:shadow-[0_20px_50px_rgba(0,0,0,0.08)]",
                    "transition-all duration-500",
                    "group cursor-default"
                  )}
                >
                  {/* Subtle gradient overlay on hover */}
                  <div
                    className={cn(
                      "absolute inset-0 bg-gradient-to-br from-gray-900/5 to-gray-800/5 opacity-0",
                      "group-hover:opacity-100 transition-opacity duration-700"
                    )}
                  />

                  <CardContent className="relative z-10 p-6 space-y-5">
                    {/* Icon and decorative dots */}
                    <div className="flex items-center justify-between">
                      <div
                        className="w-14 h-14 rounded-2xl
                          bg-gradient-to-br from-gray-100 to-gray-50
                          dark:from-gray-800 dark:to-gray-750
                          flex items-center justify-center
                          border border-gray-200/50 dark:border-gray-700/50
                          shadow-sm
                          group-hover:scale-110 group-hover:rotate-3
                          transition-all duration-500"
                      >
                        <Image
                          src={card.icon}
                          alt={card.title}
                          width={28}
                          height={28}
                          className="opacity-90 dark:opacity-80 group-hover:opacity-100 transition-opacity duration-300"
                        />
                      </div>

                      {/* Decorative dots */}
                      <div className="flex items-center gap-1.5">
                        <div className="w-1 h-1 rounded-full bg-gray-300 dark:bg-gray-600 group-hover:bg-gray-400 dark:group-hover:bg-gray-500 transition-colors duration-300" />
                        <div className="w-1 h-1 rounded-full bg-gray-400 dark:bg-gray-500" />
                        <div className="w-1 h-1 rounded-full bg-gray-300 dark:bg-gray-600 group-hover:bg-gray-400 dark:group-hover:bg-gray-500 transition-colors duration-300" />
                      </div>
                    </div>

                    {/* Content */}
                    <div>
                      <p className="text-xs font-medium text-gray-500 dark:text-gray-400 
                        uppercase tracking-[0.1em] mb-1.5">
                        {card.title}
                      </p>
                      <motion.h3
                        className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white
                          group-hover:scale-105 transition-transform duration-300 origin-left"
                      >
                        {typeof card.value === 'number' 
                          ? card.value.toLocaleString() 
                          : card.value}
                      </motion.h3>
                    </div>

                    {/* Bottom accent line */}
                    <div className="absolute bottom-0 left-6 right-6 h-[2px] 
                      bg-gradient-to-r from-transparent via-gray-300/30 to-transparent
                      dark:via-gray-600/30
                      group-hover:via-gray-400/50 dark:group-hover:via-gray-500/50
                      transition-all duration-500" 
                    />
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </div>
  );
}

// ============================================
// SKELETON LOADING COMPONENT
// ============================================
function UserStatsCardsSkeleton() {
  return (
    <div className="mt-10">
      <div className="relative">
        <div
          className="absolute inset-0 rounded-[40px] 
            bg-gradient-to-br from-white/80 via-white/40 to-gray-100/30
            dark:from-gray-900/80 dark:via-gray-900/40 dark:to-gray-950/30
            border border-gray-200/40 dark:border-gray-700/40
            shadow-[0_20px_60px_rgba(0,0,0,0.06),0_8px_20px_rgba(0,0,0,0.04)]
            backdrop-blur-2xl"
        />
        <div className="relative z-10 px-6 py-8">
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {[1, 2, 3, 4].map((_, index) => (
              <Card
                key={index}
                className="rounded-3xl overflow-hidden
                  bg-white/70 dark:bg-gray-900/70
                  backdrop-blur-xl
                  border border-gray-200/50 dark:border-gray-700/50
                  shadow-[0_8px_30px_rgba(0,0,0,0.04)]"
              >
                <CardContent className="p-6 space-y-5">
                  {/* Icon skeleton */}
                  <div className="flex items-center justify-between">
                    <div className="w-14 h-14 rounded-2xl 
                      bg-gradient-to-br from-gray-200 to-gray-100
                      dark:from-gray-700 dark:to-gray-600
                      animate-pulse" 
                    />
                    <div className="flex items-center gap-1.5">
                      <div className="w-1 h-1 rounded-full bg-gray-200 dark:bg-gray-700 animate-pulse" />
                      <div className="w-1 h-1 rounded-full bg-gray-300 dark:bg-gray-600 animate-pulse" />
                      <div className="w-1 h-1 rounded-full bg-gray-200 dark:bg-gray-700 animate-pulse" />
                    </div>
                  </div>
                  
                  {/* Text skeleton */}
                  <div className="space-y-2">
                    <div className="h-3 w-20 bg-gray-200 dark:bg-gray-700 rounded-md animate-pulse" />
                    <div className="h-8 w-24 bg-gray-200 dark:bg-gray-700 rounded-md animate-pulse" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}