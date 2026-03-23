"use client";

import { motion, Variants } from "framer-motion";
import {
  Leaf,
  Calendar,
  MapPin,
  Landmark,
  Droplets,
  Wheat,
  Sprout,
  Edit3,
  CheckCircle,
} from "lucide-react";

interface FarmerProfile {
  primaryCrops: string[];
  farmingExperience: number;
  requiredLandSize: number;
  leaseDuration: number;
  farmingType?: string;
  irrigationNeeded?: boolean;
  isVerified?: boolean;
}

interface ProfileCardProps {
  profile: FarmerProfile;
}

export function FarmerProfileCard({ profile }: ProfileCardProps) {
  const profileItems = [
    { icon: Wheat, label: "Primary Crops", value: profile.primaryCrops.join(", ") },
    { icon: Calendar, label: "Experience", value: `${profile.farmingExperience} years` },
    { icon: MapPin, label: "Required Land", value: `${profile.requiredLandSize} acres` },
    { icon: Landmark, label: "Lease Duration", value: `${profile.leaseDuration} months` },
    { icon: Sprout, label: "Farming Type", value: profile.farmingType || "Conventional" },
    { icon: Droplets, label: "Irrigation", value: profile.irrigationNeeded ? "Required" : "Not Required" },
  ];

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.05 } },
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 10 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { type: "spring", stiffness: 180, damping: 20 },
    },
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-3xl border border-black/10 dark:border-white/10 bg-white dark:bg-black p-8 shadow-sm"
    >
      {/* HEADER */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <div className="relative">
            <div className="w-14 h-14 rounded-2xl bg-black/5 dark:bg-white/10 flex items-center justify-center">
              <Leaf className="h-7 w-7" />
            </div>
            {profile.isVerified && (
              <div className="absolute -bottom-1 -right-1 bg-black dark:bg-white rounded-full p-1 border-2 border-white dark:border-black">
                <CheckCircle className="h-4 w-4 text-white dark:text-black" />
              </div>
            )}
          </div>

          <div>
            <h2 className="text-xl font-semibold tracking-tight">
              Farming Profile
            </h2>
            <p className="text-sm opacity-60">
              Profile details & requirements
            </p>
          </div>
        </div>

        <button className="flex items-center gap-2 px-4 h-10 rounded-full border border-black/10 dark:border-white/10 bg-black/[0.03] dark:bg-white/[0.05] hover:bg-black/[0.06] dark:hover:bg-white/[0.08] text-sm font-medium transition">
          <Edit3 className="h-4 w-4" />
          Edit
        </button>
      </div>

      {/* GRID */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 auto-rows-min"
      >
        {profileItems.map((item) => {
          const Icon = item.icon;

          return (
            <motion.div
              key={item.label}
              variants={itemVariants}
              whileHover={{ y: -3 }}
              className={`rounded-2xl border border-black/5 dark:border-white/10 bg-black/[0.02] dark:bg-white/[0.04] p-5 transition ${
                item.label === "Primary Crops" ? "lg:col-span-2" : ""
              }`}
            >
              <div className="flex items-start gap-4">
                <div className="p-3 rounded-xl bg-black/5 dark:bg-white/10">
                  <Icon className="h-5 w-5" />
                </div>

                <div className="flex-1">
                  <p className="text-xs opacity-50 mb-1">{item.label}</p>
                  <p className="font-medium leading-snug">{item.value}</p>
                </div>
              </div>
            </motion.div>
          );
        })}
      </motion.div>

      {/* PROFILE STRENGTH */}
      <div className="mt-8">
        <div className="flex justify-between text-sm mb-2">
          <span className="opacity-50">Profile Strength</span>
          <span className="font-medium">85%</span>
        </div>

        <div className="h-2 rounded-full bg-black/10 dark:bg-white/10 overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: "85%" }}
            transition={{ duration: 0.8 }}
            className="h-full bg-black dark:bg-white"
          />
        </div>

        <p className="text-xs opacity-50 mt-2">
          Add more details to improve matching accuracy
        </p>
      </div>
    </motion.div>
  );
}