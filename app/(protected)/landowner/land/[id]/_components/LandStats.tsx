"use client";

import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import {
  Ruler,
  Leaf,
  Droplets,
  Shield,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";

/* =========================
   STAT CARD
========================= */

interface StatCardProps {
  label: string;
  value: string;
  icon: React.ReactNode;
  trend?: number;
}

function StatCard({ label, value, icon, trend }: StatCardProps) {
  return (
    <motion.div
      whileHover={{ y: -8, scale: 1.04 }}
      transition={{ type: "spring", stiffness: 200, damping: 18 }}
    >
      <Card
        className={cn(
          "rounded-3xl border border-white/40 dark:border-white/10",
          "bg-white/80 dark:bg-gray-900/80",
          "backdrop-blur-xl shadow-xl hover:shadow-2xl",
          "transition-all duration-300"
        )}
      >
        <CardContent className="p-6 space-y-4">
          <div className="flex items-start justify-between">
            <div className="w-12 h-12 rounded-2xl bg-[#b7cf8a]/20 flex items-center justify-center text-[#7a9f45]">
              {icon}
            </div>

            {trend !== undefined && (
              <span
                className={cn(
                  "text-xs font-medium px-3 py-1 rounded-full",
                  trend >= 0
                    ? "text-emerald-600 bg-emerald-50"
                    : "text-red-600 bg-red-50"
                )}
              >
                {trend > 0 ? "+" : ""}
                {trend}%
              </span>
            )}
          </div>

          <div>
            <p className="text-sm text-gray-500">{label}</p>
            <h3 className="text-2xl font-bold tracking-tight text-gray-900 mt-1">
              {value}
            </h3>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

/* =========================
   🔄 SKELETON CARD
========================= */

function StatCardSkeleton() {
  return (
    <div
      className="
      rounded-3xl border border-white/40 dark:border-white/10
      bg-white/60 dark:bg-gray-900/60
      backdrop-blur-xl shadow-xl
      p-6 space-y-4
      animate-pulse
    "
    >
      {/* icon */}
      <div className="flex justify-between">
        <div className="w-12 h-12 rounded-2xl bg-muted/50" />
        <div className="h-6 w-12 rounded-full bg-muted/40" />
      </div>

      {/* text */}
      <div className="space-y-2">
        <div className="h-3 w-24 bg-muted/40 rounded" />
        <div className="h-6 w-32 bg-muted/50 rounded" />
      </div>
    </div>
  );
}

/* =========================
   MAIN COMPONENT
========================= */

interface LandStatsProps {
  size: number;
  soilType: string | null;
  waterSource: string | null;
  expectedRentMin: number | null;
  expectedRentMax: number | null;
}

export function LandStats({
  size,
  soilType,
  waterSource,
  expectedRentMin,
  expectedRentMax,
}: LandStatsProps) {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const t = setTimeout(() => setIsLoading(false), 900);
    return () => clearTimeout(t);
  }, []);

  const rentValue =
    expectedRentMin || expectedRentMax
      ? `₹${expectedRentMin?.toLocaleString() ?? 0} - ₹${expectedRentMax?.toLocaleString() ?? 0}`
      : "Negotiable";

  return (
    <div className="relative mt-6">

      {/* CAPSULE BG */}
      <div
        className="
        absolute inset-0 rounded-[70px]
        border border-[#b7cf8a]/20
        shadow-[0_18px_48px_rgba(0,0,0,0.10),0_6px_16px_rgba(0,0,0,0.06)]
        backdrop-blur-2xl
        bg-white/30 dark:bg-white/5
      "
      />

      <div className="relative z-10 px-6 md:px-10 py-10 md:py-12">

        {/* ================= LOADER ================= */}
        {isLoading ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <StatCardSkeleton key={i} />
            ))}
          </div>
        ) : (
          /* ================= REAL UI ================= */
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4"
          >
            <StatCard
              label="Land Size"
              value={`${size} acres`}
              icon={<Ruler className="h-5 w-5" />}
            />

            <StatCard
              label="Soil Type"
              value={soilType || "Not specified"}
              icon={<Leaf className="h-5 w-5" />}
            />

            <StatCard
              label="Water Source"
              value={waterSource || "Not specified"}
              icon={<Droplets className="h-5 w-5" />}
            />

            <StatCard
              label="Expected Rent"
              value={rentValue}
              icon={<Shield className="h-5 w-5" />}
            />
          </motion.div>
        )}
      </div>
    </div>
  );
}