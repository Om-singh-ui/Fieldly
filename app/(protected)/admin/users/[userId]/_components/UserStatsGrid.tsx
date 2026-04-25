"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import type { UserDetails } from "../_types";

interface UserStatsGridProps {
  user: UserDetails;
}

export function UserStatsGrid({ user }: UserStatsGridProps) {
  const stats = [
    {
      label: "Applications",
      value: user._count?.applications || 0,
      icon: "/icons/monthley.png",
    },
    {
      label: "Listings",
      value: user._count?.listingsOwned || 0,
      icon: "/onboarding/landreq.png",
    },
    {
      label: "Leases",
      value:
        (user._count?.leasesAsFarmer || 0) +
        (user._count?.leasesAsOwner || 0),
      icon: "/onboarding/trust.png",
    },
    {
      label: "Payments",
      value: user._count?.payments || 0,
      icon: "/icons/upcomingpayment.png",
    },
  ];

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat, index) => (
        <motion.div
          key={stat.label}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 + index * 0.08 }}
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
            {/* subtle glass highlight */}
            <div
              className="
                absolute inset-0 rounded-2xl
                bg-gradient-to-br from-white/20 to-transparent
                opacity-0 group-hover:opacity-100
                transition-opacity duration-500
              "
            />

            <CardContent className="relative z-10 p-5">
              <div className="flex items-center justify-between mb-4">
                {/* Icon container */}
                <div
                  className="
                    w-11 h-11 rounded-xl
                    bg-gradient-to-br from-white/70 to-gray-200/40
                    dark:from-white/10 dark:to-white/5
                    flex items-center justify-center
                    border border-white/30 dark:border-white/10
                    transition-transform duration-300
                    group-hover:scale-105
                  "
                >
                  <Image
                    src={stat.icon}
                    alt={stat.label}
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
                <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-1">
                  {stat.label}
                </p>
                <p
                  className="
                    text-2xl font-semibold text-gray-900 dark:text-white
                    transition-transform duration-300
                    group-hover:scale-[1.04]
                    origin-left
                  "
                >
                  {stat.value.toLocaleString()}
                </p>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      ))}
    </div>
  );
}