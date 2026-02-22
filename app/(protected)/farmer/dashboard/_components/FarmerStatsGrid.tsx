"use client";

import { motion, Variants } from "framer-motion";
import CountUp from "react-countup";
import {
  Package,
  Landmark,
  MapPin,
  Heart,
  IndianRupee,
} from "lucide-react";

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
  const statItems = [
    {
      label: "Active Applications",
      value: stats.activeApplications,
      icon: Package,
      color: "text-blue-600",
      bg: "bg-blue-50",
      darkBg: "dark:bg-blue-900/30",
      gradient: "from-blue-500 to-blue-600",
      delay: 0.1,
    },
    {
      label: "Active Leases",
      value: stats.activeLeases,
      icon: Landmark,
      color: "text-green-600",
      bg: "bg-green-50",
      darkBg: "dark:bg-green-900/30",
      gradient: "from-green-500 to-emerald-600",
      delay: 0.2,
    },
    {
      label: "Recommended Lands",
      value: stats.recommendedLands,
      icon: MapPin,
      color: "text-purple-600",
      bg: "bg-purple-50",
      darkBg: "dark:bg-purple-900/30",
      gradient: "from-purple-500 to-purple-600",
      delay: 0.3,
    },
    {
      label: "Saved Listings",
      value: stats.savedListings,
      icon: Heart,
      color: "text-red-600",
      bg: "bg-red-50",
      darkBg: "dark:bg-red-900/30",
      gradient: "from-red-500 to-pink-600",
      delay: 0.4,
    },
    {
      label: "Upcoming Payments",
      value: stats.upcomingPayments,
      icon: IndianRupee,
      color: "text-orange-600",
      bg: "bg-orange-50",
      darkBg: "dark:bg-orange-900/30",
      gradient: "from-orange-500 to-amber-600",
      delay: 0.5,
    },
  ];

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants: Variants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 12,
      },
    },
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6"
    >
      {statItems.map((stat) => {
        const Icon = stat.icon;
        return (
          <motion.div
            key={stat.label}
            variants={itemVariants}
            whileHover={{ 
              scale: 1.05,
              transition: { type: "spring", stiffness: 400, damping: 10 }
            }}
            whileTap={{ scale: 0.95 }}
            className="group relative rounded-2xl p-6 bg-white dark:bg-gray-800 shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer overflow-hidden"
          >
            {/* Background Gradient */}
            <motion.div
              className={`absolute inset-0 bg-gradient-to-br ${stat.gradient} opacity-0 group-hover:opacity-10 transition-opacity duration-300`}
              animate={{ 
                scale: [1, 1.2, 1],
              }}
              transition={{ 
                duration: 5, 
                repeat: Infinity,
                repeatType: "reverse"
              }}
            />
            
            {/* Content */}
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-4">
                <motion.div
                  whileHover={{ rotate: 360 }}
                  transition={{ duration: 0.5 }}
                  className={`p-3 rounded-xl ${stat.bg} ${stat.darkBg} group-hover:scale-110 transition-transform duration-300`}
                >
                  <Icon className={`h-6 w-6 ${stat.color}`} />
                </motion.div>
                
                {/* Sparkle Effect */}
                <motion.div
                  animate={{
                    scale: [1, 1.2, 1],
                    opacity: [0.5, 1, 0.5],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    delay: stat.delay,
                  }}
                  className="w-2 h-2 rounded-full bg-green-400"
                />
              </div>
              
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                  {stat.label}
                </p>
                <motion.p 
                  className="text-3xl font-bold text-gray-900 dark:text-white"
                  initial={{ scale: 0.5 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 200, delay: stat.delay }}
                >
                  <CountUp
                    end={stat.value}
                    duration={2}
                    delay={stat.delay}
                    separator=","
                  />
                </motion.p>
              </div>
            </div>

            {/* Animated Border */}
            <motion.div
              className="absolute bottom-0 left-0 h-1 bg-gradient-to-r from-green-400 to-emerald-500"
              initial={{ width: 0 }}
              animate={{ width: "100%" }}
              transition={{ duration: 1, delay: stat.delay }}
            />
          </motion.div>
        );
      })}
    </motion.div>
  );
}