  // app/profile/[id]/_components/StatsBar.tsx
  "use client";

  import { motion } from "framer-motion";
  import { Package, TrendingUp, Star, Landmark, Clock, IndianRupeeIcon } from "lucide-react";
  import { ProfileStats } from "@/types/profile";

  interface Props {
    stats: ProfileStats;
  }

  interface StatCardProps {
    label: string;
    value: string | number;
    icon: React.ElementType;
    trend?: number;
    delay: number;
    subtext?: string;
  }

  function StatCard({ label, value, icon: Icon, trend, delay, subtext }: StatCardProps) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay }}
        className="group relative"
      >
        <div className="relative rounded-2xl border bg-card p-5 hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
          <div className="absolute top-4 right-4 text-muted-foreground/20 group-hover:text-primary/20 transition-colors">
            <Icon className="w-8 h-8" />
          </div>
          
          <div className="relative space-y-2">
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
              {label}
            </p>
            <p className="text-2xl font-bold tracking-tight">{value}</p>
            
            {subtext && (
              <p className="text-xs text-muted-foreground">{subtext}</p>
            )}
            
            {trend !== undefined && trend !== 0 && (
              <div className={`flex items-center gap-1 text-xs ${trend > 0 ? 'text-green-600' : 'text-red-600'}`}>
                <TrendingUp className={`w-3 h-3 ${trend < 0 ? 'rotate-180' : ''}`} />
                <span>{Math.abs(trend)}% from last month</span>
              </div>
            )}
          </div>
        </div>
      </motion.div>
    );
  }

  export function StatsBar({ stats }: Props) {
    const statsConfig = [
      { 
        label: "Total Listings", 
        value: stats.totalListings, 
        icon: Package, 
        trend: stats.listingsTrend,
        subtext: stats.activeListings !== undefined ? `${stats.activeListings} active` : undefined
      },
      { 
        label: "Active Leases", 
        value: stats.activeLeases, 
        icon: Landmark, 
        trend: stats.leasesTrend,
        subtext: stats.completedLeases ? `${stats.completedLeases} completed` : undefined
      },
      { 
        label: "Total Revenue", 
        value: `₹${stats.totalRevenue.toLocaleString()}`, 
        icon: IndianRupeeIcon, 
        trend: stats.revenueTrend,
        subtext: "Lifetime earnings"
      },
      { 
        label: "Rating", 
        value: stats.avgRating?.toFixed(1) ?? "New", 
        icon: Star,
        subtext: stats.totalReviews ? `${stats.totalReviews} reviews` : "No reviews yet"
      },
      { 
        label: "Response Rate", 
        value: stats.responseRate ? `${stats.responseRate}%` : "100%", 
        icon: Clock,
        trend: stats.responseTrend,
        subtext: "Avg. 2hr response"
      },
    ];

    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {statsConfig.map((stat, index) => (
          <StatCard key={stat.label} {...stat} delay={index * 0.1} />
        ))}
      </div>
    );
  }