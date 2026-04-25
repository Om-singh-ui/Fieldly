"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import type { ApplicationStats } from "../_types";

interface ApplicationStatsCardsProps {
  stats: ApplicationStats;
}

export function ApplicationStatsCards({ stats }: ApplicationStatsCardsProps) {
  const cards = [
    {
      title: "Total Applications",
      value: stats.total,
      icon: "/onboarding/individualownership.png",
    },
    {
      title: "Pending Review",
      value: stats.pendingReview,
      icon: "/icons/pending.png",
    },
    {
      title: "Approved",
      value: stats.byStatus?.APPROVED || 0,
      icon: "/onboarding/5290058.png",
    },
    {
      title: "Rejected",
      value: stats.byStatus?.REJECTED || 0,
      icon: "/onboarding/rejected.png",
    },
    {
      title: "Approved Today",
      value: stats.approvedToday || 0,
      icon: "/onboarding/5290058.png",
    },
    {
      title: "Total Value",
      value: `₹${((stats.totalValue || 0) / 100000).toFixed(1)}L`,
      icon: "/onboarding/preference.png",
    },
  ];

  return (
    <div className="mt-10">
      <div
        className="
        relative p-6 rounded-[40px]
        bg-gradient-to-br from-white/60 to-gray-100/40
        dark:from-white/5 dark:to-white/10
        backdrop-blur-2xl
        border border-white/30 dark:border-white/10
        shadow-[0_20px_60px_rgba(0,0,0,0.08)]
      "
      >
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="grid gap-4 sm:grid-cols-3 lg:grid-cols-6"
        >
          {cards.map((card, index) => (
            <motion.div
              key={card.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.06 }}
              whileHover={{ y: -6, scale: 1.02 }}
            >
              <Card
                className="
                  relative rounded-2xl
                  bg-white/60 dark:bg-white/5
                  backdrop-blur-xl
                  border border-white/30 dark:border-white/10
                  shadow-[0_10px_30px_rgba(0,0,0,0.06)]
                  transition-all duration-300
                  hover:shadow-[0_20px_50px_rgba(0,0,0,0.12)]
                  group
                "
              >
                {/* subtle hover glow */}
                <div
                  className="
                    absolute inset-0 rounded-2xl
                    bg-gradient-to-br from-white/20 to-transparent
                    opacity-0 group-hover:opacity-100
                    transition-opacity duration-500
                  "
                />

                <CardContent className="relative z-10 p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    {/* Icon container */}
                    <div
                      className="
                        w-10 h-10 rounded-xl
                        bg-gradient-to-br from-white/70 to-gray-200/40
                        dark:from-white/10 dark:to-white/5
                        flex items-center justify-center
                        border border-white/30 dark:border-white/10
                        transition-transform duration-300
                        group-hover:scale-105
                      "
                    >
                      <Image
                        src={card.icon}
                        alt={card.title}
                        width={32}
                        height={32}
                        className="opacity-80"
                      />
                    </div>

                    {/* subtle indicator */}
                    <div className="w-1.5 h-1.5 rounded-full bg-gray-400/50" />
                  </div>

                  {/* Content */}
                  <div>
                    <p className="text-[11px] text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                      {card.title}
                    </p>
                    <p
                      className="
                        text-lg font-semibold text-gray-900 dark:text-white mt-1
                        transition-transform duration-300
                        group-hover:scale-[1.04]
                        origin-left
                      "
                    >
                      {card.value}
                    </p>
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
