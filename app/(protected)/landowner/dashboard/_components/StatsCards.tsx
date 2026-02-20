// app/(protected)/landowner/dashboard/_components/StatsCards.tsx
"use client";

import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Landmark, Users, DollarSign, FileText, 
  TrendingUp, Minus, ArrowUpRight,
  Activity, BadgeCheck, AlertCircle, Sparkles
} from "lucide-react";
import { cn } from "@/lib/utils";

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

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { 
    opacity: 1,
    transition: { 
      staggerChildren: 0.1,
      delayChildren: 0.2 
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { 
      duration: 0.5
    }
  }
};

export function StatsCards({ stats }: StatsCardsProps) {
  const totalArea = stats.leasedArea + stats.availableArea;
  const leasedPercentage = totalArea > 0 ? (stats.leasedArea / totalArea) * 100 : 0;
  const revenueGrowth = stats.revenueGrowth || 8.2;

  const cards = [
    {
      title: "Total Lands",
      value: stats.totalLands,
      icon: Landmark,
      trend: `${stats.totalLands > 0 ? "+12.5%" : "0%"}`,
      trendIcon: stats.totalLands > 0 ? TrendingUp : Minus,
      trendColor: stats.totalLands > 0 ? "text-emerald-600" : "text-gray-500",
      gradient: "from-blue-50 to-blue-100/50 dark:from-blue-950/30 dark:to-blue-900/20",
      iconBg: "bg-blue-500/10",
      iconColor: "text-blue-600 dark:text-blue-400",
      borderColor: "border-blue-200/50 dark:border-blue-800/50",
    },
    {
      title: "Active Leases",
      value: stats.activeLeases,
      icon: Users,
      trend: stats.activeLeases > 0 ? `+${stats.activeLeases} this month` : "No active leases",
      trendIcon: stats.activeLeases > 0 ? TrendingUp : Minus,
      trendColor: stats.activeLeases > 0 ? "text-emerald-600" : "text-gray-500",
      gradient: "from-emerald-50 to-emerald-100/50 dark:from-emerald-950/30 dark:to-emerald-900/20",
      iconBg: "bg-emerald-500/10",
      iconColor: "text-emerald-600 dark:text-emerald-400",
      borderColor: "border-emerald-200/50 dark:border-emerald-800/50",
    },
    {
      title: "Monthly Revenue",
      value: `₹${stats.monthlyRevenue.toLocaleString()}`,
      icon: DollarSign,
      trend: `+${revenueGrowth}% from last month`,
      trendIcon: TrendingUp,
      trendColor: "text-emerald-600",
      gradient: "from-purple-50 to-purple-100/50 dark:from-purple-950/30 dark:to-purple-900/20",
      iconBg: "bg-purple-500/10",
      iconColor: "text-purple-600 dark:text-purple-400",
      borderColor: "border-purple-200/50 dark:border-purple-800/50",
    },
    {
      title: "Pending Applications",
      value: stats.pendingApplications,
      icon: FileText,
      trend: stats.pendingApplications > 0 ? "Requires attention" : "No pending",
      trendIcon: stats.pendingApplications > 0 ? AlertCircle : Minus,
      trendColor: stats.pendingApplications > 0 ? "text-amber-600" : "text-gray-500",
      gradient: "from-amber-50 to-amber-100/50 dark:from-amber-950/30 dark:to-amber-900/20",
      iconBg: "bg-amber-500/10",
      iconColor: "text-amber-600 dark:text-amber-400",
      borderColor: "border-amber-200/50 dark:border-amber-800/50",
    },
  ];

  return (
    <div className="space-y-8">
      {/* Main Stats Grid */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4"
      >
        {cards.map((card) => {
          const Icon = card.icon;
          const TrendIcon = card.trendIcon;
          
          return (
            <motion.div
              key={card.title}
              variants={itemVariants}
              whileHover={{ y: -4, scale: 1.02 }}
              transition={{ duration: 0.2 }}
            >
              <Card className={cn(
                "relative overflow-hidden border-2 hover:shadow-xl transition-all duration-300 backdrop-blur-sm",
                `bg-gradient-to-br ${card.gradient}`,
                card.borderColor,
                "hover:border-[#b7cf8a]/50 dark:hover:border-[#b7cf8a]/50"
              )}>
                {/* Decorative gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/5 to-white/10 dark:via-white/5 dark:to-white/5 pointer-events-none" />
                
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 relative z-10">
                  <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400">
                    {card.title}
                  </CardTitle>
                  <div className={cn("p-2.5 rounded-xl shadow-sm", card.iconBg)}>
                    <Icon className={cn("h-4 w-4", card.iconColor)} />
                  </div>
                </CardHeader>
                <CardContent className="relative z-10">
                  <div className="text-2xl font-bold text-gray-900 dark:text-white">
                    {card.value}
                  </div>
                  <div className="flex items-center gap-1.5 mt-2">
                    <div className={cn(
                      "p-1 rounded-full",
                      card.trend === "0%" || card.trend === "No pending" || card.trend === "No active leases"
                        ? "bg-gray-100 dark:bg-gray-800"
                        : "bg-emerald-100 dark:bg-emerald-900/30"
                    )}>
                      <TrendIcon className={cn(
                        "h-3 w-3",
                        card.trendColor
                      )} />
                    </div>
                    <span className={cn("text-xs font-medium", card.trendColor)}>
                      {card.trend}
                    </span>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </motion.div>

      {/* Land Utilization Card - Enhanced with green theme */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6, duration: 0.5 }}
      >
        <Card className="relative overflow-hidden border-2 border-[#b7cf8a]/30 dark:border-[#b7cf8a]/20 hover:shadow-xl transition-all duration-300 bg-gradient-to-br from-white to-[#b7cf8a]/5 dark:from-gray-900 dark:to-[#b7cf8a]/5">
          {/* Decorative green gradient orbs */}
          <div className="absolute -top-20 -right-20 w-40 h-40 bg-[#b7cf8a]/20 rounded-full blur-3xl" />
          <div className="absolute -bottom-20 -left-20 w-40 h-40 bg-[#b7cf8a]/10 rounded-full blur-3xl" />
          
          <CardHeader className="pb-2 relative z-10">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium flex items-center gap-2 text-gray-700 dark:text-gray-300">
                <Activity className="w-4 h-4 text-[#b7cf8a]" />
                Land Utilization
              </CardTitle>
              <div className="flex items-center gap-2">
                <BadgeCheck className="w-4 h-4 text-[#b7cf8a]" />
                <Sparkles className="w-3 h-3 text-[#b7cf8a] animate-pulse" />
              </div>
            </div>
          </CardHeader>
          <CardContent className="relative z-10">
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <span className="text-xs text-gray-500 dark:text-gray-500">Leased Area</span>
                  <div className="flex items-baseline gap-1">
                    <span className="text-xl font-bold text-gray-900 dark:text-white">
                      {stats.leasedArea.toFixed(1)}
                    </span>
                    <span className="text-xs text-gray-500">acres</span>
                  </div>
                </div>
                <div className="space-y-1">
                  <span className="text-xs text-gray-500 dark:text-gray-500">Available Area</span>
                  <div className="flex items-baseline gap-1">
                    <span className="text-xl font-bold text-gray-900 dark:text-white">
                      {stats.availableArea.toFixed(1)}
                    </span>
                    <span className="text-xs text-gray-500">acres</span>
                  </div>
                </div>
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between text-xs">
                  <span className="text-gray-600 dark:text-gray-400">Utilization Rate</span>
                  <span className="font-medium text-[#b7cf8a]">{leasedPercentage.toFixed(1)}%</span>
                </div>
                <div className="relative h-2.5 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${leasedPercentage}%` }}
                    transition={{ duration: 1, delay: 0.8, ease: "easeOut" }}
                    className="absolute top-0 left-0 h-full bg-gradient-to-r from-[#b7cf8a] to-[#a9c87a] rounded-full"
                  />
                </div>
              </div>

              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1, duration: 0.5 }}
                className="flex items-center gap-2 mt-4 p-3 bg-[#b7cf8a]/10 rounded-lg border border-[#b7cf8a]/20"
              >
                <ArrowUpRight className="w-4 h-4 text-[#b7cf8a]" />
                <p className="text-xs text-gray-700 dark:text-gray-300">
                  {leasedPercentage > 70 
                    ? "✨ Excellent utilization! Your land is in high demand."
                    : leasedPercentage > 40
                    ? "📈 Good utilization. Consider promoting available land."
                    : "🌱 Low utilization. List more land to attract farmers."}
                </p>
              </motion.div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}